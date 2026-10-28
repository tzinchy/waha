// 3D-слой поля боя: живые модели фракций (faction-asset-lab) вместо картинок — как в лаборатории ассетов.
// Холст WebGL лежит между землёй с туманом (снизу) и DOM-слоем карты (полосы здоровья, кольца, выстрелы — сверху).
// Проекция «косоугольная»: земля ложится один-в-один как в 2D-карте (x → вправо, y симуляции → вниз), высота модели уходит вверх по экрану.
// Поэтому клики, туман, точки и миникарта работают без изменений.
import * as THREE from 'three';
import { FactionActor, ROLE_MOTIONS, motionDuration, type Motion, type UnitRole, type FactionId as Pack } from './models3d/faction-models.ts';
import { StructureActor, STRUCTURE_ROLE_MOTIONS, structureMotionDuration, type StructureMotion, type StructureRole } from './models3d/structure-models.ts';
import { NuclearBlastActor } from './models3d/effect-models.ts';
import { UA_SCALE, uaActor, uaReady, type UAActor } from './models3d/ua-models.ts';
import { FxLayer, fxVisible, hitVisible, HITS, loadEvents } from './models3d/ua-fx.ts';
import { inherit, type Kind } from '../shared/sim.ts';

/** Вид юнита → роль модели. Чего здесь нет (мины), рисуется по-старому. */
export const UNIT_ROLE: Partial<Record<Kind, UnitRole>> = { captain: 'captain', legend: 'elite', guard: 'guard', builder: 'builder', sniper: 'sniper', heavy: 'heavy', support: 'scout', elite: 'elite', healer: 'medic', lveh: 'transport', mveh: 'walker', hveh: 'tank', arty: 'artillery', titan: 'titan', air: 'flyer', jet: 'aircraft', bomber: 'aircraft' };
inherit(UNIT_ROLE); // отряды UA сверх ролей — модель роли их базового вида (модель мода всё равно своя)
export const STRUCT_ROLE: Partial<Record<Kind, StructureRole>> = { hq: 'hq', barracks: 'barracks', bunker: 'barracks', motorpool: 'factory', yard: 'factory', key1: 'armory', key2: 'armory', key3: 'armory', key4: 'armory', foundry: 'generator', pump: 'generator', post: 'post', turret: 'turret', wall: 'wall', wallgate: 'gate', gate: 'relic', bell: 'relic', plague: 'relic' };
export const has3d = (k: Kind) => k in UNIT_ROLE || k in STRUCT_ROLE;

/** Наклон высоты: сколько экранных пикселей даёт метр высоты относительно метра земли. */
const HEIGHT = 0.85;
type Actor = { root: THREE.Group; pose: (m: never, t: number) => void; aim?: (yaw: number) => void };
/** Движения игры, которые модель мода (UAActor) понимает: клип ищется по дереву .whe и именам. */
const UA_MOTIONS = ['idle', 'walk', 'run', 'shoot', 'attack', 'death', 'build', 'work', 'capture', 'hit'];
type Entry = { args: Parameters<World3D['add']>; kind: Kind; group: THREE.Group; actors: Actor[]; structure: boolean; motions: Set<string>; mode: string; t0: number; dead: number; scale: number; veil?: boolean; h: number; aim?: THREE.Vector3; evT?: number };

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
    void HITS.then(h => { this.hits = h; });
    void uaReady.then(() => { for (const e of [...this.entries.values()]) if (!e.dead) this.add(...e.args); }); // модели мода догрузились позже, чем появились первые юниты
  }

  /** Новый юнит или постройка. offs — смещения бойцов отряда в метрах (как в 2D-строю). */
  add(id: number, pack: Pack, kind: Kind, widthM: number, offs: [number, number][] = [[0, 0]], variant?: 'assault' | 'commander' | 'mystic' | `legend${number}`, level = 1) {
    const args: Parameters<World3D['add']> = [id, pack, kind, widthM, offs, variant, level];
    this.remove(id);
    const ur = UNIT_ROLE[kind], sr = STRUCT_ROLE[kind];
    if (!ur && !sr) return;
    const group = new THREE.Group(), actors: Actor[] = [];
    const ua = uaActor(pack, kind, variant, structureMotionDuration('build'), level); // родные модели рас из модов DoW, если моды распакованы
    for (const [ox, oy] of sr ? [[0, 0]] : offs) {
      const a = (ua ? ua() : sr ? new StructureActor(pack, sr, level) : new FactionActor(pack, ur!, variant?.startsWith('legend') ? undefined : variant as 'assault')) as unknown as Actor;
      a.root.position.set(ox, 0, oy);
      group.add(a.root); actors.push(a);
    }
    const key = pack + '/' + (ua ? kind : sr ?? ur) + (variant ?? ''), base = ua ? 1 : this.native.get(key) ?? (() => {
      const b = new THREE.Box3().setFromObject(actors[0].root), s = b.getSize(new THREE.Vector3()), w = Math.max(0.3, Math.min(s.x, s.z) * 0.5 + Math.max(s.x, s.z) * 0.5);
      this.native.set(key, w); return w;
    })();
    // модели мода — в метрах DoW, все в одном масштабе UA_SCALE: соотношение размеров как в игре (улей больше Тирана, Карнифекс больше гаунта)
    const scale = ua ? UA_SCALE : (widthM / base) * (kind === 'legend' ? 1.3 : 1);
    for (const a of actors) { a.root.position.multiplyScalar(1 / scale); } // строй — в метрах игры, модель — в своих
    group.scale.setScalar(scale);
    group.traverse(o => { o.frustumCulled = false; const m = (o as THREE.Mesh).material as THREE.Material | undefined; if (m && !Array.isArray(m)) m.side = THREE.DoubleSide; }); // косоугольная проекция зеркалит обход граней — рисуем обе стороны
    this.scene.add(group); group.updateMatrixWorld(true);
    this.entries.set(id, { args, kind, group, actors, structure: !!sr, motions: new Set(ua ? UA_MOTIONS : sr ? STRUCTURE_ROLE_MOTIONS[sr] : ROLE_MOTIONS[ur!]), mode: '', t0: 0, dead: 0, scale, h: new THREE.Box3().setFromObject(group).getSize(new THREE.Vector3()).y }); // модель мода сама подбирает клип под любое движение
  }

  /** Кадр юнита: место, поворот, анимация. build — доля готовности стройки (кадры «build» по готовности). alive — сколько бойцов отряда живо. */
  update(id: number, x: number, y: number, face: number, motion: string, now: number, opts: { alive?: number; build?: number; ghost?: boolean; fly?: boolean; veil?: boolean; shot?: number } = {}) {
    const e = this.entries.get(id);
    if (!e || e.dead) return;
    e.group.position.set(x, opts.fly ? (e.kind === 'bomber' ? 12 : e.kind === 'jet' ? 8 : 3) + Math.sin(now / 400 + id) * 0.3 : 0, y); // летуны висят над землёй и покачиваются
    if (!!opts.veil !== !!e.veil) { // скрыт Теневым порталом: свой юнит полупрозрачный (материалы копируем — они общие у моделей)
      e.veil = opts.veil;
      e.group.traverse(o => {
        const mesh = o as THREE.Mesh;
        if (!mesh.material || Array.isArray(mesh.material)) return;
        if (!o.userData.ownMat) { mesh.material = mesh.material.clone(); o.userData.ownMat = true; o.userData.op = mesh.material.opacity; o.userData.tr = mesh.material.transparent; }
        mesh.material.transparent = e.veil || o.userData.tr; mesh.material.opacity = e.veil ? o.userData.op * 0.35 : o.userData.op;
      });
    }
    if (!e.structure) e.group.rotation.y = Math.PI / 2 - face; // модель смотрит по +Z, угол симуляции — в плоскости x/y
    const m = this.pick(e, motion);
    if (m !== e.mode) { e.mode = m; e.t0 = now; }
    if ((m === 'shoot' || m === 'attack') && opts.shot && opts.shot > e.t0) e.t0 = opts.shot; // каждый выстрел — клип с начала: темп анимации = перезарядка
    const t = (now - e.t0) / 1000;
    if ((m === 'shoot' || m === 'attack') && e.aim) this.events(e, m, t, opts.alive);
    e.evT = t;
    e.actors.forEach((a, i) => {
      if (e.structure) a.aim?.(Math.PI / 2 - face); // башня к цели (здание не вращается, угол — как у юнитов)
      const dead = opts.alive !== undefined && i >= opts.alive;
      a.root.visible = !dead || t < 1.5;
      if (e.structure && m === 'build') a.pose('build' as never, (opts.build ?? 0) * structureMotionDuration('build'));
      else a.pose((dead ? this.pick(e, 'death') : m) as never, dead ? Math.min(t, 1.2) : t + (!e.structure && !dead ? i * 0.37 : 0)); // бойцы отряда не в ногу, как в DoW
    });
  }

  /** Точки захвата как в Soulstorm: каменная платформа с флагштоком; флаг поднимается при захвате и окрашивается в цвет владельца. */
  private points = new Map<number, { a: StructureActor; g: THREE.Group; relic: boolean; rings: THREE.Object3D[] }>();
  point(i: number, x: number, y: number, kind: 'normal' | 'key' | 'relic', widthM: number) {
    const a = new StructureActor('legion', kind === 'relic' ? 'resource_point' : 'capture_point', kind === 'key' ? 2 : 1, { primary: 0x5b5246, metal: 0x3e3933, trim: kind === 'key' ? 0xd8a24a : 0x9c8a62, glow: kind === 'relic' ? 0x5dff8a : 0xb9c3c6 }); // ключевая — с пилонами, реликвия — зелёная
    const g = new THREE.Group(); g.add(a.root); g.position.set(x, 0, y);
    const b = new THREE.Box3().setFromObject(a.root).getSize(new THREE.Vector3());
    g.scale.setScalar(widthM / Math.max(0.5, b.x, b.z));
    g.traverse(o => { o.frustumCulled = false; const m = (o as THREE.Mesh).material as THREE.Material | undefined; if (m && !Array.isArray(m)) m.side = THREE.DoubleSide; });
    const rings: THREE.Object3D[] = []; g.traverse(o => { if (o.name === 'CaptureRing') rings.push(o); });
    this.scene.add(g); this.points.set(i, { a, g, relic: kind === 'relic', rings });
  }
  /** Жила (slag deposit) под термогенератор: тёмная порода с раскалёнными трещинами, свечение пульсирует. */
  private vents: THREE.MeshStandardMaterial[] = [];
  vent(x: number, y: number, widthM: number) {
    const g = new THREE.Group(), rock = new THREE.MeshStandardMaterial({ color: 0x2b2420, roughness: 0.95 });
    const lava = new THREE.MeshStandardMaterial({ color: 0xff7a1a, emissive: 0xff5a00, emissiveIntensity: 1.8, roughness: 0.6 });
    const base = new THREE.Mesh(new THREE.CylinderGeometry(1, 1.15, 0.12, 9), rock); base.position.y = 0.06; g.add(base);
    for (let i = 0; i < 6; i++) { // трещины лучами от центра
      const crack = new THREE.Mesh(new THREE.BoxGeometry(0.06 + (i % 2) * 0.04, 0.03, 0.7 + (i % 3) * 0.15), lava);
      const a = i * Math.PI / 3 + (i % 2) * 0.3; crack.position.set(Math.sin(a) * 0.45, 0.13, Math.cos(a) * 0.45); crack.rotation.y = a; g.add(crack);
    }
    const pool = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.32, 0.05, 10), lava); pool.position.y = 0.14; g.add(pool);
    for (let i = 0; i < 5; i++) { const r = new THREE.Mesh(new THREE.DodecahedronGeometry(0.16 + (i % 2) * 0.08), rock), a = i * 1.3; r.position.set(Math.sin(a) * 0.95, 0.12, Math.cos(a) * 0.95); g.add(r); }
    g.position.set(x, 0, y); g.scale.setScalar(widthM / 2.2);
    g.traverse(o => { o.frustumCulled = false; });
    this.scene.add(g); this.vents.push(lava);
  }
  /** color — цвет владельца или захватчика (null — нейтральная), prog — доля захвата 0..1. */
  pointState(i: number, color: number | null, owned: boolean, prog: number, now: number) {
    const p = this.points.get(i);
    if (!p) return;
    const idle = p.relic ? 0x5dff8a : 0xb9c3c6; // реликвия без хозяина светится зелёным
    p.a.cloth.color.setHex(color ?? 0x8a8174); p.a.glow.color.setHex(color ?? idle); p.a.glow.emissive.setHex(color ?? (p.relic ? 0x2bbf55 : 0x55606a));
    for (const r of p.rings) r.visible = color !== null; // кольца на земле горят у захвата и у владельца (как в DoW), у ничьей точки — нет
    if (owned && prog <= 0) p.a.pose('idle', (now / 1000) % 2.4); // флаг поднят и полощется
    else p.a.pose('capture', (owned ? 1 - prog : prog) * structureMotionDuration('capture') * 0.8); // флаг ползёт вверх при захвате и вниз, когда чужие сбивают
  }

  /** Сверхоружие: ядерный гриб на r метров (пыль модели расходится примерно на 4.3 своих единицы). */
  private blasts: { a: NuclearBlastActor; t0: number }[] = [];
  blast(x: number, y: number, r: number, now: number) {
    const a = new NuclearBlastActor(); a.root.position.set(x, 0, y); a.root.scale.setScalar(r / 4.3);
    a.root.traverse(o => { o.frustumCulled = false; });
    this.scene.add(a.root); this.blasts.push({ a, t0: now });
  }

  /** Эффекты из модов (art/fx): вспышки, снаряды, попадания. */
  private fx = new FxLayer(this.scene);
  private hits: Record<string, Record<string, string>> = {};
  /** Выстрел или удар юнита мода в точку (x, y) по цели to: события клипа (вспышка у ствола, снаряд к цели) играет update,
   *  попадание (.events оружия по поверхности цели) — здесь, после полёта. Ответ — что нарисовано эффектами мода. */
  fire(id: number, x: number, y: number, to: number | undefined, weapon: string, surface: string, melee: boolean) {
    const e = this.entries.get(id), t = to === undefined ? undefined : this.entries.get(to);
    if (!e) return { shot: false, hit: false };
    e.aim = new THREE.Vector3(x, (t?.h ?? 1.2) * 0.5, y);
    const shot = !!(e.actors[0] as Partial<UAActor>).fxEvents?.(melee ? 'attack' : 'shoot').some(x => (melee || 'fx_other' in x.e) && fxVisible(x.e.fx)), // снаряд мода (или удар) виден — рисованный не нужен
      ev = this.hits[weapon]?.[surface];
    if (ev) {
      const from = e.group.position.clone().setY(e.h * 0.5), at = e.aim.clone(), q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), from.clone().sub(at).normalize()); // брызги — навстречу стрелку
      setTimeout(() => void loadEvents(ev).then(list => { for (const x of list?.values() ?? []) if (x.fx) void this.fx.play(x.fx, at, q, t?.scale ?? e.scale); }), melee ? 0 : this.fx.flight(from, at) * 1000);
    }
    return { shot, hit: !!ev && hitVisible(ev) };
  }
  /** События движения выстрела/удара, чьё время прошло за кадр, — у каждого бойца отряда (со сдвигом, как его клип). */
  private events(e: Entry, m: string, t: number, alive?: number) {
    const prev = e.evT !== undefined && e.evT <= t ? e.evT : -1;
    e.actors.forEach((a, i) => {
      const ev = (a as Partial<UAActor>).fxEvents?.(m), off = e.structure ? 0 : i * 0.37;
      if (!ev?.length || (alive !== undefined && i >= alive)) return;
      for (const { e: x, t: at } of ev) if (at > prev + off && at <= t + off) {
        const mk = x.marker ? (a as UAActor).marker(x.marker) : undefined, pos = new THREE.Vector3(), q = new THREE.Quaternion();
        if (mk) { mk.updateWorldMatrix(true, false); mk.getWorldPosition(pos); q.setFromUnitVectors(new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 0, 1).transformDirection(mk.matrixWorld)); } // ось эффекта — +Z маркера (мир зеркален по x — поворот не разложить)
        else pos.copy(e.group.position).setY(e.h * 0.6);
        void this.fx.play(x.fx, pos, q, e.scale, 'fx_other' in x ? e.aim : undefined);
      }
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
    for (const m of this.vents) m.emissiveIntensity = 1.5 + Math.sin(now / 350) * 0.5; // жилы дышат жаром
    this.fx.update(now);
    this.blasts = this.blasts.filter(b => { const t = (now - b.t0) / 1000; if (t > b.a.duration) { this.scene.remove(b.a.root); return false; } b.a.pose('explode', t); return true; });
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
