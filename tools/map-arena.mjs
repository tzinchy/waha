// Простая карта на двоих с понятными препятствиями (без земли DoW): центральная симметрия — стороны равны.
// Запуск: node tools/map-arena.mjs → shared/map-arena.ts. Скалы — прямоугольники (x, y, w, h) в метрах, кратные 2 (клетка построек BCELL).
import { writeFileSync } from 'node:fs';

const W = 384, H = 256, rot = ([x, y]) => [W - x, H - y], rotB = ([x, y, w, h]) => [W - x - w, H - y - h, w, h];
const half = {
  hq: [[48, 128]],
  points: [[112, 56], [112, 200]],                 // по две точки у базы; центр — критическая (ставится первой)
  relics: [[192, 22]],
  vents: [[76, 34]],
  blocks: [
    [136, 0, 24, 36],     // отрог у верхнего края
    [152, 64, 18, 40],    // гряда над центральной дорогой
    [92, 92, 12, 18],     // камни у дороги от базы
    [56, 214, 44, 14],    // гряда у нижнего края
    [184, 90, 16, 10],    // камень над критической точкой
    [0, 0, 20, 20],       // угол
  ],
};
const both = (k, f) => [...half[k], ...half[k].map(f)];
const out = {
  id: 'arena', name: 'Перевал', info: `${W}×${H} м, 2 игрока: три прохода к центру, 5 точек, 2 реликвии, 2 жилы`, map: { w: W, h: H },
  hq: both('hq', rot), points: [[W / 2, H / 2], ...both('points', rot)], relics: both('relics', rot), vents: both('vents', rot),
  roads: [[[48, 128], [192, 128], [336, 128]], [[48, 128], [112, 56]], [[48, 128], [112, 200]], [[336, 128], [272, 200]], [[336, 128], [272, 56]]],
  river: [], bridges: [], plateaus: [], ruins: [], craters: [[150, 150, 6], [234, 106, 6]], cover: [], blocks: both('blocks', rotB),
};
writeFileSync('shared/map-arena.ts', `// Сгенерировано tools/map-arena.mjs. Не править руками.\nimport type { MapDef } from './mapdata.ts';\nexport const MAP_ARENA: MapDef = ${JSON.stringify(out)};\n`);
console.log('ok', out.name, out.blocks.length, 'скал', out.points.length, 'точек');
