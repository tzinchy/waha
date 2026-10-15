// 3D-модель фракции вне поля боя: живое превью капитана в лобби.
import * as THREE from 'three';
import { FactionActor, type UnitRole, type FactionId as Pack } from './models3d/faction-models.ts';

function stage() {
  const scene = new THREE.Scene();
  scene.add(new THREE.HemisphereLight(0xdfe7ec, 0x3b3128, 2.2));
  const sun = new THREE.DirectionalLight(0xffe2b5, 2.6); sun.position.set(-4, 8, 6); scene.add(sun);
  const rim = new THREE.DirectionalLight(0x9fb3c8, 1.4); rim.position.set(4, 4, -6); scene.add(rim);
  return scene;
}
function renderer(canvas: HTMLCanvasElement) {
  const r = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  r.setClearColor(0, 0); r.outputColorSpace = THREE.SRGBColorSpace; r.toneMapping = THREE.ACESFilmicToneMapping; r.toneMappingExposure = 1.2;
  return r;
}
/** Камера на три четверти спереди, кадр по рамке модели. */
function frame(cam: THREE.PerspectiveCamera, obj: THREE.Object3D) {
  const b = new THREE.Box3().setFromObject(obj), size = b.getSize(new THREE.Vector3()), c = b.getCenter(new THREE.Vector3());
  const d = Math.max(size.y, size.x) / (2 * Math.tan((cam.fov * Math.PI) / 360)) * 1.15;
  cam.position.set(c.x + d * 0.45, c.y + d * 0.25, c.z + d * 0.9); cam.lookAt(c); cam.updateProjectionMatrix();
}

/** Живое превью: модель стоит, дышит и раз в 4 с бьёт. */
export class Live3D {
  private canvas = document.createElement('canvas');
  private r = renderer(this.canvas);
  private scene = stage();
  private cam = new THREE.PerspectiveCamera(30, 1, 0.01, 200);
  private actor?: FactionActor;
  private t0 = performance.now();
  constructor(private el: HTMLElement) {
    Object.assign(this.canvas.style, { width: '100%', height: '100%', display: 'block' });
    const tick = () => {
      if (this.actor && this.canvas.isConnected) {
        const w = this.el.clientWidth, h = this.el.clientHeight;
        if (w && h && (this.canvas.width !== w || this.canvas.height !== h)) { this.r.setSize(w, h, false); this.cam.aspect = w / h; this.cam.updateProjectionMatrix(); }
        const t = ((performance.now() - this.t0) / 1000) % 4, atk = this.actor.role === 'captain' ? 'attack_slash' : 'shoot';
        this.actor.pose((t > 3 ? atk : 'idle') as never, t > 3 ? t - 3 : t);
        this.actor.root.rotation.y = Math.sin(performance.now() / 3000) * 0.35;
        this.r.render(this.scene, this.cam);
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }
  set(pack: Pack, role: UnitRole = 'captain') {
    if (this.actor) this.scene.remove(this.actor.root);
    this.actor = new FactionActor(pack, role); this.actor.pose('idle', 0);
    this.scene.add(this.actor.root); frame(this.cam, this.actor.root);
    if (!this.el.contains(this.canvas)) this.el.replaceChildren(this.canvas);
  }
}
