// Эффекты DoW из модов: art/fx/*.lua (дерево FXTool: COMBO — группа, SPRAY — излучатель частиц, RING — спрайт, BEAM — луч, TRAIL — след)
// и .events (события попаданий). Играются в сцене World3D у маркера ствола (событие движения .whe) и у цели.
// ponytail: упрощённая физика частиц (без вращения, шума, гравиколодцев); снаряд к цели (fx_other) летит по прямой за короткое время.
import * as THREE from 'three';
import { DDSLoader } from 'three/examples/jsm/loaders/DDSLoader.js';
import { TGALoader } from 'three/examples/jsm/loaders/TGALoader.js';
import { parseWhe } from '../whm.ts';

/** Папки Data, где ищутся art/fx и art/events (UA, потом модули). */
export const FX_BASES = ['/ua/UltimateApocalypse_THB/data/', '/ua/Tyranids_Art/Data/', '/ua/Inquisition_Daemonhunt/Data/'];
type V = number | string | V[] | { [k: string]: V };
export type FxNode = { style: string; p: Record<string, V> };
export type Fx = Map<string, FxNode>; // ключ — путь «root>имя>…»

/** Таблица fxtypes из .lua FXTool → узлы. */
export function parseFxLua(src: string): Fx {
  let p = src.indexOf('{');
  const ws = () => { for (;;) { while (p < src.length && /[\s,;]/.test(src[p])) p++; if (src.startsWith('--', p)) p = src.indexOf('\n', p) + 1 || src.length; else return; } };
  const val = (): V => {
    ws();
    if (src[p] === '{') {
      p++; const o: Record<string, V> = {}, a: V[] = [];
      for (ws(); p < src.length && src[p] !== '}'; ws()) { const m = /^([A-Za-z_][\w%]*)\s*=/.exec(src.slice(p, p + 64)); if (m) { p += m[0].length; o[m[1]] = val(); } else a.push(val()); }
      p++; return a.length || !Object.keys(o).length ? a : o;
    }
    if (src[p] === '"') { const e = src.indexOf('"', p + 1), s = src.slice(p + 1, e); p = e + 1; return s; }
    const m = /^-?[\d.]+(e[-+]?\d+)?/i.exec(src.slice(p, p + 32));
    if (!m) throw new Error('fx lua: ' + src.slice(p, p + 16));
    p += m[0].length; return +m[0];
  };
  const out: Fx = new Map();
  for (const e of val() as { effect: string; fx: { style: string; properties: Record<string, { name: string; value: V }> } }[])
    out.set(e.effect, { style: e.fx.style, p: Object.fromEntries(Object.values(e.fx.properties ?? {}).map((x) => [x.name, x.value])) });
  return out;
}
/** Путь эффекта из события (tyranids\weapon_fx\x) → art/fx/…lua. */
export const fxFile = (path: string) => 'art/fx/' + path.replace(/\\/g, '/').replace(/\.lua$/i, '') + '.lua';
export const eventsFile = (path: string) => 'art/events/' + path.replace(/\\/g, '/').replace(/\.events$/i, '') + '.events';
/** Текстуры узлов (как пишет FXTool: путь от art/fx; бывает .tga вместо .dds — пробуем оба). */
export const fxTextures = (fx: Fx) => [...new Set([...fx.values()].map((n) => n.p.Texture).filter((t): t is string => typeof t === 'string' && !!t))];
export const texAlts = (t: string) => { const b = 'art/fx/' + t.replace(/\\/g, '/').replace(/^data:art\/fx\//i, ''); return [b, b.replace(/\.(tga|dds)$/i, (x) => (/tga/i.test(x) ? '.dds' : '.tga'))]; };

// ---------- загрузка ----------
async function first(path: string) { for (const b of FX_BASES) { const r = await fetch(b + path).catch(() => null); if (r?.ok && !/text\/html/.test(r.headers.get('content-type') ?? '')) return { url: b + path, res: r }; } return null; }
const files = new Map<string, Promise<Fx | null>>();
const fxDone = new Map<string, Fx | null>(), texDone = new Map<string, THREE.Texture | null>(); // уже загруженное (null — нет в ua/)
const loadFx = (path: string) => { const k = path.toLowerCase(); if (!files.has(k)) files.set(k, first(fxFile(path)).then(async (f) => (f ? parseFxLua(await f.res.text()) : null)).catch(() => null).then((x) => { fxDone.set(k, x); return x; })); return files.get(k)!; };
/** Виден ли эффект: файл есть и нашлась хоть одна его текстура (многие текстуры — из оригинальной DoW, её в ua/ нет). Пока грузится — false. */
export function fxVisible(path: string) {
  void loadFx(path).then((fx) => fx && fxTextures(fx).forEach((t) => void tex(t)));
  const fx = fxDone.get(path.toLowerCase());
  return !!fx && fxTextures(fx).some((t) => texDone.get(t));
}
const evFiles = new Map<string, Promise<Map<string, Record<string, string>> | null>>();
/** События попадания (.events): fx на маркере цели. */
export const loadEvents = (path: string) => { const k = path.toLowerCase(); if (!evFiles.has(k)) evFiles.set(k, first(eventsFile(path)).then(async (f) => (f ? parseWhe(await f.res.arrayBuffer()).events : null)).catch(() => null).then((x) => { evDone.set(k, x); return x; })); return evFiles.get(k)!; };
const evDone = new Map<string, Map<string, Record<string, string>> | null>();
/** Видно ли попадание: в событиях есть видимый эффект (как fxVisible). */
export function hitVisible(path: string) { void loadEvents(path); return [...evDone.get(path.toLowerCase())?.values() ?? []].some((e) => e.fx && fxVisible(e.fx)); }
const texs = new Map<string, Promise<THREE.Texture | null>>();
function tex(t: string) {
  if (!texs.has(t)) texs.set(t, (async () => {
    for (const path of texAlts(t)) {
      const f = await first(path);
      if (!f) continue;
      const tx = /\.dds$/i.test(path) ? await new DDSLoader().loadAsync(f.url).catch(() => null) : await new TGALoader().loadAsync(f.url).catch(() => null);
      if (!tx) continue;
      tx.colorSpace = THREE.SRGBColorSpace; tx.name = path;
      // без альфы (DXT1, 24-битный TGA) чёрный фон — это «пусто»: такие спрайты в DoW складываются со сценой
      tx.userData.add = tx.format === THREE.RGB_S3TC_DXT1_Format || (!/\.dds$/i.test(path) && new Uint8Array(await f.res.arrayBuffer(), 16, 1)[0] === 24);
      return tx;
    }
    return null;
  })().then((x) => { texDone.set(t, x); return x; }));
  return texs.get(t)!;
}
/** Карта «оружие → поверхность → событие попадания» (собирает tools/ua-slim.ts из .rgd). */
export const HITS: Promise<Record<string, Record<string, string>>> = typeof fetch !== 'undefined' && typeof document !== 'undefined' ? fetch('/ua/fx-hits.json').then((r) => (r.ok ? r.json() : {})).catch(() => ({})) : Promise.resolve({});

// ---------- кривые FXTool: [t, v, t, v…] и [[t, x, y, z(, a)]…], t — доля жизни 0..1 ----------
const num = (v: V | undefined, t: number, d = 0): number => {
  if (typeof v === 'number') return v;
  const a = v as number[] | undefined;
  if (!Array.isArray(a) || !a.length) return d;
  for (let i = 2; i < a.length; i += 2) if (t <= a[i]) return a[i - 1] + (a[i + 1] - a[i - 1]) * Math.min(1, Math.max(0, (t - a[i - 2]) / (a[i] - a[i - 2] || 1)));
  return a[a.length - 1];
};
const vec = (v: V | undefined, t: number): number[] => {
  const rows = (Array.isArray(v) ? v : Object.values((v as Record<string, V>) ?? {})) as number[][];
  if (!rows.length) return [0, 0, 0, 0];
  if (typeof rows[0] === 'number') return rows as unknown as number[]; // постоянный цвет [r, g, b, a]
  for (let i = 1; i < rows.length; i++) if (t <= rows[i][0]) { const k = Math.min(1, Math.max(0, (t - rows[i - 1][0]) / (rows[i][0] - rows[i - 1][0] || 1))); return rows[i].slice(1).map((x, j) => rows[i - 1][j + 1] + (x - rows[i - 1][j + 1]) * k); }
  return rows[rows.length - 1].slice(1);
};
/** Сколько живёт узел, с (для частицы — пока живут её дети). */
function life(fx: Fx, path: string, d = 0): number {
  const n = fx.get(path);
  if (!n || d > 8) return 0;
  const kids = (n.style === 'STYLE_COMBO' ? Object.entries(n.p).filter(([k]) => /^fx\d$/i.test(k)).map(([, v]) => v) : n.style === 'STYLE_SPRAY' ? [n.p.Particle_Fx] : []).filter((v): v is string => typeof v === 'string' && !!v);
  const own = n.style === 'STYLE_SPRAY' ? num(n.p.Emitter_Duration, 0) : n.style === 'STYLE_TRAIL' ? num(n.p.Duration, 0) + num(n.p.FadeOutTime, 0) : num(n.p.Duration, 0);
  return Math.min(4, own + Math.max(0, ...kids.map((k) => life(fx, path + '>' + k, d + 1))));
}

// ---------- проигрывание ----------
type Ctx = { pos: THREE.Vector3; q: THREE.Quaternion; k: number; to?: THREE.Vector3 };
type Item = (age: number, dt: number) => boolean; // false — умер
const Z = new THREE.Vector3(0, 0, 1);
const VIEW = new THREE.Vector3(0, 1, 0.85).normalize(); // взгляд косоугольной камеры world3d (HEIGHT = 0.85): ширина лучей — поперёк него
/** FXTool: 2 — сложение (чёрное прозрачно), 1 — альфа. Сложение не трогает альфу холста: он прозрачный поверх земли, иначе чёрный фон спрайта виден квадратом. */
const blend = (m: THREE.Material, add: boolean) => { m.blending = add ? THREE.CustomBlending : THREE.NormalBlending; Object.assign(m, { blendSrc: THREE.SrcAlphaFactor, blendDst: THREE.OneFactor, blendSrcAlpha: THREE.ZeroFactor, blendDstAlpha: THREE.OneFactor }); m.userData.add = add; };
const MAX = 1500; // ponytail: потолок живых спрайтов на всё поле; выше — новые эффекты пропускаются

export class FxLayer {
  private items: { f: Item; t0: number; kill: () => void }[] = [];
  private sprites = 0;
  constructor(private scene: THREE.Object3D) {}

  /** Эффект по пути события в точке pos, ось +Z = q; to — цель (fx_other: снаряд или луч к ней). Возвращает время полёта до цели, с. */
  async play(path: string, pos: THREE.Vector3, q: THREE.Quaternion, k: number, to?: THREE.Vector3) {
    const fx = await loadFx(path);
    if (!fx?.has('root') || this.sprites > MAX) return 0;
    if (to) q = new THREE.Quaternion().setFromUnitVectors(Z, to.clone().sub(pos).normalize());
    this.spawn(fx, 'root', { pos: pos.clone(), q, k, to }, performance.now());
    return to ? this.flight(pos, to) : 0;
  }
  flight = (a: THREE.Vector3, b: THREE.Vector3) => Math.min(0.6, Math.max(0.1, a.distanceTo(b) / 45)); // ponytail: снаряд ~45 м/с, без баллистики мода

  private add(f: Item, kill: () => void, t0: number) { this.items.push({ f, t0, kill }); }
  private spawn(fx: Fx, path: string, c: Ctx, t0: number, d = 0): (() => void) | undefined {
    const n = fx.get(path);
    if (!n || d > 8) return;
    const P = n.p, off = (t: number) => { const o = vec(P.Offset, t); return new THREE.Vector3(o[0], o[1], o[2]).applyQuaternion(c.q).multiplyScalar(c.k); };
    if (n.style === 'STYLE_COMBO') {
      const kids = Object.entries(P).filter(([k, v]) => /^fx\d$/i.test(k) && typeof v === 'string' && v).map(([, v]) => this.spawn(fx, path + '>' + v, c, t0, d + 1));
      return () => kids.forEach((x) => x?.());
    }
    if ((n.style === 'STYLE_RING' || n.style === 'STYLE_BEAM' || n.style === 'STYLE_TRAIL') && typeof P.Texture === 'string' && P.Texture && texDone.get(P.Texture) !== null) { // текстуры нет — узел не рисуем
      const dur = Math.max(0.05, num(P.Duration, 0.3)) + (n.style === 'STYLE_TRAIL' ? num(P.FadeOutTime, 0) : 0);
      const o = { transparent: true, depthWrite: false, depthTest: !!P.UseDepthTest, opacity: 0 };
      const mat = n.style === 'STYLE_RING' ? new THREE.SpriteMaterial(o) : new THREE.MeshBasicMaterial({ ...o, side: THREE.DoubleSide });
      blend(mat, P.Blending === 2);
      if (typeof P.Texture === 'string' && P.Texture) void tex(P.Texture).then((t) => { if (t) { mat.map = t; if (t.userData.add) blend(mat, true); mat.needsUpdate = true; } });
      const obj = mat instanceof THREE.SpriteMaterial ? new THREE.Sprite(mat) : new THREE.Mesh(new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array(12), 3)).setAttribute('uv', new THREE.Float32BufferAttribute([0, 0, 0, 1, 1, 0, 1, 1], 2)).setIndex([0, 1, 2, 2, 1, 3]), mat);
      obj.frustumCulled = false; obj.renderOrder = 10; obj.visible = false; // без текстуры (нет в ua/ или ещё грузится) — не рисуем белый квадрат
      this.scene.add(obj); this.sprites++;
      let dead = false;
      const kill = () => { if (dead) return; dead = true; this.scene.remove(obj); this.sprites--; mat.dispose(); if (obj instanceof THREE.Mesh) obj.geometry.dispose(); };
      const tail: THREE.Vector3[] = []; // след: прошлые положения головы
      this.add((age) => {
        const t = age / dur, m = mat;
        if (t >= 1) return false;
        obj.visible = !!mat.map;
        const col = n.style === 'STYLE_TRAIL' ? vec(P.ColourHead, 0).map((x, i) => (x + vec(P.ColourTail, 0)[i]) / 2) : vec(P.Colour, t);
        m.color.setRGB(col[0] / 255, col[1] / 255, col[2] / 255, THREE.SRGBColorSpace);
        // сложение (2) и след берут только цвет, альфа цвета — у обычного смешивания (1)
        m.opacity = (m.userData.add || n.style === 'STYLE_TRAIL' ? 1 : (col[3] ?? 255) / 255) * (n.style === 'STYLE_TRAIL' ? Math.min(1, (dur - age) / Math.max(0.05, num(P.FadeOutTime, 0.2))) : 1);
        const at = c.pos.clone().add(off(t));
        if (n.style === 'STYLE_RING') { obj.position.copy(at); const r = num(P.Radius, t, 0.5) * 2 * c.k; obj.scale.set(r, r, 1); return true; }
        let a = at, b: THREE.Vector3, w = num(P.Width, t, 0.3) * c.k;
        if (n.style === 'STYLE_BEAM') b = c.to && d === 0 ? c.to.clone() : at.clone().add(Z.clone().applyQuaternion(c.q).multiplyScalar(num(P.Length, t, 1) * c.k));
        else { tail.unshift(at); if (tail.length > 6) tail.pop(); b = tail[tail.length - 1]; a = at; w = num(P.Width, 0, 0.3) * c.k; if (a.distanceTo(b) < 1e-3) b = a.clone().sub(Z.clone().applyQuaternion(c.q).multiplyScalar(num(P.Length, 0, 1) * c.k * 0.3)); }
        const side = b.clone().sub(a).cross(VIEW).normalize().multiplyScalar(w / 2), pa = (obj as THREE.Mesh).geometry.attributes.position as THREE.BufferAttribute;
        [a.clone().add(side), a.clone().sub(side), b.clone().add(side), b.clone().sub(side)].forEach((v, i) => pa.setXYZ(i, v.x, v.y, v.z));
        pa.needsUpdate = true;
        return true;
      }, kill, t0);
      return kill;
    }
    if (n.style === 'STYLE_SPRAY') {
      const dur = Math.max(0.02, num(P.Emitter_Duration, 0.3)), child = typeof P.Particle_Fx === 'string' && P.Particle_Fx ? path + '>' + P.Particle_Fx : '';
      const plife = Math.max(0.05, life(fx, child)), kids: (() => void)[] = [];
      let acc = 1, stopped = false; // первая частица — сразу
      const g = P.Particle_Gravity ? 9.81 * c.k : 0, drag = num(P.Emitter_Drag, 0);
      this.add((age, dt) => {
        if (stopped || !child) return false;
        const t = age / dur;
        if (t >= 1) return false;
        acc += num(P.Emitter_Rate, t, 5) * dt;
        for (; acc >= 1 && this.sprites < MAX; acc--) {
          const dev = (num(P.Emitter_Deviation, t) * Math.PI) / 180, a = Math.random() * Math.PI * 2, r = Math.random() * dev;
          const dir = new THREE.Vector3(Math.sin(r) * Math.cos(a), Math.sin(r) * Math.sin(a), Math.cos(r)).applyQuaternion(c.q);
          const vol = vec(P.Emitter_Volume, t), pos = c.pos.clone().add(off(t)).add(new THREE.Vector3((Math.random() - 0.5) * vol[0], (Math.random() - 0.5) * vol[1], (Math.random() - 0.5) * vol[2]).applyQuaternion(c.q).multiplyScalar(c.k));
          const vel = dir.multiplyScalar(num(P.Particle_Speed, t, 1) * c.k), start = pos.clone(), sc = num(P.Particle_Scale, 0, 1);
          const pc: Ctx = { pos, q: new THREE.Quaternion().setFromUnitVectors(Z, vel.clone().normalize()), k: c.k * sc };
          const fly = c.to && d === 0 ? this.flight(start, c.to) : 0, to = c.to; // снаряд к цели: частица летит к ней и гаснет на месте
          const kill = this.spawn(fx, child, pc, performance.now(), d + 1);
          if (kill) kids.push(kill);
          this.add((pa, pdt) => {
            if (fly && to) { if (pa >= fly) return false; pos.lerpVectors(start, to, pa / fly); return true; }
            if (pa >= plife) return false;
            vel.y -= g * pdt; vel.multiplyScalar(Math.exp(-drag * pdt)); pos.addScaledVector(vel, pdt);
            return true;
          }, () => kill?.(), performance.now());
        }
        return true;
      }, () => { stopped = true; }, t0);
      return () => { stopped = true; kids.forEach((x) => x()); };
    }
    return undefined; // свет, погода — не рисуем
  }

  update(now: number) {
    const dt = Math.min(0.1, (now - (this.last || now)) / 1000); this.last = now;
    const cur = this.items; this.items = []; // излучатели добавляют частицы прямо во время обхода
    this.items = cur.filter((it) => { const ok = it.f((now - it.t0) / 1000, dt); if (!ok) it.kill(); return ok; }).concat(this.items);
  }
  private last = 0;
}
