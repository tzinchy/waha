// Баланс расы из мода DoW: .rgd из ua/<мод>/Data/attrib → shared/ua-<раса>.ts. Запуск: node tools/ua-race.mjs tyranids | inquisition
// Источник — Ultimate Apocalypse 1.89.2 (установщик UA_1.89.2.exe → ua/UltimateApocalypse_THB, 7zz x без звуков). Моды лежат в ua/ (в git и сборку не попадают).
// Ключи в .rgd хранятся хэшами (Jenkins lookup2) — ищем по известным именам, текстовые id ($…) берём из Locale/English/*.ucs.
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const RACES = {
  tyranids: { mod: 'UltimateApocalypse_THB', race: 'tyranids', ucs: ['Tyranids.ucs', 'Apocalypse- Units.ucs', 'Titan weapons.ucs'], name: 'UA_TYRANIDS', title: 'Ultimate Apocalypse 1.89.2' },
  inquisition: { mod: 'UltimateApocalypse_THB', race: 'inquisition_daemonhunt', ucs: ['inqusition_daemonhunt.ucs', 'Apocalypse- Units.ucs', 'Titan weapons.ucs'], name: 'UA_INQUISITION', title: 'Ultimate Apocalypse 1.89.2' },
};
const R = RACES[process.argv[2] ?? 'tyranids'];
if (!R) throw new Error('раса: ' + Object.keys(RACES).join(' | '));
const ROOT = `ua/${R.mod}/Data/attrib/`;

function hash(str) {
  const k = Buffer.from(str, 'latin1');
  let len = k.length, a = 0x9e3779b9, b = 0x9e3779b9, c = 0, i = 0;
  const mix = () => {
    a = (a - b - c) >>> 0; a = (a ^ (c >>> 13)) >>> 0; b = (b - c - a) >>> 0; b = (b ^ (a << 8)) >>> 0; c = (c - a - b) >>> 0; c = (c ^ (b >>> 13)) >>> 0;
    a = (a - b - c) >>> 0; a = (a ^ (c >>> 12)) >>> 0; b = (b - c - a) >>> 0; b = (b ^ (a << 16)) >>> 0; c = (c - a - b) >>> 0; c = (c ^ (b >>> 5)) >>> 0;
    a = (a - b - c) >>> 0; a = (a ^ (c >>> 3)) >>> 0; b = (b - c - a) >>> 0; b = (b ^ (a << 10)) >>> 0; c = (c - a - b) >>> 0; c = (c ^ (b >>> 15)) >>> 0;
  };
  const w = (j) => k[j] + (k[j + 1] << 8) + (k[j + 2] << 16) + (k[j + 3] << 24);
  while (len >= 12) { a = (a + w(i)) >>> 0; b = (b + w(i + 4)) >>> 0; c = (c + w(i + 8)) >>> 0; mix(); i += 12; len -= 12; }
  c = (c + k.length) >>> 0;
  const tail = [[10, 'c', 24], [9, 'c', 16], [8, 'c', 8], [7, 'b', 24], [6, 'b', 16], [5, 'b', 8], [4, 'b', 0], [3, 'a', 24], [2, 'a', 16], [1, 'a', 8], [0, 'a', 0]];
  for (const [j, r, s] of tail) if (len > j) { const v = (k[i + j] << s) >>> 0; if (r === 'a') a = (a + v) >>> 0; else if (r === 'b') b = (b + v) >>> 0; else c = (c + v) >>> 0; }
  mix();
  return c >>> 0;
}

/** Дерево .rgd: { хэш: значение }; таблицы — вложенные объекты. */
function parse(file) {
  const b = readFileSync(ROOT + file);
  const table = (o) => {
    const n = b.readUInt32LE(o), base = o + 4 + n * 12, out = {};
    for (let j = 0; j < n; j++) {
      const e = o + 4 + j * 12, h = b.readUInt32LE(e), t = b.readUInt32LE(e + 4), off = base + b.readUInt32LE(e + 8);
      out[h] = t === 0 ? b.readFloatLE(off) : t === 1 ? b.readUInt32LE(off) : t === 2 ? !!b[off] : t === 3 ? b.toString('latin1', off, b.indexOf(0, off))
        : t === 4 ? (() => { let e2 = off; while (b.readUInt16LE(e2)) e2 += 2; return b.toString('utf16le', off, e2); })() : t >= 100 ? table(off) : null;
    }
    return out;
  };
  return table(0x34);
}
/** Значение по пути имён ключей: get(t, 'health_ext', 'hitpoints'). */
const get = (t, ...path) => path.reduce((o, k) => (o && typeof o === 'object' ? o[hash(k)] : undefined), t);
const entries = (t) => (t && typeof t === 'object' ? Object.values(t).filter((v) => v && typeof v === 'object') : []);

const ucsFiles = [...new Set([...R.ucs, ...readdirSync(`ua/${R.mod}/Locale/English`).filter((f) => f.endsWith('.ucs'))])]; // все тексты мода: описания лежат в разных файлах
const ucs = Object.fromEntries(ucsFiles.flatMap((f) => readFileSync(`ua/${R.mod}/Locale/English/${f}`, 'utf16le').replace(/^\uFEFF/, '').split(/\r?\n/)).map((l) => l.split('\t')).filter((a) => a.length > 1).map(([k, ...v]) => [k, v.join('\t').trim()]));
const text = (id) => (typeof id === 'string' && id.startsWith('$') ? ucs[id.slice(1)] ?? '' : '');
const lua = (p) => p.replace(/\.lua$/i, '.rgd').replace(/\\/g, '/').replace(/^(data:?\/*)?(attrib\/)?/i, ''); // бывает с префиксом data\attrib\

/** Пробитие брони (%) по классам брони игры: пехота, тяжёлая пехота, лёгкая и бронетехника, титан (монстр), здание. */
const ARMOR = { inf: 'infantry_med', hinf: 'infantry_heavy_med', light: 'vehicle_low', veh: 'vehicle_med', titan: 'monster_high', struct: 'building_med', cmd: 'commander' };
function pierce(dmg) {
  const by = {};
  for (const e of entries(dmg[hash('armour_piercing_types')])) {
    const ref = JSON.stringify(e).match(/tp_([a-z_]+)\.lua/)?.[1], v = Object.values(e).find((x) => typeof x === 'number');
    if (ref) by[ref] = v;
  }
  const def = dmg[hash('armour_piercing')] ?? 0;
  return Object.fromEntries(Object.entries(ARMOR).map(([k, a]) => [k, by[a] ?? def]));
}
function weapon(path) {
  const t = parse(lua(path)), dmg = get(t, 'area_effect', 'weapon_damage', 'armour_damage') ?? {};
  return {
    file: path.replace(/^.*\\|\.lua$/g, ''), name: text(get(t, 'ui_info', 'screen_name_id')),
    range: get(t, 'max_range') ?? 0, minRange: get(t, 'min_range') ?? 0, reload: get(t, 'reload_time') ?? 1, accuracy: get(t, 'accuracy') ?? 1,
    min: dmg[hash('min_damage')] ?? 0, max: dmg[hash('max_damage')] ?? 0, pierce: dmg[hash('armour_piercing')] ?? 0, morale: dmg[hash('morale_damage')] ?? 0,
    setup: get(t, 'setup_time') ?? 0, moveAcc: get(t, 'accuracy_reduction_when_moving') ?? 0, // развёртывание (с) и потеря точности на ходу
    melee: !!get(t, 'melee_weapon'), aoe: get(t, 'area_effect', 'area_effect_information', 'radius') ?? 0, vs: pierce(dmg),
    cost: get(t, 'cost', 'cost', 'requisition') ?? 0, power: get(t, 'cost', 'cost', 'power') ?? 0, time: get(t, 'cost', 'time_seconds') ?? 0, // цена апгрейда ствола
    icon: get(t, 'ui_info', 'icon_name') ?? '', // кнопка ствола в панели отряда
    requires: [...new Set((JSON.stringify(get(t, 'requirements') ?? {}).match(/(research|addons|ebps\\\\races\\\\[a-z_]+\\\\structures)\\\\[a-z0-9_]+/gi) ?? []).map((r) => r.replace(/^.*\\/, '')))], // что нужно изучить или построить
  };
}

function entity(path) {
  const t = parse(lua(path)), cost = get(t, 'cost_ext', 'time_cost') ?? {};
  // в DoW каждая точка крепления стреляет сама — урон складывается; в точке несколько стволов на выбор (по апгрейдам), первый — базовый
  const hardpoints = [];
  const hps = get(t, 'combat_ext', 'hardpoints') ?? {}, nth = (o, p, i) => o?.[hash(p + String(i).padStart(2, '0'))];
  for (let i = 1; i <= 16; i++) {
    const hp = nth(hps, 'hardpoint_', i), list = [];
    if (!hp) continue;
    for (let j = 1; j <= 16; j++) {
      const w = nth(hp[hash('weapon_table')], 'weapon_', j);
      if (!w) continue;
      const p = w[hash('weapon')];
      if (p) try { list.push(weapon(p)); } catch { /* оружие из базовой игры — не в моде */ }
    }
    if (list.length) hardpoints.push(list);
  }
  // у части юнитов мода стволов в ebps нет (хормагаунт UA), хотя файл оружия под юнит лежит в weapon/ — берём его
  const own = path.replace(/^.*\\|\.lua$/gi, '').replace(/^([a-z]+)_/, '$1_melee_');
  if (!hardpoints.some((l) => l.some((w) => w.max > 0))) try { hardpoints.splice(0, hardpoints.length, [weapon(`weapon\\${own}.lua`)]); } catch { /* нет и такого */ }
  return {
    id: path.replace(/^.*\\|\.lua$/gi, ''), // имя юнита в моде: по нему модификаторы исследований находят цель
    name: text(get(t, 'ui_ext', 'ui_info', 'screen_name_id')), icon: get(t, 'ui_ext', 'ui_info', 'icon_name') ?? '',
    model: (JSON.stringify(t).match(/"((?:art(?:\\\\|\/))?races(?:\\\\|\/)[a-z_]+(?:\\\\|\/)(?:troops|structures)(?:\\\\|\/)[A-Za-z0-9_]+)"/i)?.[1] ?? '').replace(/\\\\/g, '/').replace(/^art\//i, '').toLowerCase(),
    hp: get(t, 'health_ext', 'hitpoints') ?? 0, armour: get(t, 'health_ext', 'armour') ?? 0, armourType: JSON.stringify(get(t, 'type_ext', 'type_armour') ?? '').match(/tp_([a-z_]+)/)?.[1] ?? '', regen: get(t, 'health_ext', 'regeneration_rate') ?? 0, // armourType — класс брони DoW: infantry_med, vehicle_high, monster_med…
    speed: get(t, 'moving_ext', 'speed_max') ?? 0, sight: get(t, 'sight_ext', 'sight_radius') ?? 0,
    cost: cost[hash('cost')]?.[hash('requisition')] ?? 0, power: cost[hash('cost')]?.[hash('power')] ?? 0, time: cost[hash('time_seconds')] ?? 0, hardpoints,
  };
}

/** Мораль отряда: максимум, восстановление в секунду, надлом (не меньше broken_min_time с и пока мораль ниже broken_min_morale) и что он делает (точность, скорость). */
function morale(m) {
  if (!m || !m[hash('max')]) return undefined;
  const mod = (name) => Object.values(m[hash('broken_modifiers')] ?? {}).find((v) => v && typeof v === 'object' && JSON.stringify(v).includes(name))?.[hash('value')];
  return { max: m[hash('max')], rate: m[hash('rate_per_second')] ?? 0, minTime: m[hash('broken_min_time')] ?? 0, minMorale: m[hash('broken_min_morale')] ?? 0,
    acc: mod('accuracy_weapon_modifier') ?? 1, speed: mod('speed_maximum_modifier') ?? 1 };
}

function squad(name) {
  const t = parse(`sbps/races/${R.race}/${name}.rgd`), lo = get(t, 'squad_loadout_ext') ?? {};
  const trooper = get(t, 'squad_loadout_ext', 'trooper_base', 'type');
  return { min: lo[hash('unit_min')] ?? 1, max: lo[hash('unit_max')] ?? 1, reinforce: get(t, 'squad_reinforce_ext', 'cost', 'cost', 'requisition') ?? 0,
    ups: get(t, 'squad_reinforce_ext', 'max_upgrades') ?? 0, // сколько бойцов отряда можно перевооружить
    morale: morale(get(t, 'squad_morale_ext')), // мораль отряда мода (у тиранидов её нет — бесстрашны)
    cap: get(t, 'squad_cap_ext', 'squad_cap_usage') ?? 0, support: get(t, 'squad_cap_ext', 'support_cap_usage') ?? 0, // сколько лимита пехоты и техники занимает отряд
    unit: entity(trooper) };
}

function building(name) {
  const t = parse(`ebps/races/${R.race}/structures/${name}.rgd`), e = entity(`ebps\\races\\${R.race}\\structures\\${name}.lua`);
  const refs = JSON.stringify(t).match(/research\\\\[a-z0-9_]+|sbps\\\\races\\\\[a-z_]+\\\\[a-z0-9_]+/gi) ?? [];
  const addons = [...new Set((JSON.stringify(get(t, 'addon_ext') ?? {}).match(/addons\\\\[a-z0-9_]+/gi) ?? []).map((r) => r.replace(/^.*\\/, '')))];
  return { ...e, spawns: [...new Set(refs.filter((r) => r.startsWith('sbps')).map((r) => r.replace(/^.*\\/, '')))], research: [...new Set(refs.filter((r) => r.startsWith('research')).map((r) => r.replace(/^.*\\/, '')))], addons, req: reqs2(get(t, 'requirement_ext', 'requirements')) };
}

// все отряды и здания расы; ключ — имя файла без префикса расы
const strip = (f) => f.replace(/\.rgd$/, '').replace(/^[a-z]+_squad_|^[a-z]+_/, '');
const list = (dir) => readdirSync(ROOT + dir).filter((f) => f.endsWith('.rgd') && !/ - |copia|backup/i.test(f));
const out = { squads: {}, buildings: {} };
for (const f of list(`sbps/races/${R.race}`)) try { out.squads[strip(f)] = squad(f.replace('.rgd', '')); } catch (e) { console.warn('отряд', f, e.message); }
for (const f of list(`ebps/races/${R.race}/structures`)) try { out.buildings[strip(f)] = building(f.replace('.rgd', '')); } catch (e) { console.warn('здание', f, e.message); }
// исследования, которые ведут здания расы: модификаторы (что, на сколько, умножить/прибавить, на кого), цена, время, требования
function research(name, dir = 'research') {
  const t = parse(`${dir}/${name}.rgd`), tc = get(t, 'time_cost') ?? {}, mods = [];
  for (const m of entries(get(t, 'modifiers'))) {
    const ref = Object.values(m).find((v) => typeof v === 'string' && /^modifiers\\/.test(v)) ?? '';
    if (!ref || /no_modifier/.test(ref)) continue;
    const usage = JSON.stringify(m[hash('usage_type')] ?? '');
    mods.push({ type: ref.replace(/^modifiers\\|_modifier\.lua$|\.lua$/g, ''), value: m[hash('value')] ?? 0, add: /addition/.test(usage), target: m[hash('target_type_name')] ?? '', on: (JSON.stringify(m[hash('application_type')] ?? '').match(/apply_to_([a-z_]+)\.lua/) ?? [])[1] ?? '' });
  }
  const reqs = JSON.stringify(get(t, 'requirements') ?? {}).match(/(research|addons|ebps\\\\races\\\\[a-z_]+\\\\structures)\\\\[a-z0-9_]+/gi) ?? [];
  return { name: text(get(t, 'ui_info', 'screen_name_id')), info: text(get(t, 'ui_info', 'help_text_list', 'text_01')) || text(get(t, 'ui_info', 'help_text_id')), icon: get(t, 'ui_info', 'icon_name') ?? '',
    cost: tc[hash('cost')]?.[hash('requisition')] ?? 0, power: tc[hash('cost')]?.[hash('power')] ?? 0, time: tc[hash('time_seconds')] ?? 0, requires: [...new Set(reqs.map((r) => r.replace(/^.*\\/, '')))], req: reqs2(get(t, 'requirements')), mods };
}
/** Требования мода по видам: построено здание, одно из двух зданий, есть аддон (у любого здания игрока или у этого), изучено исследование. ids — имена файлов мода. */
function reqs2(table) {
  const out = [];
  for (const e of entries(table)) {
    const vals = Object.values(e).filter((v) => typeof v === 'string'), type = vals.map((v) => v.match(/^requirements\\([a-z_]+)\.lua$/i)?.[1]).find(Boolean);
    if (!type || type === 'required_none') continue;
    const ids = vals.map((v) => v.match(/^(?:data\\attrib\\)?(?:ebps|addons|research)\\(?:.*\\)?([a-z0-9_]+)\.lua$/i)?.[1]).filter(Boolean);
    const t = { required_structure: 'structure', required_structure_either: 'either', global_required_addon: 'addon', local_required_addon: 'local_addon', local_required_addon_exclusive: 'no_local_addon', required_research: 'research', required_structure_ratio: 'structure' }[type] ?? type;
    if (ids.length) out.push({ t, ids });
  }
  return out;
}
out.research = {};
for (const [bk, b] of Object.entries(out.buildings)) for (const r of b.research) if (!out.research[r]) try { out.research[r] = { ...research(r), building: bk }; } catch (e) { console.warn('исследование', r, e.message); }
// аддоны зданий: покупаются у здания (в DoW — достройка), модификаторы и требования как у исследований
const addon = (name) => research(name, 'addons');
out.addons = {};
for (const [bk, b] of Object.entries(out.buildings)) for (const a of b.addons) if (!out.addons[a]) try { out.addons[a] = { ...addon(a), building: bk }; } catch (e) { console.warn('аддон', a, e.message); }
// требования отрядов (squad_requirement_ext) — отдельным проходом, чтобы не трогать squad()
for (const f of list(`sbps/races/${R.race}`)) { const k = strip(f); if (out.squads[k]) try { out.squads[k].req = reqs2(get(parse(`sbps/races/${R.race}/${f}`), 'squad_requirement_ext', 'requirements')); } catch { /* без требований */ } }
const file = join('shared', `ua-${process.argv[2] ?? 'tyranids'}.ts`);
writeFileSync(file, `// Сгенерировано tools/ua-race.mjs из ${R.title}. Не править руками.\nexport const ${R.name} = ${JSON.stringify(out, null, 1)} as const;\n`);
console.log('ok', file, Object.keys(out.squads).length, 'отрядов,', Object.keys(out.buildings).length, 'зданий,', Object.keys(out.research).length, 'исследований');
