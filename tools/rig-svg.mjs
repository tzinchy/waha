// Разметка частей тела у силуэтов без классов: ноги, корпус, руки, голова, плащ — по положению групп.
// Тогда штатные анимации дизайн-системы (lc-anim-walk/attack/…) двигают конечности, а не всю фигуру.
//   node tools/rig-svg.mjs [--write] file.svg …
import { readFileSync, writeFileSync } from 'node:fs';
const write = process.argv.includes('--write');
for (const file of process.argv.slice(2).filter(a => !a.startsWith('--'))) {
  const src = readFileSync(file, 'utf8');
  if (/class="(legL|legR|body)"/.test(src)) { console.log('уже размечен:', file); continue; }
  const start = src.indexOf('</defs>') + 7;
  // стек групп: позиция открывающего тега, глубина, точки
  const groups = []; const stack = [];
  const re = /<(\/?)(g|path|polygon|polyline|rect|circle|ellipse|line)\b([^>]*)>/g; re.lastIndex = start;
  let m;
  while ((m = re.exec(src))) {
    const [, close, tag, attrs] = m;
    if (tag === 'g' && close) { const g = stack.pop(); if (g) groups.push(g); continue; }
    if (close) continue;
    if (tag === 'g') { stack.push({ at: m.index, len: m[0].length, depth: stack.length, pts: [] }); continue; }
    const nums = (attrs.match(/\b(?:d|points)="([^"]*)"/)?.[1] ?? '').match(/-?\d+(?:\.\d+)?/g)?.map(Number) ?? [];
    const xy = [];
    for (let i = 0; i + 1 < nums.length; i += 2) xy.push([nums[i], nums[i + 1]]);
    const c = attrs.match(/\bc[xy]="([-\d.]+)"/g); if (c?.length === 2) xy.push([+c[0].split('"')[1], +c[1].split('"')[1]]);
    for (const g of stack) g.pts.push(...xy);
  }
  // берём уровень, на котором больше всего групп (части тела) и считаем рамки
  const H = g => { const ys = g.pts.map(p => p[1]).filter(v => v > -20 && v < 220); return ys.length ? Math.max(...ys) - Math.min(...ys) : 0; };
  const byDepth = {}; for (const g of groups) (byDepth[g.depth] ??= []).push(g);
  // уровень частей тела: больше всего групп, и хотя бы три из них — не во весь рост (обёртки фигуры пропускаем)
  const level = Object.values(byDepth).filter(l => l.filter(g => H(g) > 0 && H(g) < 110).length >= 3).sort((a, b) => b.length - a.length)[0] ?? [];
  const tags = [];
  level.sort((a, b) => a.at - b.at).forEach((g, i) => {
    if (!g.pts.length) return;
    const xs = g.pts.map(p => p[0]).filter(v => v > -20 && v < 220), ys = g.pts.map(p => p[1]).filter(v => v > -20 && v < 220);
    const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys), cx = (x0 + x1) / 2, cy = (y0 + y1) / 2, w = x1 - x0, h = y1 - y0;
    let cls = '', origin = '';
    if (h >= 130) return; // обёртка всей фигуры
    if (i === 0 && h > 50 && w > 25) cls = 'cape';                                                // первая крупная — плащ/крылья за спиной
    else if (y0 >= 98 && w < 25) { cls = cx < 60 ? 'legL' : 'legR'; origin = `${Math.round(cx)}px ${Math.round(y0)}px`; } // узкие внизу — ноги, шарнир в бедре
    else if (i > 0 && y0 >= 30 && h < 80 && (x1 > 92 || x0 < 28) && w < 90) { cls = 'arm'; origin = `${Math.round(x1 > 92 ? x0 + 8 : x1 - 8)}px ${Math.round(y0 + 4)}px`; } // торчит за корпус — рука с оружием, шарнир в плече
    else if (cy > 50 && cy < 112 && w >= 18 && !tags.some(t => t.cls === 'body')) cls = 'body';
    if (cls) tags.push({ g, cls, origin });
    console.log(file.split('/').pop(), i, cls || '—', `x ${x0}–${x1} y ${y0}–${y1}`);
  });
  if (!write) continue;
  let out = src;
  for (const { g, cls, origin } of tags.sort((a, b) => b.g.at - a.g.at)) out = out.slice(0, g.at) + `<g class="${cls}"${origin ? ` style="transform-origin:${origin}"` : ''}` + out.slice(g.at + 2);
  writeFileSync(file, out);
}
