// Рельеф карт DoW (`HMAP` из .sgb) — высота земли в метрах игры. Игровое поле — центр рельефа размером с IMPA (как вырезает paintDow);
// клетка рельефа VDAT·cell м DoW, единица высоты — VDAT·0.25 м DoW; всё ×DOW_M, как карта. Самая низкая точка поля — 0. Нет рельефа — плоско.
import { chunks, header } from './whm.ts';
import { DOW_M } from '../shared/sim.ts';

/** Подъём на экране за метр высоты — HEIGHT косоугольной камеры World3D. */
export const LIFT = 0.85;
let R: { hm: Uint8Array; hw: number; hh: number; k: number; x0: number; y0: number; hs: number; base: number } | null = null;

export function setRelief(sgb: ArrayBuffer | null) {
  R = null;
  if (!sgb) return;
  const v = header(sgb), at: Record<string, number> = {};
  chunks(v, 24, sgb.byteLength, (c) => { if (c.type === 'DATA') at[c.id] ??= c.start; });
  if (at.HMAP === undefined || at.VDAT === undefined || at.IMPA === undefined) return;
  const hw = v.getUint32(at.HMAP, true), hh = v.getUint32(at.HMAP + 4, true), hm = new Uint8Array(sgb, at.HMAP + 8, hw * hh);
  const cell = v.getFloat32(at.VDAT + 8, true), hs = v.getFloat32(at.VDAT + 16, true) * DOW_M;
  const pw = v.getUint32(at.IMPA, true) * v.getFloat32(at.IMPA + 8, true), ph = v.getUint32(at.IMPA + 4, true) * v.getFloat32(at.IMPA + 8, true);
  const x0 = ((hw - 1) * cell - pw) / 2 / cell, y0 = ((hh - 1) * cell - ph) / 2 / cell; // начало поля, клеток рельефа
  let base = 255;
  for (let j = Math.floor(y0); j <= Math.ceil(y0 + ph / cell); j++) for (let i = Math.floor(x0); i <= Math.ceil(x0 + pw / cell); i++) base = Math.min(base, hm[Math.min(hh - 1, j) * hw + Math.min(hw - 1, i)]);
  R = { hm, hw, hh, k: 1 / (cell * DOW_M), x0, y0, hs, base };
}
export const hasRelief = () => !!R;
/** Высота земли в точке карты (метры игры), билинейно по клеткам рельефа. */
export function groundH(x: number, y: number) {
  if (!R) return 0;
  const u = Math.min(R.hw - 1.001, Math.max(0, R.x0 + x * R.k)), w = Math.min(R.hh - 1.001, Math.max(0, R.y0 + y * R.k));
  const i = Math.floor(u), j = Math.floor(w), fu = u - i, fw = w - j, H = (a: number, b: number) => R!.hm[b * R!.hw + a];
  const h = (H(i, j) * (1 - fu) + H(i + 1, j) * fu) * (1 - fw) + (H(i, j + 1) * (1 - fu) + H(i + 1, j + 1) * fu) * fw;
  return (h - R.base) * R.hs;
}
/** Экранный y (в метрах карты) точки на земле: камера поднимает высоту на LIFT. */
export const lift = (x: number, y: number) => y - LIFT * groundH(x, y);
/** Обратно: точка земли под экранным (x, y) — луч косоугольной камеры пересекает рельеф. */
export function pick(x: number, sy: number) {
  let y = sy;
  for (let i = 0; i < 6; i++) y = sy + LIFT * groundH(x, y);
  return { x, y };
}
