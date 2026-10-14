import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

export type FactionId = 'legion' | 'heretics' | 'scrap' | 'necrons';
export type UnitRole = 'captain' | 'guard' | 'builder';
export type Motion = 'idle' | 'walk' | 'run' | 'attack' | 'shoot' | 'work' | 'death';
export type BuildingRole = 'hq' | 'barracks' | 'post' | 'turret';

export const FACTION_ART: Record<FactionId, { name: string; subtitle: string; primary: number; trim: number; metal: number; cloth: number; glow: number; skin: number }> = {
  legion: { name: 'Космодесант', subtitle: 'Синий легион', primary: 0x244a91, trim: 0xb79a52, metal: 0x343c49, cloth: 0x733938, glow: 0xf2634f, skin: 0x998774 },
  heretics: { name: 'Хаос', subtitle: 'Пепельный культ', primary: 0x79272d, trim: 0xae8551, metal: 0x242129, cloth: 0x482131, glow: 0xf07835, skin: 0x776059 },
  scrap: { name: 'Орки', subtitle: 'Железные кланы', primary: 0x935045, trim: 0xac9764, metal: 0x4c504e, cloth: 0x49332d, glow: 0xd5a455, skin: 0x657d43 },
  necrons: { name: 'Некроны', subtitle: 'Пробуждённые династии', primary: 0x394844, trim: 0xa18b54, metal: 0x606b68, cloth: 0x27362c, glow: 0x78ee51, skin: 0x737d76 },
};
export const ROLE_MOTIONS: Record<UnitRole, Motion[]> = {
  captain: ['idle', 'walk', 'run', 'attack', 'death'],
  guard: ['idle', 'walk', 'run', 'shoot', 'death'],
  builder: ['idle', 'walk', 'run', 'work', 'death'],
};
const DURATIONS: Record<Motion, number> = { idle: 2, walk: 1, run: 0.65, attack: 0.7, shoot: 0.45, work: 1.1, death: 1.1 };
const geometries = new Map<string, THREE.BufferGeometry>();
const materialCache = new Map<FactionId, Record<string, THREE.MeshStandardMaterial>>();
const surfacePixels = new Uint8Array(64 * 64 * 4);
for (let y = 0; y < 64; y++) for (let x = 0; x < 64; x++) {
  const n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  const edge = x < 2 || y < 2 || x > 61 || y > 61;
  const value = Math.floor(edge ? 160 + (n - Math.floor(n)) * 65 : 208 + (n - Math.floor(n)) * 47);
  const i = (y * 64 + x) * 4; surfacePixels[i] = surfacePixels[i + 1] = surfacePixels[i + 2] = value; surfacePixels[i + 3] = 255;
}
const surfaceTexture = new THREE.DataTexture(surfacePixels, 64, 64); surfaceTexture.needsUpdate = true;
surfaceTexture.magFilter = surfaceTexture.minFilter = THREE.NearestFilter;

function materials(id: FactionId) {
  let m = materialCache.get(id);
  if (m) return m;
  const a = FACTION_ART[id];
  m = {};
  for (const key of ['primary', 'trim', 'metal', 'cloth', 'glow', 'skin'] as const) {
    m[key] = new THREE.MeshStandardMaterial({ color: a[key], roughness: key === 'cloth' ? 0.95 : 0.65, metalness: ['metal', 'trim'].includes(key) ? 0.65 : 0.25, side: key === 'cloth' ? THREE.DoubleSide : THREE.FrontSide });
    m[key].name = key === 'primary' ? 'team_primary' : key === 'trim' ? 'team_trim' : key === 'glow' ? 'emissive' : key;
    if (key !== 'glow') m[key].map = surfaceTexture;
    if (key === 'glow') { m[key].emissive.setHex(a.glow); m[key].emissiveIntensity = 2.4; }
  }
  materialCache.set(id, m);
  return m;
}

function boxGeometry(w: number, h: number, d: number) {
  const key = `box:${w}:${h}:${d}`;
  if (!geometries.has(key)) {
    const b = Math.min(w, h, d) * 0.12;
    const s = new THREE.Shape();
    s.moveTo(-w / 2 + b, -h / 2 + b); s.lineTo(w / 2 - b, -h / 2 + b);
    s.lineTo(w / 2 - b, h / 2 - b); s.lineTo(-w / 2 + b, h / 2 - b); s.closePath();
    const g = new THREE.ExtrudeGeometry(s, { depth: d - b * 2, steps: 1, bevelEnabled: true, bevelSegments: 1, bevelSize: b, bevelThickness: b });
    g.translate(0, 0, -d / 2 + b);
    geometries.set(key, g);
  }
  return geometries.get(key)!;
}

function piece(parent: THREE.Object3D, geometry: THREE.BufferGeometry, mat: THREE.Material, pos: number[], rot?: number[]) {
  const mesh = new THREE.Mesh(geometry, mat);
  mesh.position.set(pos[0], pos[1], pos[2]);
  if (rot) mesh.rotation.set(rot[0], rot[1], rot[2]);
  mesh.castShadow = mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}
const box = (parent: THREE.Object3D, size: number[], pos: number[], mat: THREE.Material, rot?: number[]) => piece(parent, boxGeometry(size[0], size[1], size[2]), mat, pos, rot);
const cylinder = (parent: THREE.Object3D, top: number, bottom: number, height: number, pos: number[], mat: THREE.Material, rot?: number[], segments = 8) => piece(parent, new THREE.CylinderGeometry(top, bottom, height, segments), mat, pos, rot);
function joint(parent: THREE.Object3D, name: string, pos: number[]) {
  const g = new THREE.Group(); g.name = name; g.position.set(pos[0], pos[1], pos[2]); parent.add(g); return g;
}

// Merge decoration meshes per joint and material. Keep articulated groups and weapon sockets.
function compact(group: THREE.Group) {
  for (const child of [...group.children]) if (child instanceof THREE.Group) compact(child);
  const byMaterial = new Map<THREE.Material, THREE.Mesh[]>();
  for (const child of group.children) if (child instanceof THREE.Mesh && !Array.isArray(child.material)) {
    const list = byMaterial.get(child.material) ?? []; list.push(child); byMaterial.set(child.material, list);
  }
  for (const [mat, meshes] of byMaterial) if (meshes.length > 1) {
    const copies = meshes.map(mesh => { mesh.updateMatrix(); const g = mesh.geometry.index ? mesh.geometry.toNonIndexed() : mesh.geometry.clone(); return g.applyMatrix4(mesh.matrix); });
    const merged = mergeGeometries(copies);
    for (const g of copies) g.dispose();
    if (merged) { for (const mesh of meshes) group.remove(mesh); piece(group, merged, mat, [0, 0, 0]); }
  }
}

export class FactionActor {
  root = new THREE.Group();
  mode: Motion = 'idle';
  time = 0;
  readonly muzzle: THREE.Group;
  readonly joints: Record<string, THREE.Group>;

  constructor(readonly faction: FactionId, readonly role: UnitRole) {
    const m = materials(faction), heavy = role === 'captain', robot = faction === 'necrons', ork = faction === 'scrap';
    const width = ork ? 1.23 : robot ? 0.85 : 1;
    const rig = joint(this.root, 'Rig', [0, 0, 0]);
    rig.scale.setScalar((heavy ? (ork ? 2.5 : 2.2) : role === 'builder' ? 1.65 : 1.9) / 2.05);
    const pelvis = joint(rig, 'Pelvis', [0, 0.93, 0]);
    const torso = joint(pelvis, 'Torso', [0, 0.12, 0]);
    const head = joint(torso, 'Head', [0, 0.75, 0]);
    const armL = joint(torso, 'UpperArm_L', [-0.43 * width, 0.43, 0]);
    const armR = joint(torso, 'UpperArm_R', [0.43 * width, 0.43, 0]);
    const elbowL = joint(armL, 'Forearm_L', [0, -0.35, 0]);
    const elbowR = joint(armR, 'Forearm_R', [0, -0.35, 0]);
    const legL = joint(pelvis, 'Thigh_L', [-0.19 * width, -0.02, 0]);
    const legR = joint(pelvis, 'Thigh_R', [0.19 * width, -0.02, 0]);
    const kneeL = joint(legL, 'Shin_L', [0, -0.38, 0]);
    const kneeR = joint(legR, 'Shin_R', [0, -0.38, 0]);
    this.joints = { pelvis, torso, head, armL, armR, elbowL, elbowR, legL, legR, kneeL, kneeR };

    box(pelvis, [0.48 * width, 0.19, 0.32], [0, 0, 0], m.metal);
    box(pelvis, [0.12, 0.13, 0.05], [0, 0, 0.19], m.trim);
    for (const x of [-0.21, 0.21]) box(pelvis, [0.14, 0.17, 0.11], [x * width, -0.13, 0.2], m.cloth);
    if (robot) {
      box(torso, [0.11, 0.61, 0.17], [0, 0.24, -0.02], m.metal);
      for (let i = 0; i < 5; i++) {
        const w = 0.5 - i * 0.035;
        box(torso, [w, 0.035, 0.17], [0, 0.45 - i * 0.1, 0.07], m.metal);
        for (const s of [-1, 1]) box(torso, [0.05, 0.08, 0.1], [s * w / 2, 0.42 - i * 0.1, 0.14], m.trim, [0, 0, s * 0.25]);
      }
      cylinder(torso, 0.075, 0.075, 0.04, [0, 0.42, 0.17], m.glow, [Math.PI / 2, 0, 0]);
    } else {
      box(torso, [0.64 * width, 0.58, 0.4], [0, 0.25, 0], ork ? m.skin : m.primary);
      box(torso, [0.5 * width, 0.35, 0.07], [0, 0.32, 0.23], m.primary);
      box(torso, [0.52 * width, 0.045, 0.045], [0, 0.13, 0.275], m.trim);
      box(torso, [0.055, 0.2, 0.035], [0, 0.36, 0.28], m.trim);
      for (const s of [-1, 1]) box(torso, [0.14, 0.045, 0.04], [s * 0.1, 0.4, 0.285], m.trim, [0, 0, s * -0.35]);
      box(torso, [0.46, 0.45, 0.22], [0, 0.34, -0.32], m.metal);
      for (const s of [-1, 1]) {
        cylinder(torso, 0.08, 0.09, 0.46, [s * 0.25, 0.39, -0.34], m.primary);
        for (let i = 0; i < 3; i++) box(torso, [0.12, 0.035, 0.025], [s * 0.13, 0.3 + i * 0.085, -0.445], m.trim);
      }
    }

    box(head, [ork ? 0.39 : 0.29, 0.3, 0.31], [0, 0, 0.01], ork ? m.skin : robot ? m.metal : m.primary);
    box(head, [0.23, 0.12, 0.09], [0, -0.06, 0.2], ork ? m.skin : m.metal);
    for (const s of [-1, 1]) box(head, [0.065, 0.03, 0.018], [s * 0.073, 0.035, 0.183], m.glow, [0, 0, s * 0.15]);
    if (ork) {
      box(head, [0.42, 0.16, 0.31], [0, -0.14, 0.09], m.skin);
      for (const s of [-1, 1]) cylinder(head, 0.008, 0.045, 0.13, [s * 0.14, -0.08, 0.25], m.trim, [0.15, 0, -s * 0.3]);
      box(head, [0.35, 0.055, 0.31], [0, 0.17, -0.015], m.metal, [0, 0, 0.14]);
    } else if (robot) {
      box(head, [0.12, 0.08, 0.045], [0, -0.15, 0.16], m.trim);
      for (const x of [-0.06, 0, 0.06]) box(head, [0.023, 0.05, 0.015], [x, -0.105, 0.21], m.metal);
    } else {
      box(head, [0.09, 0.27, 0.045], [0, 0.02, 0.18], m.metal);
      for (const x of [-0.07, 0.07]) box(head, [0.03, 0.05, 0.035], [x, -0.06, 0.25], m.trim);
      box(head, [0.11, 0.035, 0.03], [0, 0.17, 0.05], m.trim);
    }

    for (const [arm, elbow, sign] of [[armL, elbowL, -1], [armR, elbowR, 1]] as const) {
      box(arm, [robot ? 0.11 : 0.24 * width, 0.31, robot ? 0.11 : 0.25], [0, -0.17, 0], ork ? m.skin : m.metal);
      box(elbow, [robot ? 0.11 : 0.22 * width, 0.29, robot ? 0.11 : 0.23], [0, -0.15, 0], robot ? m.metal : m.primary);
      box(elbow, [robot ? 0.12 : 0.17, 0.12, 0.16], [0, -0.33, 0], ork ? m.skin : m.metal);
      box(arm, [heavy ? 0.41 : 0.33, robot ? 0.13 : 0.27, 0.37], [sign * 0.04, 0, 0], m.primary, [0, 0, sign * -0.12]);
      box(arm, [heavy ? 0.42 : 0.34, 0.037, 0.37], [sign * 0.04, -0.12, 0], m.trim);
      if (heavy || ork) for (let i = 0; i < 3; i++) cylinder(arm, 0.018, 0.018, 0.027, [sign * 0.22, 0.025, -0.1 + i * 0.1], m.trim, [0, 0, Math.PI / 2], 6);
      if (faction === 'heretics') for (let i = 0; i < 3; i++) cylinder(arm, 0, 0.045, 0.19, [sign * 0.03, 0.21, -0.12 + i * 0.12], m.trim);
    }
    for (const [thigh, shin] of [[legL, kneeL], [legR, kneeR]]) {
      box(thigh, [robot ? 0.095 : 0.24 * width, 0.34, robot ? 0.1 : 0.28], [0, -0.19, 0], ork ? m.skin : robot ? m.metal : m.primary);
      box(shin, [robot ? 0.09 : 0.23 * width, 0.35, robot ? 0.1 : 0.27], [0, -0.19, 0], robot ? m.metal : m.primary);
      box(shin, [robot ? 0.16 : 0.28 * width, 0.16, 0.41], [0, -0.35, 0.07], m.metal);
      box(shin, [robot ? 0.11 : 0.21, 0.12, 0.055], [0, 0.01, 0.16], m.trim);
      if (robot) cylinder(shin, 0.06, 0.06, 0.13, [0, 0, 0], m.trim, [0, 0, Math.PI / 2]);
    }
    if (heavy) {
      if (robot) for (const x of [-0.17, 0, 0.17]) box(head, [0.045, 0.27, 0.07], [x, 0.22, 0], m.trim, [0, 0, -x]);
      else if (faction === 'heretics') for (const s of [-1, 1]) cylinder(head, 0, 0.07, 0.31, [s * 0.17, 0.22, 0], m.trim, [0, 0, s * -0.45]);
      else box(head, [0.09, 0.24, 0.25], [0, 0.23, 0], ork ? m.primary : m.trim);
      if (!robot) box(torso, [0.57, 0.65, 0.035], [0, 0.02, -0.5], m.cloth, [0.12, 0, 0]);
    }
    const weapon = joint(elbowR, 'Weapon', [0, -0.35, 0.02]);
    if (role === 'guard') {
      box(weapon, [0.2, 0.45, 0.24], [0, -0.18, 0], m.metal);
      box(weapon, [0.22, 0.21, 0.045], [0, -0.15, 0.145], m.primary);
      cylinder(weapon, 0.055, 0.055, 0.29, [0, -0.51, 0], m.metal);
      box(weapon, [0.13, 0.2, 0.15], [0.14, -0.2, 0], m.trim);
      if (robot) for (let i = 0; i < 3; i++) cylinder(weapon, 0.06, 0.06, 0.05, [0, -0.26 - i * 0.11, 0], m.glow);
      else for (let i = 0; i < 3; i++) box(weapon, [0.045, 0.05, 0.025], [0, -0.29 - i * 0.06, 0.135], m.trim);
    } else if (role === 'builder') {
      cylinder(weapon, 0.035, 0.035, 0.35, [0, -0.12, 0], m.metal);
      box(weapon, [0.23, 0.14, 0.14], [0, -0.3, 0], robot ? m.glow : m.trim);
      box(torso, [0.25, 0.24, 0.2], [0.28, 0.22, -0.41], m.trim);
    } else {
      cylinder(weapon, 0.03, 0.03, robot ? 1.05 : 0.24, [0, robot ? -0.45 : -0.07, 0], m.metal);
      if (robot || ork || faction === 'heretics') {
        box(weapon, [robot ? 0.5 : 0.39, 0.24, 0.075], [0.16, robot ? -0.87 : -0.3, 0], robot ? m.glow : m.trim, [0, 0, -0.3]);
      } else {
        box(weapon, [0.1, 0.77, 0.055], [0, -0.49, 0], m.trim);
        box(weapon, [0.28, 0.05, 0.09], [0, -0.11, 0], m.trim);
        box(elbowL, [0.44, 0.59, 0.07], [0, -0.26, 0.2], m.primary);
        for (const x of [-0.22, 0.22]) box(elbowL, [0.035, 0.59, 0.085], [x, -0.26, 0.2], m.trim);
      }
    }
    this.muzzle = joint(weapon, 'Muzzle', [0, -0.67, 0]);
    compact(rig);
    this.pose('idle', 0);
  }

  pose(mode: Motion, time: number) {
    const j = this.joints, duration = DURATIONS[mode], p = mode === 'death' ? Math.min(1, time / duration) : (time % duration) / duration;
    const wave = Math.sin(p * Math.PI * 2);
    for (const g of Object.values(j)) g.rotation.set(0, 0, 0);
    j.pelvis.position.set(0, 0.93, 0);
    j.head.rotation.y = wave * 0.04;
    if (this.role === 'guard') { j.armR.rotation.x = -1.35; j.armL.rotation.set(-1.22, -0.22, -0.26); j.elbowL.rotation.x = -0.22; }
    if (mode === 'walk' || mode === 'run') {
      const speed = mode === 'run' ? 0.82 : 0.48;
      j.legL.rotation.x = wave * speed; j.legR.rotation.x = -wave * speed;
      j.kneeL.rotation.x = Math.max(0, -wave) * speed; j.kneeR.rotation.x = Math.max(0, wave) * speed;
      j.pelvis.position.y += Math.abs(wave) * (mode === 'run' ? 0.055 : 0.025);
      j.torso.rotation.x = mode === 'run' ? 0.13 : 0.04; j.torso.rotation.z = wave * 0.04;
      if (this.role !== 'guard') { j.armL.rotation.x = -wave * speed; j.armR.rotation.x = wave * speed; }
    } else if (mode === 'attack') {
      j.armR.rotation.x = p < 0.4 ? -2.7 * p / 0.4 : -2.7 + 2.7 * Math.min(1, (p - 0.4) / 0.5);
      j.torso.rotation.y = Math.sin(p * Math.PI * 2) * 0.2;
      j.torso.rotation.x = Math.sin(p * Math.PI) * 0.18;
    } else if (mode === 'shoot') {
      const recoil = Math.max(0, 1 - Math.abs(p - 0.23) * 5);
      j.armR.rotation.x = -1.4 + recoil * 0.13; j.armL.rotation.x = -1.3 + recoil * 0.08;
      j.torso.rotation.x = -recoil * 0.1;
    } else if (mode === 'work') {
      j.armR.rotation.x = -1.15 - (wave * 0.5 + 0.5) * 1.2; j.torso.rotation.x = (wave * 0.5 + 0.5) * 0.14;
    } else if (mode === 'death') {
      const e = 1 - (1 - p) ** 3;
      j.pelvis.rotation.x = -e * Math.PI / 2; j.pelvis.position.y = 0.93 - e * 0.63;
      j.pelvis.position.z = -e * 0.22; j.armL.rotation.z = e * 0.32; j.armR.rotation.z = -e * 0.4;
      j.kneeL.rotation.x = e * 0.25;
    } else j.torso.rotation.x = wave * 0.013;
  }

  update(dt: number) { this.time += dt; this.pose(this.mode, this.time); }
  setMotion(mode: Motion) { this.mode = mode; this.time = 0; }

  clips() {
    const clips: THREE.AnimationClip[] = [];
    for (const mode of ROLE_MOTIONS[this.role]) {
      const duration = DURATIONS[mode], count = Math.ceil(duration * 30), times: number[] = [];
      const samples = new Map<THREE.Group, { positions: number[]; rotations: number[] }>();
      for (const g of Object.values(this.joints)) samples.set(g, { positions: [], rotations: [] });
      for (let i = 0; i <= count; i++) {
        const t = i / count * duration; times.push(t); this.pose(mode, t);
        for (const [g, values] of samples) { values.positions.push(...g.position.toArray()); values.rotations.push(...g.quaternion.toArray()); }
      }
      const tracks: THREE.KeyframeTrack[] = [];
      for (const [g, values] of samples) {
        tracks.push(new THREE.VectorKeyframeTrack(`${g.name}.position`, times, values.positions));
        tracks.push(new THREE.QuaternionKeyframeTrack(`${g.name}.quaternion`, times, values.rotations));
      }
      clips.push(new THREE.AnimationClip(mode, duration, tracks));
    }
    this.pose(this.mode, this.time);
    return clips;
  }
}

export function factionBuilding(faction: FactionId, role: BuildingRole = 'hq') {
  const m = materials(faction), g = new THREE.Group(); g.name = `${faction}_${role}`;
  const small = role === 'post' || role === 'turret', width = small ? 1.1 : role === 'hq' ? 3.8 : 2.7;
  box(g, [width + 0.4, 0.22, width + 0.4], [0, 0.11, 0], m.metal);
  if (role === 'turret') {
    cylinder(g, 0.35, 0.47, 0.6, [0, 0.48, 0], m.metal);
    const head = joint(g, 'TurretHead', [0, 0.8, 0]);
    box(head, [0.8, 0.38, 0.65], [0, 0, 0], m.primary);
    const barrels = joint(head, 'Barrels', [0, 0.05, 0.24]);
    for (const x of [-0.18, 0.18]) cylinder(barrels, 0.075, 0.075, 0.85, [x, 0, 0.4], faction === 'necrons' ? m.glow : m.metal, [Math.PI / 2, 0, 0]);
  } else if (role === 'post') {
    box(g, [0.55, 1.8, 0.55], [0, 1.12, 0], m.primary);
    box(g, [0.65, 0.15, 0.65], [0, 1.97, 0], m.trim);
    cylinder(g, 0.06, 0.06, 0.7, [0, 2.32, 0], m.trim);
    box(g, [0.14, 0.17, 0.14], [0, 2.7, 0], m.glow);
  } else if (faction === 'necrons') {
    for (let i = 0; i < 4; i++) box(g, [width - i * 0.65, 0.48, width - i * 0.65], [0, 0.48 + i * 0.46, 0], m.primary);
    box(g, [width * 0.37, 1.12, 0.06], [0, 0.9, width / 2 + 0.04], m.glow);
    for (const s of [-1, 1]) box(g, [0.12, 1.4, 0.18], [s * width * 0.23, 0.95, width / 2 + 0.05], m.trim);
    cylinder(g, 0, 0.28, 0.62, [0, 2.3, 0], m.glow, undefined, 4);
  } else {
    box(g, [width, 1.1, width * 0.8], [0, 0.78, 0], m.primary);
    box(g, [width + 0.14, 0.2, width * 0.85], [0, 1.42, 0], m.metal);
    box(g, [width * 0.31, 0.8, 0.08], [0, 0.65, width * 0.4 + 0.03], m.metal);
      for (let i = 0; i < 4; i++) box(g, [width * 0.42, 0.09, 0.35 + i * 0.16], [0, 0.36 - i * 0.065, width * 0.4 + 0.12 + i * 0.08], m.metal);
    for (let i = 0; i < 4; i++) box(g, [width * 0.35, 0.04, 0.015], [0, 0.4 + i * 0.16, width * 0.4 + 0.09], m.trim);
    for (const x of [-1, 1]) for (const z of [-1, 1]) {
      box(g, [0.45, 1.65, 0.45], [x * width * 0.44, 1.01, z * width * 0.32], m.metal);
      box(g, [0.49, 0.16, 0.49], [x * width * 0.44, 1.76, z * width * 0.32], m.trim);
      if (faction !== 'scrap') cylinder(g, 0, 0.25, role === 'hq' ? 0.75 : 0.28, [x * width * 0.44, 2.05, z * width * 0.32], m.primary, undefined, 4);
      box(g, [0.12, 0.35, 0.03], [x * width * 0.44, 1.31, z * width * 0.32 + 0.24], m.glow);
    }
    for (const s of [-1, 1]) for (const z of [-width * 0.22, width * 0.22]) {
      box(g, [0.16, 1.25, 0.23], [s * (width / 2 + 0.05), 0.92, z], m.trim);
      box(g, [0.16, 0.8, 0.23], [s * (width / 2 + 0.23), 0.46, z], m.metal, [0, 0, s * -0.35]);
    }
    if (role === 'hq') {
      box(g, [1.1, 0.8, 1.05], [0, 1.88, -0.25], m.primary);
      if (faction === 'scrap') {
        for (let i = 0; i < 3; i++) cylinder(g, 0.1, 0.1, 0.7 + i * 0.22, [0.3 - i * 0.3, 2.6, -0.3], m.metal);
        box(g, [0.65, 0.55, 0.06], [0.4, 1.13, width * 0.4 + 0.08], m.trim, [0, 0, 0.19]);
      } else cylinder(g, 0, 0.56, 1.1, [0, 2.76, -0.25], m.primary, undefined, 4);
      for (const x of [-0.33, 0, 0.33]) box(g, [0.09, 0.27, 0.05], [x, 1.97, 0.3], m.glow);
    }
  }
  compact(g);
  return g;
}
