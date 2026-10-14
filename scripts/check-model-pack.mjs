/** Verify source animation rigs, physical eight-direction atlases, and loaded GLB poses.
 * Run with node --import tsx scripts/check-model-pack.mjs [--source-only|--files-only].
 * CHECK_FACTIONS / CHECK_ROLES / CHECK_MOTIONS optionally restrict expensive checks.
 * CHECK_BASE_URL reuses Vite; otherwise this script starts Vite on CHECK_PORT (5193).
 */
import assert from 'node:assert/strict';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { createRequire } from 'node:module';
import { spawn } from 'node:child_process';
import { createHash } from 'node:crypto';
import { PNG } from 'pngjs';
import { chromium } from 'playwright';
import { tsImport } from 'tsx/esm/api';

const factory = await tsImport('../client/faction-models.ts', import.meta.url);
const structures = await tsImport('../client/structure-models.ts', import.meta.url);
const effects = await tsImport('../client/effect-models.ts', import.meta.url);
const catalog = await import('./asset-catalog.mjs');
const { validateAtlas } = await tsImport('../client/sprite-atlas.ts', import.meta.url);
const csv = value => value?.split(',').map(item => item.trim()).filter(Boolean);
const factions = csv(process.env.CHECK_FACTIONS) ?? [...new Set(catalog.ASSET_TARGETS.map(target => target.faction))];
const units = [...factory.UNIT_ROLES];
const structureRoles = [...structures.STRUCTURE_ROLES];
const effectRoles = [...effects.EFFECT_ROLES];
const roles = csv(process.env.CHECK_ROLES) ?? [...units, ...structureRoles, ...effectRoles];
const targets = catalog.ASSET_TARGETS.filter(target => factions.includes(target.faction) && roles.includes(target.role));
const selectedMotions = csv(process.env.CHECK_MOTIONS);
const sourceOnly = process.argv.includes('--source-only');
const filesOnly = process.argv.includes('--files-only');
const output = process.env.CHECK_REPORT ?? 'artifacts/model-pack/report.json';
const report = { version: 1, source: [], files: [], browser: [], errors: [], summary: {} };
const required = role => units.includes(role) ? factory.ROLE_MOTIONS[role] : effectRoles.includes(role) ? effects.EFFECT_ROLE_MOTIONS[role] : structures.STRUCTURE_ROLE_MOTIONS[role];
const motions = role => required(role).filter(motion => !selectedMotions || selectedMotions.includes(motion));
const actorFor = (faction, role) => units.includes(role) ? new factory.FactionActor(faction, role) : effectRoles.includes(role) ? new effects.NuclearBlastActor() : new structures.StructureActor(faction, role);
const durationFor = (role, motion) => units.includes(role) ? factory.motionDuration(motion) : effectRoles.includes(role) ? effects.effectMotionDuration(motion) : structures.structureMotionDuration(motion);
const loopsFor = (role, motion) => units.includes(role) ? factory.motionLoops(motion) : effectRoles.includes(role) ? effects.effectMotionLoops(motion) : structures.structureMotionLoops(motion);
const recordError = (phase, faction, role, error) => { report.errors.push({ phase, faction, role, issue: String(error) }); console.error(phase, faction, role, String(error)); };
for (const faction of factions) assert.ok(catalog.ASSET_TARGETS.some(target => target.faction === faction), 'Unknown CHECK_FACTIONS entry: ' + faction);
for (const role of roles) assert.ok(required(role), 'Unknown CHECK_ROLES entry: ' + role);
assert.ok(targets.length, 'Filters do not select any actual asset targets');

function assertFiniteTracks(clip, actor, role) {
  assert.ok(Number.isFinite(clip.duration) && clip.duration > 0, 'Invalid clip duration: ' + clip.name);
  assert.ok(clip.tracks.length, 'Empty animation: ' + clip.name);
  const nodeNames = new Set(); actor.root.traverse(node => { if (node.name) nodeNames.add(node.name); });
  for (const track of clip.tracks) {
    assert.ok(nodeNames.has(track.name.slice(0, track.name.lastIndexOf('.'))), 'Unbound animation track: ' + track.name);
    assert.ok(track.times.length > 1 && track.values.length, 'Empty track: ' + track.name);
    assert.ok([...track.times, ...track.values].every(Number.isFinite), 'NaN/Infinity in ' + track.name);
    for (let i = 1; i < track.times.length; i++) assert.ok(track.times[i] > track.times[i - 1], 'Non-increasing sample times: ' + track.name);
  }
  if (units.includes(role)) for (const property of ['position', 'quaternion', 'scale']) {
    assert.ok(clip.tracks.some(track => track.name === 'Rig.' + property), 'Missing Rig transform channel: ' + clip.name + '/' + property);
  }
}

if (!filesOnly) for (const { faction, role } of targets) {
  try {
    const actor = actorFor(faction, role), clips = actor.clips();
    assert.deepEqual(new Set(clips.map(clip => clip.name)), new Set(required(role)), 'Source clip coverage');
    for (const clip of clips) assertFiniteTracks(clip, actor, role);
    const relevant = clips.filter(clip => motions(role).includes(clip.name));
    const checks = [];
    for (const clip of relevant) {
      const serializedPoses = [];
      for (const fraction of [0, 0.23, 0.5, 0.77, 1]) {
        actor.pose(clip.name, clip.duration * fraction);
        const pose = Object.values(actor.joints).flatMap(node => [...node.position.toArray(), ...node.quaternion.toArray(), ...node.scale.toArray()]);
        assert.ok(pose.every(Number.isFinite), 'Non-finite posed rig: ' + clip.name);
        serializedPoses.push(JSON.stringify(pose.map(value => Math.round(value * 1e5))));
      }
      assert.ok(new Set(serializedPoses).size > 1, 'Static source animation: ' + clip.name);
      checks.push(clip.name);
    }
    if (units.includes(role) && motions(role).includes('knockback')) {
      actor.pose('knockback', 0); const start = actor.joints.rig.position.clone();
      actor.pose('knockback', factory.motionDuration('knockback') * 0.4);
      assert.ok(actor.joints.rig.position.distanceTo(start) > 0.3, 'Knockback lacks actual displacement');
    }
    if (units.includes(role) && motions(role).includes('death_blast')) {
      actor.pose('idle', 0); const start = actor.joints.armR.position.clone();
      actor.pose('death_blast', factory.motionDuration('death_blast') * 0.75);
      assert.ok(actor.joints.armR.position.distanceTo(start) > 0.5, 'Blast death lacks fragment separation');
      actor.pose('idle', 0);
      assert.ok(actor.joints.armR.position.distanceTo(start) < 1e-6, 'Blast pose leaked into idle');
    }
    report.source.push({ faction, role, clipCount: clips.length, checkedMotions: checks, status: 'pass' });
  } catch (error) { recordError('source', faction, role, error); }
}

function glbJSON(bytes) {
  assert.equal(bytes.toString('ascii', 0, 4), 'glTF'); assert.equal(bytes.readUInt32LE(4), 2);
  assert.equal(bytes.readUInt32LE(8), bytes.length); assert.equal(bytes.toString('ascii', 16, 20), 'JSON');
  return JSON.parse(bytes.toString('utf8', 20, 20 + bytes.readUInt32LE(12)));
}
const filesReady = [];
if (!sourceOnly) for (const { faction, role } of targets) {
  const prefix = `client/public/models/factions/${faction}/${role}`;
  try {
    const document = glbJSON(await readFile(prefix + '/model.glb'));
    const clipNames = (document.animations ?? []).map(clip => clip.name);
    for (const motion of required(role)) assert.ok(clipNames.includes(motion), 'Missing GLB clip: ' + motion);
    // Check loaded GLBs even if an independent atlas check finds a bad PNG.
    filesReady.push({ faction, role });
    const atlasRecords = [];
    for (const motion of motions(role)) {
      try {
      const metadata = JSON.parse(await readFile(`${prefix}/sprites/${motion}.json`, 'utf8'));
      const atlas = validateAtlas(metadata), png = PNG.sync.read(await readFile(`${prefix}/sprites/${motion}.png`));
      assert.equal(metadata.faction, faction); assert.equal(metadata.role, role); assert.equal(metadata.animation, motion);
      const duration = durationFor(role, motion), loops = loopsFor(role, motion);
      assert.ok(Math.abs(atlas.duration - duration) < 1e-6, 'Atlas/source duration mismatch: ' + motion);
      assert.equal(atlas.loop, loops, 'Atlas/source loop mismatch: ' + motion);
      assert.equal(atlas.rows, 8, 'Eight directions required'); assert.equal(atlas.columns, 8, 'Eight time samples required');
      assert.deepEqual(atlas.directionsDegrees, [0, 45, 90, 135, 180, 225, 270, 315]);
      assert.equal(png.width, atlas.cellWidth * 8); assert.equal(png.height, atlas.cellHeight * 8);
      const expectedFrameTimes = role === 'nuclear_blast' ? [0, 0.1, 0.45, 1.6, 2.8, 4.2, 5.6, 6.4] : Array.from({ length: 8 }, (_, index) => duration * index / (loops ? 8 : 7));
      if (role === 'nuclear_blast') {
        assert.equal(metadata.sampling, 'event-aligned', 'Nuclear flash and shockwave need event-aligned samples');
        assert.deepEqual(metadata.frameTimes, expectedFrameTimes, 'Nuclear canonical frameTimes mismatch');
        for (const [name, time] of Object.entries(effects.effectActionMarkers(motion))) {
          assert.ok(metadata.events?.some(event => event.name === name && Math.abs(event.time - time) < 1e-6), 'Missing nuclear event marker: ' + name);
          assert.ok(expectedFrameTimes.includes(time), 'Nuclear event absent from frame samples: ' + name);
        }
      }
      const rows = [];
      for (const row of atlas.frames) {
        const hashes = []; let visibleFrames = 0, boundaryPixels = 0;
        for (const [index, frame] of row.entries()) {
          assert.ok(Math.abs(frame.time - expectedFrameTimes[index]) < 1e-6, 'Atlas frame/source sample time mismatch: ' + motion);
          let pixels = 0; const hash = createHash('sha256');
          for (let y = 0; y < frame.h; y++) {
            const start = ((frame.y + y) * png.width + frame.x) * 4;
            hash.update(png.data.subarray(start, start + frame.w * 4));
            for (let x = 0; x < frame.w; x++) {
              const alpha = png.data[start + x * 4 + 3];
              if (alpha > 16) { pixels++; if (x === 0 || y === 0 || x === frame.w - 1 || y === frame.h - 1) boundaryPixels++; }
            }
          }
          if (pixels) visibleFrames++;
          hashes.push(hash.digest('hex'));
        }
        // build/teleport deliberately hide a subject at one sample; every direction must still have visible frames.
        assert.ok(visibleFrames > 0, 'Empty atlas direction: ' + motion);
        assert.equal(boundaryPixels, 0, 'Atlas silhouette clipped/bleeds: ' + motion);
        const distinctFrames = new Set(hashes).size;
        assert.ok(distinctFrames > 1, 'Animation has identical rendered frames: ' + motion);
        rows.push({ visibleFrames, distinctFrames, boundaryPixels });
      }
      atlasRecords.push({ motion, width: png.width, height: png.height, rows });
      } catch (error) { recordError('atlas', faction, role, motion + ': ' + String(error)); }
    }
    report.files.push({ faction, role, glbClips: clipNames, atlases: atlasRecords, status: atlasRecords.length === motions(role).length ? 'pass' : 'incomplete' });
  } catch (error) { recordError('files', faction, role, error); }
}

let vite, browser;
if (!sourceOnly && filesReady.length && process.env.CHECK_SKIP_BROWSER !== '1') {
  const port = Number(process.env.CHECK_PORT ?? 5193), base = process.env.CHECK_BASE_URL ?? `http://127.0.0.1:${port}`;
  try {
    if (!process.env.CHECK_BASE_URL) vite = spawn(process.execPath, ['node_modules/vite/bin/vite.js', 'client', '--host', '127.0.0.1', '--port', String(port), '--strictPort'], { stdio: 'inherit' });
    let ready = false;
    for (let attempt = 0; attempt < 100; attempt++) {
      if (vite?.exitCode != null) throw Error('Verification Vite exited: ' + vite.exitCode);
      try { if ((await fetch(base + '/home.html')).ok) { ready = true; break; } } catch {}
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    assert.ok(ready, 'Vite did not become available');
    browser = await chromium.launch({ headless: true, executablePath: process.env.WAHA_CHROMIUM_PATH ?? '/usr/bin/chromium', args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-webgl'] });
    const page = await browser.newPage();
    page.on('pageerror', error => recordError('browser', '', '', error));
    await page.goto(base + '/home.html', { waitUntil: 'domcontentloaded' });
    const require = createRequire(import.meta.url);
    const loaderPath = '/@fs' + require.resolve('three/examples/jsm/loaders/GLTFLoader.js');
    // Reuse Vite's optimized module URL used by the source actor and GLTFLoader.
    const transformedFactory = await (await fetch(base + '/faction-models.ts')).text();
    const threePath = transformedFactory.match(/import\s+\*\s+as\s+THREE\s+from\s+["']([^"']+)["']/)?.[1];
    assert.ok(threePath, 'Cannot resolve browser Three.js import');
    for (const job of filesReady) {
      try {
        const result = await page.evaluate(async ({ job, loaderPath, threePath, selectedMotions }) => {
          const THREE = await import(threePath);
          const { GLTFLoader } = await import(loaderPath);
          const source = await import('/faction-models.ts');
          const structures = await import('/structure-models.ts');
          const effects = await import('/effect-models.ts');
          const unit = source.UNIT_ROLES.includes(job.role);
          const effect = effects.EFFECT_ROLES.includes(job.role);
          const actor = unit ? new source.FactionActor(job.faction, job.role) : effect ? new effects.NuclearBlastActor() : new structures.StructureActor(job.faction, job.role);
          const loaded = await new GLTFLoader().loadAsync(`/models/factions/${job.faction}/${job.role}/model.glb`);
          const mixer = new THREE.AnimationMixer(loaded.scene);
          const clips = actor.clips();
          const checked = [];
          for (const motion of (unit ? source.ROLE_MOTIONS[job.role] : effect ? effects.EFFECT_ROLE_MOTIONS[job.role] : structures.STRUCTURE_ROLE_MOTIONS[job.role])) {
            if (selectedMotions && !selectedMotions.includes(motion)) continue;
            const clip = loaded.animations.find(clip => clip.name === motion);
            if (!clip) throw Error('GLTFLoader lost animation: ' + motion);
            const original = clips.find(clip => clip.name === motion);
            mixer.stopAllAction(); const action = mixer.clipAction(clip); action.setLoop(THREE.LoopOnce, 1); action.clampWhenFinished = true; action.play();
            let maximumError = 0;
            const times = original.tracks[0].times;
            const sampleTimes = effect ? [0.1, 0.45, 1.6, 2.8, 4.2, 5.6].map(eventTime => [...times].reduce((closest, time) => Math.abs(time - eventTime) < Math.abs(closest - eventTime) ? time : closest, times[0])) : [0.2, 0.5, 0.8].map(fraction => times[Math.floor((times.length - 1) * fraction)]);
            for (const time of sampleTimes) {
              // Sample at an actual baked key time, avoiding a different interpolation algorithm in the procedural pose.
              mixer.setTime(time); actor.pose(motion, time);
              for (const node of Object.values(actor.joints)) {
                const actual = loaded.scene.getObjectByName(node.name);
                if (!actual) throw Error('GLTFLoader lost animated node: ' + node.name);
                const error = Math.max(actual.position.distanceTo(node.position), actual.scale.distanceTo(node.scale), 1 - Math.abs(actual.quaternion.dot(node.quaternion)));
                if (!Number.isFinite(error)) throw Error('Non-finite GLB pose: ' + motion + '/' + node.name);
                maximumError = Math.max(maximumError, error);
                if (error > 0.0002) throw Error(`GLB/source pose mismatch ${motion}/${node.name} at${time}: ${error}`);
              }
            }
            checked.push({ motion, sampleTimes, maximumPoseError: maximumError });
          }
          mixer.stopAllAction(); mixer.uncacheRoot(loaded.scene);
          loaded.scene.traverse(node => { if (node.isMesh) { node.geometry.dispose(); for (const material of Array.isArray(node.material) ? node.material : [node.material]) { for (const value of Object.values(material)) if (value?.isTexture) value.dispose(); material.dispose(); } } });
          return { ...job, loadedMeshes: loaded.scene.children.length, loadedClipCount: loaded.animations.length, checked, status: 'pass' };
        }, { job, loaderPath, threePath, selectedMotions });
        report.browser.push(result); console.log('GLB round-trip:', job.faction, job.role, result.checked.length, 'motions');
      } catch (error) { recordError('browser', job.faction, job.role, error); }
    }
  } catch (error) { recordError('browser-setup', '', '', error); }
  finally { await browser?.close(); vite?.kill('SIGTERM'); }
}
report.summary = { sourceActors: report.source.length, physicalModelPacks: report.files.filter(item => item.status === 'pass').length, physicalGLBs: filesReady.length, browserLoadedModels: report.browser.length, errors: report.errors.length, sourceOnly, filesOnly };
await mkdir(resolve(output, '..'), { recursive: true });
await writeFile(output, JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report.summary, null, 2));
if (report.errors.length) process.exitCode = 1;
