/** Export the factory's real GLB clips and eight-direction PNG atlases locally. */
import { createServer } from 'node:http';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { spawn } from 'node:child_process';
import { chromium } from 'playwright';
import { PNG } from 'pngjs';
import { tsImport } from 'tsx/esm/api';
import { FACTIONS, UNITS, BUILDINGS, EFFECTS, COMMON_FACTION, ASSET_TARGETS, motions, modelSource } from './asset-catalog.mjs';

const { validateAtlas } = await tsImport('../client/sprite-atlas.ts', import.meta.url);
const missingOnly = process.env.EXPORT_SCOPE !== 'all';
const dest = 'client/public/models/factions';
const filter = process.env.EXPORT_FILTER;
const list = value => value === undefined ? undefined : [...new Set(value.split(',').map(x => x.trim()).filter(Boolean))];
const selectedActions = list(process.env.EXPORT_ACTIONS);
const selectedFactions = list(process.env.EXPORT_FACTIONS ?? process.env.EXPORT_FACTION);
const selectedRoles = list(process.env.EXPORT_ROLES ?? process.env.EXPORT_ROLE);
const modelsOnly = process.env.EXPORT_MODELS_ONLY === '1';
// Explicit effects-only jobs are useful for a global nuclear blast; default exports everything.
const effectsOnly = process.env.EXPORT_EFFECTS === '1';
const includeEffects = process.env.EXPORT_EFFECTS !== '0';
const skipAudit = process.env.EXPORT_SKIP_AUDIT === '1';
const dryRun = process.env.EXPORT_DRY_RUN === '1';
const pageName = process.env.EXPORT_PAGE ?? 'asset-export.html';
const vitePort = Number(process.env.EXPORT_PORT ?? process.env.PORT ?? 4173);
const uploadPort = Number(process.env.EXPORT_UPLOAD_PORT ?? vitePort + 1);
const roles = [...UNITS, ...BUILDINGS, ...EFFECTS];
const factions = [...FACTIONS, ...(EFFECTS.length ? [COMMON_FACTION] : [])];
for (const [label, selection, catalog] of [['faction', selectedFactions, factions], ['role', selectedRoles, roles]]) {
  if (selection && (!selection.length || selection.some(item => !catalog.includes(item)))) throw Error('Unknown export ' + label + ' filter');
}
if (selectedActions && (!selectedActions.length || selectedActions.some(action => !roles.some(role => motions(role).includes(action))))) throw Error('Unknown export action');
if (filter && !ASSET_TARGETS.some(({ faction, role }) => filter === faction + '/' + role)) throw Error('Unknown export filter: ' + filter);
if (process.env.EXPORT_EFFECTS !== undefined && !['0', '1'].includes(process.env.EXPORT_EFFECTS)) throw Error('EXPORT_EFFECTS must be 0 or 1');
if (effectsOnly && !EFFECTS.length) throw Error('No global effect factory is available');
if (!/^[a-zA-Z0-9_-]+\.html$/.test(pageName)) throw Error('Invalid export page: ' + pageName);
if (![vitePort, uploadPort].every(port => Number.isInteger(port) && port > 0 && port < 65536) || vitePort === uploadPort) throw Error('Invalid export ports');

/** Binary validity plus every expected animation name; stale GLBs must be refreshed. */
const modelCurrent = async (path, expectedMotions) => {
  try {
    const bytes = await readFile(join(dest, path));
    if (bytes.length < 20 || bytes.toString('ascii', 0, 4) !== 'glTF' || bytes.readUInt32LE(4) !== 2 || bytes.readUInt32LE(8) !== bytes.length) return false;
    const jsonLength = bytes.readUInt32LE(12);
    if (bytes.readUInt32LE(16) !== 0x4e4f534a || 20 + jsonLength > bytes.length) return false;
    const gltf = JSON.parse(bytes.toString('utf8', 20, 20 + jsonLength));
    const actual = new Set((gltf.animations ?? []).map(clip => clip.name));
    return expectedMotions.every(motion => actual.has(motion));
  } catch { return false; }
};
const exists = async path => {
  try {
    const bytes = await readFile(join(dest, path));
    if (path.endsWith('.png')) { const png = PNG.sync.read(bytes); return png.width > 0 && png.height > 0; }
    validateAtlas(JSON.parse(bytes.toString())); return true;
  } catch { return false; }
};
const reviewed = async path => {
  try { return JSON.parse(await readFile(join(dest, path), 'utf8')).visualQA?.status === 'accepted'; }
  catch { return false; }
};
const targets = [];
for (const { faction, role } of ASSET_TARGETS) {
  if (effectsOnly && faction !== COMMON_FACTION) continue;
  if (!includeEffects && faction === COMMON_FACTION) continue;
  if (filter && filter !== faction + '/' + role) continue;
  if (selectedFactions && !selectedFactions.includes(faction)) continue;
  if (selectedRoles && !selectedRoles.includes(role)) continue;
  const available = motions(role);
  if (selectedActions && (filter || selectedRoles?.length === 1) && selectedActions.some(action => !available.includes(action))) throw Error('Unsupported action for export role: ' + role);
  if (selectedActions && !selectedActions.some(action => available.includes(action))) {
    continue;
  }
  const model = !missingOnly || !(await modelCurrent(`${faction}/${role}/model.glb`, available));
  const actions = [];
  if (!modelsOnly) for (const action of available) {
    if (selectedActions && !selectedActions.includes(action)) continue;
    if (await reviewed(`${faction}/${role}/sprites/${action}.provenance.json`)) continue;
    if (!missingOnly || !(await exists(`${faction}/${role}/sprites/${action}.png`)) || !(await exists(`${faction}/${role}/sprites/${action}.json`))) actions.push(action);
  }
  if (model || actions.length) targets.push({ faction, role, model, actions, source: modelSource(role) });
}
console.log('Factory export jobs:', targets.length, 'scope:', missingOnly ? 'missing or outdated' : 'all');
if (dryRun) {
  console.log(JSON.stringify({ page: pageName, vitePort, uploadPort, targets }, null, 2));
} else {
  await runExport();
}

async function audit() {
  if (skipAudit) return;
  const complete = !filter && !selectedActions && !selectedFactions && !selectedRoles && !modelsOnly && !effectsOnly && includeEffects;
  const processAudit = spawn(process.execPath, ['--import', 'tsx', 'scripts/audit-assets.mjs', '--write', ...(complete ? ['--require-complete'] : [])], { stdio: 'inherit' });
  await new Promise((resolve, reject) => {
    processAudit.on('error', reject);
    processAudit.on('exit', code => code === 0 ? resolve() : reject(Error('Exported asset audit failed: ' + code)));
  });
}

async function runExport() {
  if (!targets.length) { await audit(); console.log('DONE: no export files needed.'); return; }
  // Exact paths for this job, derived from the catalog, including scout/flyer/building motions.
  const allowedUploads = new Set(targets.flatMap(job => {
    const prefix = job.faction + '/' + job.role;
    return [...(job.model ? [prefix + '/model.glb'] : []), ...job.actions.flatMap(action => [prefix + '/sprites/' + action + '.png', prefix + '/sprites/' + action + '.json'])];
  }));
  const files = [];
  const server = createServer(async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }
    if (req.method !== 'POST' || !req.url?.startsWith('/upload?')) { res.writeHead(404); res.end(); return; }
    try {
      const relative = new URL(req.url, 'http://localhost').searchParams.get('path') ?? '';
      if (!allowedUploads.has(relative)) throw Error('Invalid export path: ' + relative);
      const chunks = []; for await (const chunk of req) chunks.push(chunk);
      const bytes = Buffer.concat(chunks), file = join(dest, relative);
      await mkdir(dirname(file), { recursive: true }); await writeFile(file, bytes);
      files.push({ file: relative, bytes: bytes.byteLength }); res.writeHead(200); res.end('ok');
    } catch (error) { res.writeHead(400); res.end(String(error)); }
  });
  let vite, browser;
  try {
    await new Promise((resolve, reject) => { server.once('error', reject); server.listen(uploadPort, '127.0.0.1', resolve); });
    vite = spawn(process.execPath, ['node_modules/vite/bin/vite.js', 'client', '--host', '127.0.0.1', '--port', String(vitePort), '--strictPort'], { stdio: 'inherit' });
    const pageURL = `http://127.0.0.1:${vitePort}/${pageName}`;
    for (let attempt = 0; attempt < 90; attempt++) {
      if (vite.exitCode !== null) throw Error('Vite exited before export: ' + vite.exitCode);
      try { const response = await fetch(pageURL); if (response.ok) break; } catch {}
      await new Promise(resolve => setTimeout(resolve, 1000));
      if (attempt === 89) throw Error('Vite export page failed to start: ' + pageURL);
    }
    browser = await chromium.launch({ headless: true, executablePath: process.env.WAHA_CHROMIUM_PATH || undefined, args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-webgl', '--disable-web-security'] });
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, acceptDownloads: true });
    page.on('console', message => { if (message.type() === 'error') console.error('[browser]', message.text()); });
    page.on('pageerror', error => console.error('[browser exception]', error.message));
    await page.goto(pageURL, { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => !!window.assetLab?.glb && !!window.assetLab?.spriteAtlas, null, { timeout: 120000 });
    page.setDefaultTimeout(180000);
    for (const job of targets) {
      console.log('Exporting factory:', job.faction, job.role, job.actions.join(','));
      const result = await page.evaluate(async ({ job, uploadURL }) => {
        const api = window.assetLab;
        const upload = async (path, bytes, type = 'application/octet-stream') => {
          const response = await fetch(uploadURL + '?path=' + encodeURIComponent(path), { method: 'POST', body: bytes, headers: { 'Content-Type': type } });
          if (!response.ok) throw Error(path + ': ' + await response.text());
        };
        const prefix = job.faction + '/' + job.role;
        if (job.model) await upload(prefix + '/model.glb', await api.glb(job.faction, job.role), 'model/gltf-binary');
        for (const motion of job.actions) {
          const data = await api.spriteAtlas(job.faction, job.role, motion);
          if (data.metadata.animation !== motion) throw Error('Exporter substituted ' + data.metadata.animation + ' for ' + motion);
          data.metadata.image = motion + '.png';
          data.metadata.provenance = { source: job.source, kind: 'procedural-prototype', productionArtApproved: false };
          await upload(prefix + '/sprites/' + motion + '.png', data.blob, 'image/png');
          await upload(prefix + '/sprites/' + motion + '.json', JSON.stringify(data.metadata, null, 2) + '\n', 'application/json');
        }
        return { model: job.model, atlases: job.actions.length };
      }, { job, uploadURL: `http://127.0.0.1:${uploadPort}/upload` });
      console.log('  exported:', result);
    }
    await audit();
    console.log('DONE: exported', files.length, 'factory files. Artistic acceptance remains separate.');
  } finally {
    await browser?.close();
    vite?.kill('SIGTERM');
    server.close();
  }
}
