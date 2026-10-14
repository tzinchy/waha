import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import { FactionActor, UNIT_ROLES, VEHICLE_ROLES, ROLE_MOTIONS, motionDuration, motionLoops, motionActionMarkers, type FactionId, type UnitRole, type Motion } from './faction-models.ts';
import { NuclearBlastActor, EFFECT_ROLES, EFFECT_ROLE_MOTIONS, effectMotionDuration, effectMotionLoops, effectActionMarkers, type EffectRole, type EffectMotion } from './effect-models.ts';
import { StructureActor, STRUCTURE_ROLES, STRUCTURE_ROLE_MOTIONS, structureMotionDuration, structureMotionLoops, structureActionMarkers, type StructureRole, type StructureMotion } from './structure-models.ts';

export type ExportFaction = FactionId | 'common';
export type ExportRole = UnitRole | StructureRole | EffectRole;
export type ExportMotion = Motion | EffectMotion;
type ExportActor = { root: THREE.Group; pose: (motion: ExportMotion, time: number) => void; clips: () => THREE.AnimationClip[] };
type Entry = { actor: ExportActor; motions: ExportMotion[]; structure: boolean; effect: boolean; camera?: THREE.OrthographicCamera; cell?: number; envelope?: THREE.Box2; clips?: THREE.AnimationClip[] };
const entries = new Map<string, Entry>();
const DIRECTIONS = [0, 45, 90, 135, 180, 225, 270, 315];
const FRAME_COUNT = 8;
const PAD = 8;
const geometryCorners = new WeakMap<THREE.BufferGeometry, Float32Array>();
let renderer: THREE.WebGLRenderer | undefined;
let scene: THREE.Scene | undefined;
let attached: THREE.Group | undefined;

function entryFor(faction: ExportFaction, role: ExportRole): Entry {
  const key = faction + '/' + role;
  let entry = entries.get(key);
  if (!entry) {
    const effect = (EFFECT_ROLES as readonly string[]).includes(role);
    if (effect !== (faction === 'common')) throw Error('Global effects must use the common faction');
    const structure = !effect && !(UNIT_ROLES as readonly string[]).includes(role);
    if (structure && !(STRUCTURE_ROLES as readonly string[]).includes(role)) throw Error('Unknown export role: ' + role);
    const actor = effect ? new NuclearBlastActor() : structure ? new StructureActor(faction as FactionId, role as StructureRole) : new FactionActor(faction as FactionId, role as UnitRole);
    entry = { actor: actor as ExportActor, structure, effect, motions: effect ? EFFECT_ROLE_MOTIONS[role as EffectRole] : structure ? STRUCTURE_ROLE_MOTIONS[role as StructureRole] : ROLE_MOTIONS[role as UnitRole] };
    entries.set(key, entry);
  }
  return entry;
}
const timing = (entry: Entry, motion: ExportMotion) => entry.effect
  ? { duration: effectMotionDuration(motion as EffectMotion), loop: effectMotionLoops(motion as EffectMotion), markers: effectActionMarkers(motion as EffectMotion) }
  : entry.structure
  ? { duration: structureMotionDuration(motion as StructureMotion), loop: structureMotionLoops(motion as StructureMotion), markers: structureActionMarkers(motion as StructureMotion) }
  : { duration: motionDuration(motion as Motion), loop: motionLoops(motion as Motion), markers: motionActionMarkers(motion as Motion) };
const sampleTime = (duration: number, loop: boolean, frame: number) => duration * frame / (loop ? FRAME_COUNT : FRAME_COUNT - 1);
// An atomic flash ends before the first uniform sample; preserve its actual phase.
const sampleTimes = (entry: Entry, duration: number, loop: boolean) => entry.effect
  ? [0, 0.1, 0.45, 1.6, 2.8, 4.2, 5.6, duration]
  : Array.from({ length: FRAME_COUNT }, (_, frame) => sampleTime(duration, loop, frame));

function renderContext() {
  if (!renderer) {
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false, preserveDrawingBuffer: true });
    renderer.setPixelRatio(1); renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05;
    scene = new THREE.Scene();
    scene.add(new THREE.HemisphereLight(0xccd7dd, 0x352b23, 1.8));
    const sun = new THREE.DirectionalLight(0xffe2b5, 2.5); sun.position.set(-10, 18, 12); scene.add(sun);
    const rim = new THREE.DirectionalLight(0x879db3, 1.1); rim.position.set(6, 8, -12); scene.add(rim);
  }
  return { renderer, scene: scene! };
}

// Local mesh boxes are cached by Three.js; only their eight corners are transformed.
// Sweep all sampled motions before choosing a camera, so weapons, flight and debris
// share the same scale and ground contact when clips are switched.
function projectedBounds(root: THREE.Group, camera: THREE.OrthographicCamera) {
  root.updateMatrixWorld(true);
  const bounds = new THREE.Box2();
  const vertex = new THREE.Vector3(), point = new THREE.Vector2(), transform = new THREE.Matrix4();
  root.traverseVisible(node => {
    if (!(node instanceof THREE.Mesh)) return;
    let corners = geometryCorners.get(node.geometry);
    if (!corners) {
      if (!node.geometry.boundingBox) node.geometry.computeBoundingBox();
      const box = node.geometry.boundingBox;
      if (!box || box.isEmpty()) return;
      corners = new Float32Array(24);
      let index = 0;
      for (const x of [box.min.x, box.max.x]) for (const y of [box.min.y, box.max.y]) for (const z of [box.min.z, box.max.z]) { corners[index++] = x; corners[index++] = y; corners[index++] = z; }
      geometryCorners.set(node.geometry, corners);
    }
    transform.multiplyMatrices(camera.matrixWorldInverse, node.matrixWorld);
    for (let index = 0; index < corners.length; index += 3) {
      vertex.set(corners[index], corners[index + 1], corners[index + 2]).applyMatrix4(transform);
      bounds.expandByPoint(point.set(vertex.x, vertex.y));
    }
  });
  return bounds;
}

function calibrate(entry: Entry, role: ExportRole) {
  if (entry.camera) return;
  const elevation = 35 * Math.PI / 180;
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, entry.effect ? 1000 : 120);
  camera.position.set(Math.cos(elevation) / Math.sqrt(2), Math.sin(elevation), Math.cos(elevation) / Math.sqrt(2)).multiplyScalar(entry.effect ? 100 : 40);
  camera.lookAt(0, 0, 0); camera.updateMatrixWorld(true);
  const envelope = new THREE.Box2();
  for (const motion of entry.motions) {
    const { duration, loop } = timing(entry, motion);
    const times = entry.effect ? Array.from(new Set([...sampleTimes(entry, duration, loop), ...Array.from({ length: FRAME_COUNT }, (_, frame) => sampleTime(duration, loop, frame))])) : sampleTimes(entry, duration, loop);
    for (let direction = 0; direction < DIRECTIONS.length; direction++) {
      entry.actor.root.rotation.y = DIRECTIONS[direction] * Math.PI / 180;
      for (const time of times) {
        entry.actor.pose(motion, time);
        envelope.union(projectedBounds(entry.actor.root, camera));
      }
    }
  }
  envelope.expandByPoint(new THREE.Vector2(0, 0));
  if (envelope.isEmpty()) throw Error('Empty model bounds: ' + role);
  const cell = entry.effect ? 384 : role === 'titan' || role === 'hq' ? 256 : entry.structure || VEHICLE_ROLES.has(role as UnitRole) ? 192 : 128;
  const size = envelope.getSize(new THREE.Vector2()), center = envelope.getCenter(new THREE.Vector2());
  const span = Math.max(size.x, size.y, 0.1) * cell / (cell - PAD * 2);
  const offset = new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld, 0).multiplyScalar(center.x)
    .addScaledVector(new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld, 1), center.y);
  camera.position.add(offset); camera.lookAt(offset);
  camera.left = camera.bottom = -span / 2; camera.right = camera.top = span / 2;
  camera.updateProjectionMatrix(); camera.updateMatrixWorld(true);
  camera.userData.target = offset.toArray();
  entry.actor.root.rotation.set(0, 0, 0); entry.actor.pose(entry.effect ? 'explode' : 'idle', 0);
  entry.camera = camera; entry.cell = cell; entry.envelope = envelope;
}

export async function glb(faction: ExportFaction, role: ExportRole, clip?: ExportMotion) {
  const entry = entryFor(faction, role), { actor } = entry;
  actor.root.rotation.set(0, 0, 0);
  actor.pose(entry.effect ? 'explode' : 'idle', 0);
  try {
    const animations = (entry.clips ??= actor.clips()).filter(a => !clip || a.name === clip);
    if (clip && !animations.length) throw Error('Unsupported clip: ' + role + '/' + clip);
    actor.pose(entry.effect ? 'explode' : 'idle', 0); actor.root.updateMatrixWorld(true);
    const result = await new GLTFExporter().parseAsync(actor.root, { binary: true, animations, onlyVisible: false });
    if (!(result instanceof ArrayBuffer)) throw Error('Expected binary GLB');
    return result;
  } finally { actor.pose(entry.effect ? 'explode' : 'idle', 0); actor.root.rotation.set(0, 0, 0); }
}

export async function spriteAtlas(faction: ExportFaction, role: ExportRole, motion: ExportMotion) {
  const entry = entryFor(faction, role);
  if (!entry.motions.includes(motion)) throw Error('Unsupported motion: ' + role + '/' + motion);
  calibrate(entry, role);
  const { renderer, scene } = renderContext(), camera = entry.camera!, cell = entry.cell!;
  if (attached !== entry.actor.root) { attached?.removeFromParent(); attached = entry.actor.root; scene.add(attached); }
  if (renderer.domElement.width !== cell || renderer.domElement.height !== cell) renderer.setSize(cell, cell, false);
  const canvas = document.createElement('canvas'); canvas.width = cell * FRAME_COUNT; canvas.height = cell * DIRECTIONS.length;
  const ctx = canvas.getContext('2d')!; ctx.imageSmoothingEnabled = false;
  const { duration, loop, markers } = timing(entry, motion);
  const times = sampleTimes(entry, duration, loop);
  const frames: { x: number; y: number; w: number; h: number; time: number; bbox: { x: number; y: number; w: number; h: number } }[][] = [];
  try {
    for (let direction = 0; direction < DIRECTIONS.length; direction++) {
      entry.actor.root.rotation.y = DIRECTIONS[direction] * Math.PI / 180;
      const row = [];
      for (let frame = 0; frame < FRAME_COUNT; frame++) {
        const time = times[frame];
        entry.actor.pose(motion, time);
        const bounds = projectedBounds(entry.actor.root, camera);
        const span = camera.top - camera.bottom;
        const x = Math.max(0, Math.floor((bounds.min.x - camera.left) / span * cell));
        const y = Math.max(0, Math.floor((camera.top - bounds.max.y) / span * cell));
        const right = Math.min(cell, Math.ceil((bounds.max.x - camera.left) / span * cell));
        const bottom = Math.min(cell, Math.ceil((camera.top - bounds.min.y) / span * cell));
        renderer.render(scene, camera); ctx.drawImage(renderer.domElement, frame * cell, direction * cell);
        row.push({ x: frame * cell, y: direction * cell, w: cell, h: cell, time, bbox: { x, y, w: right - x, h: bottom - y } });
      }
      frames.push(row);
      await new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
    }
    const blob = await new Promise<Blob>((resolve, reject) => canvas.toBlob(b => b ? resolve(b) : reject(Error('Atlas encoding failed')), 'image/png'));
    const ground = new THREE.Vector3(0, 0, 0).project(camera);
    return { blob, metadata: { faction, role, animation: motion, image: motion + '.png', cellWidth: cell, cellHeight: cell, columns: FRAME_COUNT, rows: DIRECTIONS.length, duration, frameTimes: times, sampling: entry.effect ? 'event-aligned' : 'uniform', fps: entry.effect ? undefined : loop ? FRAME_COUNT / duration : (FRAME_COUNT - 1) / duration, loop, directionsDegrees: DIRECTIONS, rootForward: '+Z', camera: { elevationDegrees: 35, azimuthDegrees: 45, target: camera.userData.target, targetHeight: camera.userData.target[1], orthographicHeight: camera.top - camera.bottom }, anchor: { x: Math.round((ground.x + 1) * cell / 2), y: Math.round((1 - ground.y) * cell / 2) }, events: Object.entries(markers).map(([name, time]) => ({ name, time })), frames, provenance: { source: 'client/' + (entry.effect ? 'effect-models.ts' : entry.structure ? 'structure-models.ts' : 'faction-models.ts'), kind: 'procedural-prototype', productionArtApproved: false } } };
  } finally { entry.actor.pose(entry.effect ? 'explode' : 'idle', 0); entry.actor.root.rotation.set(0, 0, 0); attached?.removeFromParent(); attached = undefined; }
}

/** Explicitly release only this export context; shared factory assets remain intact. */
export function disposeExportContext() {
  attached?.removeFromParent(); attached = undefined;
  renderer?.dispose(); renderer?.forceContextLoss(); renderer = undefined; scene = undefined;
  entries.clear();
}
