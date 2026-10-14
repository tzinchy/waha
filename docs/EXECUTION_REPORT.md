# WAHA execution report — 2026-10-14

**Production Definition of Done is not met.** No artwork has passed artistic acceptance. This run delivers verified runtime/QA infrastructure and one new procedural grenade atlas, not the requested final six-faction pixel-art package.

Base: `03d1d3784b15c11fab2684c2dbe3458f17c4e13c`. First delivery commit: `523918d38700287ce16940fa0dfda6b9eca8f768`. Working/delivery branch: [codex/faction-asset-lab](https://github.com/tzinchy/waha/tree/codex/faction-asset-lab).

## Implemented

- Metadata-driven sprite playback: actual image dimensions, timestamps, duration/loop, camera-facing conversion, ground anchor, texel-centre UV inset, stable final death frame, live squad counts, builder work and safe asynchronous disposal. Corpses retain their facing and do not restore lost squad members. Animation elapsed time follows the wall clock even at low FPS.
- Server-authoritative grenade windup (0.35 s), flight (0.75 s), impact AoE, range/cooldown/owner validation, friendly exclusion and positions resolved at impact. Stable effect IDs synchronize throw/projectile/impact and prevent repeated sound cues. Throwing faces the target and holds movement during windup. `J` throws; `H` consistently selects HQ. Projectile/explosion visuals are prototype effects.
- Real Legion captain `throw_grenade.png`/JSON exported and loaded in the match. Its release/impact timestamps and non-looping recovery are recorded. The intermediate captain GLB has been refreshed from the current source. These are procedural art, not approved final sprites.
- Physical asset inventory and regenerated manifest; PNG alpha/bounds/frame checks; Khronos GLB validation; reviewed-art import preserving prior files; incremental exporter across all factions with role/action filters, a models-only mode, no unsupported-action substitution and protection for reviewed authored atlases.
- Local art review at `/art-review.html`, with actual 1×/2× playback, metadata and source/reference images. Original generated captain source/provenance retained; rejected artwork is not substituted into the runtime.
- Graphics selection (performance or shadows/effects), integer scaling in performance mode, removal of external font requests and indexing of optional Meshy models instead of failing probes. Browser CI covers application changes and uploads six-faction screenshots/reports; full prototype regeneration is a manual workflow.

## Actual asset matrix

| Faction | Physical GLB | Physical PNG+JSON pairs | Artistically accepted | Match coverage |
|---|---:|---:|---:|---|
| legion | 23 | 66 | 0 | 3 common unit roles via PNG; 4 building roles via source geometry |
| heretics | 23 | 65 | 0 | 3 common unit roles via PNG; 4 building roles via source geometry |
| scrap | 23 | 65 | 0 | 3 common unit roles via PNG; 4 building roles via source geometry |
| necrons | 23 | 65 | 0 | 3 common unit roles via PNG; 4 building roles via source geometry |
| drukhari | 0 | 0 | 0 | legacy unit fallback; 4 building roles via source geometry |
| daemons | 0 | 0 | 0 | legacy unit fallback; 4 building roles via source geometry |

Physical package: **92 GLB, 272 GLB clips, 261 PNG atlases and matching JSON; 46,919,338 bytes**. These clip and atlas counts are intentionally separate. Baseline exporter coverage still lacks **340 physical files**; full production requirements extend beyond this baseline. Every path is recorded in `assets/art-audit.json`.

Faction GLB files are intermediate/export artifacts, not loaded match actors. Buildings in a match currently use procedural source geometry. Only captain/guard/builder sprites are integrated; the 13-unit/10-building visual catalog must not be confused with the simulation roster. The actual simulation still has three common unit kinds and four structure kinds.

## Verified

- `npm ci --cache /workspace/.npm-cache --no-audit --no-fund`: passed from the final lockfile.
- `npm run check`: passed.
- `npm test`: passed. Separate in-process reporting confirmed 22 individual scenarios. An intentionally failing runner probe correctly failed; normal file-level reporting was not mistaken for a count of scenarios.
- PNG/JSON inventory: zero structural errors/warnings. Khronos glTF-Validator: all 92 GLB, zero errors/warnings, including the refreshed captain model.
- Real browser, all six factions: create lobby → choose/broadcast faction → add bot → ready → start → right-click movement → J+click grenade with matching authoritative throw/impact ID → combat shots → HUD HQ upgrade to tier II. Offscreen combat targeting uses the normal public WebSocket command, not a server test endpoint or altered simulation state.
- Existing guard atlases additionally verify two remaining members, frozen death, revival to five and disposal. Missing race PNGs remain explicit fallback; passing multiplayer mechanics does not certify race artwork.
- Zero runtime, HTTP and console errors in the final six browser reports. 12 match PNGs plus art-review PNG saved under `artifacts/browser/`, uploaded by the browser workflow. Representative evidence is committed below.

## Browser FPS — environment limitation and open performance requirement

Headless Chromium, requested SwiftShader software GPU, 960×720 viewport, performance graphics mode. The following are measured requestAnimationFrame rates for small actual matches, not a 100-unit GPU benchmark.

| Faction | Result | FPS | Simulation entities |
|---|---|---:|---:|
| legion | pass | 2.04 | 12 |
| heretics | pass | 2.46 | 12 |
| scrap | pass | 0.98 | 11 |
| necrons | pass | 1.36 | 13 |
| drukhari | pass | 1.17 | 12 |
| daemons | pass | 1.47 | 12 |

These measured rates are inadequate for production. Native-GPU performance and 50/100/200-unit profiling remain unverified.

## Visual evidence and acceptance

- [Actual Legion match close-up](qa/legion-closeup.png)
- [Actual art-review page, 1×/2× prototype comparison and rejected source](qa/art-review.png)
- [Complete six-faction browser report](qa/browser-report.json)

The new detailed generated captain sheet is 1254×1254, which cannot form eight equal integer-sized cells. It also has ground-contact/pose-scale drift and silhouettes crossing cell boundaries. It is retained under `client/public/art-src/legion/captain/` as a **rejected source**, not a 64-frame game atlas. The existing/new baked atlas and the match screenshots remain visibly below the requested hand-finished pixel-art reference. No approved hero/terminator/monolith vertical slice exists. Mass expansion is gated on fixing that slice; additional procedural exports are not a substitute.

Known legacy model and terrain licences are CC0 and recorded in the audit. Source artwork requires real provenance/rights and a recorded visual review before authored import.

## Remaining / blocked acceptance

- P1: coherent high-detail authored captain/warboss/terminator sheets with real motion in every facing, monolith artwork and full visual approval. Available image generation did not produce a technically or artistically acceptable atlas; controlled per-frame art correction/source delivery remains the critical blocker.
- P2: final artwork for all 78 unit and 60 building roles, all applicable actions, source/provenance and missing race exports.
- P3: actual six-faction stats/rosters/production, flight/teleport, XP/skill points, six-slot equipment with all-direction visual changes and abilities, three Necron HQ stages, other faction upgrades, complete warnings/minimap and non-prototype VFX. Existing four-slot numerical equipment is not the required captain system.
- P4: final animated menu/lobby combat scenes, map/team controls and unified finished artwork across every HTML screen.
- Performance: production FPS on real GPU and 100+ armies. Browser success here proves only the listed mechanics.

## GitHub Actions

- [Validation workflow](https://github.com/tzinchy/waha/actions/workflows/validate.yml)
- [Six-faction browser workflow](https://github.com/tzinchy/waha/actions/workflows/browser-smoke.yml)
- [Manual prototype exporter](https://github.com/tzinchy/waha/actions/workflows/export-factions.yml)

Local checks above are confirmed. Remote Actions results are not claimed: the available commit workflow connector lists pull-request runs only, and the combined-status wrapper returned no status entries. Final branch delivery SHA is provided in the conversation after push.
