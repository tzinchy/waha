// 3D-слой поля боя: живые модели фракций (faction-asset-lab) вместо картинок — как в лаборатории ассетов.
// Холст WebGL лежит между землёй с туманом (снизу) и DOM-слоем карты (полосы здоровья, кольца, выстрелы — сверху).
// Проекция «косоугольная»: земля ложится один-в-один как в 2D-карте (x → вправо, y симуляции → вниз), высота модели уходит вверх по экрану.
// Поэтому клики, туман, точки и миникарта работают без изменений.
import * as THREE from 'three';
import { FactionActor, ROLE_MOTIONS, motionDuration, type Motion, type UnitRole, type FactionId as Pack } from './models3d/faction-models.ts';
import { StructureActor, STRUCTURE_ROLE_MOTIONS, structureMotionDuration, type StructureMotion, type StructureRole } from './models3d/structure-models.ts';
import type { Kind } from '../shared/sim.ts';

/** Вид юнита → роль модели. Чего здесь нет (мины), рисуется по-старому. */
const UNIT_ROLE: Partial<Record<Kind, UnitRole>> = { captain: 'captain', deity: 'captain', legend: 'elite', guard: 'guard', builder: 'builder', sniper: 'sniper', heavy: 'heavy', support: 'scout', elite: 'elite', healer: 'medic', lveh: 'transport', mveh: 'walker', hveh: 'tank', arty: 'artillery', titan: 'titan' };
const STRUCT_ROLE: Partial<Record<Kind, StructureRole>> = { hq: 'hq', barracks: 'barracks', bunker: 'barracks', motorpool: 'factory', yard: 'factory', key1: 'armory', key2: 'armory', key3: 'armory', key4: 'armory', foundry: 'generator', pump: 'generator', post: 'post', turret: 'turret', rturret: 'turret', fturret: 'turret', battery: 'turret', pylon: 'turret', pyre: 'turret', wall: 'wall', wallgate: 'gate', gate: 'relic', aegis: 'relic', bell: 'relic', plague: 'relic', lighthouse: 'relic', obelisk: 'relic', megagun: 'turret' };
export const has3d = (k: Kind) => k in UNIT_ROLE || k in STRUCT_ROLE;

/** Наклон высоты: сколько экранных пикселей даёт метр высоты относительно метра земли. */
const HEIGHT = 0.85;
type Actor = { root: THREE.Group; pose: (m: never, t: number) => void };
type Entry = { group: THREE.Group; actors: Actor[]; structure: boolean; motions: Set<string>; mode: string; t0: number; dead: number; scale: number };

export class World3D {
  readonly canvas = document.createElement('canvas');
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera = new THREE.OrthographicCamera();
  private entries = new Map<number, Entry>();
  private native = new Map<string, number>(); // ширина модели роли в её собственных метрах — для подгонки под ширину юнита в игре

  constructor() {
    this.canvas.className = 'w3d';
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true, alpha: true });
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping; this.renderer.toneMappingExposure = 1.25; // светлее, чем в лаборатории: сверху модели должны читаться
    this.scene.add(new THREE.HemisphereLight(0xdfe7ec, 0x3b3128, 2.2));
    const sun = new THREE.DirectionalLight(0xffe2b5, 2.6); sun.position.set(-10, 18, 12); this.scene.add(sun);
    const rim = new THREE.DirectionalLight(0x9fb3c8, 1.2); rim.position.set(6, 8, -12); this.scene.add(rim);
    this.camera.matrixAutoUpdate = false; this.camera.matrixWorldAutoUpdate = false; // вид задаём проекцией напрямую
    if (import.meta.env.DEV) (window as unknown as { __w3d: World3D }).__w3d = this; // отладка в консоли
  }

  /** Новый юнит или постройка. offs — смещения бойцов отряда в метрах (как в 2D-строю). */
  add(id: number, pack: Pack, kind: Kind, widthM: number, offs: [number, number][] = [[0, 0]]) {
    this.remove(id);
    const ur = UNIT_ROLE[kind], sr = STRUCT_ROLE[kind];
    if (!ur && !sr) return;
    const group = new THREE.Group(), actors: Actor[] = [];
    for (const [ox, oy] of sr ? [[0, 0]] : offs) {
      const a = (sr ? new StructureActor(pack, sr) : new FactionActor(pack, ur!)) as unknown as Actor;
      a.root.position.set(ox, 0, oy);
      group.add(a.root); actors.push(a);
    }
    const key = pack + '/' + (sr ?? ur), base = this.native.get(key) ?? (() => {
      const b = new THREE.Box3().setFromObject(actors[0].root), s = b.getSize(new THREE.Vector3()), w = Math.max(0.3, Math.min(s.x, s.z) * 0.5 + Math.max(s.x, s.z) * 0.5);
      this.native.set(key, w); return w;
    })();
    const scale = (widthM / base) * (kind === 'legend' ? 1.3 : kind === 'deity' ? 1.6 : 1);
    for (const a of actors) { a.root.position.multiplyScalar(1 / scale); } // строй — в метрах игры, модель — в своих
    group.scale.setScalar(scale);
    group.traverse(o => { o.frustumCulled = false; const m = (o as THREE.Mesh).material as THREE.Material | undefined; if (m && !Array.isArray(m)) m.side = THREE.DoubleSide; }); // косоугольная проекция зеркалит обход граней — рисуем обе стороны
    this.scene.add(group);
    this.entries.set(id, { group, actors, structure: !!sr, motions: new Set(sr ? STRUCTURE_ROLE_MOTIONS[sr] : ROLE_MOTIONS[ur!]), mode: '', t0: 0, dead: 0, scale });
  }

  /** Кадр юнита: место, поворот, анимация. build — доля готовности стройки (кадры «build» по готовности). alive — сколько бойцов отряда живо. */
  update(id: number, x: number, y: number, face: number, motion: string, now: number, opts: { alive?: number; build?: number; ghost?: boolean } = {}) {
    const e = this.entries.get(id);
    if (!e || e.dead) return;
    e.group.position.set(x, 0, y);
    if (!e.structure) e.group.rotation.y = Math.PI / 2 - face; // модель смотрит по +Z, угол симуляции — в плоскости x/y
    const m = this.pick(e, motion);
    if (m !== e.mode) { e.mode = m; e.t0 = now; }
    const t = (now - e.t0) / 1000;
    e.actors.forEach((a, i) => {
      const dead = opts.alive !== undefined && i >= opts.alive;
      a.root.visible = !dead || t < 1.5;
      if (e.structure && m === 'build') a.pose('build' as never, (opts.build ?? 0) * structureMotionDuration('build'));
      else a.pose((dead ? this.pick(e, 'death') : m) as never, dead ? Math.min(t, 1.2) : t);
    });
  }

  /** Гибель: проигрываем смерть и убираем модель. */
  kill(id: number, now: number) {
    const e = this.entries.get(id);
    if (!e || e.dead) return;
    e.dead = now; e.mode = this.pick(e, 'death'); e.t0 = now;
  }
  remove(id: number) { const e = this.entries.get(id); if (e) { this.scene.remove(e.group); this.entries.delete(id); } }

  private pick(e: Entry, m: string) {
    if (e.motions.has(m)) return m;
    const alt: Record<string, string[]> = { shoot: ['attack', 'shoot'], attack: ['shoot', 'attack'], run: ['walk'], walk: ['run'], work: ['idle'], build: ['idle'] };
    return (alt[m] ?? []).find(x => e.motions.has(x)) ?? 'idle';
  }

  /** Отрисовка под камеру 2D-карты: cx, cy — центр камеры в метрах, zoom, S — пикселей на метр, w/h — размер окна. */
  render(cx: number, cy: number, zoom: number, S: number, w: number, h: number, now: number, mapH: number) {
    if (this.canvas.width !== Math.round(w * this.renderer.getPixelRatio()) || this.canvas.height !== Math.round(h * this.renderer.getPixelRatio())) this.renderer.setSize(w, h, false);
    for (const [id, e] of this.entries) if (e.dead) {
      const t = (now - e.dead) / 1000;
      e.actors.forEach(a => a.pose(e.mode as never, Math.min(t, e.structure ? 1.2 : 1.6)));
      if (t > 1.8) this.remove(id);
    }
    const sx = (2 * S * zoom) / w, sy = (2 * S * zoom) / h, dz = 2 / (mapH + 120);
    // x → вправо; y экрана = (z − cy − HEIGHT·высота); глубина: ближе к зрителю тот, у кого больше z и выше точка
    this.camera.projectionMatrix.set(
      sx, 0, 0, -cx * sx,
      0, HEIGHT * sy, -sy, cy * sy,
      0, -dz * 0.7, -dz, 1 - dz * 40,
      0, 0, 0, 1,
    );
    this.camera.projectionMatrixInverse.copy(this.camera.projectionMatrix).invert();
    this.renderer.render(this.scene, this.camera);
  }

  dispose() { this.renderer.dispose(); this.canvas.remove(); }
}
