// Generates the favicon / app-icon set in public/icons/ from public/aos-logo.png.
// Icons composite the logo onto the brand's dark tile (#17181C) so the mark's
// white elements stay legible at every size, matching the in-app logo tiles.
//
// Usage: node scripts/icons.mjs

import puppeteer from 'puppeteer-core';
import { mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import path from 'node:path';

const OUT = path.resolve('public/icons');
const CHROME =
  process.env.CHROME_PATH ||
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

// size, filename, logo scale (1 = edge to edge), rounded corner radius ratio
const ICONS = [
  { size: 16,  name: 'favicon-16x16.png',        scale: 0.94 },
  { size: 32,  name: 'favicon-32x32.png',        scale: 0.94 },
  { size: 48,  name: 'favicon-48x48.png',        scale: 0.92 },
  { size: 180, name: 'apple-touch-icon.png',     scale: 0.86 },
  { size: 192, name: 'icon-192x192.png',         scale: 0.86 },
  { size: 512, name: 'icon-512x512.png',         scale: 0.86 },
  // Maskable: content inside the 80% safe zone so launchers can crop freely.
  { size: 512, name: 'icon-maskable-512x512.png', scale: 0.64 },
];

const logoB64 = readFileSync(path.resolve('public/aos-logo.png')).toString('base64');

async function main() {
  mkdirSync(OUT, { recursive: true });

  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: 'new',
    args: ['--no-sandbox', '--hide-scrollbars'],
  });
  const page = await browser.newPage();

  for (const { size, name, scale } of ICONS) {
    await page.setViewport({ width: size, height: size, deviceScaleFactor: 1 });
    await page.setContent(`<!doctype html><html><head><style>
      html,body{margin:0;width:${size}px;height:${size}px;background:#17181C;
        display:flex;align-items:center;justify-content:center;overflow:hidden}
      img{width:${Math.round(size * scale)}px;height:${Math.round(size * scale)}px;object-fit:contain}
    </style></head><body><img src="data:image/png;base64,${logoB64}"></body></html>`);
    await new Promise(r => setTimeout(r, 120));
    await page.screenshot({ path: path.join(OUT, name) });
    console.log(`  ✓ ${name}`);
  }
  await browser.close();

  // Pack 16/32/48 PNGs into favicon.ico (PNG-in-ICO, supported everywhere modern).
  const entries = ['favicon-16x16.png', 'favicon-32x32.png', 'favicon-48x48.png'].map(f => ({
    size: parseInt(f.match(/(\d+)x/)[1], 10),
    data: readFileSync(path.join(OUT, f)),
  }));
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(entries.length, 4);
  let offset = 6 + 16 * entries.length;
  const dirs = [];
  for (const e of entries) {
    const dir = Buffer.alloc(16);
    dir.writeUInt8(e.size === 256 ? 0 : e.size, 0); // width
    dir.writeUInt8(e.size === 256 ? 0 : e.size, 1); // height
    dir.writeUInt8(0, 2);  // palette
    dir.writeUInt8(0, 3);  // reserved
    dir.writeUInt16LE(1, 4);  // color planes
    dir.writeUInt16LE(32, 6); // bits per pixel
    dir.writeUInt32LE(e.data.length, 8);
    dir.writeUInt32LE(offset, 12);
    offset += e.data.length;
    dirs.push(dir);
  }
  const ico = Buffer.concat([header, ...dirs, ...entries.map(e => e.data)]);
  writeFileSync(path.join(OUT, 'favicon.ico'), ico);
  writeFileSync(path.resolve('public/favicon.ico'), ico);
  console.log('  ✓ favicon.ico (16+32+48, also copied to public/favicon.ico)');

  // Web app manifest wired to the set.
  const manifest = {
    name: 'AOS - Africa Online Space',
    short_name: 'AOS',
    description: 'Buy and sell anything in Africa',
    start_url: '/',
    display: 'standalone',
    background_color: '#17181C',
    theme_color: '#C1121F',
    icons: [
      { src: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
      { src: '/icons/icon-maskable-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
  writeFileSync(path.join(OUT, 'site.webmanifest'), JSON.stringify(manifest, null, 2));
  console.log('  ✓ site.webmanifest');
  console.log(`\nDone → ${OUT}`);
}

main().catch(err => { console.error(err); process.exit(1); });
