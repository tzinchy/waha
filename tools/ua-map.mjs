// Карта Dawn of War (.sgb) → shared/map-<id>.ts: точки, реликвии, жилы, старты и скалы (из карты проходимости) на своих местах.
// Запуск: node tools/ua-map.mjs <файл.sgb> <id> "<имя>" [масштаб=1.5]. Карты лежат в модах в ua/ (в git и сборку не попадают — попадает только разметка).
import { readFileSync, writeFileSync } from 'node:fs';

const [file, id, name, k = '1.5'] = process.argv.slice(2);
if (!file || !id || !name) throw new Error('node tools/ua-map.mjs <файл.sgb> <id> "<имя>" [масштаб]');
const K = Number(k), b = readFileSync(file), chunks = {};
(function walk(o, end) {
  while (o < end) {
    const type = b.toString('latin1', o, o + 4), cid = b.toString('latin1', o + 4, o + 8), size = b.readUInt32LE(o + 12), d = o + 20 + b.readUInt32LE(o + 16);
    if (type === 'FOLD') walk(d, d + size); else (chunks[cid] ??= []).push(d);
    o = d + size;
  }
})(24, b.length);

// типы объектов и сами объекты: номер типа, матрица поворота 3×3, позиция x, y (высота), z
let p = chunks.EBPT[0];
const types = Array.from({ length: b.readUInt32LE(p) }, () => 0), str = () => { const n = b.readUInt32LE(p); p += 4; const s = b.toString('latin1', p, p + n); p += n; return s; };
p += 4;
for (let i = 0; i < types.length; i++) types[i] = str().replace(/^.*\\|\.rgd$/g, '');
const ents = chunks.ENTI.map((d) => ({ type: types[b.readUInt32LE(d + 4)], x: b.readFloatLE(d + 44), z: b.readFloatLE(d + 52) }));

// проходимость: сетка n×n клеток по cell м; 7 — непроходимо
// сетка не обязательно квадратная (Absolute Zero — 256×128 клеток, 512×256 м)
const ip = chunks.IMPA[0], nx = b.readUInt32LE(ip), ny = b.readUInt32LE(ip + 4), cell = b.readFloatLE(ip + 8), grid = b.subarray(ip + 12, ip + 12 + nx * ny);
const hx = (nx * cell) / 2, hz = (ny * cell) / 2;
const P = (x, z) => [Math.round((x + hx) * K), Math.round((z + hz) * K)];
const of = (t) => ents.filter((e) => e.type === t).map((e) => P(e.x, e.z));
const hq = of('starting_position'), relics = of('relic_struct'), vents = of('slag_deposit');
const mx = hx * K, mz = hz * K, key = of('strategic_objective_struct').concat(of('critical_point_flag')); // ключевая точка (Critical Location) — [0]; нет в карте — ближняя к центру
const points = [...key, ...of('strategic_point_flag').sort((a, c) => Math.hypot(a[0] - mx, a[1] - mz) - Math.hypot(c[0] - mx, c[1] - mz))];
// скалы: склеиваем непроходимые клетки в прямоугольники (по строкам, затем одинаковые полосы — вниз)
const wall = (x, y) => grid[y * nx + x] === 7, used = new Uint8Array(nx * ny), blocks = [];
for (let y = 0; y < ny; y++) for (let x = 0; x < nx; x++) {
  if (!wall(x, y) || used[y * nx + x]) continue;
  let w = 1; while (x + w < nx && wall(x + w, y) && !used[y * nx + x + w]) w++;
  let h = 1; while (y + h < ny && [...Array(w).keys()].every((i) => wall(x + i, y + h) && !used[(y + h) * nx + x + i])) h++;
  for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) used[(y + j) * nx + x + i] = 1;
  blocks.push([Math.round(x * cell * K), Math.round(y * cell * K), Math.round(w * cell * K), Math.round(h * cell * K)]);
}
const W = Math.round(nx * cell * K), H = Math.round(ny * cell * K);
const def = {
  id, name, info: `${W}×${H} м, ${hq.length} игрока: карта Dawn of War, ${points.length} точек, ${relics.length} реликвии${vents.length ? `, ${vents.length} жилы` : ''}`,
  map: { w: W, h: H }, ground: '/' + file.replace(/\.sgb$/i, '.tga').replace(/^\/?/, ''), // вид сверху из DoW — земля карты (только в разработке, где /ua/ отдаётся)
  hq, points, relics, vents, roads: [], river: [], bridges: [], plateaus: [], ruins: [], craters: [], cover: [], blocks,
};
writeFileSync(`shared/map-${id}.ts`, `// Сгенерировано tools/ua-map.mjs из ${file.replace(/^.*\//, '')}. Не править руками.\nimport type { MapDef } from './mapdata.ts';\nexport const MAP_${id.toUpperCase()}: MapDef = ${JSON.stringify(def)};\n`);
console.log('ok', id, W + '×' + H + 'м', hq.length, 'старта,', points.length, 'точек,', relics.length, 'реликвий,', vents.length, 'жил,', blocks.length, 'скал');
