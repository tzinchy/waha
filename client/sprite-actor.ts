/**
 * Runtime eight-direction pixel-art sprite sheet player.
 * Atlas layout: eight columns (frames), eight rows (facings).
 * Reuses pre-baked PNGs; no geometry fallback is removed until the first image loads.
 */
import * as THREE from 'three';
import type { FactionId } from './faction-models.ts';

export type SpriteAction = 'idle' | 'walk' | 'run' | 'attack' | 'shoot' | 'throw_grenade' | 'death';
const durations: Record<SpriteAction, number> = { idle: 2, walk: 1, run: 0.65, attack: 0.7, shoot: 0.45, throw_grenade: 1.1, death: 1.1 };
const sheets = new Map<string, Promise<THREE.Texture | null>>();
const loader = new THREE.TextureLoader();
function source(faction: FactionId, role: string, action: SpriteAction) {
  return '/models/factions/' + faction + '/' + role + '/sprites/' + action + '.png';
}
function getSheet(path: string) {
  let loaded = sheets.get(path);
  if (!loaded) {
    loaded = loader.loadAsync(path).then(texture => {
      texture.magFilter = THREE.NearestFilter;
      texture.minFilter = THREE.NearestFilter;
      texture.generateMipmaps = false;
      texture.colorSpace = THREE.SRGBColorSpace;
      return texture;
    }).catch(() => null);
    sheets.set(path, loaded);
  }
  return loaded;
}
export const PLAYER_FACTIONS: FactionId[] = ['legion', 'scrap', 'heretics', 'necrons', 'drukhari', 'daemons'];
export class SpriteActor {
  readonly sprite: THREE.Sprite;
  readonly ready: Promise<boolean>;
  private action: SpriteAction = 'idle';
  private time = 0;
  private images = new Map<SpriteAction, THREE.Texture>();
  private material: THREE.SpriteMaterial;
  private direction = 0;
  private fallback = true;
  private transientUntil = 0;

  constructor(readonly faction: FactionId, readonly role: 'captain' | 'guard' | 'builder', readonly root: THREE.Group) {
    this.material = new THREE.SpriteMaterial({ transparent: true, depthWrite: false, alphaTest: 0.14 });
    this.sprite = new THREE.Sprite(this.material);
    const height = role === 'captain' ? 3.8 : role === 'guard' ? 3.2 : 2.9;
    this.sprite.scale.set(height, height, 1);
    this.sprite.position.y = height * 0.5;
    this.sprite.visible = false;
    root.add(this.sprite);
    this.ready = this.load('idle');
  }

  private async load(action: SpriteAction) {
    const t = await getSheet(source(this.faction, this.role, action));
    if (!t) return false;
    this.images.set(action, t);
    if (action === this.action || this.fallback) this.apply(t);
    this.fallback = false;
    this.sprite.visible = true;
    return true;
  }
  private apply(texture: THREE.Texture) {
    // Each sprite has its own UV transform; the underlying image is shared.
    const map = texture.clone();
    map.needsUpdate = true;
    map.repeat.set(1 / 8, 1 / 8);
    const old = this.material.map;
    this.material.map = map;
    this.material.needsUpdate = true;
    if (old) old.dispose();
  }
  setAction(action: SpriteAction, transient = false) {
    if (transient) this.transientUntil = performance.now() + durations[action] * 1000;
    if (this.action === action) return;
    this.action = action;
    this.time = 0;
    const t = this.images.get(action);
    if (t) this.apply(t);
    else void this.load(action).then(ok => { if (!ok && this.action === action) { this.action = 'idle'; const idle = this.images.get('idle'); if (idle) this.apply(idle); } });
  }
  attack() { this.setAction(this.role === 'captain' ? 'attack' : 'shoot', true); }
  grenade() { this.setAction('throw_grenade', true); }
  update(dt: number, desired: 'idle' | 'run' | 'walk', facing: number, cameraYaw: number, alive: boolean) {
    if (!this.sprite.visible) return;
    if (performance.now() > this.transientUntil && (this.action !== desired || this.action === 'death')) this.setAction(alive ? desired : 'death');
    this.time += dt;
    this.direction = ((Math.round(((facing - cameraYaw) / (Math.PI * 2)) * 8) % 8) + 8) % 8;
    const frame = Math.min(7, Math.floor(((this.time % durations[this.action]) / durations[this.action]) * 8));
    const map = this.material.map;
    if (map) map.offset.set(frame / 8, 1 - (this.direction + 1) / 8);
    this.sprite.visible = alive || this.action === 'death';
  }
  get active() { return !this.fallback; }
  dispose() { this.material.map?.dispose(); this.material.dispose(); this.root.remove(this.sprite); }
}
