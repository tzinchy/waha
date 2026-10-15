// Запекание пиксельных атласов из 3D-моделей фракций (dev-инструмент, в сборку не входит).
// Формат как у остальных атласов: 8 кадров по горизонтали × 8 направлений по вертикали, клетка 256 px, рядом JSON с опорой и рамками фигуры.
// Запуск: node tools/bake-server.mjs, затем открыть /bake.html?pack=tyranids (&roles=flyer,guard — только эти роли) — файлы лягут в client/public/models/factions/<pack>/.
import * as THREE from 'three';
import { FactionActor, motionDuration, type Motion, type UnitRole, type FactionId as Pack } from './models3d/faction-models.ts';

const CELL = 256, LOW = 128; // рендер в 128 и увеличение без сглаживания — пиксельный вид
const ROLES: Record<string, string[]> = {
  captain: ['idle', 'walk', 'run', 'attack', 'death'], builder: ['idle', 'walk', 'run', 'work', 'death'],
  flyer: ['idle', 'walk', 'run', 'shoot', 'death'], aircraft: ['idle', 'walk', 'run', 'shoot', 'death'],
  ...Object.fromEntries(['guard', 'sniper', 'heavy', 'flamer', 'elite', 'medic', 'transport', 'tank', 'walker', 'artillery', 'titan'].map(r => [r, ['idle', 'walk', 'run', 'shoot', 'death']])),
};
const MOTION: Record<string, Motion> = { attack: 'attack_slash' };
const FLYER: Record<string, Motion> = { idle: 'fly', walk: 'fly', run: 'dash_flight' }; // у летуна нет ног-шагов: висит и рвётся вперёд

const r = new THREE.WebGLRenderer({ antialias: false, alpha: true, preserveDrawingBuffer: true });
r.setSize(LOW, LOW, false); r.setClearColor(0, 0); r.outputColorSpace = THREE.SRGBColorSpace; r.toneMapping = THREE.ACESFilmicToneMapping; r.toneMappingExposure = 1.25;
const scene = new THREE.Scene();
scene.add(new THREE.HemisphereLight(0xdfe7ec, 0x3b3128, 2.2));
const sun = new THREE.DirectionalLight(0xffe2b5, 2.6); sun.position.set(-10, 18, 12); scene.add(sun);
const rim = new THREE.DirectionalLight(0x9fb3c8, 1.2); rim.position.set(6, 8, -12); scene.add(rim);

async function atlas(pack: Pack, role: UnitRole, anim: string) {
  const a = new FactionActor(pack, role), motion = (role === 'flyer' ? FLYER[anim] : undefined) ?? MOTION[anim] ?? (anim as Motion);
  scene.add(a.root);
  const box = new THREE.Box3(); // рамка по всей анимации: летун в полёте выше, чем стоя
  for (let i = 0; i < 4; i++) { a.pose((i ? motion : 'idle') as never, (i / 4) * motionDuration(motion)); box.union(new THREE.Box3().setFromObject(a.root)); }
  const size = box.getSize(new THREE.Vector3());
  const H = Math.max(box.max.y, size.x, size.z) * 1.35, ty = box.max.y * 0.45, el = (35 * Math.PI) / 180;
  const cam = new THREE.OrthographicCamera(-H / 2, H / 2, H / 2, -H / 2, 0.01, 500);
  cam.position.set(0, ty + Math.sin(el) * 50, Math.cos(el) * 50); cam.lookAt(0, ty, 0); cam.updateMatrixWorld();
  const o = new THREE.Vector3(0, 0, 0).project(cam), anchor = { x: Math.round(((o.x + 1) / 2) * CELL), y: Math.round(((1 - o.y) / 2) * CELL) };
  const out = document.createElement('canvas'); out.width = out.height = CELL * 8;
  const g = out.getContext('2d', { willReadFrequently: true })!; g.imageSmoothingEnabled = false;
  const dur = motionDuration(motion), frames: { x: number; y: number; w: number; h: number; time: number; bbox: { x: number; y: number; w: number; h: number } }[][] = [];
  for (let row = 0; row < 8; row++) {
    const face = ((135 - 45 * row) * Math.PI) / 180, line: typeof frames[number] = [];
    a.root.rotation.y = Math.PI / 2 - face; // как в World3D: модель смотрит по +Z
    for (let col = 0; col < 8; col++) {
      const time = anim === 'death' ? (col / 7) * dur : (col / 8) * dur;
      a.pose(motion as never, time);
      r.render(scene, cam);
      g.drawImage(r.domElement, col * CELL, row * CELL, CELL, CELL);
      const px = g.getImageData(col * CELL, row * CELL, CELL, CELL).data;
      let x0 = CELL, y0 = CELL, x1 = -1, y1 = -1;
      for (let y = 0; y < CELL; y++) for (let x = 0; x < CELL; x++) if (px[(y * CELL + x) * 4 + 3] > 16) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
      line.push({ x: col * CELL, y: row * CELL, w: CELL, h: CELL, time: +time.toFixed(3), bbox: x1 < 0 ? { x: 0, y: 0, w: 0, h: 0 } : { x: x0, y: y0, w: x1 - x0 + 1, h: y1 - y0 + 1 } });
    }
    frames.push(line);
  }
  scene.remove(a.root);
  const blob = await new Promise<Blob>(ok => out.toBlob(b => ok(b!), 'image/webp', 0.95));
  const meta = { faction: pack, role, animation: anim, image: `${anim}.webp`, cellWidth: CELL, cellHeight: CELL, columns: 8, rows: 8, duration: dur, frameTimes: frames[0].map(f => f.time), sampling: 'uniform', fps: 8 / dur, loop: anim !== 'death',
    directionsDegrees: [0, 45, 90, 135, 180, 225, 270, 315], rootForward: '+Z', camera: { elevationDegrees: 35, azimuthDegrees: 0, target: [0, ty, 0], targetHeight: ty, orthographicHeight: H }, anchor, events: [], frames,
    provenance: { source: 'client/models3d/faction-models.ts', kind: 'procedural-bake', tool: 'client/bake.ts', productionArtApproved: false } };
  return { blob, meta };
}

const q = new URLSearchParams(location.search), pack = (q.get('pack') ?? 'tyranids') as Pack, only = q.get('roles')?.split(','), log = document.getElementById('log')!;
const put = (path: string, body: Blob | string) => fetch(`http://127.0.0.1:4174/upload?path=${encodeURIComponent(path)}`, { method: 'POST', body }).then(res => { if (!res.ok) throw Error(path); });
(async () => {
  let n = 0;
  for (const [role, anims] of Object.entries(ROLES)) if (!only || only.includes(role)) for (const anim of anims) {
    const { blob, meta } = await atlas(pack, role as UnitRole, anim), base = `${pack}/${role}/sprites/${anim}`;
    await put(`${base}.webp`, blob); await put(`${base}.json`, JSON.stringify(meta));
    log.textContent = `${++n}: ${base}`;
  }
  log.textContent = `DONE ${n}`;
})().catch(e => { log.textContent = 'ERROR ' + e; });
