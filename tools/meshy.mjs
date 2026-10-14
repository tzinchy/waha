// Генерация моделей через Meshy API: текст -> 3D (preview -> refine с PBR) -> риг -> анимации -> GLB в client/public/models/meshy.
// Запуск: MESHY_API_KEY=... node tools/meshy.mjs [имя_юнита ...]   (без имён: все из UNITS)
// Ключ можно положить в .env.local строкой MESHY_API_KEY=... (файл в .gitignore).
// Уже готовые шаги пропускаются: id задач пишутся в tools/meshy-state.json, повторный запуск продолжает с места остановки.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { getFactionUnits, getProductionPlan } from './faction-presets.mjs';

const args = process.argv.slice(2);
if (args.includes('--help')) {
  console.log('node tools/meshy.mjs [--faction legion|heretics|scrap|necrons] [--dry-run] [captain guard builder hq barracks post turret]');
  console.log('Dry-run prints presets without credentials, network calls or paid tasks. With --faction, outputs use models/factions/<faction>/<unit>.');
  process.exit(0);
}
const dryRun = args.includes('--dry-run');
const factionAt = args.indexOf('--faction');
const faction = factionAt >= 0 ? args[factionAt + 1] : undefined;
if (factionAt >= 0 && (!faction || faction.startsWith('--'))) { console.error('--faction requires a faction id'); process.exit(1); }
const namesArg = args.filter((a, i) => a !== '--dry-run' && (factionAt < 0 || (i !== factionAt && i !== factionAt + 1)));
if (namesArg.some(a => a.startsWith('--'))) { console.error('Unknown option; see --help'); process.exit(1); }

const API = 'https://api.meshy.ai/openapi';
const OUT = new URL(faction ? `../client/public/models/factions/${faction}/` : '../client/public/models/meshy/', import.meta.url);
const STATE = new URL('./meshy-state.json', import.meta.url);

const STYLE = 'grimdark gothic sci-fi, battle-worn, high detail, realistic proportions, PBR, game-ready, full body, standing, single character';
// Оригинальный сеттинг (не Warhammer): имперская пехота и техножрецы в духе мрачной готики.
const LEGACY_UNITS = {
  captain: { rig: true, height: 2.1, prompt: `towering armored knight-commander in heavy ornate power armor with cloak, skull motifs, gothic helmet, holding a large sword, ${STYLE}` },
  guard: { rig: true, height: 1.8, prompt: `armored infantry trooper in heavy plate carapace armor and gas mask helmet, holding a long rifle, ${STYLE}` },
  builder: { rig: true, height: 1.7, prompt: `hooded tech-engineer in red robes with mechanical arm and tool backpack, holding a heavy hammer, ${STYLE}` },
  hq: { rig: false, prompt: 'grimdark gothic fortress command bastion, cathedral spires, buttresses, heavy walls, game-ready building, top-down RTS view, PBR' },
  barracks: { rig: false, prompt: 'grimdark gothic military barracks hall, armored doors, banners, buttresses, game-ready building, RTS, PBR' },
  post: { rig: false, prompt: 'grimdark gothic sentry relay tower, small fortified obelisk with antenna and skull ornaments, game-ready, RTS, PBR' },
};
export const UNITS = faction ? getFactionUnits(faction) : LEGACY_UNITS;
const names = namesArg.length ? namesArg : Object.keys(UNITS);
if (names.some(n => !Object.hasOwn(UNITS, n))) { console.error(`Unknown unit; choose ${Object.keys(UNITS).join(', ')}`); process.exit(1); }
if (dryRun) {
  const plan = faction ? getProductionPlan(faction) : { units: UNITS };
  if (faction) {
    const selected = Object.fromEntries(names.map(n => [n, UNITS[n]]));
    plan.factions[faction].units = selected;
    plan.totals = { factions: 1, models: names.length, riggedCharacters: names.filter(n => UNITS[n].rig).length, animationClips: names.reduce((total, n) => total + UNITS[n].animations.length, 0) };
  } else plan.units = Object.fromEntries(names.map(n => [n, UNITS[n]]));
  console.log(JSON.stringify(plan, null, 2));
  process.exit(0);
}
// анимации: имя у нас -> шаблон поиска в библиотеке Meshy
const ANIMS = { idle: /^idle/i, run: /^run/i, walk: /^walk/i, attack: /(sword|slash|attack)/i, shoot: /(shoot|rifle|gun)/i, death: /(death|die|dying)/i, work: /(hammer|work|build|dig)/i };

function key() {
  if (process.env.MESHY_API_KEY) return process.env.MESHY_API_KEY;
  try { return readFileSync(new URL('../.env.local', import.meta.url), 'utf8').match(/MESHY_API_KEY=(\S+)/)?.[1]; } catch { return undefined; }
}
const KEY = key();
if (!KEY) { console.error('Нет MESHY_API_KEY (переменная окружения или .env.local)'); process.exit(1); }

const state = existsSync(STATE) ? JSON.parse(readFileSync(STATE, 'utf8')) : {};
const save = () => writeFileSync(STATE, JSON.stringify(state, null, 2));
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function call(method, path, body) {
  const r = await fetch(API + path, { method, headers: { Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json' }, body: body && JSON.stringify(body) });
  const text = await r.text();
  if (!r.ok) throw new Error(`${method} ${path}: ${r.status} ${text.slice(0, 300)}`);
  return JSON.parse(text);
}

async function task(path, body, label) { // создать задачу (если ещё нет) и дождаться результата
  const sk = faction ? `${faction}.${label}` : label;
  if (!state[sk]) { state[sk] = (await call('POST', path, body)).result; save(); }
  for (;;) {
    const t = await call('GET', `${path}/${state[sk]}`);
    if (t.status === 'SUCCEEDED') return t;
    if (t.status === 'FAILED' || t.status === 'CANCELED') { delete state[sk]; save(); throw new Error(`${label}: ${t.status} ${JSON.stringify(t.task_error ?? '')}`); }
    process.stdout.write(`\r${label}: ${t.status} ${t.progress ?? 0}%   `);
    await sleep(8000);
  }
}

async function download(url, file) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`download ${file}: ${r.status}`);
  writeFileSync(file, Buffer.from(await r.arrayBuffer()));
  console.log(`\n  -> ${file.pathname ?? file}`);
}

let library;
async function actionId(re) {
  library ??= await call('GET', '/v1/animations/library');
  const list = Array.isArray(library) ? library : library.result ?? library.data ?? library.items ?? [];
  if (!existsSync(new URL('./meshy-anim-library.json', import.meta.url))) writeFileSync(new URL('./meshy-anim-library.json', import.meta.url), JSON.stringify(list, null, 2));
  const hit = list.find(a => re.test(a.name ?? a.action_name ?? ''));
  return hit && (hit.action_id ?? hit.id);
}

async function make(name) {
  const u = UNITS[name], dir = new URL(`${name}/`, OUT);
  mkdirSync(dir, { recursive: true });
  const preview = await task('/v2/text-to-3d', { mode: 'preview', prompt: u.prompt, ai_model: 'latest', topology: 'triangle', target_polycount: u.targetPolycount ?? (u.rig ? 12000 : 20000), should_remesh: true, ...(u.rig ? { pose_mode: 'a-pose' } : {}) }, `${name}.preview`);
  const refine = await task('/v2/text-to-3d', { mode: 'refine', preview_task_id: preview.id, enable_pbr: true, texture_resolution: u.textureResolution ?? '2k' }, `${name}.refine`);
  if (!u.rig) { await download(refine.model_urls.glb, new URL('model.glb', dir)); return; }
  const rig = await task('/v1/rigging', { input_task_id: refine.id, height_meters: u.height }, `${name}.rig`);
  await download(rig.result?.rigged_character_glb_url ?? rig.rigged_character_glb_url, new URL('model.glb', dir));
  for (const anim of u.animations ?? Object.keys(ANIMS)) {
    const re = ANIMS[anim];
    const id = await actionId(re);
    if (id === undefined) {
      if (faction) throw new Error(`Required animation ${anim} was not found in the Meshy library; asset is incomplete`);
      console.log(`\n  нет анимации ${anim} в библиотеке`); continue;
    }
    const a = await task('/v1/animations', { rig_task_id: rig.id, action_id: id, post_process: { operation_type: 'change_fps', fps: 30 } }, `${name}.anim.${anim}`);
    await download(a.result?.animation_glb_url ?? a.animation_glb_url, new URL(`${anim}.glb`, dir));
  }
}

for (const n of names) {
  console.log(`\n== ${n}`);
  try { await make(n); } catch (e) { console.error(`\n${n}: ${e.message}`); process.exitCode = 1; }
}
