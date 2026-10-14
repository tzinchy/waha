/** Metadata-driven directional sprite player; legacy geometry stays until an atlas loads. */
import * as THREE from 'three';
import type { FactionId } from './faction-models.ts';
import { atlasDirection, atlasFrame, atlasUV, validateAtlas, type AtlasMetadata } from './sprite-atlas.ts';

export type SpriteAction = 'idle' | 'walk' | 'run' | 'work' | 'attack' | 'shoot' | 'throw_grenade' | 'death';
type Sheet = { texture: THREE.Texture; metadata: AtlasMetadata };
const sheets = new Map<string, Promise<Sheet | null>>();
const loader = new THREE.TextureLoader();
let catalog: Promise<Set<string>> | undefined;
function availableSheets() {
  return catalog ??= fetch('/models/factions/manifest.json').then(r => {
    if (!r.ok) throw Error('Missing asset manifest');
    return r.json();
  }).then(m => Array.isArray(m.atlases) ? new Set<string>(m.atlases.map((a: { file: string }) => a.file.replace(/\.png$/, ''))) : new Set<string>(m.files.flatMap((f: { faction: string; role: string; animations?: string[] }) =>
    (f.animations ?? []).map(a => `${f.faction}/${f.role}/sprites/${a}`)))).catch(() => new Set<string>());
}
function getSheet(path: string) {
  let loaded = sheets.get(path);
  if (!loaded) {
    loaded = (async () => {
      if (!(await availableSheets()).has(path)) return null;
      const prefix = '/models/factions/' + path;
      const response = await fetch(prefix + '.json');
      if (!response.ok) throw Error('Missing atlas metadata: ' + prefix);
      const metadata = validateAtlas(await response.json());
      const texture = await loader.loadAsync(prefix + '.png');
      if (texture.image.width !== metadata.cellWidth * metadata.columns || texture.image.height !== metadata.cellHeight * metadata.rows) {
        texture.dispose(); throw Error('Atlas dimensions disagree: ' + prefix);
      }
      texture.magFilter = THREE.NearestFilter; texture.minFilter = THREE.NearestFilter;
      texture.generateMipmaps = false; texture.colorSpace = THREE.SRGBColorSpace;
      return { texture, metadata };
    })().catch(e => { console.warn('[sprite atlas]', String(e)); return null; });
    sheets.set(path, loaded);
  }
  return loaded;
}
export const PLAYER_FACTIONS: FactionId[] = ['legion', 'scrap', 'heretics', 'necrons', 'drukhari', 'daemons'];
export class SpriteActor {
  readonly sprite: THREE.Sprite;
  readonly squad: THREE.Sprite[] = [];
  readonly ready: Promise<boolean>;
  private action: SpriteAction = 'idle';
  private time = 0;
  private images = new Map<SpriteAction, Sheet>();
  private material = new THREE.SpriteMaterial({ transparent: true, depthWrite: false, alphaTest: 0.14 });
  private current?: Sheet;
  private fallback = true;
  private transient = false;
  private disposed = false;
  private liveMembers: number;
  private deathMembers = 1;
  private alive = true;
  private facing = 0;
  private cameraYaw = 0;
  private positions: number[][];
  private loading = new Map<SpriteAction, Promise<boolean>>();

  constructor(readonly faction: FactionId, readonly role: 'captain' | 'guard' | 'builder', readonly root: THREE.Group) {
    const positions = role === 'guard' ? [[0.9,0],[-0.4,-1.5],[-0.4,1.5],[-1.8,-0.7],[-1.8,0.9]] :
      role === 'builder' ? [[0,-0.9],[0,0.9]] : [[0,0]];
    this.positions = positions;
    this.liveMembers = this.deathMembers = positions.length;
    for (const [x,z] of positions) {
      const unit = new THREE.Sprite(this.material);
      unit.position.set(x, 0, z); unit.visible = false;
      root.add(unit); this.squad.push(unit);
    }
    this.sprite = this.squad[0];
    this.ready = this.load('idle');
  }
  private load(action: SpriteAction): Promise<boolean> {
    const pending = this.loading.get(action);
    if (pending) return pending;
    const request = getSheet(`${this.faction}/${this.role}/sprites/${action}`).then(sheet => {
      if (!sheet || this.disposed) return false;
      this.images.set(action, sheet);
      if (action === this.action || this.fallback) this.apply(sheet);
      return true;
    });
    this.loading.set(action, request);
    return request;
  }
  private apply(sheet: Sheet) {
    const map = sheet.texture.clone(); map.needsUpdate = true;
    const old = this.material.map;
    this.material.map = map; this.material.needsUpdate = true; old?.dispose();
    this.current = sheet; this.fallback = false;
    const a = sheet.metadata;
    const height = a.camera?.orthographicHeight ?? (this.role === 'captain' ? 3.8 : 3.2);
    for (const member of this.squad) {
      member.scale.set(height * a.cellWidth / a.cellHeight, height, 1);
      member.center.set(a.anchor.x / a.cellWidth, 1 - a.anchor.y / a.cellHeight);
    }
    this.sample();
  }
  setAction(action: SpriteAction, transient = false) {
    if (this.disposed || (this.action === 'death' && !this.alive && action !== 'death')) return;
    if (this.action === action && !transient) return;
    this.action = action; this.time = 0; this.transient = transient;
    const sheet = this.images.get(action);
    if (sheet) this.apply(sheet);
    else void this.load(action).then(ok => {
      if (this.disposed || this.action !== action || ok) return;
      // Unavailable actions retain the current image, without issuing PNG 404 requests.
      if (action !== 'death') { this.action = 'idle'; this.transient = false; const idle = this.images.get('idle'); if (idle) this.apply(idle); }
    });
  }
  attack() { this.setAction(this.role === 'captain' ? 'attack' : 'shoot', true); }
  grenade(elapsed = 0) { this.setAction('throw_grenade', true); this.time = elapsed; this.sample(); }
  update(dt: number, desired: 'idle' | 'run' | 'walk' | 'work', facing: number, cameraYaw: number, alive: boolean, count = this.squad.length) {
    if (this.disposed) return;
    const wasAlive = this.alive; if (wasAlive && !alive) this.deathMembers = this.liveMembers; this.alive = alive; this.liveMembers = count;
    this.facing = facing; this.cameraYaw = cameraYaw;
    if (!alive && this.action !== 'death') this.setAction('death');
    else if (alive && !wasAlive) this.setAction(desired);
    else if (alive && (!this.transient || this.time >= (this.current?.metadata.duration ?? 1.1)) && this.action !== desired) this.setAction(desired);
    this.time += dt; this.sample();
  }
  private sample() {
    if (!this.current || !this.material.map) return;
    const a = this.current.metadata;
    const frame = atlasFrame(a, this.time, atlasDirection(a, this.facing, this.cameraYaw));
    const uv = atlasUV(a, frame);
    this.material.map.repeat.set(uv.w, uv.h); this.material.map.offset.set(uv.x, uv.y);
    this.squad.forEach((member, i) => { const [x,z] = this.positions[i]; member.position.set(x * Math.cos(this.facing) - z * Math.sin(this.facing), 0, x * Math.sin(this.facing) + z * Math.cos(this.facing)); member.visible = !this.fallback && (this.alive ? i < this.liveMembers : this.action === 'death' && i < this.deathMembers); });
  }
  get active() { return !this.fallback; }
  dispose() { if (this.disposed) return; this.disposed = true; this.material.map?.dispose(); this.material.dispose(); for (const member of this.squad) this.root.remove(member); }
}
