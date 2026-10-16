// Техника по фракциям и ролям: у каждой расы своя конструкция, у каждой роли — свой силуэт.
// Суставы прежние (Rig/Hull/Turret/Gun/Drive_L/Drive_R, у четвероногих ещё Rear_L/Rear_R, у тварей BeastTail) — анимации FactionActor их и двигают.
//   transport — транспорт без большой пушки, tank — башня с главным орудием, artillery — навесное орудие/ракеты, walker — шагоход на ногах.
import * as THREE from 'three';
import type { FactionId } from './faction-models.ts';

type Mats = Record<string, THREE.Material>; // primary, trim, metal, cloth, glow, skin — материалы фракции
type V = number[];
export type Kit = {
  box: (p: THREE.Object3D, size: V, pos: V, m: THREE.Material, rot?: V) => THREE.Mesh;
  cylinder: (p: THREE.Object3D, top: number, bottom: number, h: number, pos: V, m: THREE.Material, rot?: V, seg?: number) => THREE.Mesh;
  piece: (p: THREE.Object3D, g: THREE.BufferGeometry, m: THREE.Material, pos: V, rot?: V) => THREE.Mesh;
  joint: (p: THREE.Object3D, name: string, pos: V) => THREE.Group;
};
export type VehicleRole = 'transport' | 'tank' | 'artillery' | 'walker' | 'aircraft';
export type Rig = { rig: THREE.Group; hull: THREE.Group; turret: THREE.Group; gun: THREE.Group; left: THREE.Group; right: THREE.Group; rearL?: THREE.Group; rearR?: THREE.Group; tail?: THREE.Group; muzzleZ: number };

const X = Math.PI / 2;

export function buildVehicle(K: Kit, root: THREE.Group, faction: FactionId, role: VehicleRole, m: Mats): Rig {
  const { box, cylinder, piece, joint } = K;
  const rig = joint(root, 'Rig', [0, 0, 0]);
  const legs = role === 'walker';
  const hover = faction === 'necrons' || faction === 'drukhari';
  const hullY = legs ? (faction === 'scrap' ? 1.25 : 1.45) : hover ? 1.0 : faction === 'scrap' && role !== 'tank' ? 0.85 : 0.8;
  const hull = joint(rig, 'Hull', [0, hullY, 0]);
  const turret = joint(hull, 'Turret', [0, 0.55, 0]);
  const gun = joint(turret, 'Gun', [0, 0.1, 0.3]);
  const left = joint(rig, 'Drive_L', [-0.85, legs ? hullY - 0.15 : 0.45, 0]);
  const right = joint(rig, 'Drive_R', [0.85, legs ? hullY - 0.15 : 0.45, 0]);
  const out: Rig = { rig, hull, turret, gun, left, right, muzzleZ: 1 };
  const spikes = (p: THREE.Object3D, n: number, x: number, y: number, z0: number, dz: number, len = 0.3, mat = m.trim, tilt = 0) => { for (let i = 0; i < n; i++) cylinder(p, 0, 0.07, len, [x, y, z0 + i * dz], mat, [tilt, 0, 0], 5); };
  const barrel = (p: THREE.Object3D, r: number, len: number, pos: V, mat = m.metal, tip = m.trim) => { cylinder(p, r, r * 1.15, len, [pos[0], pos[1], pos[2] + len / 2], mat, [X, 0, 0]); cylinder(p, r * 1.35, r * 1.35, 0.12, [pos[0], pos[1], pos[2] + len], tip, [X, 0, 0]); return pos[2] + len; };
  const tracks = (d: THREE.Group, len: number, h: number, w: number, wheels: number, mat = m.metal) => {
    box(d, [w, h, len], [0, 0, 0], mat);
    for (let i = 0; i < wheels; i++) cylinder(d, h * 0.36, h * 0.36, w + 0.04, [0, -h * 0.12, -len / 2 + 0.25 + (i * (len - 0.5)) / Math.max(1, wheels - 1)], m.trim, [0, 0, X], 10);
    for (let i = 0; i < Math.round(len / 0.22); i++) box(d, [w + 0.03, 0.05, 0.1], [0, h / 2, -len / 2 + 0.12 + i * 0.22], m.metal);
  };
  const leg = (d: THREE.Group, upper: number, lower: number, w: number, mat = m.primary, foot = m.metal, back = 0) => {
    box(d, [w, upper, w * 0.9], [0, -upper / 2, back * 0.3], mat, [back * 0.5, 0, 0]);
    cylinder(d, w * 0.45, w * 0.45, w * 1.1, [0, -upper, back * 0.55], m.trim, [0, 0, X]);
    box(d, [w * 0.85, lower, w * 0.8], [0, -upper - lower / 2, back * 0.25], foot, [-back * 0.4, 0, 0]);
    box(d, [w * 1.2, 0.14, w * 1.5], [0, -upper - lower, 0.12], foot);
  };

  // ---------- Самолёты: «Штормовой коготь», «Ночной серп», Дакка-джет, Адский дракон, «Бритвокрыл», Гарпия ----------
  if (role === 'aircraft') {
    hull.position.y = 0.6; turret.position.set(0, 0.2, 0.6); gun.position.set(0, -0.15, 0.9);
    left.position.set(-1.2, 0.6, -0.2); right.position.set(1.2, 0.6, -0.2); // законцовки крыльев: анимация их покачивает
    const wingSheet = (sg: number, pts: number[], mat = m.primary) => {
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.Float32BufferAttribute(pts.map((v, i) => (i % 3 === 0 ? v * sg : v)), 3));
      const xs = pts.filter((_, i) => i % 3 === 0), zs = pts.filter((_, i) => i % 3 === 2);
      const minX = Math.min(...xs), minZ = Math.min(...zs);
      const width = Math.max(0.0001, Math.max(...xs) - minX), depth = Math.max(0.0001, Math.max(...zs) - minZ);
      const uv: number[] = [];
      // Planar coordinates stay consistent on mirrored wings and match other mesh attributes for compaction.
      for (let i = 0; i < pts.length; i += 3) uv.push((pts[i] - minX) / width, (pts[i + 2] - minZ) / depth);
      g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
      g.computeVertexNormals();
      return piece(hull, g, mat, [0, 0, 0]);
    };
    if (faction === 'legion') {
      box(hull, [0.7, 0.55, 2.4], [0, 0, 0], m.primary); box(hull, [0.45, 0.25, 0.6], [0, 0.35, 0.55], m.glow); // фюзеляж и фонарь
      for (const sg of [-1, 1]) { box(hull, [1.4, 0.1, 0.9], [sg * 0.95, -0.05, -0.2], m.primary, [0, sg * 0.15, 0]); box(hull, [0.1, 0.5, 0.5], [sg * 0.3, 0.45, -1.0], m.trim); cylinder(hull, 0.16, 0.2, 0.5, [sg * 0.25, -0.05, -1.35], m.glow, [X, 0, 0]); }
      out.muzzleZ = barrel(gun, 0.07, 0.6, [0, 0, 0]); barrel(gun, 0.05, 0.5, [-0.4, 0.1, -0.6]); barrel(gun, 0.05, 0.5, [0.4, 0.1, -0.6]);
    } else if (faction === 'necrons') { // серп: полумесяц крыльев
      box(hull, [0.45, 0.35, 1.8], [0, 0, 0], m.primary);
      for (const sg of [-1, 1]) { wingSheet(sg, [0.2, 0, 0.6, 1.9, 0, -0.9, 0.3, 0, -0.5], m.metal); box(hull, [0.06, 0.06, 1.4], [sg * 1.0, 0.05, -0.25], m.glow, [0, sg * -0.5, 0]); }
      piece(hull, new THREE.OctahedronGeometry(0.22), m.glow, [0, 0.25, 0.3]); out.muzzleZ = barrel(gun, 0.06, 0.6, [0, 0, 0], m.metal, m.glow);
    } else if (faction === 'scrap') { // дакка-джет: грубая бочка, прямые крылья, акулья пасть, ракеты
      cylinder(hull, 0.35, 0.45, 2.2, [0, 0, 0], m.primary, [X, 0, 0], 8); box(hull, [0.5, 0.06, 0.12], [0, -0.1, 1.12], m.glow);
      for (const sg of [-1, 1]) { box(hull, [1.5, 0.1, 0.6], [sg * 0.95, 0, 0], m.metal); for (let i = 0; i < 2; i++) cylinder(hull, 0.06, 0.06, 0.6, [sg * (0.7 + i * 0.45), -0.15, 0.05], m.trim, [X, 0, 0]); }
      box(hull, [0.08, 0.6, 0.5], [0, 0.4, -1.0], m.primary); cylinder(hull, 0.2, 0.3, 0.4, [0, 0, -1.25], m.glow, [X, 0, 0]);
      out.muzzleZ = barrel(gun, 0.06, 0.7, [-0.15, 0, 0]); barrel(gun, 0.06, 0.7, [0.15, 0, 0]);
    } else if (faction === 'heretics') { // адский дракон: тело змея, перепончатые крылья, пасть с огнём, хвост
      const body = piece(hull, new THREE.SphereGeometry(0.5, 10, 8), m.metal, [0, 0, 0]); body.scale.set(0.9, 0.7, 2);
      for (const sg of [-1, 1]) { wingSheet(sg, [0.3, 0.1, 0.4, 2.0, 0.6, -0.2, 1.6, 0, -1.0, 0.3, 0.1, 0.4, 1.6, 0, -1.0, 0.3, 0, -0.6], m.cloth); cylinder(hull, 0.03, 0.06, 1.9, [sg * 1.0, 0.3, -0.1], m.trim, [0, 0, -sg * 1.25]); }
      box(turret, [0.4, 0.3, 0.6], [0, 0, 0.4], m.primary); for (const sg of [-1, 1]) cylinder(turret, 0, 0.05, 0.35, [sg * 0.15, 0.2, 0.2], m.trim, [-0.8, 0, -sg * 0.4], 5);
      out.tail = joint(hull, 'BeastTail', [0, 0, -0.9]); for (let i = 0; i < 4; i++) cylinder(out.tail, 0.12 - i * 0.025, 0.14 - i * 0.025, 0.4, [0, 0, -0.35 * i - 0.2], m.metal, [X, 0, 0]);
      gun.position.set(0, 0.2, 1.05); out.muzzleZ = barrel(gun, 0.08, 0.2, [0, 0, 0], m.trim, m.glow);
    } else if (faction === 'drukhari') { // бритвокрыл: тонкое дельта-крыло, лезвия, шипы
      box(hull, [0.35, 0.22, 2.2], [0, 0, 0], m.primary); cylinder(hull, 0, 0.2, 0.8, [0, 0, 1.45], m.metal, [X, 0, 0], 4);
      for (const sg of [-1, 1]) { wingSheet(sg, [0.15, 0, 0.9, 1.8, 0, -1.0, 0.15, 0, -1.0], m.primary); box(hull, [0.04, 0.04, 1.6], [sg * 1.0, 0.03, -0.3], m.trim, [0, sg * -0.6, 0]); cylinder(hull, 0, 0.05, 0.5, [sg * 1.75, 0, -0.95], m.trim, [X, 0, 0], 4); }
      out.muzzleZ = barrel(gun, 0.04, 0.6, [-0.12, 0, 0], m.metal, m.glow); barrel(gun, 0.04, 0.6, [0.12, 0, 0], m.metal, m.glow);
    } else { // гарпия тиранидов: мясистое тело, огромные перепончатые крылья, костяная пушка, хвост
      const body = piece(hull, new THREE.SphereGeometry(0.5, 10, 8), m.skin, [0, 0, 0]); body.scale.set(0.9, 0.7, 1.6);
      for (let i = 0; i < 3; i++) box(hull, [0.75 - i * 0.1, 0.1, 0.3], [0, 0.32, 0.4 - i * 0.35], m.primary);
      for (const sg of [-1, 1]) { wingSheet(sg, [0.3, 0.1, 0.3, 2.1, 0.5, 0.1, 1.8, 0, -0.9, 0.3, 0.1, 0.3, 1.8, 0, -0.9, 0.3, 0, -0.5], m.cloth); cylinder(hull, 0.03, 0.07, 2.0, [sg * 1.05, 0.3, 0.15], m.trim, [0, 0, -sg * 1.35]); }
      out.tail = joint(hull, 'BeastTail', [0, 0, -0.7]); for (let i = 0; i < 3; i++) cylinder(out.tail, 0.1 - i * 0.025, 0.12 - i * 0.025, 0.4, [0, 0, -0.35 * i - 0.2], m.skin, [X, 0, 0]);
      out.muzzleZ = barrel(gun, 0.09, 0.6, [0, 0, 0], m.trim, m.glow);
    }
    return out;
  }

  // ---------- Космодесант: «Носорог», «Хищник», «Вихрь», Дредноут ----------
  if (faction === 'legion') {
    if (legs) {
      box(hull, [1.05, 1.15, 0.9], [0, 0.35, 0], m.primary);                 // саркофаг
      box(hull, [0.62, 0.72, 0.12], [0, 0.35, 0.48], m.trim);                // лицевая плита
      box(hull, [0.36, 0.12, 0.05], [0, 0.55, 0.55], m.glow);
      for (const s of [-1, 1]) { box(hull, [0.5, 0.5, 0.75], [s * 0.72, 0.75, 0], m.primary); box(hull, [0.54, 0.1, 0.8], [s * 0.72, 1.0, 0], m.trim); }
      box(turret, [0.38, 0.28, 0.34], [0, 0.42, 0.1], m.primary);           // голова
      box(turret, [0.24, 0.06, 0.04], [0, 0.44, 0.28], m.glow);
      turret.position.set(0, 0.55, 0);
      box(hull, [0.42, 0.75, 0.5], [-0.85, 0.3, 0.2], m.primary);            // силовой кулак
      for (let i = 0; i < 3; i++) box(hull, [0.1, 0.22, 0.12], [-0.98 + i * 0.13, -0.15, 0.4], m.metal);
      gun.position.set(0.85, 0.1, 0.1); box(gun, [0.42, 0.55, 0.6], [0, 0, 0], m.primary);
      out.muzzleZ = barrel(gun, 0.08, 0.85, [-0.09, 0, 0.25]); barrel(gun, 0.08, 0.85, [0.09, 0, 0.25]);
      for (const d of [left, right]) leg(d, 0.6, 0.55, 0.36);
      left.position.x = -0.35; right.position.x = 0.35;
      return out;
    }
    const tall = role === 'tank' ? 0.75 : 0.85;
    box(hull, [1.35, tall, 2.1], [0, 0, -0.05], m.primary);
    box(hull, [1.35, 0.5, 0.75], [0, 0.12, 1.05], m.primary, [-0.55, 0, 0]);      // скошенный лоб
    box(hull, [0.7, 0.32, 0.06], [0, 0.18, 1.3], m.trim, [-0.55, 0, 0]);          // орёл на лбу
    for (const sx of [-0.66, 0.66]) box(hull, [0.07, 0.07, 2.15], [sx, tall / 2, -0.05], m.trim);   // кант по краю крыши
    for (const d of [left, right]) { tracks(d, 2.5, 0.8, 0.42, 5); box(d, [0.46, 0.08, 2.52], [0, 0.42, 0], m.primary); }
    if (role === 'transport') {
      box(turret, [0.55, 0.12, 0.55], [0, -0.05, -0.2], m.trim);                   // люк
      gun.position.set(0, 0.12, -0.05); box(gun, [0.25, 0.22, 0.3], [0, 0, 0], m.metal);
      out.muzzleZ = barrel(gun, 0.05, 0.4, [-0.06, 0, 0.12]); barrel(gun, 0.05, 0.4, [0.06, 0, 0.12]);
      for (const s of [-1, 1]) cylinder(hull, 0.07, 0.07, 0.5, [s * 0.5, 0.55, -1.0], m.metal);    // выхлопные трубы
      box(hull, [0.9, 0.5, 0.06], [0, 0, -1.12], m.trim);                           // кормовая аппарель
    } else if (role === 'tank') {
      box(turret, [1.0, 0.45, 1.05], [0, 0.05, 0], m.primary); box(turret, [1.04, 0.07, 1.09], [0, 0.29, 0], m.trim);
      out.muzzleZ = barrel(gun, 0.11, 1.45, [0, 0, 0.2]);
      for (const s of [-1, 1]) { box(hull, [0.32, 0.36, 0.55], [s * 0.88, 0.05, 0.3], m.primary); cylinder(hull, 0.05, 0.06, 0.6, [s * 0.88, 0.05, 0.8], m.metal, [X, 0, 0]); } // спонсоны
    } else {
      turret.position.y = 0.5;
      box(turret, [0.9, 0.18, 0.8], [0, -0.05, 0], m.metal);
      gun.position.set(0, 0.25, -0.1); box(gun, [0.95, 0.5, 0.85], [0, 0, 0.2], m.primary);   // ракетная установка
      for (let r = 0; r < 2; r++) for (let c = 0; c < 4; c++) cylinder(gun, 0.08, 0.08, 0.06, [-0.33 + c * 0.22, -0.1 + r * 0.24, 0.65], m.glow, [X, 0, 0]);
      out.muzzleZ = 0.7;
    }
    return out;
  }

  // ---------- Хаос: тот же род машин, но шипы, рога, ромбовидные гусеницы, Осквернитель на шести лапах ----------
  if (faction === 'heretics') {
    if (legs) {                                             // Осквернитель: краб на четырёх лапах с пушкой
      hull.position.y = 1.2;
      box(hull, [1.5, 0.75, 1.6], [0, 0, 0], m.primary); box(hull, [1.3, 0.1, 1.4], [0, 0.4, 0], m.trim);
      spikes(hull, 5, 0, 0.45, -0.6, 0.3, 0.4, m.trim, -0.3);
      for (const s of [-1, 1]) { box(hull, [0.5, 0.18, 0.7], [s * 0.6, -0.1, 1.0], m.metal, [0, s * 0.4, 0]); spikes(hull, 3, s * 0.75, -0.18, 1.25, 0.12, 0.28, m.metal, X); } // клешни
      box(turret, [0.8, 0.45, 0.8], [0, 0.1, -0.1], m.primary);
      out.muzzleZ = barrel(gun, 0.13, 1.4, [0, 0.1, 0.1]);
      const legSet = (d: THREE.Group, s: number) => { box(d, [0.2, 0.95, 0.2], [s * 0.3, 0.15, 0], m.metal, [0, 0, s * 0.9]); box(d, [0.18, 1.05, 0.18], [s * 0.72, -0.55, 0], m.primary, [0, 0, -s * 0.25]); cylinder(d, 0, 0.1, 0.35, [s * 0.85, -1.15, 0], m.trim); };
      left.position.set(-0.7, 1.15, 0.45); right.position.set(0.7, 1.15, 0.45); legSet(left, -1); legSet(right, 1);
      out.rearL = joint(rig, 'Rear_L', [-0.7, 1.15, -0.5]); out.rearR = joint(rig, 'Rear_R', [0.7, 1.15, -0.5]); legSet(out.rearL, -1); legSet(out.rearR, 1);
      return out;
    }
    const raider = role === 'tank';                          // «Лэнд Рейдер» с ромбовидными гусеницами
    box(hull, [raider ? 1.1 : 1.35, 0.8, 2.2], [0, 0, 0], m.primary);
    box(hull, [1.0, 0.45, 0.6], [0, 0.0, 1.25], m.metal, [-0.5, 0, 0]);
    for (const s of [-1, 1]) spikes(hull, 3, s * 0.45, 0.0, 1.55, 0, 0.45, m.trim, X);        // таран из шипов
    cylinder(hull, 0, 0.12, 0.6, [0, 0.55, 0.9], m.trim, [-0.3, 0, 0], 5);                      // рог
    for (const s of [-1, 1]) spikes(hull, 4, s * 0.62, 0.45, -0.8, 0.45, 0.32);
    for (const d of [left, right]) {
      if (raider) { box(d, [0.45, 1.1, 2.2], [0, 0.18, 0], m.primary); box(d, [0.45, 0.55, 0.7], [0, 0.35, 1.15], m.primary, [-0.75, 0, 0]); box(d, [0.45, 0.55, 0.7], [0, 0.35, -1.15], m.primary, [0.75, 0, 0]); box(d, [0.5, 0.09, 2.25], [0, 0.74, 0], m.trim); }
      else tracks(d, 2.4, 0.75, 0.42, 5);
    }
    if (raider) { left.position.x = -0.8; right.position.x = 0.8; for (const s of [-1, 1]) { box(hull, [0.3, 0.3, 0.45], [s * 1.08, 0.2, 0.2], m.metal); cylinder(hull, 0.05, 0.05, 0.7, [s * 1.08, 0.2, 0.7], m.glow, [X, 0, 0]); } }
    if (role === 'transport') { box(turret, [0.5, 0.15, 0.5], [0, -0.07, -0.3], m.trim); gun.position.set(0, 0.05, 0); out.muzzleZ = barrel(gun, 0.05, 0.45, [0, 0, 0.1]); cylinder(hull, 0.03, 0.03, 0.9, [0.4, 0.8, -0.8], m.metal); box(hull, [0.4, 0.3, 0.02], [0.6, 1.05, -0.8], m.cloth); } // знамя Хаоса
    else if (role === 'tank') { turret.position.set(0, 0.45, 0.1); box(turret, [0.65, 0.35, 0.65], [0, 0, 0], m.primary); cylinder(turret, 0, 0.1, 0.4, [0.2, 0.3, 0], m.trim, [0, 0, -0.4], 5); cylinder(turret, 0, 0.1, 0.4, [-0.2, 0.3, 0], m.trim, [0, 0, 0.4], 5); out.muzzleZ = barrel(gun, 0.07, 0.8, [0, 0, 0.15], m.metal, m.glow); }
    else { box(turret, [1.0, 0.25, 0.9], [0, -0.05, -0.2], m.metal); gun.position.set(0, 0.25, -0.2); box(gun, [0.55, 0.55, 0.65], [0, 0, 0], m.primary); out.muzzleZ = barrel(gun, 0.2, 1.0, [0, 0.05, 0.25]); spikes(gun, 3, 0, 0.32, -0.2, 0.2, 0.25); } // мортира
    return out;
  }

  // ---------- Орки: кривые грузовики на колёсах, «Боевой фургон» с катком, мортира-«Лобба», Банка-шагун ----------
  if (faction === 'scrap') {
    const wheels = (d: THREE.Group, zs: number[], r = 0.42) => { for (const z of zs) { cylinder(d, r, r, 0.32, [0, 0, z], m.metal, [0, 0, X], 9); cylinder(d, r * 0.45, r * 0.45, 0.34, [0, 0, z], m.trim, [0, 0, X], 6); } };
    if (legs) {                                             // Банка-шагун: бочка на ножках, клешня и пила
      piece(hull, new THREE.CylinderGeometry(0.62, 0.7, 1.15, 9), m.primary, [0, 0.35, 0]);
      for (let i = 0; i < 3; i++) cylinder(hull, 0.66 + i * 0.01, 0.66 + i * 0.01, 0.07, [0, -0.05 + i * 0.4, 0], m.metal, undefined, 9);
      box(hull, [0.42, 0.14, 0.05], [0, 0.6, 0.66], m.glow);                   // смотровая щель
      for (let i = 0; i < 2; i++) cylinder(hull, 0.08, 0.08, 0.6 + i * 0.25, [-0.25 + i * 0.4, 1.15, -0.3], m.metal);
      box(hull, [0.35, 0.5, 0.35], [-0.8, 0.2, 0.25], m.metal); for (const s of [-1, 1]) box(hull, [0.08, 0.35, 0.18], [-0.8 + s * 0.13, -0.15, 0.5], m.trim, [s * 0.3, 0, 0]); // клешня
      gun.position.set(0.8, 0.0, 0.1); cylinder(gun, 0.42, 0.42, 0.06, [0, 0, 0.45], m.metal, [0, 0, X], 12); box(gun, [0.25, 0.25, 0.5], [0, 0, 0], m.primary); // пила
      out.muzzleZ = 0.6;
      for (const d of [left, right]) leg(d, 0.5, 0.45, 0.32, m.metal, m.primary);
      left.position.x = -0.38; right.position.x = 0.38;
      return out;
    }
    if (role === 'tank') {                                   // Боевой фургон: громоздкий, на гусеницах, с катком-«дефф-роллой»
      box(hull, [1.5, 1.0, 2.3], [0, 0.1, 0], m.primary, [0, 0.04, 0]);
      for (let i = 0; i < 5; i++) box(hull, [0.5, 0.42, 0.06], [-0.55 + i * 0.27, 0.15 + (i % 2) * 0.2, 1.16], i % 2 ? m.trim : m.metal, [0, 0, (i - 2) * 0.12]); // кривые листы брони
      const roller = piece(hull, new THREE.CylinderGeometry(0.3, 0.3, 1.5, 8), m.metal, [0, -0.35, 1.45], [0, 0, X]); void roller;
      for (let i = 0; i < 6; i++) cylinder(hull, 0, 0.06, 0.22, [-0.6 + i * 0.24, -0.35, 1.78], m.trim, [X, 0, 0], 4);
      for (const d of [left, right]) tracks(d, 2.4, 0.8, 0.44, 4);
      turret.position.set(0.15, 0.7, -0.2); box(turret, [0.8, 0.45, 0.8], [0, 0, 0], m.metal, [0, 0.1, 0]);
      out.muzzleZ = barrel(gun, 0.17, 1.1, [0, 0, 0.1], m.metal, m.trim);
      for (let i = 0; i < 3; i++) cylinder(hull, 0.09, 0.09, 0.7 + i * 0.2, [-0.5 + i * 0.25, 0.8, -1.0], m.metal);
      return out;
    }
    // Тракк и Лобба — на колёсах, открытый кузов
    box(hull, [1.25, 0.35, 2.2], [0, -0.05, -0.1], m.primary);
    box(hull, [1.1, 0.65, 0.75], [0, 0.35, 0.75], m.primary, [0, 0.06, 0]);       // кабина
    box(hull, [0.8, 0.22, 0.05], [0, 0.48, 1.13], m.glow);                         // фары/щель
    box(hull, [1.35, 0.5, 0.12], [0, -0.05, 1.3], m.trim, [0.15, 0, 0]);           // таран
    for (let i = 0; i < 4; i++) cylinder(hull, 0, 0.07, 0.3, [-0.45 + i * 0.3, -0.05, 1.45], m.metal, [X, 0, 0], 4);
    for (const s of [-1, 1]) box(hull, [0.06, 0.32, 1.2], [s * 0.6, 0.25, -0.5], m.metal);  // борта кузова
    cylinder(hull, 0.1, 0.1, 0.9, [-0.45, 0.75, 0.6], m.metal);
    for (const d of [left, right]) wheels(d, [-0.75, 0.75]);
    left.position.set(-0.75, 0.42, -0.1); right.position.set(0.75, 0.42, -0.1);
    if (role === 'transport') { turret.position.set(0, 0.95, 0.75); box(turret, [0.3, 0.25, 0.3], [0, 0, 0], m.metal); out.muzzleZ = barrel(gun, 0.06, 0.6, [0, 0, 0.1]); }
    else { turret.position.set(0, 0.35, -0.55); box(turret, [0.7, 0.3, 0.7], [0, 0, 0], m.metal); gun.position.set(0, 0.3, 0); out.muzzleZ = barrel(gun, 0.24, 0.85, [0, 0.1, -0.1], m.metal, m.trim); for (let i = 0; i < 3; i++) box(hull, [0.25, 0.2, 0.25], [-0.4 + i * 0.3, 0.25, -0.95], m.trim); } // огромная мортира и ящики снарядов
    return out;
  }

  // ---------- Некроны: парящие ковчеги с рёбрами, «Ковчег Судного дня», баржа с тесла-башнями, паук-шагоход ----------
  if (faction === 'necrons') {
    const ribs = (n: number, len: number, h: number) => { for (let i = 0; i < n; i++) for (const s of [-1, 1]) box(hull, [0.07, h, 0.1], [s * 0.55, h / 2, -len / 2 + 0.2 + (i * (len - 0.4)) / (n - 1)], m.metal, [0, 0, s * 0.35]); };
    if (legs) {                                             // Триарх-Сталкер: паук на четырёх лапах
      hull.position.y = 1.35;
      piece(hull, new THREE.OctahedronGeometry(0.7, 0), m.primary, [0, 0, 0]).scale.set(1, 0.6, 1.3);
      piece(turret, new THREE.OctahedronGeometry(0.3, 0), m.glow, [0, 0.0, 0.55]);
      out.muzzleZ = barrel(gun, 0.07, 0.9, [0, -0.1, 0.4], m.metal, m.glow);
      const legSet = (d: THREE.Group, s: number) => { box(d, [0.12, 1.0, 0.12], [s * 0.35, 0.2, 0], m.metal, [0, 0, s * 1.0]); box(d, [0.1, 1.25, 0.1], [s * 0.8, -0.55, 0], m.primary, [0, 0, -s * 0.15]); box(d, [0.12, 0.12, 0.12], [s * 0.88, -1.15, 0], m.glow); };
      left.position.set(-0.45, 1.35, 0.45); right.position.set(0.45, 1.35, 0.45); legSet(left, -1); legSet(right, 1);
      out.rearL = joint(rig, 'Rear_L', [-0.45, 1.35, -0.45]); out.rearR = joint(rig, 'Rear_R', [0.45, 1.35, -0.45]); legSet(out.rearL, -1); legSet(out.rearR, 1);
      return out;
    }
    box(hull, [0.75, 0.3, role === 'tank' ? 2.8 : 2.2], [0, 0, 0], m.primary);      // киль
    box(hull, [0.5, 0.2, 0.5], [0, -0.3, 0], m.glow);                               // антигравитационное ядро
    for (const d of [left, right]) box(d, [0.08, 0.05, 2.0], [0, 0, 0], m.glow);    // светящиеся полозья под килем
    left.position.set(-0.3, 0.6, 0); right.position.set(0.3, 0.6, 0);
    if (role === 'transport') { ribs(5, 2.2, 0.8); box(hull, [1.1, 0.08, 1.4], [0, 0.15, 0], m.metal); for (const s of [-1, 1]) box(hull, [0.05, 0.05, 1.8], [s * 0.66, 0.75, 0], m.glow); gun.position.set(0, -0.2, 0.7); out.muzzleZ = barrel(gun, 0.06, 0.5, [0, 0, 0.2], m.metal, m.glow); }
    else if (role === 'tank') { ribs(4, 2.8, 0.55); turret.position.set(0, 0.25, -0.3); gun.position.set(0, 0.1, 0); out.muzzleZ = barrel(gun, 0.16, 2.2, [0, 0, -0.4], m.metal, m.glow); for (let i = 0; i < 4; i++) cylinder(gun, 0.2, 0.2, 0.08, [0, 0, 0.2 + i * 0.4], m.glow, [X, 0, 0], 8); } // Ковчег Судного дня: орудие во всю длину
    else { ribs(3, 2.2, 0.5); turret.position.set(0, 0.35, 0); for (const s of [-1, 1]) { cylinder(turret, 0.09, 0.12, 0.8, [s * 0.3, 0.35, 0], m.metal); piece(turret, new THREE.SphereGeometry(0.16, 10, 8), m.glow, [s * 0.3, 0.8, 0]); } gun.position.set(0, 0.6, 0); out.muzzleZ = barrel(gun, 0.07, 0.6, [0, 0, 0], m.metal, m.glow); } // баржа: тесла-башни
    return out;
  }

  // ---------- Тёмные эльдар: скиммеры с парусами и клинками, «Разоритель» с тёмными копьями, Талос ----------
  if (faction === 'drukhari') {
    if (legs) {                                             // Талос: парящий панцирь с клинками-руками и жалом
      hull.position.y = 1.5;
      box(hull, [0.9, 0.7, 1.1], [0, 0, 0], m.primary, [0.2, 0, 0]);
      for (const s of [-1, 1]) { box(hull, [0.15, 1.1, 0.12], [s * 0.6, -0.25, 0.55], m.metal, [-0.6, 0, s * 0.3]); cylinder(hull, 0, 0.07, 0.6, [s * 0.7, -0.75, 1.0], m.trim, [-1.0, 0, 0], 4); } // клинки
      out.tail = joint(hull, 'BeastTail', [0, 0.1, -0.6]); for (let i = 0; i < 4; i++) box(out.tail, [0.18 - i * 0.03, 0.18 - i * 0.03, 0.3], [0, 0.15 * i, -0.25 * i], m.primary, [-0.35 * i, 0, 0]);
      cylinder(out.tail, 0, 0.07, 0.4, [0, 0.65, -1.05], m.glow, [-1.2, 0, 0], 4);
      piece(turret, new THREE.SphereGeometry(0.22, 10, 8), m.glow, [0, -0.05, 0.45]);
      out.muzzleZ = barrel(gun, 0.05, 0.5, [0, -0.3, 0.4], m.metal, m.glow);
      for (const d of [left, right]) { box(d, [0.08, 0.5, 0.08], [0, -0.3, 0], m.metal); cylinder(d, 0, 0.06, 0.3, [0, -0.65, 0], m.trim, [Math.PI, 0, 0], 4); }
      left.position.set(-0.3, 1.2, -0.1); right.position.set(0.3, 1.2, -0.1);
      return out;
    }
    box(hull, [0.7, 0.24, 2.5], [0, 0, 0], m.primary);                              // киль
    cylinder(hull, 0, 0.36, 1.0, [0, 0, 1.7], m.metal, [X, 0, 0], 4);              // клинок-нос
    box(hull, [1.1, 0.06, 1.6], [0, 0.14, -0.1], m.metal);                          // палуба
    for (const s of [-1, 1]) { box(hull, [0.05, 0.3, 1.5], [s * 0.55, 0.3, -0.1], m.trim); spikes(hull, 3, s * 0.57, 0.5, -0.6, 0.5, 0.25, m.trim); }
    for (const d of [left, right]) { box(d, [0.06, 0.08, 1.9], [0, 0, 0], m.glow); cylinder(d, 0, 0.08, 0.5, [0, 0, -1.15], m.trim, [-X, 0, 0], 4); }
    left.position.set(-0.3, 0.68, 0); right.position.set(0.3, 0.68, 0);
    if (role !== 'artillery') { box(hull, [0.05, 1.2, 0.9], [0, 0.8, -0.6], m.cloth, [0, 0, 0]); cylinder(hull, 0.03, 0.03, 1.5, [0, 0.9, -0.2], m.metal); } // парус
    if (role === 'transport') { gun.position.set(0, -0.1, 0.9); out.muzzleZ = barrel(gun, 0.05, 0.7, [0, 0, 0], m.metal, m.glow); }
    else if (role === 'tank') { turret.position.set(0, 0.25, 0.4); for (const x of [-0.35, 0, 0.35]) { cylinder(turret, 0.04, 0.04, 1.1, [x, 0.1, 0.45], m.metal, [X, 0, 0]); cylinder(turret, 0.07, 0.07, 0.12, [x, 0.1, 1.0], m.glow, [X, 0, 0]); } out.muzzleZ = 1.0; } // Разоритель: три тёмных копья
    else { for (const s of [-1, 1]) { box(hull, [0.9, 0.06, 0.6], [s * 0.85, 0.1, -0.2], m.primary, [0, s * 0.3, s * 0.1]); for (let i = 0; i < 3; i++) cylinder(hull, 0.06, 0.06, 0.45, [s * (0.75 + i * 0.12), 0.0, 0.1], m.glow, [X, 0, 0]); } out.muzzleZ = barrel(gun, 0.06, 0.4, [0, -0.3, 0.6], m.metal, m.glow); } // ракетные крылья
    return out;
  }

  // ---------- Демоны: Колесница Тзинча, Перемалыватель душ, Пушка черепов, Демон-зверь ----------
  const flesh = (p: THREE.Object3D, r: number, pos: V, sc: V) => { const s = piece(p, new THREE.SphereGeometry(r, 16, 12), m.skin, pos); s.scale.set(sc[0], sc[1], sc[2]); return s; };
  const horns = (p: THREE.Object3D, x: number, y: number, z: number, len = 0.5) => { for (const s of [-1, 1]) cylinder(p, 0, 0.09, len, [s * x, y, z], m.trim, [-0.4, 0, -s * 0.6], 6); };
  const bug = faction === 'tyranids'; // у тиранидов вся техника — твари на лапах: Равенер, Карнифекс, Тираннофекс, Экзокрин
  if (legs || role === 'tank' || bug) {                    // Перемалыватель душ (tank) / Демон-зверь (walker): тело на четырёх лапах
    const grinder = role === 'tank' || (bug && role === 'artillery');
    hull.position.y = grinder ? 1.15 : 1.25;
    flesh(hull, 0.75, [0, 0, 0], [0.9, 0.6, 1.25]);
    for (let i = 0; i < 4; i++) box(hull, [0.95 - i * 0.08, 0.1, 0.18], [0, 0.42 - i * 0.02, -0.55 + i * 0.35], bug ? m.primary : m.metal);   // латунные пластины / хитиновый панцирь
    if (bug && role === 'artillery') { const sac = piece(hull, new THREE.SphereGeometry(0.45, 12, 8), m.cloth, [0, 0.75, -0.3]); sac.scale.set(1, 0.8, 1.3); for (let i = 0; i < 3; i++) cylinder(hull, 0.09, 0.12, 0.9, [-0.25 + i * 0.25, 1.1, -0.1], m.trim, [-0.5, 0, 0]); } // Экзокрин: мешок плазмы и костяные трубы на спине
    if (bug && role === 'transport') { hull.scale.set(0.8, 0.8, 1.15); }                                                  // Равенер: длинный и низкий
    if (bug && legs) { for (const sx of [-1, 1]) { box(hull, [0.14, 0.9, 0.1], [sx * 0.65, 0.1, 0.95], m.trim, [-1.0, 0, sx * 0.25]); cylinder(hull, 0, 0.08, 0.4, [sx * 0.7, -0.15, 1.45], m.trim, [1.9, 0, 0], 4); } hull.scale.setScalar(1.1); } // Карнифекс: огромные косы спереди
    if (bug && role === 'tank') hull.scale.setScalar(1.2);                                                                // Тираннофекс крупнее всех
    spikes(hull, 4, 0, 0.5, -0.5, 0.33, 0.35, m.trim, -0.35);
    if (grinder) { flesh(turret, 0.38, [0, 0.35, 0.65], [0.8, 1.0, 0.7]); horns(turret, 0.22, 0.75, 0.6, 0.45); box(turret, [0.28, 0.1, 0.05], [0, 0.42, 0.95], m.glow); gun.position.set(0.55, -0.05, 0.5); out.muzzleZ = barrel(gun, 0.15, 1.0, [0, 0, 0], m.metal, m.glow); } // торс демона и орудие-пасть
    else { flesh(turret, 0.36, [0, -0.05, 0.85], [0.8, 0.75, 1.0]); horns(turret, 0.2, 0.15, 0.95, 0.55); box(turret, [0.3, 0.08, 0.05], [0, -0.1, 1.2], m.glow); for (let i = 0; i < 4; i++) cylinder(turret, 0, 0.03, 0.12, [-0.12 + i * 0.08, -0.25, 1.15], m.trim, [Math.PI, 0, 0], 4); out.muzzleZ = 1.2; }
    const legSet = (d: THREE.Group, s: number) => { cylinder(d, 0.14, 0.11, 0.8, [s * 0.15, -0.25, 0], m.skin, [0, 0, s * 0.35]); cylinder(d, 0.1, 0.07, 0.75, [s * 0.3, -0.85, 0.1], m.skin, [0.25, 0, 0]); for (const x of [-0.07, 0, 0.07]) cylinder(d, 0, 0.035, 0.22, [s * 0.3 + x, -1.2, 0.3], m.trim, [X, 0, 0], 4); };
    left.position.set(-0.55, hull.position.y - 0.1, 0.55); right.position.set(0.55, hull.position.y - 0.1, 0.55); legSet(left, -1); legSet(right, 1);
    out.rearL = joint(rig, 'Rear_L', [-0.55, hull.position.y - 0.1, -0.55]); out.rearR = joint(rig, 'Rear_R', [0.55, hull.position.y - 0.1, -0.55]); legSet(out.rearL, -1); legSet(out.rearR, 1);
    out.tail = joint(hull, 'BeastTail', [0, 0.05, -0.9]); for (let i = 0; i < 3; i++) cylinder(out.tail, 0.1 - i * 0.03, 0.12 - i * 0.03, 0.35, [0, -0.05 * i, -0.3 * i - 0.15], m.skin, [X + 0.25, 0, 0]);
    return out;
  }
  // Колесница (transport) и Пушка черепов (artillery): платформа на огненном диске, впереди тварь-тягач
  hull.position.y = 0.75;
  piece(hull, new THREE.CylinderGeometry(0.95, 0.75, 0.2, 14), m.metal, [0, -0.3, -0.2]);                  // диск
  piece(hull, new THREE.TorusGeometry(0.85, 0.06, 6, 18), m.glow, [0, -0.38, -0.2], [X, 0, 0]);             // пламя по кромке
  box(hull, [1.0, 0.45, 1.1], [0, 0.0, -0.2], m.primary); for (const s of [-1, 1]) box(hull, [0.08, 0.5, 1.0], [s * 0.52, 0.15, -0.2], m.trim);
  flesh(hull, 0.35, [0, -0.05, 1.05], [0.75, 0.6, 1.2]); horns(hull, 0.18, 0.15, 1.3, 0.45);                    // тварь-тягач
  box(hull, [0.25, 0.07, 0.05], [0, -0.02, 1.47], m.glow);
  for (const d of [left, right]) piece(d, new THREE.ConeGeometry(0.25, 0.5, 6), m.glow, [0, -0.15, 0], [Math.PI, 0, 0]); // языки пламени снизу
  left.position.set(-0.5, 0.4, -0.2); right.position.set(0.5, 0.4, -0.2);
  if (role === 'transport') { turret.position.set(0, 0.35, -0.3); flesh(turret, 0.3, [0, 0.15, 0], [0.9, 1.1, 0.9]); horns(turret, 0.15, 0.45, 0, 0.35); gun.position.set(0, 0.2, 0.25); out.muzzleZ = barrel(gun, 0.05, 0.4, [0, 0, 0], m.metal, m.glow); }
  else { turret.position.set(0, 0.4, -0.3); const skull = piece(turret, new THREE.SphereGeometry(0.42, 14, 10), m.trim, [0, 0.2, 0]); skull.scale.set(1, 0.85, 1.1); for (const s of [-1, 1]) piece(turret, new THREE.SphereGeometry(0.1, 8, 6), m.glow, [s * 0.16, 0.28, 0.4]); gun.position.set(0, 0.15, 0.35); out.muzzleZ = barrel(gun, 0.17, 0.75, [0, 0, 0], m.trim, m.glow); } // Пушка черепов
  return out;
}
