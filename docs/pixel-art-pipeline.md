# Pixel-art production pipeline

This directory defines the import contract for production sprites. It does **not** claim that the 80 finished characters have been drawn.

## Current project reality
WAHA currently has **six original factions** (`order`, `undead`, `prism`, `clockwork`, `orks`, `ashen`) rather than the four Warhammer-themed factions discussed in chat. Gameplay state lives in `shared/sim.ts`, and rendering in `client/game2d.ts`. Do not replace gameplay identities or simulation rules while importing art.

## Target file layout
```
client/public/assets/pixel/
  manifest.json
  order/captain/commander/SE/idle.png
  order/captain/commander/SE/walk.png
  order/captain/commander/SE/attack.png
  ...
```
Each sheet uses **RGBA PNG**, horizontal frames of equal dimensions, a transparent background, and a consistent foot/ground origin. Manifest shape is defined by `shared/sprite-assets.ts`.

## Art acceptance criteria
1. Character silhouette must be unique to its unit role (not a palette swap of the same geometry).
2. All frames retain identical armor, equipment, proportions and light direction.
3. Eight directions: N, NE, E, SE, S, SW, W, NW.
4. Five states: idle, walk, attack, hit, death. Frame counts and FPS can differ by state.
5. Foot pivot remains stable to prevent unit jitter.
6. Attacks and deaths must not clip neighboring atlas cells.
7. Preview all eight directions on the game's actual isometric ground plane.
8. Only mark an asset ready after visual inspection and in-game integration.

## Next integration steps
- Create first **production-quality** captain with consistent frames and transparent pixels.
- Wire optional manifest loading into `client/game2d.ts` with fallback to existing SVGs.
- Add a sprite inspector for animation/direction/frame scrubbing.
- Expand per-faction roster after the first character passes review.

This is a tracked technical foundation, **not** a completed art pack.
