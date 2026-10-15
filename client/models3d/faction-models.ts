// Модели фракций из faction-asset-lab (ветка claude/models). Тайминги броска гранаты — как в лаборатории.
const GRENADE_WINDUP = 0.35, GRENADE_FLIGHT = 0.75;
import * as THREE from 'three';
import { buildVehicle, type VehicleRole } from './vehicle-models.ts';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

export type FactionId = 'legion' | 'heretics' | 'scrap' | 'necrons' | 'drukhari' | 'daemons';
export const UNIT_ROLES = ['captain','guard','builder','sniper','heavy','flamer','elite','medic','transport','tank','walker','artillery','titan','scout','flyer'] as const;
export type UnitRole = typeof UNIT_ROLES[number];
/** Титан в 2,2 раза крупнее обычной модели: в лаборатории и в атласах он возвышается над техникой. */
export const TITAN_SCALE = 2.2;
export const VEHICLE_ROLES = new Set<UnitRole>(['transport','tank','walker','artillery','titan']);
export type Motion = 'idle' | 'idle_scan' | 'idle_inspect' | 'idle_taunt' | 'walk' | 'run' | 'attack' | 'attack_slash' | 'attack_thrust' | 'attack_overhead' | 'attack_combo' | 'attack_butt' | 'attack_slam' | 'throw_projectile' | 'execute' | 'throw_grenade' | 'fly' | 'dash_flight' | 'teleport' | 'shoot' | 'reload' | 'hit' | 'work' | 'death' | 'stunned' | 'knockback' | 'fall' | 'death_blast' | 'build' | 'capture';
export const BUILDING_ROLES = ['hq','barracks','post','turret','generator','factory','armory','relic','wall','gate'] as const;
export type BuildingRole = typeof BUILDING_ROLES[number];

export const FACTION_ART: Record<FactionId, { name: string; subtitle: string; primary: number; trim: number; metal: number; cloth: number; glow: number; skin: number }> = {
  legion: { name: 'Космодесант', subtitle: 'Синий легион', primary: 0x244a91, trim: 0xb79a52, metal: 0x343c49, cloth: 0x733938, glow: 0xf2634f, skin: 0x998774 },
  heretics: { name: 'Хаос', subtitle: 'Пепельный культ', primary: 0x79272d, trim: 0xae8551, metal: 0x242129, cloth: 0x482131, glow: 0xf07835, skin: 0x776059 },
  scrap: { name: 'Орки', subtitle: 'Железные кланы', primary: 0x935045, trim: 0xac9764, metal: 0x4c504e, cloth: 0x49332d, glow: 0xd5a455, skin: 0x657d43 },
  necrons: { name: 'Некроны', subtitle: 'Пробуждённые династии', primary: 0x394844, trim: 0xa18b54, metal: 0x606b68, cloth: 0x27362c, glow: 0x78ee51, skin: 0x737d76 },
  drukhari: { name: 'Тёмные Эльдар', subtitle: 'Налётчики Комморры', primary: 0x261d3c, trim: 0xa15cba, metal: 0x414454, cloth: 0x28192f, glow: 0x59e8d0, skin: 0xa2a2ba },
  daemons: { name: 'Демоны Хаоса', subtitle: 'Варп-легионы Апокалипсиса', primary: 0x8d223c, trim: 0xe6a74e, metal: 0x352139, cloth: 0x5c214a, glow: 0xff5a23, skin: 0xa43b56 },
};
export const ROLE_MOTIONS: Record<UnitRole, Motion[]> = {
  captain: ['idle', 'idle_scan', 'idle_inspect', 'idle_taunt', 'walk', 'run', 'attack', 'attack_slash', 'attack_thrust', 'attack_overhead', 'attack_combo', 'execute', 'throw_grenade', 'fly', 'dash_flight', 'teleport', 'death'],
  guard: ['idle', 'walk', 'run', 'shoot', 'death'],
  builder: ['idle', 'walk', 'run', 'work', 'death'],
  sniper: ['idle','walk','run','shoot','death'],
  heavy: ['idle','walk','run','shoot','death'],
  flamer: ['idle','walk','run','shoot','death'],
  elite: ['idle','idle_scan','idle_taunt','walk','run','attack_slash','attack_thrust','attack_combo','execute','throw_grenade','fly','dash_flight','teleport','shoot','death'],
  medic: ['idle','walk','run','shoot','death'],
  transport: ['idle','walk','run','shoot','death'],
  tank: ['idle','walk','run','shoot','death'],
  walker: ['idle','walk','run','shoot','death'],
  artillery: ['idle','walk','run','shoot','death'],
  titan: ['idle','walk','run','shoot','death'],
  scout: ['idle','idle_scan','walk','run','shoot','reload','hit','throw_grenade','death'],
  flyer: ['idle','idle_scan','fly','dash_flight','shoot','reload','hit','attack_slash','death'],
};
for (const role of UNIT_ROLES) {
  if (!ROLE_MOTIONS[role].includes('hit')) ROLE_MOTIONS[role].push('hit');
  if (ROLE_MOTIONS[role].includes('shoot') && !ROLE_MOTIONS[role].includes('reload')) ROLE_MOTIONS[role].push('reload');
}
export const LIGHT_UNIT_ROLES = new Set<UnitRole>(['guard','builder','sniper','medic','scout','flyer']);
for (const role of UNIT_ROLES) {
  if (!VEHICLE_ROLES.has(role)) ROLE_MOTIONS[role].push('stunned');
  if (LIGHT_UNIT_ROLES.has(role)) ROLE_MOTIONS[role].push('knockback','fall','death_blast');
  if (['guard','sniper','heavy'].includes(role)) ROLE_MOTIONS[role].push('attack_butt');
  if (role==='builder'||role==='titan') ROLE_MOTIONS[role].push('attack_slam');
  if (role==='captain'||role==='scout'||role==='titan') ROLE_MOTIONS[role].push('throw_projectile');
}
const DURATIONS: Record<Motion, number> = { idle: 2, idle_scan: 2.4, idle_inspect: 2.2, idle_taunt: 1.7, walk: 1, run: 0.65, attack: 0.7, attack_slash: 0.75, attack_thrust: 0.58, attack_overhead: 0.95, attack_combo: 1.25, attack_butt: 0.65, attack_slam: 1.15, throw_projectile: 1.3, execute: 1.6, throw_grenade: GRENADE_WINDUP + GRENADE_FLIGHT, fly: 1.2, dash_flight: 0.55, teleport: 0.8, shoot: 0.45, reload: 1.35, hit: 0.38, work: 1.1, death: 1.1, stunned: 1.4, knockback: 1.25, fall: 0.9, death_blast: 1.6, build: 1.8, capture: 1.6 };
const LOOP_MOTIONS = new Set<Motion>(['idle','idle_scan','idle_inspect','idle_taunt','walk','run','work','fly','stunned']);
/** Shared timing for procedural posing, GLB clips and PNG atlas metadata. */
export const motionDuration = (mode: Motion) => DURATIONS[mode];
export const motionLoops = (mode: Motion) => LOOP_MOTIONS.has(mode);
export function motionActionMarkers(mode: Motion): Record<string, number> {
  if (mode === 'throw_grenade') return { release: GRENADE_WINDUP, impact: DURATIONS[mode] };
  if (mode === 'throw_projectile') return { release: 0.45, impact: 1.1, ready: DURATIONS[mode] };
  if (mode === 'shoot') return { shot: DURATIONS[mode] * 0.23 };
  if (mode === 'reload') return { magazine: DURATIONS[mode] * 0.55, ready: DURATIONS[mode] };
  if (mode === 'attack_combo') return { impact: DURATIONS[mode] * 0.125, secondImpact: DURATIONS[mode] * 0.625 };
  if (mode.startsWith('attack') || mode === 'execute') return { impact: DURATIONS[mode] * (mode === 'attack' ? 0.4 : 0.5) };
  if (mode === 'knockback') return { impulse: 0, groundContact: DURATIONS[mode] * 0.8 };
  if (mode === 'fall') return { groundContact: DURATIONS[mode] * 0.8 };
  if (mode === 'death_blast') return { impulse: 0, debris: 0.12, groundContact: DURATIONS[mode] * 0.8 };
  if (mode === 'teleport') return { disappear: DURATIONS[mode] * 0.5, reappear: DURATIONS[mode] };
  if (mode === 'build') return { complete: DURATIONS[mode] };
  if (mode === 'capture') return { claimed: DURATIONS[mode] };
  return {};
}
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

/** Общие материалы ролей: белый медика, камуфляж снайпера, жёлто-чёрный «опасно» огнемётчика и строителя. */
let roleMats: Record<'white' | 'camo' | 'hazard', THREE.MeshStandardMaterial> | undefined;
function roleMaterials() {
  return roleMats ??= {
    white: new THREE.MeshStandardMaterial({ color: 0xe3ddcd, roughness: 0.6, metalness: 0.2, map: surfaceTexture }),
    camo: new THREE.MeshStandardMaterial({ color: 0x4d5a3a, roughness: 0.95, side: THREE.DoubleSide, map: surfaceTexture }),
    hazard: new THREE.MeshStandardMaterial({ color: 0xd8a62a, roughness: 0.55, metalness: 0.4, map: surfaceTexture }),
  };
}
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
  private readonly bindPose = new Map<THREE.Group, { position: THREE.Vector3; rotation: THREE.Quaternion; scale: THREE.Vector3 }>();

  private rememberBindPose() {
    for (const g of Object.values(this.joints)) this.bindPose.set(g, { position: g.position.clone(), rotation: g.quaternion.clone(), scale: g.scale.clone() });
  }

  private addThrowPayload(rig: THREE.Group, m: ReturnType<typeof materials>) {
    if(!ROLE_MOTIONS[this.role].includes('throw_projectile'))return;
    const payload=joint(rig,'ThrowPayload',[0,0,0]);this.joints.payload=payload;
    if(this.faction==='scrap')piece(payload,new THREE.DodecahedronGeometry(0.18),m.metal,[0,0,0]);
    else if(this.faction==='drukhari'){cylinder(payload,0.018,0.018,0.7,[0,0,0],m.metal);cylinder(payload,0,0.08,0.2,[0,0.45,0],m.trim,undefined,4);}
    else if(this.faction==='necrons'||this.faction==='daemons')piece(payload,new THREE.OctahedronGeometry(0.17),m.glow,[0,0,0]);
    else {cylinder(payload,0.08,0.1,0.2,[0,0,0],m.metal);box(payload,[0.1,0.06,0.07],[0,0.13,0],m.trim);}
    payload.scale.setScalar(0.0001);
  }

  private poseThrowPayload(mode: Motion, time: number) {
    const payload=this.joints.payload;if(!payload||mode!=='throw_projectile')return;
    const titan=this.role==='titan', scale=titan?1.8:1;
    const release=0.45, impact=1.1, flight=Math.max(0,Math.min(1,(time-release)/(impact-release)));
    const windup=Math.min(1,time/release), launchY=titan?this.bindPose.get(this.joints.hull)!.position.y+0.7:1.7;
    if(time<=impact){
      payload.scale.setScalar(scale);
      payload.position.set(titan?0.75:0.4,time<release?launchY-0.6*(1-windup):launchY*(1-flight)+Math.sin(flight*Math.PI)*(titan?1.25:0.85),0.25+flight*(titan?2.6:1.9));
      payload.rotation.x=flight*Math.PI*3;payload.rotation.z=flight*Math.PI*2;
    }
  }

  constructor(readonly faction: FactionId, readonly role: UnitRole) {
    const m = materials(faction);
    if(role==='titan') {
      // Each race has its own chassis and silhouette; retain the common animation sockets.
      const rig=joint(this.root,'Rig',[0,0,0]);
      const hull=joint(rig,'Hull',[0,faction==='drukhari'?1.3:faction==='necrons'?1.6:faction==='daemons'?1.55:2.05,0]);
      const turret=joint(hull,'Turret',[0,faction==='daemons'?0.35:0.9,faction==='daemons'?1.1:0.15]);
      const gun=joint(faction==='daemons'?turret:hull,'Gun',[faction==='legion'?0.9:0,-0.2,faction==='daemons'?0.35:0.75]);
      const left=joint(rig,'Drive_L',[-0.8,faction==='daemons'?1.2:1.35,faction==='daemons'?0.8:0]);
      const right=joint(rig,'Drive_R',[0.8,faction==='daemons'?1.2:1.35,faction==='daemons'?0.8:0]);
      this.joints={rig,hull,turret,gun,left,right};
      let muzzleZ=1.65;
      if(faction==='legion') {
        box(hull,[1.75,1.35,1.2],[0,0.05,0],m.primary);
        box(hull,[1.38,0.7,0.13],[0,0.15,0.68],m.trim);
        for(const sign of [-1,1]) {
          box(hull,[0.9,0.8,1.5],[sign*1.13,0.35,0],m.primary);
          box(hull,[0.94,0.12,1.54],[sign*1.13,-0.01,0],m.trim);
          box(hull,[0.18,1.1,0.2],[sign*0.58,0.9,-0.33],m.trim);
          cylinder(hull,0,0.15,0.55,[sign*0.58,1.7,-0.33],m.trim,undefined,4);
        }
        for(const drive of [left,right]) {
          cylinder(drive,0.25,0.25,0.6,[0,-0.08,0],m.trim,[0,0,Math.PI/2]);
          box(drive,[0.65,1.1,0.72],[0,-0.55,0],m.primary);
          box(drive,[0.8,0.27,1.08],[0,-1.13,0.2],m.metal);
          box(drive,[0.54,0.38,0.12],[0,-0.39,0.43],m.trim);
        }
        box(turret,[0.72,0.62,0.71],[0,0.12,0],m.primary);
        box(turret,[0.5,0.18,0.13],[0,0.12,0.4],m.metal);
        for(const x of [-0.14,0.14])box(turret,[0.13,0.055,0.04],[x,0.17,0.49],m.glow);
        box(gun,[0.7,0.65,0.75],[0,0,-0.18],m.primary);
        for(const x of [-0.2,0.2]) {cylinder(gun,0.15,0.15,1.55,[x,0,0.65],m.metal,[Math.PI/2,0,0]);cylinder(gun,0.18,0.18,0.16,[x,0,1.5],m.trim,[Math.PI/2,0,0]);}
        box(hull,[0.7,0.75,0.7],[-1.25,-0.35,0.7],m.primary);
      } else if(faction==='heretics') {
        box(hull,[1.62,1.18,1.25],[0,0.1,0],m.primary,[0,0,0.08]);
        cylinder(hull,0.38,0.52,0.4,[0,-0.45,0.57],m.glow,[Math.PI/2,0,0]);
        for(const sign of [-1,1]) {
          box(hull,[sign<0?1:0.72,0.65,1.32],[sign*1.07,0.35,0],m.metal,[0,0,-sign*0.17]);
          for(let i=0;i<3;i++)cylinder(hull,0,0.11,0.55+i*0.09,[sign*(0.75+i*0.18),0.94,-0.25+i*0.23],m.trim,[0,0,-sign*0.35]);
          const drive=sign<0?left:right;
          box(drive,[0.47,1.13,0.65],[0,-0.55,0],m.metal,[0,0,sign*0.08]);
          box(drive,[0.75,0.24,1],[0,-1.15,0.16],m.primary);
          for(let i=0;i<3;i++)cylinder(drive,0,0.09,0.25,[-0.2+i*0.2,-1.0,0.7],m.trim,[Math.PI/2,0,0]);
        }
        box(turret,[0.69,0.59,0.61],[0,0,0],m.metal);
        for(const sign of [-1,1])cylinder(turret,0,0.13,0.9,[sign*0.36,0.45,0],m.trim,[0,0,-sign*0.55]);
        box(turret,[0.32,0.08,0.04],[0,0.08,0.34],m.glow);
        gun.position.x=1.08;
        cylinder(gun,0.19,0.23,1.7,[0,0,0.65],m.metal,[Math.PI/2,0,0]);
        cylinder(gun,0.2,0.2,0.2,[0,0,1.52],m.glow,[Math.PI/2,0,0]);
        const chain=joint(hull,'ChainWeapon',[-1.14,-0.2,0.65]);this.joints.chain=chain;
        box(chain,[0.46,1.65,0.4],[0,-0.6,0],m.metal,[0.13,0,-0.13]);
        for(let i=0;i<7;i++)box(chain,[0.2,0.12,0.13],[-0.28,-0.04-i*0.23,0],m.trim,[0,0,-0.35]);
      } else if(faction==='scrap') {
        cylinder(hull,0.8,1.15,1.75,[0,-0.02,0],m.primary,undefined,10);
        box(hull,[1.15,0.75,0.12],[0,-0.1,1.04],m.metal,[0,0,0.12]);
        for(let i=0;i<5;i++)box(hull,[0.13,0.11,0.16],[-0.45+i*0.23,-0.27,1.14],m.trim);
        for(const drive of [left,right]) {box(drive,[0.63,1.03,0.78],[0,-0.54,0],m.metal);box(drive,[0.85,0.25,1.13],[0,-1.13,0.22],m.primary);}
        box(turret,[0.81,0.63,0.74],[0,0.12,0],m.primary,[0,0,0.09]);
        for(const x of [-0.22,0.18])box(turret,[0.13,0.08,0.06],[x,0.15,0.4],m.glow);
        for(let i=0;i<3;i++){cylinder(hull,0.13,0.13,1.15+i*0.33,[-0.62+i*0.43,1.19,-0.72],m.metal);cylinder(hull,0.2,0.2,0.13,[-0.62+i*0.43,1.78+i*0.16,-0.72],m.trim);}
        gun.position.x=1.12;
        box(gun,[0.8,0.64,0.7],[0,0,-0.08],m.primary,[0,0,-0.1]);
        for(const x of [-0.23,0.23])cylinder(gun,0.16,0.16,1.45,[x,0,0.6],m.metal,[Math.PI/2,0,0]);
        const claw=joint(hull,'HeavyClaw',[-1.28,0.17,0.42]);this.joints.claw=claw;
        box(claw,[0.48,1.05,0.48],[0,-0.37,0],m.metal);
        for(const sign of [-1,1])box(claw,[0.16,0.7,0.26],[sign*0.25,-1.05,0.12],m.trim,[0,0,-sign*0.3]);
      } else if(faction==='necrons') {
        cylinder(hull,0.15,1.7,2.05,[0,0.3,0],m.primary,[0,Math.PI/4,0],4);
        cylinder(hull,1.63,1.63,0.18,[0,-0.69,0],m.metal,[0,Math.PI/4,0],4);
        for(const sign of [-1,1]) {
          const pylon=sign<0?left:right;pylon.position.set(sign*1.45,0.85,0);
          box(pylon,[0.28,1.55,0.5],[0,0.21,0],m.metal);
          box(pylon,[0.13,1.2,0.12],[0,0.18,0.32],m.glow);
          cylinder(pylon,0.31,0.31,0.12,[0,-0.55,0],m.glow);
        }
        for(let i=0;i<3;i++)box(hull,[0.18,0.58,0.13],[-0.43+i*0.43,-0.18,1.1],m.glow,[0,0,0]);
        piece(turret,new THREE.OctahedronGeometry(0.5),m.glow,[0,0.43,0]);
        cylinder(turret,0.36,0.42,0.15,[0,-0.08,0],m.trim,undefined,4);
        cylinder(gun,0.1,0.16,1.4,[0,0,0.67],m.metal,[Math.PI/2,0,0]);
        for(let i=0;i<4;i++)cylinder(gun,0.14,0.14,0.1,[0,0,0.25+i*0.3],m.glow,[Math.PI/2,0,0]);
        muzzleZ=1.5;
      } else if(faction==='drukhari') {
        box(hull,[0.72,0.35,2.65],[0,0,0],m.primary);
        cylinder(hull,0,0.39,1.25,[0,0,1.55],m.metal,[Math.PI/2,0,0],4);
        for(const sign of [-1,1]) {
          const drive=sign<0?left:right;drive.position.set(sign*0.51,1.14,0);
          for(let i=0;i<3;i++) {
            const z=-0.85+i*0.82;
            box(drive,[1.2,0.08,0.11],[sign*0.47,-0.11,z],m.trim,[0,sign*(i-1)*0.25,sign*-0.4]);
            box(drive,[0.1,0.67,0.1],[sign*0.94,-0.66,z+(i-1)*0.14],m.metal,[0,0,-sign*0.28]);
          }
          box(hull,[0.075,1.8,0.5],[sign*0.35,0.7,-0.55],m.primary,[0,0,-sign*0.38]);
          cylinder(hull,0,0.11,0.75,[sign*0.76,1.75,-0.55],m.trim,undefined,4);
        }
        box(turret,[0.46,0.36,0.65],[0,-0.25,0],m.primary);
        cylinder(turret,0,0.14,0.7,[0,0.25,-0.15],m.trim,undefined,4);
        for(const x of [-0.25,0.25]) {cylinder(gun,0.045,0.09,2.2,[x,0,0.95],m.metal,[Math.PI/2,0,0]);cylinder(gun,0.075,0.075,0.17,[x,0,2],m.glow,[Math.PI/2,0,0]);}
        muzzleZ=2.2;
      } else {
        const flesh=piece(hull,new THREE.SphereGeometry(1,10,6),m.skin,[0,0,0]);flesh.scale.set(0.88,0.65,1.28);
        for(let i=0;i<5;i++)cylinder(hull,0,0.13,0.48,[0,0.7,-0.9+i*0.39],m.trim,[0.23,0,0]);
        const rearL=joint(rig,'RearLeg_L',[-0.8,1.2,-0.83]),rearR=joint(rig,'RearLeg_R',[0.8,1.2,-0.83]);this.joints.rearL=rearL;this.joints.rearR=rearR;
        for(const leg of [left,right,rearL,rearR]) {
          cylinder(leg,0.22,0.14,0.63,[0,-0.3,0],m.skin,[0.25,0,0]);
          cylinder(leg,0.14,0.11,0.53,[0,-0.79,0.1],m.skin,[-0.25,0,0]);
          for(const x of [-0.13,0,0.13])cylinder(leg,0,0.05,0.23,[x,-1.05,0.25],m.trim,[Math.PI/2,0,0]);
        }
        const skull=piece(turret,new THREE.SphereGeometry(0.5,8,5),m.skin,[0,0,0]);skull.scale.set(0.9,0.72,1.15);
        box(turret,[0.56,0.19,0.6],[0,-0.25,0.38],m.skin);
        for(const sign of [-1,1]) {
          cylinder(turret,0,0.16,0.97,[sign*0.4,0.47,-0.1],m.trim,[0,0,-sign*0.48]);
          box(turret,[0.09,0.07,0.04],[sign*0.21,0.13,0.47],m.glow);
          const wing=joint(hull,`BeastWing_${sign<0?'L':'R'}`,[sign*0.48,0.41,-0.33]);this.joints[sign<0?'beastWingL':'beastWingR']=wing;
          const membrane=new THREE.BufferGeometry();
          membrane.setAttribute('position',new THREE.Float32BufferAttribute([0,0,0,sign*1.35,0.55,-0.4,sign*0.9,-0.28,-0.6],3));
          membrane.setAttribute('uv',new THREE.Float32BufferAttribute([0,1,1,1,0.6,0],2));membrane.computeVertexNormals();piece(wing,membrane,m.cloth,[0,0,0]);
          cylinder(wing,0.035,0.08,1.5,[sign*0.65,0.27,-0.18],m.skin,[0,0,-sign*1.17]);
        }
        for(const x of [-0.2,0,0.2])cylinder(turret,0,0.045,0.21,[x,-0.06,0.62],m.trim);
        cylinder(gun,0.13,0.18,0.25,[0,0,0.22],m.glow,[Math.PI/2,0,0]);
        muzzleZ=0.45;
      }
      this.muzzle=joint(gun,'Muzzle',[0,0,muzzleZ]);
      this.addThrowPayload(rig,m);
      rig.scale.setScalar(TITAN_SCALE); // титан — на голову выше всей техники
      compact(rig);this.rememberBindPose();this.pose('idle',0);return;
    }
    if (VEHICLE_ROLES.has(role)) { // своя конструкция у каждой фракции и роли — vehicle-models.ts
      const v = buildVehicle({ box, cylinder, piece, joint }, this.root, faction, role as VehicleRole, m);
      this.muzzle = joint(v.gun, 'Muzzle', [0, 0, v.muzzleZ + 0.1]);
      this.joints = { rig: v.rig, hull: v.hull, turret: v.turret, gun: v.gun, left: v.left, right: v.right };
      if (v.rearL && v.rearR) { this.joints.rearL = v.rearL; this.joints.rearR = v.rearR; }
      if (v.tail) this.joints.tail = v.tail;
      this.addThrowPayload(v.rig, m);
      compact(v.rig); this.rememberBindPose(); this.pose('idle', 0); return;
    }
    const heavy = role === 'captain' || role === 'elite', robot = faction === 'necrons', ork = faction === 'scrap';
    const width = (ork ? 1.23 : robot ? 0.85 : faction==='drukhari'?0.76:faction==='daemons'?1.1:1) * (role === 'scout' ? 0.82 : 1);
    const rig = joint(this.root, 'Rig', [0, 0, 0]);
    rig.scale.setScalar((heavy ? (ork ? 2.5 : 2.2) : role === 'builder' || role === 'scout' ? 1.65 : 1.9) / 2.05);
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
    this.joints = { rig, pelvis, torso, head, armL, armR, elbowL, elbowR, legL, legR, kneeL, kneeR };

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
      box(torso, [0.64 * width, 0.58, 0.4], [0, 0.25, 0], ork || faction==='daemons' ? m.skin : m.primary);
      box(torso, [0.5 * width, 0.35, 0.07], [0, 0.32, 0.23], faction==='daemons'?m.skin:m.primary);
      box(torso, [0.52 * width, 0.045, 0.045], [0, 0.13, 0.275], m.trim);
      box(torso, [0.055, 0.2, 0.035], [0, 0.36, 0.28], m.trim);
      for (const s of [-1, 1]) box(torso, [0.14, 0.045, 0.04], [s * 0.1, 0.4, 0.285], m.trim, [0, 0, s * -0.35]);
      if (faction !== 'daemons') { // у демона нет ранца и брони — голое тело (рёбра ниже)
        box(torso, [0.46, 0.45, 0.22], [0, 0.34, -0.32], m.metal);
        for (const s of [-1, 1]) {
          cylinder(torso, 0.08, 0.09, 0.46, [s * 0.25, 0.39, -0.34], m.primary);
          for (let i = 0; i < 3; i++) box(torso, [0.12, 0.035, 0.025], [s * 0.13, 0.3 + i * 0.085, -0.445], m.trim);
        }
      }
    }

    box(head, [ork ? 0.39 : 0.29, 0.3, 0.31], [0, 0, 0.01], ork || faction==='daemons' ? m.skin : robot ? m.metal : m.primary);
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
      box(arm, [robot ? 0.11 : 0.24 * width, 0.31, robot ? 0.11 : 0.25], [0, -0.17, 0], ork || faction==='daemons' ? m.skin : m.metal);
      cylinder(elbow, 0.095, 0.095, robot ? 0.14 : 0.25, [0, 0, 0], m.trim, [0,0,Math.PI/2]);
      box(elbow, [robot ? 0.11 : 0.22 * width, 0.29, robot ? 0.11 : 0.23], [0, -0.15, 0], faction==='daemons'?m.skin:robot ? m.metal : m.primary);
      box(elbow, [robot ? 0.12 : 0.17, 0.12, 0.16], [0, -0.33, 0], ork ? m.skin : m.metal);
      if (faction !== 'daemons') { box(arm, [heavy ? 0.41 : 0.33, robot ? 0.13 : 0.27, 0.37], [sign * 0.04, 0, 0], m.primary, [0, 0, sign * -0.12]); box(arm, [heavy ? 0.42 : 0.34, 0.037, 0.37], [sign * 0.04, -0.12, 0], m.trim); } // у демона голые плечи
      if (heavy || ork) for (let i = 0; i < 3; i++) cylinder(arm, 0.018, 0.018, 0.027, [sign * 0.22, 0.025, -0.1 + i * 0.1], m.trim, [0, 0, Math.PI / 2], 6);
      if (faction === 'heretics') for (let i = 0; i < 3; i++) cylinder(arm, 0, 0.045, 0.19, [sign * 0.03, 0.21, -0.12 + i * 0.12], m.trim);
    }
    for (const [thigh, shin] of [[legL, kneeL], [legR, kneeR]]) {
      box(thigh, [robot ? 0.095 : 0.24 * width, 0.34, robot ? 0.1 : 0.28], [0, -0.19, 0], ork || faction==='daemons'?m.skin:robot ? m.metal : m.primary);
      box(shin, [robot ? 0.09 : 0.23 * width, 0.35, robot ? 0.1 : 0.27], [0, -0.19, 0], faction==='daemons'?m.skin:robot ? m.metal : m.primary);
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
    const daemonBlade = faction === 'daemons' && ['guard', 'elite', 'captain', 'scout'].includes(role), daemonFire = faction === 'daemons' && ['heavy', 'flamer', 'sniper', 'medic'].includes(role);
    if (daemonBlade) { // адский клинок: длинное лезвие, светящаяся кромка
      cylinder(weapon, 0.03, 0.03, 0.22, [0, -0.05, 0], m.metal);
      box(weapon, [0.12, 0.95, 0.04], [0, -0.62, 0], m.trim); box(weapon, [0.03, 0.9, 0.045], [0.05, -0.62, 0], m.glow); box(weapon, [0.3, 0.05, 0.08], [0, -0.15, 0], m.metal);
    } else if (daemonFire) { // варп-огонь в ладони
      piece(weapon, new THREE.IcosahedronGeometry(0.16, 1), m.glow, [0, -0.2, 0.05]); piece(elbowL, new THREE.IcosahedronGeometry(0.12, 1), m.glow, [0, -0.42, 0.05]);
    } else if (role !== 'captain' && role !== 'builder') {
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
    if(role==='sniper'&&faction!=='daemons') { cylinder(weapon,0.035,0.035,0.65,[0,-0.9,0],m.metal); box(weapon,[0.08,0.12,0.22],[0,-0.15,0.23],m.trim); }
    if(role==='heavy'&&faction!=='daemons') { for(const x of [-0.08,0.08])cylinder(weapon,0.04,0.04,0.6,[x,-0.65,0],m.metal); box(torso,[0.7,0.6,0.25],[0,0.3,-0.5],m.primary); }
    if(role==='flamer'&&faction!=='daemons') {for(const x of [-0.2,0.2])cylinder(torso,0.12,0.12,0.55,[x,0.35,-0.55],m.trim); cylinder(weapon,0.1,0.1,0.15,[0,-0.65,0],m.glow);}
    if(role==='medic') {box(torso,[0.22,0.07,0.05],[0,0.35,0.3],m.glow); box(torso,[0.07,0.22,0.05],[0,0.35,0.3],m.glow); box(elbowL,[0.28,0.22,0.2],[0,-0.3,0],m.trim);}
    if(role==='elite') { box(torso,[0.78,0.7,0.1],[0,0.25,0.24],m.primary); box(head,[0.25,0.08,0.37],[0,0.17,0],m.trim); }
    if(faction==='heretics'&&!heavy) {
      for(const sign of [-1,1])cylinder(head,0,0.04,0.3,[sign*0.16,0.23,-0.02],m.trim,[0,0,-sign*0.45]);
      for(let i=0;i<3;i++)box(torso,[0.055,0.045,0.05],[-0.11+i*0.11,0.2,0.31],m.glow,[0,0,i%2?.4:-.4]);
    }
    if(faction==='drukhari') {
      cylinder(head,0,0.14,0.33,[0,0.26,-0.035],m.primary,undefined,4);
      for(const sign of [-1,1]) {
        box(torso,[0.045,0.55,0.12],[sign*0.27,0.51,-0.22],m.trim,[0,0,-sign*0.3]);
        cylinder(sign<0?armL:armR,0,0.05,0.27,[sign*0.06,0.2,0],m.metal,[0,0,-sign*0.2],4);
      }
    }
    if(faction==='daemons') {
      for(const sign of [-1,1]) {
        cylinder(head,0,0.06,heavy?0.48:0.35,[sign*0.16,0.23,-0.03],m.trim,[0,0,-sign*0.4]);
        cylinder(head,0,0.035,0.15,[sign*0.11,-0.12,0.26],m.trim);
        for(const elbow of [elbowL,elbowR])cylinder(elbow,0,0.022,0.13,[sign*0.05,-0.39,0.07],m.trim);
        for(const knee of [kneeL,kneeR])cylinder(knee,0,0.025,0.19,[sign*0.07,-0.36,0.29],m.trim,[Math.PI/2,0,0]);
      }
      const tail=joint(pelvis,'DaemonTail',[0,-0.08,-0.19]);this.joints.tail=tail;
      cylinder(tail,0.025,0.09,0.72,[0,-0.1,-0.31],m.skin,[Math.PI/2+0.3,0,0]);
      cylinder(tail,0,0.07,0.21,[0,-0.18,-0.7],m.trim,[Math.PI/2,0,0]);
      for(let i=0;i<3;i++)cylinder(torso,0,0.06,0.23,[0,0.24+i*0.13,-0.46],m.trim,[Math.PI/2-0.3,0,0]);
    }
    if(role==='scout') {
      // A smaller silhouette with reconnaissance optics and a short cloak, not a guard recolor.
      box(head,[0.34,0.075,0.05],[0,0.025,0.195],m.metal);
      cylinder(head,0.055,0.055,0.07,[0.12,0.025,0.235],m.glow,[Math.PI/2,0,0]);
      cylinder(torso,0.012,0.018,0.68,[-0.22,0.79,-0.33],m.trim);
      const cloak=joint(torso,'ScoutCloak',[0,0.45,-0.43]);
      box(cloak,[0.55,0.78,0.035],[0,-0.39,0],m.cloth,[0.15,0,0]);
      this.joints.cloak=cloak;
      box(weapon,[0.1,0.1,0.18],[0,-0.09,0.22],m.trim);
      cylinder(weapon,0.032,0.032,0.26,[0,-0.63,0],m.metal);
    }
    if (faction === 'daemons') { // тело демона: рёбра, вытянутый череп с пастью, копыта со шпорами
      for (let i = 0; i < 4; i++) for (const sg of [-1, 1]) box(torso, [0.2, 0.035, 0.05], [sg * 0.13, 0.15 + i * 0.1, 0.25], m.trim, [0, 0, sg * 0.25]);
      box(head, [0.22, 0.12, 0.22], [0, -0.1, 0.22], m.skin); for (const x of [-0.07, 0, 0.07]) cylinder(head, 0, 0.025, 0.09, [x, -0.17, 0.32], m.trim, [Math.PI, 0, 0], 4);
      for (const knee of [kneeL, kneeR]) { box(knee, [0.16, 0.1, 0.24], [0, -0.38, 0.04], m.trim); cylinder(knee, 0, 0.045, 0.25, [0, -0.2, -0.2], m.trim, [-1.2, 0, 0], 5); }
    } else {
      const extra = roleMaterials();
      if (role === 'sniper') { box(head, [0.36, 0.34, 0.36], [0, 0.03, -0.03], m.cloth); box(torso, [0.66, 1.0, 0.04], [0, -0.05, -0.42], extra.camo, [0.12, 0, 0]); for (let i = 0; i < 3; i++) box(torso, [0.68, 0.06, 0.05], [0, 0.25 - i * 0.28, -0.44 + i * 0.03], m.cloth, [0.12, 0, 0]); } // капюшон и маскплащ
      if (role === 'heavy') { cylinder(torso, 0.24, 0.24, 0.62, [0, 0.32, -0.6], m.metal, [0, 0, Math.PI / 2], 10); for (let i = 0; i < 5; i++) box(torso, [0.06, 0.08, 0.05], [0.28 + i * 0.03, 0.1 - i * 0.09, -0.2 + i * 0.08], m.trim); for (const a of [armL, armR]) box(a, [0.5, 0.3, 0.46], [0, 0.05, 0], m.primary); } // барабан и лента
      if (role === 'flamer') { for (const x of [-0.2, 0.2]) { cylinder(torso, 0.15, 0.15, 0.72, [x, 0.35, -0.6], extra.hazard, undefined, 10); piece(torso, new THREE.SphereGeometry(0.15, 10, 6), extra.hazard, [x, 0.71, -0.6]); } cylinder(torso, 0.03, 0.03, 0.6, [0.3, 0.05, -0.35], m.metal, [0.6, 0, 0]); } // баки и шланг
      if (role === 'medic') { box(head, [0.31, 0.32, 0.33], [0, 0.0, 0.01], extra.white); for (const a of [armL, armR]) box(a, [0.36, 0.28, 0.4], [0, 0.02, 0], extra.white); for (const x of [-0.12, 0, 0.12]) cylinder(torso, 0.05, 0.05, 0.22, [x, 0.62, -0.42], m.glow); }
      if (role === 'elite') { for (const [a, sg] of [[armL, -1], [armR, 1]] as const) { box(a, [0.62, 0.42, 0.56], [sg * 0.06, 0.05, 0], m.primary, [0, 0, sg * -0.15]); box(a, [0.64, 0.06, 0.58], [sg * 0.06, -0.15, 0], m.trim); } box(elbowL, [0.34, 0.34, 0.34], [0, -0.42, 0.02], m.metal); box(elbowL, [0.36, 0.08, 0.36], [0, -0.3, 0.02], m.glow); } // наплечники и силовой кулак
      if (role === 'builder') { const arm = joint(torso, 'ServoArm', [0.18, 0.62, -0.4]); cylinder(arm, 0.05, 0.05, 0.6, [0, 0.25, 0.1], m.metal, [0.4, 0, 0]); cylinder(arm, 0.04, 0.04, 0.55, [0, 0.45, 0.45], m.metal, [1.4, 0, 0]); for (const sg of [-1, 1]) box(arm, [0.04, 0.18, 0.05], [sg * 0.06, 0.38, 0.73], extra.hazard, [0.4, 0, 0]); box(head, [0.34, 0.08, 0.34], [0, 0.17, 0], extra.hazard); } // механическая рука и каска
      if (role === 'captain') { cylinder(torso, 0.025, 0.025, 1.3, [-0.25, 0.85, -0.45], m.metal); box(torso, [0.42, 0.55, 0.02], [-0.04, 1.2, -0.45], m.cloth); box(torso, [0.42, 0.06, 0.03], [-0.04, 1.47, -0.45], m.trim); } // знамя
    }
    if(role==='flyer') {
      const flightL=joint(torso,'Flight_L',[-0.25,0.42,-0.34]);
      const flightR=joint(torso,'Flight_R',[0.25,0.42,-0.34]);
      this.joints.flightL=flightL; this.joints.flightR=flightR;
      if(faction==='drukhari'||faction==='daemons') {
        for(const [wing,sign] of [[flightL,-1],[flightR,1]] as const) {
          const tip=joint(wing,`WingTip_${sign<0?'L':'R'}`,[sign*0.53,0.14,-0.06]);
          this.joints[sign<0?'wingTipL':'wingTipR']=tip;
          cylinder(wing,0.035,0.055,0.57,[sign*0.25,0.08,0],m.trim,[0,0,-sign*1.32]);
          if(faction==='drukhari') {
            for(let k=0;k<4;k++) box(wing,[0.1,0.46-k*0.035,0.055],[sign*(0.12+k*0.13),-0.17-k*0.03,0],m.primary,[0,0,-sign*(0.16+k*0.1)]);
            for(let k=0;k<3;k++) box(tip,[0.095,0.4-k*0.035,0.055],[sign*(0.04+k*0.13),-0.16-k*0.055,0],m.trim,[0,0,-sign*(0.35+k*0.13)]);
          } else {
            // Two rigid membrane sections follow independent shoulder and tip joints.
            const membrane=new THREE.BufferGeometry();
            membrane.setAttribute('position',new THREE.Float32BufferAttribute([0,0,0,sign*0.55,0.14,-0.06,sign*0.4,-0.38,0,0,0,0,sign*0.4,-0.38,0,sign*0.05,-0.22,0],3));
            membrane.setAttribute('uv',new THREE.Float32BufferAttribute([0,1,1,1,1,0,0,1,1,0,0,0],2)); membrane.computeVertexNormals();
            piece(wing,membrane,m.cloth,[0,0,0]);
            const outer=new THREE.BufferGeometry();
            outer.setAttribute('position',new THREE.Float32BufferAttribute([0,0,0,sign*0.47,-0.03,0,sign*0.24,-0.4,0],3));
            outer.setAttribute('uv',new THREE.Float32BufferAttribute([0,1,1,1,0.5,0],2));outer.computeVertexNormals();piece(tip,outer,m.cloth,[0,0,0]);
            cylinder(tip,0,0.05,0.5,[sign*0.22,-0.02,0],m.trim,[0,0,-sign*1.4]);
          }
        }
      } else if(faction==='necrons') {
        // A destroyer-style antigravity chassis replaces the new flyer's walking legs.
        for(const part of [legL,legR,kneeL,kneeR]) for(const child of [...part.children]) {
          if(child instanceof THREE.Mesh) part.remove(child);
        }
        const hoverBase=joint(pelvis,'HoverChassis',[0,-0.24,0]);
        this.joints.hoverBase=hoverBase;
        box(hoverBase,[0.95,0.24,1.13],[0,0,-0.04],m.primary);
        box(hoverBase,[0.49,0.15,0.52],[0,0.06,0.57],m.trim,[0.15,0,0]);
        cylinder(hoverBase,0.4,0.31,0.09,[0,-0.18,-0.08],m.glow);
        for(const sign of [-1,1]) box(hoverBase,[0.08,0.1,0.76],[sign*0.48,-0.06,-0.05],m.trim);
        for(const [engine,sign] of [[flightL,-1],[flightR,1]] as const) {
          box(engine,[0.16,0.54,0.33],[sign*0.12,0.02,0],m.metal);
          cylinder(engine,0.17,0.17,0.075,[sign*0.12,-0.3,0],m.glow);
          cylinder(engine,0.11,0.11,0.065,[sign*0.12,0.32,0],m.trim);
        }
      } else {
        for(const [engine,sign] of [[flightL,-1],[flightR,1]] as const) {
          const big=faction==='scrap';
          cylinder(engine,0.11,big?0.18:0.14,big?0.78:0.58,[sign*0.08,0,0],m.primary);
          cylinder(engine,0.07,0.12,0.12,[sign*0.08,-(big?0.45:0.34),0],m.metal);
          const exhaust=joint(engine,`Exhaust_${sign<0?'L':'R'}`,[sign*0.08,-(big?0.48:0.37),0]);
          this.joints[sign<0?'exhaustL':'exhaustR']=exhaust;
          cylinder(exhaust,0.09,0.025,0.28,[0,-0.14,0],m.glow);
          if(big) cylinder(engine,0,0.13,0.22,[sign*0.08,0.5,0],m.trim);
          if(faction==='heretics') cylinder(engine,0,0.06,0.25,[sign*0.2,0.25,0],m.trim,[0,0,-sign*0.35]);
        }
      }
    }
    this.muzzle = joint(weapon, 'Muzzle', [0, -0.67, 0]);
    this.addThrowPayload(rig,m);
    compact(rig);
    this.rememberBindPose();
    this.pose('idle', 0);
  }

  pose(mode: Motion, time: number) {
    time = Math.max(0, time);
    const j = this.joints;
    for (const [group, bind] of this.bindPose) { group.position.copy(bind.position); group.quaternion.copy(bind.rotation); group.scale.copy(bind.scale); }
    if(VEHICLE_ROLES.has(this.role)) {
      const p=['idle','walk','run','work','fly'].includes(mode)?(time%DURATIONS[mode])/DURATIONS[mode]:Math.min(1,time/DURATIONS[mode]), w=Math.sin(p*Math.PI*2);
      j.turret.rotation.y=mode==='idle'?w*0.1:0; j.gun.rotation.x=this.role==='artillery'?-0.35:0;
      j.left.rotation.x=j.right.rotation.x=0;
      if(mode==='walk'||mode==='run'){
        j.hull.position.y+=Math.abs(w)*0.035;
        if(this.role==='walker'||this.role==='titan'){j.left.rotation.x=w*0.3;j.right.rotation.x=-w*0.3;}
        if(this.role==='titan'&&this.faction==='necrons') {j.rig.position.y=0.12+w*0.055;j.left.rotation.x=w*0.05;j.right.rotation.x=-w*0.05;j.turret.rotation.y=w*0.25;}
        if(this.role==='titan'&&this.faction==='drukhari') {j.hull.rotation.z=w*0.055;j.left.rotation.x=w*0.12;j.right.rotation.x=-w*0.12;}
        if(j.rearL){j.rearL.rotation.x=-w*0.3;j.rearR.rotation.x=w*0.3;}
      }
      if(this.role==='titan') {
        if(this.faction==='necrons'&&mode==='idle')j.rig.position.y=0.12+w*0.055;
        if(j.chain)j.chain.rotation.x=w*0.18;
        if(j.claw)j.claw.rotation.z=w*0.1;
        if(j.beastWingL){j.beastWingL.rotation.z=-0.2-w*0.15;j.beastWingR.rotation.z=0.2+w*0.15;}
      }
      if(j.tail){j.tail.rotation.y=w*0.3;if(mode==='walk'||mode==='run'){j.left.rotation.x=w*0.18;j.right.rotation.x=-w*0.18;}}
      if(mode==='shoot'||mode==='attack'){const kick=Math.max(0,1-Math.abs(p-0.23)*6);j.gun.position.z-=kick*0.25;j.hull.rotation.x=-kick*0.06;}
      if(mode==='hit'){j.hull.rotation.z=Math.sin(p*Math.PI*2)*0.1*(1-p);j.hull.position.z=-Math.sin(p*Math.PI)*0.12;}
      if(mode==='reload'){j.gun.rotation.x-=Math.sin(p*Math.PI)*0.25;j.turret.rotation.y=Math.sin(p*Math.PI)*0.22;}
      if(mode==='attack_slam'){const slam=Math.sin(p*Math.PI);j.hull.rotation.x=slam*0.48;j.gun.rotation.x=-slam*1.1;j.left.rotation.x=-slam*0.16;j.right.rotation.x=-slam*0.16;}
      if(mode==='throw_projectile'){const windup=Math.min(1,time/0.45),release=Math.max(0,Math.min(1,(time-0.45)/0.25)),recover=Math.max(0,Math.min(1,(time-0.7)/0.6));j.hull.rotation.x=(-windup*0.16+release*0.4)*(1-recover);j.gun.rotation.x=(-windup*1.1+release*1.6)*(1-recover);}
      if(mode==='death'){
        j.hull.rotation.z=p*(this.role==='titan'&&this.faction==='daemons'?0.95:0.3);
        j.hull.position.y-=p*(this.role==='titan'&&this.faction==='daemons'?0.85:0.45);j.turret.rotation.y=p*0.7;
      }this.poseThrowPayload(mode,time);return;
    }
    j.pelvis.position.z=0;
    const duration = DURATIONS[mode], looping = motionLoops(mode);
    const p = looping ? (time % duration) / duration : Math.min(1, time / duration);
    const wave = Math.sin(p * Math.PI * 2);
    j.pelvis.position.set(0, 0.93, 0);
    j.head.rotation.y = wave * 0.04;
    if (this.role !== 'captain' && this.role !== 'builder') { j.armR.rotation.set(-0.65,0,-0.4); j.elbowR.rotation.set(-0.75,0,0.1); }
    if (mode === 'walk' || mode === 'run') {
      const speed = mode === 'run' ? 0.82 : 0.48;
      j.legL.rotation.x = wave * speed; j.legR.rotation.x = -wave * speed;
      j.kneeL.rotation.x = Math.max(0, -wave) * speed; j.kneeR.rotation.x = Math.max(0, wave) * speed;
      j.pelvis.position.y += Math.abs(wave) * (mode === 'run' ? 0.055 : 0.025);
      j.torso.rotation.x = mode === 'run' ? 0.13 : 0.04; j.torso.rotation.z = wave * 0.04;
      if ((this.role === 'captain' || this.role === 'builder')) { j.armL.rotation.x = -wave * speed; j.armR.rotation.x = wave * speed; }
    } else if (mode === 'idle_scan' || mode === 'idle_inspect' || mode === 'idle_taunt') {
      const inspect=(1-Math.cos(p*Math.PI*2))*0.5;
      j.head.rotation.y = mode === 'idle_scan' ? Math.sin(p * Math.PI * 2) * 0.6 : mode === 'idle_inspect' ? -inspect*0.35 : 0.2;
      if(mode==='idle_inspect')j.head.rotation.x=inspect*0.18;
      j.torso.rotation.y = mode === 'idle_scan' ? Math.sin(p * Math.PI * 2) * 0.22 : mode === 'idle_taunt' ? 0.16 : 0;
      j.armR.rotation.x = mode === 'idle_inspect' ? -0.35-inspect*0.85 : mode === 'idle_taunt' ? -2.2 * Math.sin(p * Math.PI) : -0.35;
      if(mode==='idle_inspect')j.elbowR.rotation.x=-inspect*0.45;
      j.armL.rotation.z = mode === 'idle_taunt' ? -0.6 * Math.sin(p * Math.PI) : 0.08;
    } else if (mode === 'throw_grenade' || mode === 'throw_projectile') {
      // Wind-up, overhand release and follow-through.
      const windupDuration=mode==='throw_projectile'?0.45:GRENADE_WINDUP;
      const windup = Math.min(1, time / windupDuration);
      const release = Math.max(0, Math.min(1, (time - windupDuration) / 0.25));
      const recovery = Math.max(0, Math.min(1, (time - windupDuration - 0.25) / (duration-windupDuration-0.25)));
      const settle = 1 - recovery;
      j.armR.rotation.x = (-0.35 + windup * 2.1 - release * 3.5) * settle;
      j.armR.rotation.z = (-0.35 + release * 0.8) * settle;
      j.torso.rotation.y = (-0.45 * windup + release * 0.85) * settle;
      j.torso.rotation.x = (-0.15 * windup + 0.3 * release) * settle;
      j.legL.rotation.x = -0.25 * windup * settle;
    } else if (mode === 'attack_slash' || mode === 'attack_thrust' || mode === 'attack_overhead' || mode === 'attack_combo' || mode === 'execute') {
      const strike = mode === 'attack_combo' ? Math.sin(p * Math.PI * 4) : Math.sin(p * Math.PI);
      j.armR.rotation.x = mode === 'attack_thrust' ? -1.2 + strike * 0.9 : mode === 'attack_overhead' ? -2.8 + strike * 2.4 : mode === 'execute' ? -2.9 + strike * 2.7 : -1.1 - strike * 1.5;
      j.armR.rotation.z = mode === 'attack_slash' ? strike * 1.25 : mode === 'attack_combo' ? strike * 1.1 : 0;
      j.torso.rotation.y = (mode === 'attack_combo' ? Math.sin(p * Math.PI * 4) : Math.sin(p * Math.PI * 2)) * 0.5;
      j.torso.rotation.x = mode === 'execute' ? Math.sin(p * Math.PI) * 0.5 : strike * 0.16;
      j.pelvis.position.z = mode === 'attack_thrust' ? Math.sin(p * Math.PI) * 0.24 : 0;
      j.legL.rotation.x = mode === 'attack_thrust' ? -strike * 0.4 : 0;
    } else if (mode === 'attack_butt' || mode === 'attack_slam') {
      const strike=Math.sin(p*Math.PI),slam=mode==='attack_slam';
      j.armR.rotation.x=-0.65-strike*(slam?1.8:0.6);j.elbowR.rotation.x=-0.75+strike*(slam?0.3:0.5);
      j.torso.rotation.y=Math.sin(p*Math.PI*2)*(slam?0.15:0.35);j.torso.rotation.x=strike*(slam?0.4:0.16);
      j.pelvis.position.z=strike*(slam?0.08:0.18);j.legL.rotation.x=-strike*0.22;
    } else if (mode === 'attack') {
      j.armR.rotation.x = p < 0.4 ? -2.7 * p / 0.4 : -2.7 + 2.7 * Math.min(1, (p - 0.4) / 0.5);
      j.torso.rotation.y = Math.sin(p * Math.PI * 2) * 0.2;
      j.torso.rotation.x = Math.sin(p * Math.PI) * 0.18;
    } else if (mode === 'shoot') {
      const recoil = Math.max(0, 1 - Math.abs(p - 0.23) * 5);
      j.armR.rotation.x = -0.65 + recoil * 0.08; j.elbowR.rotation.x = -0.75 + recoil * 0.05;
      j.torso.rotation.x = -recoil * 0.1;
    } else if (mode === 'work') {
      j.armR.rotation.x = -1.15 - (wave * 0.5 + 0.5) * 1.2; j.torso.rotation.x = (wave * 0.5 + 0.5) * 0.14;
    } else if (mode === 'hit') {
      const recoil=Math.sin(p*Math.PI)*(1-p); j.torso.rotation.x=-recoil*0.4;j.head.rotation.x=recoil*0.2;j.pelvis.position.z=-recoil*0.15;
    } else if (mode === 'reload') {
      const reach=Math.sin(p*Math.PI), seat=Math.max(0,1-Math.abs(p-0.55)/0.18);
      j.armR.rotation.x=-0.65-reach*0.25;j.elbowR.rotation.x=-0.75-reach*0.05;
      j.armL.rotation.x=-reach*0.9;j.armL.rotation.z=-reach*0.45;j.elbowL.rotation.x=-reach*1.1-seat*0.2;j.head.rotation.x=reach*0.2;
    } else if (mode === 'stunned') {
      j.torso.rotation.z=wave*0.11;j.head.rotation.x=0.3;j.head.rotation.z=-wave*0.17;j.armR.rotation.x=-0.1;j.elbowR.rotation.x=-0.15;j.pelvis.position.y-=0.08+Math.cos(p*Math.PI*2)*0.025;
    } else if (mode === 'knockback' || mode === 'fall' || mode === 'death_blast') {
      const travel=mode==='fall'?0.22:mode==='death_blast'?1.6:1.1;
      const rise=mode==='fall'?0:mode==='death_blast'?0.9:0.65;
      const flight=Math.min(1,p/0.8), settle=Math.max(0,(p-0.8)/0.2);
      j.rig.position.z=-travel*flight;j.rig.position.y=Math.sin(flight*Math.PI)*rise;
      const tumble=Math.min(1,p/0.8);
      j.pelvis.rotation.x=-tumble*Math.PI/2;j.pelvis.position.y=0.93-tumble*0.51;
      j.torso.rotation.z=Math.sin(flight*Math.PI)*0.35;j.armL.rotation.z=-0.65*flight;j.armR.rotation.z=0.8*flight;j.kneeL.rotation.x=0.5*flight;j.kneeR.rotation.x=0.25*flight;
      if(mode==='death_blast') {
        const burst=Math.max(0,Math.min(1,(time-0.12)/(DURATIONS[mode]*0.8-0.12)));
        for(const [part,x,y,z] of [[j.armL,-0.95,0.45,-0.2],[j.armR,1.05,0.65,-0.35],[j.legL,-0.65,0.2,-0.45],[j.legR,0.65,0.35,0.35],[j.head,0.15,0.7,-0.3]] as const) {
          // Pelvis lies backward: local positive z moves fragments down toward the floor.
          part.position.x+=x*burst;part.position.y+=y*burst;
          part.position.z+=z*Math.sin(burst*Math.PI)+0.32*burst;
          part.rotation.z+=x*burst*2;part.rotation.y+=z*burst*3;
        }
        if(j.hoverBase){j.hoverBase.position.x+=burst*0.75;j.hoverBase.rotation.z=burst*1.3;}
        if(j.flightL){j.flightL.position.x-=burst*0.5;j.flightR.position.x+=burst*0.6;}
      }
      j.rig.position.y+=Math.sin(settle*Math.PI)*0.035;
    } else if (mode === 'death') {
      const e = 1 - (1 - p) ** 3;
      j.pelvis.rotation.x = -e * Math.PI / 2; j.pelvis.position.y = 0.93 - e * 0.63;
      j.pelvis.position.z = -e * 0.22; j.armL.rotation.z = e * 0.32; j.armR.rotation.z = -e * 0.4;
      j.kneeL.rotation.x = e * 0.25;
    } else j.torso.rotation.x = wave * 0.013;
    if (mode === 'fly' || mode === 'dash_flight' || (this.role==='flyer' && (mode==='idle'||mode==='idle_scan'||mode==='shoot'||mode==='reload'||mode==='hit'))) {
      const dash=mode==='dash_flight'?Math.sin(p*Math.PI):0;
      j.rig.position.y=0.6+wave*0.1+dash*0.15;j.rig.rotation.x=0.08-dash*0.4;
      if(mode==='dash_flight') j.rig.position.z=-Math.sin(p*Math.PI)*0.8;
      j.legL.rotation.x=0.3+wave*0.12;j.legR.rotation.x=-0.18-wave*0.1;j.kneeL.rotation.x=0.65;j.kneeR.rotation.x=0.45;
      if(j.flightL){
        if(j.wingTipL){
          j.flightL.rotation.z=-wave*0.65;j.flightR.rotation.z=wave*0.65;
          j.flightL.rotation.y=-dash*0.35;j.flightR.rotation.y=dash*0.35;
          j.wingTipL.rotation.z=-Math.sin(p*Math.PI*2+0.7)*0.4-dash*0.3;
          j.wingTipR.rotation.z=Math.sin(p*Math.PI*2+0.7)*0.4+dash*0.3;
        } else if(this.faction==='necrons') {
          j.flightL.rotation.y=wave*0.17;j.flightR.rotation.y=-wave*0.17;
          j.flightL.position.y+=wave*0.04;j.flightR.position.y-=wave*0.04;
          j.hoverBase.rotation.z=wave*0.05;j.hoverBase.rotation.x=-dash*0.12;
        } else {
          j.flightL.rotation.x=wave*0.1+dash*0.2;j.flightR.rotation.x=-wave*0.1+dash*0.2;
          j.exhaustL.scale.y=0.8+(wave+1)*0.35+dash*0.7;
          j.exhaustR.scale.y=0.8+(1-wave)*0.35+dash*0.7;
        }
      }
    }
    if(mode==='teleport') {j.rig.scale.multiplyScalar(Math.max(0.035,Math.abs(Math.cos(p*Math.PI))));j.rig.position.y=Math.sin(p*Math.PI)*0.2;}
    if(j.cloak)j.cloak.rotation.x=0.12+wave*(mode==='run'?0.25:0.08);
    if(j.tail)j.tail.rotation.y=wave*(mode==='run'?0.35:0.17);
    this.poseThrowPayload(mode,time);
    if(this.role !== 'captain' && this.role !== 'builder' && !['death','death_blast','knockback','fall','stunned','reload'].includes(mode)) {
      // Solve the supporting arm toward the foregrip after recoil, in torso coordinates.
      const weapon=this.muzzle.parent!; this.root.updateMatrixWorld(true);
      const target=j.torso.worldToLocal(weapon.localToWorld(new THREE.Vector3(-0.1,0.15,0)));
      const shoulder=j.armL.position.clone(), delta=target.sub(shoulder);
      const length=0.35, distance=Math.min(length*2-0.001,delta.length()), direction=delta.normalize();
      const bend=new THREE.Vector3(-1,-0.6,0).addScaledVector(direction,-new THREE.Vector3(-1,-0.6,0).dot(direction)).normalize();
      const elbow=shoulder.clone().addScaledVector(direction,distance/2).addScaledVector(bend,Math.sqrt(length*length-distance*distance/4));
      const down=new THREE.Vector3(0,-1,0);
      j.armL.quaternion.setFromUnitVectors(down,elbow.clone().sub(shoulder).normalize());
      const wrist=shoulder.clone().addScaledVector(direction,distance);
      j.elbowL.quaternion.setFromUnitVectors(down,wrist.sub(elbow).normalize().applyQuaternion(j.armL.quaternion.clone().invert()));
    }
  }

  update(dt: number) {
    this.time += dt; this.pose(this.mode, this.time);

  }
  setMotion(mode: Motion) { this.mode = ROLE_MOTIONS[this.role].includes(mode) ? mode : 'idle'; this.time = 0; }
  setSpecialTravel(mode: 'fly' | 'dash_flight' | 'teleport') { this.setMotion(mode); }
  /** Cycles between distinct melee strikes, rather than repeating the same swing. */
  setMeleeStrike(index: number) {
    const moves: Motion[] = ['attack_slash', 'attack_thrust', 'attack_overhead', 'attack_combo'];
    this.setMotion(moves[Math.abs(Math.floor(index)) % moves.length]);
  }

  clips() {
    const clips: THREE.AnimationClip[] = [];
    for (const mode of ROLE_MOTIONS[this.role]) {
      const duration = DURATIONS[mode], count = Math.ceil(duration * 30), times: number[] = [];
      const samples = new Map<THREE.Group, { positions: number[]; rotations: number[]; scales: number[] }>();
      for (const g of Object.values(this.joints)) samples.set(g, { positions: [], rotations: [], scales: [] });
      for (let i = 0; i <= count; i++) {
        const t = i / count * duration; times.push(t); this.pose(mode, t);
        for (const [g, values] of samples) { values.positions.push(...g.position.toArray()); values.rotations.push(...g.quaternion.toArray());values.scales.push(...g.scale.toArray()); }
      }
      const tracks: THREE.KeyframeTrack[] = [];
      for (const [g, values] of samples) {
        tracks.push(new THREE.VectorKeyframeTrack(`${g.name}.position`, times, values.positions));
        tracks.push(new THREE.QuaternionKeyframeTrack(`${g.name}.quaternion`, times, values.rotations));
        tracks.push(new THREE.VectorKeyframeTrack(`${g.name}.scale`,times,values.scales));
      }
      clips.push(new THREE.AnimationClip(mode, duration, tracks));
    }
    this.pose(this.mode, this.time);
    return clips;
  }
}

/** Upgrade geometry for all six factions. Rebuild when a building's tier changes. */
export function upgradeFactionBuilding(model: THREE.Group, faction: FactionId, level: number) {
  if (faction === 'necrons') return upgradeNecronMonolith(model, level);
  const old = model.getObjectByName('FactionUpgrade');
  if (old) {
    old.traverse(obj => {
      if (obj instanceof THREE.Mesh) {
        obj.geometry.dispose();
        if (Array.isArray(obj.material)) obj.material.forEach(m => m.dispose());
        else obj.material.dispose();
      }
    });
    model.remove(old);
  }
  const tier = Math.max(1, Math.min(3, Math.floor(level)));
  const art = FACTION_ART[faction];
  const group = new THREE.Group(); group.name = 'FactionUpgrade';
  const armor = new THREE.MeshStandardMaterial({ color: art.metal, metalness: 0.7, roughness: 0.35 });
  const trim = new THREE.MeshStandardMaterial({ color: art.trim, metalness: 0.65, roughness: 0.4 });
  const glow = new THREE.MeshStandardMaterial({ color: art.glow, emissive: art.glow, emissiveIntensity: 1.1 });
  for (let i = 0; i < tier * 2 + 2; i++) {
    const a = i * Math.PI * 2 / (tier * 2 + 2);
    const r = 1.3 + tier * 0.22;
    const h = 0.7 + tier * 0.35;
    const tower = new THREE.Mesh(
      faction === 'daemons' ? new THREE.ConeGeometry(0.25, h, 5) :
      faction === 'drukhari' ? new THREE.ConeGeometry(0.19, h, 4) :
      faction === 'scrap' ? new THREE.BoxGeometry(0.4, h, 0.3) :
      faction === 'heretics' ? new THREE.CylinderGeometry(0.08, 0.24, h, 5) :
      new THREE.CylinderGeometry(0.2, 0.3, h, 8),
      i % 2 ? armor : trim
    );
    tower.position.set(Math.cos(a) * r, 1.6 + h / 2, Math.sin(a) * r);
    tower.rotation.y = a;
    if (faction === 'scrap') tower.rotation.z = (i % 2 ? 1 : -1) * 0.13;
    group.add(tower);
    const energy = new THREE.Mesh(new THREE.OctahedronGeometry(0.09 + tier * 0.04), glow);
    energy.position.set(tower.position.x, tower.position.y + h * 0.55, tower.position.z);
    group.add(energy);
  }
  if (tier > 1) {
    const crest = new THREE.Mesh(
      faction === 'legion' ? new THREE.BoxGeometry(0.28, 1.3, 0.28) :
      faction === 'scrap' ? new THREE.DodecahedronGeometry(0.35) :
      new THREE.OctahedronGeometry(0.4 + tier * 0.12),
      tier === 3 ? glow : trim
    );
    crest.position.y = 3.0 + tier * 0.3; group.add(crest);
  }
  model.add(group);
  return group;
}

/** Necron monolith upgrades add actual geometry, not just a HUD level icon. */
export function upgradeNecronMonolith(model: THREE.Group, level: number) {
  const old = model.getObjectByName('NecronUpgrade');
  if (old) {
    old.traverse(obj => {
      if (obj instanceof THREE.Mesh) {
        obj.geometry.dispose();
        if (Array.isArray(obj.material)) obj.material.forEach(m => m.dispose());
        else obj.material.dispose();
      }
    });
    model.remove(old);
  }
  const tier = Math.max(1, Math.min(3, Math.floor(level)));
  const g = new THREE.Group(); g.name = 'NecronUpgrade';
  const stone = new THREE.MeshStandardMaterial({ color: 0x354941, metalness: 0.85, roughness: 0.35 });
  const energy = new THREE.MeshStandardMaterial({ color: 0x61d64b, emissive: 0x3bfa45, emissiveIntensity: 1.7 });
  for (let i = 0; i < tier * 4; i++) {
    const a = i * Math.PI * 2 / (tier * 4);
    const radius = 1.3 + tier * 0.18;
    const pylon = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.7 + tier * 0.3, 0.28), stone);
    pylon.position.set(Math.cos(a) * radius, 1.8 + tier * 0.1, Math.sin(a) * radius);
    pylon.rotation.y = a; g.add(pylon);
    const light = new THREE.Mesh(new THREE.OctahedronGeometry(0.13 + tier * 0.04), energy);
    light.position.set(pylon.position.x, pylon.position.y + 0.5 + tier * 0.17, pylon.position.z); g.add(light);
  }
  const core = new THREE.Mesh(new THREE.OctahedronGeometry(0.4 + tier * 0.13), energy);
  core.position.y = 3.1 + tier * 0.35; g.add(core);
  model.add(g);
  return g;
}

export function factionBuilding(faction: FactionId, role: BuildingRole = 'hq') {
  const m = materials(faction), g = new THREE.Group(); g.name = `${faction}_${role}`;
  const small = role === 'post' || role === 'turret', width = small ? 1.1 : role === 'hq' ? 3.8 : 2.7;
  box(g, [width + 0.4, 0.22, width + 0.4], [0, 0.11, 0], m.metal);
  if (role === 'wall' || role === 'gate') {
    box(g,[role==='gate'?3.4:2.8,1.3,0.55],[0,0.85,0],m.primary); for(const x of [-1.3,1.3])box(g,[0.45,1.9,0.75],[x,1.05,0],m.metal); for(let i=0;i<6;i++)box(g,[0.24,0.25,0.65],[-1.15+i*0.46,1.65,0],m.trim); if(role==='gate')box(g,[1.8,1.25,0.08],[0,0.8,0.33],m.metal);
  } else if (role === 'generator') {
    for(const x of [-0.7,0,0.7]){cylinder(g,0.28,0.38,1.4,[x,1,0],m.metal);for(let i=0;i<4;i++)cylinder(g,0.31,0.31,0.08,[x,0.5+i*0.3,0],m.glow);} box(g,[2.1,0.3,1],[0,0.4,0],m.primary);
  } else if (role === 'relic') {
    for(let i=0;i<3;i++)box(g,[2-i*0.5,0.25,2-i*0.5],[0,0.3+i*0.25,0],m.primary); cylinder(g,0,0.45,1.1,[0,1.5,0],m.glow,undefined,4);for(const x of [-0.85,0.85])box(g,[0.2,1.9,0.2],[x,1,0],m.trim);
  } else if (role === 'turret') {
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
  if(role==='factory'){box(g,[2.1,0.8,1.2],[0,1.8,-0.2],m.metal);for(const x of [-0.8,0.8])cylinder(g,0.15,0.2,1.5,[x,2.2,-0.6],m.trim);box(g,[1.7,0.9,0.08],[0,0.75,1.12],m.metal);}
  if(role==='armory'){for(const x of [-0.6,0,0.6])box(g,[0.25,0.8,0.3],[x,1.8,0],m.trim);box(g,[1.8,0.12,0.4],[0,2.25,0],m.primary);}
  compact(g);
  return g;
}
