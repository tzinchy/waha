// Карта игры — одна: Absolute Zero из Dawn of War / Ultimate Apocalypse (shared/map-zero.ts, tools/ua-map.mjs).
// Общая для симуляции (позиции) и клиента (рисование).
import { MAP_ZERO } from './map-zero.ts';

type Pt = [number, number];
type Rect = [number, number, number, number]; // x, y, w, h — непроходимые скалы
export type MapDef = {
  id: string; name: string; info: string; map: { w: number; h: number }; ground?: string; // ground — текстура земли из DoW (вид сверху), если карта перенесена из игры
  hq: number[][]; points: number[][]; relics: number[][]; vents: number[][];
  roads: Pt[][]; river: Pt[]; bridges: Pt[]; plateaus: Pt[][]; ruins: { walls: [number, number, number, number][]; pillars: Pt[] }[]; craters: [number, number, number][]; cover: [number, number, number][]; blocks: Rect[];
};
export const MAPS: MapDef[] = [MAP_ZERO];
/** Карты, которые видят игроки. */
export const PLAY_MAPS = [0];
export let MAP = MAPS[0].map, HQ_POS = MAPS[0].hq, POINTS = MAPS[0].points, RELICS = MAPS[0].relics, VENTS = MAPS[0].vents;
export let ROADS = MAPS[0].roads, RIVER = MAPS[0].river, BRIDGES = MAPS[0].bridges, PLATEAUS = MAPS[0].plateaus, RUINS = MAPS[0].ruins, CRATERS = MAPS[0].craters, COVER = MAPS[0].cover;
export let BLOCKS: Rect[] = MAPS[0].blocks;
export let GROUND: string | undefined = MAPS[0].ground;
export let MAP_ID = 0;
export function setMap(i: number) {
  const m = MAPS[i] ?? MAPS[0];
  MAP_ID = MAPS.indexOf(m);
  GROUND = m.ground;
  ({ map: MAP, hq: HQ_POS, points: POINTS, relics: RELICS, vents: VENTS, roads: ROADS, river: RIVER, bridges: BRIDGES, plateaus: PLATEAUS, ruins: RUINS, craters: CRATERS, cover: COVER, blocks: BLOCKS } = m);
}
export const blocked = (x: number, y: number, pad = 0) => BLOCKS.some(([bx, by, bw, bh]) => x > bx - pad && x < bx + bw + pad && y > by - pad && y < by + bh + pad);
