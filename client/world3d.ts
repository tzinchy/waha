// 3D-слой поля боя: живые модели фракций (faction-asset-lab) вместо картинок — как в лаборатории ассетов.
// Холст WebGL лежит между землёй с туманом (снизу) и DOM-слоем карты (полосы здоровья, кольца, выстрелы — сверху).
// Проекция «косоугольная»: земля ложится один-в-один как в 2D-карте (x → вправо, y симуляции → вниз), высота модели уходит вверх по экрану.
// Поэтому клики, туман, точки и миникарта работают без изменений.
import * as THREE from 'three';
import { FactionActor, ROLE_MOTIONS, motionDuration, type Motion, type UnitRole, type FactionId as Pack } from './models3d/faction-models.ts';
import { StructureActor, STRUCTURE_ROLE_MOTIONS, structureMotionDuration, type StructureMotion, type StructureRole } from './models3d/structure-models.ts';
import type { Kind } from '../shared/sim.ts';

/** Вид юнита → роль модели. Чего здесь нет (мины), рисуется по-старому. */
export const UNIT_ROLE: Partial<Record<Kind, UnitRole>> = { captain: 'captain', deity: 'captain', legend: 'elite', guard: 'guard', builder: 'builder', sniper: 'sniper', heavy: 'heavy', support: 'scout', elite: 'elite', healer: 'medic', lveh: 'transport', mveh: 'walker', hveh: 'tank', arty: 'artillery', titan: 'titan', air: 'flyer', jet: 'aircraft', khorne: 'elite', nurgle: 'elite', tzeentch: 'sniper', slaanesh: 'scout' };
/** Демоны четырёх богов: тело демона в цветах своего бога, у какой бы фракции ни были. */
export const GOD_PACK: Partial<Record<Kind, Pack>> = { khorne: 'khorne', nurgle: 'nurgle', tzeentch: 'tzeentch', slaanesh: 'slaanesh' };
export const STRUCT_ROLE: Partial<Record<Kind, StructureRole>> = { hq: 'hq', barracks: 'barracks', bunker: 'barracks', motorpool: 'factory', yard: 'factory', key1: 'armory', key2: 'armory', key3: 'armory', key4: 'armory', foundry: 'generator', pump: 'generator', post: 'post', turret: 'turret', rturret: 'turret', fturret: 'turret', battery: 'turret', pylon: 'turret', pyre: 'turret', wall: 'wall', wallgate: 'gate', gate: 'relic', aegis: 'relic', bell: 'relic', plague: 'relic', lighthouse: 'relic', obelisk: 'relic', megagun: 'turret', warpgate: 'relic', portal: 'relic' };
export const has3d = (k: Kind) => k in UNIT_ROLE || k in STRUCT_ROLE;

/** Наклон высоты: сколько экранных пикселей даёт метр высоты относительно метра земли. */
const HEIGHT = 0.85;
type Actor = { root: THREE.Group; pose: (m: never, t: number) => void };
type Entry = { kind: Kind; group: THREE.Group; actors: Actor[]; structure: boolean; motions: Set<string>; mode: string; t0: number; dead: number; scale: number };

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
  add(id: number, pack: Pack, kind: Kind, widthM: number, offs: [number, number][] = [[0, 0]], variant?: 'assault' | 'commander' | 'mystic', level = 1) {
    this.remove(id);
    pack = GOD_PACK[kind] ?? pack;
    const ur = UNIT_ROLE[kind], sr = STRUCT_ROLE[kind];
    if (!ur && !sr) return;
    const group = new THREE.Group(), actors: Actor[] = [];
    for (const [ox, oy] of sr ? [[0, 0]] : offs) {
      const a = (sr ? new StructureActor(pack, sr, level) : new FactionActor(pack, ur!, variant)) as unknown as Actor;
      a.root.position.set(ox, 0, oy);
      group.add(a.root); actors.push(a);
    }
    const key = pack + '/' + (sr ?? ur) + (variant ?? ''), base = this.native.get(key) ?? (() => {
      const b = new THREE.Box3().setFromObject(actors[0].root), s = b.getSize(new THREE.Vector3()), w = Math.max(0.3, Math.min(s.x, s.z) * 0.5 + Math.max(s.x, s.z) * 0.5);
      this.native.set(key, w); return w;
    })();
    const scale = (widthM / base) * (kind === 'legend' ? 1.3 : kind === 'deity' ? 1.6 : 1);
    for (const a of actors) { a.root.position.multiplyScalar(1 / scale); } // строй — в метрах игры, модель — в своих
    group.scale.setScalar(scale);
    group.traverse(o => { o.frustumCulled = false; const m = (o as THREE.Mesh).material as THREE.Material | undefined; if (m && !Array.isArray(m)) m.side = THREE.DoubleSide; }); // косоугольная проекция зеркалит обход граней — рисуем обе стороны
    this.scene.add(group);
    this.entries.set(id, { kind, group, actors, structure: !!sr, motions: new Set(sr ? STRUCTURE_ROLE_MOTIONS[sr] : ROLE_MOTIONS[ur!]), mode: '', t0: 0, dead: 0, scale });
  }

  /** Кадр юнита: место, поворот, анимация. build — доля готовности стройки (кадры «build» по готовности). alive — сколько бойцов отряда живо. */
  update(id: number, x: number, y: number, face: number, motion: string, now: number, opts: { alive?: number; build?: number; ghost?: boolean; fly?: boolean } = {}) {
    const e = this.entries.get(id);
    if (!e || e.dead) return;
    e.group.position.set(x, opts.fly ? (e.kind === 'jet' ? 8 : 3) + Math.sin(now / 400 + id) * 0.3 : 0, y); // летуны висят над землёй и покачиваются
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

  /** Точки захвата как в Soulstorm: каменная платформа с флагштоком; флаг поднимается при захвате и окрашивается в цвет владельца. */
  private points = new Map<number, { a: StructureActor; g: THREE.Group }>();
  point(i: number, x: number, y: number, kind: 'normal' | 'key' | 'relic', widthM: number) {
    const a = new StructureActor('legion', kind === 'relic' ? 'resource_point' : 'capture_point', 1, { primary: 0x5b5246, metal: 0x3e3933, trim: kind === 'key' ? 0xd8a24a : 0x9c8a62, glow: 0xb9c3c6 });
    const g = new THREE.Group(); g.add(a.root); g.position.set(x, 0, y);
    const b = new THREE.Box3().setFromObject(a.root).getSize(new THREE.Vector3());
    g.scale.setScalar(widthM / Math.max(0.5, b.x, b.z));
    g.traverse(o => { o.frustumCulled = false; const m = (o as THREE.Mesh).material as THREE.Material | undefined; if (m && !Array.isArray(m)) m.side = THREE.DoubleSide; });
    this.scene.add(g); this.points.set(i, { a, g });
  }
  /** color — цвет владельца или захватчика (null — нейтральная), prog — доля захвата 0..1. */
  pointState(i: number, color: number | null, owned: boolean, prog: number, now: number) {
    const p = this.points.get(i);
    if (!p) return;
    p.a.cloth.color.setHex(color ?? 0x8a8174); p.a.glow.color.setHex(color ?? 0xb9c3c6); p.a.glow.emissive.setHex(color ?? 0x55606a);
    if (owned && prog <= 0) p.a.pose('idle', (now / 1000) % 2.4); // флаг поднят и полощется
    else p.a.pose('capture', (owned ? 1 - prog : prog) * structureMotionDuration('capture') * 0.8); // флаг ползёт вверх при захвате и вниз, когда чужие сбивают
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
    const alt: Record<string, string[]> = { shoot: ['attack', 'shoot'], attack: ['shoot', 'attack'], run: ['walk', 'fly'], walk: ['run', 'fly'], work: ['idle'], build: ['idle'] };
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
