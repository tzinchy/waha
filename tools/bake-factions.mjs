// Bake the deterministic procedural prototype through the same renderer as the art lab.
// Requires the running dev server, Chromium and Playwright Core; no paid APIs.
import { createRequire } from 'node:module';
import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
import { FACTIONS, getFactionUnits } from './faction-presets.mjs';

if (process.argv.includes('--help')) {
  console.log('Start npm run dev, then node tools/bake-factions.mjs.');
  console.log('Optional: WAHA_DEV_URL, WAHA_CHROMIUM_PATH, WAHA_PLAYWRIGHT_MODULE (module path).');
  process.exit(0);
}
const require = createRequire(import.meta.url);
let chromium;
try {
  try { ({ chromium } = require(process.env.WAHA_PLAYWRIGHT_MODULE || 'playwright-core')); }
  catch (error) {
    if (process.env.WAHA_PLAYWRIGHT_MODULE) throw error;
    ({ chromium } = require('/opt/codex/cua_node/lib/node_modules/playwright-core'));
  }
} catch {
  console.error('Playwright Core is required. Install it outside the checkout and set WAHA_PLAYWRIGHT_MODULE to that module path; see docs/assets.md.');
  process.exit(1);
}
const root = new URL('../client/public/models/factions/', import.meta.url);
const browser = await chromium.launch({ executablePath: process.env.WAHA_CHROMIUM_PATH || '/usr/bin/chromium', headless: true, args: ['--no-sandbox', '--enable-unsafe-swiftshader', '--use-angle=swiftshader'] });
try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 1000 } });
  const errors = []; page.on('pageerror', e => errors.push(e.message));
  await page.goto((process.env.WAHA_DEV_URL || 'http://127.0.0.1:5173') + '/asset-lab.html');
  await page.waitForFunction(() => window.assetLab);
  const files = [];
  for (const faction of Object.keys(FACTIONS)) for (const [role, preset] of Object.entries(getFactionUnits(faction))) {
    const encoded = await page.evaluate(async ({ faction, role }) => {
      const b = new Uint8Array(await window.assetLab.glb(faction, role));
      let s = ''; for (let i = 0; i < b.length; i += 8192) s += String.fromCharCode(...b.subarray(i, i + 8192));
      return btoa(s);
    }, { faction, role });
    const data = Buffer.from(encoded, 'base64');
    assert.equal(data.toString('ascii', 0, 4), 'glTF');
    const json = JSON.parse(data.toString('utf8', 20, 20 + data.readUInt32LE(12)));
    assert.deepEqual((json.animations ?? []).map(a => a.name), preset.animations);
    for (const a of json.animations ?? []) for (const c of a.channels) assert.ok(c.target.node < json.nodes.length);
    const dir = new URL(`${faction}/${role}/`, root); mkdirSync(dir, { recursive: true });
    writeFileSync(new URL('model.glb', dir), data);
    files.push({ faction, role, file: `${faction}/${role}/model.glb`, bytes: data.length, animations: preset.animations, triangles: json.meshes.reduce((total, mesh) => total + mesh.primitives.reduce((n, p) => n + json.accessors[p.indices ?? p.attributes.POSITION].count / 3, 0), 0) });
    console.log(`GLB ${faction}/${role}: ${data.length} bytes`);
    for (const motion of preset.animations) {
      const atlas = await page.evaluate(async ({ faction, role, motion }) => {
        const a = await window.assetLab.spriteAtlas(faction, role, motion);
        const b = new Uint8Array(await a.blob.arrayBuffer());
        let s = ''; for (let i = 0; i < b.length; i += 8192) s += String.fromCharCode(...b.subarray(i, i + 8192));
        return { base64: btoa(s), metadata: a.metadata };
      }, { faction, role, motion });
      const spriteDir = new URL('sprites/', dir); mkdirSync(spriteDir, { recursive: true });
      writeFileSync(new URL(`${motion}.png`, spriteDir), Buffer.from(atlas.base64, 'base64'));
      atlas.metadata.image = `${motion}.png`;
      writeFileSync(new URL(`${motion}.json`, spriteDir), JSON.stringify(atlas.metadata, null, 2) + '\n');
      console.log(`ATLAS ${faction}/${role}/${motion}`);
    }
  }
  assert.deepEqual(errors, []);
  // Ensure atlas baking did not exhaust contexts or break the primary scene renderer.
  const info = await page.evaluate(() => window.assetLab.inspect()); assert.equal(info.actors, 12); assert.equal(info.contextLost, false);
  const animationClips = files.reduce((n, f) => n + f.animations.length, 0);
  writeFileSync(new URL('manifest.json', root), JSON.stringify({ version: 1, quality: 'procedural prototype; art reference is the final detail target', generator: 'client/faction-models.ts + client/asset-lab.ts', models: files.length, animationClips, spriteAtlases: animationClips, framesPerAtlas: 64, files }, null, 2) + '\n');
  console.log(`Saved ${files.length} models, ${animationClips} clips, ${animationClips} atlases to ${fileURLToPath(root)}`);
} finally { await browser.close(); }
