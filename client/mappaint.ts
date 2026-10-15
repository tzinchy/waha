// Текстура карты: рисуется один раз в половинном разрешении и растягивается без сглаживания — получается пиксель-арт.
import { BLOCKS, BRIDGES, COVER, CRATERS, HQ_POS, MAP, PLATEAUS, POINTS, RELICS, RIVER, ROADS, RUINS, VENTS } from '../shared/mapdata.ts';

export const TEX = 13; // текселей на метр на небольших картах (S = 26 px → тексель 2×2 px); крупные — вдвое грубее
type C = CanvasRenderingContext2D;
type Pt = [number, number];

function rng(seed: number) { return () => ((seed = (seed * 16807) % 2147483647) / 2147483647); }
/** Сглаженный шум значений: несколько октав. */
function noiseField(w: number, h: number, cell: number, seed: number) {
  const r = rng(seed), gw = Math.ceil(w / cell) + 2, gh = Math.ceil(h / cell) + 2, g = new Float32Array(gw * gh).map(() => r());
  return (x: number, y: number) => {
    const fx = x / cell, fy = y / cell, ix = Math.floor(fx), iy = Math.floor(fy), tx = fx - ix, ty = fy - iy;
    const s = (t: number) => t * t * (3 - 2 * t), a = g[iy * gw + ix], b = g[iy * gw + ix + 1], c = g[(iy + 1) * gw + ix], d = g[(iy + 1) * gw + ix + 1];
    return a + (b - a) * s(tx) + (c - a) * s(ty) + (a - b - c + d) * s(tx) * s(ty);
  };
}
const hex = (h: string) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];

export function paintMap(): HTMLCanvasElement {
  const T = MAP.w * MAP.h > 260 * 260 ? TEX / 2 : TEX; // большие карты: тексель 4×4 px, чтобы текстура не съела память
  const W = Math.round(MAP.w * T), H = Math.round(MAP.h * T), c = document.createElement('canvas');
  c.width = W; c.height = H;
  const x = c.getContext('2d')!, P = (v: number) => v * T, r = rng(7);
  // 1. Почва: шум трёх масштабов → пепельная земля, бурые пятна, сухая трава
  const n1 = noiseField(W, H, 90, 1), n2 = noiseField(W, H, 22, 2), n3 = noiseField(W, H, 6, 3);
  const soil = ['#1b1714', '#24201b', '#2e2822', '#3a3229', '#463c30'].map(hex), grass = ['#25231a', '#2e2c1f', '#383524'].map(hex); // выжженная трава: ближе к почве, без «камуфляжа»
  const img = x.createImageData(W, H), d = img.data;
  for (let y = 0; y < H; y++) for (let X = 0; X < W; X++) {
    const v = n1(X, y) * 0.55 + n2(X, y) * 0.3 + n3(X, y) * 0.15, bay = ((X & 1) * 2 + (y & 1)) / 4 - 0.375;
    const g = n2(X + 900, y + 400) * 0.7 + n3(X + 300, y) * 0.3 > 0.6;
    const pal = g ? grass : soil, k = Math.max(0, Math.min(pal.length - 1, Math.floor((v + bay * 0.12) * pal.length)));
    const [R, G, B] = pal[k], i = (y * W + X) * 4;
    d[i] = R; d[i + 1] = G; d[i + 2] = B; d[i + 3] = 255;
  }
  x.putImageData(img, 0, 0);
  // 2. Плато: светлый камень, обрыв-тень снизу, кромка
  for (const poly of PLATEAUS) {
    path(x, poly.map(([a, b]) => [P(a), P(b) + 10] as Pt)); x.fillStyle = '#0c0a09'; x.fill();               // тень обрыва
    path(x, poly.map(([a, b]) => [P(a), P(b)] as Pt));
    const g = x.createLinearGradient(0, P(Math.min(...poly.map(p => p[1]))), 0, P(Math.max(...poly.map(p => p[1]))));
    g.addColorStop(0, '#5a4f43'); g.addColorStop(1, '#3d352c'); x.fillStyle = g; x.fill();
    x.strokeStyle = '#7a6c5a'; x.lineWidth = 3; x.stroke();
    for (let i = 0; i < 60; i++) { const [a, b] = poly[i % poly.length]; x.fillStyle = r() > 0.5 ? '#2a241e' : '#6b5e4e'; x.fillRect(P(a) + (r() - 0.5) * 60, P(b) + (r() - 0.5) * 60, 3, 2); } // осыпь
  }
  // 3. Река: глубина, берег-грязь, блики
  stroke(x, RIVER, P, 7.5, '#2b241c'); stroke(x, RIVER, P, 6, '#0f1a1d'); stroke(x, RIVER, P, 4, '#15262a'); stroke(x, RIVER, P, 1.6, '#1c3338');
  for (let i = 0; i < (RIVER.length ? 260 : 0); i++) { const [a, b] = along(RIVER, r()); x.fillStyle = r() > 0.7 ? '#3e6168' : '#24414a'; x.fillRect(P(a) + (r() - 0.5) * 40, P(b) + (r() - 0.5) * 20, 6 + r() * 10, 1); }
  // 4. Дороги: подложка, брусчатка, раствор
  for (const road of ROADS) { stroke(x, road, P, 5, '#1d1915'); stroke(x, road, P, 4.2, '#3b342c'); }
  for (const road of ROADS) for (let i = 0; i < 1400; i++) {
    const [a, b] = along(road, r()), sx = P(a) + (r() - 0.5) * P(3.6), sy = P(b) + (r() - 0.5) * P(3.6);
    x.fillStyle = ['#5a5146', '#4d453b', '#665c4f', '#433c33'][(r() * 4) | 0]; x.fillRect(sx | 0, sy | 0, 5, 4);
    x.fillStyle = '#2a2520'; x.fillRect((sx | 0) + 5, sy | 0, 1, 4);
  }
  // 5. Мосты через реку: доски и перила
  for (const [a, b] of BRIDGES) {
    x.save(); x.translate(P(a), P(b)); x.rotate(-0.6);
    x.fillStyle = '#2a1f14'; x.fillRect(-P(5), -P(3), P(10), P(6));
    for (let i = -P(5); i < P(5); i += 6) { x.fillStyle = i % 12 ? '#5c4429' : '#6e5232'; x.fillRect(i, -P(2.6), 5, P(5.2)); }
    x.fillStyle = '#8a6a3a'; x.fillRect(-P(5), -P(3), P(10), 3); x.fillRect(-P(5), P(3) - 3, P(10), 3);
    x.restore();
  }
  // 6. Площади баз и платформы точек: плиты
  for (const [a, b] of HQ_POS) tiles(x, P(a), P(b), P(13), r, ['#3e3a35', '#46413b', '#36322d']);
  for (const [a, b] of [...POINTS, ...RELICS]) { tiles(x, P(a), P(b), P(6.5), r, ['#4a443c', '#524b42', '#3f3a33']); x.strokeStyle = '#7a6a48'; x.lineWidth = 3; x.beginPath(); x.arc(P(a), P(b), P(6.5), 0, Math.PI * 2); x.stroke(); }
  // 7. Воронки
  for (const [a, b, rad] of CRATERS) {
    const g = x.createRadialGradient(P(a), P(b), 2, P(a), P(b), P(rad));
    g.addColorStop(0, '#0a0807'); g.addColorStop(0.6, '#1a1511'); g.addColorStop(0.85, '#4a3f33'); g.addColorStop(1, 'rgba(74,63,51,0)');
    x.fillStyle = g; x.beginPath(); x.arc(P(a), P(b), P(rad), 0, Math.PI * 2); x.fill();
  }
  // 8. Заросли-укрытия: кусты сухой травы
  for (const [a, b, rad] of COVER) for (let i = 0; i < rad * 40; i++) {
    const ang = r() * Math.PI * 2, dd = Math.sqrt(r()) * P(rad), px = P(a) + Math.cos(ang) * dd, py = P(b) + Math.sin(ang) * dd;
    x.fillStyle = ['#3e4022', '#4c4e2a', '#2b2c18', '#5b5a31'][(r() * 4) | 0]; x.fillRect(px | 0, (py | 0) - 4, 2, 5); x.fillRect((px | 0) + 2, (py | 0) - 2, 2, 3);
  }
  // 9. Руины собора: стены из блоков, колонны, щебень
  for (const ruin of RUINS) {
    for (const [a, b, w, h] of ruin.walls) {
      x.fillStyle = '#0d0b09'; x.fillRect(P(a) + 4, P(b) + 6, P(w), P(h));
      for (let yy = 0; yy < P(h); yy += 6) for (let xx = 0; xx < P(w); xx += 10) { if (r() < 0.12) continue; x.fillStyle = ['#6b6152', '#5c5446', '#7a6f5e'][(r() * 3) | 0]; x.fillRect(P(a) + xx + ((yy / 6) % 2) * 5, P(b) + yy, 9, 5); }
    }
    for (const [a, b] of ruin.pillars) { x.fillStyle = '#0d0b09'; x.beginPath(); x.ellipse(P(a) + 4, P(b) + 6, 12, 8, 0, 0, 7); x.fill(); x.fillStyle = '#7d7262'; x.beginPath(); x.arc(P(a), P(b), 11, 0, 7); x.fill(); x.fillStyle = '#9a8e7a'; x.beginPath(); x.arc(P(a) - 3, P(b) - 3, 5, 0, 7); x.fill(); }
    const [a0, b0] = ruin.pillars[0];
    for (let i = 0; i < 120; i++) { x.fillStyle = r() > 0.5 ? '#5c5446' : '#3a342b'; x.fillRect(P(a0) + (r() - 0.3) * P(14), P(b0) + (r() - 0.3) * P(10), 2 + r() * 3, 2); }
  }
  // 10. Жилы: светящиеся трещины
  for (const [a, b] of VENTS) {
    const g = x.createRadialGradient(P(a), P(b), 2, P(a), P(b), P(4));
    g.addColorStop(0, 'rgba(240,165,64,0.55)'); g.addColorStop(1, 'rgba(240,165,64,0)'); x.fillStyle = g; x.fillRect(P(a - 4), P(b - 4), P(8), P(8));
    for (let k = 0; k < 5; k++) { x.beginPath(); let px = P(a), py = P(b); x.moveTo(px, py); for (let j = 0; j < 5; j++) { px += (r() - 0.5) * 22; py += (r() - 0.5) * 22; x.lineTo(px, py); } x.strokeStyle = k % 2 ? '#f0a540' : '#ffd38a'; x.lineWidth = 2; x.stroke(); }
  }
  // 11. Кости, черепа, обломки оружия — по всей карте
  for (let i = 0; i < 380; i++) {
    const px = r() * W, py = r() * H;
    if (r() > 0.5) { x.fillStyle = '#c9bfa8'; x.fillRect(px, py, 3, 3); x.fillStyle = '#1a1612'; x.fillRect(px, py + 1, 1, 1); x.fillRect(px + 2, py + 1, 1, 1); } // череп
    else { x.fillStyle = r() > 0.5 ? '#a89e88' : '#4a4038'; x.fillRect(px, py, 4 + r() * 4, 1); }
  }
  // 11б. Скалы (непроходимо): тёмная порода, светлый гребень по краю тоннеля, осыпь
  for (const [bx, by, bw, bh] of BLOCKS) {
    const X = P(bx), Y = P(by), Wd = P(bw), Hd = P(bh);
    const g = x.createLinearGradient(0, Y, 0, Y + Hd); g.addColorStop(0, '#16120f'); g.addColorStop(0.5, '#241d17'); g.addColorStop(1, '#100c0a');
    x.fillStyle = g; x.fillRect(X, Y, Wd, Hd);
    for (let i = 0; i < (Wd * Hd) / 900; i++) { x.fillStyle = r() > 0.5 ? '#3a3027' : '#0b0908'; x.fillRect(X + r() * Wd, Y + r() * Hd, 6 + r() * 18, 3 + r() * 6); } // слоистость породы
    for (let xx = X; xx < X + Wd; xx += 6) { // гребень над тоннелем и под ним
      const top = Y + Hd, bot = Y;
      if (Y > 0) { x.fillStyle = '#5a4c3e'; x.fillRect(xx, bot - 2 - r() * 4, 6, 4); }
      if (Y + Hd < H) { x.fillStyle = '#6b5a48'; x.fillRect(xx, top - 3, 6, 3); x.fillStyle = '#0a0807'; x.fillRect(xx, top, 6, 6 + r() * 6); }
    }
    x.strokeStyle = '#9a8468'; x.lineWidth = 3; x.strokeRect(X + 1.5, Y + 1.5, Wd - 3, Hd - 3); // светлая кромка: граница непроходимого видна и под туманом
    x.save(); x.beginPath(); x.rect(X, Y, Wd, Hd); x.clip(); x.strokeStyle = 'rgba(0,0,0,.45)'; x.lineWidth = 2; // штриховка скалы
    for (let d = -Hd; d < Wd; d += 14) { x.beginPath(); x.moveTo(X + d, Y + Hd); x.lineTo(X + d + Hd, Y); x.stroke(); }
    x.restore();
  }
  // 12. Виньетка по краю карты
  const v = x.createRadialGradient(W / 2, H / 2, W * 0.35, W / 2, H / 2, W * 0.72);
  v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,0.6)'); x.fillStyle = v; x.fillRect(0, 0, W, H);
  return c;
}

function path(x: C, pts: Pt[]) { x.beginPath(); pts.forEach(([a, b], i) => (i ? x.lineTo(a, b) : x.moveTo(a, b))); x.closePath(); }
function stroke(x: C, pts: Pt[], P: (v: number) => number, w: number, col: string) {
  x.beginPath(); pts.forEach(([a, b], i) => (i ? x.lineTo(P(a), P(b)) : x.moveTo(P(a), P(b))));
  x.strokeStyle = col; x.lineWidth = P(w); x.lineJoin = 'round'; x.lineCap = 'round'; x.stroke();
}
/** Точка на ломаной по доле длины t ∈ [0, 1]. */
function along(pts: Pt[], t: number): Pt {
  const seg = pts.slice(1).map((p, i) => Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1])), total = seg.reduce((a, b) => a + b, 0);
  let d = t * total;
  for (let i = 0; i < seg.length; i++) { if (d <= seg[i]) { const k = d / seg[i]; return [pts[i][0] + (pts[i + 1][0] - pts[i][0]) * k, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * k]; } d -= seg[i]; }
  return pts.at(-1)!;
}
function tiles(x: C, cx: number, cy: number, rad: number, r: () => number, cols: string[]) {
  x.save(); x.beginPath(); x.arc(cx, cy, rad, 0, Math.PI * 2); x.clip();
  for (let yy = cy - rad; yy < cy + rad; yy += 12) for (let xx = cx - rad; xx < cx + rad; xx += 16) { x.fillStyle = cols[(r() * cols.length) | 0]; x.fillRect(xx + (((yy - cy) / 12) % 2 ? 8 : 0), yy, 15, 11); }
  x.restore();
}
