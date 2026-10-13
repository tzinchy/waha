// Превью капитана для редактора: живая модель на постаменте, иногда делает замах.
import * as THREE from 'three';
import type { CaptainCfg } from '../shared/sim.ts';
import { allReady, captainActor, type AnyActor } from './models.ts';

export class CaptainPreview {
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera = new THREE.PerspectiveCamera(32, 320 / 380, 0.1, 50);
  private pivot = new THREE.Group();
  private actor?: AnyActor;

  constructor(private canvas: HTMLCanvasElement) {
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    this.renderer.setSize(canvas.width, canvas.height, false);
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.scene.add(new THREE.HemisphereLight(0xdfe8ff, 0x302830, 1.6));
    const sun = new THREE.DirectionalLight(0xffe2c0, 2.6);
    sun.position.set(3, 6, 5);
    const rim = new THREE.DirectionalLight(0xff5040, 1.6);
    rim.position.set(-4, 3, -4);
    this.scene.add(sun, rim, this.pivot);
    const base = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.7, 0.25, 40), new THREE.MeshStandardMaterial({ color: 0x24202a, roughness: 0.6 }));
    base.position.y = -0.13;
    this.scene.add(base);
    this.camera.position.set(0, 2.6, 6.4);
    this.camera.lookAt(0, 1.1, 0);
    let last = performance.now(), swing = 0;
    const loop = (now: number) => {
      requestAnimationFrame(loop);
      const dt = Math.min(0.05, (now - last) / 1000); last = now;
      if (!this.canvas.offsetParent) return; // скрыт (идёт игра)
      this.pivot.rotation.y += dt * 0.5;
      if ((swing += dt) > 3) { swing = 0; this.actor?.attack(); }
      this.actor?.update(dt);
      this.renderer.render(this.scene, this.camera); // превью всегда обычное 3D: цвета брони должны быть видны
    };
    requestAnimationFrame(loop);
  }

  set(cfg: CaptainCfg) {
    allReady.then(() => {
      if (this.actor) this.pivot.remove(this.actor.root);
      this.actor = captainActor(cfg);
      this.pivot.add(this.actor.root);
    });
  }
}
