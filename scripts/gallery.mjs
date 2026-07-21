// Builds screenshots/index.html — a browsable contact sheet of every capture,
// so the screenshots folder can be handed to a developer like a design file.
// Run after scripts/screenshots.mjs (and optionally its THEME=dark pass).
//
// Usage: node scripts/gallery.mjs

import { readdirSync, existsSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve('screenshots');
const VIEWPORTS = ['mobile', 'tablet', 'desktop'];
const STATES = ['loading', 'empty', 'error'];

const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
const title = slug => slug.replace(/^\d+-/, '').replace(/-/g, ' ')
  .replace(/\b\w/g, c => c.toUpperCase());

// Union of slugs across viewports, in filename (numeric) order. `sub` reads the
// nested folders (flows/) the same way.
const slugsIn = (sub = '') => [...new Set(
  VIEWPORTS.flatMap(v => {
    const dir = path.join(ROOT, v, sub);
    return existsSync(dir)
      ? readdirSync(dir).filter(f => f.endsWith('.png')).map(f => f.replace('.png', ''))
      : [];
  }),
)].sort();

const slugs = slugsIn();
const flowSlugs = slugsIn('flows');

const rel = p => existsSync(path.join(ROOT, p)) ? p : null;

const cell = (slug, vp) => {
  const main = rel(`${vp}/${slug}.png`);
  if (!main) return `<figure class="shot missing"><figcaption>${vp}</figcaption><div class="none">—</div></figure>`;
  const links = [
    ['full', rel(`${vp}/full/${slug}.png`)],
    ...STATES.map(s => [s, rel(`${vp}/${s}/${slug}.png`)]),
    ['signed out', rel(`${vp}/signed-out/${slug}.png`)],
    ['dark', rel(`dark/${vp}/${slug}.png`)],
    ['dark full', rel(`dark/${vp}/full/${slug}.png`)],
  ].filter(([, p]) => p);
  return `<figure class="shot">
    <figcaption>${vp}</figcaption>
    <a href="${main}" target="_blank"><img src="${main}" loading="lazy" alt="${esc(title(slug))} — ${vp}"></a>
    ${links.length ? `<nav>${links.map(([label, p]) => `<a href="${p}" target="_blank">${label}</a>`).join('')}</nav>` : ''}
  </figure>`;
};

// Flows are viewport-gated by design — a desktop-only dropdown has no mobile
// shot — so missing cells are omitted rather than drawn as gaps.
const flowCell = (slug, vp) => {
  const main = rel(`${vp}/flows/${slug}.png`);
  if (!main) return '';
  const dark = rel(`dark/${vp}/flows/${slug}.png`);
  return `<figure class="shot">
    <figcaption>${vp}</figcaption>
    <a href="${main}" target="_blank"><img src="${main}" loading="lazy" alt="${esc(title(slug))} — ${vp}"></a>
    ${dark ? `<nav><a href="${dark}" target="_blank">dark</a></nav>` : ''}
  </figure>`;
};

const sections = slugs.map(slug => `
<section id="${slug}">
  <h2><span>${slug.slice(0, 2)}</span>${esc(title(slug))}</h2>
  <div class="row">${VIEWPORTS.map(v => cell(slug, v)).join('')}</div>
</section>`).join('');

const flowSections = flowSlugs.map(slug => `
<section id="${slug}">
  <h2><span>${slug.slice(0, 3)}</span>${esc(title(slug))}</h2>
  <div class="row">${VIEWPORTS.map(v => flowCell(slug, v)).join('')}</div>
</section>`).join('');

const toc = [
  ...slugs.map(s => `<a href="#${s}">${esc(title(s))}</a>`),
  ...flowSlugs.map(s => `<a href="#${s}">${esc(title(s))}</a>`),
].join('');

const html = `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>AOS Web — Screen Gallery</title>
<style>
:root{--primary:#C1121F;--text:#1A1A1A;--sub:#555;--muted:#8A8A8A;--bg:#FAFAFA;--surface:#fff;--border:#E8E8E8}
@media(prefers-color-scheme:dark){:root{--text:#fff;--sub:#B3B3B3;--muted:#666;--bg:#0B0B0B;--surface:#151515;--border:#2A2A2A}}
*{box-sizing:border-box}body{margin:0;font-family:Poppins,system-ui,sans-serif;background:var(--bg);color:var(--text)}
header{padding:34px 28px 10px;max-width:1500px;margin:0 auto}
h1{font-size:24px;margin:0 0 4px}header p{color:var(--sub);font-size:13px;margin:0;max-width:70ch}
.toc{position:sticky;top:0;background:var(--bg);z-index:10;display:flex;gap:4px;overflow-x:auto;padding:12px 28px;border-bottom:1px solid var(--border);max-width:1500px;margin:0 auto;scrollbar-width:none}
.toc::-webkit-scrollbar{display:none}
.toc a{flex:none;font-size:12px;color:var(--sub);text-decoration:none;padding:6px 12px;border-radius:999px;font-weight:500}
.toc a:hover{background:rgba(193,18,31,.10);color:var(--primary)}
main{max-width:1500px;margin:0 auto;padding:10px 28px 80px}
section{padding-top:30px}
h2{font-size:16px;margin:0 0 12px;display:flex;align-items:center;gap:10px}
h2 span{font-size:11px;font-weight:600;color:var(--primary);background:rgba(193,18,31,.10);border-radius:999px;padding:3px 9px}
.row{display:flex;gap:16px;flex-wrap:wrap;align-items:flex-start}
.shot{margin:0;background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:12px}
.shot figcaption{font-size:11px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--muted);margin-bottom:8px}
.shot img{display:block;max-height:400px;max-width:min(420px,80vw);width:auto;border-radius:8px;border:1px solid var(--border)}
.shot nav{display:flex;gap:6px;margin-top:9px;flex-wrap:wrap}
.shot nav a{font-size:11px;font-weight:500;color:var(--sub);text-decoration:none;border:1px solid var(--border);border-radius:999px;padding:3px 10px}
.shot nav a:hover{color:var(--primary);border-color:var(--primary)}
.none{width:120px;height:80px;display:grid;place-items:center;color:var(--muted)}
h1.group{font-size:19px;margin:56px 0 0;padding-top:22px;border-top:2px solid var(--border)}
h1.group:first-child{margin-top:8px;border-top:0;padding-top:0}
.groupnote{color:var(--sub);font-size:13px;margin:6px 0 0;max-width:70ch}
</style></head><body>
<header><h1>AOS Web — Screen Gallery</h1>
<p>Every screen at mobile (390) · tablet (820) · desktop (1440), light theme, signed in. Chips under each shot open the full-page capture, the loading / empty / error states, the signed-out rendering, and the dark-theme variant where captured. Click any image for full size. Regenerate: <code>node scripts/screenshots.mjs</code> then <code>node scripts/gallery.mjs</code>.</p></header>
<nav class="toc">${toc}</nav>
<main>
<h1 class="group">Screens</h1>${sections}
<h1 class="group">Interaction states</h1>
<p class="groupnote">Dropdowns, sheets, modals, tabs and multi-step forms — states a plain page load never reaches. Captured only at the viewports where the trigger exists, so a desktop-only menu shows one cell.</p>${flowSections}
</main>
</body></html>`;

writeFileSync(path.join(ROOT, 'index.html'), html);
console.log(`Gallery → screenshots/index.html (${slugs.length} screens)`);
