// Compares every design-assets/icons/*.svg against what lucide-react (the
// package the app actually renders with) produces for the same icon.
//
// Compares GEOMETRY only: the ordered list of shape elements and their
// geometric attributes. Formatting (self-closing tags, indentation, attribute
// order, the license comment) is deliberately ignored.
import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { renderToStaticMarkup } from 'react-dom/server';
import { createElement } from 'react';
import * as lucide from 'lucide-react';

const OUT = path.resolve('design-assets/icons');
const GEO = ['d', 'cx', 'cy', 'r', 'rx', 'ry', 'x', 'y', 'x1', 'y1', 'x2', 'y2', 'width', 'height', 'points'];

// → "circle cx=12 cy=12 r=10|path d=m6 9 6 6 6-6"
function geometry(svg) {
  const inner = svg.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>[\s\S]*$/, '');
  const els = [...inner.matchAll(/<(path|circle|rect|line|polyline|polygon|ellipse)\b([^>]*?)\/?>/g)];
  return els
    .map(([, tag, attrs]) => {
      const pairs = [...attrs.matchAll(/([a-zA-Z0-9:-]+)\s*=\s*"([^"]*)"/g)]
        .filter(([, k]) => GEO.includes(k))
        .map(([, k, v]) => `${k}=${v.replace(/\s+/g, ' ').trim()}`)
        .sort();
      return `${tag} ${pairs.join(' ')}`;
    })
    .join('|');
}

const pascal = file =>
  file.replace(/\.svg$/, '').replace(/(^|-)([a-z0-9])/g, (_, __, c) => c.toUpperCase());

const files = readdirSync(OUT).filter(f => f.endsWith('.svg')).sort();
const same = [], diff = [], noComponent = [];

for (const file of files) {
  const onDisk = readFileSync(path.join(OUT, file), 'utf8');
  const base = pascal(file);
  const candidates = [base, base.replace(/(\d)X(\d)/, '$1x$2'), base.replace(/(\d)x(\d)/, '$1X$2')];
  const key = candidates.find(c => lucide[c]);
  if (!key) { noComponent.push(file); continue; }

  const rendered = renderToStaticMarkup(createElement(lucide[key], { size: 24 }));
  const a = geometry(onDisk), b = geometry(rendered);
  if (a === b) same.push(file);
  else diff.push({ file, key, disk: a, app: b });
}

console.log(`identical geometry:        ${same.length}`);
console.log(`DIFFERENT geometry:        ${diff.length}`);
console.log(`no lucide-react component: ${noComponent.length}`);
for (const d of diff) {
  console.log(`\n✗ ${d.file}  (component ${d.key})`);
  console.log(`   design-assets: ${d.disk}`);
  console.log(`   app renders  : ${d.app}`);
}
if (noComponent.length) console.log('\nunresolved:', noComponent.join(', '));
