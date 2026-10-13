// Модели KayKit (CC0, client/public/models) и процедурная анимация.
// Персонажи KayKit собраны из жёстких частей (тело, руки, голова), поэтому анимируем сами части: бег, атака, стройка, смерть.
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils.js';
import type { CaptainCfg } from '../shared/sim.ts';

const FILES = {
  knight: 'knight.gltf', barbarian: 'barbarian.gltf', rogue: 'rogue.gltf', mage: 'mage.gltf',
  sword: 'sword.glb', hammer: 'hammer.glb', axe: 'axe.glb', shield: 'shield.glb', crossbow: 'crossbow.glb',
  castle: 'castle.glb', barracks: 'barracks.glb', watchtower: 'watchtower.glb',
  treeA: 'treeA.glb', treeB: 'treeB.glb', treeC: 'treeC.glb', rocks: 'rocks.glb', forestA: 'forestA.glb', mountain: 'mountain.glb', hill: 'hill.glb',
} as const;
export type ModelKey = keyof typeof FILES;
export type Hero = 'knight' | 'barbarian' | 'rogue' | 'mage';

const cache = new Map<ModelKey, THREE.Object3D>();
export const ready: Promise<void> = Promise.all(
  (Object.keys(FILES) as ModelKey[]).map(k => new GLTFLoader().loadAsync('/models/' + FILES[k]).then(g => {
    g.scene.traverse(o => { if ((o as THREE.Mesh).isMesh) { o.castShadow = true; o.receiveShadow = true; } });
    cache.set(k, g.scene);
  })),
).then(() => undefined);

/** Копия модели: геометрия и материалы общие, поэтому перекраска делается через tint(). */
export const model = (k: ModelKey) => cache.get(k)!.clone(true);

const tinted = new Map<string, THREE.Material>();
/** Перекрашивает материалы по имени (в KayKit материалы названы цветами: 'Blue', 'GreenDark'...). */
export function tint(o: THREE.Object3D, colors: Record<string, number>) {
  o.traverse(c => {
    const m = c as THREE.Mesh;
    if (!m.isMesh) return;
    const swap = (mat: THREE.Material) => {
      const col = colors[mat.name];
      if (col === undefined) return mat;
      const key = `${mat.uuid}:${col}`;
      let t = tinted.get(key);
      if (!t) { t = mat.clone(); (t as THREE.MeshStandardMaterial).color.setHex(col); tinted.set(key, t); }
      return t;
    };
    m.material = Array.isArray(m.material) ? m.material.map(swap) : swap(m.material);
  });
  return o;
}

/** Знамя на спине: древко и полотнище цвета игрока. */
export function banner(color: number, trim: number) {
  const g = new THREE.Group();
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 2.6, 6), new THREE.MeshStandardMaterial({ color: 0x3a2a1a }));
  pole.position.y = 1.3;
  const cloth = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 1.2), new THREE.MeshStandardMaterial({ color, side: THREE.DoubleSide }));
  cloth.position.set(0.47, 2.0, 0);
  const band = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 0.14), new THREE.MeshStandardMaterial({ color: trim, side: THREE.DoubleSide }));
  band.position.set(0.47, 2.5, 0.001);
  for (const m of [pole, cloth, band]) { m.castShadow = true; g.add(m); }
  return g;
}

type Opts = { tint?: Record<string, number>; right?: ModelKey; left?: ModelKey; scale?: number; ranged?: boolean };
const rnd = (a: number, b: number) => a + Math.random() * (b - a);

/**
 * Анимированный персонаж. root смотрит в +x (как ждёт игра), внутри модель KayKit смотрит в +z.
 * state выставляет игра каждый кадр, attack()/die() это разовые события.
 */
export class Actor {
  root = new THREE.Group();
  state: 'idle' | 'run' | 'build' = 'idle';
  alive = true;
  deadFor = 0; // секунд с момента смерти
  private body: THREE.Object3D;
  private head: THREE.Object3D;
  private armL: THREE.Object3D;
  private armR: THREE.Object3D;
  private t = rnd(0, 10);
  private step = rnd(0, 6);
  private atk = -1;
  private atkDelay = 0;
  private death = -1;
  private ranged: boolean;

  constructor(hero: Hero, o: Opts = {}) {
    const scene = model(hero);
    if (o.tint) tint(scene, o.tint);
    const find = (re: RegExp) => { let r: THREE.Object3D | undefined; scene.traverse(c => { if (!r && re.test(c.name)) r = c; }); return r!; };
    this.body = find(/Body$/); this.head = find(/Head$/); this.armL = find(/Ar[mn]Left$/); this.armR = find(/ArmRight$/);
    scene.updateMatrixWorld(true);
    for (const acc of [...scene.children]) if (acc !== this.body) this.head.attach(acc); // шлем/шляпа/волосы двигаются с головой
    this.ranged = !!o.ranged;
    if (o.right) { const w = model(o.right); w.position.set(-0.08, -0.42, 0.05); w.rotation.x = this.ranged ? 1.35 : Math.PI / 2 * 0.85; this.armR.add(w); }
    if (o.left) { const w = model(o.left); w.position.set(0.24, -0.3, 0.06); this.armL.add(w); }
    const inner = new THREE.Group();
    inner.rotation.y = Math.PI / 2;
    inner.scale.setScalar(o.scale ?? 1);
    inner.add(scene);
    this.root.add(inner);
  }

  /** Привязать что-то к спине (знамя). */
  back(o: THREE.Object3D) { o.position.set(0, 0.3, -0.42); o.rotation.y = Math.PI / 2; this.body.add(o); }

  attack(delay = 0) { if (this.alive && this.atk < 0) { this.atk = 0; this.atkDelay = delay; } }
  die() { if (this.alive) { this.alive = false; this.death = 0; } }
  revive() { this.alive = true; this.death = -1; this.deadFor = 0; this.body.rotation.set(0, 0, 0); this.body.position.set(0, 0, 0); }

  update(dt: number) {
    this.t += dt;
    const { body, armL, armR, head } = this, t = this.t;
    if (this.death >= 0) { // падает навзничь и лежит
      this.deadFor += dt;
      this.death = Math.min(1, this.death + dt * 2.5);
      const e = 1 - (1 - this.death) ** 3;
      body.rotation.set(-e * Math.PI / 2, 0, e * 0.3);
      body.position.set(0, e * 0.25, -e * 0.3);
      armL.rotation.x = armR.rotation.x = -e * 0.6;
      return;
    }
    let bodyY = Math.sin(t * 2.2 + this.step) * 0.015, lean = 0, roll = 0, aL = Math.sin(t * 1.6) * 0.05, aR = -aL;
    if (this.state === 'run') {
      this.step += dt * 11;
      const s = Math.sin(this.step);
      bodyY = Math.abs(s) * 0.12; lean = 0.14; roll = s * 0.07;
      aL = s * 0.85; aR = this.ranged ? -0.5 : -s * 0.85;
    } else if (this.state === 'build') { // бьёт молотом
      const k = Math.max(0, Math.sin(t * 13));
      aR = -1.0 - k * 1.2; lean = 0.18 + k * 0.08; aL = -0.3;
    }
    if (this.ranged && this.state !== 'run') { aR = -1.35; aL = -1.15; } // держит арбалет наизготовку
    if (this.atk >= 0) {
      if (this.atkDelay > 0) this.atkDelay -= dt;
      else {
        this.atk += dt / 0.38;
        const p = this.atk;
        if (this.ranged) { lean -= Math.sin(Math.min(1, p) * Math.PI) * 0.12; aR = -1.45 + Math.sin(Math.min(1, p) * Math.PI) * 0.25; }
        else { // замах и удар
          aR = p < 0.4 ? -2.7 * (p / 0.4) : -2.7 + 2.4 * Math.min(1, (p - 0.4) / 0.3);
          lean += p > 0.4 && p < 0.8 ? 0.25 : 0;
        }
        if (p >= 1) this.atk = -1;
      }
    }
    body.position.y = bodyY;
    body.rotation.set(lean, 0, roll);
    armL.rotation.x = aL; armR.rotation.x = aR;
    head.rotation.y = Math.sin(t * 0.7 + this.step) * 0.08;
  }
}

/** Капитан игрока: рыцарь, броня и отделка его цветов, меч или молот, щит, знамя по желанию. */
export function captainActor(cfg: CaptainCfg, scale = 1): Actor | RigActor {
  if (meshy.has('captain')) { const r = new RigActor('captain', 2.6 * scale, cfg.armor); if (cfg.banner) r.back(banner(cfg.armor, cfg.trim)); return r; }
  const a = new Actor('knight', { tint: { Stone: cfg.armor, Blue: cfg.armor, Beige: cfg.trim, Metal: cfg.trim }, right: cfg.weapon === 'sword' ? 'sword' : 'hammer', left: 'shield', scale });
  if (cfg.banner) a.back(banner(cfg.armor, cfg.trim));
  return a;
}

// ---------- модели Meshy (AI-генерация, tools/meshy.mjs): скелетные анимации из GLB ----------

type Rig = { scene: THREE.Object3D; clips: Record<string, THREE.AnimationClip>; height: number; width: number };
const meshy = new Map<string, Rig>();
const MESHY_UNITS = ['captain', 'guard', 'builder', 'hq', 'barracks', 'post'];
const MESHY_ANIMS = ['idle', 'run', 'walk', 'attack', 'shoot', 'death', 'work'];

async function loadMeshy(name: string) {
  const base = `/models/meshy/${name}/`, loader = new GLTFLoader();
  const head = await fetch(base + 'model.glb', { method: 'HEAD' });
  if (!head.ok || !(head.headers.get('content-type') ?? '').includes('model')) return; // нет модели: остаётся KayKit
  const g = await loader.loadAsync(base + 'model.glb');
  g.scene.traverse(o => { if ((o as THREE.Mesh).isMesh) { o.castShadow = true; o.receiveShadow = true; } });
  const box = new THREE.Box3().setFromObject(g.scene), size = box.getSize(new THREE.Vector3());
  const clips: Record<string, THREE.AnimationClip> = {};
  await Promise.all(MESHY_ANIMS.map(a => loader.loadAsync(base + a + '.glb').then(x => { if (x.animations[0]) clips[a] = x.animations[0]; }, () => undefined)));
  meshy.set(name, { scene: g.scene, clips, height: size.y, width: Math.max(size.x, size.z) });
}
export const meshyReady = Promise.all(MESHY_UNITS.map(n => loadMeshy(n).catch(() => undefined))).then(() => undefined);
export const hasMeshy = (name: string) => meshy.has(name);

/** Постройка Meshy, вписанная в нужный радиус. */
export function meshyBuilding(name: string, radius: number) {
  const r = meshy.get(name)!, m = r.scene.clone(true);
  m.scale.setScalar((radius * 2.1) / r.width);
  return m;
}

/** Персонаж Meshy со скелетом: тот же интерфейс, что у Actor, но анимации из клипов. */
export class RigActor {
  root = new THREE.Group();
  state: 'idle' | 'run' | 'build' = 'idle';
  alive = true;
  deadFor = 0;
  private mixer: THREE.AnimationMixer;
  private acts: Record<string, THREE.AnimationAction> = {};
  private cur?: THREE.AnimationAction;
  private oneShot = 0;
  private pendingAtk = -1;

  constructor(name: string, height: number, tintColor?: number, private ranged = false) {
    const r = meshy.get(name)!, m = SkeletonUtils.clone(r.scene);
    if (tintColor !== undefined) m.traverse(o => {
      const mesh = o as THREE.Mesh;
      if (mesh.isMesh) { const mat = (mesh.material as THREE.MeshStandardMaterial).clone(); mat.color.lerp(new THREE.Color(tintColor), 0.45); mesh.material = mat; }
    });
    const inner = new THREE.Group();
    inner.rotation.y = Math.PI / 2; // Meshy смотрит в +z, игра ждёт +x
    inner.scale.setScalar(height / r.height);
    inner.add(m);
    this.root.add(inner);
    this.mixer = new THREE.AnimationMixer(m);
    for (const [k, clip] of Object.entries(r.clips)) this.acts[k] = this.mixer.clipAction(clip);
    this.play('idle');
  }

  private play(name: string, once = false) {
    const a = this.acts[name] ?? (name === 'run' ? this.acts.walk : undefined) ?? (name === 'work' || name === 'shoot' ? this.acts.attack : undefined);
    if (!a || a === this.cur) return;
    a.reset().setLoop(once ? THREE.LoopOnce : THREE.LoopRepeat, Infinity).fadeIn(0.18).play();
    a.clampWhenFinished = once;
    this.cur?.fadeOut(0.18);
    this.cur = a;
    this.oneShot = once ? a.getClip().duration : 0;
  }

  back(o: THREE.Object3D) { o.position.set(-0.35, 0.5, 0); this.root.add(o); }
  attack(delay = 0) { if (this.alive && this.oneShot <= 0) this.pendingAtk = delay; }
  die() { if (this.alive) { this.alive = false; this.cur = undefined; this.play('death', true); } }
  revive() { this.alive = true; this.deadFor = 0; this.cur = undefined; this.play('idle'); }

  update(dt: number) {
    if (!this.alive) this.deadFor += dt;
    else {
      if (this.pendingAtk >= 0 && (this.pendingAtk -= dt) < 0) { this.cur = undefined; this.play(this.ranged ? 'shoot' : 'attack', true); }
      if (this.oneShot > 0) this.oneShot -= dt;
      else this.play(this.state === 'run' ? 'run' : this.state === 'build' ? 'work' : 'idle');
    }
    this.mixer.update(dt);
  }
}

export type AnyActor = Actor | RigActor;
/** Всё загружено: KayKit и (если сгенерированы) модели Meshy. */
export const allReady = Promise.all([ready, meshyReady]).then(() => undefined);
