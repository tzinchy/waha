import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import { assetArchive } from './asset-archive.ts';
import { UNIT_ROLES, BUILDING_ROLES, VEHICLE_ROLES, FACTION_ART, FactionActor, factionBuilding, ROLE_MOTIONS, type BuildingRole, type FactionId, type Motion, type UnitRole } from './faction-models.ts';

const $ = <T extends HTMLElement = HTMLElement>(id: string) => document.getElementById(id) as T;
const ids = Object.keys(FACTION_ART) as FactionId[];
const descriptions: Record<FactionId, string> = {
  legion: 'Симметричная тяжёлая броня, синий и латунь, крупные наплечники. Командир с мечом и щитом, стрелок и полевой техник.',
  heretics: 'Чёрное железо, багровые пластины и рога. Резкий силуэт чемпиона, стрелок культа и кузнец.',
  scrap: 'Зелёная кожа, тяжёлая челюсть, клёпаный металлолом. Массивный вожак, стрелок и механик.',
  necrons: 'Сегментированные металлические скелеты и зелёная энергия. Владыка с боевой косой, гаусс-воин и криптек-ремонтник.',
  drukhari: 'Тёмные Эльдар: фиолетовая броня, бирюзовые энергоклинки, рейдеры, инкубы и стремительные боевые машины.',
  daemons: 'Демоны Хаоса: багровая плоть, варп-огонь, чудовищные герои, демонические машины и врата призыва.',
};
const scene = new THREE.Scene(); scene.background = new THREE.Color(0x222a2d); scene.fog = new THREE.Fog(0x222a2d, 45, 100);
const renderer = new THREE.WebGLRenderer({ canvas: $<HTMLCanvasElement>('scene'), antialias: false, alpha: false });
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05;
renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
const camera = new THREE.OrthographicCamera(-18, 18, 12, -12, 0.1, 150);
const lighting = (target: THREE.Scene) => {
  target.add(new THREE.HemisphereLight(0xccd7dd, 0x352b23, 1.8));
  const sun = new THREE.DirectionalLight(0xffe2b5, 2.5); sun.position.set(-10, 18, 12); sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048); sun.shadow.camera.left = sun.shadow.camera.bottom = -22; sun.shadow.camera.right = sun.shadow.camera.top = 22;
  sun.shadow.camera.far = 70; sun.shadow.normalBias = 0.04; target.add(sun);
  const rim = new THREE.DirectionalLight(0x879db3, 1.1); rim.position.set(6, 8, -12); target.add(rim);
};
lighting(scene);

type Crater = { x: number; z: number; r: number; depth: number };
const craters: Crater[] = [];
const groundGeometry = new THREE.PlaneGeometry(60, 45, 240, 180); groundGeometry.rotateX(-Math.PI / 2);
const groundPositions = groundGeometry.attributes.position as THREE.BufferAttribute;
const groundColors = new Float32Array(groundPositions.count * 3);
groundGeometry.setAttribute('color', new THREE.BufferAttribute(groundColors, 3));
const groundTexture = new THREE.TextureLoader().load('/tex/ground_diff.jpg'); groundTexture.colorSpace = THREE.SRGBColorSpace;
groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping; groundTexture.repeat.set(20, 15);
const ground = new THREE.Mesh(groundGeometry, new THREE.MeshStandardMaterial({ map: groundTexture, vertexColors: true, roughness: 1, metalness: 0.03 })); ground.receiveShadow = true; scene.add(ground);
function baseHeight(x: number, z: number) { return Math.sin(x * 1.8 + z * 0.3) * 0.035 + Math.cos(z * 2.2 - x * 0.7) * 0.025; }
function heightAt(x: number, z: number) {
  let y = baseHeight(x, z);
  for (const c of craters) {
    const d = Math.hypot(x - c.x, z - c.z) / c.r;
    if (d < 1) y -= c.depth * Math.cos(d * Math.PI / 2) ** 2;
    if (d > 0.72 && d < 1.3) y += c.depth * 0.3 * Math.sin((d - 0.72) / 0.58 * Math.PI);
  }
  return Math.max(-1.2, y);
}
function refreshGround() {
  const color = new THREE.Color();
  for (let i = 0; i < groundPositions.count; i++) {
    const x = groundPositions.getX(i), z = groundPositions.getZ(i); groundPositions.setY(i, heightAt(x, z));
    const noise = Math.sin(x * 39.7 + z * 9.1) * Math.cos(z * 21.3 + x * 5.8);
    color.setRGB(0.58 + noise * 0.07, 0.55 + noise * 0.065, 0.5 + noise * 0.055);
    const road = Math.abs(z - 4.8) < 1.7;
    if (road) color.multiplyScalar(0.76);
    for (const c of craters) { const d = Math.hypot(x - c.x, z - c.z) / c.r; if (d < 1.3) color.multiplyScalar(0.3 + Math.min(1, d) * 0.47); }
    color.toArray(groundColors, i * 3);
  }
  groundPositions.needsUpdate = true; groundGeometry.attributes.color.needsUpdate = true; groundGeometry.computeVertexNormals();
}
refreshGround();

type Particle = { mesh: THREE.Mesh; velocity: THREE.Vector3; ttl: number; age: number; spin: number; kind: 'debris' | 'spark' | 'smoke' | 'blood' };
const particles: Particle[] = [];
const particleGeometry = new THREE.BoxGeometry(0.12, 0.12, 0.12);
const sparkMat = new THREE.MeshBasicMaterial({ color: 0xffca69 });
const debrisMat = new THREE.MeshStandardMaterial({ color: 0x49463b, roughness: 1 });
const smokeMat = new THREE.MeshBasicMaterial({ color: 0x403d3a, transparent: true, opacity: 0.55, depthWrite: false });
let explosions = 0, shots = 0;
function explodeAt(x: number, z: number, radius = 1.6, depth = 0.58) {
  // Finite geometry changes and scorch marks persist after transient particles fade.
  craters.push({ x, z, r: radius, depth }); refreshGround(); explosions++;
  const y = heightAt(x, z) + 0.25;
  for (let i = 0; i < 44; i++) {
    const kind = i < 14 ? 'spark' : i < 30 ? 'debris' : 'smoke';
    const mesh = new THREE.Mesh(particleGeometry, kind === 'spark' ? sparkMat : kind === 'smoke' ? smokeMat.clone() : debrisMat);
    mesh.position.set(x, y, z); mesh.scale.setScalar(kind === 'smoke' ? 3 : 0.6 + Math.random() * 1.4); scene.add(mesh);
    const angle = Math.random() * Math.PI * 2, speed = 1.2 + Math.random() * 3;
    particles.push({ mesh, velocity: new THREE.Vector3(Math.cos(angle) * speed, 2 + Math.random() * 5, Math.sin(angle) * speed), ttl: kind === 'smoke' ? 3.1 : 1.2 + Math.random(), age: 0, spin: Math.random() * 5, kind });
  }
  status(`Взрывов: ${explosions}. Кратеров на земле: ${craters.length}.`);
}

let batchExport=false;
const actors: FactionActor[] = [];
const buildings = new Map<FactionId, THREE.Group>();
const centerX = (id: FactionId) => ids.indexOf(id) * 8 - 12;
const rubble = new THREE.Group(); scene.add(rubble);
const stone = new THREE.MeshStandardMaterial({ color: 0x5a5950, roughness: 1 });
for (let i = 0; i < 28; i++) {
  const x = Math.sin(i * 42.34) * 17, z = Math.cos(i * 17.29) * 8;
  if (Math.abs(z - 1) < 4) continue;
  const rock = new THREE.Mesh(new THREE.DodecahedronGeometry(0.2 + i % 4 * 0.07, 0), stone); rock.position.set(x, 0.1, z); rock.scale.y = 0.6; rock.castShadow = true; rubble.add(rock);
}
const initialRubbleCount = rubble.children.length;
const ruins = new THREE.Group(); scene.add(ruins);
for (let i = 0; i < 11; i++) {
  const x = i * 3.3 - 16.5, h = 0.8 + ((i * 7) % 5) * 0.55;
  const pier = new THREE.Mesh(new THREE.BoxGeometry(0.48, h, 0.65), stone); pier.position.set(x, h / 2, -8); pier.castShadow = true; ruins.add(pier);
  const wall = new THREE.Mesh(new THREE.BoxGeometry(2.5, h * 0.36, 0.4), stone); wall.position.set(x + 1.35, h * 0.18, -8); wall.castShadow = true; ruins.add(wall);
  const cap = new THREE.Mesh(new THREE.ConeGeometry(0.36, 0.5, 4), stone); cap.position.set(x, h + 0.25, -8); ruins.add(cap);
}
function populateBuildings() {
  for (const id of ids) {
    const old = buildings.get(id); if (old) scene.remove(old);
    const g = factionBuilding(id); g.position.set(centerX(id), 0, -2.6); g.rotation.y = 0.12; buildings.set(id, g); scene.add(g);
  }
}
populateBuildings();
for (const id of ids) for (const role of UNIT_ROLES) {
  const actor = new FactionActor(id, role);
  actor.root.position.set(centerX(id) + (UNIT_ROLES.indexOf(role)%3-1)*2.1, 0, 0.5+Math.floor(UNIT_ROLES.indexOf(role)/3)*2.8);
  actor.root.rotation.y = role === 'builder' ? -0.25 : -0.08;
  actors.push(actor); scene.add(actor.root);
}
let selected: FactionId = 'legion', motion: Motion = 'idle', overview = true, pixelSize = 3, zoom = 1;
const focus = new THREE.Vector3(0, 0.7, 4.5), focusTarget = focus.clone();
function status(message: string) { $('status').textContent = message; }
function updateFocus() { focusTarget.set(overview ? 0 : centerX(selected), 0.7, 4.5); $('overview').classList.toggle('on', overview); }
function selectFaction(id: FactionId) {
  selected = id; overview = false; zoom = 1; updateFocus();
  document.querySelectorAll<HTMLElement>('[data-faction]').forEach(b => b.classList.toggle('on', b.dataset.faction === id));
  $('selectedName').textContent = FACTION_ART[id].name; $('selectedDescription').textContent = descriptions[id];
  $('plotLabels').style.visibility = overview ? 'visible' : 'hidden';
}
for (const id of ids) {
  const art = FACTION_ART[id], b = document.createElement('button'); b.className = 'faction'; b.dataset.faction = id;
  const icon = document.createElement('span'); icon.className = 'sigil'; icon.style.color = '#' + art.primary.toString(16).padStart(6, '0'); icon.textContent = id === 'legion' ? '✦' : id === 'heretics' ? '✶' : id === 'scrap' ? '⚒' : '◈';
  const text = document.createElement('span'), strong = document.createElement('strong'), small = document.createElement('small'); strong.textContent = art.name; small.textContent = art.subtitle; text.append(strong, small); b.append(icon, text); b.onclick = () => selectFaction(id); $('factions').append(b);
  const label = document.createElement('div'); label.textContent = art.name; const roles = document.createElement('span'); roles.textContent = '13 юнитов · 10 построек'; label.append(roles); $('plotLabels').append(label);
}
$('selectedDescription').textContent = descriptions[selected];

const roleNames: Record<UnitRole | BuildingRole,string> = { captain:'Командир',guard:'Пехота',builder:'Строитель',sniper:'Снайпер',heavy:'Тяжёлый стрелок',flamer:'Огнемётчик',elite:'Элита',medic:'Медик',transport:'Бронетранспортёр',tank:'Танк',walker:'Шагоход',artillery:'Артиллерия',titan:'Титан',hq:'Штаб',barracks:'Казармы',post:'Пост',turret:'Турель',generator:'Генератор',factory:'Завод',armory:'Оружейная',relic:'Реликварий',wall:'Стена',gate:'Ворота'};
const roleSelect=$<HTMLSelectElement>('role'); roleSelect.innerHTML=[...UNIT_ROLES,...BUILDING_ROLES].map(r=>`<option value="${r}">${roleNames[r]}</option>`).join('');
let previewOnly=false;
function previewRole(){previewOnly=true;const role=roleSelect.value;for(const a of actors){a.root.visible=a.role===role;a.root.position.set(centerX(a.faction),0,1.6);}for(const id of ids){const old=buildings.get(id)!;scene.remove(old);const g=factionBuilding(id,(BUILDING_ROLES as readonly string[]).includes(role)?role as BuildingRole:'hq');g.position.set(centerX(id),0,-2.6);g.visible=(BUILDING_ROLES as readonly string[]).includes(role);buildings.set(id,g);scene.add(g);}status(`Просмотр: ${roleNames[role as UnitRole]} · четыре фракционных варианта`);}
roleSelect.onchange=previewRole;
const stains=new THREE.Group();scene.add(stains);
const bloodMaterial=new THREE.MeshBasicMaterial({color:0x791e22,depthWrite:false,side:THREE.DoubleSide});
function hit(actor:FactionActor,death=false){if(VEHICLE_ROLES.has(actor.role)||actor.faction==='necrons'){explodeAt(actor.root.position.x,actor.root.position.z,0.45,0.03);return;}for(let i=0;i<(death?16:7);i++){const particle=new THREE.Mesh(particleGeometry,bloodMaterial);particle.position.copy(actor.root.position).add(new THREE.Vector3(0,1,0));particle.scale.setScalar(0.4);scene.add(particle);particles.push({mesh:particle,velocity:new THREE.Vector3((Math.random()-.5)*3,1+Math.random()*2,(Math.random()-.5)*3),ttl:0.6,age:0,spin:2,kind:'blood'});const drop=new THREE.Mesh(new THREE.CircleGeometry(0.04+Math.random()*0.1,6),bloodMaterial);drop.rotation.x=-Math.PI/2;const x=actor.root.position.x+(Math.random()-.5)*1.4,z=actor.root.position.z+(Math.random()-.5)*1.4;drop.position.set(x,heightAt(x,z)+0.025,z);stains.add(drop);}while(stains.children.length>300){const old=stains.children[0];stains.remove(old);if(old instanceof THREE.Mesh)old.geometry.dispose();}}
$('hit').onclick=()=>{for(const a of actors)if(a.faction===selected&&a.root.visible)hit(a);status('Попадание: кровь у живых бойцов, искры у машин и некронов.');};

const motionLabels: Record<Motion, string> = { idle: 'Стойка', walk: 'Ходьба', run: 'Бег', attack: 'Удар', shoot: 'Огонь', work: 'Работа', death: 'Гибель' };
function setMotion(next: Motion) {
  motion = next;
  for (const actor of actors) {
    const mode = ROLE_MOTIONS[actor.role].includes(next) ? next : next === 'attack' && ROLE_MOTIONS[actor.role].includes('shoot') ? 'shoot' : 'idle';
    actor.setMotion(mode); if(next==='death' && actor.root.visible)hit(actor,true);
  }
  document.querySelectorAll<HTMLElement>('[data-motion]').forEach(b => b.classList.toggle('on', b.dataset.motion === next));
}
for (const name of Object.keys(motionLabels) as Motion[]) {
  const b = document.createElement('button'); b.textContent = motionLabels[name]; b.dataset.motion = name; b.onclick = () => setMotion(name); $('motions').append(b);
}
setMotion('idle');
$('overview').onclick = () => { overview = true; zoom = 1; updateFocus(); $('plotLabels').style.visibility = 'visible'; };
function setPixels(size: number) { pixelSize = size; $('pixel').classList.toggle('on', size === 3); $('smooth').classList.toggle('on', size === 1); resize(); }
$('pixel').onclick = () => setPixels(3); $('smooth').onclick = () => setPixels(1);
function resize() {
  const stage = $('stage'); renderer.setSize(Math.max(1, Math.floor(stage.clientWidth / pixelSize)), Math.max(1, Math.floor(stage.clientHeight / pixelSize)), false);
}
new ResizeObserver(resize).observe($('stage')); resize();
const raycaster = new THREE.Raycaster(), pointer = new THREE.Vector2();
$('scene').addEventListener('pointerdown', e => {
  const r = $('scene').getBoundingClientRect(); pointer.set((e.clientX - r.left) / r.width * 2 - 1, 1 - (e.clientY - r.top) / r.height * 2); raycaster.setFromCamera(pointer, camera);
  const hit = raycaster.intersectObject(ground)[0]; if (hit) explodeAt(hit.point.x, hit.point.z);
});
$('stage').addEventListener('wheel', e => { e.preventDefault(); zoom = THREE.MathUtils.clamp(zoom * (e.deltaY > 0 ? 1.1 : 0.9), 0.6, 1.6); }, { passive: false });
$('explode').onclick = () => explodeAt(overview ? 0 : centerX(selected), 5);
const bullets: { mesh: THREE.Mesh; start: THREE.Vector3; end: THREE.Vector3; age: number; explosive: boolean }[] = [];
function fire(actor: FactionActor) {
  actor.root.updateMatrixWorld(true); const start = actor.muzzle.getWorldPosition(new THREE.Vector3());
  const end = new THREE.Vector3(actor.root.position.x, heightAt(actor.root.position.x, 7) + 0.08, 7);
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.045, actor.faction === 'necrons' ? 0.8 : 0.28), new THREE.MeshBasicMaterial({ color: actor.faction === 'necrons' ? FACTION_ART.necrons.glow : 0xffd583 }));
  if(actor.role==='flamer'){mesh.scale.set(5,5,5);(mesh.material as THREE.MeshBasicMaterial).color.setHex(0xff6c24);}
  if(actor.role==='titan')mesh.scale.set(3,3,3);
  mesh.position.copy(start); mesh.lookAt(end); scene.add(mesh); bullets.push({ mesh, start, end, age: 0, explosive: ['tank','artillery','titan'].includes(actor.role) }); shots++;
  for(let i=0;i<5;i++){const flash=new THREE.Mesh(particleGeometry,sparkMat);flash.position.copy(start);flash.scale.setScalar(0.4+Math.random()*0.6);scene.add(flash);particles.push({mesh:flash,velocity:new THREE.Vector3((Math.random()-.5)*2,(Math.random()-.5)*2,2),ttl:0.12,age:0,spin:0,kind:'spark'});}
}
$('fire').onclick = () => {
  const guard = actors.find(a => a.faction === selected && a.root.visible && ROLE_MOTIONS[a.role].includes('shoot')); if(!guard){status('Выбери стрелка или технику.');return;} guard.setMotion('shoot'); guard.pose('shoot', 0.1); fire(guard); status(`Залпов: ${shots}. ${FACTION_ART[selected].name}.`);
};
$('destroy').onclick = () => {
  const b = buildings.get(selected)!; if (!b.visible) return;
  b.visible = false; explodeAt(centerX(selected), -2.6, 2.4, 0.38);
  for (let i = 0; i < 9; i++) {
    const fragment = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.4, 0.65), debrisMat); fragment.position.set(centerX(selected) + Math.sin(i * 3) * 1.5, 0.17, -2.6 + Math.cos(i * 3) * 1.5); fragment.rotation.set(i * 0.12, i, i * 0.2); fragment.castShadow = true; rubble.add(fragment);
  }
  status(`${FACTION_ART[selected].name}: штаб разрушен. Основание и обломки остались на земле.`);
};
$('reset').onclick = () => {
  for(const old of [...stains.children]){stains.remove(old);if(old instanceof THREE.Mesh)old.geometry.dispose();} previewOnly=false; for(const a of actors){a.root.visible=true;a.root.position.set(centerX(a.faction)+(UNIT_ROLES.indexOf(a.role)%3-1)*2.1,0,0.5+Math.floor(UNIT_ROLES.indexOf(a.role)/3)*2.8);} craters.length = 0; explosions = shots = 0; refreshGround(); populateBuildings();
  for (const p of particles) { scene.remove(p.mesh); if (p.kind === 'smoke') (p.mesh.material as THREE.Material).dispose(); } particles.length = 0;
  for (const b of bullets) { scene.remove(b.mesh); b.mesh.geometry.dispose(); (b.mesh.material as THREE.Material).dispose(); } bullets.length = 0;
  while (rubble.children.length > initialRubbleCount) { const child = rubble.children.at(-1)!; rubble.remove(child); if (child instanceof THREE.Mesh) child.geometry.dispose(); }
  setMotion('idle'); status('Полигон восстановлен.');
};

function download(data: BlobPart, filename: string, type: string) {
  const url = URL.createObjectURL(new Blob([data], { type })); const a = document.createElement('a'); a.href = url; a.download = filename; a.click(); setTimeout(() => URL.revokeObjectURL(url), 10000);
}
async function glb(faction: FactionId, role: UnitRole | BuildingRole, clip?: Motion) {
  const character = (UNIT_ROLES as readonly string[]).includes(role), actor = character ? new FactionActor(faction, role as UnitRole) : undefined;
  const root = actor?.root ?? factionBuilding(faction, role as BuildingRole);
  const animations = actor?.clips().filter(a => !clip || a.name === clip) ?? [];
  actor?.pose('idle', 0);
  const result = await new GLTFExporter().parseAsync(root, { binary: true, animations, onlyVisible: false });
  if (!(result instanceof ArrayBuffer)) throw new Error('Expected binary GLB');
  return result;
}
$('exportGlb').onclick = async () => {
  const role = $<HTMLSelectElement>('role').value as UnitRole | BuildingRole, b = $<HTMLButtonElement>('exportGlb'); b.disabled = true;
  try { const data = await glb(selected, role); download(data, `${selected}-${role}.glb`, 'model/gltf-binary'); status(`Экспортирован ${FACTION_ART[selected].name}: ${role}.`); }
  catch (e) { status(`Ошибка экспорта: ${String(e)}`); } finally { b.disabled = false; }
};

async function spriteAtlas(faction: FactionId, role: UnitRole, requestedMotion: Motion) {
  const available = ROLE_MOTIONS[role], selectedMotion = available.includes(requestedMotion) ? requestedMotion : available[0];
  const actor = new FactionActor(faction, role), s = new THREE.Scene(); lighting(s); s.add(actor.root);
  const r = new THREE.WebGLRenderer({ alpha: true, antialias: false, preserveDrawingBuffer: true }); r.setSize(128, 128); r.setClearColor(0x000000, 0);
  r.outputColorSpace = THREE.SRGBColorSpace; r.toneMapping = THREE.ACESFilmicToneMapping; r.toneMappingExposure = 1.05;
  // One world-space scale for every role, including the full weapon-swing envelope.
  const span=VEHICLE_ROLES.has(role)?4:2.5;
  const c = new THREE.OrthographicCamera(-span, span, span, -span, 0.1, 30); c.position.set(8 / Math.sqrt(2), 1.1 + 8 * Math.tan(35 * Math.PI / 180), 8 / Math.sqrt(2)); c.lookAt(0, 1.1, 0);
  const atlas = document.createElement('canvas'); atlas.width = atlas.height = 1024; const ctx = atlas.getContext('2d')!; ctx.imageSmoothingEnabled = false;
  const duration = selectedMotion === 'run' ? 0.65 : selectedMotion === 'walk' ? 1 : selectedMotion === 'idle' ? 2 : selectedMotion === 'attack' ? 0.7 : selectedMotion === 'shoot' ? 0.45 : 1.1;
  const loop = ['idle', 'walk', 'run', 'work'].includes(selectedMotion);
  for (let direction = 0; direction < 8; direction++) {
    actor.root.rotation.y = direction * Math.PI / 4;
    for (let frame = 0; frame < 8; frame++) { actor.pose(selectedMotion, duration * frame / (loop ? 8 : 7)); r.render(s, c); ctx.drawImage(r.domElement, frame * 128, direction * 128); }
    await new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
  }
  const blob = await new Promise<Blob>((resolve, reject) => atlas.toBlob(b => b ? resolve(b) : reject(new Error('Atlas encoding failed')), 'image/png'));
  const anchor = new THREE.Vector3(0, 0, 0).project(c);
  r.dispose(); r.forceContextLoss();
  return { blob, metadata: { faction, role, animation: selectedMotion, image: `${faction}-${role}-${selectedMotion}.png`, cellWidth: 128, cellHeight: 128, columns: 8, rows: 8, duration, loop, directionsDegrees: [0, 45, 90, 135, 180, 225, 270, 315], rootForward: '+Z', camera: { elevationDegrees: 35, azimuthDegrees: 45, targetHeight: 1.1, orthographicHeight: span*2 }, anchor: { x: Math.round((anchor.x + 1) * 64), y: Math.round((1 - anchor.y) * 64) }, frames: Array.from({ length: 8 }, (_, direction) => Array.from({ length: 8 }, (_, frame) => ({ x: frame * 128, y: direction * 128, w: 128, h: 128, time: duration * frame / (loop ? 8 : 7) }))) } };
}
$('exportSprites').onclick = async () => {
  const role = $<HTMLSelectElement>('role').value as UnitRole;
  if (!(UNIT_ROLES as readonly string[]).includes(role)) { status('Для спрайтов выбери юнита или технику.'); return; }
  const button = $<HTMLButtonElement>('exportSprites'); button.disabled = true; status('Запекаю восемь направлений…');
  try {
    const a = await spriteAtlas(selected, role, motion);
    const zip = assetArchive([{ name: a.metadata.image, data: new Uint8Array(await a.blob.arrayBuffer()) }, { name: a.metadata.image.replace('.png', '.json'), data: new TextEncoder().encode(JSON.stringify(a.metadata, null, 2)) }]);
    download(zip, a.metadata.image.replace('.png', '.zip'), 'application/zip'); status('Спрайтовый атлас и описание кадров экспортированы одним архивом.');
  }
  catch (e) { status(`Ошибка запекания: ${String(e)}`); } finally { button.disabled = false; }
};

let last = performance.now(), previousShotCycle = -1;
function frame(now: number) {
  requestAnimationFrame(frame); const dt = Math.min(0.05, (now - last) / 1000); last = now;
  focus.lerp(focusTarget, 1 - Math.exp(-dt * 5));
  const aspect = $('stage').clientWidth / $('stage').clientHeight, halfW = (overview ? 22 : 8.5) * zoom;
  camera.left = -halfW; camera.right = halfW; camera.top = halfW / aspect; camera.bottom = -camera.top; camera.updateProjectionMatrix();
  // Orthographic fixed 35-degree elevation. Models remain 3D at both display resolutions.
  camera.position.copy(focus).add(new THREE.Vector3(8, 21, 29)); camera.lookAt(focus);
  for (const actor of actors) { actor.root.position.y = heightAt(actor.root.position.x, actor.root.position.z); actor.update(dt); }
  const cycle = Math.floor(now / 900);
  if (motion === 'shoot' && cycle !== previousShotCycle) { for (const actor of actors) if (ROLE_MOTIONS[actor.role].includes('shoot') && actor.root.visible && (overview || actor.faction === selected)) fire(actor); } previousShotCycle = cycle;
  for (let i = bullets.length - 1; i >= 0; i--) {
    const b = bullets[i]; b.age += dt; b.mesh.position.lerpVectors(b.start, b.end, Math.min(1, b.age / 0.18));
    if (b.age > 0.2) { if(b.explosive)explodeAt(b.end.x,b.end.z,0.65,0.06); scene.remove(b.mesh); b.mesh.geometry.dispose(); (b.mesh.material as THREE.Material).dispose(); bullets.splice(i, 1); }
  }
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i]; p.age += dt; p.mesh.position.addScaledVector(p.velocity, dt); p.velocity.y -= dt * (p.kind === 'smoke' ? 1 : 9); p.mesh.rotation.x += dt * p.spin; p.mesh.rotation.z += dt * p.spin;
    if (p.kind === 'smoke') { p.velocity.multiplyScalar(Math.exp(-dt * 1.3)); p.mesh.scale.multiplyScalar(1 + dt * 0.55); (p.mesh.material as THREE.MeshBasicMaterial).opacity = Math.max(0, 0.55 * (1 - p.age / p.ttl)); }
    else if (p.mesh.position.y < heightAt(p.mesh.position.x, p.mesh.position.z) + 0.06) { p.mesh.position.y = heightAt(p.mesh.position.x, p.mesh.position.z) + 0.06; p.velocity.multiplyScalar(0.35); p.velocity.y = Math.abs(p.velocity.y); }
    if (p.age > p.ttl) { scene.remove(p.mesh); if (p.kind === 'smoke') (p.mesh.material as THREE.Material).dispose(); particles.splice(i, 1); }
  }
  if(!batchExport) renderer.render(scene, camera);
}
requestAnimationFrame(frame);
status('52 юнита и техники · 40 построек · 260 анимационных клипов · GLB и запекание спрайтов доступны.');

// Development-only inspection/export surface for repeatable browser checks and asset generation.
Object.assign(window, { assetLab: {
  glb, spriteAtlas, selectFaction, setMotion, setPixels, explodeAt,
  batch: (enabled: boolean) => { batchExport=enabled; },
  inspect: () => ({ actors: actors.length, bloodStains: stains.children.length, previewOnly, factions: ids, motions: actors.map(a => ({ faction: a.faction, role: a.role, motion: a.mode })), craters: craters.length, explosions, shots, groundMin: Math.min(...Array.from({ length: groundPositions.count }, (_, i) => groundPositions.getY(i))), selected, buildingVisible: buildings.get(selected)?.visible, drawCalls: renderer.info.render.calls, contextLost: renderer.getContext().isContextLost() }),
} });
