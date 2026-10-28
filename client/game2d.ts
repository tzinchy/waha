// 2D-клиент матча на силуэтах дизайн-системы «Латунный Собор»: каждый юнит и здание — живой SVG из ds/assets,
// окрашенный палитрой art-* и анимированный классами lc-anim-* из bundle.css. Правил игры здесь нет: только снимки сервера и ввод.
import { World3D, has3d } from './world3d.ts';
import { UA_SCALE, uaArtIcon, uaIcon } from './models3d/ua-models.ts';
import { ARCHS, QUEUE_MAX, STRUCT_AOE, MELEE_GUARD, LVL2, VS, MIN_RANGE, armorOf, dmgOf, canFireGround, type Arch, type Armor, type DmgType } from '../shared/sim.ts';
import { armedStat, HERO_AT, UA_BASE, UA_SETUP, inherit, MOD_RACES, UA_WEAPONS, UA_ARM, UA_SQ, energyOf, uaMods, sightOf, trainEnergy, trainTime, type UAModsOf, uaMissing, UA_REQ, UA_ADDONS, type UAHave, UA_UPG, upOf, UA_RESEARCH, type UAResearch, NO_BUILD, GEN_CAP, genAnchor, SCAN, MEGA_SHOT, PLAGUE, TURRET_FAC, modOf, CLOSE, SETUP, TRIBUTE, PAIN, flies, resourceCost, DOOM_SHOT, DOOM_R, FIRE, UNLOCKS, isMelee, ROLES, popOf, GEAR, SQUADS, SIGHT_STRUCT, VEHICLES, LEGION_CAP, MOTOR_CAP, producible, ABILITIES, MAX_LVL, canLearn, xpNeed, CAP, ENERGY_COST, LEGEND_COST, POST_UP, BCELL, foot, footFree, snapB, wallCells, wallOk, RAGE_MAX, RESEARCH, RESEARCH_INFO, TIER_UP, researchCost, trainCost, KINDS, MAP, POINTS, POINT_R, REINFORCE_COST, RELICS, STATS, UPGRADES, VENTS, isStruct, maxHp, statOf, members, type Buildable, type Cmd, type Kind, type Snap } from '../shared/sim.ts';
import { BUILD_NAME, PX_PACK, ART_BASE, ARCH_OPTS, CAPTAIN_ART, DOOM_OF, FACTIONS, FACTION_IDS, HQ_NAME, PACK, PROD_NAME, ROSTER, archFor, type FactionId } from '../shared/factions.ts';
import type { LobbyPlayer } from '../shared/protocol.ts';
import { audio } from './audio.ts';
import { paintMap } from './mappaint.ts';
import { voice } from './voice.ts';
import { UA_SIZE } from './models3d/ua-sizes.ts';

const S = 26; // пикселей мира на единицу симуляции
/** Цвет выстрелов фракции: [трассер/огонь, луч/свечение] — чтобы с первого взгляда было видно, кто стреляет. */
const SHOT_COLOR: Record<FactionId, [string, string]> = { tyranids: ['#b6ff5a', '#ff9a3a'], inquisition: ['#ffb04a', '#9fd4ff'] };
/** Клавиша по физическому положению: при русской раскладке W остаётся «w», а не «ц» — камера и горячие клавиши работают в любой раскладке. */
const keyOf = (e: KeyboardEvent) => /^Key[A-Z]$/.test(e.code) ? e.code.slice(3).toLowerCase() : /^Digit\d$/.test(e.code) ? e.code.slice(5) : e.key.toLowerCase();
const $ = (id: string) => document.getElementById(id)!;

/** Ячейка сетки команд (пресет CommandGrid) и её подсказка (Tooltip). */
type Cell = { act: string; name: string; hot: string; icon?: string; art?: string; cost?: number; en?: number; rel?: number; ok?: boolean; info?: string; req?: string; done?: boolean; prog?: number; left?: number; cd?: number; cdMax?: number; active?: boolean; ult?: boolean; queue?: number };
const ico = (d: string) => `<svg viewBox="0 0 24 24" aria-hidden="true">${d}</svg>`;
/** Иконки команд из пресета CommandGrid (одна форма — один смысл). */
const ICON = {
  move: ico('<path d="M5 5l7 7-7 7M12 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="2"/>'),
  stop: ico('<path d="M8 3h8l5 5v8l-5 5H8l-5-5V8Z" fill="none" stroke="currentColor" stroke-width="2"/><path d="M8 11h8v2H8z" fill="currentColor"/>'),
  attack: ico('<path d="M5 19 17.5 6.5M14 4h6v6" fill="none" stroke="currentColor" stroke-width="2"/><path d="M4 14l6 6-2 2-6-6Z" fill="currentColor"/>'),
  build: ico('<path d="M2 21h20v-3h-3v-3h-3v-3h-2V3h-4v9H8v3H5v3H2Z" fill="none" stroke="currentColor" stroke-width="2"/>'),
  reinforce: ico('<path d="M12 2.5 20 5.5V12c0 4.6-3.3 8-8 9.5C7.3 20 4 16.6 4 12V5.5Z" fill="none" stroke="currentColor" stroke-width="2"/><path d="M11 8h2v8h-2zM8 11h8v2H8z" fill="currentColor"/>'),
  tier: ico('<path d="M12 2 22 12 12 22 2 12Z" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 7l4 5h-3v5h-2v-5H8Z" fill="currentColor"/>'),
  research: ico('<path d="M6 3h12M6 21h12M7 3c0 6 10 6 10 9S7 15 7 21M17 3c0 6-10 6-10 9s10 3 10 9" fill="none" stroke="currentColor" stroke-width="2"/>'),
};
const ABIL_ICON: Record<number, string> = {
  1: ico('<circle cx="12" cy="12" r="4" fill="currentColor"/><path d="M12 1v4M12 19v4M1 12h4M19 12h4M4 4l3 3M17 17l3 3M4 20l3-3M17 7l3-3" stroke="currentColor" stroke-width="2"/>'),
  3: ico('<path d="M3 12h12M11 6l6 6-6 6M19 5v14" fill="none" stroke="currentColor" stroke-width="2.4"/>'),
  4: ico('<path d="M12 3a9 9 0 1 1-9 9M12 7a5 5 0 1 1-5 5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M3 12l-2-3h4Z" fill="currentColor"/>'),
  5: ico('<path d="M12 1 15 10H9Z" fill="currentColor"/><path d="M12 10v8M5 21h14M7 17l5 4 5-4" fill="none" stroke="currentColor" stroke-width="2"/>'),
  7: ico('<path d="M5 4v16M5 4h12l-3 4 3 4H5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M9 7h2v3H9z" fill="currentColor"/>'),
  8: ico('<path d="M4 20h16M6 20V9l6-5 6 5v11" fill="none" stroke="currentColor" stroke-width="2"/><path d="M10 13h4v7h-4z" fill="currentColor"/>'),
};
const GEAR_ICON = [
  ico('<circle cx="12" cy="14" r="6" fill="currentColor"/><path d="M12 8V4h3" fill="none" stroke="currentColor" stroke-width="2"/>'),
  ico('<rect x="5" y="9" width="14" height="10" fill="currentColor"/><path d="M12 9V4M9 4h6" fill="none" stroke="currentColor" stroke-width="2"/>'),
  ico('<circle cx="8" cy="14" r="4" fill="currentColor"/><circle cx="15" cy="12" r="5" fill="currentColor" opacity=".7"/><circle cx="12" cy="8" r="3" fill="currentColor" opacity=".5"/>'),
];
const KIND_NAME: Partial<Record<Kind, string>> = { bomber: 'Бомбовоз «Большой Бадабум»', plague: 'Споровый улей', bell: 'Синаптический шпиль', hq: 'Штаб', barracks: 'Казарма', post: 'Реликварий', turret: 'Турель', foundry: 'Литейня', pump: 'Глубинный насос', wall: 'Стена', wallgate: 'Ворота', bunker: 'Крипта-бункер', mine: 'Мина' };
const hex = (c: number) => '#' + c.toString(16).padStart(6, '0');
const damageName: Record<DmgType, string> = { small: 'стрелковое', sniper: 'снайперское', heavy: 'противотанковое', melee: 'ближний бой', blast: 'взрывное' };
const armorName: Record<Armor, string> = { inf: 'пехота', hinf: 'тяжёлая пехота', light: 'лёгкая техника', veh: 'бронетехника', titan: 'титан', struct: 'здание', cmd: 'командир' };
const statNumber = (value: number) => String(Math.round(value * 100) / 100);
const weaponCounters = (type: DmgType, compact = false) => Object.entries(VS[type]).filter(([armor]) => !compact || ['inf', 'veh', 'struct'].includes(armor)).map(([armor, value]) => `${armorName[armor as Armor]} ×${statNumber(value)}`).join(' · ');
function weaponModInfo(faction: FactionId, kind: Kind) {
  const mod = modOf(faction, kind);
  if (!mod) return '';
  const aoe = ROLES[kind]?.aoe ?? STRUCT_AOE[kind] ?? mod.aoe;
  if (!mod.aoe || mod.aoe === aoe) return mod.info;
  return `Основное оружие: радиус поражения ${aoe} м.${mod.fire ? ' Поджигает землю.' : ''}${mod.freeze ? ` Останавливает цель на ${mod.freeze} с.` : ''}${mod.leech ? ` Лечит стрелка на ${statNumber(mod.leech * 100)}% урона.` : ''}`;
}
export const SLOT_COLORS = [0x4fa392, 0xe0675c, 0xe0a53a, 0xb9c3c6];

// какой силуэт из пресетов у какого юнита, его ширина в мире и сколько бойцов в отряде
// ширина силуэта в мире (единиц симуляции); сами силуэты — по фракции игрока (shared/factions.ts)
const WIDTH: Record<string, number> = { doom: 8, plague: 10, bell: 3.8, captain: 3.2, builder: 2.3, guard: 2.4, hq: 11, barracks: 8, post: 4.2, turret: 3.6, foundry: 6.5, pump: 4.4, key1: 6, key2: 6.5, key3: 6.5, key4: 7, gate: 9, motorpool: 9, yard: 14, legend: 6, wall: 3.4, wallgate: 4.6, bunker: 5.5, mine: 1.6 };
/** Ширина силуэта на карте = рост в метрах (все силуэты дизайн-системы в одном поле 120×164): Стражник 2.4 м, титан — 26–34 м. */
/** Модель мода, как её рисует World3D (UA_SCALE): [ширина, высота] в метрах игры или undefined (нет модели). */
const uaSize = (kind: Kind, f: FactionId) => { const z = MOD_RACES[f as keyof typeof MOD_RACES] ? UA_SIZE[`${f}/${kind}`] : undefined; return z && ([z[0] * UA_SCALE, z[1] * UA_SCALE] as const); };
const widthOf = (kind: Kind, f: FactionId) => uaSize(kind, f)?.[0] ?? (kind === 'titan' ? ROSTER[f].titanM : kind === 'turret' && f === 'tyranids' ? 5.4 : ROLES[kind]?.meters && !WIDTH[kind] ? ROLES[kind]!.meters : WIDTH[kind] ?? 2.4);
/** Постройки, нарисованные для каждой фракции (tools/sprites.py); у Ордена — исходные из дизайн-системы. */
const FAC_BUILD = new Set<Kind>(['key1', 'key2', 'key3', 'key4', 'gate', 'foundry', 'pump', 'wall', 'wallgate', 'bunker', 'mine']);
const NEUTRAL: Partial<Record<Kind, [string, string]>> = {
  plague: ['Buildings/banner.svg', 'Buildings/banner.svg'],
  bell: ['Buildings/beacon.svg', 'Buildings/beacon.svg'],
  wall: ['Defenses/wall.svg', 'Defenses/wall.svg'], wallgate: ['Defenses/gate.svg', 'Defenses/gate.svg'], bunker: ['Defenses/bunker.svg', 'Defenses/bunker.svg'], mine: ['Defenses/mine.svg', 'Defenses/mine.svg'],
  key1: ['Buildings/scriptorium.svg', 'Buildings/scriptorium.svg'], key2: ['Buildings/forge.svg', 'Buildings/forge.svg'], key3: ['Buildings/observatory.svg', 'Buildings/observatory.svg'],
  key4: ['Buildings/reliqhall.svg', 'Buildings/reliqhall.svg'], gate: ['Buildings/gate.svg', 'Buildings/gate.svg'], post: ['Defenses/point-1.svg', 'Defenses/point-2.svg'], foundry: ['Buildings/foundry.svg', 'Buildings/foundry.svg'], pump: ['Buildings/pump.svg', 'Buildings/pump.svg'] };
/** Путь к силуэту юнита: по фракции, уровню и (у капитана) оружию. */
export function artFor(kind: Kind, faction: FactionId, lvl = 1, arch: Arch = 'commander', variant = 0) {
  if (has3d(kind)) { const icon = uaIcon(kind, variant, faction); if (icon) return icon; } // иконка расы из мода (data:-URL), если мод распакован
  if (UA_BASE[kind]) return artFor(UA_BASE[kind]!, faction, lvl, arch); // отряд UA сверх ролей: пока иконка мода не загрузилась — силуэт базового вида
  const a = FACTIONS[faction].art;
  if (kind === 'legend') return FACTIONS[faction].legendArt[variant] ?? FACTIONS[faction].legendArt[0];
  if (kind === 'doom') return DOOM_OF[faction].art;
  if (kind === 'bomber') return artFor('jet', faction); // свой портрет пока не нарисован
  if (kind in ROSTER[faction] && typeof (ROSTER[faction] as Record<string, unknown>)[kind] === 'object') return ROSTER[faction][kind as 'sniper'].art;
  if (kind === 'captain') return CAPTAIN_ART[faction][archFor(faction, arch)] ?? a.captain[0];
  if (kind === 'turret') return a.turret[lvl > 1 ? 1 : 0];
  if (kind === 'post') return lvl >= 3 ? 'Defenses/point-3.svg' : lvl === 2 ? 'Defenses/point-2.svg' : 'Defenses/point-1.svg';
  const af = ART_BASE[faction] ?? faction; // у новых рас — здания старшей расы, перекрашенные палитрой .pal-<фракция>
  if (af !== 'order' && FAC_BUILD.has(kind) || kind === 'motorpool' || kind === 'yard') return `Buildings/${af}/${kind}.svg`; // свои постройки у каждой фракции
  if (NEUTRAL[kind]) return NEUTRAL[kind]![lvl > 1 ? 1 : 0];
  return a[kind as 'builder' | 'guard' | 'hq' | 'barracks'];
}
const FORM: Partial<Record<Kind, [number, number][]>> = {
  guard: [[0.8, 0.1], [0, -0.5], [0, 0.6], [-0.8, -0.2], [-0.8, 0.7]], // плотный строй, как в карточке LivingSquads
  sniper: [[0.4, -0.3], [-0.5, 0.4]], heavy: [[0.7, 0], [-0.2, -0.6], [-0.4, 0.6]], support: [[0.3, -0.3], [-0.4, 0.4]], elite: [[0.8, 0], [-0.3, -0.7], [-0.4, 0.7]],
  builder: [[0.3, -0.4], [-0.3, 0.4]],
};
inherit(FORM);

const svgCache = new Map<string, string>();
/** Загружает все силуэты один раз. */
const ALL_ART = new Set<string>([...Object.values(DOOM_OF).map(d => d.art), ...Object.values(CAPTAIN_ART).flatMap(o => Object.values(o)), ...Object.values(ROSTER).flatMap(r => Object.values(r).flatMap(v => (typeof v === 'object' ? [v.art] : []))), ...Object.values(FACTIONS).flatMap(f => [...f.legendArt, ...f.art.captain, f.art.builder, f.art.guard, f.art.hq, f.art.barracks, ...f.art.turret]), ...(Object.values(NEUTRAL) as [string, string][]).flat(), ...(['ashen'] as const).flatMap(f => [...FAC_BUILD].map(k => `Buildings/${f}/${k}.svg`)), ...Object.keys(FACTIONS).flatMap(f => [`Buildings/${f}/motorpool.svg`, `Buildings/${f}/yard.svg`]), 'Defenses/point-3.svg', 'Buildings/reliquary.svg']);
export const ready2d = Promise.all([...ALL_ART].filter(p => !p.startsWith('px/')) // px/… — атлас, а не SVG-файл
  .map(p => fetch('/ds/assets/' + p).then(r => r.text()).then(t => svgCache.set(p, t)))).then(() => pxLoad); // и метаданные атласов (размер кадра, опора)

/** Вставляет силуэт как живой SVG: класс lc-art красит его палитрой, lc-anim-* анимирует. */
export function art(path: string, widthPx: number) {
  const wrap = document.createElement('div');
  wrap.className = 'art';
  wrap.innerHTML = svgCache.get(path) ?? '';
  const svg = wrap.querySelector('svg')!;
  svg.removeAttribute('width'); svg.removeAttribute('height');
  svg.classList.add('lc-art', 'lc-anim-idle');
  if (!svg.querySelector('.legL, .arm, .body')) svg.classList.add('norig'); // без разметки частей — анимируем фигуру целиком
  svg.style.width = widthPx + 'px';
  svg.style.animationDelay = svg.style.getPropertyValue('--d');
  for (const el of svg.querySelectorAll<SVGElement>('*')) el.style.animationDelay = `${-Math.random() * 2}s`; // отряды не дышат в унисон
  return wrap;
}
export const setAnim = (svg: SVGElement, a: string) => {
  if (svg.dataset.anim === a) return;
  svg.classList.remove('lc-anim-' + (svg.dataset.anim ?? 'idle'));
  svg.classList.add('lc-anim-' + a);
  svg.dataset.anim = a;
};

/** Атласы пакета faction-asset-lab: 8 строк направлений × 8 кадров. Размер кадра, опорная точка и рамка фигуры — из JSON атласа,
 *  поэтому новые модели подхватываются заменой файлов в client/public/models/factions/<пакет>/<роль>/sprites (idle.json + *.webp). */
type PxRole = 'scout' | 'captain' | 'guard' | 'builder' | 'sniper' | 'heavy' | 'elite' | 'medic' | 'flamer' | 'transport' | 'walker' | 'tank' | 'artillery' | 'titan' | 'flyer' | 'aircraft'
  | 'hq' | 'barracks' | 'factory' | 'armory' | 'generator' | 'relic' | 'post' | 'turret' | 'wall' | 'gate';
/** Постройки с атласом: пока атлас не запечён, здание рисуется прежним векторным силуэтом. */
const PX_STRUCT = new Set<PxRole>(['hq', 'barracks', 'factory', 'armory', 'generator', 'relic', 'post', 'turret', 'wall', 'gate']);
/** Вид юнита → роль атласа. Поддержки (support) в пакете нет — у неё остаётся векторный силуэт. */
const PX_ROLE: Partial<Record<Kind, PxRole>> = { hq: 'hq', barracks: 'barracks', motorpool: 'factory', yard: 'factory', key1: 'armory', key2: 'armory', key3: 'armory', key4: 'armory', foundry: 'generator', pump: 'generator', post: 'post', turret: 'turret', wall: 'wall', wallgate: 'gate', gate: 'relic', captain: 'captain', guard: 'guard', builder: 'builder', sniper: 'sniper', heavy: 'heavy', elite: 'elite', healer: 'medic', lveh: 'transport', mveh: 'walker', hveh: 'tank', arty: 'artillery', titan: 'titan', air: 'flyer', jet: 'aircraft', bomber: 'aircraft' };
inherit(PX_ROLE);
export const pxRole = (k: Kind, _f: FactionId): PxRole | undefined => PX_ROLE[k];
export const isPx = (k: Kind, f?: FactionId): boolean => { const r = PX_ROLE[k]; return !!r && (!PX_STRUCT.has(r) || (!!f && PX_META.has(pxKey(f, r)))); }; // здания — только когда их атлас уже есть
/** Данные атласа из idle.json: кадр, опора, рамка фигуры (лицом к зрителю) — для масштаба, полосы здоровья и иконок. */
type PxMeta = { cell: number; ax: number; ay: number; bx: number; by: number; bw: number; bh: number; ext: string };
/** Старые атласы (кадр 128, без рамки в JSON): верх и ширина фигуры, измеренные по idle. */
const PX_OLD: Partial<Record<PxRole, [number, number]>> = { captain: [30, 34], guard: [43, 38], builder: [50, 23], sniper: [43, 42], heavy: [45, 42], elite: [30, 42], medic: [45, 34], flamer: [45, 38], transport: [45, 40], walker: [45, 36], tank: [43, 42], artillery: [32, 45], titan: [27, 56] };
const PX_VEH = new Set<PxRole>(['transport', 'walker', 'tank', 'artillery', 'titan']);
const pxOld = (r: PxRole): PxMeta => { const [top, w] = PX_OLD[r] ?? [30, 60], ay = PX_VEH.has(r) ? 78 : 87; return { cell: 128, ax: 64, ay, bx: 64 - w / 2, by: top, bw: w, bh: ay - top, ext: 'png' }; };
const PX_META = new Map<string, PxMeta>();
const pxKey = (f: FactionId, r: PxRole) => `${PX_PACK[f] ?? f}/${r}`; 
export const pxMeta = (f: FactionId, r: PxRole): PxMeta => PX_META.get(pxKey(f, r)) ?? pxOld(r);
const pxLoad = Promise.all([...FACTION_IDS.flatMap(f => [...new Set([...Object.values(PX_ROLE), 'flamer'] as PxRole[])].map(r => [f, r] as const))].map(([f, r]) =>
  fetch(`/models/factions/${pxKey(f, r)}/sprites/idle.json`).then(res => (res.ok ? res.json() : null)).then(j => {
    if (!j) return;
    const b = (j.frames?.[1]?.[0] ?? j.frames?.[0]?.[0])?.bbox, ext = String(j.image ?? 'idle.png').split('.').pop()!;
    if (!b) return PX_META.set(pxKey(f, r), { ...pxOld(r), ext }); // старый атлас: рамки нет — прежние размеры
    PX_META.set(pxKey(f, r), { cell: j.cellWidth, ax: j.anchor.x, ay: j.anchor.y, bx: b.x, by: b.y, bw: b.w, bh: b.h, ext });
  }).catch(() => undefined))).then(() => undefined);
/** Масштаб на экране: фигура шириной с юнита в игре (у пехоты — силуэт отряда). */
const pxScale = (k: Kind, f: FactionId, r: PxRole) => (widthOf(k, f) * S) / Math.max(8, pxMeta(f, r).bw);
const PX_DUR: Record<string, number> = { idle: 2, walk: 1, run: 0.65, attack: 0.7, shoot: 0.45, work: 1.1, death: 1.1 };
export const pxUrl = (f: FactionId, role: PxRole, anim: string) => `/models/factions/${PX_PACK[f] ?? f}/${role}/sprites/${anim}.${pxMeta(f, role).ext}`;
/** Строка атласа по направлению на экране (рад, y вниз): строка 0 смотрит вниз-влево, дальше по 45° против часовой. */
export const pxRow = (face: number) => (((Math.round((135 - (face * 180) / Math.PI) / 45) % 8) + 8) % 8);
type Px = { el: HTMLElement; anim: string; t0: number; ph: number; role: PxRole; sc: number; cell: number; ax: number; ay: number; top: number };
function pxSprite(f: FactionId, role: PxRole, sc: number): Px {
  const el = document.createElement('div'), m = pxMeta(f, role), w = m.cell * sc;
  Object.assign(el.style, { position: 'absolute', left: -m.ax * sc + 'px', top: -m.ay * sc + 'px', width: w + 'px', height: w + 'px', backgroundSize: `${w * 8}px ${w * 8}px`, pointerEvents: 'none', filter: 'drop-shadow(0 3px 2px rgba(0,0,0,.55))' });
  return { el, anim: '', t0: 0, ph: Math.random() * 2, role, sc, cell: m.cell, ax: m.ax, ay: m.ay, top: m.by };
}
/** Кадр: строка — по направлению, столбец — по времени; смерть играется один раз и замирает на последнем кадре. */
function pxFrame(p: Px, f: FactionId, anim: string, face: number, now: number, frac?: number) { // frac — кадр по доле (стройка растёт по готовности)
  if (p.anim !== anim) { p.anim = anim; p.t0 = now; p.el.style.backgroundImage = `url(${pxUrl(f, p.role, anim)})`; }
  const t = (now - p.t0) / 1000, d = PX_DUR[anim] ?? 1, w = p.cell * p.sc;
  const col = frac !== undefined ? Math.min(7, Math.floor(frac * 8)) : anim === 'death' ? Math.min(7, Math.floor((t / d) * 7)) : Math.floor(((t + (anim === 'idle' ? p.ph : 0)) / d) * 8) % 8;
  p.el.style.backgroundPosition = `${-col * w}px ${-pxRow(face) * w}px`;
}
/** Статичный кадр атласа как SVG (для HUD и лобби): idle, лицом к зрителю. viewBox — квадрат вокруг фигуры (head — верхняя треть, портрет). */
export const pxIcon = (f: FactionId, role: PxRole, head = false) => {
  const m = pxMeta(f, role), n = Math.max(m.bw, m.bh) * (head ? 0.55 : 1) + 6, cx = m.bx + m.bw / 2, y0 = m.cell + (head ? m.by - 2 : m.by + m.bh / 2 - n / 2);
  return `<svg class="lc-art" viewBox="${cx - n / 2} ${y0} ${n} ${n}" style="overflow:hidden"><image href="${pxUrl(f, role, 'idle')}" width="${m.cell * 8}" height="${m.cell * 8}"/></svg>`;
};
/** Путь силуэта → пиксельный атлас (капитаны всех сборок, стрелки, строители). */
const PX_BY_ART = new Map<string, [FactionId, PxRole]>(FACTION_IDS.flatMap(f => [[FACTIONS[f].art.guard, [f, 'guard']], [FACTIONS[f].art.builder, [f, 'builder']], ...Object.values(CAPTAIN_ART[f]).map(p => [p, [f, 'captain']]),
  ...(Object.keys(PX_ROLE) as Kind[]).filter(k => ROSTER[f][k as 'sniper']?.art).map(k => [ROSTER[f][k as 'sniper'].art, [f, pxRole(k, f)]])] as [string, [FactionId, PxRole]][])); // и весь состав армии

/** SVG капитана по оружию (Меч — Штурм, Молот — Командор), для превью в редакторе. */
export const captainSvg = (a: Arch, f: FactionId = 'tyranids') => { const p = artFor('captain', f, 1, a); return p.startsWith('data:') ? uaImg(p) : svgCache.get(p) ?? ''; };
/** Чужой силуэт (Ордена) у другой фракции — перекрасить в её цвета. */
export const needsTint = (path: string, _f: FactionId) => path.startsWith('Units/');
/** Маленький силуэт для HUD: живой SVG, чтобы палитра art-* применилась. */
/** Кратко, что даёт исследование UA, если у него нет текста. */
const MOD_RU: Record<string, string> = { health_maximum: 'здоровье', max_damage_weapon: 'урон', speed_maximum: 'скорость', max_range_weapon: 'дальность', health_regeneration: 'регенерация', armour: 'броня', max_troopers_squad: 'бойцов в отряде', income_requisition_player: 'влияние', income_power_player: 'энергия', production_speed: 'скорость найма', health_meleedamage_received: 'урон в рукопашной по ним' };
const uaModsInfo = (x: UAResearch) => [...new Set(x.mods.filter(m => MOD_RU[m.type]).map(m => `${MOD_RU[m.type]} ${m.add ? '+' + +m.value.toFixed(2) : '×' + +m.value.toFixed(2)}`))].join(', ') || 'особое улучшение';
export const uaImg = (path: string) => `<svg class="lc-art" viewBox="0 0 64 64"><image href="${path}" width="64" height="64"/></svg>`; // в svg — чтобы HUD задавал размер, как у остальных силуэтов
const miniArt = (path: string) => (path.startsWith('data:') ? uaImg(path) : PX_BY_ART.has(path) ? pxIcon(...PX_BY_ART.get(path)!) : (svgCache.get(path) ?? '').replace('<svg ', '<svg class="lc-art" '));
/** Портрет: голова и плечи силуэта крупно (обрезка viewBox у фигур 120×164). */
const portrait = (path: string) => (path.startsWith('data:') ? uaImg(path) : PX_BY_ART.has(path) ? pxIcon(...PX_BY_ART.get(path)!, true) : miniArt(path).replace(/viewBox="0 -12 120 164"/, 'viewBox="14 -10 92 92"'));

/** Буквы точек на карте и в полосе очков: [0] — критическая. */
const PT_LETTERS = ['Д', 'А', 'В', 'Б', 'Г', 'Е', 'Ж', 'З', 'И', 'К', 'Л', 'М', 'Н', 'О', 'П', 'Р', 'С'];
/** Карта на языке пресета MapExample (классы lc-bigmap из bundle.css), в координатах мира. Пока декор: проходимость не меняет. */
function mapSvg() {
  const k = S, W = MAP.w * k, H = MAP.h * k, P = (x: number, y: number) => `${x * k} ${y * k}`;
  const diamond = (x: number, y: number, r = 1.2) => `M${P(x, y - r)}L${P(x + r, y)}L${P(x, y + r)}L${P(x - r, y)}Z`;
  const star = (x: number, y: number, r: number) => { let d = ''; for (let i = 0; i < 16; i++) { const a = (i / 16) * Math.PI * 2, rr = i % 2 ? r * 0.55 : r; d += (i ? 'L' : 'M') + P(x + Math.sin(a) * rr, y - Math.cos(a) * rr); } return d + 'Z'; };
  const letters = PT_LETTERS;
  const pts = POINTS.map(([x, y], i) => i === 0
    ? `<path class="pt-crit" d="${star(x, y - POINT_R - 2.2, 1.6)}"/><text class="t t-on" x="${x * k}" y="${(y - POINT_R - 1.8) * k}" style="font-size:22px">II</text>`
    : `<path class="pt-inf" d="${diamond(x, y - POINT_R - 2)}"/><text class="t" x="${x * k}" y="${(y - POINT_R - 1.6) * k}" style="font-size:22px">${letters[i]}</text>`).join('');
  return `<svg class="lc-bigmap" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" style="position:absolute;left:0;top:0;pointer-events:none;background:none">${pts}</svg>`; // метки точек поверх текстуры
}

type View = {
  id: number; owner: number; kind: Kind; el: HTMLElement; body: HTMLElement; svgs: SVGElement[]; bar: HTMLElement; fg: HTMLElement; sel: HTMLElement;
  x: number; y: number; tx: number; ty: number; f: number; hp: number; build: number; q: number; dead: boolean; lvl: number; upg: number;
  hero?: { lvl: number; xp: number; pts: number; abil: number; cd: number[] }; // у героя — свой прогресс (из снимка, 25+)
  atkUntil: number; shotAt?: number; lvl3d?: number; melee?: boolean; atkFx?: number; respawn?: number; arch?: Arch; aim?: number; gear: number; ch: number[]; gcd: number; sh: number; frozen: number; carry: number; rise: number; off: boolean; dome?: HTMLElement; shBar?: HTMLElement; artPath: string; px: Px[]; prog: number; prod: number;
};

const MELEE_W = /melee|hammerhand|halberd|knife|fist|claw|talon|sword|staff|dummy/;
/** Выстрел рас UA, когда у ствола нет эффектов мода (они из оригинальной DoW, её в ua/ нет): снаряд от ствола к цели по классу оружия.
 *  Эффекты мода (art/fx по событиям .whe и попаданиям оружия) рисует world3d — World3D.fire. */
function uaShot(weapons: string[], X1: number, Y1: number, X2: number, Y2: number, dist: number) {
  const w = weapons.find(x => x && !MELEE_W.test(x)) ?? weapons[0] ?? '', t = Math.min(0.45, 0.08 + dist * 0.006).toFixed(2), path = `M${X1} ${Y1} L${X2} ${Y2}`;
  const fly = (cls: string, r: number, n: number, gap: number, p = path) => Array.from({ length: n }, (_, i) =>
    `<circle class="${cls}" r="${r}" opacity="0"><set attributeName="opacity" to="1" begin="${(i * gap).toFixed(2)}s"/><animateMotion dur="${t}s" begin="${(i * gap).toFixed(2)}s" fill="freeze" path="${p}"/><set attributeName="opacity" to="0" begin="${(+t + i * gap).toFixed(2)}s"/></circle>`).join('');
  const muzzle = `<circle class="w2d-muzzle" cx="${X1}" cy="${Y1}" r="4"/>`, hit = (r: number, late = +t) => `<circle class="w2d-boomcore" cx="${X2}" cy="${Y2}" r="${r}" style="animation-delay:${late}s"/>`;
  if (/flame|incinerator|bioplasma|burna/.test(w)) return `<path class="w2d-fire" d="M${X1} ${Y1} Q${(X1 + X2) / 2} ${(Y1 + Y2) / 2 - 18} ${X2} ${Y2}"/>`;
  if (/missile|launcher|whirlwind|biovore|spore|cannon_(?!twin)|battle_cannon|inferno/.test(w) && dist > 12) { const arc = `M${X1} ${Y1} Q${(X1 + X2) / 2} ${Math.min(Y1, Y2) - 40 - dist * 2} ${X2} ${Y2}`; return muzzle + fly('w2d-shellball', 4, 1, 0, arc) + `<circle class="w2d-boom" cx="${X2}" cy="${Y2}" r="${2 + dist * 0.06}" style="animation-delay:${t}s"/>`; }
  if (/las|plasma|psy|melta|multi_melta|conversion/.test(w)) return muzzle + fly('w2d-energy', 3.5, /twin|psycannon/.test(w) ? 2 : 1, 0.07) + hit(6);
  if (/devourer|fleshborer|spine|deathspitter|venom|barbed|strangler|spinefist|bio|tyranid/.test(w)) return fly('w2d-spit', 3, 3, 0.06) + hit(4);
  return muzzle + fly('w2d-slug', 2.2, /heavy|assault|auto|hurricane|storm/.test(w) ? 4 : 2, 0.05) + hit(3); // болтеры и всё прочее: очередь трассеров
}

export class Game {
  private world = document.createElement('div');
  private under = document.createElement('div'); // земля и туман — под 3D-слоем
  private w3d = new World3D();                     // живые модели (faction-asset-lab)
  private ground = document.createElement('div');
  private fx = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  private views = new Map<number, View>();
  private sel = new Set<number>();
  private cam = { x: 50, y: 50, zoom: 1 };
  private keys = new Set<string>();
  private points: { ring: HTMLElement; fill: HTMLElement; el: HTMLElement; zone: HTMLElement }[] = [];
  private pointOwner: number[] = [];
  private shots: { el: SVGElement; until: number }[] = [];
  private ghost = document.createElement('div');
  private wallGhost = document.createElement('div'); // клетки протяжки стены
  private wallGhostHtml = '';
  private wallLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  private place: Buildable | null = null;
  private drag: { x0: number; y0: number; x1: number; y1: number } | null = null;
  private mouse: { x: number; y: number } | null = null;
  private amove = false;
  private moveMode = false;
  private pan: { x: number; y: number } | null = null;
  private throwG = -1;
  private stopCd = 0;
  private unlock = 0; private doomPct = 0; private scanCd = 0;
  private strikeEls = new Map<string, HTMLElement>();
  private megaSeen = new Set<number>();
  private megaMini = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  private fogCv = document.createElement('canvas');
  private miniFog = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  private mapTex: HTMLCanvasElement | null = null;
  private aimRing = document.createElement('div');
  private qk: Record<number, number[]> = {};
  private smokes: HTMLElement[] = [];
  private centered = false;
  private ended = false;
  private req = 0;
  private tier = 1;
  private energy = 0;
  private relics = 0;
  private research = 0;
  private cap = { lvl: 1, xp: 0, pts: 0, abil: 0, cd: [] as number[] };
  private treeOpen = false; // в панели команд героя открыто его дерево прокачки
  private mini = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  private miniCam = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  private miniPing = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  private snapN = 0;
  private lastAlert = 0;
  private cmdHtml = '';
  private raf = 0;
  private t0 = performance.now();
  private ac = new AbortController();

  constructor(
    private root: HTMLElement, private slot: number /* −1 — зритель, в т.ч. выбывший */, private players: LobbyPlayer[],
    private send: (c: Cmd) => void, private onEnd: (winner: number) => void,
  ) {
    root.classList.add('w2d');
    document.body.classList.toggle('spectating', slot < 0); // режим просмотра: без тумана и команд
    if (slot < 0) { this.cam.x = MAP.w / 2; this.cam.y = MAP.h / 2; this.cam.zoom = 0.6; this.centered = true; }
    this.world.className = 'w2d-world';
    this.ground.className = 'w2d-ground';
    Object.assign(this.ground.style, { width: MAP.w * S + 'px', height: MAP.h * S + 'px' });
    this.fx.classList.add('w2d-fx');
    this.fx.setAttribute('width', String(MAP.w * S)); this.fx.setAttribute('height', String(MAP.h * S));
    this.ghost.className = 'w2d-ghost hidden';
    this.wallLine.classList.add('w2d-wallline');
    this.wallLine.setAttribute('visibility', 'hidden');
    this.fx.append(this.wallLine);
    this.fogCv.width = 320; this.fogCv.height = Math.round(320 * MAP.h / MAP.w); this.fogCv.className = 'w2d-fog'; // пропорции карты: на прямоугольной карте круги обзора не плющатся
    Object.assign(this.fogCv.style, { width: MAP.w * S + 'px', height: MAP.h * S + 'px' });
    this.aimRing.className = 'w2d-aim'; this.aimRing.style.display = 'none';
    this.under.className = 'w2d-world';
    this.under.append(this.ground, this.fogCv);
    this.world.append(this.fx, this.ghost, this.wallGhost, this.aimRing);
    root.prepend(this.world); root.prepend(this.w3d.canvas); root.prepend(this.under); // снизу вверх: земля и туман → модели → полосы, кольца, выстрелы
    this.buildMap();
    this.buildMini();
    this.bind();
    this.raf = requestAnimationFrame(this.frame);
    audio.setBattle(true);
    $('hud-players').innerHTML = players.map((p, i) => `<div id="hp${i}"><i style="background:${hex(SLOT_COLORS[i])}"></i>${p.name.replace(/[<>&]/g, '')}</div>`).join('');
  }

  /** Перейти в режим зрителя: вся карта, без тумана и команд (после поражения или конца матча). */
  watch() {
    this.slot = -1; this.sel.clear();
    document.body.classList.add('spectating');
    $('hud-out').classList.add('hidden');
    this.renderCmd();
  }

  destroy() {
    $('hud-out').classList.add('hidden');
    document.body.classList.remove('spectating');
    audio.setBattle(false);
    cancelAnimationFrame(this.raf);
    this.ac.abort();
    this.world.remove(); this.under.remove(); this.w3d.dispose();
    this.root.classList.remove('w2d');
  }

  // ---------- карта ----------
  private buildMap() {
    const tex = (this.mapTex = paintMap()); // текстура земли масштабируется браузером со сглаживанием
    Object.assign(tex.style, { position: 'absolute', left: '0', top: '0', width: MAP.w * S + 'px', height: MAP.h * S + 'px', imageRendering: 'auto' });
    this.ground.append(tex);
    this.ground.insertAdjacentHTML('beforeend', mapSvg());
    // Three distinct capture-site silhouettes and a command/capture animation layer.
    if (!this.root.querySelector('#waha-capture-style')) {
      const style = document.createElement('style');
      style.id = 'waha-capture-style';
      style.textContent = `
        .w2d-point.capture-normal { --capture-accent: #a6c9c0; }
        .w2d-point.capture-relic { --capture-accent: #eac16e; }
        .w2d-point.capture-key { --capture-accent: #ff8266; }
        .w2d-point.capture-normal, .w2d-point.capture-relic, .w2d-point.capture-key { border-color:var(--capture-accent); }
        .w2d-point.capture-relic::after, .w2d-point.capture-key::after {
          content:'';position:absolute;inset:12%;border:3px solid var(--capture-accent);
          border-radius:50%;animation:waha-site-idle 3s ease-in-out infinite;pointer-events:none;
        }
        .w2d-point.capture-key::after { border-radius:15%;transform:rotate(45deg); }
        .w2d-point.capture-active { animation:waha-capture-active .8s ease-in-out infinite alternate; }
        .w2d-point.capture-commanded::before {
          content:'';position:absolute;inset:-12%;border:5px dashed #f5e4ac;border-radius:50%;
          animation:waha-capture-command 1.25s linear infinite;pointer-events:none;
        }
        .w2d-point.capture-complete { animation:waha-capture-done .7s ease-out 2; }
        @keyframes waha-site-idle { 0%,100%{opacity:.3;scale:.96}50%{opacity:.85;scale:1.05} }
        @keyframes waha-capture-active {from{filter:drop-shadow(0 0 2px var(--capture-accent))}to{filter:drop-shadow(0 0 15px var(--capture-accent))}}
        @keyframes waha-capture-command {to{transform:rotate(360deg)}}
        @keyframes waha-capture-done {50%{filter:brightness(2.5);scale:1.14}}
        @media(prefers-reduced-motion:reduce){.w2d-point.capture-active,.w2d-point.capture-commanded::before,.w2d-point.capture-complete,.w2d-point.capture-relic::after,.w2d-point.capture-key::after{animation:none}}
      `;
      this.root.append(style);
    }
    for (const [x, y] of VENTS) this.w3d.vent(x, y, 4.5); // жилы под термогенератор — в 3D, как slag deposit в Soulstorm
    [...POINTS, ...RELICS].forEach(([x, y], i) => {
      const relic = i >= POINTS.length;
      const ring = document.createElement('div'), fill = document.createElement('div');
      ring.className = 'w2d-point ' + (i === 0 ? 'capture-key' : relic ? 'capture-relic' : 'capture-normal'); fill.className = 'w2d-point-fill';
      ring.title = i === 0 ? 'Ключевая точка' : relic ? 'Реликтовая точка' : 'Стратегическая точка';
      for (const e of [ring, fill]) Object.assign(e.style, { left: (x - POINT_R) * S + 'px', top: (y - POINT_R) * S + 'px', width: POINT_R * 2 * S + 'px', height: POINT_R * 2 * S + 'px' });
      const el = document.createElement('div'); // вместо картинки — 3D-флагшток на платформе (как в Soulstorm)
      this.w3d.point(i, x, y, i === 0 ? 'key' : relic ? 'relic' : 'normal', i === 0 ? 7 : relic ? 5 : 5.5);
      ring.classList.toggle('relic', relic);
      this.ground.append(ring, fill);
      const zone = document.createElement('div'); zone.className = 'w2d-zone' + (i === 0 ? ' crit' : ''); // территория точки: тут ставят турели и генераторы
      const zr = i === 0 ? 12 : 14;
      Object.assign(zone.style, { left: (x - zr) * S + 'px', top: (y - zr) * S + 'px', width: zr * 2 * S + 'px', height: zr * 2 * S + 'px' });
      this.ground.insertBefore(zone, ring);
      this.points.push({ ring, fill, el, zone });
    });
  }

  /** Ставит элемент в мир ногами в точку (x, y); глубина — по y. */
  private place2(el: HTMLElement, x: number, y: number) {
    el.classList.add('w2d-ent');
    el.style.transform = `translate(${x * S}px, ${y * S}px)`;
    el.style.zIndex = String(Math.round(y * 10));
    this.world.append(el);
    return el;
  }

  // ---------- юниты ----------
  private mk(id: number, owner: number, kind: Kind, x: number, y: number, variant = 0, arch?: Arch): View {
    const el = document.createElement('div');
    el.className = 'w2d-unit ' + (owner === this.slot ? 'ally' : 'enemy');
    el.style.setProperty('--team', owner === this.slot ? 'var(--verdigris-500)' : 'var(--blood-300)'); // союзник патина, враг кровь (пресет)
    const r = statOf(kind, this.fac(owner)).radius;
    const sel = document.createElement('div'); sel.className = 'w2d-sel';
    const range = document.createElement('div'); range.className = 'w2d-range';
    const rr = statOf(kind, this.fac(owner)).range + statOf(kind, this.fac(owner)).radius + (kind === 'turret' ? TURRET_FAC[this.fac(owner)]?.range ?? 0 : 0);
    Object.assign(range.style, { width: rr * 2 * S + 'px', height: rr * 2 * S * 0.55 + 'px' });
    el.append(range);
    const ring = document.createElement('div'); ring.className = 'w2d-ring';
    for (const e of [sel, ring]) Object.assign(e.style, { width: r * 2.4 * S + 'px', height: r * 1.3 * S + 'px' });
    const body = document.createElement('div'); body.className = 'w2d-body pal-' + (this.players[owner].faction ?? 'tyranids'); // палитра пакета фракции (index.html)
    const pl = this.players[owner], artPath = artFor(kind, pl.faction ?? 'tyranids', 1, arch ?? pl.captain.arch, variant);
    const svgs: SVGElement[] = [], px: Px[] = [];
    const in3d = has3d(kind); // живая модель: в DOM остаются только полоса здоровья и кольца
    if (in3d) this.w3d.add(id, PACK[pl.faction ?? 'tyranids'], kind, widthOf(kind, pl.faction ?? 'tyranids'), (FORM[kind] ?? [[0, 0]]).map(([ox, oy]) => [ox, oy]), kind === 'captain' || kind === 'deity' ? archFor(pl.faction ?? 'tyranids', arch ?? pl.captain.arch) : kind === 'legend' ? `legend${variant}` : undefined); // у сборок героя свой силуэт, у К'тана — свой бог, у легенд — своя модель
    for (const [ox, oy] of in3d ? [] : FORM[kind] ?? [[0, 0]]) {
      if (isPx(kind, pl.faction ?? 'tyranids')) { const f = pl.faction ?? 'tyranids', r = pxRole(kind, f)!, p = pxSprite(f, r, pxScale(kind, f, r)); p.el.style.transform = `translate(${ox * S}px, ${oy * S * 0.6}px)`; body.append(p.el); px.push(p); continue; } // пиксельный атлас фракции
      const a = art(artPath, widthOf(kind, pl.faction ?? 'tyranids') * S);
      a.style.transform = `translate(${ox * S}px, ${oy * S * 0.6}px)`;
      body.append(a);
      svgs.push(a.querySelector('svg')!);
    }
    const bar = document.createElement('div'); bar.className = 'lc-vitals w2d-bar';
    const fg = document.createElement('div'); fg.className = 'lc-vitals__bar'; bar.append(fg);
    bar.style.width = Math.max(40, Math.min(widthOf(kind, pl.faction ?? 'tyranids'), 9) * S * (isStruct(kind) ? 0.7 : 1)) + 'px';
    const uz = uaSize(kind, pl.faction ?? 'tyranids');
    if (in3d) bar.style.top = -((uz ? uz[1] * 0.9 : widthOf(kind, pl.faction ?? 'tyranids') * (isStruct(kind) ? 0.7 : 1.15)) * S + 10) + 'px'; // над моделью (юнит мода — по её высоте)
    else if (px[0]) bar.style.top = -((px[0].ay - px[0].top) * px[0].sc + 10) + 'px'; // над макушкой атласа, по центру опорной точки
    if (kind === 'titan' && !px[0] && !uz) { bar.style.bottom = widthOf(kind, pl.faction ?? 'tyranids') * 1.36 * S + 'px'; el.classList.add('titan'); } // полоса над головой титана
    el.append(ring, sel, body, bar);
    this.place2(el, x, y);
    return { id, owner, kind, el, body, svgs, px, bar, fg, sel, x, y, tx: x, ty: y, f: 0, hp: maxHp(kind, this.fac(owner)), build: 1, q: 0, dead: false, lvl: 1, upg: -1, atkUntil: 0, artPath, prog: 0, prod: 0, gear: 0, ch: [0, 0, 0], gcd: 0, sh: 0, frozen: 0, carry: 0, rise: 0, off: false, arch: kind === 'captain' ? arch ?? pl.captain.arch : undefined };
  }

  private scans: number[][] = [];
  onSnap(s: Snap) {
    this.scans = s.sc ?? [];
    const seen = new Set<number>(), first = this.snapN++ === 0, now = performance.now();
    this.qk = s.qk ?? {};
    if (this.slot >= 0) this.renderScore(s);
    this.drawSmoke(s.sm ?? []);
    this.stopCd = s.ps?.[this.slot]?.[0] ?? 0; this.unlock = s.ps?.[this.slot]?.[1] ?? 0; this.doomPct = s.ps?.[this.slot]?.[2] ?? 0; this.scanCd = s.ps?.[this.slot]?.[3] ?? 0;
    this.drawStrikes(s); this.megaWatch(s);
    for (const [id, owner, ki, x, y, hp, face, q, bp, , lvl, upg, prog, gear, c0, c1, c2, gcd, sh, frozen, carry, rise, off, respawn, archI, ...hr] of s.u) {
      const kind = KINDS[ki];
      if (kind === 'mine' && owner !== this.slot) continue; // чужие мины невидимы
      seen.add(id);
      let v = this.views.get(id);
      v?.el.classList.remove('ghost');
      if (!v) {
        this.views.set(id, (v = this.mk(id, owner, kind, x / 10, y / 10, q, ARCHS[archI ?? -1])));
        if (kind === 'legend') v.el.classList.add('legend');
        if (!first && owner === this.slot && !isStruct(kind)) { audio.trained(); voice.say(this.fac(), kind, 'ready'); }
        if (!first && kind === 'titan') { voice.announce(owner === this.slot ? 'Титан вышел на поле боя.' : 'Внимание! Вражеский титан!'); this.alert(owner === this.slot ? 'ok' : 'danger', 'Титан на поле', this.kindName('titan', this.fac(owner)), x / 10, y / 10); this.shakeBy(12); }
      } else if (owner === this.slot) {
        if (v.build < 1 && bp >= 100) { audio.built(); this.alert('ok', 'Постройка готова', this.nameOf(v), v.tx, v.ty); }
        if (kind === 'captain' && v.hp > 0 && hp <= 0) { audio.alarm(); this.alert('danger', 'Капитан пал', 'закажите его заново в штабе', x / 10, y / 10); }
        else if (hp < v.hp && now - this.lastAlert > 8000) { this.lastAlert = now; audio.alarm(); if (isStruct(kind)) voice.announce('Наша база атакована.'); else voice.say(this.fac(), kind, 'hurt'); this.pingMini(x / 10, y / 10); this.alert('danger', 'Нас атакуют', this.nameOf(v), x / 10, y / 10); }
      }
      v.tx = x / 10; v.ty = y / 10; v.f = face / 100; v.hp = hp; v.q = q; v.build = bp / 100; v.dead = hp <= 0;
      const lvlArt = artFor(kind, this.players[owner].faction ?? 'tyranids', lvl, ARCHS[archI ?? -1] ?? this.players[owner].captain.arch, kind === 'legend' ? q : 0);
      if (lvl !== v.lvl && lvlArt !== v.artPath) { // апгрейд: новый силуэт уровня 2
        v.artPath = lvlArt;
        const a = art(lvlArt, widthOf(kind, this.players[owner].faction ?? 'tyranids') * S * 1.1);
        if (!has3d(kind)) { v.body.replaceChildren(a); v.svgs = [a.querySelector('svg')!]; v.px = []; } // у живой модели старый силуэт не рисуем
      }
      const lvl3d = kind === 'hq' ? Math.min(3, Math.ceil((s.pl[owner]?.[2] ?? 1) / 2)) : /^key[1-4]$/.test(kind) ? Math.min(3, Number(kind[3])) : lvl; // ключевые здания: облик по тиру // штаб растёт с тиром владельца: I–II, III–IV, V
      if (isStruct(kind) && has3d(kind) && lvl3d !== (v.lvl3d ?? 1)) { v.lvl3d = lvl3d; this.w3d.add(id, PACK[this.fac(owner)], kind, widthOf(kind, this.fac(owner)), undefined, undefined, lvl3d); } // улучшенная версия модели
      v.lvl = lvl; v.upg = upg; v.prog = prog ?? 0; v.prod = prog ?? 0; v.gear = gear ?? 0; v.ch = [c0 ?? 0, c1 ?? 0, c2 ?? 0]; v.gcd = gcd ?? 0;
      if (v.kind !== kind) { v.kind = kind; v.artPath = artFor(kind, this.fac(owner), 1, v.arch); if (has3d(kind)) { this.w3d.add(id, PACK[this.fac(owner)], kind, widthOf(kind, this.fac(owner)), undefined, archFor(this.fac(owner), v.arch ?? this.players[owner].captain.arch)); v.body.replaceChildren(); v.svgs = []; v.px = []; } else { const a = art(v.artPath, widthOf(kind, this.fac(owner)) * S); v.body.replaceChildren(a); v.svgs = [a.querySelector('svg')!]; v.px = []; } if (kind === 'deity') { this.alert(owner === this.slot ? 'ok' : 'danger', 'Вознесение', (v.arch === 'assault' ? 'Несущий Ночь' : 'Обманщик') + ' пробудился', x / 10, y / 10); voice.announce(owner === this.slot ? 'Бог-Механизм пробудился.' : 'Враг вознёсся! Бог-Механизм на поле!'); this.shakeBy(14); } } // капитан ⇄ Бог-Механизм
      v.sh = sh ?? 0; v.frozen = frozen ?? 0; v.carry = carry ?? 0; v.rise = (rise ?? 0) / 10; v.off = off === 1; v.respawn = respawn ?? 0;
      if (hr.length) { // герой: уровень, опыт, очки, способности, перезарядки; новый уровень — вспышка и оповещение
        const was = v.hero?.lvl ?? hr[0];
        v.hero = { lvl: hr[0], xp: hr[1], pts: hr[2], abil: hr[3], cd: hr.slice(4) };
        if (owner === this.slot && hr[0] > was) { audio.built(); this.alert('ok', `${this.nameOf(v)}: ранг ${hr[0]}`, 'выберите героя → «Прокачка» (P)'); v.el.animate([{ filter: 'drop-shadow(0 0 0 var(--gilt-300))' }, { filter: 'drop-shadow(0 0 22px var(--gilt-300))' }, { filter: 'none' }], { duration: 1400 }); }
      }
      if (kind === 'hq' && owner === this.slot && !this.centered) {
        this.centered = true;
        this.cam.x = v.tx + (MAP.w / 2 - v.tx) * 0.25; this.cam.y = v.ty + (MAP.h / 2 - v.ty) * 0.25;
      }
    }
    let gone = 0;
    const died = new Set(s.d ?? []);
    for (const [id, v] of this.views) if (!seen.has(id)) {
      if (v.owner !== this.slot && !died.has(id)) { // ушёл в туман войны, а не погиб
        if (isStruct(v.kind) && !this.inSight(v.x, v.y)) { v.el.classList.add('ghost'); continue; } // здание — призрак последнего увиденного
        this.views.delete(id); this.sel.delete(id); v.el.remove(); v.dome?.remove(); this.w3d.remove(id); continue;
      }
      // гибель: падение и пепел, потом исчезает
      this.views.delete(id); this.sel.delete(id); v.dome?.remove(); this.w3d.kill(id, performance.now()); // модель проигрывает гибель
      v.bar.remove(); v.sel.remove();
      v.svgs.forEach(sv => setAnim(sv, 'death'));
      for (const p of v.px) if (p.anim !== 'death') { const w = p.cell * p.sc; pxFrame(p, this.fac(v.owner), 'death', v.f, performance.now()); p.el.animate([{ backgroundPositionX: '0px' }, { backgroundPositionX: -7 * w + 'px' }], { duration: PX_DUR.death * 1000, easing: 'steps(7, jump-none)', fill: 'forwards' }); }
      v.el.classList.add(isStruct(v.kind) ? 'w2d-razed' : 'w2d-dying');
      setTimeout(() => v.el.remove(), isStruct(v.kind) ? 1200 : 1700);
      const a = this.audioAt(v.x, v.y);
      if (a && !first && gone++ < 2) isStruct(v.kind) ? audio.boom(a.pan) : audio.death(a.pan);
      if (isStruct(v.kind)) this.shake(10);
    }
    s.p.forEach(([owner, prog, by], i) => {
      if (this.pointOwner[i] !== undefined && this.pointOwner[i] !== owner) {
        if (owner === this.slot) audio.captured(); else if (this.pointOwner[i] === this.slot) audio.lost();
      }
      const ownerChanged = this.pointOwner[i] !== undefined && this.pointOwner[i] !== owner;
      this.pointOwner[i] = owner;
      const p = this.points[i], col = owner >= 0 ? hex(SLOT_COLORS[owner]) : 'var(--art-bone)';
      p.ring.classList.toggle('capture-active', by >= 0 && prog > 0);
      if (ownerChanged) {
        p.ring.classList.remove('capture-commanded');
        p.ring.classList.add('capture-complete');
        setTimeout(() => p.ring.classList.remove('capture-complete'), 1500);
      }
      p.ring.style.setProperty('--team', col);
      p.ring.classList.toggle('owned', owner >= 0);
      p.zone.style.setProperty('--team', col); p.zone.classList.toggle('owned', owner >= 0); p.zone.classList.toggle('mine', owner === this.slot);
      for (const k of ['--art-bone', '--art-glow', '--art-brass-lit']) p.el.style.setProperty(k, col); // башня точки в цвете владельца (пресет Buildings)
      p.el.style.filter = owner >= 0 ? `drop-shadow(0 0 6px ${col})` : '';
      p.fill.style.setProperty('--team', by >= 0 ? hex(SLOT_COLORS[by]) : 'transparent');
      p.fill.style.setProperty('--p', String(prog / 100));
      this.w3d.pointState(i, by >= 0 && prog > 0 ? SLOT_COLORS[by] : owner >= 0 ? SLOT_COLORS[owner] : null, owner >= 0, prog / 100, now);
    });
    for (const [x1, y1, x2, y2, fx = 0] of s.sh) this.shot(x1 / 10, y1 / 10, x2 / 10, y2 / 10, now, Math.round(fx / 10));
    let heard = 0;
    for (const [x1, y1] of s.sh) { const a = this.audioAt(x1 / 10, y1 / 10); if (a && heard++ < 4) audio.shot(a.pan); }
    audio.heat(Math.min(0.4, s.sh.length * 0.02));
    this.hud(s);
    if (s.w !== null && !this.ended) { this.ended = true; this.onEnd(s.w); }
  }

  /** Атака (пресет AttackVFX): у каждого оружия своя форма следа — пуля, рубящая дуга, три когтя, луч, огонь, укол. */
  private shot(x1: number, y1: number, x2: number, y2: number, now: number, fx = 0) {
    let best: View | undefined, bd = 4; // стрелок — ближайший к началу выстрела (модели мода крупнее: ×DOW_M)
    for (const v of this.views.values()) { const d = Math.hypot(v.tx - x1, v.ty - y1); if (d < bd && !v.dead) { bd = d; best = v; } }
    const melee = fx === 1 || fx === 2 || fx === 5;
    if (best) { best.atkUntil = now + (melee ? 1300 : 700); best.shotAt = now; best.melee = melee; best.atkFx = fx; }
    if (this.shots.length > 120) return;
    const ns = 'http://www.w3.org/2000/svg', g = document.createElementNS(ns, 'g');
    const hv = melee ? this.nearest(x2, y2) : undefined, hr = hv && isStruct(hv.kind) ? (foot(hv.kind) * BCELL) / 2 : 0, hd = Math.hypot(x1 - x2, y1 - y2); // удар по зданию — у его края со стороны бойца, а не в центре под моделью
    const hx = hr && hd > hr ? x2 + ((x1 - x2) / hd) * hr : x2, hy = hr && hd > hr ? y2 + ((y1 - y2) / hd) * hr : y2;
    const h = best && !isStruct(best.kind) ? 1.2 : 2.2, X1 = x1 * S, Y1 = (y1 - h) * S, X2 = hx * S, Y2 = (hy - 1) * S;
    const dir = Math.sign(X2 - X1) || 1;
    const wf = best && MOD_RACES[this.fac(best.owner) as keyof typeof MOD_RACES] ? UA_WEAPONS[this.fac(best.owner)]?.[best.kind] ?? [] : [], tv = wf.length ? this.nearest(x2, y2) : undefined;
    const surf = !tv ? '' : isStruct(tv.kind) ? 'stone' : this.fac(tv.owner) === 'tyranids' ? 'flesh' : VEHICLES.has(UA_BASE[tv.kind] ?? tv.kind) ? 'heavy_metal_armour' : 'light_metal_armour'; // поверхность цели — как type_surface в DoW
    const mod = best && wf.length ? this.w3d.fire(best.id, x2, y2, tv?.id, wf.find(w => MELEE_W.test(w) === melee) ?? wf[0], surf, melee) : undefined; // эффекты мода: вспышка, снаряд, попадание
    const ua = best && !melee && !mod?.shot && [0, 3, 10, 11, 14].includes(fx) ? uaShot(UA_WEAPONS[this.fac(best.owner)]?.[best.kind] ?? [], X1, Y1, X2, Y2, Math.hypot(x2 - x1, y2 - y1)) : '';
    if (fx === 0) g.innerHTML = `<line class="w2d-tracer" x1="${X1}" y1="${Y1}" x2="${X2}" y2="${Y2}"/><circle class="w2d-muzzle" cx="${X1}" cy="${Y1}" r="5"/>`;
    else if (fx === 1) g.innerHTML = `<path class="w2d-slash" d="M${X2 - 14 * dir} ${Y2 - 30} Q${X2 + 22 * dir} ${Y2 - 14} ${X2 + 6 * dir} ${Y2 + 18}"/><ellipse class="w2d-dust" cx="${X2}" cy="${Y2 + 20}" rx="18" ry="6"/>`;
    else if (fx === 2) g.innerHTML = [-8, 0, 8].map(o => `<path class="w2d-claw" d="M${X2 - 16 * dir + o} ${Y2 - 26} Q${X2 + 10 * dir + o} ${Y2 - 8} ${X2 + o} ${Y2 + 16}"/>`).join('') + `<circle class="w2d-spark" cx="${X2}" cy="${Y2}" r="4"/>`;
    else if (fx === 3) g.innerHTML = `<line class="w2d-beam" x1="${X1}" y1="${Y1}" x2="${X2}" y2="${Y2}"/><circle class="w2d-hitring" cx="${X2}" cy="${Y2}" r="8"/>`;
    else if (fx === 4) g.innerHTML = `<path class="w2d-fire" d="M${X1} ${Y1} Q${(X1 + X2) / 2} ${Math.min(Y1, Y2) - 50} ${X2} ${Y2}"/><circle class="w2d-blast" cx="${X2}" cy="${Y2}" r="14"/>`;
    else if (fx === 5) g.innerHTML = [-5, 5].map(o => `<line class="w2d-thrust" x1="${X2 - 26 * dir}" y1="${Y2 + o}" x2="${X2 + 6 * dir}" y2="${Y2 + o}"/>`).join('') + `<circle class="w2d-spark" cx="${X2 + 4 * dir}" cy="${Y2}" r="3"/>`;
    else if (fx === 20) { const bolt = (o: number) => { let d = `M${X1} ${Y1 - 4 * S}`; for (let i = 1; i <= 6; i++) d += ` L${X1 + (X2 - X1) * i / 6 + (i < 6 ? (Math.random() - 0.5) * 3 * S + o : 0)} ${Y1 - 4 * S + (Y2 - Y1 + 4 * S) * i / 6 + (i < 6 ? (Math.random() - 0.5) * 3 * S : 0)}`; return d; };
      g.innerHTML = `<line class="w2d-gauss" x1="${X1}" y1="${Y1 - 4 * S}" x2="${X2}" y2="${Y2}"/>` + [-S, S].map(o => `<path class="w2d-flux" d="${bolt(o)}"/>`).join('') + `<circle class="w2d-boom" cx="${X2}" cy="${Y2}" r="${3 * S}" style="stroke:#5affa0"/>` + this.sparks(X2, Y2, 12, '#9fffc8', 2.5 * S); } // Монолит
    else if (fx === 19) { const d = `M${X1} ${Y1 - 30} Q${(X1 + X2) / 2} ${Math.min(Y1, Y2) - 70} ${X2} ${Y2}`; // три огненных шара очередью
      g.innerHTML = [0, 1, 2].map(i => `<circle class="w2d-orb" r="${6 - i}" opacity="0"><set attributeName="opacity" to="1" begin="${i * 0.13}s"/><animateMotion dur=".45s" begin="${i * 0.13}s" fill="freeze" path="${d}"/><set attributeName="opacity" to="0" begin="${0.45 + i * 0.13}s"/></circle>`).join('') + `<circle class="w2d-blast late" cx="${X2}" cy="${Y2}" r="16"/>` + this.sparks(X2, Y2, 8, '#ff7a3a', 2 * S, 450); }
    else if (fx === 6) g.innerHTML = this.sparks(X2, Y2 - 10, 5, '#ffd38a', 10); // сварка: ремонт
    if (fx === 18) this.w3d.blast(x1, y1, Math.max(4, x2 - x1), now); // ядерный гриб из ассет-лабы
    if (fx === 18) g.innerHTML = `<circle class="w2d-nuke" cx="${X1}" cy="${Y1 + S}" r="${16 * S}"/><circle class="w2d-boomcore" cx="${X1}" cy="${Y1 + S}" r="${6 * S}"/>` + this.sparks(X1, Y1 + S, 40, '#fff2c8', 14 * S); // сверхоружие
    else if (fx === 15) { const hx = X1 + (X2 - X1) * 0.85, hy = (y1 - 2) * S + ((y2 - 1) * S - (y1 - 2) * S) * 0.85; g.innerHTML = `<path class="w2d-hex" d="M${hx - 10} ${hy}l5 -9h10l5 9l-5 9h-10z"/>`; } // попадание по куполу: вспышка гексагона
    else if (fx === 16) g.innerHTML = `<rect class="w2d-pillar" x="${X1 - S}" y="${Y1 - 14 * S}" width="${2 * S}" height="${15 * S}"/>` + this.sparks(X1, Y1, 10, '#ffe9a8', 2 * S); // Архангел поднимает бойца
    else if (fx === 17) g.innerHTML = `<circle class="w2d-timestop" cx="${X1}" cy="${Y1}" r="${12 * S}"/><line class="w2d-clockhand" x1="${X1}" y1="${Y1}" x2="${X1}" y2="${Y1 - 10 * S}"/>`; // Остановка времени
    else if (fx === 7) g.innerHTML = `<path class="w2d-arc" d="M${X1} ${Y1} Q${(X1 + X2) / 2} ${Math.min(Y1, Y2) - 120} ${X2} ${Y2 + S}"/>`; // навесной бросок
    else if (fx === 8) g.innerHTML = `<circle class="w2d-boom" cx="${X1}" cy="${Y1 + S}" r="${4 * S}"/><circle class="w2d-boomcore" cx="${X1}" cy="${Y1 + S}" r="${1.6 * S}"/>` + this.sparks(X1, Y1 + S, 14, '#f0a540', 3 * S);
    else if (fx === 9) g.innerHTML = [0, 1, 2, 3, 4].map(i => `<circle class="w2d-puff" cx="${X1 + Math.cos(i * 1.3) * 2 * S}" cy="${Y1 + S + Math.sin(i * 1.3) * S}" r="${2.4 * S}" style="animation-delay:${i * 60}ms"/>`).join('');
    else if (fx === 10) g.innerHTML = `<line class="w2d-snipe" x1="${X1}" y1="${Y1}" x2="${X2}" y2="${Y2}"/><circle class="w2d-muzzle" cx="${X1}" cy="${Y1}" r="7"/>` + this.sparks(X2, Y2, 6, '#ffffff', 18);
    else if (fx === 11) g.innerHTML = `<line class="w2d-las" x1="${X1}" y1="${Y1}" x2="${X2}" y2="${Y2}"/><circle class="w2d-boomcore" cx="${X2}" cy="${Y2}" r="${0.9 * S}"/>` + this.sparks(X2, Y2, 9, '#9fe8ff', 26);
    else if (fx === 12) g.innerHTML = `<path class="w2d-shell" d="M${X1} ${Y1 - 20} Q${(X1 + X2) / 2} ${Math.min(Y1, Y2) - 160} ${X2} ${Y2}"/><circle class="w2d-boom late" cx="${X2}" cy="${Y2}" r="${2.6 * S}"/>` + this.sparks(X2, Y2, 12, '#f0a540', 2 * S, 220);
    else if (fx === 13) g.innerHTML = `<line class="w2d-titanbeam" x1="${X1}" y1="${Y1 - 20 * S}" x2="${X2}" y2="${Y2}"/><circle class="w2d-boom" cx="${X2}" cy="${Y2}" r="${7 * S}"/><circle class="w2d-boomcore" cx="${X2}" cy="${Y2}" r="${3 * S}"/>` + this.sparks(X2, Y2, 24, '#ffd38a', 6 * S);
    else g.innerHTML = [0, 1, 2].map(i => `<line class="w2d-tracer" x1="${X1}" y1="${Y1 + i * 3}" x2="${X2 + (i - 1) * 6}" y2="${Y2 + (i - 1) * 4}" style="animation-delay:${i * 50}ms"/>`).join('') + this.sparks(X2, Y2, 4, '#ffd38a', 10); // очередь
    if (fx === 0 || fx === 14) g.innerHTML += this.sparks(X2, Y2, 3, '#ffe2a0', 8);
    if (ua) g.innerHTML = ua + this.sparks(X2, Y2, 3, '#ffe2a0', 8); // расы UA: снаряд вместо линий (выше — две цепочки, вторая перезаписывает первую)
    if (mod?.shot && !melee) g.innerHTML = mod.hit ? '' : this.sparks(X2, Y2, 3, '#ffe2a0', 8); // эффекты мода заменяют рисованные; нет попадания из мода — искры в цели
    else if (mod?.hit && melee) g.innerHTML = ''; // удар: попадания в рукопашную в моде нет (они в архивах DoW) — рисованные когти/рубка остаются
    else if (mod?.hit) g.innerHTML = ua;
    if (best) { // цвет выстрела — по фракции стрелка; оружие по площади рисует кольцо взрыва в свой радиус
      const c = SHOT_COLOR[this.fac(best.owner)]; g.style.setProperty('--art-fire', c[0]); g.style.setProperty('--art-glow', c[1]);
      const aoe = ROLES[best.kind]?.aoe ?? STRUCT_AOE[best.kind];
      if (aoe && fx !== 6) g.innerHTML += `<ellipse class="w2d-splash" cx="${X2}" cy="${Y2 + S}" rx="${aoe * S}" ry="${aoe * S * 0.55}"/>`;
    }
    this.fx.append(g);
    const target = fx === 7 || fx === 8 || fx === 9 ? undefined : this.nearest(x2, y2);
    if (target && fx !== 6) this.hitFlash(target, fx, X2 - X1);
    if (fx === 8 || fx === 12 || fx === 13 || fx === 18) this.shakeBy(fx === 18 ? 24 : fx === 13 ? 14 : fx === 12 ? 6 : 5);
    const life = ({ 18: 1800, 15: 300, 16: 1200, 17: 1600, 0: 160, 3: 420, 7: 900, 8: 600, 9: 1400, 10: 260, 11: 380, 12: 900, 13: 700, 14: 220 } as Record<number, number | undefined>)[fx] ?? 340;
    this.shots.push({ el: g, until: now + life });
  }

  private shake(px: number) {
    this.world.animate([{ translate: `${px}px 0` }, { translate: `${-px}px ${px / 2}px` }, { translate: '0 0' }], { duration: 260, composite: 'add' });
  }

  // ---------- мини-карта (пресет Minimap): квадраты — свои, треугольники — враги, ромбы — точки ----------
  private buildMini() {
    const svg = $('mini-svg') as unknown as SVGSVGElement;
    const thumb = document.createElement('canvas'); thumb.width = thumb.height = 200; // мини-карта — уменьшенная текстура той же карты
    thumb.getContext('2d')!.drawImage(this.mapTex!, 0, 0, 200, 200);
    svg.setAttribute('preserveAspectRatio', 'none'); // мини-карта растянута на квадрат: x и y считаем каждый по своей стороне карты
    svg.innerHTML = `<image href="${thumb.toDataURL()}" width="100" height="100" preserveAspectRatio="none" style="image-rendering:pixelated"/>`
      + VENTS.map(([x, y]) => `<circle cx="${(x / MAP.w) * 100}" cy="${(y / MAP.h) * 100}" r="1.5" fill="var(--amber-500)" opacity=".8"/>`).join('');
    this.miniCam.classList.add('cam'); this.miniPing.classList.add('ping', 'lc-ping'); this.miniPing.setAttribute('r', '4'); this.miniPing.style.display = 'none';
    const ns = 'http://www.w3.org/2000/svg', defs = document.createElementNS(ns, 'defs'), mask = document.createElementNS(ns, 'mask'), veil = document.createElementNS(ns, 'rect');
    mask.id = 'mini-fog'; mask.innerHTML = '<rect width="100" height="100" fill="#fff"/>'; mask.append(this.miniFog); defs.append(mask);
    Object.entries({ width: '100', height: '100', mask: 'url(#mini-fog)', fill: 'rgba(6,5,9,.65)' }).forEach(([k, v]) => veil.setAttribute(k, v));
    svg.append(defs, veil, this.mini, this.megaMini, this.miniCam, this.miniPing);
    const go = (e: PointerEvent) => { const r = svg.getBoundingClientRect(); this.cam.x = ((e.clientX - r.left) / r.width) * MAP.w; this.cam.y = ((e.clientY - r.top) / r.height) * MAP.h; };
    svg.addEventListener('pointerdown', e => { e.stopPropagation(); go(e); svg.setPointerCapture(e.pointerId); }, { signal: this.ac.signal });
    svg.addEventListener('pointermove', e => { if (e.buttons & 1) go(e); }, { signal: this.ac.signal });
  }

  private drawMini(s: Snap) {
    const k = 100 / MAP.w, ky = 100 / MAP.h, own = (o: number) => (o === this.slot ? 'ally' : 'enemy');
    let h = s.p.map(([o], i) => { const [x, y] = [...POINTS, ...RELICS][i] ?? [0, 0]; const c = o < 0 ? 'pt' : o === this.slot ? 'pt-ally' : 'pt-enemy'; return i >= POINTS.length ? `<path class="${c} rel" d="M${x * k - 3} ${y * ky + 3}v-4l3-3 3 3v4z"/>` : `<path class="${c}" d="M${x * k} ${y * ky - 3}l3 3-3 3-3-3z"/>`; }).join(''); // реликварий — домик с золотой каймой
    for (const [, o, ki, x, y, hp] of s.u) {
      const kind = KINDS[ki], X = (x / 10) * k, Y = (y / 10) * ky;
      if (hp <= 0 || (kind === 'mine' && o !== this.slot)) continue;
      if (kind === 'hq') h += o === this.slot ? `<rect class="base-ally" x="${X - 4}" y="${Y - 4}" width="8" height="8"/>` : `<path class="base-enemy" d="M${X} ${Y - 5}l5 9h-10z"/>`;
      else if (isStruct(kind)) h += `<rect class="${own(o)}" x="${X - 1.2}" y="${Y - 1.2}" width="2.4" height="2.4" opacity=".7"/>`;
      else h += o === this.slot ? `<rect class="ally" x="${X - 1}" y="${Y - 1}" width="2" height="2"/>` : `<path class="enemy" d="M${X} ${Y - 1.4}l1.4 2.6h-2.8z"/>`;
    }
    this.mini.innerHTML = h;
  }

  private pingMini(x: number, y: number) {
    const k = 100 / MAP.w, ky = 100 / MAP.h;
    this.miniPing.setAttribute('cx', String(x * k)); this.miniPing.setAttribute('cy', String(y * ky));
    this.miniPing.style.display = ''; clearTimeout(this.pingT); this.pingT = window.setTimeout(() => (this.miniPing.style.display = 'none'), 3600);
  }
  private pingT = 0;

  // ---------- капитан: опыт, уровень, дерево способностей ----------
  /** Иконки героев слева (как в Soulstorm): по иконке на каждого героя на поле — уровень, здоровье, очки прокачки; клик — выбрать и навести камеру.
   *  Заказ героя — отдельной ячейкой в здании (штаб/казармы). Легенды на поле — тут же. */
  private portraits() {
    const own = (k: Kind) => [...this.views.values()].find(v => v.owner === this.slot && v.kind === k);
    const slots = [...this.views.values()].filter(v => v.owner === this.slot && !v.dead && (v.hero || v.kind === 'legend')).sort((a, b) => a.id - b.id).map(h => {
      const name = h.kind === 'legend' ? FACTIONS[this.fac()].legends[h.q] ?? 'Легенда' : this.nameOf(h);
      return `<button class="w2d-port w2d-hero${h.kind === 'legend' ? ' legend' : ''}${this.sel.has(h.id) ? ' on' : ''}${h.hero?.pts ? ' pts' : ''}" data-focus="${h.id}" title="${name.replace(/[<>&"]/g, '')}${h.hero ? `, ур. ${h.hero.lvl}${h.hero.pts ? `, очков прокачки: ${h.hero.pts}` : ''}` : ''}: клик — выбрать">${portrait(h.artPath)}${h.hero ? `<em>${h.hero.lvl}</em>` : ''}<i style="--v:${Math.max(0, h.hp / this.mhp(h)) * 100}%"></i></button>`;
    });
    const heroes = $('hud-heroes'), hh = slots.join('');
    if (heroes.innerHTML !== hh) heroes.innerHTML = hh;
    const ti = own('titan'), box = $('hud-titan');
    box.classList.toggle('hidden', !ti);
    if (ti) {
      if (box.dataset.id !== String(ti.id)) { box.dataset.id = String(ti.id); box.innerHTML = `<button class="w2d-port" id="titan-port" title="Титан: клик — выбрать и навести камеру">${portrait(ti.artPath)}<i></i></button><div><b>${this.kindName('titan', this.fac())}</b><small id="titan-hp"></small></div>`; $('titan-port').onclick = () => this.focus(ti.id); }
      (box.querySelector('i') as HTMLElement).style.setProperty('--v', Math.max(0, ti.hp / maxHp('titan', this.fac(ti.owner))) * 100 + '%');
      $('titan-hp').textContent = `${Math.round(ti.hp)} / ${maxHp('titan', this.fac(ti.owner))}`;
    }
  }
  private focus(id: number) { const v = this.views.get(id); if (!v) return; this.sel.clear(); this.sel.add(id); this.cam.x = v.x; this.cam.y = v.y; this.renderCmd(); }

  /** Герой в фокусе: выбранный свой герой, иначе главный капитан, иначе любой свой герой. */
  private heroView(): View | undefined {
    const mine = (v?: View) => !!v && v.owner === this.slot && !!v.hero;
    const main = archFor(this.fac(), this.players[this.slot]?.captain.arch ?? 'commander');
    return this.selected().find(mine) ?? [...this.views.values()].find(v => mine(v) && (v.arch ?? main) === main) ?? [...this.views.values()].find(mine);
  }
  private capHud(_me: number[]) {
    this.portraits();
    const h = this.heroView()?.hero ?? { lvl: 1, xp: 0, pts: 0, abil: 0, cd: [] };
    this.cap = { lvl: h.lvl, xp: h.xp, pts: h.pts, abil: h.abil, cd: h.cd };
  }


  /** Лента оповещений (пресет Alert): до 4 строк, тревога гаснет через 8 с, остальное через 5 с; клик по тревоге — камера к событию. */
  alert(tone: 'danger' | 'warn' | 'ok' | '', text: string, meta = '', x?: number, y?: number) {
    const box = $('hud-alerts'), el = document.createElement('div');
    const glyph = tone === 'danger' ? '<path d="M12 2 23 21H1Z" fill="none" stroke="currentColor" stroke-width="2"/><path d="M11 9h2v6h-2zM11 17h2v2h-2z" fill="currentColor"/>'
      : tone === 'warn' ? '<path d="M6 2h12M6 22h12M7 2c0 6 10 6 10 10S7 16 7 22M17 2c0 6-10 6-10 10s10 4 10 10" fill="none" stroke="currentColor" stroke-width="2"/>'
      : tone === 'ok' ? '<path d="M12 2 22 12 12 22 2 12Z" fill="none" stroke="currentColor" stroke-width="2"/><path d="M8 12l3 3 5-6" fill="none" stroke="currentColor" stroke-width="2"/>'
      : '<path d="M12 2 22 12 12 22 2 12Z" fill="currentColor"/>';
    el.className = `lc-alert${tone ? ' lc-alert--' + tone : ''}`;
    el.setAttribute('role', tone === 'danger' ? 'alert' : 'status');
    el.innerHTML = `<span class="lc-alert__glyph"><svg viewBox="0 0 24 24" aria-hidden="true">${glyph}</svg></span><span class="lc-alert__text">${text.replace(/[<>&]/g, '')}</span>${meta ? `<span class="lc-alert__meta">${meta.replace(/[<>&]/g, '')}</span>` : ''}`;
    if (x !== undefined && y !== undefined) { el.style.cursor = 'pointer'; el.onclick = () => { this.cam.x = x; this.cam.y = y; }; }
    box.prepend(el);
    while (box.children.length > 4) box.lastElementChild!.remove();
    setTimeout(() => el.remove(), tone === 'danger' ? 8000 : 5000);
  }

  // ---------- HUD ----------
  private hud(s: Snap) {
    if (this.slot < 0) { this.specHud(s); return; }
    if (!s.pl[this.slot]?.[1] && s.w === null) $('hud-out').classList.remove('hidden'); // выбыл, матч идёт: можно смотреть дальше
    const me = s.pl[this.slot];
    this.req = me[0]; this.energy = me[3] ?? 0; this.relics = me[4] ?? 0;
    const learnt = (me[8] ?? 0) & ~this.research;
    if (learnt && this.snapN > 2) RESEARCH.forEach((n, i) => { if (learnt & (1 << i)) this.alert('ok', 'Исследовано', n); });
    if ((s.pl[this.slot][2] ?? 1) > this.tier && this.snapN > 2) this.alert('ok', `Тир ${['I', 'II', 'III', 'IV', 'V'][s.pl[this.slot][2] - 1]}`, 'новые постройки и войска');
    this.research = me[8] ?? 0;
    this.ur = s.ur?.[this.slot] ?? [];
    this.ad = new Map((s.ad ?? []).map(([id, m]) => [id, m] as [number, number]));
    this.sq = new Map((s.sq ?? []).map(r => [r[0], r.slice(1)]));
    this.mo = new Map((s.mo ?? []).map(r => [r[0], [r[1], r[2]]]));
    this.wu = new Map((s.wu ?? []).map(r => [r[0], r.slice(1)]));
    this.armSt.clear();
    for (const [id, w] of this.wu) { const v = this.views.get(id), a = v && armedStat(this.fac(v.owner), v.kind, w.slice(2)); if (a) this.armSt.set(id, a); } // как armRange в симуляции
    this.capHud(me);
    this.drawMini(s);
    $('hud-energy').textContent = String(this.energy);
    const f = this.fac(), extra = $('hud-extra');
    extra.innerHTML = f === 'tyranids' ? 'Синапс' : 'Силовая броня · не ведают страха';
    extra.title = FACTIONS[f].mech;
    this.tier = s.pl[this.slot][2] ?? 1;
    $('hud-tier').textContent = ['I', 'II', 'III', 'IV', 'V'][this.tier - 1] ?? String(this.tier);
    let builders = 0, guards = 0, dead = false;
    for (const u of s.u) if (u[1] === this.slot) { if (u[2] === 1) builders++; else if (u[2] === 2) guards++; else if (u[2] === 0 && u[5] <= 0) dead = true; }
    $('hud-req').textContent = String(this.req);
    $('hud-builders').textContent = `${builders}/${CAP.builder}`;
    const pop = [0, 0], add = (k: Kind) => { if (!ROLES[k]?.one) pop[VEHICLES.has(k) || k === 'arty' ? 1 : 0] += popOf(k, this.fac()); }; // титаны — свой слот // пехота и техника — раздельные лимиты
    for (const u of s.u) if (u[1] === this.slot) add(KINDS[u[2]]);
    for (const q of Object.values(s.qk ?? {})) for (const k of q) add(KINDS[k]);
    const bonus = this.research & (1 << 12) ? 6 : 0, um = uaMods(this.me()); // лимиты из исследований UA — как legionCap на сервере
    $('hud-squads').textContent = `${pop[0]}/${LEGION_CAP + bonus + um.squad}`; $('hud-motor').textContent = `${pop[1]}/${MOTOR_CAP + bonus + um.support}`; void guards;
    $('hud-sel').textContent = this.sel.size ? `Выбрано: ${this.sel.size}` : '';
    $('hud-dead').classList.toggle('hidden', !dead);
    s.pl.forEach(([, alive], i) => document.getElementById('hp' + i)?.classList.toggle('dead', !alive));
    this.renderQueue();
    this.drawFog();
    this.renderCmd();
  }

  /** Очередь производства: что сейчас нанимается в каждом здании и сколько ждёт следом. */
  private renderQueue() {
    const items: string[] = [], f = this.fac();
    for (const v of this.views.values()) { // плашка на здание: что сейчас выходит, сколько осталось, сколько ждёт следом; клик — выбрать здание
      const q = this.qk[v.id];
      if (v.owner !== this.slot || !q?.length) continue;
      const k = KINDS[q[0]];
      items.push(`<button class="w2d-qgroup" data-sel="${v.id}" title="${this.nameOf(v).replace(/[<>&"]/g, '')}: ${this.kindName(k, f)}${q.length > 1 ? `, в очереди ещё ${q.length - 1}` : ''}. Клик — выбрать здание">${miniArt(v.artPath)}<span class="w2d-qitem now">${miniArt(artFor(k, f))}<span class="w2d-qbar" data-q="${v.id}"></span></span><span class="w2d-qmeta"><b data-q="${v.id}"></b>${q.length > 1 ? `<i>+${q.length - 1}</i>` : ''}</span></button>`);
    }
    const q = $('hud-queue');
    q.classList.toggle('hidden', !items.length);
    const html = items.length ? `<span class="w2d-qlabel">Производство</span>${items.join('')}` : '';
    if (q.innerHTML !== html) q.innerHTML = html;
    this.qTick();
  }
  /** Прогресс очереди: обновляем на месте (полоса и секунды), разметку не трогаем — клик по слоту не теряется. */
  private qTick() {
    for (const el of document.querySelectorAll<HTMLElement>('#hud [data-q]')) {
      const v = this.views.get(Number(el.dataset.q)), k = KINDS[this.qk[Number(el.dataset.q)]?.[0] ?? -1];
      if (!v || !k) continue;
      if (el.tagName === 'B') { const t = `${this.qLeft(k, v.prog)} с`; if (el.textContent !== t) el.textContent = t; } else el.style.setProperty('--v', v.prog + '%');
    }
  }


  /** Чем платит доход с точек: у Некронов (Династий) влияния нет — всё идёт в энергию. */
  private incomeRes() { return 'влияния'; }
  /** Сколько сегментов стены можно оплатить сейчас (Династии платят энергией). */
  private wallBudget() { const one = this.price(STATS.wall.cost); return Math.floor(Math.min(one.cost ? this.req / one.cost : Infinity, one.en ? this.energy / one.en : Infinity)); }
  /** Секунд до выхода юнита из здания по проценту готовности. */
  private qLeft(k: Kind, pct: number) { return Math.max(0, Math.ceil(trainTime(this.fac(), k, this.me()) * (ROLES[k]?.from === 'barracks' && this.research & (1 << 1) ? 0.85 : 1) * (1 - pct / 100))); }
  /** Очередь здания в карточке (как в Soulstorm): первый слот крупно с полосой и секундами, затем ожидающие, пустые слоты показывают, сколько ещё влезет. Клик — отменить. */
  private queueSlots(v: View) {
    const q = this.qk[v.id] ?? [], f = this.fac();
    const slot = (i: number) => { const ki = q[i]; if (ki === undefined) return `<span class="w2d-qslot empty"></span>`; const k = KINDS[ki];
      return `<button class="w2d-qslot${i ? '' : ' now'}" data-b="${v.id}" data-i="${i}" title="${this.kindName(k, f)}: клик — отменить, ресурсы вернутся">${miniArt(artFor(k, f))}${i ? '' : `<span class="w2d-qbar" data-q="${v.id}"></span><b data-q="${v.id}"></b>`}</button>`; }; // полоса и секунды — в qTick, чтобы DOM не менялся под курсором
    return `<div class="w2d-bq"><span class="w2d-qlabel">Очередь ${q.length}/${QUEUE_MAX}</span><div>${Array.from({ length: QUEUE_MAX }, (_, i) => slot(i)).join('')}</div></div>`;
  }

  private ur: number[] = []; // изученное из UA_RESEARCH
  private ad = new Map<number, number>(); // аддоны UA у зданий: id → маска UA_ADDONS
  /** Что есть у меня для требований UA (как haveOf на сервере, но по снимку). */
  private uaHave(): UAHave {
    const mine = [...this.views.values()].filter(v => v.owner === this.slot && v.hp > 0);
    return { built: k => mine.some(v => v.kind === k && v.build >= 1), addon: i => mine.some(v => ((this.ad.get(v.id) ?? 0) & (1 << i)) !== 0), research: i => this.ur.includes(i) };
  }
  /** Чего не хватает по дереву UA для постройки/найма вида (у остальных фракций — undefined, там тиры). */
  private meN = -1; private meC: UAModsOf = { faction: 'inquisition' };
  /** Свои исследования и аддоны из снимка — для цен, лимитов и обзора с модификаторами UA, как на сервере (кэш на снимок). */
  private me(): UAModsOf {
    if (this.meN !== this.snapN) { let ad = 0; for (const v of this.views.values()) if (v.owner === this.slot && !v.dead) ad |= this.ad.get(v.id) ?? 0; this.meC = { faction: this.fac(), ur: this.ur, ad }; this.meN = this.snapN; }
    return this.meC;
  }
  private sight(v: { id: number; kind: Kind; owner: number }) { return v.owner === this.slot ? sightOf(this.me(), { kind: v.kind, f: this.fac(), ad: this.ad.get(v.id) }) : this.st(v).sight; }
  private uaMelee(k: Kind, f = this.fac()) { return statOf(k, f).range <= 3; } // рукопашник мода: дальность как у удара
  private uaReq(k: Kind, at?: number) { const f = this.fac(), r = UA_REQ[f]?.[k]; return r ? uaMissing(f, r, this.uaHave(), at === undefined ? 0 : this.ad.get(at) ?? 0, this.bName) : undefined; }
  /** Имя постройки своей расы, как в меню строителя (ключевые здания и врата — по FACTIONS). */
  private bName = (k: Kind) => { const F = FACTIONS[this.fac()]; return /^key[1-4]$/.test(k) ? F.keys[Number(k[3]) - 1] : k === 'gate' ? F.gate : this.kindName(k, this.fac()); };
  private fac(owner = this.slot): FactionId { return this.players[owner]?.faction ?? 'tyranids'; }
  /** Статы и полное здоровье вида у фракции владельца (у рас из модов свои). */
  private st(v: { kind: Kind; owner: number; id?: number }) { return (v.id !== undefined && this.armSt.get(v.id)) || statOf(v.kind, this.fac(v.owner)); } // купленный стрелковый ствол — своя дальность
  private armSt = new Map<number, ReturnType<typeof statOf>>();
  private wu = new Map<number, number[]>(); // стволы отрядов UA: id → [ставится (-1 нет), %, куплено по вариантам UA_ARM…]
  private mo = new Map<number, number[]>(); // мораль отрядов UA из снимка: id → [%, надломлен]
  private sq = new Map<number, number[]>(); // отряды из снимка: id → [HP бойца, бойцов, предел пополнения]
  private mhp(v: { id?: number; kind: Kind; owner: number }) { const q = v.id !== undefined ? this.sq.get(v.id) : undefined; return q ? q[0] * q[1] : maxHp(v.kind, this.fac(v.owner)); }
  /** Живых бойцов: по размеру отряда с сервера (отряды UA растут пополнением), иначе по штату. */
  private cnt(v: { id: number; kind: Kind; owner: number; hp: number }) { const q = this.sq.get(v.id); return !q ? members(v.kind, v.hp, this.fac(v.owner)) : v.hp <= 0 ? 0 : Math.min(q[1], Math.ceil(v.hp / q[0] - 1e-6)); }
  /** Отряд пополняется: пехота игры или отряд мода с запасом бойцов. */
  private reinforceable(v: { kind: Kind; owner: number }) { return SQUADS.has(v.kind) || !!UA_SQ[this.fac(v.owner)]?.[v.kind]; }

  private selected() { return [...this.sel].map(id => this.views.get(id)).filter((v): v is View => !!v); }

  // ---------- нижний HUD по пресетам: UnitCard + CommandGrid 4×3 / BuildMenu + Tooltip ----------
  private buildOpen = false;
  private lastSelKey = '';
  private cells: Cell[] = [];
  private tipAct = '';

  private price(cost: number, en = 0, rel = 0) {
    ({ req: cost, energy: en } = resourceCost(this.fac(), cost, en, this.energy));
    return { cost, en, rel, ok: this.req >= cost && this.energy >= en && this.relics >= rel };
  }

  private kindName(k: Kind, f: FactionId) {
    const uaName = (f: FactionId, k: Kind) => { const r = MOD_RACES[f as keyof typeof MOD_RACES], id = (r?.unit as Partial<Record<Kind, string>> | undefined)?.[k] ?? (k.startsWith('ua:') ? k.split(':')[2] : ''); return r?.data.squads[id]?.unit.name || (id ? id.replace(/_/g, ' ').replace(/^./, c => c.toUpperCase()) : undefined); }; // без имени в моде — имя отряда мода словами (Stormtroopers) // отряд UA сверх ролей — имя из мода
    const F = FACTIONS[f], R = ROSTER[f] as unknown as Record<string, { name: string } | undefined>;
    if (!isStruct(k) && uaName(f, k)) return uaName(f, k)!; // отряды рас UA — имя из мода (имена ролей игры путали: «Сёстры-экзорцистки» вместо Astropath)
    return k in BUILD_NAME[f] ? BUILD_NAME[f][k as 'post'] : k === 'builder' ? F.builder : k === 'guard' ? F.guard : k === 'hq' ? HQ_NAME[f] : k === 'motorpool' || k === 'yard' ? PROD_NAME[f][k] : k === 'doom' ? DOOM_OF[f].name : R[k]?.name ?? KIND_NAME[k] ?? uaName(f, k) ?? k;
  }
  private nameOf(v: View) {
    const F = FACTIONS[this.fac(v.owner)];
    if (v.kind === 'captain') { const main = archFor(this.fac(v.owner), this.players[v.owner]?.captain.arch ?? 'commander'); return v.arch && v.arch !== main ? ARCH_OPTS[this.fac(v.owner)][v.arch]?.name ?? 'Герой' : this.players[v.owner]?.name ?? 'Капитан'; } // призванный герой — по архетипу
    if (v.kind === 'builder') return F.builder;
    if (v.kind === 'guard') return F.guard;
    if (v.kind === 'legend') return F.legends[v.q] ?? 'Легенда';
    if (/^key[1-4]$/.test(v.kind)) return F.keys[Number(v.kind[3]) - 1];
    if (v.kind === 'gate') return F.gate;
    return this.kindName(v.kind, this.fac(v.owner));
  }

  /** Команды выбранного: фиксированная раскладка — верхний ряд движение/стоп/атака, ниже постройка и способности. */
  /** Дерево героя в панели команд (как прокачка героя в Soulstorm UA): 3 ветки по столбцам, тиры по строкам, справа сверху — «Назад». */
  private treeCells(v: View): Cell[] {
    const h = v.hero!, c: Cell[] = Array.from({ length: 12 }, () => ({ act: '', name: '', hot: '' }));
    ABILITIES.forEach((a, i) => {
      const branch = Math.floor(i / 3), tier = i % 3, learned = !!(h.abil & (1 << i)), err = learned ? undefined : canLearn(h, this.tier, i);
      c[tier * 4 + branch] = { act: learned ? '' : 'learn:' + i, name: a.name, hot: String(tier * 3 + branch + 1), icon: ABIL_ICON[i] ?? ICON.attack, done: learned, ult: i === 5,
        req: err === 'Нет очков' ? 'Нет очков: опыт дают бои и захват точек рядом с героем' : err, info: `${a.info}${a.cd ? ` · перезарядка ${a.cd} с` : ' · пассивная'}. Очков у героя: ${h.pts}.` };
    });
    c[3] = { act: 'tree', name: 'Назад', hot: 'P', icon: ICON.stop, info: 'Вернуться к командам героя.' };
    return c;
  }
  private buildCells(sel: View[]): Cell[] {
    // чужое (и зрителю) — без приказов: иначе панель показывала очередь, аддоны и исследования чужого здания кнопками своей расы — у двух Инквизиций чужое улучшение выглядело своим
    if (sel.some(v => v.owner !== this.slot)) return [];
    const F = FACTIONS[this.fac()], R = ['I', 'II', 'III', 'IV', 'V'], c: Cell[] = [];
    const hv = sel.length === 1 && sel[0].owner === this.slot && sel[0].hero && !sel[0].dead ? sel[0] : null;
    if (hv && this.treeOpen) return this.treeCells(hv);
    const st = sel.length === 1 && isStruct(sel[0].kind) ? sel[0] : null;
    const own = (k: Kind) => [...this.views.values()].some(v => v.owner === this.slot && v.kind === k);
    if (st) {
      if (st.build < 1) return [{ act: '', name: 'Возводится', hot: '', icon: ICON.build, prog: Math.round(st.build * 100), info: 'Отправьте строителей: выберите их и ПКМ по стройке.' }];
      const HOT = ['T', 'Z', 'X', 'C', 'V', 'B', 'G'], ROLE_INFO: Partial<Record<Kind, string>> = {
        builder: 'Строит, чинит постройки и технику.', guard: isMelee('guard', this.fac()) ? 'Линейная пехота ближнего боя.' : 'Линейная пехота, стрелки.',
        sniper: 'Снайпер: против пехоты издалека; вблизи переключается на второе оружие.', heavy: dmgOf('heavy', this.fac()) === 'heavy' ? 'Противотанковое оружие: против техники и зданий. Дополнительное стрелковое доступно вблизи; против брони сохраняется более эффективный ствол.' : 'Антипехотное оружие: против пехоты; бронетехнику почти не пробивает.', support: 'Поддержка: снижает урон по союзникам рядом, может нести дым.',
        elite: 'Тяжёлая элита: держит удар, бьёт в упор.', healer: 'Целитель: лечит отряды в 15 м на 5%/с.', lveh: 'Лёгкая техника: разведка, захват точек, охота на строителей.',
        mveh: 'Средняя техника: огневая поддержка против пехоты, урон по площади.', hveh: 'Тяжёлая техника: осада, против зданий и техники.', arty: `Артиллерия: ${STATS.arty.range + (modOf(this.fac(), 'arty')?.range ?? 0)} м, по площади, в упор не стреляет — нужна разведка и прикрытие.`, titan: 'Титан: один на армию, давит пехоту шагами.', air: 'Авиация: быстрый отряд, летит над скалами и стенами — рейды по тылам.', jet: 'Самолёт: самый быстрый, летит высоко над всем, бьёт технику; постройки сбивают его втрое сильнее, по зданиям бьёт вполсилы.', bomber: 'Бомбовоз Орды: огромный самолёт титан-класса, мини-атомки по 9 м, земля горит. Нужна критическая точка; турели и тяжёлое оружие бьют по нему сильнее.' };
      if (UA_SQ[this.fac()]) for (const k of ['support', 'sniper', ...(Object.keys(UA_BASE) as Kind[]).filter(k => SQUADS.has(k))] as Kind[]) ROLE_INFO[k] = this.uaMelee(k) ? 'Боевой отряд ближнего боя.' : 'Боевой отряд стрелков.'; // у рас UA роли игры — только слоты: «поддержка» и «снайпер» тут обычные бойцы мода
      inherit(ROLE_INFO); // отряды UA сверх ролей — описание роли базового вида
      producible(st.kind, this.fac()).forEach((k, i) => {
        const r = ROLES[k]!, n = this.qk[st.id]?.filter(q => q === KINDS.indexOf(k)).length ?? 0, now = this.qk[st.id]?.[0] === KINDS.indexOf(k);
        const researching = (/^key[1-4]$/.test(st.kind) && st.q > 0 && !this.qk[st.id]?.length) || st.q > 100;
        c.push({ act: 'train:' + k, name: this.kindName(k, this.fac()), hot: k === 'titan' ? 'Z' : HOT[i] ?? '', art: artFor(k, this.fac()), ...this.price(trainCost(this.fac(), k, this.me()), trainEnergy(this.fac(), k, this.me()), r.relics ?? 0),
          info: `${ROLE_INFO[k] ?? ''}${modOf(this.fac(), k) ? ' ' + weaponModInfo(this.fac(), k) : ''}${CLOSE[k] && !UA_SQ[this.fac()] ? ` Дополнительное оружие до ${CLOSE[k]!.range} м.${k === 'heavy' || k === 'hveh' ? ' Против брони сохраняется более эффективный ствол.' : ''}` : ''}${(UA_SQ[this.fac()] ? UA_SETUP[this.fac()]?.[k] : SETUP.has(k)) ? ` На ходу не стреляет, развёртывание ${UA_SETUP[this.fac()]?.[k] ?? ''} с.` : ''} Легион: ${popOf(k, this.fac())}.`, req: UA_REQ[this.fac()]?.[k] ? this.uaReq(k, st.id) ?? (researching ? 'Здание уже исследует' : undefined) : this.tier < r.tier ? `Нужен тир ${['I', 'II', 'III', 'IV', 'V'][r.tier - 1]}` : researching ? 'Здание уже исследует' : undefined, queue: n || undefined, prog: now ? st.prod : undefined, left: now ? this.qLeft(k, st.prod) : undefined });
      });
      const main = archFor(this.fac(), this.players[this.slot]?.captain.arch ?? 'commander'), heroAt = HERO_AT[this.fac()] ?? 'hq';
      if (st.kind === heroAt || st.kind === 'barracks') { // герой — в здании мода, где он нанимается (Лорд-инквизитор — «Дозор»)
        (Object.keys(ARCH_OPTS[this.fac()]) as Arch[]).filter(a => (a === main) === (st.kind === heroAt)).forEach((a, i) => {
          const o = ARCH_OPTS[this.fac()][a]!, h = [...this.views.values()].find(v => v.owner === this.slot && (v.kind === 'captain' || v.kind === 'deity') && (v.arch ?? main) === a);
          const pr = this.price(trainCost(this.fac(), 'captain', this.me()), trainEnergy(this.fac(), 'captain', this.me())); // герой — по цене мода
          const req = h && !h.dead ? 'Уже в армии' : h?.respawn ? `Можно заказать через ${h.respawn} с` : undefined;
          c.push({ act: 'hero:' + a, name: h?.dead ? `Вернуть: ${o.name}` : o.name, hot: a === main ? 'K' : ['N', 'M'][i] ?? '', art: artFor('captain', this.fac(), 1, a), ...pr, req,
            info: `Герой расы. ${statOf('captain', this.fac()).hp} HP. Павшего героя заказывают заново.` });
        });
      }
      if (st.kind === 'hq' && heroAt !== 'hq') { // герой нанимается не в штабе (как в моде) — подсказка, где его искать
        const o = ARCH_OPTS[this.fac()][main], h = [...this.views.values()].some(v => v.owner === this.slot && v.kind === 'captain' && !v.dead);
        if (o) c.push({ act: '', name: o.name, hot: '', art: artFor('captain', this.fac(), 1, main), req: h ? 'Уже в армии' : `Нанимается в здании «${this.bName(heroAt)}»`, info: `Герой расы — как в UA, нанимается в здании «${this.bName(heroAt)}» (строится сразу, нужен только штаб).` });
      }
      if (st.kind === 'hq') {
        const t = UA_REQ[this.fac()] ? undefined : TIER_UP[this.tier], keyOk = t && own(t.key) && [...this.views.values()].some(v => v.owner === this.slot && v.kind === t.key && v.build >= 1);
        if (UA_REQ[this.fac()]) { /* раса UA: тир — аддоны штаба мода (ниже), тиров игры нет */ }
        else if (!t) c.push({ act: '', name: 'Высший тир', hot: '', icon: ICON.tier, info: 'Тир V достигнут.' });
        else {
          const req = !keyOk ? `Нужно здание «${F.keys[this.tier - 1]}»` : t.seal && !(this.research & (1 << 15)) ? 'Нужно исследование «Печать Вознесения»' : undefined;
          c.push({ act: 'tier', name: `Тир ${R[this.tier]}`, hot: 'U', icon: ICON.tier, ...this.price(t.cost, t.energy, t.relics), req, prog: st.upg >= 0 ? st.upg : undefined, info: 'Улучшение штаба открывает новые постройки, исследования и войска.' });
        }
      }
      const UA = UA_ADDONS[this.fac()], mask = this.ad.get(st.id) ?? 0;
      if (UA) UA.forEach((x, a) => { // аддоны UA этого здания (достройки; у штаба — переход тира)
        if (!x.ats.includes(st.kind)) return;
        const done = (mask & (1 << a)) !== 0, busy = !done && ((st.q > 0 && st.q !== 5000 + a) || !!this.qk[st.id]?.length);
        const miss = done || busy ? undefined : uaMissing(this.fac(), x.req, this.uaHave(), mask, this.bName);
        c.push({ act: done || busy || miss ? '' : 'uaa:' + a, name: x.name, hot: '', icon: x.at === 'hq' ? ICON.tier : ICON.build, ...(done ? {} : this.price(x.cost, x.energy)), done,
          info: `Аддон${st.kind === 'turret' ? ' на все турели' : ''}. ${x.info.replace(/^- /, '')} ${x.time} с.`, req: busy ? 'Здание занято' : miss, prog: st.q === 5000 + a ? st.prod : undefined, left: st.q === 5000 + a ? Math.ceil(x.time * (1 - st.prod / 100)) : undefined });
      });
      const UR = UA_RESEARCH[this.fac()];
      if (UR) { // исследования UA этого здания: сначала неизученные
        const mine = UR.map((x, r) => ({ x, r })).filter(({ x }) => x.ats.includes(st.kind)).sort((a, b) => +this.ur.includes(a.r) - +this.ur.includes(b.r));
        for (const { x, r } of mine.slice(0, Math.max(0, 12 - c.length))) {
          const done = this.ur.includes(r), busy = !done && ((st.q > 0 && st.q !== 1000 + r) || !!this.qk[st.id]?.length);
          const miss = done || busy ? undefined : uaMissing(this.fac(), x.req, this.uaHave(), mask, this.bName);
          c.push({ act: done || busy || miss ? '' : 'uar:' + r, name: x.name, hot: '', icon: ICON.research, ...(done ? {} : this.price(x.cost, x.energy)), done,
            info: `${x.info.replace(/^- /, '')} ${x.info ? '(' + uaModsInfo(x) + ')' : uaModsInfo(x)} ${x.time} с.`, req: busy ? 'Здание занято' : miss, prog: st.q === 1000 + r ? st.prod : undefined, left: st.q === 1000 + r ? Math.ceil(x.time * (1 - st.prod / 100)) : undefined });
        }
      }
      if (st.kind === 'gate') {
        const onField = own('legend');
      }
      const up = upOf(this.fac(), st.kind);
      if (up) c.push({ act: st.lvl >= 2 ? '' : 'upgrade', name: up.name, hot: 'U', icon: ICON.tier, ...(st.lvl >= 2 ? {} : this.price(up.cost, up.energy, up.relics)), done: st.lvl >= 2, req: this.tier < up.tier ? `Нужен тир ${up.tier}` : undefined, prog: st.upg >= 0 ? st.upg : undefined, info: 'Больше урона, брони и дальности.' });
      return c;
    }
    if (!sel.length) return c;
    c.push({ act: 'move', name: 'Идти', hot: 'M', icon: ICON.move, info: 'Идти в точку, не отвлекаясь на врагов.', active: this.moveMode },
      { act: 'stop', name: 'Стоп', hot: 'Z', icon: ICON.stop, info: 'Остановиться и держать место.' },
      { act: 'amove', name: 'Атака', hot: 'Q', icon: ICON.attack, info: 'Идти и атаковать всех врагов по пути.', active: this.amove });
    if (sel.some(v => v.kind === 'builder')) c.push({ act: 'buildmenu', name: 'Строить', hot: 'C', icon: ICON.build, info: 'Меню построек: экономика, армия, оборона, святыни.' });
    else c.push({ act: '', name: '', hot: '', icon: '' });
    const guards = sel.filter(v => this.reinforceable(v)), room = (v: (typeof sel)[number]) => { const q = this.sq.get(v.id); return Math.ceil((this.mhp(v) - v.hp) / (q?.[0] ?? this.st(v).hp) - 1e-6) + (q ? Math.max(0, q[2] - q[1]) : 0); }; // павшие + свободные места до максимума
    const hurt = guards.filter(v => room(v) > 0), one = (v: (typeof sel)[number]) => UA_SQ[this.fac(v.owner)]?.[v.kind]?.cost ?? Math.round(REINFORCE_COST * this.st(v).cost / 100);
    if (guards.length) c.push({ act: 'reinforce', name: 'Пополнить', hot: 'R', icon: ICON.reinforce, ...this.price(hurt.reduce((n, v) => n + room(v) * one(v), 0)), req: hurt.length ? undefined : 'Отряды полные', info: 'Добрать павших и докупить бойцов до максимума отряда (по бойцу за раз, не под огнём).' });
    const armed = sel.find(v => UA_ARM[this.fac(v.owner)]?.[v.kind]), A = armed && UA_ARM[this.fac()]?.[armed.kind];
    if (armed && A) { // стволы отряда, как в UA: каждый — одному бойцу, всего не больше max_upgrades
      const w = this.wu.get(armed.id) ?? [-1, 0], got = w.slice(2), total = got.reduce((a, x) => a + x, 0), alive = this.cnt(armed);
      A.opts.forEach((o, i) => {
        const inH = A.opts.reduce((a, x, j) => a + (x.h === o.h ? got[j] ?? 0 : 0), 0), img = uaArtIcon(this.fac(), o.icon);
        c.push({ act: w[0] >= 0 || total >= A.ups || inH >= alive ? '' : 'uaw:' + i, name: `${o.name} ${got[i] ?? 0}`, hot: '', ...(img ? { art: img } : { icon: ICON.research }), ...this.price(o.cost, o.power),
          prog: w[0] === i ? w[1] : undefined, req: total >= A.ups ? `Стволов в отряде: ${total}/${A.ups}` : inH >= alive ? 'Все бойцы уже вооружены' : w[0] >= 0 && w[0] !== i ? 'Отряд перевооружается' : undefined,
          info: `Ствол одному бойцу отряда, ${o.time} с. В отряде до ${A.ups} стволов, сейчас ${total}. Покупается где угодно, не под огнём.` });
      });
    }
    const fix = sel.some(v => v.kind === 'builder') ? [...this.views.values()].filter(v => v.owner === this.slot && v.build >= 1 && (isStruct(v.kind) || VEHICLES.has(v.kind)) && v.hp < this.mhp(v) - 1) : [];
    if (fix.length) c.push({ act: 'repair', name: 'Ремонт', hot: 'E', icon: ICON.build, info: `Починить ближайшее повреждённое (${fix.length}). Или ПКМ по своей постройке/технике.` });
    for (const k of Object.keys(UA_UPG[this.fac()] ?? {}) as Kind[]) { // апгрейды оружия турелей и машин из мода
      const vs = sel.filter(v => v.kind === k), up = upOf(this.fac(), k);
      if (!vs.length || !up) continue;
      const v = vs.find(x => x.lvl < 2);
      c.push({ act: v ? 'upgrade' : '', name: up.name, hot: 'U', icon: ICON.tier, ...(v ? this.price(up.cost, up.energy, up.relics) : {}), done: !v, req: this.tier < up.tier ? `Нужен тир ${up.tier}` : undefined, prog: v && v.upg >= 0 ? v.upg : undefined, info: k === 'captain' ? 'Капитан: урон ×1.5, получаемый урон ×0.7.' : k === 'lveh' ? 'Гранатомёт на багги: выстрел бьёт по площади 3 м.' : 'Отряд: урон ×1.6, броня.' });
    }
    const capt = sel.find(v => v.kind === 'captain' && v.owner === this.slot);
    if (hv) c.push({ act: 'tree', name: hv.hero!.pts ? `Прокачка · очков ${hv.hero!.pts}` : 'Прокачка', hot: 'P', icon: ICON.tier, ult: hv.hero!.pts > 0, queue: hv.hero!.pts || undefined, info: `Дерево способностей этого героя: уровень ${hv.hero!.lvl}, очков ${hv.hero!.pts}. У каждого героя своё дерево и свой опыт.` });
    if (sel.some(v => v.owner === this.slot && canFireGround(v.kind))) c.push({ act: 'fireground', name: 'Огонь по точке', hot: 'F', icon: ICON.attack, active: this.throwG === 8, info: 'Бить в выбранную точку без разведки — в том числе в туман. Отряд подойдёт на дальность и будет стрелять, пока не дадите другой приказ. Shift — в очередь.' });
    if (sel.some(v => v.kind === 'captain')) {
      let n = 0;
      ABILITIES.forEach((a, i) => {
        if (!a.cd || !(this.cap.abil & (1 << i))) return;
        const cd = this.cap.cd[i] ?? 0;
        c.push({ act: 'ab' + i, name: a.name, hot: String(++n), icon: ABIL_ICON[i] ?? ICON.attack, info: a.info, cd, cdMax: a.cd, ult: i === 5 });
      });
    }
    return c;
  }

  private cellHtml(x: Cell) {
    if (!x.act && !x.name) return '<span class="lc-cmd__cell lc-cmd__cell--empty"></span>';
    const locked = !!x.req || x.ok === false || x.done, cooling = (x.cd ?? 0) > 0 || x.prog !== undefined;
    const cls = ['lc-cmd__cell', x.active ? 'lc-cmd__cell--active' : '', locked && !cooling ? 'lc-cmd__cell--locked' : '', cooling ? 'lc-cmd__cell--cooldown' : '', x.ult ? 'ult' : '', x.done ? 'done' : ''].filter(Boolean).join(' ');
    const shade = x.prog !== undefined ? 100 - x.prog : x.cd ? (x.cd / (x.cdMax ?? x.cd)) * 100 : 0;
    const icon = x.art ? miniArt(x.art) : x.icon;
    const cost = x.done ? '✓' : x.cost || x.en || x.rel ? [x.cost ? `◆${x.cost}` : '', x.en ? `ϟ${x.en}` : '', x.rel ? `⌂${x.rel}` : ''].filter(Boolean).join(' ') : '';
    return `<button class="${cls}" data-act="${x.act}" data-hot="${x.hot.toLowerCase()}" ${x.active ? 'aria-pressed="true"' : ''} ${locked ? 'aria-disabled="true"' : ''} style="--cd:${shade}%">${icon}<span class="lc-cmd__key">${x.hot}</span>${cost ? `<span class="lc-cmd__cost">${cost}</span>` : ''}${cooling ? `<span class="lc-cmd__timer">${x.left !== undefined ? x.left + ' с' : x.prog !== undefined ? x.prog + '%' : x.cd}</span>` : ''}${x.queue ? `<span class="lc-cmd__charges">${x.queue}</span>` : ''}</button>`;
  }

  /** Меню строителя: как в Dawn of War / UA — все постройки в одном окне, без вкладок по типу. */
  private buildMenuHtml(sel: View[]) {
    const F = FACTIONS[this.fac()], bs = sel.filter(v => v.kind === 'builder');
    const own = (k: Kind) => [...this.views.values()].some(v => v.owner === this.slot && v.kind === k);
    const keyKind = (): Kind | null => { for (let t = 1; t <= Math.min(this.tier, 4); t++) if (!own(('key' + t) as Kind)) return ('key' + t) as Kind; return this.tier >= 5 && !own('gate') ? 'gate' : null; };
    const card = (k: Buildable, name: string, hot: string, info: string, req?: string) => {
      if (UA_REQ[this.fac()]?.[k]) req = this.uaReq(k); // раса UA — требования мода вместо тиров
      if (UA_REQ[this.fac()]) { // раса UA — что здание нанимает по моду (тексты игры про тиры к ней не относятся)
        const f = this.fac(), who = [...(HERO_AT[f] === k ? [Object.values(ARCH_OPTS[f])[0]?.name ?? 'герой'] : []), ...producible(k as Kind, f).filter(x => x !== 'builder').map(x => this.kindName(x, f))];
        if (who.length) info = `Нанимает: ${who.join(', ')}.`;
      }
      const p = this.price(statOf(k, this.fac()).cost, energyOf(k, this.fac())), lack = (n: number, have: number) => (n > have ? ' class="lack"' : '');
      const cost = req ? `<span>${req}</span>` : [p.cost ? `<span${lack(p.cost, this.req)}>◆ ${p.cost}</span>` : '', p.en ? `<span${lack(p.en, this.energy)}>ϟ ${p.en}</span>` : '', `<span>⧗ ${statOf(k, this.fac()).time} с</span>`].join('');
      return { k, html: `<button class="lc-bcard${req ? ' lc-bcard--locked' : ''}" data-act="${req ? '' : k}" data-tipname="${name}" data-tipinfo="${info}${req ? ` ${req}.` : ''}" ${req ? 'aria-disabled="true"' : ''} ${this.place === k ? 'aria-pressed="true"' : ''}>${miniArt(artFor(k as Kind, this.fac(), 1))}<span><span class="lc-bcard__name">${name}</span><span class="lc-bcard__cost">${cost}</span></span><kbd>${hot}</kbd></button>` };
    };
    const tabs: [string, ReturnType<typeof card>[]][] = [
      ['Экономика', [card('post', BUILD_NAME[this.fac()].post, 'P', `Ставится на захваченную точку: держит её и даёт +2 ${this.incomeRes()}/с.`), card('foundry', BUILD_NAME[this.fac()].foundry, 'F', '+2 энергии/с. Ставится у своей точки или построек.'), card('pump', BUILD_NAME[this.fac()].pump, 'N', '+4 энергии/с. На жилу или у своей точки.')]],
      ['Армия', [card('barracks', BUILD_NAME[this.fac()].barracks, 'B', `Нанимает: ${F.guard}. Строится рядом со штабом.`), card('motorpool', PROD_NAME[this.fac()].motorpool, 'T', 'Вся техника и артиллерия фракции. Тир III.', this.tier < 3 ? 'Нужен тир III' : undefined), card('yard', PROD_NAME[this.fac()].yard, 'U', 'Строит титана. Одна армия — один титан. Тир IV.', this.tier < 4 ? 'Нужен тир IV' : undefined),
        ]],
      ['Оборона', [...(NO_BUILD[this.fac()]?.includes('turret') ? [] : [card('turret', BUILD_NAME[this.fac()].turret, 'Y', TURRET_FAC[this.fac()]?.info ?? 'Стреляет сама, голова поворачивается к цели.')]), ...(NO_BUILD[this.fac()]?.includes('wall') ? [] : [card('wall', 'Стена', 'L', 'Протяжка: клик — начало, клик — конец. 30 за сегмент.'), card('wallgate', 'Ворота', 'G', 'Свои проходят, чужие нет.'), card('bunker', 'Бункер', 'X', 'Пехота рядом получает −50% урона.', this.tier < 2 ? 'Нужен тир II' : undefined)]), card('mine', 'Мина', 'V', 'Невидима врагу, 180 урона по 6 м.'),
        ]],
      ['Святыни', (() => {
        const extra = card('hq', HQ_NAME[this.fac()], '·', 'Ещё один штаб: нанимает строителей, держит базу. Ставится у своей точки или построек; проигрыш — когда пали штабы и все здания найма.', this.tier < 2 ? 'Нужен тир II' : undefined); const k = keyKind(); return k ? [extra, card(k as Buildable, k === 'gate' ? F.gate : F.keys[Number(k[3]) - 1], 'K', k === 'gate' ? 'Врата призыва легенд, тир V.' : `Ключевое здание тира ${['I', 'II', 'III', 'IV'][Number(k[3]) - 1]}: открывает переход и 4 исследования.`)] : [extra]; })()],
    ];
    const all = tabs.flatMap(t => t[1]).filter(c => !NO_BUILD[this.fac()]?.includes(c.k)); // у рас UA — только их постройки из UA
    return `<div class="lc-buildhead">${miniArt(artFor('builder', this.fac()))}<div><div class="lc-buildhead__who">${F.builder} ×${bs.length}</div><div class="lc-buildhead__meta">скорость стройки ×${bs.length}</div></div><button class="lc-btn lc-btn--sm lc-btn--ghost" data-act="cmdgrid">Команды ▸</button></div>`
      + `<div class="lc-build">${all.map(x => x.html).join('')}</div>`
      + `<p class="lc-buildhint">${this.place ? '<b>ЛКМ</b> поставить · <b>Shift</b> несколько · <b>ПКМ</b>/<b>Esc</b> отмена' : '<b>B P Y F N W G X V K</b> — сразу в установку'}</p>`;
  }

  /** Карточка выбранного (пресет UnitCard); группа — сетка малых портретов. */
  private cardHtml(sel: View[]) {
    if (!sel.length) return '';
    if (sel.length > 1) return `<div class="w2d-group">${sel.slice(0, 18).map(v => `<button class="w2d-gp${v.owner !== this.slot ? ' foe' : ''}" data-pick="${v.id}">${miniArt(v.artPath)}<i style="--v:${Math.max(0, v.hp / this.mhp(v)) * 100}%"></i></button>`).join('')}${sel.length > 18 ? `<span class="w2d-more">+${sel.length - 18}</span>` : ''}</div>`;
    const v = sel[0], st = this.st(v), foe = v.owner !== this.slot, max = this.mhp(v), hp = Math.max(0, Math.round(v.hp));
    const melee = isMelee(v.kind, this.fac(v.owner));
    const cls = v.kind === 'captain' ? `Герой · ур. ${foe ? '?' : this.cap.lvl}` : v.kind === 'builder' ? 'Строитель' : v.kind === 'guard' || (UA_SQ[this.fac(v.owner)] && (v.kind === 'support' || v.kind === 'sniper')) ? `Пехота · ${(v.kind === 'guard' ? melee : this.uaMelee(v.kind, this.fac(v.owner))) ? 'ближний бой' : 'стрелки'}` : v.kind === 'legend' ? 'Легенда' : ({ deity: 'Бог · летает', titan: 'Титан', arty: `Артиллерия · мёртвая зона ${MIN_RANGE.arty} м`, lveh: 'Лёгкая техника', mveh: 'Средняя техника', hveh: 'Тяжёлая техника', sniper: 'Снайпер', heavy: 'Тяжёлое оружие', support: 'Поддержка', elite: 'Тяжёлая элита', healer: 'Целитель' } as Partial<Record<Kind, string>>)[v.kind] ?? 'Постройка';
    const stats: [string, string][] = [];
    const tf = modOf(this.fac(v.owner), v.kind), guardMelee = v.kind === 'guard' && melee;
    const weaponType = tf?.type ?? (v.kind === 'turret' && v.lvl > 1 ? 'heavy' : dmgOf(v.kind, this.fac(v.owner)));
    if (st.dmg && v.kind !== 'mine') {
      const base = guardMelee ? MELEE_GUARD.dmg : v.kind === 'post' && v.lvl >= 3 ? 14 : st.dmg;
      const damage = base * (tf?.dmg ?? 1) * (v.lvl > 1 ? LVL2.dmg[v.kind] ?? 1 : 1);
      const count = SQUADS.has(v.kind) || this.sq.has(v.id) ? this.cnt(v) : 1;
      const range = (guardMelee ? MELEE_GUARD.range : v.kind === 'post' && v.lvl >= 3 ? 12 : st.range + (tf?.range ?? 0) + (v.lvl > 1 ? tf?.up?.range ?? 0 : 0)) + (v.lvl > 1 ? LVL2.range[v.kind] ?? 0 : 0);
      const specialRange = v.kind === 'captain' && v.arch === 'mystic' || v.kind === 'deity' && v.arch !== 'assault';
      stats.push(['ЗАЛП (БАЗА)', SQUADS.has(v.kind) ? `${statNumber(damage)}×${count} = ${statNumber(damage * count)}` : statNumber(damage)], ['ИНТЕРВАЛ', statNumber(guardMelee ? MELEE_GUARD.cd : st.cd * (tf?.cd ?? 1)) + ' с'], ['ДАЛ.', specialRange ? 'по архетипу' : statNumber(range) + ' м'], ['ОРУЖИЕ', damageName[weaponType]]);
    }
    if (v.kind === 'mine') stats.push(['ВЗРЫВ (БАЗА)', statNumber(st.dmg)]);
    stats.push(['БРОНЯ', armorName[armorOf(v.kind, this.fac(v.owner))]]);
    const mo = this.mo.get(v.id); if (mo) stats.push(['МОРАЛЬ', mo[1] ? `${mo[0]}% · надломлен` : `${mo[0]}%`]); // как в UA: надломленный отряд мажет и бежит быстрее
    if (st.speed) stats.push(['СКОР. (БАЗА)', statNumber(guardMelee ? MELEE_GUARD.speed : st.speed)]);
    if (this.reinforceable(v)) stats.push(['БОЙЦЫ', `${this.cnt(v)}/${this.sq.get(v.id)?.[2] ?? st.n}`]); // живых / максимум отряда
    if (v.lvl > 1) stats.push(['УР.', `<b class="up">▲${v.lvl}</b>`]);
    if (isStruct(v.kind) && v.build < 1) stats.push(['СТРОЙКА', `${Math.round(v.build * 100)}%`]);
    if (v.hero && !foe) stats.push(['ОПЫТ', v.hero.lvl >= MAX_LVL ? 'предел' : `${v.hero.xp}/${xpNeed(v.hero.lvl)}`], ...(v.hero.pts ? [['ОЧКИ', `<b class="up">${v.hero.pts}</b>`] as [string, string]] : [])); // прокачка — кнопка P в панели команд
    return `<div class="lc-unit${foe ? ' foe' : ''}"><div class="lc-unit__portrait">${miniArt(v.artPath)}<span class="lc-unit__rank">${['I', 'II', 'III'][Math.min(2, v.lvl - 1)]}</span></div><div><h3 class="lc-unit__name">${this.nameOf(v).replace(/[<>&]/g, '')}</h3><p class="lc-unit__class">${cls}${foe ? ' · враг' : ''}</p><div class="lc-vitals"><div class="lc-vitals__bar" style="--v:${(hp / max) * 100}%"></div><div class="lc-vitals__nums"><span>Здоровье</span><span><b>${hp}/${max}</b></span></div></div><p class="lc-unit__stats" title="Основное оружие: база с улучшением модели и фракционным модификатором, до аур, исследований, бонусов героя и защиты цели.">${stats.map(([a, b]) => `<span>${a} <b>${b}</b></span>`).join('')}</p>${st.dmg && v.kind !== 'mine' ? `<p class="lc-unit__class" title="Множители типа оружия: ${weaponCounters(weaponType)}. Дополнительная защита цели применяется отдельно.">По броне: ${weaponCounters(weaponType, true)}</p>${CLOSE[v.kind] ? `<p class="lc-unit__class">Дополнительное оружие до ${CLOSE[v.kind]!.range} м.${v.kind === 'heavy' || v.kind === 'hveh' ? ' Против брони сохраняется более эффективный ствол.' : ''}</p>` : ''}` : ''}${!foe && isStruct(v.kind) && v.build >= 1 && (producible(v.kind, this.fac(v.owner)).length || v.kind === 'hq' || v.kind === 'barracks') ? this.queueSlots(v) : ''}</div></div>`;
  }

  private renderCmd() {
    const sel = this.selected(), key = [...this.sel].join(',');
    if (key !== this.lastSelKey) { this.lastSelKey = key; this.buildOpen = sel.length > 0 && sel.every(v => v.kind === 'builder'); this.treeOpen = false; }
    const builders = sel.some(v => v.kind === 'builder') && !sel.some(v => isStruct(v.kind));
    if (!builders) this.buildOpen = false;
    this.cells = this.buildCells(sel);
    let panel: string;
    if (this.buildOpen) panel = this.buildMenuHtml(sel);
    else {
      const grid = this.cells.slice(0, 12);
      while (grid.length < 12) grid.push({ act: '', name: '', hot: '', icon: '' });
      panel = sel.length ? `<div class="lc-cmd" role="toolbar" aria-label="Команды">${grid.map(x => this.cellHtml(x)).join('')}</div>` : `<p class="lc-buildhint">ЛКМ — выбрать, рамка — группа · ПКМ — приказ, с Shift — в очередь · WASD — камера · Q — атака с ходу · Z — стоп · Пробел — капитан · H — штаб · колесо — масштаб, зажатое колесо — тянуть карту</p>`;
    }
    const card = this.cardHtml(sel);
    if (panel !== this.cmdHtml) { this.cmdHtml = panel; $('hud-cmd').innerHTML = panel; if (this.tipAct && $('hud-cmd').matches(':hover')) this.showTip(this.tipAct); else this.hideTip(); } // мышь ушла — подсказку не возвращаем
    if (card !== this.cardHtmlLast) { this.cardHtmlLast = card; $('hud-card').innerHTML = card; $('hud-card').classList.toggle('hidden', !card); }
    this.qTick();
  }
  private cardHtmlLast = '';

  /** Подсказка (пресет Tooltip): имя, клавиша, цена с нехваткой, описание, невыполненные требования. */
  private showTip(act: string, el?: HTMLElement) {
    const tip = $('hud-tip'), x = this.cells.find(c => c.act === act && act);
    if (act && (!el || !el.isConnected)) el = $('hud-cmd').querySelector<HTMLElement>(`[data-act="${act}"]`) ?? el; // сетка перерисовалась
    this.tipAct = act;
    let html = '';
    if (x) {
      const lack = (n: number, have: number) => (n > have ? ' class="lack"' : '');
      const cost = [x.cost ? `<span${lack(x.cost, this.req)}>◆ ${x.cost} влияния</span>` : '', x.en ? `<span${lack(x.en, this.energy)}>ϟ ${x.en} энергии</span>` : '', x.rel ? `<span${lack(x.rel, this.relics)}>⌂ ключевая точка</span>` : '', x.cdMax ? `<span>⧗ ${x.cdMax} с</span>` : ''].filter(Boolean).join('');
      html = `<p class="lc-tip__title"><strong>${x.name}</strong><kbd>${x.hot}</kbd></p>${cost ? `<p class="lc-tip__cost">${cost}</p>` : ''}<p class="lc-tip__body">${x.info ?? ''}</p>${x.req ? `<p class="lc-tip__req">${/^Нужн/.test(x.req) ? x.req : 'Нужно: ' + x.req}</p>` : ''}`;
    } else if (el?.dataset.tipname) html = `<p class="lc-tip__title"><strong>${el.dataset.tipname}</strong><kbd>${el.querySelector('kbd')?.textContent ?? ''}</kbd></p><p class="lc-tip__body">${el.dataset.tipinfo ?? ''}</p>`;
    tip.innerHTML = html;
    tip.classList.toggle('hidden', !html);
    if (el && html) { const r = el.getBoundingClientRect(), pr = $('hud-bottom').getBoundingClientRect(); tip.style.left = Math.min(innerWidth - 316, Math.max(8, r.left)) + 'px'; tip.style.bottom = innerHeight - pr.top + 8 + 'px'; }
  }
  private hideTip() { this.tipAct = ''; $('hud-tip').classList.add('hidden'); }

  private nextKey(): Buildable | null {
    const own = (k: Kind) => [...this.views.values()].some(v => v.owner === this.slot && v.kind === k);
    for (let t = 1; t <= Math.min(this.tier, 4); t++) if (!own(('key' + t) as Kind)) return ('key' + t) as Buildable;
    return this.tier >= 5 && !own('gate') ? 'gate' : null;
  }

  private doAct(act: string) {
    const sel = this.selected();
    if (act === 'tree') { this.treeOpen = !this.treeOpen; return; }
    if (act.startsWith('learn:')) { this.cmd({ c: 'learn', a: Number(act.slice(6)), id: this.heroView()?.id }); return; }
    if (act.startsWith('uaw:')) { const g = sel.find(v => UA_ARM[this.fac(v.owner)]?.[v.kind]); if (g) this.cmd({ c: 'uaw', id: g.id, w: Number(act.slice(4)) }); return; }
    if (act.startsWith('uaa:')) { const b = sel.find(v => isStruct(v.kind)); if (b) this.cmd({ c: 'uaa', id: b.id, a: Number(act.slice(4)) }); return; }
    if (act.startsWith('uar:')) { const b = sel.find(v => isStruct(v.kind)); if (b) this.cmd({ c: 'uar', id: b.id, r: Number(act.slice(4)) }); return; }
    if (act.startsWith('unlock:')) { const k = sel.find(v => v.kind === 'hq'); if (k) this.cmd({ c: 'unlock', id: k.id, u: Number(act.slice(7)) }); return; }
    if (act === 'strike') { this.throwG = 9; this.root.style.cursor = 'crosshair'; return; } // прицел удара сверхоружием
    if (act === 'scan') { this.throwG = 10; this.root.style.cursor = 'crosshair'; return; } // прицел засвета
    if (act === 'timestop') { this.cmd({ c: 'timestop' }); return; }
    if (act.startsWith('hero:')) { const st = sel.find(v => isStruct(v.kind)); this.cmd({ c: 'hero', a: act.slice(5) as Arch, id: st?.id }); return; }
    if (act.startsWith('train:')) { const st = sel.find(v => isStruct(v.kind)); if (st) this.cmd({ c: 'train', id: st.id, k: act.slice(6) as Kind }); return; }
    if (act.startsWith('gear:')) { this.cmd({ c: 'gear', ids: [...this.sel], g: Number(act.slice(5)) }); return; }
    if (act === 'fireground') { this.throwG = 8; this.root.style.cursor = 'crosshair'; return; } // прицел огня по земле
    if (act.startsWith('throw:')) { this.throwG = Number(act.slice(6)); this.root.style.cursor = 'crosshair'; return; }
    if (act === 'repair') {
      const b = sel.find(v => v.kind === 'builder'), fix = [...this.views.values()].filter(v => v.owner === this.slot && v.build >= 1 && (isStruct(v.kind) || VEHICLES.has(v.kind)) && v.hp < this.mhp(v) - 1);
      if (b && fix.length) this.cmd({ c: 'assist', ids: [...this.sel], id: fix.sort((p, q) => Math.hypot(p.x - b.x, p.y - b.y) - Math.hypot(q.x - b.x, q.y - b.y))[0].id });
      return;
    }
    if (act === 'amove' || act === 'move') { if (!sel.some(v => !isStruct(v.kind) && v.owner === this.slot)) return; this.amove = act === 'amove'; this.moveMode = act === 'move'; this.place = null; this.ghost.classList.add('hidden'); this.root.style.cursor = 'crosshair'; return; }
    if (act === 'stop') { if (this.sel.size) this.cmd({ c: 'stop', ids: [...this.sel] }); return; }
    if (act === 'buildmenu') { if (sel.some(v => v.kind === 'builder')) this.buildOpen = true; return; }
    if (act === 'cmdgrid') { this.buildOpen = false; return; }
    if (act === 'train') { const st = sel.find(v => isStruct(v.kind)); if (st) this.cmd({ c: 'train', id: st.id }); }
    else if (/^ab\d$/.test(act)) this.cmd({ c: 'ability', a: Number(act.slice(2)), id: this.heroView()?.id });
    else if (act === 'tier') { const hq = sel.find(v => v.kind === 'hq'); if (hq) this.cmd({ c: 'upgrade', id: hq.id }); }
    else if (/^res[0-3]$/.test(act)) { const k = sel.find(v => /^key/.test(v.kind)); if (k) this.cmd({ c: 'research', id: k.id, r: Number(act[3]) }); }
    else if (/^sum[0-2]$/.test(act)) { const g = sel.find(v => v.kind === 'gate'); if (g) this.cmd({ c: 'summon', id: g.id, v: Number(act[3]) }); }
    else if (/^key[1-4]$|^gate$/.test(act)) { if (sel.some(v => v.kind === 'builder')) this.startPlace(act as Buildable); }
    else if (['motorpool', 'yard', 'lighthouse', 'obelisk', 'megagun', 'plague', 'spire', 'hq', 'barracks', 'post', 'turret', 'foundry', 'pump', 'wall', 'wallgate', 'bunker', 'mine', 'aegis', 'rturret', 'fturret', 'battery', 'pylon', 'pyre', 'bell', 'warpgate', 'portal'].includes(act)) { if (sel.some(v => v.kind === 'builder')) this.startPlace(act as Buildable); }
    else if (act === 'upgrade') { for (const v of sel) if ((upOf(this.fac(v.owner), v.kind) && v.lvl < 2 || v.kind === 'post') && v.upg < 0) this.cmd({ c: 'upgrade', id: v.id }); }
    else if (act === 'reinforce') this.cmd({ c: 'reinforce', ids: sel.filter(v => this.reinforceable(v)).map(v => v.id) });
  }

  private startPlace(k: Buildable) {
    this.place = k; this.amove = false; this.root.classList.add('placing');
    const a = foot(k) * BCELL * S; // квадратный след по клеткам сетки
    Object.assign(this.ghost.style, { width: a + 'px', height: a + 'px' });
    this.root.style.cursor = 'copy';
    this.renderCmd();
  }
  private stopPlace() { this.root.classList.remove('placing'); this.wallStart = null; this.wallLine?.setAttribute('visibility', 'hidden'); this.place = null; this.ghost.classList.add('hidden'); this.root.style.cursor = ''; this.cmdHtml = ''; this.renderCmd(); }

  // ---------- ввод ----------
  private cmd(c: Cmd) {
    if (this.ended) return;
    this.send(c); audio.order();
    const lead = this.selected().find(v => !isStruct(v.kind) && v.owner === this.slot); // реплика ведущего юнита
    if (lead && (c.c === 'move' || c.c === 'amove' || c.c === 'attack' || c.c === 'throw')) voice.say(this.fac(), lead.kind, c.c === 'move' ? 'move' : 'attack');
  }
  /** Реплика на выбор: говорит первый выбранный свой юнит. */
  private greet() { const v = this.selected().find(u => u.owner === this.slot && !isStruct(u.kind)); if (v) voice.say(this.fac(), v.kind, 'select'); }

  private audioAt(x: number, y: number) {
    const p = this.toScreen(x, y), r = this.root.getBoundingClientRect();
    return p.x > r.left - 40 && p.x < r.right + 40 && p.y > r.top - 40 && p.y < r.bottom + 40 ? { pan: Math.max(-0.8, Math.min(0.8, ((p.x - r.left) / r.width - 0.5) * 1.6)) } : null;
  }

  private toScreen(x: number, y: number) {
    const r = this.root.getBoundingClientRect(), z = this.cam.zoom;
    return { x: r.left + r.width / 2 + (x - this.cam.x) * S * z, y: r.top + r.height / 2 + (y - this.cam.y) * S * z };
  }
  private toWorld(sx: number, sy: number) {
    const r = this.root.getBoundingClientRect(), z = this.cam.zoom;
    return { x: this.cam.x + (sx - r.left - r.width / 2) / (S * z), y: this.cam.y + (sy - r.top - r.height / 2) / (S * z) };
  }

  private bind() {
    const cv = this.root, sig = { signal: this.ac.signal };
    addEventListener('contextmenu', e => e.preventDefault(), sig); // на всё окно: ПКМ по меню стройки и HUD не открывает меню браузера
    cv.addEventListener('pointerdown', e => {
      if ((e.target as HTMLElement).closest('#hud')) return;
      if (e.button === 1) { e.preventDefault(); this.pan = { x: e.clientX, y: e.clientY }; cv.style.cursor = 'grabbing'; return; } // колесо зажато — тянем карту
      if (e.button === 0) this.drag = { x0: e.clientX, y0: e.clientY, x1: e.clientX, y1: e.clientY };
      else if (e.button === 2) { if (this.place) this.stopPlace(); else { this.amove = false; cv.style.cursor = ''; this.order(e.clientX, e.clientY, e.shiftKey); } }
    }, sig);
    document.addEventListener('pointerleave', () => { this.mouse = null; }, sig); // мышь ушла из окна — край не крутит; над панелями HUD — крутит
    addEventListener('pointerup', e => { if (e.button === 1 && this.pan) { this.pan = null; cv.style.cursor = ''; } }, sig);
    addEventListener('pointermove', e => {
      this.mouse = { x: e.clientX, y: e.clientY };
      if (this.pan) { const z = S * this.cam.zoom; this.cam.x = Math.max(0, Math.min(MAP.w, this.cam.x - (e.clientX - this.pan.x) / z)); this.cam.y = Math.max(0, Math.min(MAP.h, this.cam.y - (e.clientY - this.pan.y) / z)); this.pan = { x: e.clientX, y: e.clientY }; return; }
      if (!this.drag) return;
      this.drag.x1 = e.clientX; this.drag.y1 = e.clientY;
      const b = $('selbox'), d = this.drag, moved = Math.hypot(d.x1 - d.x0, d.y1 - d.y0) > 6;
      b.classList.toggle('hidden', !moved);
      if (moved) Object.assign(b.style, { left: Math.min(d.x0, d.x1) + 'px', top: Math.min(d.y0, d.y1) + 'px', width: Math.abs(d.x1 - d.x0) + 'px', height: Math.abs(d.y1 - d.y0) + 'px' });
    }, sig);
    addEventListener('pointerup', e => {
      if (e.button !== 0 || !this.drag) return;
      const d = this.drag; this.drag = null;
      $('selbox').classList.add('hidden');
      if (Math.hypot(d.x1 - d.x0, d.y1 - d.y0) > 6 && !this.place) this.boxSelect(d, e.shiftKey);
      else this.click(e.clientX, e.clientY, e.shiftKey);
      this.renderCmd();
    }, sig);
    cv.addEventListener('wheel', e => { e.preventDefault(); this.cam.zoom = Math.max(0.2, Math.min(1.8, this.cam.zoom * (1 - Math.sign(e.deltaY) * 0.1))); }, { passive: false, ...sig });
    addEventListener('keydown', e => {
      if (e.target instanceof HTMLInputElement && e.target.offsetParent) return; // фокус в скрытом поле меню не глушит клавиши матча
      const k = keyOf(e);
      if (!e.metaKey && !e.ctrlKey) this.keys.add(k); // Cmd+S и т. п. не двигают камеру: keyup буквы при зажатом Cmd не приходит
      const hit = /^[a-z]$/.test(k) && !this.buildOpen ? this.cells.find(c => c.act && c.hot.toLowerCase() === k) : undefined;
      if (hit) { this.doAct(hit.act); this.renderCmd(); return; } // клавиша ячейки сетки важнее общих
      if (k === 'q') this.doAct('amove'); // WASD — камера
      else if (k === 'm') this.doAct('move');
      else if (k === 'c') this.doAct('buildmenu');
      else if (k === 't') this.doAct('train');
      else if (k === 'b') this.doAct('barracks');
      else if (k === 'p') this.doAct('post');
      else if (k === 'y') this.doAct('turret');
      else if (k === 'f') this.doAct('foundry');
      else if (k === 'n') this.doAct('pump');
      else if (k === 'l') this.doAct('wall');
      else if (k === 'g') this.doAct('wallgate');
      else if (k === 'x') this.doAct('bunker');
      else if (k === 'v') this.doAct('mine');
      else if (k === 'o') this.doAct(this.selected().some(v => v.kind === 'hq' && v.owner === this.slot) ? 'scan' : 'fturret'); // штаб: засвет
      else if (k === 'k') { const n = this.nextKey(); if (n) this.doAct(n); }
      else if (/^[1-9]$/.test(k)) { const x = this.cells.find(c => c.hot === k && c.act); if (x) this.doAct(x.act); }
      else if (k === 'u') this.doAct('upgrade');
      else if (k === 'r') this.doAct('reinforce');
      else if (k === 'z') this.doAct('stop');
      else if (k === ' ') { e.preventDefault(); this.selectOwn('captain'); }
      else if (k === 'h') this.selectOwn('hq');
      else if (e.key === 'F9' && import.meta.env.DEV) { e.preventDefault(); this.cmd({ c: 'cheat' }); }
      else if (k === 'escape') { if (this.throwG >= 0) { this.throwG = -1; this.aimRing.style.display = 'none'; cv.style.cursor = ''; } else if (this.place) this.stopPlace(); else if (this.buildOpen) this.buildOpen = false; else if (this.amove || this.moveMode) { this.amove = this.moveMode = false; cv.style.cursor = ''; } else this.sel.clear(); this.lastSelKey = [...this.sel].join(','); }
      this.renderCmd();
    }, sig);
    addEventListener('keyup', e => this.keys.delete(keyOf(e)), sig);
    addEventListener('blur', () => this.keys.clear(), sig); // окно потеряло фокус — камера не едет сама
    $('out-watch').addEventListener('click', () => this.watch(), sig);
    $('hud-heroes').addEventListener('click', e => { e.stopPropagation(); const t = (e.target as HTMLElement).closest<HTMLElement>('[data-focus]'); if (t) this.focus(Number(t.dataset.focus)); }, sig);
    $('hud-queue').addEventListener('click', e => { const t = (e.target as HTMLElement).closest<HTMLElement>('[data-sel]'); if (t) this.focus(Number(t.dataset.sel)); }, sig); // плашка здания — выбрать его
    const hc = $('hud-cmd');
    hc.addEventListener('click', e => {
      const b = (e.target as HTMLElement).closest<HTMLElement>('button');
      if (!b) return;
      if (b.dataset.act) this.doAct(b.dataset.act); // запертая ячейка тоже шлёт команду — сервер ответит, чего не хватает
      this.renderCmd();
    }, sig);
    let tipT = 0;
    hc.addEventListener('pointerover', e => { // подсказка через 250 мс после наведения
      const b = (e.target as HTMLElement).closest<HTMLElement>('[data-act]');
      clearTimeout(tipT);
      if (!b) return this.hideTip();
      tipT = window.setTimeout(() => this.showTip(b.dataset.act ?? '', b), 250);
    }, sig);
    hc.addEventListener('pointerleave', () => { clearTimeout(tipT); this.hideTip(); }, sig);
    $('hud-card').addEventListener('click', e => { const q = (e.target as HTMLElement).closest<HTMLElement>('[data-b]'); if (q) return this.cmd({ c: 'cancel', id: Number(q.dataset.b), i: Number(q.dataset.i) }); // отмена места в очереди
      const id = (e.target as HTMLElement).closest<HTMLElement>('[data-pick]')?.dataset.pick; if (id) { this.sel.clear(); this.sel.add(Number(id)); this.renderCmd(); } }, sig);
  }

  private pick(sx: number, sy: number, want: (v: View) => boolean) {
    const w = this.toWorld(sx, sy);
    let best: View | null = null, bd = 1e9;
    const minReach = 16 / (S * this.cam.zoom); // на отдалении попадаем хотя бы в 16 px вокруг
    for (const v of this.views.values()) {
      if (!want(v)) continue;
      const size = widthOf(v.kind, this.fac(v.owner)); // кликаем по силуэту: высокие танки и титаны — по корпусу, а не только у ног
      const cy = v.y - (isStruct(v.kind) ? this.st(v).radius * 0.6 : Math.max(0.8, size * 0.4));
      const d = Math.hypot(w.x - v.x, w.y - cy), reach = Math.max(this.st(v).radius + (isStruct(v.kind) ? 1.5 : 1.2), isStruct(v.kind) ? 0 : size * 0.5, minReach);
      if (d < reach && d / reach < bd) { bd = d / reach; best = v; }
    }
    return best;
  }

  private mobile = (v: View) => v.owner === this.slot && !isStruct(v.kind) && !v.dead;
  private ownStruct = (v: View) => v.owner === this.slot && isStruct(v.kind);

  private wallStart: { x: number; y: number } | null = null;

  private click(sx: number, sy: number, add: boolean) {
    if (this.place === 'wall') { // стена: первый клик — начало, второй — конец
      const p = this.toWorld(sx, sy), ids = this.selected().filter(v => v.kind === 'builder').map(v => v.id);
      if (!this.wallStart) { this.wallStart = p; return; }
      if (ids.length) this.cmd({ c: 'wall', ids, x1: this.wallStart.x, y1: this.wallStart.y, x2: p.x, y2: p.y, q: add });
      this.wallStart = null; this.wallLine.setAttribute('visibility', 'hidden');
      if (!add) this.stopPlace();
      return;
    }
    if (this.place) {
      const sp = this.placePoint(sx, sy), ids = this.selected().filter(v => v.kind === 'builder').map(v => v.id);
      if (sp && ids.length) this.cmd({ c: 'build', ids, kind: this.place, x: sp.x, y: sp.y, q: add }); // Shift: следующая постройка в очередь строителям
      if (sp?.ok && !add) this.stopPlace();
      return;
    }
    if (this.throwG >= 0) { // бросок снаряжения в точку (GrenadeTargeting)
      const p = this.toWorld(sx, sy);
      if (this.throwG === 9) this.cmd({ c: 'strike', x: p.x, y: p.y }); else if (this.throwG === 10) this.cmd({ c: 'scan', x: p.x, y: p.y }); else if (this.throwG === 8) this.cmd({ c: 'fire', ids: [...this.sel], x: p.x, y: p.y, q: add }); else this.cmd({ c: 'throw', ids: [...this.sel], g: this.throwG, x: p.x, y: p.y });
      this.marker(p.x, p.y, 'attack');
      this.throwG = -1; this.root.style.cursor = ''; this.aimRing.style.display = 'none';
      this.renderCmd();
      return;
    }
    if (this.amove || this.moveMode) {
      const c = this.amove ? 'amove' : 'move';
      this.amove = this.moveMode = false; this.root.style.cursor = '';
      const p = this.toWorld(sx, sy);
      if (this.sel.size) { this.cmd({ c, ids: [...this.sel], x: p.x, y: p.y, q: add }); this.marker(p.x, p.y, c); }
      this.renderCmd();
      return;
    }
    const v = this.pick(sx, sy, this.mobile) ?? this.pick(sx, sy, this.ownStruct) ?? this.pick(sx, sy, u => u.owner !== this.slot && !u.dead); // чужого можно выбрать, чтобы осмотреть
    if (!add || (v && (isStruct(v.kind) || v.owner !== this.slot)) || [...this.sel].some(id => this.views.get(id)?.owner !== this.slot)) this.sel.clear();
    if (v) { this.sel.add(v.id); this.greet(); }
  }

  private boxSelect(d: { x0: number; y0: number; x1: number; y1: number }, add: boolean) {
    if (!add) this.sel.clear();
    const [x0, x1] = [Math.min(d.x0, d.x1), Math.max(d.x0, d.x1)], [y0, y1] = [Math.min(d.y0, d.y1), Math.max(d.y0, d.y1)];
    for (const v of this.views.values()) {
      if (!this.mobile(v)) continue;
      const p = this.toScreen(v.x, v.y - 0.6);
      if (p.x >= x0 && p.x <= x1 && p.y >= y0 && p.y <= y1) this.sel.add(v.id);
    }
    this.greet();
  }

  private selectOwn(kind: Kind) {
    for (const v of this.views.values()) if (v.owner === this.slot && v.kind === kind) { this.sel.clear(); this.sel.add(v.id); this.cam.x = v.x; this.cam.y = v.y; }
  }

  private placePoint(sx: number, sy: number): { x: number; y: number; ok: boolean } {
    const w = this.toWorld(sx, sy), vs = [...this.views.values()], structs = vs.filter(v => isStruct(v.kind) && !v.dead);
    const g = snapB(this.place!, w.x, w.y); // постройки встают по клеткам сетки, как на сервере
    if (Math.hypot(POINTS[0][0] - g.x, POINTS[0][1] - g.y) < 12) return { ...g, ok: false }; // у критической точки не строят
    const nearOwnPt = (x: number, y: number) => [...POINTS, ...RELICS].some(([px, py], i) => i !== 0 && this.pointOwner[i] === this.slot && Math.hypot(px - x, py - y) < 14);
    if (this.place === 'post') {
      const all = [...POINTS, ...RELICS], i = all.findIndex(([x, y]) => Math.hypot(x - g.x, y - g.y) < 9); // реликварии — тоже точки под пост
      if (i < 0) return { ...g, ok: false };
      const [x, y] = all[i];
      const taken = vs.some(v => v.kind === 'post' && Math.hypot(v.x - x, v.y - y) < 2);
      return { x, y, ok: this.pointOwner[i] === this.slot && !taken }; // только на своей точке, как на сервере
    }
    if (this.place === 'pump' || this.place === 'foundry') { // обычный генератор — где угодно, термо — на свободную жилу
      const pts = [...POINTS, ...RELICS].map(([x, y], i) => ({ x, y, owner: this.pointOwner[i] ?? -1 }));
      const an = this.place === 'pump' ? genAnchor(pts, structs, this.slot, g.x, g.y, this.place) : undefined, p = an ? { x: an.x, y: an.y } : g;
      const gens = structs.filter(v => v.owner === this.slot && (v.kind === 'pump' || v.kind === 'foundry')).length;
      return { ...p, ok: (this.place === 'foundry' || !!an) && gens < GEN_CAP && footFree(structs, this.place, p.x, p.y) };
    }
    const foePt = [...POINTS, ...RELICS].some(([px, py], i) => this.pointOwner[i] !== this.slot && Math.hypot(px - g.x, py - g.y) < POINT_R); // на чужой и ничьей точке не укрепляться
    if (this.place === 'wall') return { ...g, ok: !foePt && wallOk(structs, this.slot, g.x, g.y) };
    if (['mine', 'wallgate', 'bunker', 'portal'].includes(this.place ?? '')) return { ...g, ok: !foePt && footFree(structs, this.place!, g.x, g.y) && !vs.some(v => v.kind === 'hq' && v.owner !== this.slot && Math.hypot(v.x - g.x, v.y - g.y) < 20) };
    if (this.place === 'turret' || ['battery', 'pylon', 'pyre', 'bell', 'aegis', 'lighthouse', 'obelisk', 'megagun', 'plague', 'spire'].includes(this.place ?? '') || /^key|^gate/.test(this.place ?? '')) {
      const near = vs.some(v => v.owner === this.slot && isStruct(v.kind) && v.kind !== 'turret' && Math.hypot(v.x - g.x, v.y - g.y) < 16) || (['turret', 'battery', 'pylon', 'pyre', 'bell', 'lighthouse', 'obelisk', 'megagun', 'plague', 'spire', 'spire'].includes(this.place ?? '') && nearOwnPt(g.x, g.y));
      return { ...g, ok: near && footFree(structs, this.place!, g.x, g.y) };
    }
    if (this.place === 'hq') { // ещё один штаб: у своей точки или построек, не ближе 50 м к чужому штабу
      const nearOwn = nearOwnPt(g.x, g.y) || vs.some(v => v.owner === this.slot && isStruct(v.kind) && Math.hypot(v.x - g.x, v.y - g.y) < 30);
      const foeHq = vs.some(v => v.kind === 'hq' && v.owner !== this.slot && Math.hypot(v.x - g.x, v.y - g.y) < 50);
      return { ...g, ok: nearOwn && !foeHq && footFree(structs, 'hq', g.x, g.y) };
    }
    const hq = vs.find(v => v.kind === 'hq' && v.owner === this.slot), d = hq ? Math.hypot(hq.x - g.x, hq.y - g.y) : 99;
    return { ...g, ok: d >= 8 && d <= 32 && footFree(structs, this.place!, g.x, g.y) };
  }

  private order(sx: number, sy: number, q = false) { // q — Shift: приказ в очередь
    if (!this.sel.size) return;
    const sel = this.selected(), ids = [...this.sel];
    if (sel.length === 1 && isStruct(sel[0].kind)) return;
    const enemy = this.pick(sx, sy, v => v.owner !== this.slot && !v.dead);
    if (enemy) { this.markTarget(enemy, 'attack'); return this.cmd({ c: 'attack', ids, id: enemy.id, q }); }
    const site = this.pick(sx, sy, v => v.owner === this.slot && !v.dead && (isStruct(v.kind) || VEHICLES.has(v.kind)) && (v.build < 1 || v.hp < this.mhp(v) - 1)); // стройка или ремонт
    if (site && sel.some(v => v.kind === 'builder')) { this.markTarget(site, 'assist'); return this.cmd({ c: 'assist', ids, id: site.id, q }); }
    const p = this.toWorld(sx, sy);
    // Clicking near a capture marker snaps the move command to its center.
    // The server remains authoritative: progress only advances while units stand in range.
    const sites = [...POINTS, ...RELICS];
    let nearest = -1, distance = Infinity;
    sites.forEach(([x, y], i) => {
      const d = Math.hypot(p.x - x, p.y - y);
      if (d < distance) { nearest = i; distance = d; }
    });
    const target = nearest >= 0 && distance < POINT_R * 2.5 ? sites[nearest] : null;
    if (target) {
      this.points.forEach(point => point.ring.classList.remove('capture-commanded'));
      const ring = this.points[nearest]?.ring;
      ring?.classList.add('capture-commanded');
      setTimeout(() => ring?.classList.remove('capture-commanded'), 6000);
    }
    this.cmd({ c: 'move', ids, x: target?.[0] ?? p.x, y: target?.[1] ?? p.y, q });
    this.marker(target?.[0] ?? p.x, target?.[1] ?? p.y);
  }
  /** Цель приказа: кольцо под ней мигает (атака — красным, ремонт/стройка — зелёным). */
  private markTarget(v: View, tone: 'attack' | 'assist') {
    const sel = v.el.querySelector<HTMLElement>('.w2d-sel');
    sel?.animate([{ opacity: 1 }, { opacity: 0.2 }, { opacity: 1 }, { opacity: 0.2 }, { opacity: 1 }, { opacity: 0 }], { duration: 1300 });
    this.marker(v.x, v.y, tone === 'attack' ? 'attack' : 'move', this.st(v).radius + 1.2); // стрелки сходятся на цели
    v.el.classList.remove('tgt-attack', 'tgt-assist'); void v.el.offsetWidth; v.el.classList.add('tgt-' + tone);
    clearTimeout(Number(v.el.dataset.tgt)); v.el.dataset.tgt = String(window.setTimeout(() => v.el.classList.remove('tgt-' + tone), 1300));
  }

  /** Метка приказа как в Dawn of War: четыре стрелки сходятся в точку клика и гаснут; цвет — по типу приказа, r — радиус в метрах. */
  private marker(x: number, y: number, tone: 'move' | 'amove' | 'attack' = 'move', r = 1.6) {
    const m = document.createElement('div');
    m.className = 'w2d-marker ' + tone;
    m.style.setProperty('--w', r * 2 * S + 'px');
    m.innerHTML = '<u><span><i></i><i></i><i></i><i></i></span></u><b></b>';
    this.place2(m, x, y);
    setTimeout(() => m.remove(), 1000);
  }

  /** Зритель: таблица всех игроков — фракция, очки, ресурсы, тир, армия. */
  private specHud(s: Snap) {
    const rows = this.players.map((p, i) => {
      const pl = s.pl[i] ?? [], alive = pl[1], units = s.u.filter(u => u[1] === i && !isStruct(KINDS[u[2]])).length;
      return `<div class="w2d-specrow${alive ? '' : ' out'}"><i style="background:${hex(SLOT_COLORS[i])}"></i><b>${p.name.replace(/[<>&]/g, '')}</b><span>${FACTIONS[p.faction ?? 'tyranids'].name}</span><span>тир ${['I', 'II', 'III', 'IV', 'V'][(pl[2] ?? 1) - 1]}</span><span>◆${pl[0] ?? 0} ϟ${pl[3] ?? 0} ⌂${pl[4] ?? 0}</span><span>войск ${units}</span></div>`;
    }).join('');
    const html = `<div class="w2d-spechead">РЕЖИМ ПРОСМОТРА · без тумана · колесо — масштаб, WASD или стрелки — камера</div>${rows}`;
    if ($('hud-players').innerHTML !== html) $('hud-players').innerHTML = html;
    this.renderScore(s); this.drawMini(s); this.drawFog();
  }

  /** Видит ли игрок точку: в обзоре своих войск и построек (тот же расчёт, что на сервере). */
  private inSight(x: number, y: number) {
    for (const v of this.views.values()) if (v.owner === this.slot && !v.dead && Math.hypot(v.x - x, v.y - y) < Math.max(this.sight(v), isStruct(v.kind) ? 12 : 10)) return true;
    if (this.scans.some(([sx, sy, sr]) => Math.hypot(sx / 10 - x, sy / 10 - y) < (sr ?? MEGA_SHOT.reveal))) return true;
    return this.ownPoints().some(([px, py]) => Math.hypot(px - x, py - y) < SIGHT_STRUCT);
  }
  /** Свои точки — глаза даже без башни (как visibleTo на сервере). */
  private ownPoints() { return [...POINTS, ...RELICS].filter((_, i) => this.pointOwner[i] === this.slot);
  }

  /** Туман войны: тёмная вуаль вне обзора — на карте и на мини-карте. */
  private drawFog() {
    if (this.slot < 0) { this.fogCv.getContext('2d')!.clearRect(0, 0, this.fogCv.width, this.fogCv.height); this.miniFog.innerHTML = '<rect width="100" height="100" fill="#000"/>'; return; } // зритель видит всё
    const c = this.fogCv, x = c.getContext('2d')!, k = c.width / MAP.w;
    x.globalCompositeOperation = 'source-over'; x.clearRect(0, 0, c.width, c.height);
    x.fillStyle = 'rgba(6,5,9,0.6)'; x.fillRect(0, 0, c.width, c.height); // рельеф под туманом должен читаться
    x.globalCompositeOperation = 'destination-out';
    const holes: string[] = [];
    const eyes = [...[...this.views.values()].filter(v => v.owner === this.slot && !v.dead).map(v => ({ x: v.x, y: v.y, r: Math.max(this.sight(v), isStruct(v.kind) ? 12 : 10) })),
      ...this.ownPoints().map(([x, y]) => ({ x, y, r: SIGHT_STRUCT })), ...this.scans.map(([x, y, r]) => ({ x: x / 10, y: y / 10, r: r ?? MEGA_SHOT.reveal }))]; // засвет: дальний удар и засвет из штаба
    for (const v of eyes) {
      const r = v.r + (this.research & (1 << 11) ? 4 : 0);
      const g = x.createRadialGradient(v.x * k, v.y * k, r * k * 0.7, v.x * k, v.y * k, r * k);
      g.addColorStop(0, 'rgba(0,0,0,1)'); g.addColorStop(1, 'rgba(0,0,0,0)');
      x.fillStyle = g; x.beginPath(); x.arc(v.x * k, v.y * k, r * k, 0, Math.PI * 2); x.fill();
      holes.push(`<circle cx="${(v.x / MAP.w) * 100}" cy="${(v.y / MAP.h) * 100}" r="${(r / MAP.w) * 100}" fill="#000"/>`);
    }
    this.miniFog.innerHTML = holes.join('');
  }

  /** Точки захвата: ромбы по буквам в цвете владельца. */
  private renderScore(s: Snap) {
    const L = PT_LETTERS;
    const ally = Math.max(0, this.slot); // зритель смотрит со стороны первого игрока
    const pts = s.p.slice(0, POINTS.length).map(([o], i) => `<span class="lc-score__pt${o >= 0 && o === ally ? ' lc-score__pt--ally' : o >= 0 ? ' lc-score__pt--enemy' : ''}"><span>${L[i]}</span></span>`).join('');
    const html = `<div class="lc-score__points">${pts}</div>`;
    if (html !== this.scoreHtml) { this.scoreHtml = html; $('hud-score').innerHTML = html; }
  }
  private scoreHtml = '';

  /** Предупреждение об ударе сверхоружия: красный круг зоны поражения с отсчётом — у всех, сквозь туман. */
  private drawStrikes(s: Snap) {
    const live = new Set<string>();
    for (const [x, y, t, o] of s.ss ?? []) {
      const key = `${x}:${y}:${o}`; live.add(key);
      let el = this.strikeEls.get(key);
      if (!el) {
        el = document.createElement('div'); el.className = 'w2d-strike'; this.world.append(el); this.strikeEls.set(key, el);
        const R = DOOM_R[this.fac(o)] ?? 16; // круг — ровно зона поражения фракции
        Object.assign(el.style, { left: (x / 10 - R) * S + 'px', top: (y / 10 - R) * S + 'px', width: 2 * R * S + 'px', height: 2 * R * S + 'px' });
        voice.announce(o === this.slot ? 'Удар сверхоружия выпущен.' : 'Внимание! Удар сверхоружия!'); this.alert('danger', DOOM_OF[this.fac(o)].name, 'удар через 6 с', x / 10, y / 10); this.pingMini(x / 10, y / 10);
      }
      el.dataset.t = String(t);
    }
    for (const [k, el] of this.strikeEls) if (!live.has(k)) { el.remove(); this.strikeEls.delete(k); this.shakeBy(18); }
  }
  /** Мегапостройки и сверхоружие: все видят стройку на мини-карте и получают оповещение. */
  private megaWatch(s: Snap) {
    let h = '';
    for (const [id, x, y, ki, o, b] of s.mg ?? []) {
      const k = KINDS[ki], X = (x / 10 / MAP.w) * 100, Y = (y / 10 / MAP.h) * 100;
      h += `<circle class="mega ${o === this.slot ? 'ally' : 'enemy'}" cx="${X}" cy="${Y}" r="3.2"/><text x="${X}" y="${Y - 4}" class="megat">${b < 100 ? b + '%' : '★'}</text>`;
      if (!this.megaSeen.has(id) && this.snapN > 1) { this.megaSeen.add(id); const nm = this.kindName(k, this.fac(o)); this.alert(o === this.slot ? 'ok' : 'danger', o === this.slot ? 'Строим: ' + nm : 'Противник строит: ' + nm, 'видно на мини-карте', x / 10, y / 10); if (o !== this.slot) voice.announce('Противник строит ' + nm + '.'); }
      this.megaSeen.add(id);
    }
    this.megaMini.innerHTML = h;
  }

  /** Облака дыма (SquadWargear): пиксельные клубы держатся, пока живут в симуляции. */
  private drawSmoke(sm: number[][]) {
    while (this.smokes.length > sm.length) this.smokes.pop()!.remove();
    sm.forEach(([x, y, t, kind], i) => { const R = kind === 1 ? 18 : kind === 2 ? FIRE.r : 6;
      let el = this.smokes[i];
      if (!el) { el = document.createElement('div'); el.className = 'w2d-smoke'; this.world.append(el); this.smokes[i] = el; }
      el.classList.toggle('plague', kind === 1); el.classList.toggle('burn', kind === 2);
      Object.assign(el.style, { left: (x / 10 - R) * S + 'px', top: (y / 10 - R) * S + 'px', width: R * 2 * S + 'px', height: R * 2 * S + 'px', opacity: String(Math.min(1, t / 3)) });
    });
  }

  /** Искры: короткие лучи из точки попадания. */
  private sparks(x: number, y: number, n: number, col: string, len: number, delay = 0) {
    let h = '';
    for (let i = 0; i < n; i++) { const a = Math.random() * Math.PI * 2, l = len * (0.5 + Math.random()); h += `<line class="w2d-sparkline" x1="${x}" y1="${y}" x2="${x + Math.cos(a) * l}" y2="${y + Math.sin(a) * l * 0.7}" stroke="${col}" style="animation-delay:${delay}ms"/>`; }
    return h;
  }
  private nearest(x: number, y: number) { let best: View | undefined, bd = 3; for (const v of this.views.values()) { const d = Math.hypot(v.tx - x, v.ty - y); if (d < bd + this.st(v).radius && !v.dead) { bd = d; best = v; } } return best; }
  /** Попадание: силуэт вспыхивает и отшатывается от удара (сильнее — от тяжёлого). */
  private hitFlash(v: View, fx: number, dx: number) {
    const heavy = fx >= 10 || fx === 1 || fx === 4, push = (heavy ? 6 : 2) * Math.sign(dx || 1);
    v.body.animate([{ filter: 'brightness(2.6) saturate(0)', translate: `${push}px 0` }, { filter: 'none', translate: '0 0' }], { duration: heavy ? 220 : 120, composite: 'add' });
  }
  private shakeBy(px: number) { this.world.animate([{ translate: `${px}px ${-px / 2}px` }, { translate: `${-px}px ${px / 2}px` }, { translate: '0 0' }], { duration: 300, composite: 'add' }); }

  /** Голова турели (FactionTurrets): целится в ближайшего врага в радиусе — разворот и наклон ствола; без цели осматривает сектор. */
  private aimHead(v: View, now: number) {
    const range = (this.st(v).range || 12) + 4;
    let tgt: View | null = null, bd = range;
    for (const o of this.views.values()) {
      if (o.owner === v.owner || o.dead || o.kind === 'mine') continue;
      const d = Math.hypot(o.x - v.x, o.y - v.y);
      if (d < bd) { bd = d; tgt = o; }
    }
    let flip: boolean, pitch: number;
    if (tgt) {
      flip = tgt.x < v.x;
      pitch = Math.max(-35, Math.min(35, (Math.atan2(v.y - tgt.y, Math.abs(tgt.x - v.x) + 0.01) * 180) / Math.PI)); // y мира вниз → вверх на экране
    } else {
      const ph = (now / 2600 + v.id * 0.37) % 2; // покой: медленно водит стволом и раз в цикл смотрит в другую сторону
      flip = ph > 1;
      pitch = Math.sin((now / 2600 + v.id) * Math.PI) * 18;
    }
    v.aim = v.aim === undefined ? pitch : v.aim + (pitch - v.aim) * 0.15;
    v.body.classList.toggle('flip', flip);
    for (const sv of v.svgs) { const head = sv.querySelector<SVGGElement>('.turret'); if (head) head.style.transform = `rotate(${-v.aim}deg)`; }
  }

  // ---------- кадр ----------
  private frame = (now: number) => {
    this.raf = requestAnimationFrame(this.frame);
    const dt = Math.min(0.05, (now - this.t0) / 1000);
    this.t0 = now;
    const c = this.cam, k = this.keys, sp = 30 * dt / c.zoom;
    const on = (...ks: string[]) => (ks.some(x => k.has(x)) ? 1 : 0); // стрелки и WASD
    let fx = on('arrowright', 'd') - on('arrowleft', 'a'), fy = on('arrowdown', 's') - on('arrowup', 'w');
    if (this.mouse && !this.drag && !this.pan && document.hasFocus()) {
      const m = this.mouse, e = 24;
      fx += (m.x > innerWidth - e ? 1 : 0) - (m.x < e ? 1 : 0);
      fy += (m.y > innerHeight - e ? 1 : 0) - (m.y < e ? 1 : 0);
    }
    c.x = Math.max(0, Math.min(MAP.w, c.x + fx * sp));
    c.y = Math.max(0, Math.min(MAP.h, c.y + fy * sp));
    const r = this.root.getBoundingClientRect();
    { const k = 100 / MAP.w, ky = 100 / MAP.h, w = (r.width / (S * c.zoom)) * k, h = (r.height / (S * c.zoom)) * ky; this.miniCam.setAttribute('x', String(c.x * k - w / 2)); this.miniCam.setAttribute('y', String(c.y * ky - h / 2)); this.miniCam.setAttribute('width', String(w)); this.miniCam.setAttribute('height', String(h)); }
    this.world.style.transform = this.under.style.transform = `translate(${r.width / 2 - c.x * S * c.zoom}px, ${r.height / 2 - c.y * S * c.zoom}px) scale(${c.zoom})`;
    this.w3d.render(c.x, c.y, c.zoom, S, r.width, r.height, now, MAP.h); // живые модели под ту же камеру

    if (this.throwG >= 0 && this.mouse) { // прицел броска: зона поражения у курсора, красная — вне дальности
      const p = this.toWorld(this.mouse.x, this.mouse.y), G = this.throwG === 9 ? { r: DOOM_R[this.fac()] ?? 16, range: 1e9 } : this.throwG === 10 ? { r: SCAN.r, range: 1e9 } : GEAR[this.throwG] ?? { r: 2, range: 1e9 }, sq = this.selected().filter(v => v.gear & (1 << this.throwG));
      const d = this.throwG >= 8 ? 0 : Math.min(...sq.map(v => Math.hypot(v.x - p.x, v.y - p.y)));
      Object.assign(this.aimRing.style, { display: '', left: (p.x - G.r) * S + 'px', top: (p.y - G.r) * S + 'px', width: G.r * 2 * S + 'px', height: G.r * 2 * S + 'px' });
      this.aimRing.classList.toggle('bad', d > G.range);
      $('hud-sel').textContent = d > G.range ? `вне дальности — ${Math.round(d)} м (подойдут и бросят)` : `${Math.round(d)} м · радиус ${G.r} м`;
    }
    let wg = '';
    if (this.place === 'wall' && this.mouse && this.wallStart) { // протяжка: клетки сегментов (красные — занято) и итоговая цена
      const p = this.toWorld(this.mouse.x, this.mouse.y), structs = [...this.views.values()].filter(v => isStruct(v.kind) && !v.dead);
      let left = this.wallBudget(); // как на сервере: свободные клетки по порядку, пока хватает денег; остальные — красным
      const cells = wallCells(this.wallStart.x, this.wallStart.y, p.x, p.y).map(c => { const free = wallOk(structs, this.slot, c.x, c.y), ok = free && left > 0; if (ok) left--; return { ...c, ok, free }; });
      const n = cells.filter(c => c.ok).length, poor = cells.filter(c => c.free && !c.ok).length, busy = cells.length - n - poor;
      wg = cells.map(c => `<div class="w2d-ghost${c.ok ? '' : ' bad'}" style="width:${BCELL * S}px;height:${BCELL * S}px;transform:translate(${c.x * S}px,${c.y * S}px)"></div>`).join('');
      for (const [k, v] of [['x1', this.wallStart.x], ['y1', this.wallStart.y], ['x2', p.x], ['y2', p.y]] as const) this.wallLine.setAttribute(k, String(v * S));
      this.wallLine.setAttribute('visibility', 'visible');
      this.ghost.classList.add('hidden');
      const pr = this.price(STATS.wall.cost * n);
      $('hud-sel').textContent = `Встанет ${n} сегм. · ${pr.en && !pr.cost ? `ϟ ${pr.en}` : `◆ ${pr.cost}`}${poor ? ` · не хватит на ${poor}` : ''}${busy ? ` · занято ${busy}` : ''} · денег на ${this.wallBudget()} сегм. (не больше 16 за раз)`;
    } else if (this.place && this.mouse) {
      if (this.place === 'wall') $('hud-sel').textContent = `Стена: клик — начало, клик — конец · денег на ${this.wallBudget()} сегм.`;
      const g = this.placePoint(this.mouse.x, this.mouse.y);
      this.ghost.classList.remove('hidden');
      this.ghost.classList.toggle('bad', !g.ok);
      this.ghost.style.transform = `translate(${g.x * S}px, ${g.y * S}px)`;
    }
    if (wg !== this.wallGhostHtml) this.wallGhost.innerHTML = this.wallGhostHtml = wg;

    const a = 1 - Math.exp(-dt * 14);
    const sites = [...this.views.values()].filter(v => isStruct(v.kind) && v.build < 1);
    for (const v of this.views.values()) {
      const moving = Math.hypot(v.tx - v.x, v.ty - v.y) > 0.06;
      v.x += (v.tx - v.x) * a; v.y += (v.ty - v.y) * a;
      v.el.style.transform = `translate(${v.x * S}px, ${v.y * S}px)`;
      v.el.style.zIndex = String(Math.round(v.y * 10));
      if (isStruct(v.kind)) {
        this.w3d.update(v.id, v.x, v.y, v.f, v.build < 1 ? 'build' : now < v.atkUntil ? 'shoot' : 'idle', now, { build: v.build, ghost: v.el.classList.contains('ghost'), shot: v.shotAt });
        for (const p of v.px) pxFrame(p, this.fac(v.owner), v.build < 1 ? 'build' : now < v.atkUntil && v.kind === 'turret' ? 'shoot' : 'idle', v.f, now, v.build < 1 ? v.build : undefined); // здание из атласа: растёт кадрами стройки
        const clip = v.build < 1 ? `inset(${(1 - v.build) * 100}% 0 0 0)` : '';
        for (const sv of v.svgs) if (sv.style.clipPath !== clip) sv.style.clipPath = clip; // здание растёт снизу вверх (Construction); у .w2d-body нулевой размер — режем сам SVG
        v.el.classList.toggle('building', v.build < 1);
        v.svgs.forEach(s => setAnim(s, v.build < 1 ? 'build' : now < v.atkUntil && (v.kind === 'turret' || v.kind === 'hq') ? 'recoil' : 'idle')); // выстрел: отдача
        if ((v.kind === 'turret' || v.kind === 'post') && v.build >= 1) this.aimHead(v, now);
      } else {
        if (!v.px.length) v.body.classList.toggle('flip', Math.cos(v.f) < -0.1); // силуэты смотрят вправо; атласы — по своей строке направления
        const building = !moving && v.kind === 'builder' && sites.some(s => s.owner === v.owner && Math.hypot(s.x - v.x, s.y - v.y) < this.st(s).radius + 3.5);
        const n = this.cnt(v);
        const atk = ({ 1: 'chop', 2: 'claw', 5: 'thrust', 3: 'beam', 11: 'beam', 13: 'beam', 4: 'cast' } as Record<number, string>)[v.atkFx ?? -1] ?? (v.kind === 'guard' && !v.melee ? 'recoil' : 'attack'); // анимация по оружию
        const flyer = flies(v.kind, this.fac(v.owner)), heavyWalk = !flyer && (v.kind === 'titan' || v.kind === 'hveh');
        const anim = v.dead ? 'death' : v.rise > 0 ? 'ritual' : building ? 'work' : now < v.atkUntil ? atk : moving ? (heavyWalk ? 'stride' : flyer ? 'hover' : 'walk') : flyer ? 'hover' : 'idle';
        if (v.frozen <= 0) this.w3d.update(v.id, v.x, v.y, v.f, v.dead ? 'death' : building ? 'work' : now < v.atkUntil ? (v.melee ? 'attack' : 'shoot') : moving ? 'walk' : 'idle', now, { alive: n, fly: flies(v.kind, this.fac(v.owner)), shot: v.shotAt });
        if (v.frozen <= 0) v.px.forEach((p, i) => pxFrame(p, this.fac(v.owner), i >= n || v.dead ? 'death' : anim === 'work' ? 'work' : now < v.atkUntil ? (v.kind === 'captain' ? 'attack' : v.kind === 'builder' ? 'idle' : 'shoot') : moving ? (v.kind === 'captain' ? 'run' : 'walk') : 'idle', v.f, now));
        v.svgs.forEach((sv, i) => {
          const alive = i < n;
          setAnim(sv, alive ? anim : 'death');
          (sv.parentElement as HTMLElement).classList.toggle('fallen', !alive);
        });
      }
      const ratio = Math.max(0, Math.min(1, v.hp / this.mhp(v)));
      const show = !v.dead && (v.build < 1 || ratio < 1 || this.sel.has(v.id));
      v.bar.classList.toggle('hidden', !show);
      v.fg.style.setProperty('--v', (v.build < 1 ? v.build : ratio) * 100 + '%');
      v.fg.className = 'lc-vitals__bar' + (v.build < 1 ? ' lc-vitals__bar--shield' : ratio < 0.35 ? ' lc-vitals__bar--critical' : ratio < 0.6 ? ' lc-vitals__bar--worn' : '');
      if ((v.kind === 'pyre' || v.kind === 'bell') && v.build >= 1 && !v.dome) { // аура: огонь ямы, тень колокола
        const r = v.kind === 'pyre' ? 8 : 14; v.dome = document.createElement('div'); v.dome.className = 'w2d-aura ' + v.kind; this.ground.append(v.dome);
        Object.assign(v.dome.style, { left: (v.x - r) * S + 'px', top: (v.y - r) * S + 'px', width: r * 2 * S + 'px', height: r * 2 * S + 'px' });
      }
      if (v.kind === 'aegis' && v.build >= 1) { // купол-эгида: полупрозрачная сфера 12 м, пропадает пробитой
        if (!v.dome) { v.dome = document.createElement('div'); v.dome.className = 'w2d-dome'; this.ground.append(v.dome); }
        Object.assign(v.dome.style, { left: (v.x - 12) * S + 'px', top: (v.y - 12) * S + 'px', width: 24 * S + 'px', height: 24 * S + 'px', opacity: v.off ? '0' : String(0.35 + (v.sh / 1200) * 0.65) });
      }
      if (v.sh > 0 && v.kind !== 'aegis') { // личный щит: синяя полоса над здоровьем
        if (!v.shBar) { v.shBar = document.createElement('div'); v.shBar.className = 'lc-vitals__bar lc-vitals__bar--shield w2d-shbar'; v.bar.prepend(v.shBar); }
        v.shBar.style.setProperty('--v', Math.min(100, (v.sh / 300) * 100) + '%'); v.bar.classList.remove('hidden');
      } else v.shBar?.remove(), (v.shBar = undefined);
      v.el.classList.toggle('frozen', v.frozen > 0);
      v.el.classList.toggle('rising', v.rise > 0);
      v.sel.classList.toggle('on', this.sel.has(v.id));
      v.el.classList.toggle('picked', this.sel.has(v.id));
    }
    const t = performance.now();
    this.shots = this.shots.filter(s => { if (s.until > t) return true; s.el.remove(); return false; });
  };
}
