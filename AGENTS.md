# Instructions for Codex / coding agents in WAHA

## Mandatory project objective
Read **[docs/PIXEL_ART_PRODUCTION_SPEC.md](docs/PIXEL_ART_PRODUCTION_SPEC.md)** (full technical requirements) and **[CODEX_PROMPT.md](CODEX_PROMPT.md)** (execution plan) before making changes.

The user's explicit goal is **authentic production-quality grimdark pixel art** across all six races, real animated gameplay, usable multiplayer UI, and committed GLB/PNG assets. **Procedural cubes and nearest-neighbor low-poly screenshots are NOT finished pixel art.** Do not claim a concept sheet is a sprite atlas or that a passing typecheck proves visual quality.

## Branch and codebase
- Work on existing branch: `codex/faction-asset-lab`; do not create a new branch without request.
- Preserve server-authoritative rules in `shared/sim.ts` and WebSocket protocol in `shared/protocol.ts`.
- Preserve and incrementally improve existing `client/faction-models.ts`, `client/asset-lab.ts`, `client/sprite-actor.ts`, `client/game.ts`, `client/index.html`, `client/home.html`, `client/lobby-lab.html`, `client/project-hub.html` and captain UI.
- Validate actual assets in `client/public/models/factions/`; the manifest and historic file counts are not proof of completeness.
- The six factions are `legion`, `heretics`, `scrap`, `necrons`, `drukhari`, `daemons`.

## Required procedure
1. Inspect git state and audit each missing/broken/placeholder asset; take real browser screenshots.
2. Finish an artistically approved vertical slice with physical PNG atlas files and proper game integration; then scale across all roles/races.
3. For every ability and upgrade, synchronize server gameplay, sprite/VFX/SFX frames, HUD and multiplayer outcomes.
4. Run `npm ci`, `npm run check`, `npm test`, browser smoke with a real WebGL context, visual QA and image validators.
5. Commit and push meaningful assets and code to the existing branch. Record SHA, CI results, screenshots and incomplete items.
6. If art-generation or source artwork is unavailable, report a clear **blocker** and complete only verifiable infrastructure; do not replace missing artwork with primitives and call it done.

Final response must distinguish **implemented**, **validated in browser**, **actual artwork completed**, and **remaining**. No invented screenshots, exports, or checks.
