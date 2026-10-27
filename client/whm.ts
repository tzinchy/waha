// Загрузчик моделей Dawn of War (Relic Chunky: .whm — меш, скелет, анимации; .rsh — DXT-текстура) прямо в Three.js.
import * as THREE from 'three';

type Chunk = { type: string; id: string; ver: number; name: string; start: number; end: number };
export type WhmBone = { name: string; parent: number; pos: number[]; quat: number[] };
export type WhmMesh = { name: string; bone: number; pos: Float32Array; normal: Float32Array; uv: Float32Array; skinIndex: Uint16Array; skinWeight: Float32Array; groups: { texture: string; index: Uint16Array }[] };
export type WhmAnim = { name: string; duration: number; bones: { name: string; pos: number[][]; rot: number[][] }[]; vis: { name: string; keys: number[][] }[] };
export type Whm = { bones: WhmBone[]; meshes: WhmMesh[]; anims: WhmAnim[] };

class Reader {
  p = 0;
  constructor(readonly v: DataView) {}
  u8() { return this.v.getUint8(this.p++); }
  u32() { const x = this.v.getUint32(this.p, true); this.p += 4; return x; }
  i32() { const x = this.v.getInt32(this.p, true); this.p += 4; return x; }
  f32() { const x = this.v.getFloat32(this.p, true); this.p += 4; return x; }
  floats(n: number) { return Array.from({ length: n }, () => this.f32()); }
  str() { const n = this.u32(); let s = ''; for (let i = 0; i < n; i++) s += String.fromCharCode(this.u8()); return s.replace(/\0+$/, ''); }
  tag() { let s = ''; for (let i = 0; i < 4; i++) s += String.fromCharCode(this.u8()); return s; }
}

/** Плоский обход дерева чанков: FOLD-чанки раскрываются, DATA отдаются с границами данных. */
function chunks(v: DataView, start: number, end: number, out: (c: Chunk, path: string[]) => void, path: string[] = []) {
  const r = new Reader(v);
  r.p = start;
  while (r.p + 20 <= end) {
    const type = r.tag(), id = r.tag(), ver = r.u32(), size = r.u32(), name = r.str();
    const c = { type, id, ver, name, start: r.p, end: r.p + size };
    out(c, path);
    if (type === 'FOLD') chunks(v, c.start, c.end, out, [...path, id]);
    r.p = c.end;
  }
}

function header(buf: ArrayBuffer) {
  const v = new DataView(buf);
  if (new TextDecoder().decode(new Uint8Array(buf, 0, 12)) !== 'Relic Chunky') throw new Error('не Relic Chunky');
  return v;
}

export function parseWhm(buf: ArrayBuffer): Whm {
  const v = header(buf), out: Whm = { bones: [], meshes: [], anims: [] };
  const attach = new Map<string, number>();
  let anim: WhmAnim | null = null, slice = '';
  chunks(v, 24, buf.byteLength, (c, path) => {
    const r = new Reader(v);
    r.p = c.start;
    const parent = path[path.length - 1];
    if (c.type === 'FOLD' && c.id === 'MSLC') slice = c.name;
    if (c.type === 'FOLD' && c.id === 'ANIM') anim = { name: c.name, duration: 0, bones: [], vis: [] };
    if (c.type !== 'DATA') return;
    try { // кусок другого формата (бывает у моделей UA) пропускаем — модель грузится без него
    if (c.id === 'SKEL') for (let i = 0, n = r.u32(); i < n; i++) out.bones.push({ name: r.str(), parent: r.i32(), pos: r.floats(3), quat: r.floats(4) });
    else if (c.id === 'DATA' && parent === 'MSGR') for (let i = 0, n = r.u32(); i < n; i++) { const name = r.str(); r.u32(); attach.set(name, r.i32()); }
    else if (c.id === 'DATA' && parent === 'MSLC') out.meshes.push(readMesh(r, slice));
    else if (c.id === 'DATA' && parent === 'ANIM' && anim) readAnim(r, anim, out.anims);
    } catch { /* пропуск */ }
  });
  for (const m of out.meshes) m.bone = attach.get(m.name) ?? -1;
  return out;
}

function readMesh(r: Reader, name: string): WhmMesh {
  r.u32(); r.u8(); r.u32(); r.u32();
  const skin: number[] = [];
  for (let i = 0, n = r.u32(); i < n; i++) { r.str(); skin.push(r.u32()); }
  const nv = r.u32();
  r.u32(); // 37 — без доп. данных, 39 — с ними; разметка вершин одинакова
  const pos = new Float32Array(nv * 3), normal = new Float32Array(nv * 3), uv = new Float32Array(nv * 2);
  const skinIndex = new Uint16Array(nv * 4), skinWeight = new Float32Array(nv * 4);
  for (let i = 0; i < nv * 3; i++) pos[i] = r.f32();
  if (skin.length) for (let i = 0; i < nv; i++) {
    const w = r.floats(3), idx = [r.u8(), r.u8(), r.u8(), r.u8()];
    w.push(Math.max(0, 1 - w[0] - w[1] - w[2]));
    for (let k = 0; k < 4; k++) { const ok = idx[k] !== 255; skinIndex[i * 4 + k] = ok ? idx[k] : 0; skinWeight[i * 4 + k] = ok ? w[k] : 0; }
  }
  for (let i = 0; i < nv * 3; i++) normal[i] = r.f32();
  for (let i = 0; i < nv; i++) { uv[i * 2] = r.f32(); uv[i * 2 + 1] = r.f32(); }
  r.u32();
  const groups: WhmMesh['groups'] = [];
  for (let i = 0, n = r.u32(); i < n; i++) {
    const texture = r.str(), ni = r.u32(), index = new Uint16Array(ni);
    for (let k = 0; k < ni; k++) index[k] = r.v.getUint16(r.p + k * 2, true);
    r.p += ni * 2 + 8; // min/max индекс вершин
    groups.push({ texture, index });
  }
  return { name, bone: -1, pos, normal, uv, skinIndex, skinWeight: skin.length ? skinWeight : new Float32Array(0), groups };
}

function readAnim(r: Reader, a: WhmAnim, all: WhmAnim[]) {
  r.u32();
  a.duration = r.f32();
  for (let i = 0, n = r.u32(); i < n; i++) {
    const name = r.str(), pos: number[][] = [], rot: number[][] = [];
    for (let k = 0, m = r.u32(); k < m; k++) pos.push(r.floats(4));
    for (let k = 0, m = r.u32(); k < m; k++) rot.push(r.floats(5));
    r.u8();
    a.bones.push({ name, pos, rot });
  }
  for (let i = 0, n = r.u32(); i < n; i++) {
    const name = r.str(); r.u32(); r.u32(); r.u32();
    const keys: number[][] = [];
    for (let k = 0, m = r.u32(); k < m; k++) keys.push(r.floats(2));
    a.vis.push({ name, keys });
  }
  all.push(a);
}

/** .rsh → RGBA верхнего мипа. Форматы Relic: 8 — DXT1, 10 — DXT3, 11 — DXT5. */
export function parseRsh(buf: ArrayBuffer): { width: number; height: number; rgba: Uint8Array } {
  const v = header(buf);
  let fmt = 0, width = 0, height = 0, data = 0;
  chunks(v, 24, buf.byteLength, (c, path) => {
    if (c.type !== 'DATA' || path[path.length - 1] !== 'IMAG') return;
    if (data) return; // в .rsh бывает несколько текстур (основная, свечение…) — берём первую целиком
    if (c.id === 'ATTR') { fmt = v.getUint32(c.start, true); width = v.getUint32(c.start + 4, true); height = v.getUint32(c.start + 8, true); }
    if (c.id === 'DATA') data = c.start;
  });
  return { width, height, rgba: decodeDxt(new Uint8Array(buf, data), width, height, fmt) };
}

function decodeDxt(src: Uint8Array, w: number, h: number, fmt: number) {
  const out = new Uint8Array(w * h * 4), alpha = fmt !== 8, bs = alpha ? 16 : 8;
  const c = [0, 0, 0, 0].map(() => [0, 0, 0, 255]), a = new Array(8).fill(255);
  let o = 0;
  for (let by = 0; by < h; by += 4) for (let bx = 0; bx < w; bx += 4, o += bs) {
    const cb = o + (alpha ? 8 : 0);
    const c0 = src[cb] | (src[cb + 1] << 8), c1 = src[cb + 2] | (src[cb + 3] << 8);
    const rgb = (x: number) => [((x >> 11) & 31) * 255 / 31, ((x >> 5) & 63) * 255 / 63, (x & 31) * 255 / 31];
    c[0] = [...rgb(c0), 255]; c[1] = [...rgb(c1), 255];
    const four = c0 > c1 || alpha;
    for (let k = 0; k < 3; k++) {
      c[2][k] = four ? (2 * c[0][k] + c[1][k]) / 3 : (c[0][k] + c[1][k]) / 2;
      c[3][k] = four ? (c[0][k] + 2 * c[1][k]) / 3 : 0;
    }
    c[3][3] = four ? 255 : 0;
    if (fmt === 11) {
      a[0] = src[o]; a[1] = src[o + 1];
      for (let k = 2; k < 8; k++) a[k] = a[0] > a[1] ? ((8 - k) * a[0] + (k - 1) * a[1]) / 7 : k < 6 ? ((6 - k) * a[0] + (k - 1) * a[1]) / 5 : k === 6 ? 0 : 255;
    }
    for (let py = 0; py < 4; py++) for (let px = 0; px < 4; px++) {
      const i = py * 4 + px, x = bx + px, y = by + py;
      if (x >= w || y >= h) continue;
      const col = c[(src[cb + 4 + py] >> (px * 2)) & 3], d = (y * w + x) * 4;
      out[d] = col[0]; out[d + 1] = col[1]; out[d + 2] = col[2];
      if (fmt === 10) out[d + 3] = ((src[o + (i >> 1)] >> ((i & 1) * 4)) & 15) * 17;
      else if (fmt === 11) { const bit = i * 3, lo = o + 2; const bits = src[lo + (bit >> 3)] | (src[lo + (bit >> 3) + 1] << 8); out[d + 3] = a[(bits >> (bit & 7)) & 7]; }
      else out[d + 3] = col[3];
    }
  }
  return out;
}

/** Собирает Three.js-модель: общий скелет, SkinnedMesh на каждый кусок, клипы анимаций и видимость кусков по клипам. */
/** Виден ли кусок: его показывает любой включённый vis_*-слой (оружие, гребни, тир здания) или текущий клип его не прячет. */
export function meshVisible(vis: Map<string, Map<string, boolean>>, clip: string, layers: string[], mesh: string) {
  if (layers.some((l) => vis.get(l)?.get(mesh) === true)) return true;
  const c = vis.get(clip);
  if (c && c.size && ![...c.values()].some(Boolean)) // клип прячет всё (видимость задаёт .whe мода): без слоёв — всё, со слоями — база и выбранное
    return !layers.length || ![...vis].some(([name, m]) => name.startsWith('vis') && m.get(mesh) === true);
  return c?.get(mesh) ?? true;
}

export function buildWhm(m: Whm, texture: (path: string) => THREE.Texture | null) {
  const root = new THREE.Group();
  const bones = m.bones.map((b) => {
    const o = new THREE.Bone();
    o.name = b.name; o.position.fromArray(b.pos); o.quaternion.fromArray(b.quat);
    return o;
  });
  m.bones.forEach((b, i) => (b.parent >= 0 ? bones[b.parent] : root).add(bones[i]));
  root.updateMatrixWorld(true);
  const skeleton = new THREE.Skeleton(bones);
  const mats = new Map<string, THREE.Material>();
  const meshes = m.meshes.map((s) => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(s.pos, 3));
    g.setAttribute('normal', new THREE.BufferAttribute(s.normal, 3));
    g.setAttribute('uv', new THREE.BufferAttribute(s.uv, 2));
    const nv = s.pos.length / 3, si = s.skinWeight.length ? s.skinIndex : new Uint16Array(nv * 4).fill(Math.max(0, s.bone));
    const sw = s.skinWeight.length ? s.skinWeight : new Float32Array(nv * 4).map((_, i) => (i % 4 ? 0 : 1));
    g.setAttribute('skinIndex', new THREE.Uint16BufferAttribute(si, 4));
    g.setAttribute('skinWeight', new THREE.BufferAttribute(sw, 4));
    const index: number[] = [], material: THREE.Material[] = [];
    s.groups.forEach((gr, i) => {
      g.addGroup(index.length, gr.index.length, i);
      index.push(...gr.index);
      const key = gr.texture.toLowerCase();
      if (!mats.has(key)) mats.set(key, new THREE.MeshStandardMaterial({ map: texture(key), color: texture(key) ? 0xffffff : 0x8a7a66, roughness: 0.75, alphaTest: 0.5, side: THREE.DoubleSide }));
      material.push(mats.get(key)!);
    });
    g.setIndex(index);
    const mesh = new THREE.SkinnedMesh(g, material.length === 1 ? material[0] : material);
    mesh.name = s.name;
    mesh.frustumCulled = false;
    mesh.bind(skeleton, new THREE.Matrix4());
    root.add(mesh);
    return mesh;
  });
  const clips = m.anims.map((a) => {
    const t = (k: number[]) => k[0] * a.duration, tracks: THREE.KeyframeTrack[] = [];
    for (const b of a.bones) {
      if (b.pos.length) tracks.push(new THREE.VectorKeyframeTrack(`${b.name}.position`, b.pos.map(t), b.pos.flatMap((k) => k.slice(1))));
      if (b.rot.length) tracks.push(new THREE.QuaternionKeyframeTrack(`${b.name}.quaternion`, b.rot.map(t), b.rot.flatMap((k) => k.slice(1))));
    }
    return new THREE.AnimationClip(a.name, a.duration, tracks);
  });
  // Видимость кусков по клипам: кусок, которого клип не касается, виден (как в движке).
  const vis = new Map(m.anims.map((a) => [a.name, new Map(a.vis.filter((v) => v.keys.length).map((v) => [v.name, v.keys[0][1] > 0.5]))]));
  root.scale.x = -1; // DoW левосторонний → правосторонний Three.js
  return { root, meshes, clips, vis };
}
