/** Assemble a portable archive only from a complete, freshly validated physical pack. */
import { readFile, readdir, mkdir, mkdtemp, writeFile, rename, rm, stat } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { spawn } from 'node:child_process';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ASSET_TARGETS, motions, modelSource } from './asset-catalog.mjs';

const project = resolve(fileURLToPath(new URL('..', import.meta.url)));
const source = join(project, 'client/public/models/factions');
const auditPath = join(project, 'assets/art-audit.json');
const validatorPath = join(project, 'artifacts/glb-validation.json');
const output = join(project, 'artifacts/WAHA-model-pack.zip');
const checkOnly = process.argv.includes('--check-only');
if (process.argv.slice(2).some(argument => argument !== '--check-only')) throw Error('Usage: node --import tsx scripts/pack-models.mjs [--check-only]');
const hash = data => createHash('sha256').update(data).digest('hex');
const json = async path => JSON.parse(await readFile(path, 'utf8'));
const assert = (condition, message) => { if (!condition) throw Error(message); };
const sameSet = (left, right) => {
  const a = [...left].sort(), b = [...right].sort();
  return a.length === b.length && a.every((value, index) => value === b[index]);
};
const slash = path => path.split('\\').join('/');

async function walk(root, prefix = '') {
  const paths = [];
  for (const entry of await readdir(join(root, prefix), { withFileTypes: true })) {
    const path = join(prefix, entry.name);
    if (entry.isSymbolicLink()) throw Error('Refusing a symlink in portable assets: ' + path);
    if (entry.isDirectory()) paths.push(...await walk(root, path));
    else if (entry.isFile()) paths.push(slash(path));
  }
  return paths.sort();
}
function run(command, args, cwd) {
  return new Promise((resolveRun, reject) => {
    const child = spawn(command, args, { cwd, stdio: ['ignore', 'inherit', 'inherit'], shell: false });
    child.once('error', reject);
    child.once('close', code => code === 0 ? resolveRun() : reject(Error(command + ' exited with ' + code)));
  });
}

async function inspect() {
  const [audit, validation, manifest] = await Promise.all([json(auditPath), json(validatorPath), json(join(source, 'manifest.json'))]);
  assert(audit.summary?.missing === 0 && audit.summary?.errors === 0 && audit.missing?.length === 0 && audit.errors?.length === 0,
    'Packaging blocked: run the complete physical audit; missing assets and errors must both be zero.');
  assert(validation.validator === 'Khronos glTF-Validator' && validation.errors === 0 && validation.warnings === 0 && Array.isArray(validation.reports),
    'Packaging blocked: a Khronos report with zero errors and warnings is required.');
  const paths = await walk(source), pathSet = new Set(paths);
  const required = ASSET_TARGETS.flatMap(({ faction, role }) => [
    `${faction}/${role}/model.glb`,
    ...motions(role).flatMap(motion => [`${faction}/${role}/sprites/${motion}.png`, `${faction}/${role}/sprites/${motion}.json`]),
  ]);
  const missing = required.filter(path => !pathSet.has(path));
  assert(!missing.length, 'Packaging blocked: catalog assets are missing: ' + missing.slice(0, 10).join(', '));
  const modelPaths = paths.filter(path => path.endsWith('.glb'));
  const atlasPaths = paths.filter(path => path.endsWith('.png'));
  assert(manifest.models === modelPaths.length && manifest.spriteAtlases === atlasPaths.length,
    'Packaging blocked: manifest model/atlas totals are stale.');
  assert(sameSet(manifest.files.map(record => record.file), modelPaths), 'Packaging blocked: manifest model paths do not match disk.');
  assert(audit.summary.models === modelPaths.length && audit.summary.spriteAtlases === atlasPaths.length,
    'Packaging blocked: physical audit totals do not match disk.');
  assert(validation.models === modelPaths.length && sameSet(validation.reports.map(report => report.file), modelPaths),
    'Packaging blocked: Khronos report does not cover all physical GLBs.');
  assert(validation.reports.every(report => report.errors === 0 && report.warnings === 0), 'Packaging blocked: a GLB failed Khronos validation.');
  const audited = new Map(audit.files.map(record => [record.file, record]));
  assert(sameSet([...audited.keys()], [...modelPaths, ...atlasPaths]), 'Packaging blocked: audit file coverage is stale.');
  const [auditStat, validatorStat] = await Promise.all([stat(auditPath), stat(validatorPath)]);
  const files = [];
  let clips = 0, auditedBytes = 0;
  for (const path of paths) {
    const absolute = join(source, path), info = await stat(absolute), bytes = await readFile(absolute);
    if (path !== 'manifest.json') assert(info.mtimeMs <= auditStat.mtimeMs,
      'Packaging blocked: asset changed after the physical audit: ' + path);
    if (path.endsWith('.glb') || path.endsWith('.png')) {
      assert(audited.get(path)?.technical === 'pass' && audited.get(path)?.bytes === bytes.length,
        'Packaging blocked: audit content size/status differs for ' + path);
      auditedBytes += bytes.length;
    }
    if (path.endsWith('.glb')) {
      assert(info.mtimeMs <= validatorStat.mtimeMs, 'Packaging blocked: GLB changed after Khronos validation: ' + path);
      const gltf = JSON.parse(bytes.toString('utf8', 20, 20 + bytes.readUInt32LE(12)));
      assert((gltf.buffers ?? []).every(buffer => !buffer.uri || buffer.uri.startsWith('data:'))
        && (gltf.images ?? []).every(image => !image.uri || image.uri.startsWith('data:')),
      'Portable GLB has an external buffer or image: ' + path);
      const names = (gltf.animations ?? []).map(animation => animation.name);
      const [, role] = path.split('/');
      assert(motions(role).every(motion => names.includes(motion)), 'Packaging blocked: missing GLB clips in ' + path);
      clips += names.length;
    }
    files.push({ path: 'factions/' + path, bytes: bytes.length, sha256: hash(bytes), sourcePath: path });
  }
  assert(audit.summary.glbAnimationClips === clips && manifest.animationClips === clips,
    'Packaging blocked: GLB animation count differs from the audits.');
  assert(audit.summary.bytes === auditedBytes, 'Packaging blocked: audited GLB/PNG bytes differ from disk.');
  const sidecars = atlasPaths.map(path => path.replace(/\.png$/, '.json'));
  assert(sidecars.every(path => pathSet.has(path)), 'Packaging blocked: a physical PNG has no JSON sidecar.');
  const summary = {
    models: modelPaths.length, animationClips: clips, spriteAtlases: atlasPaths.length,
    spriteSidecars: sidecars.length, assetFiles: files.length,
    assetBytes: files.reduce((sum, file) => sum + file.bytes, 0),
    auditedGlbPngBytes: auditedBytes, requiredCatalogTargets: ASSET_TARGETS.length,
    physicalAudit: { missing: audit.summary.missing, errors: audit.summary.errors, warnings: audit.summary.warnings },
    khronos: { models: validation.models, errors: validation.errors, warnings: validation.warnings },
  };
  return { audit, validation, manifest, files, summary };
}

async function main() {
  // No archive or staging directory is created before these gates pass.
  const inspected = await inspect();
  if (checkOnly) { console.log(JSON.stringify({ ready: true, ...inspected.summary }, null, 2)); return; }
  await mkdir(dirname(output), { recursive: true });
  const staging = await mkdtemp(join(dirname(output), '.model-pack-stage-'));
  const pending = join(dirname(output), `.WAHA-model-pack.${process.pid}.${Date.now()}.pending.zip`);
  const root = join(staging, 'WAHA-model-pack');
  const builtAt = new Date().toISOString();
  try {
    await mkdir(root);
    for (const file of inspected.files) {
      const bytes = await readFile(join(source, file.sourcePath));
      assert(hash(bytes) === file.sha256, 'Asset changed during packaging: ' + file.sourcePath);
      const destination = join(root, file.path);
      await mkdir(dirname(destination), { recursive: true });
      await writeFile(destination, bytes);
    }
    const doc = await readFile(join(project, 'docs/MODEL_PACK.md'), 'utf8');
    const packageIntroduction = `Пакет собран ${builtAt}. Проверено наличие ${inspected.summary.models} GLB, ${inspected.summary.animationClips} клипов и ${inspected.summary.spriteAtlases} пар PNG/JSON. Физический аудит: 0 отсутствующих файлов и 0 ошибок; Khronos glTF-Validator: 0 ошибок и 0 предупреждений. Полный список файлов, размеры и SHA-256 — в PACK_MANIFEST.json и SHA256SUMS.`;
    await writeFile(join(root, 'INTEGRATION.md'), doc.replace(/Документ описывает контракт интеграции\.[^\n]*/, packageIntroduction));
    await mkdir(join(root, 'runtime'));
    await writeFile(join(root, 'runtime/sprite-atlas.ts'), await readFile(join(project, 'client/sprite-atlas.ts')));
    await writeFile(join(root, 'runtime/README.txt'), 'sprite-atlas.ts is an optional dependency-free TypeScript sampling helper. Compile it with your own TypeScript toolchain, or sample the JSON frames directly. The GLB and PNG/JSON assets need no Node.js or repository dependencies.\n');
    await mkdir(join(root, 'validation'));
    await writeFile(join(root, 'validation/art-audit.json'), JSON.stringify(inspected.audit, null, 2) + '\n');
    await writeFile(join(root, 'validation/glb-validation.json'), JSON.stringify(inspected.validation, null, 2) + '\n');
    const provenance = {
      format: 1, quality: 'Existing procedural low-texture style accepted for this delivery; not authored captain-quality pixel art.',
      sourceFactories: [...new Set(ASSET_TARGETS.map(({ role }) => modelSource(role)))],
      provenance: 'Repository-generated geometry, procedural material textures and animations. PNGs are baked from the same 3D actors. Per-atlas provenance remains in its original JSON.',
      licensing: 'No separate license grant is inferred by packaging. Legacy KayKit models, Poly Haven textures and generated pose studies outside factions/ are not included.',
      gameplay: 'Visual assets only; no damage, ownership, resource or network rules are provided.',
    };
    await writeFile(join(root, 'PROVENANCE.json'), JSON.stringify(provenance, null, 2) + '\n');
    await writeFile(join(root, 'PACK_MANIFEST.json'), JSON.stringify({
      version: 1, builtAt, assetRoot: 'factions/', quality: provenance.quality,
      coordinateSystem: { up: '+Y', forward: '+Z', units: 'repository model units', motion: 'Animated local rigid nodes; caller chooses world placement and physics.' },
      ...inspected.summary,
      files: inspected.files.map(({ sourcePath, ...file }) => file),
      checksums: 'SHA256SUMS covers every packaged file except SHA256SUMS itself. The archive SHA-256 sidecar covers the complete ZIP.',
    }, null, 2) + '\n');
    const sums = [];
    for (const path of await walk(root)) sums.push(hash(await readFile(join(root, path))) + '  ' + path);
    await writeFile(join(root, 'SHA256SUMS'), sums.join('\n') + '\n');
    await run('zip', ['-q', '-X', '-r', pending, 'WAHA-model-pack'], staging);
    const archiveBytes = await readFile(pending), checksum = hash(archiveBytes);
    await rename(pending, output);
    const checksumPending = output + `.sha256.${process.pid}.pending`;
    await writeFile(checksumPending, checksum + '  ' + output.split('/').at(-1) + '\n');
    await rename(checksumPending, output + '.sha256');
    console.log(JSON.stringify({ archive: slash(relative(project, output)), bytes: archiveBytes.length, sha256: checksum, ...inspected.summary }, null, 2));
  } finally {
    // Remove only the temporary paths created by this invocation, never existing artifacts.
    await rm(staging, { recursive: true, force: true });
    await rm(pending, { force: true });
  }
}
main().catch(error => { console.error(String(error)); process.exitCode = 1; });
