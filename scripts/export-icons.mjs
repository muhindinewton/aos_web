// Exports every Lucide icon the app actually uses as standalone SVG files
// into design-assets/icons/, with a browsable preview sheet and the Lucide
// license. Rerun after adding icons: node scripts/export-icons.mjs
//
// Icons are RENDERED FROM lucide-react — the same package, and therefore the
// same version, the app renders with. An earlier version of this script copied
// from lucide-static instead; the two sit on different release lines
// (react 0.294 vs static 1.25) and Lucide redrew a lot of icons between them,
// so 127 of the 217 exported files were shapes the app never displays (Bell,
// Bookmark, Briefcase, Calendar and Activity were all visibly different).
// Rendering from the app's own dependency keeps the export exact by
// construction — verify with scripts/verify-icons.mjs.

import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync, copyFileSync, rmSync } from 'node:fs';
import path from 'node:path';
import { renderToStaticMarkup } from 'react-dom/server';
import { createElement } from 'react';
import * as lucide from 'lucide-react';

const APP = path.resolve('app');
const OUT = path.resolve('design-assets/icons');

// Names whose kebab file name differs from the mechanical conversion.
const SPECIAL = {
  Grid3X3: 'grid-3x3',
  Grid3x3: 'grid-3x3',
  ImageIcon: 'image',
};

// PascalCase → kebab file name: MessageCircle → message-circle,
// ChevronsUpDown → chevrons-up-down.
const kebab = name =>
  SPECIAL[name] ??
  name
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
    .replace(/([a-zA-Z])(\d)/g, '$1-$2')
    .toLowerCase();

// app/account/wishlist/page.tsx → "/account/wishlist"
// app/components/product-card.tsx → "ProductCard" (component)
// Dynamic segments stay in brackets, matching how the routes are written.
function screenLabel(file) {
  const rel = path.relative(APP, file).replace(/\\/g, '/');
  if (rel.endsWith('/page.tsx') || rel === 'page.tsx') {
    const route = '/' + rel.replace(/\/?page\.tsx$/, '');
    return { label: route === '/' ? '/ (home)' : route, kind: 'route' };
  }
  if (rel.endsWith('/layout.tsx') || rel === 'layout.tsx') {
    const scope = rel.replace(/\/?layout\.tsx$/, '');
    return { label: `${scope || 'root'} layout`, kind: 'layout' };
  }
  // Next's root-level special files render app-wide, not at a route.
  const SPECIAL_FILES = {
    'error.tsx': 'error boundary',
    'global-error.tsx': 'global error',
    'loading.tsx': 'loading state',
    'not-found.tsx': '404 page',
  };
  if (SPECIAL_FILES[rel]) return { label: SPECIAL_FILES[rel], kind: 'special' };

  const base = path.basename(rel, path.extname(rel));
  const pascalName = base.replace(/(^|-)([a-z0-9])/g, (_, __, c) => c.toUpperCase());
  const dir = rel.split('/')[0];
  return { label: pascalName, kind: dir === 'components' ? 'component' : dir };
}

// Walk app/, recording for each icon identifier every file that uses it and how
// many times. Counts identifier occurrences with the import statements stripped,
// so icons referenced indirectly — icon maps like `{ Vehicles: Car }` or
// `icon={Home}` props — are counted too, not just `<Car />` JSX.
//
// Only files that actually import the icon are searched, which keeps prose out
// of the count: `'Green Mic'` in sell/video's mock track list is not a Mic icon,
// and that file imports no Mic. The residual imprecision is a file that both
// imports an icon and mentions its name in a string — the counts are a rough
// weighting, the file list is the reliable part.
function collectUsage(dir, usage = new Map()) {
  for (const entry of readdirSync(dir)) {
    const p = path.join(dir, entry);
    if (statSync(p).isDirectory()) { collectUsage(p, usage); continue; }
    if (!/\.(tsx|ts)$/.test(entry)) continue;
    const src = readFileSync(p, 'utf8');

    const names = [];
    const importRe = /import\s*\{([^}]+)\}\s*from\s*'lucide-react'/g;
    let m;
    while ((m = importRe.exec(src))) {
      for (const raw of m[1].split(',')) {
        const token = raw.trim();
        if (!token) continue;
        // `Image as ImageIcon` → the icon is `Image`, referenced as `ImageIcon`.
        const [original, alias] = token.replace(/^type\s+/, '').split(/\s+as\s+/).map(s => s.trim());
        if (original && original !== 'LucideIcon') names.push({ original, local: alias || original });
      }
    }
    if (!names.length) continue;

    const body = src.replace(importRe, '');
    for (const { original, local } of names) {
      const hits = (body.match(new RegExp(`\\b${local}\\b`, 'g')) || []).length;
      if (!usage.has(original)) usage.set(original, { total: 0, sites: [] });
      const rec = usage.get(original);
      rec.total += hits;
      if (hits > 0) rec.sites.push({ ...screenLabel(p), count: hits });
    }
  }
  return usage;
}

const VERSION = JSON.parse(
  readFileSync(path.resolve('node_modules/lucide-react/package.json'), 'utf8'),
).version;

// One shape per line, self-closing, no trailing space in the class attribute.
// Purely cosmetic — the geometry is whatever lucide-react emitted.
function pretty(svg, name) {
  const open = svg
    .match(/^<svg[^>]*>/)[0]
    .replace(/\s*class="[^"]*"/, ` class="lucide lucide-${kebab(name)}"`);
  const shapes = svg
    .replace(/^<svg[^>]*>/, '')
    .replace(/<\/svg>$/, '')
    .replace(/><\/(path|circle|rect|line|polyline|polygon|ellipse)>/g, '/>')
    .replace(/></g, '>\n  <')
    .trim();
  return `<!-- @license lucide-react v${VERSION} - ISC -->\n${open}\n  ${shapes}\n</svg>\n`;
}

const usage = collectUsage(APP);
const names = [...usage.keys()].sort();

// Wipe first: the export used to only ever add, so icons dropped from the app
// lingered as orphans that no longer matched anything on screen.
rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

const copied = [];
const missing = [];
for (const name of names) {
  const Icon = lucide[name];
  if (!Icon) { missing.push(name); continue; }
  const file = `${kebab(name)}.svg`;
  writeFileSync(path.join(OUT, file), pretty(renderToStaticMarkup(createElement(Icon, { size: 24 })), name));
  const u = usage.get(name);
  // Busiest screens first, so the card leads with where you'd actually meet it.
  const sites = [...u.sites].sort((a, b) => b.count - a.count);
  copied.push({ name, file, total: u.total, sites });
}

// License (Lucide is ISC — redistribution requires the notice).
copyFileSync(path.resolve('node_modules/lucide-react/LICENSE'), path.join(OUT, 'LICENSE.txt'));

// Preview sheet. Each card carries its usage sites, so the set is readable as
// "where does this icon appear" rather than just a wall of glyphs.
const MAX_SHOWN = 4;
const cells = copied
  .map(({ name, file, total, sites }) => {
    const shown = sites.slice(0, MAX_SHOWN)
      .map(s => `<li class="k-${s.kind}">${s.label}${s.count > 1 ? `<b>×${s.count}</b>` : ''}</li>`)
      .join('');
    const rest = sites.length > MAX_SHOWN ? `<li class="more">+${sites.length - MAX_SHOWN} more</li>` : '';
    // data-* powers the client-side filter below.
    return `<figure data-name="${name.toLowerCase()}" data-file="${file}" data-where="${sites.map(s => s.label).join(' ').toLowerCase()}">
  <img src="${file}" alt="${name}" width="28" height="28">
  <figcaption>${name}<span>${file}</span></figcaption>
  <ul class="where">${shown}${rest}</ul>
  <em class="uses">${total} use${total === 1 ? '' : 's'} · ${sites.length} file${sites.length === 1 ? '' : 's'}</em>
</figure>`;
  })
  .join('\n');

writeFileSync(
  path.join(OUT, 'index.html'),
  `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>AOS Web — Icon Set (${copied.length})</title>
<style>
:root{--primary:#C1121F;--text:#1A1A1A;--sub:#8A8A8A;--bg:#FAFAFA;--surface:#fff;--border:#E8E8E8}
@media(prefers-color-scheme:dark){:root{--primary:#FF7A85;--text:#fff;--sub:#8A8A8A;--bg:#0B0B0B;--surface:#151515;--border:#2A2A2A}
img{filter:invert(1)}
/* The light-mode chip tints are near-invisible on the dark surface. */
.where li{background:rgba(255,122,133,.14)!important}
.where li.k-component{background:rgba(90,170,255,.16)!important;color:#5AAAFF!important}
.where li.k-layout,.where li.k-providers,.where li.k-hooks,.where li.k-special{background:rgba(255,255,255,.10)!important;color:#B0B0B0!important}
.where li.more{background:transparent!important;color:var(--sub)!important}}
body{margin:0;font-family:Poppins,system-ui,sans-serif;background:var(--bg);color:var(--text);padding:36px 28px}
h1{font-size:22px;margin:0 0 4px}
p{color:var(--sub);font-size:13px;margin:0 0 26px;max-width:70ch}
main{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:10px}
figure{margin:0;background:var(--surface);border:1px solid var(--border);border-radius:12px;
  padding:16px 13px 13px;display:flex;flex-direction:column;align-items:center;gap:9px;text-align:center}
figcaption{font-size:12.5px;font-weight:600;word-break:break-all}
figcaption span{display:block;font-weight:400;font-size:10px;color:var(--sub);font-family:ui-monospace,monospace;margin-top:2px}
.where{list-style:none;margin:2px 0 0;padding:0;display:flex;flex-wrap:wrap;gap:4px;justify-content:center}
.where li{font-size:10.5px;font-family:ui-monospace,monospace;padding:2px 7px;border-radius:999px;
  background:rgba(193,18,31,.08);color:var(--primary);white-space:nowrap;max-width:100%;overflow:hidden;text-overflow:ellipsis}
.where li b{font-weight:600;opacity:.6;margin-left:3px}
.where li.k-component{background:rgba(20,120,200,.10);color:#1478C8}
.where li.k-layout,.where li.k-providers,.where li.k-hooks,.where li.k-special{background:rgba(120,120,120,.12);color:#6B6B6B}
.where li.more{background:transparent;color:var(--sub)}
.uses{font-size:10px;color:var(--sub);font-style:normal}
#q{width:100%;max-width:460px;padding:10px 14px;border:1px solid var(--border);border-radius:999px;
  background:var(--surface);color:var(--text);font-size:13px;outline:none;margin:0 0 20px}
#q:focus{border-color:var(--primary)}
#count{font-size:12px;color:var(--sub);margin:0 0 14px}
figure.hide{display:none}
</style></head><body>
<h1>AOS Web — Icon Set</h1>
<p>${copied.length} Lucide icons used across the app, exported as standalone SVGs (24×24 viewBox,
stroke-based, currentColor). Standard sizes in the app: 14–24px. Rendered from lucide-react
v${VERSION} — the exact package and version the app ships, so these are pixel-identical to what
users see. Each card lists the screens and components that use the icon: <span style="color:var(--primary)">red</span>
chips are routes, <span style="color:#1478C8">blue</span> are shared components, grey are layouts and providers.
License: ISC (see LICENSE.txt). Regenerate: <code>node scripts/export-icons.mjs</code>
then verify with <code>node scripts/verify-icons.mjs</code>.</p>
<input id="q" type="search" placeholder="Filter by icon name or screen — try &quot;wishlist&quot;, &quot;chat&quot;, &quot;ProductCard&quot;">
<p id="count"></p>
<main>
${cells}
</main>
<script>
const q = document.getElementById('q');
const cards = [...document.querySelectorAll('figure')];
const count = document.getElementById('count');
function apply() {
  const t = q.value.trim().toLowerCase();
  let n = 0;
  for (const c of cards) {
    const hit = !t || c.dataset.name.includes(t) || c.dataset.where.includes(t) || c.dataset.file.includes(t);
    c.classList.toggle('hide', !hit);
    if (hit) n++;
  }
  count.textContent = t ? n + ' of ' + cards.length + ' icons match "' + t + '"' : '';
}
q.addEventListener('input', apply);
</script>
</body></html>`,
);

console.log(`✓ ${copied.length} icons → ${OUT}`);
if (missing.length) console.log(`⚠ no SVG found for: ${missing.join(', ')}`);

// ── Brand assets ────────────────────────────────────────────────────────────
// The logo the app actually serves, plus the favicon/app-icon set generated
// from it by scripts/icons.mjs. Copied byte-for-byte from public/ rather than
// re-rendered, so these are the same files users load. public/logo_redone.png
// is deliberately excluded — nothing references it.
const BRAND = path.resolve('design-assets/brand');
rmSync(BRAND, { recursive: true, force: true });
mkdirSync(BRAND, { recursive: true });

const brandFiles = [
  ['public/aos-logo.png', 'aos-logo.png'],
  ['public/favicon.ico', 'favicon.ico'],
  ...readdirSync(path.resolve('public/icons')).map(f => [`public/icons/${f}`, f]),
];
for (const [src, name] of brandFiles) {
  copyFileSync(path.resolve(src), path.join(BRAND, name));
}
console.log(`✓ ${brandFiles.length} brand assets → ${BRAND}`);
