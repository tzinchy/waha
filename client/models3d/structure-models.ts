import * as THREE from 'three';
import { BUILDING_ROLES, FACTION_ART, daemonic, factionBuilding, upgradeFactionBuilding, type BuildingRole, type FactionId } from './faction-models.ts';

/** Building/point visuals only. These clips never mutate ownership, HP or income. */
export const STRUCTURE_ROLES = [...BUILDING_ROLES, 'capture_point', 'resource_point'] as const;
export type StructureRole = typeof STRUCTURE_ROLES[number];
export const STRUCTURE_MOTIONS = ['idle', 'build', 'work', 'hit', 'death', 'capture', 'shoot'] as const;
export type StructureMotion = typeof STRUCTURE_MOTIONS[number];
const DURATIONS: Record<StructureMotion, number> = { idle: 2.4, build: 2.2, work: 1.8, hit: 0.45, death: 1.6, capture: 1.8, shoot: 0.65 };
export const structureMotionDuration = (motion: StructureMotion) => DURATIONS[motion];
export const structureMotionLoops = (motion: StructureMotion) => motion === 'idle' || motion === 'work';
export function structureActionMarkers(motion: StructureMotion): Record<string, number> {
  if (motion === 'shoot') return { shot: 0.18, recovery: DURATIONS.shoot };
  if (motion === 'build') return { foundation: 0.35, ready: DURATIONS.build };
  if (motion === 'capture') return { flagRaised: DURATIONS.capture * 0.8, complete: DURATIONS.capture };
  if (motion === 'death') return { collapse: 0.55, groundContact: 1.35 };
  if (motion === 'hit') return { impact: 0, recovery: DURATIONS.hit };
  return {};
}
export const STRUCTURE_ROLE_MOTIONS: Record<StructureRole, StructureMotion[]> = Object.fromEntries(
  STRUCTURE_ROLES.map(role => [role, ['idle', 'build', 'work', 'hit', 'death', ...(role === 'turret' ? ['shoot'] : []), ...(role === 'capture_point' ? ['capture'] : [])]])
) as Record<StructureRole, StructureMotion[]>;

type BindPose = { position: THREE.Vector3; quaternion: THREE.Quaternion; scale: THREE.Vector3 };
const smooth = (t: number) => { const p = THREE.MathUtils.clamp(t, 0, 1); return p * p * (3 - 2 * p); };

/** Silhouette changes are geometry, so faction identity survives grayscale and tiny renders. */
function addFactionSilhouette(parent: THREE.Group, faction: FactionId, role: StructureRole) {
  const a = FACTION_ART[faction];
  const group = new THREE.Group(); group.name = `Structure_${faction}_Silhouette`; parent.add(group);
  const armor = new THREE.MeshStandardMaterial({ color: a.primary, roughness: 0.72, metalness: daemonic(faction) ? 0 : 0.6 });
  const metal = new THREE.MeshStandardMaterial({ color: a.metal, roughness: 0.65, metalness: 0.7 });
  const trim = new THREE.MeshStandardMaterial({ color: a.trim, roughness: 0.5, metalness: 0.65 });
  const light = new THREE.MeshStandardMaterial({ color: a.glow, emissive: a.glow, emissiveIntensity: 1.4 });
  const radius = role === 'hq' ? 1.8 : role === 'capture_point' || role === 'resource_point' ? 0.85 : role === 'post' || role === 'turret' ? 0.66 : 1.18;
  const height = role === 'wall' || role === 'gate' ? 1.05 : role === 'capture_point' || role === 'resource_point' ? 0.9 : role === 'hq' ? 2.1 : 1.7;
  const add = (geometry: THREE.BufferGeometry, mat: THREE.Material, position: number[], rotation: number[] = [0, 0, 0]) => {
    const mesh = new THREE.Mesh(geometry, mat); mesh.position.set(position[0], position[1], position[2]); mesh.rotation.set(rotation[0], rotation[1], rotation[2]); mesh.castShadow = mesh.receiveShadow = true; group.add(mesh); return mesh;
  };
  if (faction === 'legion') {
    for (const side of [-1, 1]) {
      add(new THREE.BoxGeometry(0.2, height, 0.34), armor, [side * radius, height / 2, 0]);
      add(new THREE.BoxGeometry(0.18, height * 0.65, 0.28), trim, [side * (radius + 0.22), height * 0.34, 0], [0, 0, side * -0.36]);
      add(new THREE.ConeGeometry(0.19, 0.42, 4), trim, [side * radius, height + 0.18, 0]);
      for (let i = 0; i < 3; i++) add(new THREE.BoxGeometry(0.13, 0.28 + i * 0.1, 0.045), trim, [side * (0.2 + i * 0.13), height * 0.78, radius * 0.56], [0, 0, side * (0.2 + i * 0.1)]);
    }
    add(new THREE.OctahedronGeometry(0.18), light, [0, height * 0.83, radius * 0.57]);
  } else {
    for (const side of [-1, 1]) {
      const curve = new THREE.CatmullRomCurve3([new THREE.Vector3(side * radius, 0.1, 0), new THREE.Vector3(side * (radius + 0.27), height * 0.38, 0.17), new THREE.Vector3(side * (radius + 0.12), height * 0.81, 0.24), new THREE.Vector3(side * (radius - 0.22), height * 1.06, 0.12)]);
      add(new THREE.TubeGeometry(curve, 12, 0.11, 5, false), armor, [0, 0, 0]);
      add(new THREE.ConeGeometry(0.12, 0.45, 5), trim, [side * (radius - 0.3), height * 1.1, 0.12], [0, 0, side * 0.7]);
      for (let i = 0; i < 3; i++) add(new THREE.ConeGeometry(0.07 + i * 0.02, 0.34, 5), metal, [side * (0.2 + i * 0.23), height * 0.74, radius * 0.54], [Math.PI * 0.2, 0, side * 0.25]);
    }
    const eye = add(new THREE.SphereGeometry(0.17, 8, 6), light, [0, height * 0.7, radius * 0.5]); eye.scale.set(1.4, 0.6, 0.7);
  }
}

/** Named rigid nodes are sampled into standard GLB translation/rotation/scale tracks. */
export class StructureActor {
  readonly root = new THREE.Group();
  readonly body = new THREE.Group();
  readonly joints: Record<string, THREE.Group> = {};
  readonly muzzle = new THREE.Object3D();
  readonly faction: FactionId;
  readonly role: StructureRole;
  readonly level: number;
  mode: StructureMotion = 'idle';
  time = 0;
  private bind = new Map<THREE.Group, BindPose>();
  private energy: THREE.Group;
  private flag: THREE.Group | undefined;
  private flagPanels: THREE.Group[] = [];
  private pistons: THREE.Group[] = [];
  private doors: THREE.Group[] = [];
  private debris: THREE.Group[] = [];
  private head: THREE.Group | undefined;
  private barrels: THREE.Group | undefined;
  private flash: THREE.Group | undefined;

  /** Ткань флага и свечение: точка перекрашивает их в цвет владельца. */
  cloth!: THREE.MeshStandardMaterial; glow!: THREE.MeshStandardMaterial;
  constructor(faction: FactionId, role: StructureRole = 'hq', level = 1, palette?: Partial<(typeof FACTION_ART)[FactionId]>) {
    this.faction = faction;
    this.role = role;
    this.level = Math.max(1, Math.min(3, Math.floor(level)));
    this.root.name = `${faction}_${role}_Actor`;
    this.body = this.joint(this.root, 'Body', [0, 0, 0]);
    const a = { ...FACTION_ART[faction], ...palette }; // нейтральная точка — своя палитра камня и латуни
    const metal = new THREE.MeshStandardMaterial({ color: a.metal, metalness: 0.8, roughness: 0.5 });
    const trim = new THREE.MeshStandardMaterial({ color: a.trim, metalness: 0.7, roughness: 0.45 });
    const primary = new THREE.MeshStandardMaterial({ color: a.primary, metalness: 0.4, roughness: 0.7 });
    const glow = new THREE.MeshStandardMaterial({ color: a.glow, emissive: a.glow, emissiveIntensity: 1.6, roughness: 0.45 });
    const cloth = new THREE.MeshStandardMaterial({ color: a.primary, side: THREE.DoubleSide, roughness: 1 });
    this.cloth = cloth; this.glow = glow;
    const mesh = (parent: THREE.Object3D, geometry: THREE.BufferGeometry, material: THREE.Material, position: number[]) => {
      const node = new THREE.Mesh(geometry, material);
      node.position.set(position[0], position[1], position[2]);
      node.castShadow = node.receiveShadow = true;
      parent.add(node);
      return node;
    };

    if (role === 'capture_point') { // как в Dawn of War: восьмигранный помост с латунным кольцом, крест из четырёх лучей с латунными торцами, тумба с экраном, шест со знаменем
      mesh(this.body, new THREE.CylinderGeometry(0.72, 0.82, 0.16, 8), metal, [0, 0.08, 0]);
      mesh(this.body, new THREE.CylinderGeometry(0.5, 0.5, 0.05, 8), primary, [0, 0.185, 0]);
      const rim = mesh(this.body, new THREE.TorusGeometry(0.68, 0.045, 4, 8), trim, [0, 0.17, 0]);
      rim.rotation.x = Math.PI / 2; rim.rotation.z = Math.PI / 8;
      for (let i = 0; i < 8; i++) { const a = (i + 0.5) * Math.PI / 4; mesh(this.body, new THREE.BoxGeometry(0.07, 0.05, 0.07), trim, [Math.sin(a) * 0.6, 0.2, Math.cos(a) * 0.6]); } // латунные заклёпки
      for (let i = 0; i < 4; i++) { // четыре луча креста
        const arm = this.joint(this.body, `Arm${i}`, [0, 0, 0]);
        arm.rotation.y = i * Math.PI / 2;
        mesh(arm, new THREE.BoxGeometry(0.16, 0.08, 0.95), metal, [0, 0.05, 1.2]);
        mesh(arm, new THREE.BoxGeometry(0.06, 0.02, 0.95), trim, [0, 0.1, 1.2]);
        mesh(arm, new THREE.BoxGeometry(0.3, 0.17, 0.3), trim, [0, 0.085, 1.72]);
        mesh(arm, new THREE.BoxGeometry(0.16, 0.04, 0.16), metal, [0, 0.18, 1.72]);
      }
      mesh(this.body, new THREE.BoxGeometry(0.42, 0.48, 0.42), metal, [0, 0.45, 0]); // тумба
      mesh(this.body, new THREE.BoxGeometry(0.46, 0.05, 0.46), trim, [0, 0.7, 0]);
      mesh(this.body, new THREE.BoxGeometry(0.22, 0.18, 0.02), glow, [0, 0.47, 0.215]); // зелёный экран когитатора
      for (const r of [1.35, 2.0]) { const ring = mesh(this.body, new THREE.TorusGeometry(r, 0.05, 3, 48), glow, [0, 0.02, 0]); ring.rotation.x = Math.PI / 2; ring.name = 'CaptureRing'; } // кольца захвата на земле — цвет захватчика
      mesh(this.body, new THREE.CylinderGeometry(0.035, 0.05, 2.5, 8), trim, [0, 1.95, 0]); // шест
      mesh(this.body, new THREE.BoxGeometry(0.62, 0.04, 0.04), trim, [0.3, 3.15, 0]); // перекладина знамени
      mesh(this.body, new THREE.OctahedronGeometry(0.09), trim, [0, 3.25, 0]);
      if (this.level > 1) for (let i = 0; i < 4; i++) { // ключевая точка (Critical Location): на торцах креста — пилоны с огнями
        const a = i * Math.PI / 2 + Math.PI / 4, x = Math.sin(a) * 1.55, z = Math.cos(a) * 1.55;
        mesh(this.body, new THREE.BoxGeometry(0.26, 1.3, 0.26), metal, [x, 0.65, z]);
        mesh(this.body, new THREE.BoxGeometry(0.32, 0.08, 0.32), trim, [x, 1.32, z]);
        mesh(this.body, new THREE.OctahedronGeometry(0.11), glow, [x, 1.5, z]);
      }
      {
        this.flag = this.joint(this.body, 'FlagRaise', [0.07, 3.12, 0]); // знамя висит с перекладины
        for (let i = 0; i < 4; i++) {
          const panel = this.joint(this.flag, `FlagPanel${i}`, [i * 0.21, 0, 0]);
          mesh(panel, new THREE.BoxGeometry(0.22, 0.66 - i * 0.025, 0.025), cloth, [0.105, -0.27, 0]);
          mesh(panel, new THREE.BoxGeometry(0.215, 0.035, 0.031), trim, [0.105, 0.045, 0]);
          this.flagPanels.push(panel);
        }
      }
    } else if (role === 'resource_point') { // реликвия, как в Dawn of War: древний обелиск на круглом помосте, над ним — зелёный кристалл
      mesh(this.body, new THREE.CylinderGeometry(1.02, 1.12, 0.17, 12), metal, [0, 0.085, 0]);
      const ring = mesh(this.body, new THREE.TorusGeometry(0.85, 0.045, 4, 16), trim, [0, 0.19, 0]);
      ring.rotation.x = Math.PI / 2;
      for (let i = 0; i < 6; i++) {
        const angle = i * Math.PI / 3;
        mesh(this.body, new THREE.BoxGeometry(0.15, 0.12, 0.26), primary, [Math.sin(angle) * 0.86, 0.25, Math.cos(angle) * 0.86]).rotation.y = angle;
      }
      const obelisk = mesh(this.body, new THREE.CylinderGeometry(0.12, 0.3, 1.6, 4), metal, [0, 0.97, 0]); obelisk.rotation.y = Math.PI / 4;
      mesh(this.body, new THREE.BoxGeometry(0.06, 0.9, 0.02), glow, [0, 0.95, 0.19]); // руны
      const halo = mesh(this.body, new THREE.TorusGeometry(1.25, 0.04, 3, 40), glow, [0, 0.02, 0]); halo.rotation.x = Math.PI / 2;
    } else {
      const model = factionBuilding(faction, role as BuildingRole, this.level);
      this.body.add(model);
      if (role === 'hq' && this.level > 1) upgradeFactionBuilding(model, faction, this.level);
      // улучшенные версии: видно, что пост, турель и стены прокачаны
      if (role === 'turret' && this.level > 1) { // тяжёлая турель: бронеплиты, второй ряд стволов, крупнее
        const head = model.getObjectByName('TurretHead'), bar = model.getObjectByName('Barrels');
        for (const sx of [-1, 1]) { mesh(model, new THREE.BoxGeometry(0.16, 0.7, 0.9), metal, [sx * 0.62, 0.55, 0]); mesh(model, new THREE.BoxGeometry(0.18, 0.06, 0.92), glow, [sx * 0.62, 0.9, 0]); }
        if (head) mesh(head, new THREE.BoxGeometry(0.95, 0.12, 0.75), trim, [0, 0.24, 0]);
        if (bar) for (const x of [-0.3, 0.3]) mesh(bar, new THREE.CylinderGeometry(0.06, 0.06, 0.9, 8), metal, [x, 0.14, 0.42]).rotation.x = Math.PI / 2;
        model.scale.multiplyScalar(1.15);
      }
      if (role === 'post' && this.level > 1) { // укреплённый пост: кольцо из блоков вокруг основания
        for (let i = 0; i < 8; i++) { const a = (i / 8) * Math.PI * 2; const b = mesh(model, new THREE.BoxGeometry(0.42, 0.38, 0.22), metal, [Math.cos(a) * 0.82, 0.3, Math.sin(a) * 0.82]); b.rotation.y = -a + Math.PI / 2; mesh(model, new THREE.BoxGeometry(0.44, 0.06, 0.24), trim, [Math.cos(a) * 0.82, 0.51, Math.sin(a) * 0.82]).rotation.y = -a + Math.PI / 2; }
      }
      if (role === 'post' && this.level > 2) { // пост 3 уровня стреляет: пушка на боку и маяк сверху
        const gun = mesh(model, new THREE.CylinderGeometry(0.06, 0.07, 0.8, 8), metal, [0, 1.55, 0.5]); gun.rotation.x = Math.PI / 2;
        mesh(model, new THREE.BoxGeometry(0.3, 0.25, 0.3), primary, [0, 1.55, 0.2]);
        mesh(model, new THREE.OctahedronGeometry(0.2), glow, [0, 3.0, 0]);
      }
      if ((role === 'wall' || role === 'gate') && this.level > 1) { // укреплённые стены: зубцы и шипы
        for (let i = 0; i < 7; i++) mesh(model, new THREE.ConeGeometry(0.07, 0.4, 5), trim, [-1.2 + i * 0.4, 2.0, 0.2]);
        mesh(model, new THREE.BoxGeometry(2.9, 0.2, 0.7), metal, [0, 1.75, 0]);
      }
      this.head = model.getObjectByName('TurretHead') as THREE.Group | undefined;
      this.barrels = model.getObjectByName('Barrels') as THREE.Group | undefined;
      for (const [name, node] of [['TurretHead', this.head], ['Barrels', this.barrels]] as const) {
        if (node) { node.name = `Structure_${name}`; this.joints[name] = node; }
      }
      if (this.barrels) {
        this.muzzle.name = 'Structure_Muzzle';
        this.muzzle.position.set(0, 0, 0.84);
        this.barrels.add(this.muzzle);
        this.flash = this.joint(this.barrels, 'MuzzleFlash', [0, 0, 0.88]);
        const flame = mesh(this.flash, new THREE.ConeGeometry(0.18, 0.55, 5), glow, [0, 0, 0.2]);
        flame.rotation.x = Math.PI / 2;
      }
      if (role === 'factory' || role === 'barracks') {
        for (const side of [-1, 1]) {
          const door = this.joint(this.body, `Door${side < 0 ? 'L' : 'R'}`, [side * 0.4, 0.78, 1.19]);
          mesh(door, new THREE.BoxGeometry(0.74, 0.92, 0.09), primary, [0, 0, 0]);
          mesh(door, new THREE.BoxGeometry(0.06, 0.91, 0.025), trim, [side * 0.3, 0, 0.06]);
          this.doors.push(door);
        }
      }
    }
    if (!palette && role === 'capture_point') addFactionSilhouette(this.body, faction, role); // у построек свой стиль (factionBuilding) — общие пилоны больше не навешиваем
    const energyHeight = role === 'capture_point' ? 0.36 : role === 'resource_point' ? 0.6 : role === 'wall' || role === 'gate' ? 1.1 : role === 'hq' ? 2.85 : 1.9;
    this.energy = this.joint(this.body, 'Energy', [0, energyHeight, role === 'wall' || role === 'gate' ? 0.38 : 0]);
    if (role === 'resource_point') {
      for (let i = 0; i < 5; i++) {
        const angle = i * Math.PI * 2 / 5;
        const crystal = this.joint(this.energy, `Crystal${i}`, [Math.cos(angle) * 0.46, 0.15 + i % 2 * 0.12, Math.sin(angle) * 0.46]);
        mesh(crystal, new THREE.OctahedronGeometry(0.2 + (i % 2) * 0.08), glow, [0, 0.1, 0]).scale.y = 2;
        crystal.rotation.z = Math.sin(angle) * 0.24;
      }
    } else if (role !== 'capture_point') {
      mesh(this.energy, new THREE.OctahedronGeometry(0.14), glow, [0, 0, 0]);
      const energyRing = mesh(this.energy, new THREE.TorusGeometry(0.23, 0.025, 4, 12), trim, [0, 0, 0]);
      energyRing.rotation.x = Math.PI / 2;
    }
    for (let i = 0; i < 5; i++) {
      const angle = i * Math.PI * 2 / 5;
      const shard = this.joint(this.root, `Debris${i}`, [Math.cos(angle) * 0.35, 0.35 + i * 0.13, Math.sin(angle) * 0.35]);
      mesh(shard, new THREE.BoxGeometry(0.14 + i * 0.025, 0.17, 0.16), i % 2 ? trim : metal, [0, 0, 0]);
      this.debris.push(shard);
    }
    for (const group of Object.values(this.joints)) this.bind.set(group, { position: group.position.clone(), quaternion: group.quaternion.clone(), scale: group.scale.clone() });
    this.root.userData = { kind: 'structure', faction, role, level: this.level, motions: STRUCTURE_ROLE_MOTIONS[role] };
    this.pose('idle', 0);
  }

  private joint(parent: THREE.Object3D, name: string, position: number[]) {
    const node = new THREE.Group();
    node.name = `Structure_${name}`;
    node.position.set(position[0], position[1], position[2]);
    parent.add(node);
    this.joints[name] = node;
    return node;
  }

  pose(motion: StructureMotion, seconds: number) {
    for (const [node, initial] of this.bind) {
      node.position.copy(initial.position); node.quaternion.copy(initial.quaternion); node.scale.copy(initial.scale);
    }
    const duration = structureMotionDuration(motion);
    // Sampling t=duration must close a loop; one-shot clips hold their last pose.
    const t = structureMotionLoops(motion) ? Math.max(0, seconds) % duration : THREE.MathUtils.clamp(seconds, 0, duration);
    const p = t / duration, wave = Math.sin(p * Math.PI * 2);
    const inactive = 0.00001;
    for (const shard of this.debris) shard.scale.setScalar(inactive);
    if (this.flash) this.flash.scale.setScalar(inactive);
    this.energy.rotation.y += p * Math.PI * 2;
    this.energy.scale.multiplyScalar(1 + wave * 0.045);
    for (let i = 0; i < this.flagPanels.length; i++) {
      this.flagPanels[i].rotation.y = Math.sin(p * Math.PI * 2 + i * 0.7) * (0.06 + i * 0.025);
      this.flagPanels[i].rotation.z = wave * 0.018 * i;
    }
    if (this.head && motion === 'idle') this.head.rotation.y += wave * 0.24;
    if (motion === 'work') {
      this.energy.scale.multiplyScalar(1.1 + Math.sin(p * Math.PI * 4) * 0.12);
      for (let i = 0; i < this.pistons.length; i++) this.pistons[i].position.y += Math.sin(p * Math.PI * 2 + i * Math.PI * 2 / 3) * 0.15;
      for (let i = 0; i < this.doors.length; i++) this.doors[i].position.x += (i ? 1 : -1) * (0.15 + (1 - Math.cos(p * Math.PI * 2)) * 0.18);
      if (this.head) this.head.rotation.y += wave * 0.5;
    }
    if (motion === 'build') {
      const growth = Math.max(inactive, smooth(p));
      this.body.scale.set(0.45 + growth * 0.55, growth, 0.45 + growth * 0.55);
      this.energy.scale.multiplyScalar(Math.max(inactive, smooth((p - 0.45) / 0.55)));
      for (const door of this.doors) door.scale.y *= Math.max(inactive, smooth((p - 0.2) / 0.8));
    }
    if (motion === 'capture' && this.flag) {
      this.flag.position.y = 0.45 + 2.13 * smooth(p / 0.8);
      this.energy.scale.multiplyScalar(1 + Math.sin(p * Math.PI) * 0.45);
    }
    if (motion === 'shoot' && this.head && this.barrels) {
      const kick = p < 0.18 / duration ? 0 : Math.exp(-(t - 0.18) * 10) * Math.sin(Math.min(1, (t - 0.18) / 0.12) * Math.PI / 2);
      this.barrels.position.z -= kick * 0.16;
      this.head.rotation.x -= kick * 0.04;
      if (this.flash && t >= 0.18 && t <= 0.27) this.flash.scale.setScalar(Math.sin((t - 0.18) / 0.09 * Math.PI));
    }
    if (motion === 'hit') {
      const jolt = Math.sin(p * Math.PI * 4) * (1 - p) * 0.045;
      this.body.rotation.z += jolt;
      this.body.position.x += jolt * 0.5;
      this.energy.scale.multiplyScalar(1 + (1 - p) * 0.18);
    }
    if (motion === 'death') {
      const collapse = smooth((p - 0.12) / 0.88);
      this.body.position.y -= collapse * 0.32;
      this.body.rotation.z += collapse * 0.28;
      this.body.scale.y *= Math.max(0.08, 1 - collapse * 0.92);
      this.energy.scale.setScalar(Math.max(inactive, 1 - smooth(p / 0.65)));
      for (let i = 0; i < this.debris.length; i++) {
        const shard = this.debris[i], angle = i * Math.PI * 2 / this.debris.length;
        shard.scale.setScalar(p < 0.17 ? inactive : 1);
        const travel = Math.max(0, (p - 0.17) / 0.83);
        shard.position.x += Math.cos(angle) * travel * 1.1;
        shard.position.z += Math.sin(angle) * travel * 1.1;
        shard.position.y = 0.12 + Math.sin(travel * Math.PI) * (0.5 + i * 0.08);
        shard.rotation.set(travel * 4 + i, travel * 2, travel * 3);
      }
      if (this.flag) this.flag.position.y = Math.max(0.25, this.flag.position.y - collapse * 2.2);
    }
  }

  update(dt: number) { this.time += Math.max(0, dt); this.pose(this.mode, this.time); }
  setMotion(motion: StructureMotion) { this.mode = STRUCTURE_ROLE_MOTIONS[this.role].includes(motion) ? motion : 'idle'; this.time = 0; this.pose(this.mode, 0); }

  clips(fps = 30): THREE.AnimationClip[] {
    const frameRate = Math.max(1, Math.min(120, Math.floor(fps)));
    const clips: THREE.AnimationClip[] = [];
    for (const motion of STRUCTURE_ROLE_MOTIONS[this.role]) {
      const duration = structureMotionDuration(motion), count = Math.ceil(duration * frameRate);
      const times: number[] = [];
      const samples = new Map<THREE.Group, { positions: number[]; rotations: number[]; scales: number[] }>();
      for (const node of Object.values(this.joints)) samples.set(node, { positions: [], rotations: [], scales: [] });
      for (let i = 0; i <= count; i++) {
        const t = i / count * duration; times.push(t); this.pose(motion, t);
        for (const [node, values] of samples) { values.positions.push(...node.position.toArray()); values.rotations.push(...node.quaternion.toArray()); values.scales.push(...node.scale.toArray()); }
      }
      const tracks: THREE.KeyframeTrack[] = [];
      for (const [node, values] of samples) {
        tracks.push(new THREE.VectorKeyframeTrack(`${node.name}.position`, times, values.positions));
        tracks.push(new THREE.QuaternionKeyframeTrack(`${node.name}.quaternion`, times, values.rotations));
        tracks.push(new THREE.VectorKeyframeTrack(`${node.name}.scale`, times, values.scales));
      }
      clips.push(new THREE.AnimationClip(motion, duration, tracks));
    }
    this.pose(this.mode, this.time);
    return clips;
  }
}

export { StructureActor as BuildingActor };
