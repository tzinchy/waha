// Просмотрщик моделей Ultimate Apocalypse прямо из файлов мода (папка ua/, только dev — в сборку не входит).
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { buildWhm, meshVisible, parseRsh, parseWhm } from './whm.ts';

const WHM = import.meta.glob('../ua/**/*.whm', { query: '?url', import: 'default', eager: true }) as Record<string, string>;
const RSH = import.meta.glob('../ua/**/*.rsh', { query: '?url', import: 'default', eager: true }) as Record<string, string>;
const key = (p: string) => p.toLowerCase().replace(/^.*?\/data\//, '').replace(/\.(whm|rsh)$/, '');
const rshUrl = new Map(Object.entries(RSH).map(([p, u]) => [key(p), u]));

const canvas = document.querySelector('canvas')!, nav = document.querySelector('nav')!, title = document.querySelector('h4')!;
const r = new THREE.WebGLRenderer({ canvas, antialias: true });
r.outputColorSpace = THREE.SRGBColorSpace;
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x120f0c);
scene.add(new THREE.HemisphereLight(0xdfe7ec, 0x3b3128, 2.2));
const sun = new THREE.DirectionalLight(0xffe2b5, 2.6);
sun.position.set(-4, 8, 6);
scene.add(sun, new THREE.GridHelper(20, 20, 0x4a3c2a, 0x2a221b));
const cam = new THREE.PerspectiveCamera(35, 1, 0.01, 500), orbit = new OrbitControls(cam, canvas);
let mixer: THREE.AnimationMixer | null = null, current: THREE.Object3D | null = null;

const textures = new Map<string, Promise<THREE.Texture | null>>();
const loadTexture = (path: string) => {
  const url = rshUrl.get(path);
  if (!url) return Promise.resolve(null);
  if (!textures.has(path)) textures.set(path, fetch(url).then((x) => x.arrayBuffer()).then((b) => {
    const t = parseRsh(b), tex = new THREE.DataTexture(t.rgba, t.width, t.height);
    tex.colorSpace = THREE.SRGBColorSpace; tex.generateMipmaps = true; tex.minFilter = THREE.LinearMipmapLinearFilter; tex.magFilter = THREE.LinearFilter; tex.needsUpdate = true; // DXT хранится сверху вниз — как и DataTexture без flipY
    return tex;
  }));
  return textures.get(path)!;
};

async function show(path: string, btn: HTMLButtonElement) {
  document.querySelectorAll('aside button.on').forEach((b) => b.classList.remove('on'));
  btn.classList.add('on');
  const m = parseWhm(await (await fetch(WHM[path])).arrayBuffer());
  const paths = [...new Set(m.meshes.flatMap((s) => s.groups.map((g) => g.texture.toLowerCase())))];
  const tex = new Map(await Promise.all(paths.map(async (p) => [p, await loadTexture(p)] as const)));
  const model = buildWhm(m, (p) => tex.get(p) ?? null);
  if (current) scene.remove(current);
  scene.add((current = model.root));
  mixer = new THREE.AnimationMixer(model.root);
  const box = new THREE.Box3().setFromObject(model.root), size = box.getSize(new THREE.Vector3()).length() || 2, c = box.getCenter(new THREE.Vector3());
  orbit.target.copy(c); cam.position.set(c.x + size * 0.6, c.y + size * 0.45, c.z + size * 0.9); orbit.update();
  title.textContent = `${key(path)} — ${m.meshes.length} мешей, ${m.bones.length} костей, ${m.anims.length} анимаций, текстур ${[...tex.values()].filter(Boolean).length}/${paths.length}`;
  const layers = new Set<string>();
  let playing = '';
  const showMeshes = () => { for (const m of model.meshes) m.visible = meshVisible(model.vis, playing, [...layers], m.name); };
  nav.replaceChildren(...model.clips.map((clip) => {
    const b = document.createElement('button');
    b.textContent = clip.name;
    b.onclick = /^vis_/.test(clip.name) // vis-слой (оружие) включается поверх анимации
      ? () => { b.classList.toggle('on', !layers.delete(clip.name) && !!layers.add(clip.name)); showMeshes(); }
      : () => { mixer!.stopAllAction(); mixer!.clipAction(clip).play(); playing = clip.name; showMeshes(); nav.querySelectorAll('.on').forEach((x) => !/^vis_/.test(x.textContent!) && x.classList.remove('on')); b.classList.add('on'); };
    return b;
  }));
  ([...nav.children].find((b) => /^idle/.test(b.textContent!)) as HTMLButtonElement | undefined)?.click();
}

document.querySelector('aside')!.append(...Object.keys(WHM).sort().map((p) => {
  const b = document.createElement('button');
  b.textContent = key(p).replace(/^art\/ebps\/races\//, '');
  b.onclick = () => void show(p, b).catch((e) => (title.textContent = `Ошибка: ${e.message}`));
  return b;
}));

const clock = new THREE.Clock();
r.setAnimationLoop(() => {
  const w = canvas.clientWidth, h = canvas.clientHeight;
  if (canvas.width !== w * devicePixelRatio || canvas.height !== h * devicePixelRatio) { r.setPixelRatio(devicePixelRatio); r.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix(); }
  mixer?.update(clock.getDelta());
  r.render(scene, cam);
});
