// 3D-клиент матча: рисует снимки сервера, собирает ввод в команды. Игровых правил здесь нет.
import * as THREE from 'three';
import { CAP, KINDS, UPGRADES, MAP, POINTS, POINT_R, REINFORCE_COST, STATS, isStruct, maxHp, members, type Buildable, type Cmd, type Kind, type Snap } from '../shared/sim.ts';
import type { LobbyPlayer } from '../shared/protocol.ts';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { GTAOPass } from 'three/examples/jsm/postprocessing/GTAOPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { AsciiPass } from './ascii.ts';

/** Цветокор grimdark: приглушённые цвета, холодные тени, тёплый свет, виньетка, зерно. Работает после тонмаппинга (OutputPass). */
const GRADE = {
  uniforms: { tDiffuse: { value: null }, time: { value: 0 } },
  vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }',
  fragmentShader: `
    uniform sampler2D tDiffuse; uniform float time; varying vec2 vUv;
    void main(){
      vec3 c = texture2D(tDiffuse, vUv).rgb;
      float l = dot(c, vec3(.299, .587, .114));
      c = mix(vec3(l), c, .78);
      c = mix(c * vec3(.86, .93, 1.08), c * vec3(1.08, 1.0, .9), smoothstep(.15, .75, l));
      c = (c - .5) * 1.12 + .5;
      float v = smoothstep(1.05, .35, length(vUv - .5) * 1.25);
      c *= mix(.45, 1., v);
      c += (fract(sin(dot(vUv * 913. + time, vec2(12.9898, 78.233))) * 43758.5453) - .5) * .035;
      gl_FragColor = vec4(clamp(c, 0., 1.), 1.);
    }`,
};
import { audio } from './audio.ts';
import { SpriteActor, PLAYER_FACTIONS } from './sprite-actor.ts';
import { Actor, RigActor, captainActor, hasMeshy, meshyBuilding, model, type AnyActor, type ModelKey } from './models.ts';

export const SLOT_COLORS = [0x3b82f6, 0xef4444, 0x22c55e, 0xeab308];
const hex = (c: number) => '#' + c.toString(16).padStart(6, '0');
const $ = (id: string) => document.getElementById(id)!;

type View = {
  id: number; owner: number; kind: Kind; root: THREE.Group; body: THREE.Group; actors: AnyActor[]; sprite?: SpriteActor; bar: THREE.Group; fg: THREE.Mesh; sel: THREE.Mesh; ring: THREE.Mesh;
  x: number; z: number; f: number; tx: number; tz: number; tf: number; hp: number; build: number; q: number; dead: boolean; lvl: number; upg: number;
};

/** Оверлей (слой 1): кольца, полосы хп, выстрелы. В ASCII-режиме рисуется поверх текста чётко, а не символами. */
const ov = <T extends THREE.Object3D>(o: T) => { o.traverse(c => c.layers.set(1)); return o; };
const FLAT = [...POINTS, [12, 12], [88, 88], [88, 12], [12, 88]];
/** Высота рельефа: ровно у баз и точек, холмы между ними. */
export function groundH(x: number, z: number) {
  const f = Math.min(1, ...FLAT.map(([px, pz]) => Math.hypot(px - x, pz - z) / 14));
  return (Math.sin(x * 0.21) * Math.cos(z * 0.17) * 0.5 + Math.sin(x * 0.07 + z * 0.05) * 0.8) * f * f;
}
const ringGeo = (r: number) => new THREE.RingGeometry(r * 0.92, r * 1.08, 40);
const flat = <T extends THREE.Object3D>(m: T, y: number) => { m.rotation.x = -Math.PI / 2; m.position.y = y; return m; };
const BAR: Record<Kind, [number, number]> = { captain: [2.4, 3.2], builder: [1.8, 2.3], guard: [3.2, 2.3], hq: [6, 14], barracks: [4.5, 5.6], post: [2.4, 5.6], turret: [2.4, 3.6] };
// постройки: модель KayKit, масштаб, высота флага
const BUILD: Record<'hq' | 'barracks' | 'post' | 'turret', [ModelKey, number, number]> = { turret: ['rocks', 1.1, 1.0], hq: ['castle', 5, 12.6], barracks: ['barracks', 3.3, 4.4], post: ['watchtower', 2.2, 4.3] };

function building(kind: 'hq' | 'barracks' | 'post' | 'turret', color: number) {
  const [k, scale, h] = BUILD[kind], g = new THREE.Group(), m = model(k);
  if (kind === 'turret') { // турель: каменное основание и большой арбалет-баллиста
    const top = new THREE.Group(), bow = model('crossbow');
    bow.scale.setScalar(3.2); bow.rotation.y = Math.PI / 2; bow.position.y = 1.2;
    top.add(bow); top.name = 'turret-top'; g.add(top);
  }
  m.scale.setScalar(scale);
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 2.2, 6), new THREE.MeshStandardMaterial({ color: 0x2a2018 }));
  pole.position.y = h + 1.1;
  const flag = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 0.9), new THREE.MeshStandardMaterial({ color, side: THREE.DoubleSide }));
  flag.position.set(0.75, h + 1.7, 0);
  g.add(m, pole, flag);
  return g;
}
// расстановка бойцов отряда в локальных координатах (вперёд = +x)
const FORM: Partial<Record<Kind, [number, number][]>> = {
  guard: [[0.9, 0], [-0.4, -1.5], [-0.4, 1.5], [-1.8, -0.7], [-1.8, 0.9]],
  builder: [[0, -0.9], [0, 0.9]],
};

export class Game {
  private renderer = new THREE.WebGLRenderer({ antialias: true });
  private scene = new THREE.Scene();
  private camera = new THREE.PerspectiveCamera(45, 1, 0.5, 400);
  private views = new Map<number, View>();
  private sel = new Set<number>();
  private cam = { x: 50, z: 50, yaw: 0, pitch: 1.0, dist: 40 };
  private keys = new Set<string>();
  private points: { sun: THREE.Mesh; ring: THREE.Mesh; disc: THREE.Mesh; flag: THREE.Mesh }[] = [];
  private shots: { a: THREE.Vector3; b: THREE.Vector3; until: number }[] = [];
  private corpses: { root: THREE.Group; body: THREE.Group; actors: AnyActor[]; until: number; struct: boolean }[] = [];
  private beam: THREE.LineSegments;
  private pass: AsciiPass;
  private composer: EffectComposer;
  private grade = new ShaderPass(GRADE);
  private ascii = false; // ASCII-режим включается клавишей G
  private ghost = new THREE.Group();
  private place: Buildable | null = null;
  private drag: { x0: number; y0: number; x1: number; y1: number } | null = null;
  private mouse: { x: number; y: number } | null = null;
  private amove = false;
  private centered = false;
  private ended = false;
  private req = 0;
  private tier = 1;
  private snapN = 0;
  private lastAlert = 0;
  private grenadeTargeting = false;
  private lastBlastKey = '';
  private alertMarkers: { el: HTMLButtonElement; x: number; z: number; until: number }[] = [];
  private pointOwner: number[] = [];
  private cmdHtml = '';
  private raf = 0;
  private t0 = performance.now();
  private ac = new AbortController();
  private ray = new THREE.Raycaster();
  private plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  private barBg = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.6, depthTest: false });
  private barOwn = new THREE.MeshBasicMaterial({ color: 0x44dd66, depthTest: false });
  private barEnemy = new THREE.MeshBasicMaterial({ color: 0xff5544, depthTest: false });
  private barLow = new THREE.MeshBasicMaterial({ color: 0xffa030, depthTest: false });
  private barBuild = new THREE.MeshBasicMaterial({ color: 0xd4af37, depthTest: false });
  private barGeo = new THREE.PlaneGeometry(1, 0.14);
  private fgGeo = new THREE.PlaneGeometry(1, 0.14).translate(0.5, 0, 0);

  constructor(
    private root: HTMLElement, private slot: number, private players: LobbyPlayer[],
    private send: (c: Cmd) => void, private onEnd: (winner: number) => void,
  ) {
    const r = this.renderer;
    r.setPixelRatio(Math.min(devicePixelRatio, 2));
    r.shadowMap.enabled = true;
    r.toneMapping = THREE.ACESFilmicToneMapping;
    root.prepend(r.domElement);
    const style = document.createElement('style');
    style.textContent = '.waha-alert{position:absolute;z-index:30;border:2px solid #ff704e;border-radius:50%;background:#ff503022;color:#ffe2cc;box-shadow:0 0 16px #ff5030;min-width:44px;min-height:44px;cursor:pointer;animation:waha-ping 1s ease-in-out infinite alternate}@keyframes waha-ping{to{transform:scale(1.3);box-shadow:0 0 28px #ff5030}}';
    root.append(style);
    this.camera.layers.enableAll();
    this.pass = new AsciiPass(r, 7, 12);
    this.composer = new EffectComposer(r);
    this.composer.addPass(new RenderPass(this.scene, this.camera));
    const ao = new GTAOPass(this.scene, this.camera);
    ao.updateGtaoMaterial({ radius: 1.2, scale: 1.4 });
    this.composer.addPass(ao);
    this.composer.addPass(new UnrealBloomPass(new THREE.Vector2(256, 256), 0.35, 0.6, 0.85));
    this.composer.addPass(new OutputPass());
    this.composer.addPass(this.grade);
    this.buildWorld();
    const bg = new THREE.BufferGeometry();
    bg.setAttribute('position', new THREE.BufferAttribute(new Float32Array(200 * 6), 3));
    this.beam = new THREE.LineSegments(bg, new THREE.LineBasicMaterial({ color: 0xfff2a0 }));
    this.beam.frustumCulled = false;
    this.scene.add(ov(this.beam));
    const gm = new THREE.MeshBasicMaterial({ color: 0x7dff9a, transparent: true, opacity: 0.25, depthTest: false, side: THREE.DoubleSide });
    this.ghost.add(new THREE.Mesh(new THREE.CircleGeometry(1, 48), gm), new THREE.Mesh(new THREE.RingGeometry(0.93, 1, 48), gm.clone()));
    this.ghost.visible = false;
    this.ghost.renderOrder = 20;
    this.scene.add(ov(flat(this.ghost, 0.2)));
    this.bind();
    this.resize();
    this.raf = requestAnimationFrame(this.frame);
    audio.setBattle(true);
    $('hud-players').innerHTML = players.map((p, i) => `<div id="hp${i}"><i style="background:${hex(SLOT_COLORS[i])}"></i>${p.name.replace(/[<>&]/g, '')}</div>`).join('');
  }

  destroy() {
    audio.setBattle(false);
    for (const a of this.alertMarkers) a.el.remove();
    for (const v of this.views.values()) v.sprite?.dispose();
    cancelAnimationFrame(this.raf);
    this.ac.abort();
    this.renderer.dispose();
    this.renderer.domElement.remove();
  }

  // ---------- мир ----------
  private sunburst() { // веер лучей Art Deco для стратегических точек
    const c = document.createElement('canvas');
    c.width = c.height = 256;
    const x = c.getContext('2d')!;
    x.translate(128, 128);
    for (let i = 0; i < 24; i++) {
      x.fillStyle = i % 2 ? 'rgba(255,255,255,.55)' : 'rgba(255,255,255,.12)';
      x.beginPath(); x.moveTo(0, 0); x.arc(0, 0, 124, (i * Math.PI) / 12, ((i + 1) * Math.PI) / 12); x.fill();
    }
    x.strokeStyle = 'rgba(255,255,255,.8)'; x.lineWidth = 3;
    for (const r of [40, 76, 112]) { x.beginPath(); x.arc(0, 0, r, 0, 7); x.stroke(); }
    return new THREE.CanvasTexture(c);
  }

  private buildWorld() {
    const s = this.scene;
    s.background = new THREE.Color(0x121620);
    s.fog = new THREE.Fog(0x121620, 75, 175);
    s.add(new THREE.HemisphereLight(0x9fb0d0, 0x2a2a22, 1.1));
    const sun = new THREE.DirectionalLight(0xffcf9a, 2.6); // низкое тёплое солнце, длинные тени
    sun.position.set(90, 55, 35);
    sun.target.position.set(50, 0, 50);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    Object.assign(sun.shadow.camera, { left: -80, right: 80, top: 80, bottom: -80, near: 1, far: 300 });
    sun.shadow.camera.updateProjectionMatrix();
    s.add(sun, sun.target);

    const tl = new THREE.TextureLoader(), maps = ['diff', 'nor_gl', 'rough'].map(m => { // земля Poly Haven (CC0)
      const t = tl.load(`/tex/ground_${m}.jpg`);
      t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(14, 14); t.anisotropy = 8;
      return t;
    });
    maps[0].colorSpace = THREE.SRGBColorSpace;
    const gg = new THREE.PlaneGeometry(MAP.w, MAP.h, 120, 120), pos = gg.attributes.position;
    for (let i = 0; i < pos.count; i++) { // лёгкий рельеф, ровно у баз и точек
      const x = pos.getX(i) + MAP.w / 2, z = MAP.h / 2 - pos.getY(i);
      pos.setZ(i, groundH(x, z));
    }
    gg.computeVertexNormals();
    const g = flat(new THREE.Mesh(gg, new THREE.MeshStandardMaterial({ map: maps[0], normalMap: maps[1], roughnessMap: maps[2], color: 0x8a8a7a })), 0);
    g.position.x = MAP.w / 2; g.position.z = MAP.h / 2; g.receiveShadow = true;
    const out = flat(new THREE.Mesh(new THREE.PlaneGeometry(600, 600), new THREE.MeshStandardMaterial({ color: 0x1d2a1f, roughness: 1 })), -0.05);
    out.position.set(MAP.w / 2, -3, MAP.h / 2);
    s.add(g, out);

    const sunTex = this.sunburst();
    for (const [x, y] of POINTS) {
      const sunM = flat(new THREE.Mesh(new THREE.CircleGeometry(POINT_R, 48), new THREE.MeshBasicMaterial({ map: sunTex, color: 0xd4af37, transparent: true, opacity: 0.55, depthWrite: false })), 0.04);
      const ring = flat(new THREE.Mesh(new THREE.RingGeometry(POINT_R - 0.35, POINT_R, 64), new THREE.MeshBasicMaterial({ color: 0x9aa0aa, side: THREE.DoubleSide })), 0.06);
      const disc = flat(new THREE.Mesh(new THREE.CircleGeometry(POINT_R - 0.35, 48), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.3, depthWrite: false })), 0.05);
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 4, 6), new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 1, roughness: 0.3 }));
      pole.position.set(x, 2, y);
      const flag = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 1.1), new THREE.MeshBasicMaterial({ color: 0x9aa0aa, side: THREE.DoubleSide }));
      flag.position.set(x + 0.9, 3.4, y);
      for (const m of [sunM, ring, disc]) m.position.set(x, m.position.y, y);
      s.add(sunM, ov(ring), disc, pole, flag);
      this.points.push({ sun: sunM, ring, disc, flag });
    }
    this.scenery();
  }

  private noise() {
    const c = document.createElement('canvas');
    c.width = c.height = 512;
    const x = c.getContext('2d')!;
    x.fillStyle = '#3d5232'; x.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 12000; i++) {
      x.fillStyle = Math.random() < 0.5 ? 'rgba(20,40,15,.12)' : 'rgba(150,190,100,.10)';
      x.beginPath(); x.arc(Math.random() * 512, Math.random() * 512, 1 + Math.random() * 4, 0, 7); x.fill();
    }
    return c;
  }

  private scenery() { // декор KayKit, одинаковый у всех (фиксированный seed): лес и камни на поле, горы по краю карты
    let seed = 1337;
    const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
    const hqs = [[12, 12], [88, 88], [88, 12], [12, 88]];
    const free = (x: number, z: number) => POINTS.every(([px, pz]) => Math.hypot(px - x, pz - z) > POINT_R + 3) && hqs.every(([px, pz]) => Math.hypot(px - x, pz - z) > 24);
    const put = (k: ModelKey, x: number, z: number, s: number) => {
      const m = model(k);
      m.position.set(x, groundH(x, z), z); m.rotation.y = rnd() * Math.PI * 2; m.scale.setScalar(s);
      this.scene.add(m);
    };
    for (let i = 0, n = 0; n < 70 && i < 800; i++) {
      const x = rnd() * MAP.w, z = rnd() * MAP.h;
      if (!free(x, z)) continue;
      n++;
      const r = rnd();
      if (r < 0.55) put((['treeA', 'treeB', 'treeC'] as const)[Math.floor(rnd() * 3)], x, z, 2.8 + rnd() * 1.2);
      else if (r < 0.75) put('forestA', x, z, 2.2 + rnd() * 0.8);
      else if (r < 0.92) put('rocks', x, z, 1.6 + rnd());
      else put('hill', x, z, 2.5 + rnd());
    }
    for (let t = -10; t <= MAP.w + 10; t += 9) { // кольцо гор вокруг поля боя
      for (const [x, z] of [[t, -17], [t, MAP.h + 17], [-17, t], [MAP.w + 17, t]]) put('mountain', x + rnd() * 4, z + rnd() * 4, 11 + rnd() * 4);
    }
  }

  // ---------- юниты ----------
  private mk(id: number, owner: number, kind: Kind, x: number, z: number, f: number): View {
    const color = SLOT_COLORS[owner] ?? 0xffffff;
    const cfg = this.players[owner].captain;
    const body = new THREE.Group(), actors: AnyActor[] = [];
    if (kind === 'captain') { const a = captainActor(cfg, 0.85); body.add(a.root); actors.push(a); }
    else if (kind === 'guard' || kind === 'builder') {
      for (const [ox, oz] of FORM[kind]!) {
        const a = hasMeshy(kind) ? new RigActor(kind, kind === 'guard' ? 1.7 : 1.6, cfg.armor, kind === 'guard') : kind === 'guard'
          ? new Actor('rogue', { tint: { GreenDark: cfg.armor }, right: 'crossbow', ranged: true, scale: 0.6 })
          : new Actor('barbarian', { tint: { BlueDark: cfg.armor }, right: 'hammer', scale: 0.6 });
        a.root.position.set(ox, 0, oz);
        body.add(a.root); actors.push(a);
      }
    } else body.add(hasMeshy(kind) ? meshyBuilding(kind, STATS[kind].radius) : building(kind, color));
    const root = new THREE.Group();
    const r = STATS[kind].radius;
    const ring = flat(new THREE.Mesh(ringGeo(r * 1.15), new THREE.MeshBasicMaterial({ color, side: THREE.DoubleSide })), 0.07);
    const sel = flat(new THREE.Mesh(new THREE.RingGeometry(r * 1.4, r * 1.65, 40), new THREE.MeshBasicMaterial({ color: 0x7dff9a, side: THREE.DoubleSide })), 0.08);
    sel.visible = false;
    const bar = new THREE.Group();
    const bg = new THREE.Mesh(this.barGeo, this.barBg); bg.renderOrder = 10;
    const fg = new THREE.Mesh(this.fgGeo, this.barOwn); fg.renderOrder = 11; fg.position.set(-0.5, 0, 0.001);
    bar.add(bg, fg);
    const [w, h] = BAR[kind];
    bar.scale.set(w, 1, 1); bar.position.y = h;
    root.add(body, ov(ring), ov(sel), ov(bar));
    let sprite: SpriteActor | undefined;
    if (kind === 'captain' || kind === 'guard' || kind === 'builder') {
      sprite = new SpriteActor(this.players[owner]?.captain.faction ?? PLAYER_FACTIONS[owner % PLAYER_FACTIONS.length], kind, root);
      void sprite.ready.then(ok => { if (ok && root.parent) body.visible = false; });
    }
    this.scene.add(root);
    root.position.set(x, 0, z);
    body.rotation.y = isStruct(kind) ? 0 : -f;
    return { id, owner, kind, root, body, actors, sprite, bar, fg, sel, ring, x, z, f, tx: x, tz: z, tf: f, hp: maxHp(kind), build: 1, q: 0, dead: false, lvl: 1, upg: -1 };
  }

  onSnap(s: Snap) {
    const seen = new Set<number>(), first = this.snapN++ === 0, now = performance.now();
    for (const [id, owner, ki, x, y, hp, face, q, bp, , lvl, upg] of s.u) {
      seen.add(id);
      const kind = KINDS[ki];
      let v = this.views.get(id);
      if (!v) {
        this.views.set(id, (v = this.mk(id, owner, kind, x / 10, y / 10, face / 100)));
        if (!first && owner === this.slot && !isStruct(kind)) audio.trained();
      } else if (owner === this.slot) { // события своих юнитов: стройка завершена, капитан пал, нас бьют
        if (v.build < 1 && bp >= 100) audio.built();
        if (kind === 'captain' && v.hp > 0 && hp <= 0) audio.alarm();
        else if (hp < v.hp && now - this.lastAlert > 5000) { this.lastAlert = now; audio.alarm(); this.addAttackAlert(v.tx, v.tz); }
      }
      v.tx = x / 10; v.tz = y / 10; v.tf = face / 100; v.hp = hp; v.q = q; v.build = bp / 100; v.dead = hp <= 0; v.lvl = lvl; v.upg = upg;
      if (kind === 'hq' && owner === this.slot && !this.centered) {
        this.centered = true;
        this.cam.x = v.tx + (MAP.w / 2 - v.tx) * 0.3; this.cam.z = v.tz + (MAP.h / 2 - v.tz) * 0.3;
      }
    }
    let gone = 0;
    for (const [id, v] of this.views) if (!seen.has(id)) {
      this.views.delete(id); this.sel.delete(id);
      v.bar.visible = v.sel.visible = v.ring.visible = false;
      for (const a of v.actors) a.die();
      v.sprite?.setAction('death', true);
      this.corpses.push({ root: v.root, body: v.body, actors: v.actors, until: now + (isStruct(v.kind) ? 900 : 1800), struct: isStruct(v.kind) });
      const a = this.audioAt(v.x, v.z);
      if (a && !first && gone++ < 2) isStruct(v.kind) ? audio.boom(a.pan) : audio.death(a.pan);
    }
    s.p.forEach(([owner, prog, by], i) => {
      if (this.pointOwner[i] !== undefined && this.pointOwner[i] !== owner) { // точка сменила владельца
        if (owner === this.slot) audio.captured(); else if (this.pointOwner[i] === this.slot) audio.lost();
      }
      this.pointOwner[i] = owner;
      const p = this.points[i], col = owner >= 0 ? SLOT_COLORS[owner] : 0x9aa0aa;
      (p.ring.material as THREE.MeshBasicMaterial).color.setHex(col);
      (p.flag.material as THREE.MeshBasicMaterial).color.setHex(col);
      (p.sun.material as THREE.MeshBasicMaterial).color.setHex(owner >= 0 ? col : 0xd4af37);
      p.disc.visible = prog > 0;
      p.disc.scale.setScalar(Math.max(0.01, prog / 100));
      (p.disc.material as THREE.MeshBasicMaterial).color.setHex(by >= 0 ? SLOT_COLORS[by] : 0xffffff);
    });
    for (const [x1, y1] of s.sh) { // кто стрелял: ближайший юнит у начала выстрела делает атаку
      let best: View | undefined, bd = 2.2;
      for (const v of this.views.values()) {
        if (!v.actors.length || v.dead) continue;
        const d = Math.hypot(v.tx - x1 / 10, v.tz - y1 / 10);
        if (d < bd) { bd = d; best = v; }
      }
      best?.actors.forEach((a, i) => a.attack(i ? Math.random() * 0.3 : 0));
      best?.sprite?.attack();
    }
    let heard = 0;
    for (const [x1, y1] of s.sh) { const a = this.audioAt(x1 / 10, y1 / 10); if (a && heard++ < 4) audio.shot(a.pan); }
    audio.heat(Math.min(0.4, s.sh.length * 0.02));
    const until = performance.now() + 130;
    for (const [x1, y1, x2, y2] of s.sh) this.shots.push({ a: new THREE.Vector3(x1 / 10, 1.4, y1 / 10), b: new THREE.Vector3(x2 / 10, 1.4, y2 / 10), until });
    const newest = (s.blasts ?? []).find(b => b[2] < 10);
    if (newest) {
      const key = newest.join(':');
      if (key !== this.lastBlastKey) {
        this.lastBlastKey = key;
        if (newest[3] <= 50) audio.grenadeImpact(this.audioAt(newest[0] / 10, newest[1] / 10)?.pan ?? 0);
        else audio.boom(this.audioAt(newest[0] / 10, newest[1] / 10)?.pan ?? 0);
      }
    }
    this.hud(s);
    if (s.w !== null && !this.ended) { this.ended = true; this.onEnd(s.w); }
  }

  private addAttackAlert(x: number, z: number) {
    const el = document.createElement('button');
    el.className = 'waha-alert'; el.textContent = '!'; el.title = 'Наши войска атакованы — перейти к месту';
    el.onclick = () => { this.cam.x = x; this.cam.z = z; };
    this.root.append(el);
    this.alertMarkers.push({ el, x, z, until: performance.now() + 7500 });
  }

  // ---------- HUD ----------
  private hud(s: Snap) {
    this.req = s.pl[this.slot][0];
    this.tier = s.pl[this.slot][2] ?? 1;
    $('hud-tier').textContent = `T${this.tier}`;
    let builders = 0, guards = 0, dead = false;
    for (const u of s.u) if (u[1] === this.slot) { if (u[2] === 1) builders++; else if (u[2] === 2) guards++; else if (u[2] === 0 && u[5] <= 0) dead = true; }
    $('hud-req').textContent = String(this.req);
    $('hud-builders').textContent = `${builders}/${CAP.builder}`;
    $('hud-squads').textContent = `${guards}/${CAP.guard}`;
    $('hud-sel').textContent = this.sel.size ? `Выбрано: ${this.sel.size}` : '';
    $('hud-dead').classList.toggle('hidden', !dead);
    s.pl.forEach(([, alive], i) => document.getElementById('hp' + i)?.classList.toggle('dead', !alive));
    this.renderCmd();
  }

  private selected() { return [...this.sel].map(id => this.views.get(id)).filter((v): v is View => !!v); }

  /** Панель команд: что можно сделать с текущим выбором. */
  private renderCmd() {
    const sel = this.selected(), req = this.req;
    const btn = (act: string, label: string, cost: number, hot: string) => `<button data-act="${act}" ${req < cost ? 'disabled' : ''}>${label} <i>${hot}</i> <b>${cost}</b></button>`;
    let html = '';
    const st = sel.length === 1 && isStruct(sel[0].kind) ? sel[0] : null;
    if (st) {
      const q = `<span class="info">в очереди: ${st.q}</span>`;
      if (st.build < 1) html = `<span class="info">Строится ${Math.round(st.build * 100)}%. Отправьте строителей (ПКМ) ускорить</span>`;
      else {
        if (st.kind === 'hq') html = btn('train', 'Строитель', STATS.builder.cost, 'T') + q;
        else if (st.kind === 'barracks') html = btn('train', 'Отряд гвардии', STATS.guard.cost, 'T') + q;
        else if (st.kind === 'post') html = '<span class="info">Пост: +2 requisition/с, держит точку</span>';
        html += this.upgradeBtn([st], btn);
      }
    } else {
      if (sel.some(v => v.kind === 'builder')) html += btn('barracks', 'Казармы', STATS.barracks.cost, 'B') + btn('post', 'Пост', STATS.post.cost, 'P') + btn('turret', 'Турель', STATS.turret.cost, 'Y');
      html += this.upgradeBtn(sel.filter(v => v.kind === 'guard'), btn);
      const hurt = sel.filter(v => v.kind === 'guard' && v.hp < maxHp('guard'));
      if (hurt.length) html += btn('reinforce', 'Пополнить', hurt.reduce((n, v) => n + Math.ceil((maxHp('guard') - v.hp) / STATS.guard.hp) * REINFORCE_COST, 0), 'R');
      if (this.place) html += '<span class="info">ЛКМ поставить · ПКМ или Esc отмена</span>';
    }
    if (html !== this.cmdHtml) { this.cmdHtml = html; $('hud-cmd').innerHTML = html; }
  }

  /** Кнопка апгрейда: цена, требуемый тир или прогресс, если уже идёт. */
  private upgradeBtn(vs: View[], btn: (a: string, l: string, c: number, h: string) => string) {
    const v = vs.find(x => x.lvl < 2), up = v && UPGRADES[v.kind];
    if (!v || !up) return vs.length && UPGRADES[vs[0].kind] ? '<span class="info">Улучшено ★</span>' : '';
    if (v.upg >= 0) return `<span class="info">${up.name}: ${v.upg}%</span>`;
    if (this.tier < up.tier) return `<span class="info">${up.name}: нужен тир ${up.tier} (штаб)</span>`;
    return btn('upgrade', up.name, up.cost, 'U');
  }

  private doAct(act: string) {
    const sel = this.selected();
    if (act === 'train') { const st = sel.find(v => isStruct(v.kind)); if (st) this.cmd({ c: 'train', id: st.id }); }
    else if (act === 'barracks' || act === 'post') { if (sel.some(v => v.kind === 'builder')) this.startPlace(act); }
    else if (act === 'turret') { if (sel.some(v => v.kind === 'builder')) this.startPlace('turret'); }
    else if (act === 'upgrade') { for (const v of sel) if (UPGRADES[v.kind] && v.lvl < 2 && v.upg < 0) this.cmd({ c: 'upgrade', id: v.id }); }
    else if (act === 'reinforce') this.cmd({ c: 'reinforce', ids: sel.filter(v => v.kind === 'guard').map(v => v.id) });
  }

  private startPlace(k: Buildable) {
    this.place = k; this.amove = false;
    this.ghost.scale.setScalar(k === 'post' ? POINT_R * 0.5 : STATS[k].radius + 0.6);
    this.renderer.domElement.style.cursor = 'copy';
    this.renderCmd();
  }
  private stopPlace() { this.place = null; this.ghost.visible = false; this.renderer.domElement.style.cursor = ''; this.cmdHtml = ''; this.renderCmd(); }

  // ---------- ввод ----------
  private cmd(c: Cmd) { if (!this.ended) { this.send(c); audio.order(); } }

  /** Слышен ли звук из этой точки мира и с какой стороны (панорама по экрану). */
  private audioAt(x: number, z: number) {
    const p = new THREE.Vector3(x, 0, z).project(this.camera);
    return p.z < 1 && Math.abs(p.x) < 1.1 && Math.abs(p.y) < 1.1 ? { pan: Math.max(-0.8, Math.min(0.8, p.x * 0.8)) } : null;
  }

  private bind() {
    const cv = this.renderer.domElement, sig = { signal: this.ac.signal };
    cv.addEventListener('contextmenu', e => e.preventDefault(), sig);
    cv.addEventListener('pointerdown', e => {
      cv.setPointerCapture(e.pointerId);
      if (e.button === 0) this.drag = { x0: e.clientX, y0: e.clientY, x1: e.clientX, y1: e.clientY };
      else if (e.button === 2) { if (this.place) this.stopPlace(); else { this.amove = false; cv.style.cursor = ''; this.order(e.clientX, e.clientY); } }
    }, sig);
    cv.addEventListener('pointerleave', () => { this.mouse = null; }, sig);
    cv.addEventListener('pointermove', e => {
      this.mouse = { x: e.clientX, y: e.clientY };
      if (!this.drag) return;
      this.drag.x1 = e.clientX; this.drag.y1 = e.clientY;
      const b = $('selbox'), d = this.drag, moved = Math.hypot(d.x1 - d.x0, d.y1 - d.y0) > 6;
      b.classList.toggle('hidden', !moved);
      if (moved) Object.assign(b.style, { left: Math.min(d.x0, d.x1) + 'px', top: Math.min(d.y0, d.y1) + 'px', width: Math.abs(d.x1 - d.x0) + 'px', height: Math.abs(d.y1 - d.y0) + 'px' });
    }, sig);
    cv.addEventListener('pointerup', e => {
      if (e.button !== 0 || !this.drag) return;
      const d = this.drag; this.drag = null;
      $('selbox').classList.add('hidden');
      if (Math.hypot(d.x1 - d.x0, d.y1 - d.y0) > 6 && !this.place) this.boxSelect(d, e.shiftKey);
      else this.click(e.clientX, e.clientY, e.shiftKey);
      this.renderCmd();
    }, sig);
    cv.addEventListener('wheel', e => { e.preventDefault(); this.cam.dist = Math.max(18, Math.min(90, this.cam.dist * (1 + Math.sign(e.deltaY) * 0.1))); }, { passive: false, ...sig });
    addEventListener('resize', () => this.resize(), sig);
    addEventListener('keydown', e => {
      if (e.target instanceof HTMLInputElement) return;
      const k = e.key.toLowerCase();
      this.keys.add(k);
      if (k === 'h' && this.selected().some(v => v.kind === 'captain' || v.kind === 'guard')) {
        this.grenadeTargeting = true; cv.style.cursor = 'crosshair';
      }
      else if (k === 'a') { this.amove = true; this.place = null; this.ghost.visible = false; cv.style.cursor = 'crosshair'; }
      else if (k === 't') this.doAct('train');
      else if (k === 'b') this.doAct('barracks');
      else if (k === 'p') this.doAct('post');
      else if (k === 'r') this.doAct('reinforce');
      else if (k === 'y') this.doAct('turret');
      else if (k === 'u') this.doAct('upgrade');
      else if (k === 'g') this.ascii = !this.ascii;
      else if (k === 's' && this.sel.size) this.cmd({ c: 'stop', ids: [...this.sel] });
      else if (k === ' ') { e.preventDefault(); this.selectOwn('captain'); }
      else if (k === 'h') this.selectOwn('hq');
      else if (k === 'escape') { this.amove = false; this.sel.clear(); this.stopPlace(); cv.style.cursor = ''; }
      this.renderCmd();
    }, sig);
    addEventListener('keyup', e => this.keys.delete(e.key.toLowerCase()), sig);
    $('hud-cmd').addEventListener('click', e => { const a = (e.target as HTMLElement).closest('button')?.dataset.act; if (a) this.doAct(a); }, sig);
  }

  private resize() {
    const w = this.root.clientWidth || innerWidth, h = this.root.clientHeight || innerHeight;
    this.renderer.setSize(w, h);
    this.composer?.setSize(w, h);
    this.pass.setSize(w, h);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
  }

  private toScreen(v: View) {
    const p = new THREE.Vector3(v.x, isStruct(v.kind) ? 2 : 1, v.z).project(this.camera);
    const r = this.renderer.domElement.getBoundingClientRect();
    return { x: r.left + (p.x * 0.5 + 0.5) * r.width, y: r.top + (-p.y * 0.5 + 0.5) * r.height, ok: p.z < 1 };
  }

  private pick(sx: number, sy: number, want: (v: View) => boolean) {
    let best: View | null = null, bd = 1e9;
    for (const v of this.views.values()) {
      if (!want(v)) continue;
      const p = this.toScreen(v), d = Math.hypot(p.x - sx, p.y - sy), reach = isStruct(v.kind) ? 24 + STATS[v.kind].radius * 12 : 18 + STATS[v.kind].radius * 8;
      if (p.ok && d < reach && d < bd) { bd = d; best = v; }
    }
    return best;
  }

  private groundAt(sx: number, sy: number) {
    const r = this.renderer.domElement.getBoundingClientRect();
    this.ray.setFromCamera(new THREE.Vector2(((sx - r.left) / r.width) * 2 - 1, -((sy - r.top) / r.height) * 2 + 1), this.camera);
    return this.ray.ray.intersectPlane(this.plane, new THREE.Vector3());
  }

  private mobile = (v: View) => v.owner === this.slot && !isStruct(v.kind) && !v.dead;
  private ownStruct = (v: View) => v.owner === this.slot && isStruct(v.kind);

  private click(sx: number, sy: number, add: boolean) {
    if (this.grenadeTargeting) {
      this.grenadeTargeting = false; this.renderer.domElement.style.cursor = '';
      const p = this.groundAt(sx, sy);
      const unit = this.selected().find(v => v.kind === 'captain' || v.kind === 'guard');
      if (p && unit) { this.cmd({ c: 'grenade', id: unit.id, x: p.x, y: p.z }); unit.sprite?.grenade(); audio.grenadeThrow(this.audioAt(unit.x, unit.z)?.pan ?? 0); }
      return;
    }
    if (this.place) { // установка постройки; при неверном месте остаёмся в режиме, сервер подскажет причину
      const sp = this.placePoint(sx, sy), ids = this.selected().filter(v => v.kind === 'builder').map(v => v.id);
      if (sp && ids.length) this.cmd({ c: 'build', ids, kind: this.place, x: sp.p.x, y: sp.p.z });
      if (sp?.ok && !add) this.stopPlace();
      return;
    }
    if (this.amove) {
      this.amove = false; this.renderer.domElement.style.cursor = '';
      const p = this.groundAt(sx, sy);
      if (p && this.sel.size) this.cmd({ c: 'amove', ids: [...this.sel], x: p.x, y: p.z });
      return;
    }
    const v = this.pick(sx, sy, this.mobile) ?? this.pick(sx, sy, this.ownStruct);
    if (!add || (v && isStruct(v.kind))) this.sel.clear();
    if (v) { if (isStruct(v.kind)) this.sel.clear(); this.sel.add(v.id); }
  }

  private boxSelect(d: { x0: number; y0: number; x1: number; y1: number }, add: boolean) {
    if (!add) this.sel.clear();
    const [x0, x1] = [Math.min(d.x0, d.x1), Math.max(d.x0, d.x1)], [y0, y1] = [Math.min(d.y0, d.y1), Math.max(d.y0, d.y1)];
    for (const v of this.views.values()) {
      if (!this.mobile(v)) continue;
      const p = this.toScreen(v);
      if (p.ok && p.x >= x0 && p.x <= x1 && p.y >= y0 && p.y <= y1) this.sel.add(v.id);
    }
  }

  private selectOwn(kind: Kind) {
    for (const v of this.views.values()) if (v.owner === this.slot && v.kind === kind) { this.sel.clear(); this.sel.add(v.id); this.cam.x = v.x; this.cam.z = v.z; }
  }

  /** Куда встанет постройка и можно ли там строить (подсказка; решает сервер). Пост примагничивается к своей точке. */
  private placePoint(sx: number, sy: number): { p: THREE.Vector3; ok: boolean } | null {
    const g = this.groundAt(sx, sy);
    if (!g) return null;
    const vs = [...this.views.values()];
    if (this.place === 'post') {
      const i = POINTS.findIndex(([x, z]) => Math.hypot(x - g.x, z - g.z) < 9);
      if (i < 0) return { p: g, ok: false };
      const [x, z] = POINTS[i];
      const taken = vs.some(v => v.kind === 'post' && Math.hypot(v.x - x, v.z - z) < 2);
      return { p: new THREE.Vector3(x, 0, z), ok: (this.pointOwner[i] === this.slot || this.pointOwner[i] < 0) && !taken };
    }
    if (this.place === 'turret') {
      const near = vs.some(v => v.owner === this.slot && isStruct(v.kind) && v.kind !== 'turret' && Math.hypot(v.x - g.x, v.z - g.z) < 16);
      const free = !vs.some(v => isStruct(v.kind) && Math.hypot(v.x - g.x, v.z - g.z) < STATS[v.kind].radius + STATS.turret.radius + 1);
      return { p: g, ok: near && free };
    }
    const hq = vs.find(v => v.kind === 'hq' && v.owner === this.slot), d = hq ? Math.hypot(hq.x - g.x, hq.z - g.z) : 99;
    const clear = !vs.some(v => isStruct(v.kind) && Math.hypot(v.x - g.x, v.z - g.z) < STATS[v.kind].radius + STATS.barracks.radius + 1);
    return { p: g, ok: d >= 8 && d <= 32 && clear };
  }

  private order(sx: number, sy: number) {
    if (!this.sel.size) return;
    const sel = this.selected(), ids = [...this.sel];
    if (sel.length === 1 && isStruct(sel[0].kind)) return;
    const enemy = this.pick(sx, sy, v => v.owner !== this.slot && !v.dead);
    if (enemy) return this.cmd({ c: 'attack', ids, id: enemy.id });
    const site = this.pick(sx, sy, v => this.ownStruct(v) && v.build < 1);
    if (site && sel.some(v => v.kind === 'builder')) return this.cmd({ c: 'assist', ids, id: site.id });
    const p = this.groundAt(sx, sy);
    if (p) this.cmd({ c: 'move', ids, x: p.x, y: p.z });
  }

  // ---------- кадр ----------
  private frame = (now: number) => {
    this.raf = requestAnimationFrame(this.frame);
    const dt = Math.min(0.05, (now - this.t0) / 1000);
    this.alertMarkers = this.alertMarkers.filter(a => {
      if (now >= a.until) { a.el.remove(); return false; }
      const p = new THREE.Vector3(a.x, 2, a.z).project(this.camera);
      const r = this.renderer.domElement.getBoundingClientRect();
      const rootRect = this.root.getBoundingClientRect();
      a.el.style.display = p.z < 1 && Math.abs(p.x) <= 1 && Math.abs(p.y) <= 1 ? '' : 'none';
      a.el.style.left = (r.left - rootRect.left + (p.x * 0.5 + 0.5) * r.width - 22) + 'px';
      a.el.style.top = (r.top - rootRect.top + (-p.y * 0.5 + 0.5) * r.height - 22) + 'px';
      return true;
    });
    this.t0 = now;
    const c = this.cam, k = this.keys, sp = c.dist * 0.9 * dt;
    const fx = -Math.sin(c.yaw), fz = -Math.cos(c.yaw), rx = Math.cos(c.yaw), rz = -Math.sin(c.yaw);
    let f = (k.has('arrowup') ? 1 : 0) - (k.has('arrowdown') ? 1 : 0);
    let r = (k.has('arrowright') ? 1 : 0) - (k.has('arrowleft') ? 1 : 0);
    if (this.mouse && !this.drag) { // скролл у края экрана
      const m = this.mouse, e = 14;
      r += (m.x > innerWidth - e ? 1 : 0) - (m.x < e ? 1 : 0);
      f += (m.y < e ? 1 : 0) - (m.y > innerHeight - e ? 1 : 0);
    }
    c.x = Math.max(0, Math.min(MAP.w, c.x + (fx * f + rx * r) * sp));
    c.z = Math.max(0, Math.min(MAP.h, c.z + (fz * f + rz * r) * sp));
    if (k.has('q')) c.yaw += dt * 1.5;
    if (k.has('e')) c.yaw -= dt * 1.5;
    const cp = Math.cos(c.pitch);
    this.camera.position.set(c.x + c.dist * cp * Math.sin(c.yaw), c.dist * Math.sin(c.pitch), c.z + c.dist * cp * Math.cos(c.yaw));
    this.camera.lookAt(c.x, 0, c.z);

    if (this.place && this.mouse) {
      const g = this.placePoint(this.mouse.x, this.mouse.y);
      this.ghost.visible = !!g;
      if (g) {
        this.ghost.position.set(g.p.x, 0.2, g.p.z);
        for (const m of this.ghost.children) ((m as THREE.Mesh).material as THREE.MeshBasicMaterial).color.setHex(g.ok ? 0x7dff9a : 0xff6b5b);
      }
    }

    const a = 1 - Math.exp(-dt * 14);
    const sites = [...this.views.values()].filter(v => isStruct(v.kind) && v.build < 1);
    for (const c of this.corpses) { // павшие лежат и исчезают, разрушенные постройки оседают
      for (const x of c.actors) x.update(dt);
      if (c.struct) { c.body.scale.y = Math.max(0.01, c.body.scale.y - dt * 1.2); c.body.position.y -= dt * 0.6; }
    }
    this.corpses = this.corpses.filter(c => { if (c.until > now) return true; this.scene.remove(c.root); return false; });
    for (const v of this.views.values()) {
      v.x += (v.tx - v.x) * a; v.z += (v.tz - v.z) * a;
      v.f += (((v.tf - v.f + Math.PI * 3) % (Math.PI * 2)) - Math.PI) * a;
      v.root.position.set(v.x, groundH(v.x, v.z), v.z);
      if (isStruct(v.kind)) {
        const k = v.lvl > 1 ? 1.2 : 1; // улучшенная постройка крупнее
        v.body.scale.set(k, Math.max(0.12, v.build) * k, k);
        if (v.kind === 'turret') { // баллиста поворачивается к цели
          const top = v.body.getObjectByName('turret-top');
          if (top) top.rotation.y += (((-v.tf - top.rotation.y + Math.PI * 3) % (Math.PI * 2)) - Math.PI) * a;
        }
      }
      else {
        v.body.rotation.y = -v.f;
        const moving = Math.hypot(v.tx - v.x, v.tz - v.z) > 0.12;
        const building = !moving && v.kind === 'builder' && sites.some(s => s.owner === v.owner && Math.hypot(s.x - v.x, s.z - v.z) < STATS[s.kind].radius + 3.5);
        const n = members(v.kind, v.hp);
        v.sprite?.update(dt, moving ? 'run' : 'idle', v.f, c.yaw, !v.dead);
        v.actors.forEach((a, i) => {
          if (i < n && !a.alive) a.revive(); // пополнение или возрождение капитана
          if (i >= n) a.die();
          a.root.visible = a.alive || a.deadFor < 1.6 || v.kind === 'captain';
          a.state = building ? 'build' : moving ? 'run' : 'idle';
          a.update(dt);
        });
      }
      const ratio = Math.max(0.001, Math.min(1, v.hp / maxHp(v.kind))), building = v.build < 1;
      v.bar.visible = !v.dead && (building || ratio < 1 || this.sel.has(v.id));
      v.fg.scale.x = building ? Math.max(0.01, v.build) : ratio;
      v.fg.material = building ? this.barBuild : v.owner !== this.slot ? this.barEnemy : ratio < 0.35 ? this.barLow : this.barOwn;
      v.bar.quaternion.copy(this.camera.quaternion);
      v.sel.visible = this.sel.has(v.id);
    }
    const t = performance.now(), pos = this.beam.geometry.attributes.position.array as Float32Array;
    this.shots = this.shots.filter(s => s.until > t);
    let n = 0;
    for (const s of this.shots) { if (n >= 200) break; pos.set([s.a.x, s.a.y, s.a.z, s.b.x, s.b.y, s.b.z], n * 6); n++; }
    this.beam.geometry.attributes.position.needsUpdate = true;
    this.beam.geometry.setDrawRange(0, n * 2);
    const gl = this.renderer;
    if (this.ascii) {
      this.pass.render(this.scene, this.camera);
      const { background, fog } = this.scene; // цвет фона принудительно очищает экран, а нужно дорисовать оверлей поверх текста
      this.scene.background = null; this.scene.fog = null;
      this.camera.layers.set(1); gl.autoClear = false; gl.clearDepth();
      gl.render(this.scene, this.camera);
      gl.autoClear = true;
      this.camera.layers.enableAll();
      this.scene.background = background; this.scene.fog = fog;
    } else { this.grade.uniforms.time.value = now * 0.001; this.composer.render(); }
  };
}
