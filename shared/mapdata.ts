// Карты. «Разлом Святого Шпиля», 240×240 м (пресет MapExample): зеркальная по центру, точки, реликварии, жилы, рельеф.
// Общая для симуляции (позиции) и клиента (рисование).
const RIFT_MAP = { w: 240, h: 240 };
const RIFT_HQ_POS = [[30, 30], [210, 210], [210, 30], [30, 210]];
const RIFT_POINTS = [[120, 120], [120, 45], [120, 195], [45, 120], [195, 120], [75, 168], [165, 72]]; // [0] — критическая точка в центре
const RIFT_RELICS = [[69, 69], [171, 171]];
const RIFT_VENTS = [[66, 138], [174, 102], [93, 21], [147, 219], [24, 174], [216, 66]];

type Pt = [number, number];
/** Дороги-брусчатка: от баз к центру и точкам. */
const RIFT_ROADS: Pt[][] = [
  [[30, 30], [45, 60], [45, 120], [78, 123], [120, 120], [162, 117], [195, 120], [195, 180], [210, 210]],
  [[30, 30], [60, 45], [120, 45], [123, 78], [120, 120], [117, 162], [120, 195], [180, 195], [210, 210]],
  [[75, 168], [96, 144], [120, 120], [144, 96], [165, 72]],
  [[210, 30], [165, 72]], [[30, 210], [75, 168]],
];
/** Река с бродами-мостами. */
const RIFT_RIVER: Pt[] = [[156, 0], [147, 30], [162, 60], [141, 87], [120, 108], [99, 132], [78, 156], [93, 183], [84, 213], [90, 240]];
const RIFT_BRIDGES: Pt[] = [[130, 98], [110, 142], [152, 51], [87, 190]];
/** Плато (высоты): многоугольники. */
const RIFT_PLATEAUS: Pt[][] = [
  [[0, 144], [33, 138], [57, 156], [60, 192], [39, 240], [0, 240]],
  [[240, 96], [207, 102], [183, 84], [180, 48], [201, 0], [240, 0]],
  [[90, 78], [105, 69], [111, 87], [96, 93]], [[150, 162], [135, 171], [129, 153], [144, 147]],
];
/** Руины собора: стены (прямоугольники x,y,w,h) и колонны. */
const RIFT_RUINS: { walls: [number, number, number, number][]; pillars: Pt[] }[] = [
  { walls: [[51, 84, 22, 2], [51, 84, 2, 18], [75, 84, 2, 10], [51, 102, 10, 2]], pillars: [[57, 90], [69, 90], [57, 98], [69, 98]] },
  { walls: [[162, 153, 22, 2], [186, 138, 2, 15], [162, 135, 2, 10], [177, 135, 10, 2]], pillars: [[171, 144], [183, 144], [171, 148], [183, 148]] },
  { walls: [[105, 9, 2, 12], [105, 9, 15, 2], [132, 9, 2, 8]], pillars: [[114, 16], [126, 16]] },
  { walls: [[105, 228, 15, 2], [132, 219, 2, 12], [105, 222, 2, 8]], pillars: [[114, 224], [126, 224]] },
];
const RIFT_CRATERS: [number, number, number][] = [[96, 105, 5.0], [144, 135, 5.0], [60, 180, 3.8], [180, 60, 3.8], [144, 33, 3.8], [96, 207, 3.8], [36, 90, 3.1], [204, 150, 3.1], [129, 168, 2.5], [111, 72, 2.5]];
/** Лёгкие укрытия: заросли, обломки (пресет Cover). */
const RIFT_COVER: [number, number, number][] = [[87, 51, 6.2], [153, 189, 6.2], [51, 153, 5.0], [189, 87, 5.0], [108, 99, 3.8], [132, 141, 3.8]];

type Rect = [number, number, number, number]; // x, y, w, h — непроходимые скалы
export type MapDef = {
  id: string; name: string; info: string; map: { w: number; h: number };
  hq: number[][]; points: number[][]; relics: number[][]; vents: number[][];
  roads: Pt[][]; river: Pt[]; bridges: Pt[]; plateaus: Pt[][]; ruins: typeof RIFT_RUINS; craters: [number, number, number][]; cover: [number, number, number][]; blocks: Rect[];
};
/** Растянуть карту: позиции ×k, радиусы и размеры ×√k. */
function grow(m: MapDef, kx: number, ky = kx): MapDef {
  const P = (p: number[]) => [Math.round(p[0] * kx), Math.round(p[1] * ky)] as Pt, r = Math.sqrt((kx + ky) / 2);
  return { ...m, map: { w: Math.round(m.map.w * kx), h: Math.round(m.map.h * ky) }, hq: m.hq.map(P), points: m.points.map(P), relics: m.relics.map(P), vents: m.vents.map(P),
    roads: m.roads.map(l => l.map(P)), river: m.river.map(P), bridges: m.bridges.map(P), plateaus: m.plateaus.map(l => l.map(P)),
    ruins: m.ruins.map(z => ({ walls: z.walls.map(([x, y, w, h]) => [Math.round(x * kx), Math.round(y * ky), Math.round(w * r), Math.round(h * r)] as [number, number, number, number]), pillars: z.pillars.map(P) })),
    craters: m.craters.map(([x, y, c]) => [Math.round(x * kx), Math.round(y * ky), +(c * r).toFixed(1)] as [number, number, number]), cover: m.cover.map(([x, y, c]) => [Math.round(x * kx), Math.round(y * ky), +(c * r).toFixed(1)] as [number, number, number]),
    blocks: m.blocks.map(([x, y, w, h]) => [Math.round(x * kx), Math.round(y * ky), Math.round(w * kx), Math.round(h * ky)] as Rect) };
}
const BASE_MAPS: MapDef[] = [
  { id: 'rift', name: 'Разлом Святого Шпиля', info: '240×240 м, до 4 игроков: открытое поле, река, плато, 7 точек и 2 реликвария', map: RIFT_MAP,
    hq: RIFT_HQ_POS, points: RIFT_POINTS, relics: RIFT_RELICS, vents: RIFT_VENTS, roads: RIFT_ROADS, river: RIFT_RIVER, bridges: RIFT_BRIDGES,
    plateaus: RIFT_PLATEAUS, ruins: RIFT_RUINS, craters: RIFT_CRATERS, cover: RIFT_COVER, blocks: [] },
  { // Ущелье: два кармана-базы по краям, между ними один тоннель; в каждом кармане по 2 реликвария и жила под генератор
    id: 'gorge', name: 'Ущелье Пепла', info: '280×120 м, 1×1: два кармана и единый тоннель; в каждом кармане 2 реликвария и жила', map: { w: 280, h: 120 },
    hq: [[22, 60], [258, 60]],
    points: [[140, 60], [100, 60], [180, 60]],                       // [0] — критическая в середине тоннеля
    relics: [[34, 22], [34, 98], [246, 22], [246, 98]],
    vents: [[58, 60], [222, 60]],
    roads: [[[22, 60], [258, 60]]], river: [], bridges: [],
    plateaus: [], craters: [[120, 56, 3], [160, 64, 3], [70, 40, 2.5], [210, 80, 2.5]], cover: [[100, 52, 3], [180, 68, 3], [140, 70, 2.5]],
    ruins: [{ walls: [[118, 46, 10, 2], [152, 72, 10, 2]], pillars: [[130, 50], [150, 70]] }],
    blocks: [[70, 0, 140, 46], [70, 74, 140, 46]] },                  // скалы над и под тоннелем (проход y 46–74)
];
export const MAPS: MapDef[] = [grow(BASE_MAPS[0], 4 / 3), grow(BASE_MAPS[1], 9 / 7, 1.25)].map(m => ({ ...m, info: m.info.replace(/^\d+×\d+ м/, `${m.map.w}×${m.map.h} м`) })); // карты крупнее: 320×320 и 360×150
/** Текущая карта. ponytail: общая на процесс; сервер выставляет её перед каждым шагом своего лобби (расчёт синхронный). Поле State, если появится асинхронность. */
export let MAP = MAPS[0].map, HQ_POS = MAPS[0].hq, POINTS = MAPS[0].points, RELICS = MAPS[0].relics, VENTS = MAPS[0].vents;
export let ROADS = MAPS[0].roads, RIVER = MAPS[0].river, BRIDGES = MAPS[0].bridges, PLATEAUS = MAPS[0].plateaus, RUINS = MAPS[0].ruins, CRATERS = MAPS[0].craters, COVER = MAPS[0].cover;
export let BLOCKS: Rect[] = [];
export let MAP_ID = 0;
export function setMap(i: number) {
  const m = MAPS[i] ?? MAPS[0];
  MAP_ID = MAPS.indexOf(m);
  ({ map: MAP, hq: HQ_POS, points: POINTS, relics: RELICS, vents: VENTS, roads: ROADS, river: RIVER, bridges: BRIDGES, plateaus: PLATEAUS, ruins: RUINS, craters: CRATERS, cover: COVER, blocks: BLOCKS } = m);
}
export const blocked = (x: number, y: number, pad = 0) => BLOCKS.some(([bx, by, bw, bh]) => x > bx - pad && x < bx + bw + pad && y > by - pad && y < by + bh + pad);
