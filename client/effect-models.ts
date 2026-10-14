import * as THREE from 'three';

/** Global visual effects. No damage, simulation, ownership or network code. */
export const EFFECT_ROLES = ['nuclear_blast'] as const;
export type EffectRole = typeof EFFECT_ROLES[number];
export type EffectMotion = 'explode';
export const EFFECT_ROLE_MOTIONS: Record<EffectRole, EffectMotion[]> = { nuclear_blast: ['explode'] };
export const effectMotionDuration = (_motion: EffectMotion) => 6.4;
export const effectMotionLoops = (_motion: EffectMotion) => false;
export const effectActionMarkers = (_motion: EffectMotion): Record<string, number> => ({ flash: 0.1, shockwave: 0.45, mushroom: 1.6, dustSettles: 5.6 });

type BindPose = { position: THREE.Vector3; quaternion: THREE.Quaternion; scale: THREE.Vector3 };
type Puff = { node: THREE.Group; angle: number; radius: number; height: number; size: number; phase: number };
const clamp = (t: number) => THREE.MathUtils.clamp(t, 0, 1);
const smooth = (t: number) => { const p = clamp(t); return p * p * (3 - 2 * p); };
const reveal = (time: number, start: number, duration: number) => Math.max(0.00001, smooth((time - start) / duration));

/** An articulated volume effect that can export without animated material properties. */
export class NuclearBlastActor {
  readonly root = new THREE.Group();
  readonly joints: Record<string, THREE.Group> = {};
  readonly role: EffectRole = 'nuclear_blast';
  readonly faction = 'common';
  readonly duration = 6.4;
  mode: EffectMotion = 'explode';
  time = 0;
  private bind = new Map<THREE.Group, BindPose>();
  private flash: THREE.Group;
  private fireball: THREE.Group;
  private fireRings: THREE.Group[] = [];
  private shockwaves: THREE.Group[] = [];
  private cap: Puff[] = [];
  private stem: Puff[] = [];
  private dust: Puff[] = [];
  private embers: Puff[] = [];
  private rays: THREE.Group[] = [];

  constructor() {
    this.root.name = 'common_nuclear_blast';
    const sphere = new THREE.SphereGeometry(1, 12, 9);
    const cloudSphere = new THREE.IcosahedronGeometry(1, 2);
    const flare = new THREE.MeshBasicMaterial({ color: 0xffedab, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false });
    const white = new THREE.MeshBasicMaterial({ color: 0xfff4d4, transparent: true, opacity: 0.85, blending: THREE.AdditiveBlending, depthWrite: false });
    const yellow = new THREE.MeshStandardMaterial({ color: 0xffce57, emissive: 0xffba26, emissiveIntensity: 2.6, roughness: 1 });
    const orange = new THREE.MeshStandardMaterial({ color: 0xfb6c16, emissive: 0xfc5706, emissiveIntensity: 1.35, roughness: 1 });
    const red = new THREE.MeshStandardMaterial({ color: 0xa43412, emissive: 0xdb3508, emissiveIntensity: 0.65, roughness: 1 });
    const smoke = new THREE.MeshStandardMaterial({ color: 0x44372e, emissive: 0x1d0e06, emissiveIntensity: 0.2, roughness: 1 });
    const upperSmoke = new THREE.MeshStandardMaterial({ color: 0x62564a, emissive: 0x2e160a, emissiveIntensity: 0.18, roughness: 1 });
    const dustMat = new THREE.MeshStandardMaterial({ color: 0x82715a, transparent: true, opacity: 0.73, roughness: 1, depthWrite: false });
    const mesh = (node: THREE.Group, geometry: THREE.BufferGeometry, material: THREE.Material, scale: number[]) => {
      const object = new THREE.Mesh(geometry, material);
      object.scale.set(scale[0], scale[1], scale[2]);
      node.add(object);
      return object;
    };
    this.flash = this.joint('Flash');
    mesh(this.flash, sphere, white, [1, 1, 1]);
    mesh(this.flash, sphere, flare, [1.18, 1.18, 1.18]);
    this.fireball = this.joint('Fireball');
    mesh(this.fireball, sphere, yellow, [1, 1, 1]);
    mesh(this.fireball, cloudSphere, orange, [1.1, 0.82, 1.1]);
    for (let i = 0; i < 8; i++) {
      const ray = this.joint(`FlashRay${i}`);
      mesh(ray, new THREE.ConeGeometry(0.11, 1, 5), flare, [1, 1, 1]);
      ray.rotation.z = i * Math.PI / 4;
      this.rays.push(ray);
    }
    for (let i = 0; i < 3; i++) {
      const ring = this.joint(`FireRing${i}`);
      const torus = mesh(ring, new THREE.TorusGeometry(1, 0.065 + i * 0.015, 5, 32), i === 0 ? yellow : orange, [1, 1, 1]);
      torus.rotation.x = Math.PI / 2;
      this.fireRings.push(ring);
    }
    for (let i = 0; i < 2; i++) {
      const ring = this.joint(`Shockwave${i}`);
      const torus = mesh(ring, new THREE.TorusGeometry(1, 0.045, 4, 48), i === 0 ? flare : dustMat, [1, 1, 1]);
      torus.rotation.x = Math.PI / 2;
      this.shockwaves.push(ring);
    }
    // Multiple rings of billows make a rounded mushroom canopy from every viewing angle.
    for (let i = 0; i < 28; i++) {
      const ring = i < 12 ? 0 : i < 22 ? 1 : 2;
      const ordinal = ring === 0 ? i : ring === 1 ? i - 12 : i - 22;
      const count = ring === 0 ? 12 : ring === 1 ? 10 : 6;
      const angle = ordinal / count * Math.PI * 2 + ring * 0.31;
      const node = this.joint(`CapBillow${i}`);
      const size = ring === 0 ? 0.82 : ring === 1 ? 0.94 : 1.04;
      mesh(node, cloudSphere, ring === 0 && i % 3 !== 0 ? orange : ring === 2 ? upperSmoke : smoke, [1, 0.86, 1]);
      if (ring === 0) mesh(node, sphere, red, [0.68, 0.66, 0.68]).position.y = -0.34;
      this.cap.push({ node, angle, radius: ring === 0 ? 2.12 : ring === 1 ? 1.49 : 0.65, height: ring * 0.59, size, phase: i * 0.73 });
    }
    for (let i = 0; i < 14; i++) {
      const node = this.joint(`StemBillow${i}`), angle = i * 2.3999632297;
      mesh(node, cloudSphere, i < 4 ? orange : i % 3 === 0 ? red : smoke, [1, 1.15, 1]);
      this.stem.push({ node, angle, radius: 0.22 + (i % 3) * 0.11, height: 0.28 + i * 0.24, size: 0.49 + i * 0.023, phase: i * 0.89 });
    }
    for (let i = 0; i < 20; i++) {
      const node = this.joint(`GroundDust${i}`), angle = i / 20 * Math.PI * 2;
      mesh(node, cloudSphere, dustMat, [1.15, 0.5, 1]);
      this.dust.push({ node, angle, radius: 0.6, height: 0.17, size: 0.38 + i % 4 * 0.08, phase: i * 0.67 });
    }
    for (let i = 0; i < 18; i++) {
      const node = this.joint(`Ember${i}`), angle = i * 2.3999632297;
      mesh(node, new THREE.OctahedronGeometry(1), i % 2 ? yellow : orange, [0.07, 0.18, 0.07]);
      this.embers.push({ node, angle, radius: 0.45 + (i % 5) * 0.12, height: 1.5 + (i % 7) * 0.19, size: 0.5 + i % 3 * 0.18, phase: i * 0.38 });
    }
    for (const node of Object.values(this.joints)) this.bind.set(node, { position: node.position.clone(), quaternion: node.quaternion.clone(), scale: node.scale.clone() });
    this.root.userData = { kind: 'effect', role: this.role, faction: 'common', duration: this.duration, actionMarkers: effectActionMarkers('explode'), visualOnly: true };
    this.pose('explode', 0);
  }

  private joint(name: string) {
    const node = new THREE.Group();
    node.name = `Nuclear_${name}`;
    this.root.add(node);
    this.joints[name] = node;
    return node;
  }

  pose(_motion: EffectMotion, seconds: number) {
    for (const [node, initial] of this.bind) { node.position.copy(initial.position); node.quaternion.copy(initial.quaternion); node.scale.copy(initial.scale); }
    const t = THREE.MathUtils.clamp(seconds, 0, this.duration), invisible = 0.00001;
    const flashSize = t < 0.1 ? 0.08 + smooth(t / 0.1) * 2.4 : t < 0.68 ? 2.48 * (1 - smooth((t - 0.1) / 0.58)) : invisible;
    this.flash.position.y = 0.53;
    this.flash.scale.setScalar(Math.max(invisible, flashSize));
    for (let i = 0; i < this.rays.length; i++) {
      const node = this.rays[i], angle = i * Math.PI / 4;
      node.position.set(Math.sin(angle) * flashSize * 0.75, 0.55 + Math.cos(angle) * flashSize * 0.75, 0);
      node.scale.set(1, Math.max(invisible, flashSize * 2.1), 1);
      if (t > 0.68) node.scale.setScalar(invisible);
    }
    const fireReveal = reveal(t, 0.05, 0.42), fireDecay = 1 - smooth((t - 1.05) / 1.35);
    this.fireball.scale.setScalar(Math.max(invisible, fireReveal * fireDecay * (0.55 + clamp(t / 1.6) * 1.8)));
    this.fireball.position.y = 0.65 + smooth(t / 1.6) * 1.2;
    for (let i = 0; i < this.fireRings.length; i++) {
      const age = Math.max(0, t - 0.15 - i * 0.13), visible = reveal(t, 0.15 + i * 0.13, 0.2);
      const radius = 0.3 + Math.min(age, 1.45) * (1.45 + i * 0.14);
      const thickness = Math.max(invisible, visible * (1 - smooth((age - 0.75) / 1.15)));
      this.fireRings[i].position.y = 0.18 + i * 0.13;
      this.fireRings[i].scale.set(radius, thickness, radius);
      if (t < 0.15 + i * 0.13 || age >= 1.9) this.fireRings[i].scale.setScalar(invisible);
    }
    for (let i = 0; i < this.shockwaves.length; i++) {
      const age = Math.max(0, t - 0.4 - i * 0.2), visible = reveal(t, 0.4 + i * 0.2, 0.12);
      const radius = 0.45 + Math.min(age, 2.05) * 2.65;
      this.shockwaves[i].position.y = 0.09 + i * 0.04;
      this.shockwaves[i].scale.set(radius, Math.max(invisible, visible * (1 - smooth((age - 1.2) / 0.95))), radius);
      if (t < 0.4 + i * 0.2 || age > 2.15) this.shockwaves[i].scale.setScalar(invisible);
    }
    const canopyRise = smooth((t - 0.7) / 2.4), canopyGrowth = reveal(t, 0.6, 1.4);
    const settle = smooth((t - 4.0) / 2.4);
    for (const puff of this.cap) {
      const wobble = Math.sin(t * 2.1 + puff.phase) * 0.11;
      const spread = 0.32 + canopyRise * 0.76 + settle * 0.17;
      puff.node.position.set(Math.cos(puff.angle) * puff.radius * spread, 1.0 + canopyRise * 3.2 + puff.height + wobble - settle * 0.25, Math.sin(puff.angle) * puff.radius * spread);
      puff.node.rotation.set(t * 0.05, puff.phase + t * 0.075, wobble * 0.4);
      puff.node.scale.setScalar(Math.max(invisible, puff.size * canopyGrowth * (1 + wobble * 0.22) * (1 - settle * 0.09)));
    }
    for (const puff of this.stem) {
      const growth = reveal(t, 0.34 + puff.height * 0.13, 0.7);
      const oscillation = Math.sin(t * 2.4 + puff.phase) * 0.07;
      puff.node.position.set(Math.cos(puff.angle + t * 0.16) * puff.radius, puff.height * (0.55 + canopyRise * 0.75) + oscillation + 0.2, Math.sin(puff.angle + t * 0.16) * puff.radius);
      puff.node.rotation.set(oscillation * 0.8, puff.phase + t * 0.09, oscillation * 0.6);
      puff.node.scale.setScalar(Math.max(invisible, puff.size * growth * (1 + oscillation) * (1 - settle * 0.2)));
    }
    for (const puff of this.dust) {
      const age = Math.max(0, t - 0.48), growth = reveal(t, 0.48, 0.35);
      const distance = 0.6 + Math.min(age, 2.6) * 1.44;
      puff.node.position.set(Math.cos(puff.angle) * distance, 0.17 + Math.sin(Math.min(1, age / 3.5) * Math.PI) * 0.34, Math.sin(puff.angle) * distance);
      puff.node.rotation.y = puff.phase + t * 0.1;
      puff.node.scale.setScalar(Math.max(invisible, puff.size * growth * (1 + Math.min(age, 2.5) * 0.37) * (1 - settle * 0.5)));
    }
    for (const puff of this.embers) {
      const age = Math.max(0, t - 0.27 - (puff.phase % 0.25)), progress = clamp(age / 3.3);
      const distance = 0.3 + progress * (2 + puff.radius * 2.1);
      puff.node.position.set(Math.cos(puff.angle) * distance, 0.25 + Math.sin(progress * Math.PI) * puff.height * 1.7, Math.sin(puff.angle) * distance);
      puff.node.rotation.set(progress * 5, puff.phase, progress * 3);
      puff.node.scale.setScalar(Math.max(invisible, puff.size * reveal(age, 0, 0.13) * (1 - smooth((progress - 0.65) / 0.35))));
    }
  }

  setMotion(_motion: EffectMotion) { this.mode = 'explode'; this.time = 0; this.pose('explode', 0); }
  update(dt: number) { this.time += Math.max(0, dt); this.pose('explode', this.time); }

  clips(fps = 20): THREE.AnimationClip[] {
    const count = Math.ceil(this.duration * Math.max(1, Math.min(120, Math.floor(fps))));
    const times: number[] = [];
    const samples = new Map<THREE.Group, { positions: number[]; rotations: number[]; scales: number[] }>();
    for (const node of Object.values(this.joints)) samples.set(node, { positions: [], rotations: [], scales: [] });
    for (let i = 0; i <= count; i++) {
      const t = i / count * this.duration; times.push(t); this.pose('explode', t);
      for (const [node, values] of samples) { values.positions.push(...node.position.toArray()); values.rotations.push(...node.quaternion.toArray()); values.scales.push(...node.scale.toArray()); }
    }
    const tracks: THREE.KeyframeTrack[] = [];
    for (const [node, values] of samples) {
      tracks.push(new THREE.VectorKeyframeTrack(`${node.name}.position`, times, values.positions));
      tracks.push(new THREE.QuaternionKeyframeTrack(`${node.name}.quaternion`, times, values.rotations));
      tracks.push(new THREE.VectorKeyframeTrack(`${node.name}.scale`, times, values.scales));
    }
    this.pose('explode', this.time);
    return [new THREE.AnimationClip('explode', this.duration, tracks)];
  }

  /** Full multi-phase bounds, so exporters include spreading dust and the entire mushroom. */
  bounds(samples = 40) {
    const bounds = new THREE.Box3();
    for (let i = 0; i <= samples; i++) { this.pose('explode', i / samples * this.duration); this.root.updateMatrixWorld(true); bounds.union(new THREE.Box3().setFromObject(this.root)); }
    this.pose('explode', this.time);
    return bounds;
  }
}
