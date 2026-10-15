// Собирает client/ds/tokens.css из ds/project/tokens.json (дизайн-система «Латунный Собор») и копирует bundle.css и SVG.
// Запуск после каждой выгрузки системы: node tools/ds-tokens.mjs
import { readFileSync, writeFileSync, mkdirSync, cpSync } from 'node:fs';

const SRC = new URL('../ds/project/', import.meta.url);
const OUT = new URL('../client/public/ds/', import.meta.url);
const t = JSON.parse(readFileSync(new URL('tokens.json', SRC), 'utf8'));
const themes = t.color.themes.map(x => x.id), first = themes[0];
const val = (v, th) => (typeof v === 'string' ? v : v[th] ?? v[first]);
const ref = v => String(v).replace(/^\{(.+)\}$/, 'var(--$1)'); // алиас {name} -> var(--name)

const lines = [`/* ${t.name} — generated from tokens.json by tools/ds-tokens.mjs */`, ':root, [data-theme="' + first + '"] {'];
for (const c of t.color.tokens) lines.push(`  --${c.name}: ${ref(val(c.value, first))};`);
for (const [k, v] of Object.entries(t.type.families)) lines.push(`  --font-${k}: ${v};`);
for (const fam of ['spacing', 'radius', 'chamfer', 'stroke', 'shadow', 'opacity']) for (const x of t[fam]?.tokens ?? []) lines.push(`  --${x.name}: ${ref(val(x.value, first))};`);
lines.push('}');
for (const th of themes.slice(1)) {
  lines.push(`[data-theme="${th}"] {`);
  for (const c of t.color.tokens) if (typeof c.value === 'object' && c.value[th] !== undefined) lines.push(`  --${c.name}: ${ref(c.value[th])};`);
  lines.push('}');
}
mkdirSync(OUT, { recursive: true });
writeFileSync(new URL('tokens.css', OUT), lines.join('\n') + '\n');
cpSync(new URL('components/bundle.css', SRC), new URL('bundle.css', OUT));
cpSync(new URL('assets/', SRC), new URL('assets/', OUT), { recursive: true, filter: p => !p.endsWith('.md') });
console.log('tokens.css:', lines.length, 'строк, темы:', themes.join(', '));
