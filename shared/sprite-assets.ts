/**
 * Pixel-art asset contract for WAHA.
 *
 * Rendering remains independent from authoritative simulation in shared/sim.ts.
 * This module describes frame geometry and validates spritesheet manifests.
 * The renderer may fall back to existing SVG art until production sprites exist.
 */
import type { FactionId } from './factions.ts';
import type { Kind } from './sim.ts';

export const ANIMATIONS = ['idle', 'walk', 'attack', 'hit', 'death'] as const;
export type AnimationName = typeof ANIMATIONS[number];
export const DIRECTIONS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'] as const;
export type Direction = typeof DIRECTIONS[number];

export type SpriteAnimation = {
  /** URL to an RGBA PNG spritesheet, with frames laid out left-to-right. */
  src: string;
  frameWidth: number;
  frameHeight: number;
  frames: number;
  fps: number;
  loop: boolean;
  /** Feet/ground contact point, in pixels from top-left of each frame. */
  origin: { x: number; y: number };
};

export type SpriteSet = {
  faction: FactionId;
  kind: Kind;
  variant: string;
  directions: Partial<Record<Direction, Partial<Record<AnimationName, SpriteAnimation>>>>;
};

export type AssetManifest = {
  version: 1;
  assets: SpriteSet[];
};

export function validateAssetManifest(value: unknown): value is AssetManifest {
  if (!value || typeof value !== 'object') return false;
  const m = value as Partial<AssetManifest>;
  if (m.version !== 1 || !Array.isArray(m.assets)) return false;
  return m.assets.every(asset => {
    if (!asset || typeof asset.faction !== 'string' || typeof asset.kind !== 'string' ||
        typeof asset.variant !== 'string' || !asset.directions || typeof asset.directions !== 'object') return false;
    return Object.entries(asset.directions).every(([direction, animations]) => {
      if (!DIRECTIONS.includes(direction as Direction) || !animations || typeof animations !== 'object') return false;
      return Object.entries(animations).every(([animation, sheet]) => {
        if (!ANIMATIONS.includes(animation as AnimationName) || !sheet) return false;
        const s = sheet as SpriteAnimation;
        return typeof s.src === 'string' && s.src.endsWith('.png') &&
          Number.isInteger(s.frameWidth) && s.frameWidth > 0 &&
          Number.isInteger(s.frameHeight) && s.frameHeight > 0 &&
          Number.isInteger(s.frames) && s.frames > 0 &&
          Number.isFinite(s.fps) && s.fps > 0 &&
          typeof s.loop === 'boolean' &&
          Number.isFinite(s.origin?.x) && Number.isFinite(s.origin?.y);
      });
    });
  });
}

/** Returns a frame rect, without assuming a particular canvas or rendering engine. */
export function frameRect(sheet: SpriteAnimation, elapsedSeconds: number) {
  const index = Math.max(0, Math.floor(elapsedSeconds * sheet.fps));
  const frame = sheet.loop ? index % sheet.frames : Math.min(index, sheet.frames - 1);
  return { x: frame * sheet.frameWidth, y: 0, width: sheet.frameWidth, height: sheet.frameHeight };
}
