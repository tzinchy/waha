import { ARCH_OPTS, archFor, type FactionId } from './factions.ts';
import { UA_TYRANIDS } from './ua-tyranids.ts';
import { UA_INQUISITION } from './ua-inquisition.ts';

// Вся игровая логика. Чистые функции без DOM и сети: сервер гонит step(), клиент только рисует snapshot().
import { MAP, HQ_POS, POINTS, RELICS, VENTS, BLOCKS, blocked, setMap, MAPS } from './mapdata.ts';
export { MAP, HQ_POS, POINTS, RELICS, VENTS, setMap, MAPS };
export const DT = 1 / 20;

/** Сборка капитана (пресет CaptainArchetypes): Штурм — рукопашная, Командор — ауры, Мистик — урон по площади и лечение. */
export type Arch = 'assault' | 'commander' | 'mystic';
export const ARCHS: Arch[] = ['assault', 'commander', 'mystic'];
export type CaptainCfg = { arch: Arch };
export type Kind = 'captain' | 'builder' | 'guard' | 'hq' | 'barracks' | 'post' | 'turret' | 'foundry' | 'pump' | 'key1' | 'key2' | 'key3' | 'key4' | 'gate' | 'legend' | 'wall' | 'wallgate' | 'bunker' | 'mine'
  | 'sniper' | 'heavy' | 'support' | 'elite' | 'healer' | 'lveh' | 'mveh' | 'hveh' | 'titan' | 'deity' | 'aegis' | 'rturret' | 'fturret' | 'arty' | 'battery' | 'pylon' | 'pyre' | 'bell' | 'doom' | 'lighthouse' | 'obelisk' | 'megagun' | 'plague' | 'motorpool' | 'yard'
  | 'air' | 'warpgate' | 'khorne' | 'nurgle' | 'tzeentch' | 'slaanesh' | 'jet' | 'portal' | 'spire' | 'bomber'
  | `ua:${string}`; // отряды UA сверх ролей игры (UA_MORE): ua:<раса>:<отряд мода>
export const KINDS: Kind[] = ['captain', 'builder', 'guard', 'hq', 'barracks', 'post', 'turret', 'foundry', 'pump', 'key1', 'key2', 'key3', 'key4', 'gate', 'legend', 'wall', 'wallgate', 'bunker', 'mine', 'sniper', 'heavy', 'support', 'elite', 'healer', 'lveh', 'mveh', 'hveh', 'titan', 'deity', 'aegis', 'rturret', 'fturret', 'arty', 'battery', 'pylon', 'pyre', 'bell', 'doom', 'lighthouse', 'obelisk', 'megagun', 'plague', 'motorpool', 'yard', 'air', 'warpgate', 'khorne', 'nurgle', 'tzeentch', 'slaanesh', 'jet', 'portal', 'spire', 'bomber']; // новые — только в конец: индексы идут в снимки
const MOBILE = new Set<Kind>(['captain', 'builder', 'guard', 'legend', 'sniper', 'heavy', 'support', 'elite', 'healer', 'lveh', 'mveh', 'hveh', 'titan', 'deity', 'arty', 'air', 'khorne', 'nurgle', 'tzeentch', 'slaanesh', 'jet', 'bomber']);
export const isStruct = (k: Kind) => !MOBILE.has(k);
export type Buildable = 'hq' | 'barracks' | 'post' | 'turret' | 'foundry' | 'pump' | 'key1' | 'key2' | 'key3' | 'key4' | 'gate' | 'wall' | 'wallgate' | 'bunker' | 'mine' | 'aegis' | 'rturret' | 'fturret' | 'battery' | 'pylon' | 'pyre' | 'bell' | 'lighthouse' | 'obelisk' | 'megagun' | 'plague' | 'motorpool' | 'yard' | 'warpgate' | 'portal' | 'spire';

// hp: у отрядов хп ОДНОЙ модели (общий пул = hp * n), у остальных общий. dmg: урон одной модели.
type Stat = { hp: number; n: number; dmg: number; range: number; cd: number; speed: number; sight: number; radius: number; cost: number; time: number };
export const STATS: Record<Kind, Stat> = {
  captain: { hp: 800, n: 1, dmg: 20, range: 3.5, cd: 0.8, speed: 8, sight: 14, radius: 1, cost: 150, time: 20 }, // заказывается в штабе (как в Soulstorm)
  builder: { hp: 70, n: 2, dmg: 0, range: 0, cd: 1, speed: 7, sight: 0, radius: 1.1, cost: 30, time: 3 },
  guard: { hp: 125, n: 5, dmg: 4, range: 9, cd: 1, speed: 7, sight: 14, radius: 1.8, cost: 80, time: 6 },
  hq: { hp: 8000, n: 1, dmg: 14, range: 16, cd: 1.2, speed: 0, sight: 12, radius: 4.5, cost: 600, time: 60 },
  barracks: { hp: 2400, n: 1, dmg: 0, range: 0, cd: 1, speed: 0, sight: 0, radius: 3.2, cost: 150, time: 20 },
  post: { hp: 1200, n: 1, dmg: 6, range: 14, cd: 1.5, speed: 0, sight: 14, radius: 1.4, cost: 50, time: 8 },
  turret: { hp: 1050, n: 1, dmg: 12, range: 19, cd: 1.2, speed: 0, sight: 19, radius: 1.3, cost: 80, time: 10 },
  foundry: { hp: 1350, n: 1, dmg: 0, range: 0, cd: 1, speed: 0, sight: 0, radius: 2.6, cost: 120, time: 15 }, // Литейня: энергия
  pump: { hp: 900, n: 1, dmg: 0, range: 0, cd: 1, speed: 0, sight: 0, radius: 1.6, cost: 100, time: 12 },     // Глубинный насос на жиле
  key1: { hp: 2250, n: 1, dmg: 0, range: 0, cd: 1, speed: 0, sight: 0, radius: 2.6, cost: 150, time: 20 },    // ключевые здания тиров I–IV
  key2: { hp: 2700, n: 1, dmg: 0, range: 0, cd: 1, speed: 0, sight: 0, radius: 2.8, cost: 250, time: 25 },
  motorpool: { hp: 3900, n: 1, dmg: 0, range: 0, cd: 1, speed: 0, sight: 10, radius: 3.4, cost: 200, time: 45 }, // техцех: вся техника
  yard: { hp: 7500, n: 1, dmg: 0, range: 0, cd: 1, speed: 0, sight: 12, radius: 5.5, cost: 600, time: 90 },    // верфь титана
  key3: { hp: 3000, n: 1, dmg: 0, range: 0, cd: 1, speed: 0, sight: 0, radius: 2.8, cost: 350, time: 30 },
  key4: { hp: 3600, n: 1, dmg: 0, range: 0, cd: 1, speed: 0, sight: 0, radius: 3, cost: 450, time: 35 },
  gate: { hp: 4500, n: 1, dmg: 0, range: 0, cd: 1, speed: 0, sight: 0, radius: 3.6, cost: 500, time: 40 },    // Врата призыва, тир V
  legend: { hp: 3000, n: 1, dmg: 50, range: 5, cd: 1, speed: 8, sight: 16, radius: 1.4, cost: 0, time: 0 },
  // укрепления (пресет Fortifications)
  wall: { hp: 1500, n: 1, dmg: 0, range: 0, cd: 1, speed: 0, sight: 0, radius: 1.6, cost: 30, time: 4 },      // сегмент стены
  wallgate: { hp: 2400, n: 1, dmg: 0, range: 0, cd: 1, speed: 0, sight: 0, radius: 1.6, cost: 120, time: 10 }, // ворота: свои проходят
  bunker: { hp: 3750, n: 1, dmg: 0, range: 0, cd: 1, speed: 0, sight: 0, radius: 2.2, cost: 250, time: 18 },  // крипта: пехота рядом −50% урона
  mine: { hp: 60, n: 1, dmg: 180, range: 2, cd: 1, speed: 0, sight: 0, radius: 0.6, cost: 40, time: 3 },      // мина: невидима, 180 урона по 6 м
  // роли пехоты (пресет UnitRoles)
  sniper: { hp: 105, n: 2, dmg: 30, range: 22, cd: 3, speed: 6.5, sight: 24, radius: 1.4, cost: 90, time: 10 },
  heavy: { hp: 145, n: 3, dmg: 16, range: 17, cd: 2.2, speed: 5, sight: 18, radius: 1.8, cost: 120, time: 12 },
  support: { hp: 120, n: 2, dmg: 4, range: 9, cd: 1, speed: 7, sight: 14, radius: 1.5, cost: 80, time: 8 },
  elite: { hp: 300, n: 3, dmg: 15, range: 2.6, cd: 1.1, speed: 6, sight: 14, radius: 2, cost: 200, time: 16 },
  healer: { hp: 700, n: 1, dmg: 6, range: 6, cd: 1, speed: 8, sight: 16, radius: 1.4, cost: 170, time: 18 },
  // техника (пресет Vehicles) и титаны (пресет Titans)
  lveh: { hp: 700, n: 1, dmg: 13, range: 12, cd: 0.6, speed: 12, sight: 18, radius: 2.2, cost: 110, time: 18 },
  mveh: { hp: 1200, n: 1, dmg: 10, range: 14, cd: 0.5, speed: 7, sight: 16, radius: 2.7, cost: 140, time: 24 },
  hveh: { hp: 2600, n: 1, dmg: 85, range: 20, cd: 3, speed: 5, sight: 22, radius: 3, cost: 200, time: 30 },
  titan: { hp: 15000, n: 1, dmg: 520, range: 36, cd: 2.5, speed: 3.2, sight: 80, radius: 5, cost: 3000, time: 180 }, // титан: 3000 влияния, 3000 энергии, 15 реликвий, 3 минуты; видит с высоты 80 м; нужна критическая точка
  // особые механики фракций (пресет FactionSpecials)
  deity: { hp: 4200, n: 1, dmg: 95, range: 6, cd: 1, speed: 9, sight: 22, radius: 2.2, cost: 0, time: 0 },        // Бог-Механизм Династий
  aegis: { hp: 1050, n: 1, dmg: 0, range: 0, cd: 1, speed: 0, sight: 0, radius: 1.3, cost: 150, time: 14 },        // Купол-эгида Консенсуса
  rturret: { hp: 900, n: 1, dmg: 26, range: 21, cd: 3, speed: 0, sight: 21, radius: 1.3, cost: 110, time: 12 },   // Ракетная бочка Орды
  // артиллерия (техника всех фракций) и уникальные постройки Ордена, Нежити, Династий, Синклита
  arty: { hp: 900, n: 1, dmg: 115, range: 45, cd: 4.5, speed: 4, sight: 18, radius: 2.6, cost: 210, time: 34 },
  battery: { hp: 2100, n: 1, dmg: 150, range: 40, cd: 5, speed: 0, sight: 20, radius: 2, cost: 200, time: 20 },   // Батарея «Громобой» легиона
  pylon: { hp: 1800, n: 1, dmg: 70, range: 30, cd: 2.4, speed: 0, sight: 30, radius: 1.6, cost: 180, time: 18 },    // Гаусс-пилон Династий
  pyre: { hp: 1500, n: 1, dmg: 0, range: 0, cd: 1, speed: 0, sight: 10, radius: 1.8, cost: 150, time: 14 },         // Огненная яма Синклита: жжёт всё вокруг
  bell: { hp: 1650, n: 1, dmg: 0, range: 0, cd: 1, speed: 0, sight: 16, radius: 1.6, cost: 160, time: 16 },         // Колокол Скорби Нежити
  // сверхоружие (тир V) и мегапостройки обороны (тир IV): обзор и дальность 200 м, крайне живучие
  doom: { hp: 5250, n: 1, dmg: 0, range: 0, cd: 1, speed: 0, sight: 12, radius: 3, cost: 3000, time: 240 },
  lighthouse: { hp: 22500, n: 1, dmg: 0, range: 200, cd: 1, speed: 0, sight: 200, radius: 4.8, cost: 1200, time: 150 },  // Вокс-маяк легиона: видит 200 м
  obelisk: { hp: 30000, n: 1, dmg: 220, range: 200, cd: 3, speed: 0, sight: 200, radius: 6, cost: 1400, time: 150 },    // Обелиск Вечности Династий
  megagun: { hp: 26250, n: 1, dmg: 180, range: 200, cd: 4, speed: 0, sight: 200, radius: 6, cost: 1300, time: 150 },    // Мега-Пушка Орды
  plague: { hp: 22500, n: 1, dmg: 0, range: 200, cd: 1, speed: 0, sight: 200, radius: 4.8, cost: 1100, time: 150 },       // Чумной шпиль Нежити
  fturret: { hp: 1050, n: 1, dmg: 9, range: 9, cd: 0.4, speed: 0, sight: 11, radius: 1.3, cost: 90, time: 10 },     // Огнемётная печь Орды
  air: { hp: 145, n: 3, dmg: 9, range: 10, cd: 1, speed: 11, sight: 18, radius: 1.6, cost: 160, time: 14 },        // авиация: крылатые/прыжковые отряды, летят над скалами и стенами
  jet: { hp: 900, n: 1, dmg: 24, range: 14, cd: 0.6, speed: 17, sight: 24, radius: 2.4, cost: 200, time: 24 },      // самолёт: быстрый, летит над всем, техцех
  bomber: { hp: 5000, n: 1, dmg: 320, range: 24, cd: 6, speed: 10, sight: 30, radius: 4, cost: 1500, time: 150 }, // Бомбовоз Орды: титан-класс на верфи, мини-атомки
  spire: { hp: 26250, n: 1, dmg: 0, range: 200, cd: 1, speed: 0, sight: 200, radius: 6, cost: 1300, time: 150 },     // Башня Кабала / Око Ужаса: мегапостройка Тёмных эльдар и Хаоса
  portal: { hp: 2250, n: 1, dmg: 0, range: 0, cd: 1, speed: 0, sight: 10, radius: 2.4, cost: 200, time: 20 },     // Теневой портал Тёмных эльдар
  // Врата Варпа Хаоса и демоны четырёх богов
  warpgate: { hp: 3300, n: 1, dmg: 0, range: 0, cd: 1, speed: 0, sight: 10, radius: 3, cost: 300, time: 30 },
  khorne: { hp: 160, n: 4, dmg: 14, range: 2.6, cd: 0.9, speed: 8, sight: 14, radius: 1.8, cost: 180, time: 14 },   // Кровопускатели: рубят
  nurgle: { hp: 340, n: 3, dmg: 9, range: 2.6, cd: 1.2, speed: 5, sight: 14, radius: 1.9, cost: 200, time: 16 },    // Чумоносцы: живучие, гниль лечит
  tzeentch: { hp: 90, n: 3, dmg: 16, range: 16, cd: 1.8, speed: 6.5, sight: 18, radius: 1.6, cost: 190, time: 15 }, // Розовые ужасы: варп-пламя по площади
  slaanesh: { hp: 95, n: 4, dmg: 10, range: 2.4, cd: 0.6, speed: 11, sight: 16, radius: 1.6, cost: 170, time: 12 }, // Демонетки: самые быстрые
};
/**
 * Расы из Ultimate Apocalypse 1.89.2 (shared/ua-*.ts, tools/ua-race.mjs): тираниды, Инквизиция и Серые Рыцари. Соотношения живучести, урона, пробития, скорости и цены — из .rgd мода, общий масштаб — под игру
 * (основная пехота ≈ прежняя). У каждой расы свой стол статов (FSTATS), остальные фракции — на STATS.
 */
type ModRace = { squads: Record<string, { min: number; max: number; unit: ModUnit }>; buildings: Record<string, ModUnit> };
type ModWeapon = { morale?: number; setup?: number; moveAcc?: number; file?: string; name?: string; min: number; max: number; accuracy: number; reload: number; range: number; minRange?: number; aoe?: number; melee: boolean; vs: Record<Armor, number>; cost?: number; power?: number; time?: number };
type ModUnit = { id?: string; name?: string; hp: number; regen?: number; speed: number; sight: number; cost: number; power?: number; time: number; hardpoints: readonly (readonly ModWeapon[])[] };
/** Вид игры → отряд мода; здание игры → здание мода; легенды по номеру призыва. */
export const MOD_RACES = {
  tyranids: {
    data: UA_TYRANIDS as unknown as ModRace,
    unit: { builder: 'ripperswarm', guard: 'hormagaunt', support: 'termagant', air: 'gargoyle', sniper: 'lictor', heavy: 'warrior', elite: 'genestealer', lveh: 'ravener', mveh: 'carnifex', hveh: 'carnifex_khazi', arty: 'biovores', titan: 'hierophant', captain: 'hive_tyrant', legend: 'swarmlord' },
    build: { hq: 'hq', barracks: 'gaunt_hive', key1: 'warrior_hive', key2: 'capillary_tower', key3: 'xeno_hive', key4: 'biomorph_hive', gate: 'relic_hive', motorpool: 'carnifex_hive', yard: 'biotitan_hive', post: 'spore_chimney', foundry: 'digest_pool', pump: 'adv_magma_vent', turret: 'turret', mine: 'mines' },
    legends: ['swarmlord', 'trygon', 'carnifex_uber'],
  },
  inquisition: {
    data: UA_INQUISITION as unknown as ModRace,
    unit: { builder: 'archivist', guard: 'grey_knights', support: 'shock_troops', sniper: 'scholar_astropath', heavy: 'grey_knights_purgator', elite: 'grey_knights_terminator', air: 'grey_knights_interceptor', lveh: 'razorback', mveh: 'dreadnought', hveh: 'predator', arty: 'whirlwind', titan: 'warhound_titan', jet: 'stormraven_fury', captain: 'inquisitor_lord', legend: 'grey_knight_hero' },
    build: { hq: 'tower_hq', barracks: 'grey_knights_teleporter', motorpool: 'watch', yard: 'tower_mechanicum', key1: 'librarium', key2: 'astra_telepathica', key3: 'shrine_to_the_emperor', post: 'imperial_icon', turret: 'turret_heavy_bolter', foundry: 'warp_generator', pump: 'warp_reactor', bunker: 'infantry_bunker', wall: 'wall', mine: 'mines', key4: 'nuclear_facility', gate: 'purification_decree' },
    legends: ['grey_knight_hero', 'dreadknight_titan', 'grey_knight_champion'],
  },
} satisfies Partial<Record<FactionId, { data: ModRace; unit: Partial<Record<Kind, string>>; build: Partial<Record<Kind, string>>; legends: string[] }>>;
export const FSTATS: Partial<Record<FactionId, Record<Kind, Stat>>> = {};
/** Статы вида у фракции. */
export const statOf = (k: Kind, f?: FactionId) => (f && FSTATS[f]?.[k]) || STATS[k];
/** Герой и легенда: заказ и призыв идут по своей экономике игры — цена и время игровые, остальное из мода. */
const SLOT = new Set<Kind>(['legend']); // герой — как в UA: цена, энергия, время и стволы из мода
/** Пробитие брони рас из модов по классам брони — из таблиц оружия (как в DoW: доля урона, что проходит по классу брони, %/100). */
export const UA_VS: Partial<Record<FactionId, Partial<Record<Kind, Record<Armor, number>>>>> = {};
/** Второе оружие вблизи у рас UA — ствол ближнего боя мода по умолчанию (урон и пробитие из мода). */
type UAClose = { range: number; dmg: number; cd: number; type: DmgType; vs: Record<Armor, number> };
export const UA_CLOSE: Partial<Record<FactionId, Partial<Record<Kind, UAClose>>>> = {};
/** Апгрейды оружия рас UA (второй уровень юнита): во сколько раз растёт урон, на сколько дальность, новое пробитие. */
type UAUp = { dmg: number; range: number; vs: Record<Armor, number>; aoe?: number; cd?: number }; // cd — множитель перезарядки (ствол аддона)
export const UA_UPG: Partial<Record<FactionId, Partial<Record<Kind, Upgrade & UAUp>>>> = {};
/** Апгрейд вида у фракции: у рас UA — свой (оружие из мода), у остальных — общий. */
export const upOf = (f: FactionId | undefined, k: Kind): (Upgrade & Partial<UAUp>) | undefined => (f && UA_UPG[f] ? UA_UPG[f]![k] : UPGRADES[k]); // у рас UA общих апгрейдов игры нет
/** Стволы мода, которые взял баланс (имена файлов оружия) — клиент включает по ним части модели (vis-слои). */
export const UA_WEAPONS: Partial<Record<FactionId, Partial<Record<Kind, string[]>>>> = {};
/** Регенерация рас из модов: HP/с на бойца (health_ext.regeneration_rate × масштаб HP). */
export const UA_REGEN: Partial<Record<FactionId, Partial<Record<Kind, number>>>> = {};
const ARMORS: Armor[] = ['inf', 'hinf', 'light', 'veh', 'titan', 'struct', 'cmd'];
/** Роли, которые в игре стреляют: им — стрелковые стволы мода. */
const RANGED_ROLE = new Set<Kind>(['support', 'air', 'heavy', 'lveh', 'mveh', 'hveh', 'arty', 'captain', 'jet', 'sniper']);
/**
 * Отряды UA сверх ролей игры (задача 29): у каждого свой вид `ua:<раса>:<отряд>`, баланс — целиком из мода теми же циклами, что у ролей
 * (HP, бойцы, скорость, обзор, цена, энергия, время, стволы, пробитие, броня, лимит, требования, исследования); здание найма — из spawns мода.
 * Базовый вид даёт только поведение игры: пехота/техника/самолёт/артиллерия, строй, 3D-роль. Без стоимости в моде (варианты _max, вызовы способностей) не берём.
 */
const UA_MORE: Partial<Record<FactionId, Record<string, Kind>>> = {
  tyranids: { swarmlord: 'elite', trygon: 'hveh', carnifex_uber: 'hveh', carnifex_skiller: 'mveh', tyrant_guard: 'elite', spore_cluster: 'guard', carnifex_tervigon: 'hveh', lictor_alpha: 'sniper', zoanthropes: 'heavy', broodlord: 'elite' },
  inquisition: {
    grey_knight_hero: 'elite', dreadknight_titan: 'mveh', grey_knight_champion: 'elite', // легенды игры — в UA обычный найм в зданиях мода
    tempest: 'lveh', valkyrie_uamod: 'jet', vulture: 'jet', thunderfire_cannon: 'arty', grey_knights_astra: 'guard', dreadnought_support: 'mveh',
    dreadnought_venerable: 'mveh', dreadnought_assault: 'mveh', grey_knights_purifier: 'guard', grey_knights_terminator_paladin: 'elite',
    scholar_exorcist: 'support', scholar_calculus_logi: 'support', death_cultist: 'guard', bodyguard: 'guard', stormtroopers: 'support',
    scholars: 'support', servitor_maintenance: 'support', servitor_weapon: 'heavy', servitor_melee: 'guard', grenaider_troops: 'guard',
    rhino: 'lveh', chimera_transport: 'lveh', damocles: 'lveh', land_raider: 'hveh', land_raider_crusader: 'hveh', land_raider_redeemer: 'hveh', land_raider_daemonhunter: 'hveh',
    imperator_titan: 'titan', warhound_vengence_titan: 'titan', servo_skull: 'support',
  },
};
/** Вид отряда UA_MORE → базовый вид игры (поведение). */
export const UA_BASE: Partial<Record<Kind, Kind>> = {};
/** Здание найма отряда UA_MORE: первое здание мода, в spawns которого он есть. */
const UA_FROM: Partial<Record<Kind, Kind>> = {};
for (const [f, more] of Object.entries(UA_MORE) as [FactionId, Record<string, Kind>][]) {
  const race = MOD_RACES[f as keyof typeof MOD_RACES];
  for (const [id, base] of Object.entries(more)) {
    const k: Kind = `ua:${f}:${id}`, from = Object.entries(race.build).find(([, b]) => (race.data.buildings[b] as ModUnit & { spawns?: string[] })?.spawns?.some(x => x.endsWith('squad_' + id)));
    if (!race.data.squads[id] || !from) continue;
    UA_BASE[k] = base; UA_FROM[k] = from[0] as Kind; KINDS.push(k); STATS[k] = structuredClone(STATS[base]);
    (race.unit as Partial<Record<Kind, string>>)[k] = id;
  }
}
/** Запись базового вида — всем отрядам UA_MORE (таблицы и множества по видам). */
export function inherit<T extends Partial<Record<Kind, unknown>> | Set<Kind>>(t: T): T {
  for (const [k, b] of Object.entries(UA_BASE) as [Kind, Kind][]) {
    if (t instanceof Set) { if (t.has(b)) t.add(k); }
    else if (b in t && !(k in t)) (t as Partial<Record<Kind, unknown>>)[k] = (t as Partial<Record<Kind, unknown>>)[b];
  }
  return t;
}
inherit(MOBILE); inherit(RANGED_ROLE);
/** Класс брони DoW (type_armour мода) → класс игры; пробитие мода взято по этим же классам (tools/ua-race.mjs, ARMOR). */
const modArmor = (t = ''): Armor | undefined => /^commander/.test(t) ? 'cmd' : /^infantry_heavy|^monster_med|^monster_low/.test(t) ? 'hinf' : /^infantry|^hivefleet/.test(t) ? 'inf'
  : /^vehicle_low|^air/.test(t) ? 'light' : /^vehicle/.test(t) ? 'veh' : /^monster_high|^titan/.test(t) ? 'titan' : /^building/.test(t) ? 'struct' : undefined;
/** Броня и лимит (squad_cap / support_cap мода) видов рас UA. 0 в моде (командиры, лэндрейдеры, титаны — у них свои ограничения UA) — лимит роли игры. */
export const UA_ARMOR: Partial<Record<FactionId, Partial<Record<Kind, Armor>>>> = {};
/** Развёртывание основного ствола (setup_time мода, с): на ходу не стреляет, после остановки ждёт столько. И доля точности на ходу (accuracy_reduction_when_moving). */
export const UA_SETUP: Partial<Record<FactionId, Partial<Record<Kind, number>>>> = {};
const UA_MOVEACC: Partial<Record<FactionId, Partial<Record<Kind, number>>>> = {};
/** Мораль отрядов UA (squad_morale_ext мода): максимум, восстановление/с, надлом (минимум времени и морали для выхода) и его эффект — точность, скорость. Нет у тиранидов. */
type UAMorale = { max: number; rate: number; minTime: number; minMorale: number; acc: number; speed: number };
export const UA_MOR: Partial<Record<FactionId, Partial<Record<Kind, UAMorale>>>> = {};
/** Урон по морали за выстрел бойца (morale_damage стволов мода × точность, в темпе основного ствола). */
const UA_MDMG: Partial<Record<FactionId, Partial<Record<Kind, number>>>> = {};
/** Площадь основного ствола отрядов UA, м (вместо площади роли игры). */
export const UA_AOE: Partial<Record<FactionId, Partial<Record<Kind, number>>>> = {};
const UA_POP: Partial<Record<FactionId, Partial<Record<Kind, number>>>> = {};
/** Метр DoW → метр игры: дальность, обзор и скорость мода переводятся в метры карты этим множителем. */
export const DOW_M = 1.5;
/** Перевод единиц мода в игровые: расстояния — один масштаб с картой, здоровье, урон и цены — как в UA. */
// скорость — не масштаб карты: ×DOW_M юниты UA бегали втрое быстрее юнитов игры (Серые рыцари 24 м/с — карта за 16 с); ×0.5 — около 8 м/с, как у пехоты игры
const UA_K = { hp: 1, dmg: 1, range: DOW_M, speed: 0.5, sight: DOW_M, cost: 1, bhp: 1 };
/** Отряды рас UA: до скольких бойцов пополняются, цена и время одного бойца (как в моде). */
/** Цена в энергии (power мода) по видам рас UA: постройки и найм. */
export const UA_ENERGY: Partial<Record<FactionId, Partial<Record<Kind, number>>>> = {};
/** Энергия на постройку или найм вида у фракции: у рас UA — из мода, у остальных — игровая. */
export const energyOf = (k: Kind, f?: FactionId) => (f && UA_ENERGY[f]?.[k]) ?? ENERGY_COST[k] ?? ROLES[k]?.energy ?? 0;
/** Здания UA без ствола по умолчанию (пост Инквизиции): молчат, пока аддон не поставил оружие. Ключ — «раса/вид». */
export const UA_UNARMED = new Set<string>();
export const UA_SQ: Partial<Record<FactionId, Partial<Record<Kind, { max: number; cost: number; time: number }>>>> = {};
/** Стволы юнита или турели мода → урон, пробитие (V), апгрейд оружия (UP), имена стволов (WP). Возвращает основной ствол или undefined. */
/** Ствол точки крепления по умолчанию — как в DoW: первый в списке; пустышка (урон 0) — точка пуста, пока ствол не куплен (Био-плазма воина, Душитель карнифекса). */
const modDefault = (l: readonly ModWeapon[]) => (l[0]?.max > 0 ? l[0] : undefined);
function modWeapons(u: ModUnit, k: Kind, n: number, WP: Partial<Record<Kind, string[]>>, V: Partial<Record<Kind, Record<Armor, number>>>, UP: Partial<Record<Kind, Upgrade & UAUp>>, struct = false, CL?: Partial<Record<Kind, UAClose>>) {
  // урон — сумма по точкам крепления (в DoW каждая стреляет сама), в каждой — ствол мода по умолчанию; остальное покупается бойцу (UA_ARM)
  // здание бьёт одним стволом: у бункера четыре пулемёта по сторонам света — по цели стреляет один
  const ranged = RANGED_ROLE.has(k), dps = (w: ModWeapon) => ((w.min + w.max) / 2) * w.accuracy / Math.max(0.1, w.reload);
  const all = u.hardpoints.map(l => (struct ? l.find(w => w.max > 0) : modDefault(l))).filter((w): w is ModWeapon => !!w); // у здания ствол ставит аддон (addonWeapon) — статы от первого настоящего
  const picks = struct ? all.sort((a, b) => dps(b) - dps(a)).slice(0, 1) : all;
  const shots = picks.some(w => !w.melee) ? picks.filter(w => !w.melee) : picks, main = shots[0];
  WP[k] = picks.map(w => w.file ?? '');
  // апгрейд оружия UA: лучший ствол в каждой точке крепления (в моде покупается за ресурсы, у турелей — аддоном) — второй уровень юнита
  const best = u.hardpoints.map(l => [...l].filter(w => w.max > 0 && (!ranged || !w.melee || !l.some(x => !x.melee && x.max > 0))).sort((a, b) => dps(b) - dps(a))[0]).filter((w): w is ModWeapon => !!w);
  const bshots = best.some(w => !w.melee) ? best.filter(w => !w.melee) : best, d0 = shots.reduce((a, x) => a + dps(x), 0), d1 = bshots.reduce((a, x) => a + dps(x), 0);
  const changed = best.filter(w => !picks.includes(w));
  if (k !== 'builder' && k !== 'mine' && changed.length && d0 > 0 && d1 > d0 * 1.05) UP[k] = {
    name: 'Оружие: ' + (changed[0].name || (changed[0].file ?? '').replace(/^[a-z]+_|_/g, ' ').trim()), tier: 2, relics: 0,
    // в моде ствол покупают каждому бойцу — у нас сразу всему стартовому отряду, по цене мода за бойца
    cost: Math.round(changed.reduce((a, w) => a + (w.cost ?? 0), 0) * n * UA_K.cost), energy: Math.round(changed.reduce((a, w) => a + (w.power ?? 0), 0) * n * UA_K.cost),
    time: Math.max(5, Math.round(changed.reduce((a, w) => Math.max(a, w.time ?? 0), 0) || 10)),
    // у турели Инквизиции в моде два аддона подряд — берём лучший ствол сразу
    dmg: +(d1 / d0).toFixed(2), range: Math.max(0, Math.round((Math.max(0, ...bshots.filter(w => !w.melee).map(w => w.range)) - Math.max(0, ...shots.filter(w => !w.melee).map(w => w.range))) * UA_K.range)),
    vs: Object.fromEntries(ARMORS.map(a => [a, +(bshots.reduce((m, x) => m + x.vs[a] * dps(x), 0) / (d1 || 1) / 100).toFixed(3)])) as Record<Armor, number>,
    aoe: Math.max(0, ...bshots.map(w => w.aoe ?? 0)) * UA_K.range,
  };
  if (shots.length && k !== 'builder' && k !== 'mine') { const tot = shots.reduce((a, x) => a + dps(x), 0) || 1; V[k] = Object.fromEntries(ARMORS.map(a => [a, +(shots.reduce((m, x) => m + x.vs[a] * dps(x), 0) / tot / 100).toFixed(3)])) as Record<Armor, number>; }
  const mel = picks.filter(w => w.melee); // ствол ближнего боя по умолчанию у стрелка (меч Инквизитора) — второе оружие вблизи, как в DoW
  if (CL && shots.length && !shots[0].melee && mel.length) { const md = mel.reduce((a, x) => a + dps(x), 0), mcd = Math.max(0.3, ...mel.map(x => x.reload));
    CL[k] = { range: 3, dmg: +(md * mcd).toFixed(1), cd: mcd, type: 'melee', vs: Object.fromEntries(ARMORS.map(a => [a, +(mel.reduce((m, x) => m + x.vs[a] * dps(x), 0) / md / 100).toFixed(3)])) as Record<Armor, number> }; }
  return main && { cd: Math.max(0.3, main.reload), range: main.melee ? 0 : Math.max(...shots.map(x => x.range)), melee: main.melee, total: shots.reduce((a, x) => a + dps(x), 0), aoe: Math.max(0, ...shots.map(x => x.aoe ?? 0)), minRange: main.minRange ?? 0, name: u.name, file: main.file, mor: shots.reduce((a, x) => a + (x.morale ?? 0) * x.accuracy / Math.max(0.1, x.reload), 0) };
}
for (const [f, race] of Object.entries(MOD_RACES) as [FactionId, (typeof MOD_RACES)[keyof typeof MOD_RACES]][]) {
  const T = FSTATS[f] = structuredClone(STATS), V: Partial<Record<Kind, Record<Armor, number>>> = UA_VS[f] = {}, RG: Partial<Record<Kind, number>> = UA_REGEN[f] = {};
  const WP: Partial<Record<Kind, string[]>> = UA_WEAPONS[f] = {};
  const UP: Partial<Record<Kind, Upgrade & UAUp>> = UA_UPG[f] = {};
  const SQ: Partial<Record<Kind, { max: number; cost: number; time: number }>> = UA_SQ[f] = {};
  const EN: Partial<Record<Kind, number>> = UA_ENERGY[f] = {};
  for (const [k, id] of Object.entries(race.unit) as [Kind, string][]) {
    const q = race.data.squads[id], u = q.unit, st = T[k], n = Math.max(1, q.min); // стартовый размер отряда мода
    const ar = modArmor((u as { armourType?: string }).armourType), pop = (q as { cap?: number; support?: number }).cap || (q as { support?: number }).support;
    if (ar) (UA_ARMOR[f] ??= {})[k] = ar;
    if (pop) (UA_POP[f] ??= {})[k] = pop;
    if (q.max > n && !SLOT.has(k)) SQ[k] = { max: q.max, cost: (q as { reinforce?: number }).reinforce || u.cost, time: Math.max(1, u.time) };
    RG[k] = +((u.regen ?? 0) * UA_K.hp).toFixed(2);
    const w = modWeapons(u, k, n, WP, V, UP, false, UA_CLOSE[f] ??= {});
    if (!SLOT.has(k)) EN[k] = Math.round((u.power ?? 0) * n * UA_K.cost);
    Object.assign(st, {
      hp: Math.round(u.hp * UA_K.hp), n, speed: +(u.speed * UA_K.speed).toFixed(1), sight: Math.round(u.sight * UA_K.sight),
      ...(SLOT.has(k) ? {} : { cost: Math.round(u.cost * n * UA_K.cost), time: Math.round(u.time * n) }), // отряд мода = бойцы × цена и время бойца
      ...(w && k !== 'builder' && k !== 'mine' ? { dmg: +(w.total * w.cd * UA_K.dmg).toFixed(1), cd: w.cd, range: w.melee ? Math.min(st.range, 2.6) : Math.round(w.range * UA_K.range) } : {}),
    });
    (UA_AOE[f] ??= {})[k] = w ? +(w.aoe * UA_K.range).toFixed(1) : 0; // площадь — из ствола мода (0 — точечный)
    const mw = u.hardpoints.flat().find(x => x.file === w?.file) as ModWeapon | undefined;
    const qm = (q as { morale?: UAMorale }).morale; if (qm) (UA_MOR[f] ??= {})[k] = qm;
    (UA_MDMG[f] ??= {})[k] = w ? +((w.mor ?? 0) * w.cd).toFixed(1) : 0;
    (UA_SETUP[f] ??= {})[k] = mw?.setup ?? 0;
    (UA_MOVEACC[f] ??= {})[k] = mw ? Math.max(0, mw.accuracy - (mw.moveAcc ?? 0)) / Math.max(0.01, mw.accuracy) : 1; // ponytail: снижение точности вычитаем из точности (у ласпушки 2 > 1 — на ходу не попадает); если в DoW множитель — поправить здесь
  }
  for (const [k, id] of Object.entries(race.build) as [Kind, string][]) {
    const b = race.data.buildings[id];
    Object.assign(T[k], { hp: Math.round(b.hp * UA_K.bhp), sight: Math.round(b.sight * UA_K.sight), cost: Math.round(b.cost * UA_K.cost), time: Math.max(1, Math.round(b.time)) }); // цена и время стройки — как в моде
    EN[k] = Math.round((b.power ?? 0) * UA_K.cost);
    const w = k !== 'mine' && b.hardpoints.length ? modWeapons(b, k, 1, WP, V, UP, true) : undefined;
    if (b.hardpoints[0]?.[0] && !(b.hardpoints[0][0].max > 0) && b.hardpoints[0].some(x => x.max > 0)) UA_UNARMED.add(`${f}/${k}`); // в моде ствол по умолчанию — пустышка: стреляет только с аддоном // турели и бункеры мода стреляют своими стволами
    if (w) Object.assign(T[k], { dmg: +(w.total * w.cd * UA_K.dmg).toFixed(1), cd: w.cd, range: w.melee ? T[k].range : Math.round(w.range * UA_K.range) });
  }
}

/**
 * Оружие отрядов UA, как в моде: в панели отряда стволы на выбор, каждый покупается одному бойцу (сколько всего — max_upgrades отряда,
 * в одну точку крепления — не больше живых бойцов). Цена, время и требования — из файла ствола. Заменяет уровень 2 у отрядов UA.
 */
type ArmOpt = { h: number; file: string; name: string; icon: string; cost: number; power: number; time: number; requires: string[]; d: number; dv: Record<Armor, number>; range: number }; // range — дальность купленного стрелкового ствола, м игры (0 — рукопашный)
export const UA_ARM: Partial<Record<FactionId, Partial<Record<Kind, { ups: number; opts: ArmOpt[]; d0: number; v0: Record<Armor, number> }>>>> = {};
for (const [f, race] of Object.entries(MOD_RACES) as [FactionId, (typeof MOD_RACES)[keyof typeof MOD_RACES]][]) {
  const A: NonNullable<(typeof UA_ARM)[FactionId]> = UA_ARM[f] = {};
  for (const [k, id] of Object.entries(race.unit) as [Kind, string][]) {
    const q = race.data.squads[id] as (typeof race.data.squads)[string] & { ups?: number };
    if (!q?.ups || SLOT.has(k) || k === 'builder') continue;
    const dps = (w: ModWeapon) => ((w.min + w.max) / 2) * w.accuracy / Math.max(0.1, w.reload);
    const hps = q.unit.hardpoints, pick = hps.map(l => l[0]);
    const shots = pick.filter(w => w && w.max > 0 && (!pick.some(x => x && !x.melee && x.max > 0) || !w.melee)), d0 = shots.reduce((a, w) => a + dps(w), 0);
    if (!d0) continue;
    const v0 = Object.fromEntries(ARMORS.map(a => [a, shots.reduce((m, w) => m + w.vs[a] * dps(w), 0) / 100])) as Record<Armor, number>; // урон × пробитие стартового бойца
    const opts: ArmOpt[] = [];
    hps.forEach((l, h) => { for (const w of l) if (w !== pick[h] && w.max > 0 && (w.cost || w.power)) {
      const b = pick[h] && shots.includes(pick[h]) ? pick[h] : undefined, bd = b ? dps(b) : 0, x = w as ModWeapon & { icon?: string; requires?: string[] };
      opts.push({ h, file: w.file ?? '', name: w.name || (w.file ?? '').replace(/^[a-z]+_|_/g, ' ').trim(), icon: x.icon ?? '', cost: w.cost ?? 0, power: w.power ?? 0, time: Math.max(1, w.time ?? 1), requires: x.requires ?? [],
        range: w.melee ? 0 : Math.round(w.range * UA_K.range), d: dps(w) - bd, dv: Object.fromEntries(ARMORS.map(a => [a, (dps(w) * w.vs[a] - bd * (b?.vs[a] ?? 0)) / 100])) as Record<Armor, number> }); // прибавка к залпу и пробитию бойца с этим стволом
    } });
    if (opts.length) { A[k] = { ups: q.ups, opts, d0, v0 }; delete UA_UPG[f]![k]; }
  }
}

/**
 * Исследования рас UA: из attrib/research мода. Модификатор бьёт по юниту, отряду или стволу мода — сопоставляем с видом игры.
 * Поддержаны: HP, размер отряда, урон, скорость, дальность, регенерация, броня и урон в ближнем бою, доход, скорость производства.
 */
type ModResearch = { req?: UAReq; name: string; info: string; icon: string; cost: number; power: number; time: number; building: string; requires: string[]; mods: { type: string; value: number; add: boolean; target: string; on: string }[] };
export type UAReq = { t: string; ids: string[] }[];
/** Где в моде ведут исследование или ставят аддон: здания расы, в чьих списках research/addons оно есть (их виды в игре, по порядку сборки). */
function modWhere(race: (typeof MOD_RACES)[keyof typeof MOD_RACES], list: 'research' | 'addons', at: Map<string, Kind>) {
  const W = new Map<string, Kind[]>();
  for (const [bid, b] of Object.entries(race.data.buildings as Record<string, { research?: string[]; addons?: string[] }>)) {
    const k = at.get(bid);
    if (k) for (const id of b[list] ?? []) { const l = W.get(id) ?? []; if (!l.includes(k)) l.push(k); W.set(id, l); }
  }
  return (id: string) => W.get(id) ?? [];
}
export type UAResearch = { id: string; name: string; info: string; icon: string; cost: number; energy: number; time: number; at: Kind; ats: Kind[]; mods: ModResearch['mods']; req: UAReq }; // ats — все здания, где его ведут в моде (списки research зданий), at — первое
export const UA_RESEARCH: Partial<Record<FactionId, UAResearch[]>> = {};
const UA_TARGET: Partial<Record<FactionId, Map<string, Kind[]>>> = {};
for (const [f, race] of Object.entries(MOD_RACES) as [FactionId, (typeof MOD_RACES)[keyof typeof MOD_RACES]][]) {
  const at = new Map(Object.entries(race.build).map(([k, id]) => [id, k as Kind])), pre = f === 'inquisition' ? 'inquisition' : f;
  const data = race.data as unknown as { research?: Record<string, ModResearch> };
  // все исследования зданий расы, и без модификаторов: «схемы» и прочие открывают юнитов и постройки через требования (UA_REQ)
  const ats = modWhere(race, 'research', at);
  UA_RESEARCH[f] = Object.entries(data.research ?? {}).filter(([id]) => ats(id).length).map(([id, r]) => ({
    req: r.req ?? [], id, name: r.name || id.replace(/^[a-z]+_|_research$/g, '').replace(/_/g, ' '), info: r.info, icon: r.icon, cost: Math.round(r.cost * UA_K.cost), energy: Math.round(r.power * UA_K.cost), time: Math.max(1, Math.round(r.time)), at: ats(id)[0], ats: ats(id), mods: r.mods,
  }));
  const T = new Map<string, Kind[]>(), put = (name: string, k: Kind) => { const l = T.get(name) ?? []; if (!l.includes(k)) l.push(k); T.set(name, l); };
  for (const [k, id] of [...Object.entries(race.unit), ...race.legends.map(id => ['legend', id] as const)] as [Kind, string][]) {
    const q = race.data.squads[id];
    if (!q) continue;
    put(`${pre}_squad_${id}`, k); put((q.unit as { id?: string }).id ?? '', k);
    for (const l of q.unit.hardpoints) for (const w of l) put((w as ModWeapon & { file?: string }).file ?? '', k);
  }
  for (const [k, id] of Object.entries(race.build) as [Kind, string][]) { // здания и их стволы: исследования турелей бьют по ним
    const b = race.data.buildings[id] as ModUnit | undefined;
    if (!b) continue;
    put(b.id ?? '', k);
    for (const l of b.hardpoints) for (const w of l) put(w.file ?? '', k);
  }
  UA_TARGET[f] = T;
}

/**
 * Дерево требований UA (задача 4 в docs/UA-TODO.md): что нужно для постройки, найма, исследования и аддона — построенное здание, аддон, изученное исследование.
 * Аддоны (задача 5) — достройки здания за ресурсы: у тиранидов и Инквизиции тир штаба тоже аддон. На юните — битовая маска ad (индексы UA_ADDONS расы).
 */
export type UAAddon = { id: string; name: string; info: string; icon: string; cost: number; energy: number; time: number; at: Kind; ats: Kind[]; mods: ModResearch['mods']; req: UAReq };
export const UA_ADDONS: Partial<Record<FactionId, UAAddon[]>> = {};
/** Требования вида у фракции UA: постройки — по зданию мода, найм — по отряду мода. */
export const UA_REQ: Partial<Record<FactionId, Partial<Record<Kind, UAReq>>>> = {};
/** Имя мода → вид игры (здания) и индексы исследований/аддонов; имена для подсказок «Нужно: …». */
const UA_IDX: Partial<Record<FactionId, { kind: Map<string, Kind>; research: Map<string, number>; addon: Map<string, number>; name: Map<string, string> }>> = {};
for (const [f, race] of Object.entries(MOD_RACES) as [FactionId, (typeof MOD_RACES)[keyof typeof MOD_RACES]][]) {
  const data = race.data as unknown as { buildings: Record<string, ModUnit & { req?: UAReq }>; squads: Record<string, { req?: UAReq }>; addons?: Record<string, ModResearch & { building: string }> };
  const at = new Map(Object.entries(race.build).map(([k, id]) => [id, k as Kind]));
  const ats = modWhere(race, 'addons', at);
  UA_ADDONS[f] = Object.entries(data.addons ?? {}).filter(([id]) => ats(id).length).map(([id, a]) => ({
    id, name: a.name || id.replace(/^[a-z]+_|_addon$/g, '').replace(/_/g, ' '), info: a.info, icon: a.icon, cost: Math.round(a.cost * UA_K.cost), energy: Math.round(a.power * UA_K.cost), time: Math.max(1, Math.round(a.time)), at: ats(id)[0], ats: ats(id), mods: a.mods, req: a.req ?? [],
  }));
  const R: Partial<Record<Kind, UAReq>> = UA_REQ[f] = {}, I = UA_IDX[f] = { kind: new Map(), research: new Map(), addon: new Map(), name: new Map() };
  for (const [k, id] of Object.entries(race.build) as [Kind, string][]) { const b = data.buildings[id]; if (!b) continue; R[k] = b.req ?? []; if (b.id) { I.kind.set(b.id, k); I.name.set(b.id, b.name || id); } }
  for (const [k, id] of Object.entries(race.unit) as [Kind, string][]) R[k] = data.squads[id]?.req ?? [];
  UA_RESEARCH[f]!.forEach((x, i) => { I.research.set(x.id, i); I.name.set(x.id, x.name); });
  UA_ADDONS[f]!.forEach((x, i) => { I.addon.set(x.id, i); I.name.set(x.id, x.name); });
}
/** Смена ствола аддоном (задача 6): default_weapon_modifier_hardpoint1 прибавляет к индексу ствола в точке крепления 1 — у турели Инквизиции болтер → ракетная → улучшенная,
 *  зонд — пустой ствол (датчик), у тиранидов — кислотные споры. Варианты — как апгрейд UA (во сколько раз урон, прибавка дальности, пробитие) к базовому стволу. */
const UA_HP1: Partial<Record<FactionId, Partial<Record<Kind, ((Upgrade & UAUp) | undefined)[]>>>> = {};
for (const [f, race] of Object.entries(MOD_RACES) as [FactionId, (typeof MOD_RACES)[keyof typeof MOD_RACES]][]) {
  const H: Partial<Record<Kind, ((Upgrade & UAUp) | undefined)[]>> = UA_HP1[f] = {}, swap = new Set(UA_ADDONS[f]!.filter(a => a.mods.some(m => m.type === 'default_weapon_modifier_hardpoint1')).flatMap(a => a.ats));
  for (const k of swap) {
    const b = (race.data.buildings as Record<string, ModUnit>)[(race.build as Partial<Record<Kind, string>>)[k]!], hp1 = b?.hardpoints[0];
    if (!b || !hp1 || hp1.length < 2) continue;
    const base = modWeapons(b, k, 1, {}, {}, {}, true);
    H[k] = hp1.map((w, j) => {
      if (j === 0 || !base) return undefined;
      const V: Partial<Record<Kind, Record<Armor, number>>> = {}, x = modWeapons({ ...b, hardpoints: [[w], ...b.hardpoints.slice(1)] }, k, 1, {}, V, {}, true);
      return { name: w.name || w.file || '', tier: 1, relics: 0, cost: 0, energy: 0, time: 0, dmg: x ? +((x.total * x.cd) / (base.total * base.cd)).toFixed(2) : 0, cd: x ? +(x.cd / base.cd).toFixed(2) : 1, range: x && !x.melee ? Math.round((x.range - base.range) * UA_K.range) : 0, vs: V[k] ?? UA_VS[f]![k]!, aoe: (x?.aoe ?? 0) * UA_K.range };
    });
    delete UA_UPG[f]![k]; // ствол меняют аддоны, а не общий апгрейд второго уровня
  }
}
/** Ствол здания по его аддонам (или undefined — базовый). */
export function addonWeapon(u: Unit) {
  const L = u.f && u.ad ? UA_HP1[u.f]?.[u.kind] : undefined;
  if (!L) return;
  let j = 0;
  UA_ADDONS[u.f!]!.forEach((a, i) => { if (u.ad! & (1 << i)) for (const m of a.mods) if (m.type === 'default_weapon_modifier_hardpoint1') j += m.value; });
  return L[Math.min(Math.round(j), L.length - 1)];
}
/** Что есть у игрока для проверки требований: на сервере — из состояния, в клиенте — из снимка. */
export type UAHave = { built: (k: Kind) => boolean; addon: (i: number) => boolean; research: (i: number) => boolean };
/** Чего не хватает по требованиям UA (текст для подсказки) или undefined. local — маска аддонов здания, у которого заказ.
 *  ponytail: требование к тому, чего у нас нет (здание/исследование/аддон мода без пары в игре), считается выполненным — иначе ветка закрыта навсегда. */
export function uaMissing(f: FactionId, req: UAReq | undefined, have: UAHave, local = 0): string | undefined {
  const I = UA_IDX[f];
  if (!I || !req) return;
  const ok = (t: string, id: string) => {
    if (t === 'structure' || t === 'either') { const k = I.kind.get(id); return k === undefined || have.built(k); }
    if (t === 'research') { const i = I.research.get(id); return i === undefined || have.research(i); }
    const i = I.addon.get(id);
    if (i === undefined) return true;
    return t === 'addon' ? have.addon(i) : t === 'local_addon' ? (local & (1 << i)) !== 0 : t === 'no_local_addon' ? (local & (1 << i)) === 0 : true;
  };
  for (const r of req) if (!(r.t === 'either' ? r.ids.some(id => ok(r.t, id)) : r.ids.every(id => ok(r.t, id)))) {
    const miss = r.ids.filter(id => !ok(r.t, id)).map(id => I.name.get(id) || id);
    return r.t === 'no_local_addon' ? `Уже есть: ${r.ids.map(id => I.name.get(id) || id).join(', ')}` : `Нужно: ${miss.join(r.t === 'either' ? ' или ' : ', ')}`;
  }
}
/** Требования UA на сервере: здания игрока, его аддоны и исследования. */
const haveOf = (s: State, owner: number): UAHave => s.players[owner].cheat ? { built: () => true, addon: () => true, research: () => true } : ({ // чит (F9, тесты) — всё открыто
  built: (k) => s.units.some(u => u.owner === owner && u.kind === k && u.build >= 1 && u.hp > 0),
  addon: (i) => s.units.some(u => u.owner === owner && u.hp > 0 && ((u.ad ?? 0) & (1 << i)) !== 0),
  research: (i) => !!s.players[owner].ur?.includes(i),
});
type Mods = { hp: number; hpAdd: number; n: number; dmg: number; speed: number; range: number; regen: number; regenAdd: number; taken: number; melee: number; sight: number; sightAdd: number; cost: number; costAdd: number; power: number; powerAdd: number; time: number; repair: number; build: number };
type UAMods = { kinds: Partial<Record<Kind, Mods>>; req: number; power: number; prod: number; squad: number; support: number };
const NO_MODS: Mods = { hp: 1, hpAdd: 0, n: 0, dmg: 1, speed: 1, range: 0, regen: 1, regenAdd: 0, taken: 1, melee: 1, sight: 1, sightAdd: 0, cost: 1, costAdd: 0, power: 1, powerAdd: 0, time: 1, repair: 1, build: 1 };
/** Чьи модификаторы считать: игрок на сервере, в клиенте — то же из снимка (раса, изученное, аддоны своих зданий). */
export type UAModsOf = Pick<Player, 'faction' | 'ur' | 'ad' | 'um'>;
/** Итог изученного игроком: по видам и общий (доход, производство, лимиты). Кэш сбрасывается, когда исследование завершилось.
 *  Нет механики в игре — не считаем: keen_sight_radius (нет невидимости), morale_* (нет морали), ability_recharge (способностей мода нет). */
export function uaMods(p: UAModsOf): UAMods {
  if (p.um) return p.um;
  const kinds: Partial<Record<Kind, Mods>> = {}, all = { req: 1, power: 1, prod: 1, squad: 0, support: 0 }, list = UA_RESEARCH[p.faction] ?? [], T = UA_TARGET[p.faction];
  // исследования и аддоны (у живых зданий игрока, p.ad); смена ствола аддоном (default_weapon_modifier_*) и on: 'entity' — у самого здания (addonSight), не здесь
  for (const m of [...(p.ur ?? []).flatMap(i => list[i]?.mods ?? []), ...(UA_ADDONS[p.faction] ?? []).flatMap((a, i) => ((p.ad ?? 0) & (1 << i) ? a.mods : []))]) {
    if (m.on === 'player') {
      if (m.type === 'income_requisition_player') all.req *= m.add ? 1 + m.value : m.value;
      if (m.type === 'income_power_player') all.power *= m.add ? 1 + m.value : m.value;
      // лимит отрядов мода — в очках Легиона 1:1, поддержка — лимит техники; «максимум лимита» у нас то же, что лимит
      if (m.add && (m.type === 'squad_cap_player' || m.type === 'max_squad_cap_player')) all.squad += m.value;
      if (m.add && (m.type === 'support_cap_player' || m.type === 'max_support_cap_player')) all.support += m.value;
      continue;
    }
    if (m.on === 'entity') continue;
    if (m.type === 'production_speed') { all.prod *= m.add ? 1 + m.value : m.value; continue; }
    // ремонт в моде у сервитора-техника Инквизиции, у нас чинят строители
    for (const k of T?.get(m.target) ?? (m.type === 'repair_rate' ? ['builder' as Kind] : [])) {
      const o = kinds[k] ??= { ...NO_MODS }, mul = (v: number) => (m.add ? 1 + v : v);
      switch (m.type) {
        case 'health_maximum': if (m.add) o.hpAdd += m.value; else o.hp *= m.value; break;
        case 'max_troopers_squad': o.n += m.add ? m.value : 0; break;
        case 'max_damage_weapon': o.dmg *= mul(m.value); break; // min и max идут парой — берём один
        case 'speed_maximum': o.speed *= mul(m.value); break;
        case 'max_range_weapon': o.range += m.add ? m.value : (m.value - 1) * statOf(k, p.faction).range / UA_K.range; break; // множитель — от базовой дальности (в метрах мода)
        case 'health_regeneration': if (m.add) o.regenAdd += m.value; else o.regen *= m.value; break;
        case 'armour': o.taken *= m.add ? Math.max(0.5, 1 - m.value / 100) : 1; break;
        case 'health_meleedamage_received': o.melee *= mul(m.value); break;
        case 'sight_radius': if (m.add) o.sightAdd += m.value; else o.sight *= m.value; break;
        case 'cost_requisition': if (m.add) o.costAdd += m.value; else o.cost *= m.value; break; // цена бойца мода
        case 'cost_power': if (m.add) o.powerAdd += m.value; else o.power *= m.value; break;
        case 'cost_time': o.time *= mul(m.value); break;
        case 'repair_rate': o.repair *= mul(m.value); break;
        case 'construction_speed': o.build *= mul(m.value); break;
      }
    }
  }
  return (p.um = { kinds, ...all });
}
const modsOf = (s: State, u: Unit) => uaMods(s.players[u.owner]).kinds[u.kind] ?? NO_MODS;
/** Модификаторы вида у игрока (или без игрока — базовые). */
export const kindMods = (p: UAModsOf | undefined, k: Kind) => (p && uaMods(p).kinds[k]) || NO_MODS;
/** Обзор юнита: исследования по виду и аддоны самого здания (on: 'entity' — у зонда турели Инквизиции, ×2). */
export function sightOf(p: UAModsOf | undefined, u: Pick<Unit, 'kind' | 'f' | 'ad'>) {
  const m = kindMods(p, u.kind);
  let mul = m.sight, add = m.sightAdd;
  if (u.ad) UA_ADDONS[u.f!]?.forEach((a, i) => { if (u.ad! & (1 << i)) for (const x of a.mods) if (x.on === 'entity' && x.type === 'sight_radius') { if (x.add) add += x.value; else mul *= x.value; } });
  return statOf(u.kind, u.f).sight * mul + add * UA_K.sight;
}
/** Время найма с исследованиями (cost_time мода). */
export const trainTime = (f: FactionId | undefined, what: Kind, p?: UAModsOf) => statOf(what, f).time * kindMods(p, what).time;
/** HP бойца и размер отряда с исследованиями: пишем на юнит (у hpOf нет доступа к состоянию). */
function refreshUnit(s: State, u: Unit) {
  const m = modsOf(s, u), st = ST(u);
  if (m === NO_MODS && u.mh === undefined && u.sz === undefined) return;
  const before = hpOf(u);
  u.mh = Math.round(st.hp * m.hp + m.hpAdd * UA_K.hp); u.mn = u.sz ?? st.n; // исследования «бойцов в отряде» поднимают предел пополнения (squadCap), как в DoW
  if (before > 0) u.hp = Math.min(hpOf(u), u.hp * (hpOf(u) / before)); // доля здоровья сохраняется
}
/** Артиллерия не стреляет в упор (мёртвая зона), уникальные постройки: радиусы аур. */
export const MIN_RANGE: Partial<Record<Kind, number>> = { arty: 10, battery: 8, megagun: 8 };
/** ПВО: самолёты (jet) получают от построек ×3, от тяжёлого оружия пехоты ×1.5; сами по зданиям бьют вполсилы — штурмовики, а не бомбардировщики. */
export const AA = { struct: 3, heavy: 1.5, jetVsStruct: 0.5 };
/** Осадная дальность: артиллерия бьёт по зданиям дальше, чем по войскам (нужна разведка или засвет). */
export const SIEGE_RANGE: Partial<Record<Kind, number>> = {}; // как в UA: дальность по зданиям — та же, что у ствола
/** Засвет из штаба: круг r м открыт t с, видны и скрытые порталом; стоит энергии, перезарядка cd. */
export const SCAN = { energy: 75, cd: 40, r: 22, t: 12 };

/** Сверхоружие штаба: заряд 3 минуты, предупреждение 6 с всем игрокам; бьёт только врагов, у каждой фракции свой удар (doomStrike). */
export const DOOM = { charge: 240, warn: 6, struct: 0.5 }; // по постройкам сверхоружие бьёт вполсилы: один пуск не сносит базу
/** Радиус поражения сверхоружия по фракциям — по нему же рисуется предупреждение. */
export const DOOM_R: Partial<Record<FactionId, number>> = { tyranids: 18, inquisition: 12 };
/** Открытия в штабе: мегапостройки обороны (тир IV) и сверхоружие (тир V, дорого). */
export const UNLOCKS = [
  { name: 'Мегапостройки', info: 'открывает мегапостройку обороны фракции', cost: 1500, energy: 1200, relics: 1, time: 90, tier: 4 },
  { name: 'Сверхоружие', info: 'открывает сверхоружие фракции', cost: 3000, energy: 3000, relics: 1, time: 120, tier: 5 },
];
export const DOOM_SHOT = 800;
/** Пожар от зажигательного снаряда: радиус, урон в секунду (и по зданиям), длительность. */
export const FIRE = { r: 4, dps: 25, t: 6 };
export const MEGA = new Set<Kind>(['lighthouse', 'obelisk', 'megagun', 'plague', 'spire']);
/** Дальний удар любой мегапостройки: раз в cd с бьёт в range м (туман не мешает) туда, где врагов больше всего (постройки ×2), и засвечивает место попадания. */
export const MEGA_SHOT = { range: 200, cd: 20, dmg: 700, aoe: 10, reveal: 40, t: 20 };
export const LIGHTHOUSE = { r: 25, armor: 0.85 }, PLAGUE = { r: 30, pct: 0.01 };
export const PYRE = { r: 8, dps: 18 }, BELL = { r: 14, dmg: 0.8, speed: 0.8 };
export const AEGIS = { pool: 1200, r: 12, regen: 1200 / 30, broken: 10 };   // щит купола: 1200 урона, полностью за 30 с, после пробоя 10 с не работает
export const DEITY = { energy: 600, lvl: 10, tier: 4, stop: 12, stopTime: 3, stopCd: 45, deathLock: 300, rise: 4 };
/** Победные очки: держишь меньше точек, чем враг, — твои очки тают; критическая точка (центр) считается за две. */
/** Туман войны: радиус обзора по умолчанию у построек и юнитов без своего обзора. */
export const SIGHT_STRUCT = 12;
/** Захват точки отрядом, секунд (без поста); прогресс без отряда спадает вдвое медленнее. */
export const CAPTURE_TIME = 12;

// ---------- состав армии: откуда, с какого тира, сколько Легиона, броня и тип урона ----------
export type Armor = 'inf' | 'hinf' | 'light' | 'veh' | 'titan' | 'struct' | 'cmd'; // cmd — командир (type_armour commander мода) // light — лёгкая техника: стрелковое оружие её царапает
export type DmgType = 'small' | 'sniper' | 'heavy' | 'melee' | 'blast';
export type Role = { from: Kind; tier: number; pop: number; armor: Armor; dmg: DmgType; energy?: number; relics?: number; aoe?: number; heal?: number; meters: number; one?: boolean; fac?: FactionId; noFac?: FactionId[] };
/** Постройки, которых нет у фракции в Ultimate Apocalypse (у тиранидов нет стен и бункеров, у Инквизиции — ворот, ни у кого — уникальных построек базовой игры). */
export const NO_BUILD: Partial<Record<FactionId, Buildable[]>> = {}; // заполняется ниже: расе из UA — только её постройки из UA // one — титан-класс (свой слот вне лимитов, нужна критическая точка; сколько угодно, если хватает ресурсов), fac — только этой фракции
export const ROLES: Partial<Record<Kind, Role>> = {
  builder: { from: 'hq', tier: 1, pop: 0, armor: 'inf', dmg: 'small', energy: 10, meters: 1.8 },
  guard: { from: 'barracks', tier: 1, pop: 2, armor: 'inf', dmg: 'small', energy: 35, meters: 2.4 },
  sniper: { from: 'barracks', tier: 2, pop: 2, armor: 'inf', dmg: 'sniper', energy: 60, meters: 2.3 },
  heavy: { from: 'barracks', tier: 2, pop: 3, armor: 'inf', dmg: 'heavy', energy: 90, meters: 2.6 },
  support: { from: 'barracks', tier: 2, pop: 2, armor: 'inf', dmg: 'small', energy: 50, meters: 2.2 },
  elite: { from: 'barracks', tier: 3, pop: 4, armor: 'hinf', dmg: 'melee', energy: 120, meters: 3.1 },
  // healer: убран из найма — лечение 5%/с делало армию бесконечной (вид остаётся в KINDS ради индексов снимков)
  lveh: { from: 'motorpool', tier: 3, pop: 4, armor: 'light', dmg: 'small', energy: 110, meters: 4.5 },
  mveh: { from: 'motorpool', tier: 3, pop: 6, armor: 'veh', dmg: 'small', energy: 220, aoe: 3, meters: 6 },
  hveh: { from: 'motorpool', tier: 3, pop: 8, armor: 'veh', dmg: 'heavy', energy: 350, aoe: 2.5, meters: 8 },
  arty: { from: 'motorpool', tier: 3, pop: 6, armor: 'veh', dmg: 'blast', energy: 300, aoe: 5, meters: 6 },
  titan: { from: 'yard', tier: 4, pop: 20, armor: 'titan', dmg: 'blast', energy: 3000, aoe: 7, meters: 34, one: true },
  jet: { from: 'motorpool', tier: 3, pop: 6, armor: 'light', dmg: 'heavy', energy: 280, meters: 7, noFac: ['tyranids'] }, // у тиранидов нет модели в Ultimate Apocalypse
  air: { from: 'barracks', tier: 2, pop: 3, armor: 'inf', dmg: 'small', energy: 80, meters: 2.6 },
  khorne: { from: 'warpgate', tier: 3, pop: 4, armor: 'hinf', dmg: 'melee', energy: 90, meters: 2.6 },
  nurgle: { from: 'warpgate', tier: 4, pop: 5, armor: 'hinf', dmg: 'melee', energy: 160, relics: 1, meters: 2.8 },
  tzeentch: { from: 'warpgate', tier: 4, pop: 5, armor: 'inf', dmg: 'blast', energy: 180, relics: 1, aoe: 2.5, meters: 2.4 },
  slaanesh: { from: 'warpgate', tier: 3, pop: 3, armor: 'inf', dmg: 'melee', energy: 70, meters: 2.4 },
};
/** Урон по броне (как в DoW/WH40k): болтеры и пулемёты почти не пробивают технику, снайпер косит пехоту, противотанковое — технику, взрывчатка — здания. */
export const VS: Record<DmgType, Record<Armor, number>> = {
  small: { inf: 1, hinf: 0.7, light: 0.5, veh: 0.04, titan: 0.01, struct: 0.15, cmd: 0.7 },
  sniper: { inf: 1.8, hinf: 0.8, light: 0.1, veh: 0.02, titan: 0.01, struct: 0.05, cmd: 0.8 },
  heavy: { inf: 0.4, hinf: 1.1, light: 1.3, veh: 1.2, titan: 1, struct: 1.2, cmd: 1.1 },
  melee: { inf: 1.1, hinf: 1, light: 0.6, veh: 0.4, titan: 0.15, struct: 0.4, cmd: 1 },
  blast: { inf: 1.2, hinf: 0.9, light: 0.9, veh: 0.7, titan: 0.5, struct: 1.6, cmd: 0.9 },
};
/** Тяжёлое оружие пехоты: у Орды пулемёты-шуты, у Синклита огнемёты — это против пехоты, не против брони. */
const HEAVY_SMALL = new Set<FactionId>();
const STRUCT_DMG: Partial<Record<Kind, DmgType>> = { rturret: 'blast', battery: 'blast', pylon: 'heavy', obelisk: 'heavy', megagun: 'blast' };
export const STRUCT_AOE: Partial<Record<Kind, number>> = { rturret: 3, battery: 4, megagun: 6 };
/** Уникальные турели фракций (множители к STATS.turret): тираниды — дальнобойная биопушка со сплэшем, Хаос — Статуя Кхорна (аура ярости, см. KHORNE). */
export const TURRET_FAC: Partial<Record<FactionId, UnitMod & { name: string }>> = {}; // у рас UA турели бьют стволами мода, без бонусов игры
/** Свой «движ» у техники, титанов и части пехоты по фракциям (множители к STATS и особые эффекты попадания).
 *  fire — земля горит (FIRE), freeze — цель замирает на N с, leech — доля урона лечит стрелка. */
export type UnitMod = { info: string; dmg?: number; range?: number; cd?: number; type?: DmgType; aoe?: number; fire?: boolean; freeze?: number; leech?: number; minRange?: number; up?: { range: number; aoe: number } }; // up — прибавка улучшенной версии (ур. 2)
export const UNIT_FAC: Partial<Record<FactionId, Partial<Record<Kind, UnitMod>>>> = {}; // у рас UA — только стволы мода, без бонусов игры (площадь Тригона, вампиризм Равенера)
/** Свойства юнита с учётом фракции: турели — TURRET_FAC, остальное — UNIT_FAC. */
export const modOf = (f: FactionId, k: Kind): UnitMod | undefined => (k === 'turret' ? TURRET_FAC[f] : UNIT_FAC[f]?.[k]);
/** Второе оружие вблизи (как в Dawn of War: у отряда несколько стволов разной дальности). Цель ближе range — бьёт им.
 *  Тяжёлые и снайперы отбиваются стрелковым, техника — спаренным пулемётом, Дредноуты и титаны — кулаками и пинками. */
export const CLOSE: Partial<Record<Kind, { range: number; dmg: number; cd: number; type: DmgType }>> = {
  heavy: { range: 8, dmg: 5, cd: 1, type: 'small' }, sniper: { range: 6, dmg: 6, cd: 1, type: 'small' },
  hveh: { range: 12, dmg: 8, cd: 0.5, type: 'small' }, mveh: { range: 3.5, dmg: 70, cd: 1, type: 'melee' }, titan: { range: 7, dmg: 220, cd: 2, type: 'melee' },
};
/** Тяжёлое оружие не стреляет на ходу — надо встать (setup, как в DoW). */
export const SETUP = new Set<Kind>(['heavy', 'sniper', 'arty']);
/** Вторые механики фракций: сильная сторона с ценой. Тексты — в FACTIONS.mech. */
export const TRIBUTE = 20;                                  // Хаос: каждые 20 убийств — 150 энергии (TRIBUTE_ENERGY)
export const PAIN = { per: 10, step: 0.03, max: 0.15 };     // Тёмные эльдар: +3% урона за 10 убийств, до +15%
export const SYNAPSE = { r: 20, on: 1.1, off: 0.85 };       // Тираниды: у синапса +10%, без него −15%
const SYNAPSE_KINDS = new Set<Kind>(['captain', 'healer', 'legend', 'hq']);
export const armorOf = (k: Kind, f?: FactionId): Armor => (isStruct(k) ? 'struct' : (f && UA_ARMOR[f]?.[k]) || ROLES[k]?.armor || (k === 'legend' || k === 'captain' ? 'hinf' : 'inf')); // у рас UA — класс брони мода
/** Сколько лимита занимает отряд: у рас UA — squad_cap/support_cap мода, иначе роль игры. */
export const popOf = (k: Kind, f?: FactionId) => (f && UA_POP[f]?.[k]) || ROLES[k]?.pop || 0;
export const dmgOf = (k: Kind, f: FactionId): DmgType => (k === 'guard' && isMelee('guard', f)) || k === 'captain' || k === 'legend' || k === 'deity' ? 'melee' : k === 'heavy' && HEAVY_SMALL.has(f) ? 'small' : ROLES[k]?.dmg ?? STRUCT_DMG[k] ?? 'small';
export const LEGION_CAP = 60, MOTOR_CAP = 45; // пехота и техника считаются отдельно
export const SQUADS = new Set<Kind>(['guard', 'sniper', 'heavy', 'support', 'elite', 'air', 'khorne', 'nurgle', 'tzeentch', 'slaanesh']); // пополняются бойцами
export const VEHICLES = new Set<Kind>(['lveh', 'mveh', 'hveh', 'arty', 'titan', 'jet', 'bomber']);
/** Самолёты: по ним работает ПВО (AA). */
export const AIRCRAFT = new Set<Kind>(['jet', 'bomber']);  // не лечатся — их чинят строители
/** Снаряжение отряда (пресет SquadWargear): 0 — граната, 1 — заряд против техники и зданий, 2 — дым. */
export const GEAR = [
  { name: 'Граната', range: 18, r: 4, dmg: 80, charges: 3, cd: 25, cost: 40, energy: 0 },
  { name: 'Подрывной заряд', range: 8, r: 3, dmg: 240, charges: 1, cd: 40, cost: 60, energy: 30 },
  { name: 'Дым', range: 16, r: 6, dmg: 0, charges: 2, cd: 30, cost: 30, energy: 0 },
];
export const SMOKE_TIME = 12;
/** Поражение — когда пали штабы и все здания, где появляются войска (казармы, техцех, верфь, Врата Варпа, Врата призыва). */
/** Где кто производится у фракции, если не там, где у всех (тираниды — как в моде: рипперы из Пула переработки, воины и ликторы из Выводкового шпиля…). */
export const FROM_FAC: Partial<Record<FactionId, Partial<Record<Kind, Kind>>>> = {
  tyranids: { sniper: 'key1', heavy: 'key1', lveh: 'key1', arty: 'key1', elite: 'hq' }, // как в UA: воины, ликторы, равенеры и биоворы — из Выводкового улья, генокрады — из Шпиля
  inquisition: { support: 'motorpool', sniper: 'hq', mveh: 'barracks', jet: 'key2' }, // как в UA: штурмовики — из Дозора, астропаты — из Башни, дредноуты — из Телепортера Серых Рыцарей, Штормовой ворон — из Астра Телепатика
};
for (const [k, b] of Object.entries(UA_BASE) as [Kind, Kind][]) ROLES[k] = { ...ROLES[b]!, from: UA_FROM[k]!, fac: k.split(':')[1] as FactionId, noFac: undefined };
[MIN_RANGE, SIEGE_RANGE, CLOSE, SETUP, SYNAPSE_KINDS, SQUADS, VEHICLES, AIRCRAFT].forEach(t => inherit(t));
export const fromOf = (k: Kind, f?: FactionId) => (f && FROM_FAC[f]?.[k]) ?? ROLES[k]!.from;
export const PRODUCERS = new Set<Kind>(['hq', 'gate', ...(Object.values(ROLES).map(r => r!.from)), ...Object.values(FROM_FAC).flatMap(m => Object.values(m!) as Kind[])]);
export const producible = (b: Kind, f?: FactionId) => (Object.keys(ROLES) as Kind[]).filter(k => fromOf(k, f) === b && (!f || (!ROLES[k]!.fac || ROLES[k]!.fac === f) && !ROLES[k]!.noFac?.includes(f)));
export const TURRET_CAP = 12;
/** Постройки держат удар: пехота и капитаны наносят им 40% урона (как в DoW — здания ломают техникой и тяжёлым оружием). */
export const STRUCT_ARMOR = 0.4;
/** Сетка построек: клетки BCELL×BCELL м. Здание занимает квадрат foot×foot клеток (сторона ≈ диаметр), стена и мина — одну клетку. */
export const BCELL = 2;
export const foot = (k: Kind) => Math.max(1, Math.floor(STATS[k].radius));
/** След постройки k с центром (x, y): клетки [x0, x0+n) × [y0, y0+n). */
export const footRect = (k: Kind, x: number, y: number) => { const n = foot(k); return { x0: Math.round(x / BCELL - n / 2), y0: Math.round(y / BCELL - n / 2), n }; };
/** Центр постройки, привязанный к сетке. */
export const snapB = (k: Kind, x: number, y: number) => { const f = footRect(k, x, y); return { x: (f.x0 + f.n / 2) * BCELL, y: (f.y0 + f.n / 2) * BCELL }; };
/** Свободна ли земля под след (центр уже на сетке): не скалы и не чужие следы; вплотную по клеткам можно. */
export function footFree(structs: Iterable<{ kind: Kind; x: number; y: number }>, k: Kind, x: number, y: number) {
  const a = footRect(k, x, y);
  if (blocked(x, y, (a.n * BCELL) / 2)) return false;
  for (const u of structs) {
    const b = footRect(u.kind, u.x, u.y);
    if (a.x0 < b.x0 + b.n && b.x0 < a.x0 + a.n && a.y0 < b.y0 + b.n && b.y0 < a.y0 + a.n) return false;
  }
  return true;
}
/** Клетки протяжки стены от (x1, y1) до (x2, y2): по клетке, только по сторонам (без диагональных дыр), не больше 16. */
export function wallCells(x1: number, y1: number, x2: number, y2: number) {
  const a = footRect('wall', x1, y1), b = footRect('wall', x2, y2), dx = Math.abs(b.x0 - a.x0), dy = Math.abs(b.y0 - a.y0);
  let cx = a.x0, cy = a.y0;
  const out = [{ x: (cx + 0.5) * BCELL, y: (cy + 0.5) * BCELL }];
  for (let ix = 0, iy = 0; (ix < dx || iy < dy) && out.length < 16;) {
    if ((0.5 + ix) / dx < (0.5 + iy) / dy) { cx += Math.sign(b.x0 - a.x0); ix++; } else { cy += Math.sign(b.y0 - a.y0); iy++; }
    out.push({ x: (cx + 0.5) * BCELL, y: (cy + 0.5) * BCELL });
  }
  return out;
}
/** Прокачка реликвария (пресет PointUpgrades): индекс = текущий уровень. Критическую точку в центре не укрепить. */
export const POST_UP: Record<number, { cost: number; energy: number; tier: number; name: string }> = {
  1: { cost: 120, energy: 0, tier: 2, name: 'Укреплённый столп' },
  2: { cost: 100, energy: 80, tier: 2, name: 'Столп-бастион' },
};

// ---------- тиры I–V, исследования, легенды (пресеты TechTiers, KeyBuildings, SummonGate) ----------
/** Переход штаба с тира t на t+1: цена и требуемое ключевое здание текущего тира. */
export const TIER_UP: Record<number, { cost: number; energy: number; relics: number; key: Kind; seal?: boolean }> = {
  1: { cost: 300, energy: 150, relics: 0, key: 'key1' },
  2: { cost: 500, energy: 400, relics: 0, key: 'key2' },
  3: { cost: 600, energy: 600, relics: 0, key: 'key3' },
  4: { cost: 0, energy: 1000, relics: 1, key: 'key4', seal: true },
};
export const TIER_TIME = 30;
/** 16 исследований: по 4 в каждом ключевом здании (индекс = (тир здания − 1) * 4 + номер). */
export const RESEARCH = [
  'Литании стойкости', 'Ускоренная присяга', 'Знамёна рот', 'Свитки каменщиков',
  'Закалённая латунь', 'Орган-пушки', 'Глубинное бурение', 'Шаги шпиля',
  'Дальний свет', 'Небесное наведение', 'Знамение', 'Звёздная карта',
  'Литургия Колосса', 'Освящённые реликвии', 'Ковчег мощей', 'Печать Вознесения',
];
export const RESEARCH_INFO = [
  'пехота получает −10% урона', 'найм пехоты −15% времени', 'урон пехоты +10%', 'стройка +20%',
  'постройки получают −20% урона', 'урон турелей +25%', 'насосы +25% энергии', 'скорость +10%',
  'дальность постов и турелей +3', 'урон пехоты +10%', 'урон капитана +20%', 'обзор +4',
  'лимит Легиона +2', 'капитан и легенды получают −20% урона', '+1 реликвия даже без ключевой точки', 'открывает тир V',
];
export const researchCost = (i: number) => ({ cost: 100 * (Math.floor(i / 4) + 1), energy: 50 * (Math.floor(i / 4) + 1), time: 20 });
export const LEGEND_COST = [{ relics: 1, energy: 400 }, { relics: 1, energy: 300 }, { relics: 1, energy: 500 }];
export const SUMMON_TIME = 20;

/** Тип атаки = форма следа (пресет AttackVFX): 0 пуля, 1 рубящий, 2 когти, 3 луч, 4 огонь, 5 укол. */
/** 6 сварка, 7 бросок, 8 взрыв гранаты, 9 дым, 10 снайпер, 11 тяжёлое орудие, 12 снаряд осады, 13 титан, 14 очередь. */
export const FX = { shot: 0, chop: 1, claws: 2, beam: 3, fire: 4, thrust: 5 } as const;
const GUARD_FX: Record<FactionId, number> = { inquisition: FX.shot, tyranids: FX.chop }; // Вечные — изумрудные распылители, Отступники — адострелы
/** Рукопашные: капитаны, легенды-бойцы, пехота Орды, Нежити и Синклита. */
export const isMelee = (k: Kind, f: FactionId) => k === 'captain' || (k === 'guard' && f === 'tyranids'); // Хормагаунты рубят
export function attackFx(k: Kind, f: FactionId, variant = 0) {
  if (MOD_RACES[f as keyof typeof MOD_RACES] && !isStruct(k)) { // расы UA: удар или выстрел — по главному стволу из мода, а не по роли игры
    const st = statOf(k, f), r = st.range;
    if (st.dmg <= 0) return FX.shot;
    return r <= 3 ? (f === 'tyranids' ? FX.claws : FX.chop) : ({ arty: 12, hveh: 12, titan: 13, mveh: 14, lveh: 14 } as Partial<Record<Kind, number>>)[k] ?? FX.shot;
  }
  if (k === 'guard') return GUARD_FX[f];
  if (k === 'captain') return FX.chop; // мистика переопределяет act
  if (k === 'legend') return variant === 2 ? FX.fire : variant === 1 ? FX.chop : FX.beam;
  if (k === 'elite') return FX.claws; // Склеповая стража — булавы
  return ({ obelisk: 3, megagun: 12, arty: 12, battery: 12, pylon: 3, rturret: 12, fturret: FX.fire, deity: FX.chop, sniper: 10, heavy: 11, hveh: 12, titan: 13, mveh: 14, lveh: 14 } as Partial<Record<Kind, number>>)[k] ?? FX.shot;
}
/** Рукопашная пехота: дальность в упор, бьёт сильнее и реже, бегает быстрее. */
export const MELEE_GUARD = { range: 1.4, dmg: 6, cd: 1.3, speed: 8.6 };

// ---------- капитан: опыт, уровни 1–10 и дерево способностей (CaptainLevelUp, CaptainAbilities) ----------
export const XP_KILL: Partial<Record<Kind, number>> = { arty: 60, deity: 300, builder: 5, guard: 20, sniper: 20, heavy: 25, support: 15, elite: 45, healer: 45, lveh: 40, mveh: 60, hveh: 90, captain: 40, legend: 200, titan: 300, jet: 60, bomber: 300 };
export const XP_STRUCT = 25, XP_CAPTURE = 25, MAX_LVL = 10;
export const xpNeed = (lvl: number) => 100 * lvl;
/** 3 ветки × 3 тира. Индекс = ветка * 3 + тир. cd = 0 — пассивная. */
export const ABILITIES = [
  { name: 'Литания стойкости', info: 'аура: союзники в 12 м получают −15% урона', cd: 0 },
  { name: 'Свет лампы', info: 'лечит союзников в 10 м на 25%', cd: 30 },
  { name: 'Мученичество', info: 'при гибели капитана союзники в 12 м полностью исцеляются', cd: 0 },
  { name: 'Рывок', info: 'капитан ×2 скорость и ×1.5 урон на 5 с', cd: 20 },
  { name: 'Вихрь', info: '150 урона всем врагам в 6 м', cd: 25 },
  { name: 'Падение шпиля', info: 'абсолютная: 500 урона по 12 м вокруг капитана', cd: 180 },
  { name: 'Знамя роты', info: 'аура: пехота в 12 м +15% урона', cd: 0 },
  { name: 'Перекличка', info: 'отряды в 15 м восстанавливают 15% здоровья', cd: 40 },
  { name: 'Последний рубеж', info: 'союзники в 12 м не умирают 6 с', cd: 90 },
];
/** Тир узла дерева открывается уровнем капитана И тех-тиром. */
const ABIL_GATE = [{ lvl: 1, tier: 1 }, { lvl: 4, tier: 2 }, { lvl: 7, tier: 3 }];
export function canLearn(h: Pick<Hero, 'abil' | 'pts' | 'lvl'>, tier: number, a: number) {
  const t = a % 3, g = ABIL_GATE[t];
  if (h.abil & (1 << a)) return 'Уже изучено';
  if (h.pts <= 0) return 'Нет очков';
  if (h.lvl < g.lvl || tier < g.tier) return `Нужен уровень ${g.lvl} и тир ${g.tier}`;
  if (t > 0 && !(h.abil & (1 << (a - 1)))) return 'Сначала предыдущая способность ветки';
}
/** Рядом со своим капитаном нужной сборки (аура Командора — 12 м). */
/** Архетип героя: у призванного — свой, у первого капитана — выбранный в лобби. */
export const archOf = (s: State, u: Unit): Arch => u.arch ?? s.players[u.owner].arch;
const nearArch = (s: State, u: Unit, a: Arch) => s.units.some(c => c.owner === u.owner && c.kind === 'captain' && c.hp > 0 && archOf(s, c) === a && dist(c, u) < 12);
/** Второй герой (другой архетип фракции) — с тира III из ячейки героя. */
export const HERO = { cost: 400, energy: 250, relics: 1, tier: 2 };
/** Главный капитан: заказ и повторный заказ после гибели — в штабе. */
export const CAPTAIN_COST = { cost: 150, energy: 50 };
/** Где заказывают героя: главного — в штабе, остальных — в казармах (как командир и библиарий/капеллан в Soulstorm). */
/** Здание найма героя расы — как в моде: то, в spawns которого его отряд (Тиран улья — улей, Лорд-инквизитор — «Дозор»). */
export const HERO_AT: Partial<Record<FactionId, Kind>> = {};
for (const [f, race] of Object.entries(MOD_RACES) as [FactionId, (typeof MOD_RACES)[keyof typeof MOD_RACES]][]) {
  const id = (race.unit as Partial<Record<Kind, string>>).captain, B = race.data.buildings as Record<string, { spawns?: string[] }>;
  const b = id && Object.keys(B).find(x => B[x].spawns?.some(q => q.endsWith('_squad_' + id)));
  const k = b && (Object.entries(race.build) as [Kind, string][]).find(([, v]) => v === b)?.[0];
  if (k) HERO_AT[f] = k;
}
export const heroFrom = (p: Player, a: Arch): Kind => (a === p.arch ? HERO_AT[p.faction] ?? 'hq' : 'barracks');
/** Герой этого архетипа уже на поле или в чьей-то очереди. */
export const heroBusy = (s: State, owner: number, a: Arch) => s.units.some(u => u.owner === owner && ((u.kind === 'captain' || u.kind === 'deity') && u.hp > 0 && archOf(s, u) === a || u.paid.some((x, i) => u.que[i] === 'captain' && ARCHS[x[4]] === a)));
/** Живые герои игрока (капитаны всех архетипов и Бог-Механизм). */
export const heroesOf = (s: State, owner: number) => s.units.filter(u => u.owner === owner && u.hero && u.hp > 0);
/** Герой по id из команды; без id — первый подходящий (для бота и старых клиентов). */
const heroBy = (s: State, owner: number, id: number | undefined, ok: (u: Unit) => boolean = () => true) => heroesOf(s, owner).find(u => (id === undefined || u.id === id) && ok(u));
/** Опыт за бой и захват получают герои рядом с событием (как ветеранство героев в Soulstorm UA). */
export const HERO_XP_R = 30;
/** Летают: Бог-Механизм и Архангел Ордена — здания их не останавливают. */
/** Летают над скалами и стенами: Бог-Механизм, Архангел Ордена, авиация всех фракций, почти вся техника Тёмных эльдар. */
export const flies = (k: Kind, f: FactionId) => k === 'deity' || k === 'air' || AIRCRAFT.has(k);
function gainXp(s: State, owner: number, xp: number, at: { x: number; y: number }) {
  if (xp <= 0) return;
  for (const c of heroesOf(s, owner)) {
    const h = c.hero!;
    if (h.lvl >= MAX_LVL || dist(c, at) > HERO_XP_R) continue;
    h.xp += xp;
    while (h.lvl < MAX_LVL && h.xp >= xpNeed(h.lvl)) { h.xp -= xpNeed(h.lvl); h.lvl++; h.pts++; }
  }
}
/** Рядом герой своего игрока, изучивший способность a (ауры дерева). */
const nearCapWith = (s: State, u: Unit, a: number, r: number) => s.units.some(c => c.owner === u.owner && c.hero && c.hp > 0 && c.hero.abil & (1 << a) && dist(c, u) < r);
/** Три ресурса пресета: Влияние (req, с точек), Энергия (с Литейни и насосов), Реликвии (с реликтовых точек). */
export const ENERGY_COST: Partial<Record<Kind, number>> = { motorpool: 300, yard: 800, turret: 30, aegis: 100, rturret: 20, battery: 150, pylon: 120, pyre: 60, bell: 60, lighthouse: 800, obelisk: 1200, megagun: 800, plague: 800, warpgate: 150, portal: 120, spire: 800 };
export const ENERGY_INCOME: Partial<Record<Kind, number>> = { hq: 1, foundry: 2, pump: 4 };
/** Реликвия как в Soulstorm — не копится и добывается только ключевой (центральной) точкой: p.relics = 1, пока её держишь (+1 за Ковчег мощей). «relics» в цене — условие, не списывается. Реликварии дают влияние, как обычные точки. */
export const relicsHeld = (s: State, owner: number) => (s.points[0]?.owner === owner ? 1 : 0) + (has(s.players[owner], 14) && s.units.some(u => u.owner === owner && u.kind === 'key4' && u.hp > 0 && u.build >= 1) ? 1 : 0);
export const TRIBUTE_ENERGY = 150, LEGEND_BOUNTY = 200;
/**
 * Апгрейды (команда 'upgrade'). lvl 1 -> 2. Штаб: тир 2 открывает остальные апгрейды.
 * Пост 2 уровня: урон x2.3, дальность +3, получает вдвое меньше урона. Отряд 2 уровня: урон x1.6, получает на 20% меньше.
 */
export type Upgrade = { cost: number; energy: number; relics: number; time: number; tier: number; name: string };
export const UPGRADES: Partial<Record<Kind, Upgrade>> = {
  turret: { cost: 90, energy: 40, relics: 0, time: 10, tier: 2, name: 'Тяжёлая турель' },
  wall: { cost: 20, energy: 0, relics: 0, time: 6, tier: 2, name: 'Укрепить стены' },      // цена за сегмент; улучшаются все свои стены и ворота
  wallgate: { cost: 60, energy: 0, relics: 0, time: 8, tier: 2, name: 'Укрепить стены' },
  guard: { cost: 80, energy: 50, relics: 0, time: 8, tier: 2, name: 'Тяжёлое оружие' },
  captain: { cost: 120, energy: 60, relics: 1, time: 5, tier: 1, name: 'Реликвийный доспех' },
  lveh: { cost: 60, energy: 40, relics: 0, time: 8, tier: 3, name: 'Гранатомёт' }, // только Багги Орды: выстрел по площади 3 м
};
export const LVL2 = { dmg: { post: 1, turret: 1.8, guard: 1.6, captain: 1.5 } as Partial<Record<Kind, number>>, armor: { post: 1, turret: 0.6, guard: 0.8, captain: 0.7, wall: 0.5, wallgate: 0.5 } as Partial<Record<Kind, number>>, range: { post: 0, turret: 3 } as Partial<Record<Kind, number>> };
export const BUILD_TIER: Record<Buildable, number> = { hq: 2, barracks: 1, post: 1, turret: 1, foundry: 1, pump: 1, key1: 1, key2: 2, key3: 3, key4: 4, gate: 5, motorpool: 3, yard: 4, wall: 1, wallgate: 1, bunker: 2, mine: 1, aegis: 2, rturret: 1, fturret: 1, battery: 2, pylon: 2, pyre: 2, bell: 2, lighthouse: 4, obelisk: 4, megagun: 4, plague: 4, warpgate: 3, portal: 2, spire: 4 };
for (const [f, race] of Object.entries(MOD_RACES)) NO_BUILD[f as FactionId] = (Object.keys(BUILD_TIER) as Buildable[]).filter(k => !(k in race.build));
/** Постройки только своей фракции. */
/** null — постройка снятых фракций (Консенсус, Нежить): вид остаётся в KINDS ради стабильных индексов, строить нельзя. */
export const FACTION_ONLY: Partial<Record<Buildable, FactionId | null>> = { aegis: null, rturret: null, fturret: null, battery: null, bell: null, pylon: null, pyre: null, lighthouse: null, obelisk: null, megagun: null, plague: null, warpgate: null, portal: null }; // null — постройки удалённых рас: никому
export const maxHp = (k: Kind, f?: FactionId) => statOf(k, f).hp * statOf(k, f).n;
/** Статы и полное здоровье конкретного юнита — по его фракции. */
export const ST = (u: Unit) => u.st ?? statOf(u.kind, u.f);
export const hpOf = (u: Unit) => (u.mh ?? ST(u).hp) * (u.mn ?? ST(u).n);
/** Живых бойцов в отряде по его HP (с исследованиями). */
export const membersOf = (u: Unit) => (u.hp <= 0 ? 0 : Math.min(u.mn ?? ST(u).n, Math.ceil(u.hp / (u.mh ?? ST(u).hp) - 1e-6)));
/** До скольких бойцов можно пополнить отряд: максимум отряда мода (у остальных — штатный) плюс исследования. */
export const squadCap = (s: State, u: Unit) => (UA_SQ[u.f!]?.[u.kind]?.max ?? ST(u).n) + Math.round(modsOf(s, u).n);
/** Отряд, который пополняется: пехота игры или отряд мода с запасом бойцов; есть потери или место для новых. */
export const canReinforce = (s: State, u: Unit) => u.hp > 0 && (SQUADS.has(u.kind) || !!UA_SQ[u.f!]?.[u.kind]) && (u.hp < hpOf(u) - 1e-6 || (u.mn ?? ST(u).n) < squadCap(s, u));
/** Залп отряда UA с купленными стволами: множитель урона к стартовому и пробитие (стволов не больше, чем живых бойцов в точке). */
export function armOf(u: Unit): { dmg: number; vs: Record<Armor, number> } | undefined {
  const A = UA_ARM[u.f!]?.[u.kind];
  if (!A || !u.wu?.some(Boolean)) return;
  const n = Math.max(1, membersOf(u)), used = new Map<number, number>();
  let d = A.d0 * n; const v = { ...A.v0 }; for (const a of ARMORS) v[a] *= n;
  A.opts.forEach((o, i) => { const c = Math.min(u.wu![i] ?? 0, n - (used.get(o.h) ?? 0)); if (c <= 0) return; used.set(o.h, (used.get(o.h) ?? 0) + c); d += c * o.d; for (const a of ARMORS) v[a] += c * o.dv[a]; });
  return { dmg: Math.max(0.1, d / (A.d0 * n)), vs: Object.fromEntries(ARMORS.map(a => [a, Math.max(0, v[a] / Math.max(1e-6, d))])) as Record<Armor, number> };
}
/** Статы бойца с купленными стволами (или undefined — как у вида): рукопашный по умолчанию отряд UA купил стрелковый ствол — бьёт с его дальности (как в DoW: боец со стволом стреляет, сходится врукопашную сам). */
export function armedStat(f: FactionId | undefined, k: Kind, wu: readonly number[] | undefined): Stat | undefined {
  const A = f && UA_ARM[f]?.[k], base = statOf(k, f), r = Math.max(0, ...(A ? A.opts : []).map((o, i) => ((wu?.[i] ?? 0) > 0 ? o.range : 0)));
  return r > base.range ? { ...base, range: r } : undefined;
}
const armRange = (u: Unit) => { u.st = armedStat(u.f, u.kind, u.wu); };
/** Требования ствола мода: исследования UA изучены, здания построены; аддоны штаба — тир (hq_addon_N → N+1, прочие → 2). Неизвестные (схемы без модификаторов) пока не держат. */
export function armReq(s: State, owner: number, req: string[]) {
  const p = s.players[owner], f = p.faction, race = MOD_RACES[f as keyof typeof MOD_RACES], R = UA_RESEARCH[f] ?? [];
  for (const r of req) {
    const ri = R.findIndex(x => x.id === r);
    if (ri >= 0) { if (!p.ur?.includes(ri)) return 'Нужно исследование: ' + R[ri].name; continue; }
    const k = race && (Object.entries(race.build) as [Kind, string][]).find(([, id]) => r.endsWith('_' + id) || r === id)?.[0];
    if (k) { if (!s.units.some(v => v.owner === owner && v.kind === k && v.build >= 1 && v.hp > 0)) return 'Нужно здание: ' + k; continue; }
    if (/addon/.test(r)) { const t = Number(r.match(/addon_(\d)/)?.[1] ?? 1) + 1; if (p.tier < t) return `Нужен тир ${t}`; }
  }
}
/** Отряд из нескольких бойцов: урон растёт с числом живых. */
const multi = (u: Unit) => SQUADS.has(u.kind) || (u.mn ?? ST(u).n) > 1;
/** Сколько моделей показывать: хп пула / хп одной модели, округлено вверх. */
export const members = (k: Kind, hp: number, f?: FactionId) => (hp <= 0 ? 0 : Math.min(statOf(k, f).n, Math.ceil(hp / statOf(k, f).hp - 1e-6)));

export const REINFORCE_COST = 18; // за порцию в одну модель
export const REINFORCE_TIME = 1.2;
export const REPAIR = { rate: 25, combatDelay: 5, combatMul: 0.35 };
export const CAP = { builder: 4, guard: 8 };
export const QUEUE_MAX = 5;
export const START_REQ = 300, START_ENERGY = 100, BASE_INCOME = 2; // влияние в секунду от штаба без точек
export const POINT_R = 6;
export const MAX_PLAYERS = 4; // у карты может быть меньше: MAPS[i].hq.length

export type Order =
  | { t: 'move'; x: number; y: number }
  | { t: 'amove'; x: number; y: number }
  | { t: 'attack'; id: number }
  | { t: 'build'; id: number }
  | { t: 'throw'; g: number; x: number; y: number }
  | { t: 'fire'; x: number; y: number }; // огонь по земле: бьёт в точку без разведки, пока не отменят
export type Unit = {
  f?: FactionId; // фракция владельца — для статов (у рас из модов свои)
  mh?: number; mn?: number; // HP бойца и размер отряда с исследованиями UA
  ad?: number; // UA: купленные аддоны здания (биты — индексы UA_ADDONS расы)
  wu?: number[]; wq?: number; wt?: number; // UA: стволов куплено по вариантам UA_ARM, какой ставится сейчас и сколько секунд
  st?: Stat; // UA: свои статы бойца — рукопашный отряд купил стрелковый ствол (воины с пожирателем бьют издали)
  sz?: number; // бойцов докуплено пополнением сверх стартового (отряды UA растут до максимума мода)
  id: number; owner: number; kind: Kind; x: number; y: number; hp: number; face: number;
  cd: number; order: Order | null;
  queue?: Order[];              // очередь приказов (Shift): следующий берётся, когда текущий выполнен
  q: number; prog: number;      // счётчик: исследование/призыв; у найма — длина que
  que: Kind[];                  // очередь найма (штаб, казармы, кузня)
  paid: number[][];             // что списано за каждое место очереди: [влияние, энергия, реликвии, останки] — возврат при отмене
  arch?: Arch;                  // архетип призванного героя (у первого капитана — из лобби)
  gear: number; ch: number[]; gcd: number; // снаряжение отряда: биты купленного, заряды, перезарядка броска
  sh: number; off: number;      // щит: личный (дрон) или пул купола-эгиды; off — купол пробит, секунд до включения
  frozen: number;               // Остановка времени: секунд неподвижности
  carry: number;                // Орда: id турели, которую тащит отряд (0 — нет); у турели — id несущего
  rise: number;                 // Вознесение: секунд до появления Бога-Механизма
  build: number;                // 0..1, готовность постройки (у юнитов всегда 1)
  dead: number;                 // таймер возрождения капитана
  by: number;                   // кто ударил последним (опыт за убийство)
  mor?: number; brk?: number; // мораль отряда UA и сколько он уже надломлен (с; undefined — не надломлен)
  rush: number; stand: number;  // Рывок и Последний рубеж: оставшиеся секунды
  reinf: boolean; rt: number;   // идёт пополнение отряда
  hit: number;                  // секунд с последнего урона (пополнять под огнём нельзя)
  ah: number;                   // id того, кто стрелял последним: свободный юнит отвечает ему огнём
  lvl: number; upg: number;     // уровень и прогресс апгрейда в секундах (-1: нет)
  sm: number;                   // множитель скорости фракции на этот тик
  hero?: Hero;                  // герой (капитан): свой опыт, уровень, очки, изученные способности и их перезарядка — как ветераны-герои в Soulstorm UA
  path?: { to: { x: number; y: number }; at: number; pts: { x: number; y: number }[] }; // маршрут в обход препятствий (не уходит в снимок)
};
/** Прогресс героя живёт в самом герое: у каждого свой уровень и своё дерево способностей. */
export type Hero = { xp: number; lvl: number; pts: number; abil: number; acd: number[] };
export type Point = { x: number; y: number; owner: number; prog: number; by: number; relic?: boolean };
export type Player = {
  req: number; energy: number; relics: number; alive: boolean; tier: number;
  faction: FactionId; arch: Arch; rage: number; waagh: number; remains: number; // ярость и ВААГХ Орды; remains всегда 0 (место в снимке)
  research: number;                  // битовая маска изученного (RESEARCH)
  ur?: number[]; um?: UAMods; // изученное из UA_RESEARCH и кэш его эффектов
  ad?: number; // UA: аддоны у живых зданий игрока (объединение u.ad) — для требований и модификаторов
  gad?: number; // UA: аддоны турелей — общее улучшение: куплен раз — стоит на всех турелях игрока, и на новых тоже
  unlock: number;                    // открытия: 1 — мегапостройки, 2 — сверхоружие
  doom: number;                      // заряд сверхоружия, секунд
  stopCd: number; revive: number; // перезарядка Остановки времени; revive не используется (место в состоянии)
  scanCd: number;                    // перезарядка засвета (SCAN)
  kills: number;                     // убито вражеских юнитов (Сила из боли, Жертва богам)
  cheat?: boolean;                   // разработка: +5 реликвариев
};
export type State = {
  tick: number; units: Unit[]; points: Point[]; players: Player[]; nextId: number;
  winner: number | null; shots: number[][];
  dev?: boolean; // разработка: разрешён чит
  died: number[]; // кто погиб с прошлого снимка (чтобы отличать смерть от ухода в туман)
  rewind: { owner: number; x: number; y: number; t: number }[]; // Перезавод Династий: отряды, которые встанут
  blasts: { x: number; y: number; t: number; g: number; owner: number }[]; // летящие гранаты
  strikes: { x: number; y: number; t: number; owner: number }[];
  scans: { x: number; y: number; t: number; owner: number; r?: number }[]; // засвет: дальний удар мегапостройки (r по умолчанию MEGA_SHOT.reveal) и засвет из штаба
  plagues: { x: number; y: number; t: number; owner: number; fire?: boolean }[]; // чумные облака Колокола Конца и пожары зажигательных снарядов
  smoke: { x: number; y: number; t: number }[];
};
export type Cmd =
  | { c: 'move' | 'amove'; ids: number[]; x: number; y: number; q?: boolean }
  | { c: 'attack'; ids: number[]; id: number; q?: boolean }
  | { c: 'stop'; ids: number[] }
  | { c: 'train'; id: number; k?: Kind }
  | { c: 'cancel'; id: number; i: number }
  | { c: 'hero'; a: Arch; id?: number } // герой: главный — в штабе, остальные архетипы — в казармах; id — здание
  | { c: 'build'; ids: number[]; kind: Buildable; x: number; y: number; q?: boolean }
  | { c: 'assist'; ids: number[]; id: number; q?: boolean }
  | { c: 'reinforce'; ids: number[] }
  | { c: 'uaw'; id: number; w: number }
  | { c: 'upgrade'; id: number }
  | { c: 'research'; id: number; r: number }
  | { c: 'uar'; id: number; r: number } // исследование UA (индекс в UA_RESEARCH расы)
  | { c: 'uaa'; id: number; a: number } // аддон UA к зданию (индекс в UA_ADDONS расы)
  | { c: 'summon'; id: number; v: number }
  | { c: 'wall'; ids: number[]; x1: number; y1: number; x2: number; y2: number; q?: boolean }
  | { c: 'gear'; ids: number[]; g: number }
  | { c: 'throw'; ids: number[]; g: number; x: number; y: number; q?: boolean }
  | { c: 'fire'; ids: number[]; x: number; y: number; q?: boolean }
  | { c: 'cheat' }
  | { c: 'timestop' }
  | { c: 'strike'; x: number; y: number }
  | { c: 'scan'; x: number; y: number }
  | { c: 'unlock'; id: number; u: number }
  | { c: 'learn'; a: number; id?: number } // id — герой
  | { c: 'ability'; a: number; id?: number };

/** Приказ юниту: с Shift (q) — в конец очереди, иначе заменяет текущий и очищает очередь (как в Soulstorm). */
const give = (u: Unit, o: Order, q?: boolean) => { if (q && (u.order || u.queue?.length)) (u.queue ??= []).push(o); else { u.order = o; u.queue = undefined; } };
export const QUEUE_ORDERS = 8;
/** Кто умеет бить по земле: дальность от 17 м. */
export const canFireGround = (k: Kind) => STATS[k].range >= 17 && STATS[k].dmg > 0 && !isStruct(k);
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const dist = (a: { x: number; y: number }, b: { x: number; y: number }) => Math.hypot(a.x - b.x, a.y - b.y);

export function newState(n: number, factions: FactionId[] = [], archs: Arch[] = []): State {
  const s: State = { tick: 0, units: [], points: [...POINTS.map(([x, y]) => ({ x, y, owner: -1, prog: 0, by: -1 })), ...RELICS.map(([x, y]) => ({ x, y, owner: -1, prog: 0, by: -1, relic: true }))], players: [], nextId: 1, winner: null, shots: [], rewind: [], blasts: [], smoke: [], died: [], strikes: [], scans: [], plagues: [] };
  for (let i = 0; i < n; i++) {
    s.players.push({ req: START_REQ, energy: START_ENERGY, relics: 0, alive: true, tier: 1, faction: factions[i] ?? 'inquisition', arch: archFor(factions[i] ?? 'inquisition', archs[i] ?? 'commander'), rage: 0, waagh: 0, remains: 0, research: 0, unlock: 0, stopCd: 0, revive: 0, doom: 0, kills: 0, scanCd: 0 });
    const [hx, hy] = HQ_POS[i];
    spawn(s, i, 'hq', hx, hy);
    spawn(s, i, 'builder', ...nearHq(hx, hy, 9)); // как в Dawn of War: начинаем со штабом, капитаном и строителями
  }
  return s;
}

const nearHq = (hx: number, hy: number, d: number): [number, number] => {
  const a = Math.atan2(MAP.h / 2 - hy, MAP.w / 2 - hx);
  return [hx + Math.cos(a) * d + (Math.random() - 0.5) * 3, hy + Math.sin(a) * d + (Math.random() - 0.5) * 3];
};

export function spawn(s: State, owner: number, kind: Kind, x: number, y: number): Unit {
  const f = s.players[owner]?.faction;
  const u: Unit = { id: s.nextId++, owner, f, kind, x, y, hp: maxHp(kind, f), face: Math.atan2(MAP.h / 2 - y, MAP.w / 2 - x), cd: 0, order: null, q: 0, prog: 0, que: [], paid: [], gear: 0, ch: [0, 0, 0], gcd: 0, sh: kind === 'aegis' ? AEGIS.pool : 0, off: 0, frozen: 0, carry: 0, rise: 0, build: 1, dead: 0, reinf: false, rt: 0, hit: 9, ah: 0, lvl: 1, upg: -1, sm: 1, by: -1, rush: 0, stand: 0 };
  s.units.push(u);
  refreshUnit(s, u); u.hp = hpOf(u); // новый юнит — сразу с изученными HP и размером отряда
  return u;
}

const count = (s: State, owner: number, k: Kind) => s.units.filter(u => u.owner === owner && u.kind === k && u.hp > 0).length;
const hqOf = (s: State, owner: number) => s.units.find(u => u.kind === 'hq' && u.owner === owner);
const producing = (k: Kind, f?: FactionId): Kind | null => producible(k, f)[0] ?? null;
export const queued = (s: State, owner: number, what: Kind) => s.units.reduce((n, u) => n + (u.owner === owner ? u.que.filter(k => k === what).length : 0), 0);
/** Занятый Легион: живые и заказанные боевые юниты; veh — техника (свой лимит), иначе пехота. */
export const legion = (s: State, owner: number, veh = false) => { const f = s.players[owner]?.faction, pop = (k: Kind) => (VEHICLES.has(k) || k === 'arty') === veh && !ROLES[k]?.one ? popOf(k, f) : 0; /* титан — свой слот, лимит техники не занимает */ return s.units.reduce((n, u) => n + (u.owner === owner && u.hp > 0 ? pop(u.kind) : 0) + (u.owner === owner ? u.que.reduce((m, k) => m + pop(k), 0) : 0), 0); };
export const legionCap = (p: Player, veh = false) => (veh ? MOTOR_CAP : LEGION_CAP) + (has(p, 12) ? 6 : 0) + (veh ? uaMods(p).support : uaMods(p).squad);

/** Весь урон проходит здесь: сначала личный щит (дрон), потом купол-эгида рядом, потом здоровье. */
export function hurt(s: State, t: Unit, dmg: number, by: number) {
  if (dmg <= 0 || t.hp <= 0) return;
  if (t.sh > 0 && t.kind !== 'aegis') { const a = Math.min(t.sh, dmg); t.sh -= a; dmg -= a; }
  if (dmg > 0) for (const a of s.units) {
    if (a.kind !== 'aegis' || a.owner !== t.owner || a.hp <= 0 || a.build < 1 || a.off > 0 || a.sh <= 0 || dist(a, t) > AEGIS.r) continue;
    const take = Math.min(a.sh, dmg); a.sh -= take; dmg -= take;
    if (a.sh <= 0) a.off = AEGIS.broken; // пробит: 10 с не работает
    if (s.shots.length < 200) s.shots.push([a.x, a.y, t.x, t.y, 15]); // вспышка гексагона в точке удара
    break;
  }
  t.hp -= dmg; t.hit = 0;
  if (by !== t.owner && by >= 0) t.by = by;
}
export const has = (p: Player, r: number) => (p.research & (1 << r)) !== 0;
const hasR = (s: State, owner: number, r: number) => has(s.players[owner], r);

// ---------- особые механики фракций (пресеты Faction*) ----------
export const RAGE_MAX = 100;
export const WAAGH_TIME = 20;
const fac = (s: State, owner: number) => s.players[owner].faction;
const nearOwn = (s: State, owner: number, x: number, y: number, r: number, kinds?: Kind[]) =>
  s.units.some(u => u.owner === owner && u.hp > 0 && u.build >= 1 && isStruct(u.kind) && (!kinds || kinds.includes(u.kind)) && dist(u, { x, y }) < r + ST(u).radius);
/** Множитель скорости: Орден медленнее, Орда в ВААГХ быстрее. */
const speedMul = (s: State, u: Unit) => (u.carry ? 0.6 : 1) * modsOf(s, u).speed * (u.brk !== undefined ? UA_MOR[u.f!]?.[u.kind]?.speed ?? 1 : 1); // как в UA: скорость из мода и его исследований
/** Урон атакующего — как в UA: только исследования и аддоны мода. */
function dmgMul(s: State, u: Unit) {
  return modsOf(s, u).dmg;
}
/** Получаемый урон — как в UA: броня и пробитие мода (класс брони), исследования мода — в combatArmorMul. Бонусов игры (бункер, стены, пост, исследования игры) нет. */
const armorMul = (_s: State, _t: Unit) => 1;
/** Weapon and ground-fire protection belongs to each victim, including its upgrade. */
const combatArmorMul = (s: State, t: Unit) => armorMul(s, t) * modsOf(s, t).taken; // броня из исследований UA
/** Цена для сервера и интерфейса: Династии платят энергией. */
export function resourceCost(faction: FactionId, req: number, energy = 0, availableEnergy = 0) {
  return { req, energy };
}
function pay(p: Player, req: number, energy = 0, relics = 0): string | undefined {
  ({ req, energy } = resourceCost(p.faction, req, energy, p.energy));
  if (p.req < req) return 'Не хватает влияния';
  if (p.energy < energy) return 'Не хватает энергии';
  if (p.relics < relics) return 'Нужна реликвия: держите ключевую точку в центре';
  p.req -= req; p.energy -= energy; // реликвии не списываются: это удержание точек
}
/** Цена найма с учётом фракции: Орда −20% на пехоту, Нежить поднимает отряд из останков бесплатно. */
export const trainCost = (f: FactionId, what: Kind, p?: UAModsOf) => { const m = kindMods(p, what), st = statOf(what, f); return Math.max(0, Math.round(st.cost * m.cost + (SLOT.has(what) ? 0 : m.costAdd * st.n * UA_K.cost))); }; // прибавка мода — к цене бойца
/** Энергия найма с исследованиями (cost_power мода). */
export const trainEnergy = (f: FactionId, what: Kind, p?: UAModsOf) => { const m = kindMods(p, what); return Math.max(0, Math.round(energyOf(what, f) * m.power + (SLOT.has(what) ? 0 : m.powerAdd * statOf(what, f).n * UA_K.cost))); };

/**
 * Команда игрока. Всё, что пришло от клиента, проверяется здесь: чужие юниты, NaN, огромные массивы.
 * Возвращает текст ошибки, если команду нельзя выполнить (сервер покажет его игроку).
 */
export function applyCmd(s: State, owner: number, cmd: Cmd): string | undefined {
  const p = s.players[owner];
  if (s.winner !== null || !p?.alive || !cmd || typeof cmd !== 'object') return;
  if (cmd.c === 'train') {
    const b = s.units.find(u => u.id === cmd.id && u.owner === owner && u.hp > 0);
    if (!b) return;
    const what = (cmd.k && producible(b.kind, p.faction).includes(cmd.k) ? cmd.k : producing(b.kind, p.faction)) as Kind | null;
    const r = what && ROLES[what];
    if (!what || !r) return;
    if (b.build < 1) return 'Строительство не завершено';
    if ((/^key[1-4]$/.test(b.kind) && b.q > 0 && !b.que.length) || b.q > 100) return 'Здание уже исследует';
    if (b.que.length >= QUEUE_MAX) return 'Очередь заполнена';
    if (UA_REQ[p.faction]?.[what]) { const miss = uaMissing(p.faction, UA_REQ[p.faction]![what], haveOf(s, owner), b.ad); if (miss) return miss; }
    else if (p.tier < r.tier) return `Нужен тир ${r.tier}`;
    if (what === 'builder' && count(s, owner, 'builder') + queued(s, owner, 'builder') >= CAP.builder) return 'Достигнут лимит строителей';
    const veh = VEHICLES.has(what) || what === 'arty';
    // титан-класс — вне лимитов
    const pop = popOf(what, p.faction);
    if (pop && !r.one && legion(s, owner, veh) + pop > legionCap(p, veh)) return veh ? 'Не хватает лимита техники' : 'Не хватает Легиона';
    const c = resourceCost(p.faction, trainCost(p.faction, what, p), trainEnergy(p.faction, what, p), p.energy);
    const e = pay(p, trainCost(p.faction, what, p), trainEnergy(p.faction, what, p), r.relics ?? 0);
    if (e) return e;
    b.que.push(what); b.paid.push([c.req, c.energy, 0, 0]);
    return;
  }
  if (cmd.c === 'hero') { // заказ героя в здании: главный капитан — в штабе, остальные архетипы — в казармах; павшего заказывают заново
    const a = cmd.a, main = a === p.arch, from = heroFrom(p, a);
    if (!ARCHS.includes(a) || !ARCH_OPTS[p.faction][a]) return;
    if (heroBusy(s, owner, a)) return 'Этот герой уже в армии или в очереди';
    const fallen = s.units.find(u => u.owner === owner && u.kind === 'captain' && u.hp <= 0 && archOf(s, u) === a);
    if (fallen && fallen.dead < 0) return `Герой вернётся в строй через ${Math.ceil(-fallen.dead)} с`; // павший Бог-Механизм
    if (!main) return 'Герой у расы один — как в UA';
    const ok = (u: Unit) => u.owner === owner && u.kind === from && u.hp > 0 && u.build >= 1 && u.que.length < QUEUE_MAX;
    const b = s.units.find(u => u.id === cmd.id && ok(u)) ?? s.units.filter(ok).sort((x, y) => x.que.length - y.que.length)[0];
    if (!b) { const race = MOD_RACES[p.faction as keyof typeof MOD_RACES], id = (race?.build as Partial<Record<Kind, string>> | undefined)?.[from]; return `Нужно здание: ${(id && (race.data.buildings as Record<string, { name?: string }>)[id]?.name) || from}`; }
    const c = { cost: trainCost(p.faction, 'captain', p), energy: trainEnergy(p.faction, 'captain', p), relics: 0 }, paidC = resourceCost(p.faction, c.cost, c.energy, p.energy);
    const e = pay(p, c.cost, c.energy, c.relics);
    if (e) return e;
    b.que.push('captain'); b.paid.push([paidC.req, paidC.energy, 0, 0, ARCHS.indexOf(a)]);
    return;
  }
  if (cmd.c === 'cancel') { // отмена места в очереди: ресурсы возвращаются полностью
    const b = s.units.find(u => u.id === cmd.id && u.owner === owner && u.hp > 0);
    const i = Number(cmd.i);
    if (!b || !Number.isInteger(i) || i < 0 || i >= b.que.length) return;
    const [req, en, rel, rem] = b.paid[i] ?? [0, 0, 0, 0];
    p.req += req; p.energy += en; p.relics += rel; p.remains += rem;
    b.que.splice(i, 1); b.paid.splice(i, 1); b.q = b.que.length;
    if (i === 0) b.prog = 0;
    return;
  }
  // механики игры, которых нет в UA: исследования и открытия игры, удар по карте, засвет, снаряжение (гранаты, заряд, дым), способности героя, укрепление поста и стен
  if (['timestop', 'learn', 'ability', 'unlock', 'strike', 'scan', 'research', 'gear', 'throw'].includes(cmd.c)) return 'Нет в UA';
  if (cmd.c === 'upgrade' && s.units.some(v => v.id === cmd.id && v.owner === owner && (v.kind === 'post' || v.kind === 'wall' || v.kind === 'wallgate'))) return 'Нет в UA';
  if (cmd.c === 'upgrade' && s.units.some(v => v.id === cmd.id && v.kind === 'hq' && v.owner === owner)) { // переход тира
    if (UA_ADDONS[p.faction]) return 'Тир штаба — аддоном штаба'; // в UA переход тира — достройка штаба (команда uaa)
    const hq = hqOf(s, owner)!, t = TIER_UP[p.tier];
    if (!t) return 'Высший тир';
    if (hq.upg >= 0) return 'Переход уже идёт';
    if (!s.units.some(v => v.owner === owner && v.kind === t.key && v.build >= 1 && v.hp > 0)) return 'Нужно ключевое здание тира';
    if (t.seal && !has(p, 15)) return 'Нужна Печать Вознесения';
    const e = pay(p, t.cost, t.energy, t.relics);
    if (e) return e;
    hq.upg = 0;
    return;
  }
  if (cmd.c === 'uaw') { // ствол бойцу отряда UA — из панели отряда, где угодно, не под огнём
    const u = s.units.find(v => v.id === cmd.id && v.owner === owner && v.hp > 0), A = u && UA_ARM[u.f!]?.[u.kind], o = A?.opts[cmd.w];
    if (!u || !A || !o) return;
    if (u.wq !== undefined) return 'Отряд уже перевооружается';
    if (u.hit < 2) return 'Под огнём нельзя';
    const wu = u.wu ?? [];
    if (wu.reduce((a, x) => a + (x ?? 0), 0) >= A.ups) return `Не больше ${A.ups} стволов на отряд`;
    if (A.opts.reduce((a, x, i) => a + (x.h === o.h ? wu[i] ?? 0 : 0), 0) >= membersOf(u)) return 'Все бойцы уже вооружены';
    const r = armReq(s, owner, o.requires);
    if (r) return r;
    const e = pay(p, o.cost, o.power);
    if (e) return e;
    u.wq = cmd.w; u.wt = 0;
    return;
  }
  if (cmd.c === 'cheat') { // только в разработке: ресурсы, тир IV и 10-й уровень героям
    if (!s.dev) return;
    Object.assign(p, { req: p.req + 5000, energy: p.energy + 5000, tier: Math.max(p.tier, 4) }); p.cheat = true; // чит: +5 к удерживаемым реликвариям
    for (const c of s.units) if (c.owner === owner && c.hero && c.hero.lvl < 10) { c.hero.pts += 10 - c.hero.lvl; c.hero.lvl = 10; }
    return;
  }
  if (cmd.c === 'timestop') { // Остановка времени: враги в 12 м замирают на 3 с
    const d = s.units.find(u => u.owner === owner && u.kind === 'deity' && u.hp > 0);
    if (!d) return 'Нет Бога-Механизма';
    if (p.stopCd > 0) return `Перезарядка ${Math.ceil(p.stopCd)} с`;
    p.stopCd = DEITY.stopCd;
    for (const v of s.units) if (v.owner !== owner && v.hp > 0 && dist(v, d) < DEITY.stop) v.frozen = DEITY.stopTime;
    if (s.shots.length < 200) s.shots.push([d.x, d.y, d.x, d.y - 0.1, 17]);
    return;
  }
  if (cmd.c === 'learn') {
    const a = Number(cmd.a), c = heroBy(s, owner, cmd.id, u => !canLearn(u.hero!, p.tier, a)) ?? heroBy(s, owner, cmd.id);
    if (!Number.isInteger(a) || a < 0 || a >= ABILITIES.length) return;
    if (!c) return 'Нет живого героя';
    const e = canLearn(c.hero!, p.tier, a);
    if (e) return e;
    c.hero!.abil |= 1 << a; c.hero!.pts--;
    return;
  }
  if (cmd.c === 'ability') {
    const a = Number(cmd.a), c = heroBy(s, owner, cmd.id, u => !!(u.hero!.abil & (1 << a)) && !u.hero!.acd[a]) ?? heroBy(s, owner, cmd.id, u => !!(u.hero!.abil & (1 << a)));
    if (!Number.isInteger(a) || !ABILITIES[a]?.cd) return;
    if (!c) return 'Нет героя с этой способностью';
    const h = c.hero!;
    if (h.acd[a] > 0) return `Перезарядка ${Math.ceil(h.acd[a])} с`;
    h.acd[a] = ABILITIES[a].cd;
    const allies = (r: number) => s.units.filter(v => v.owner === owner && !isStruct(v.kind) && v.hp > 0 && dist(v, c) < r);
    const hitFoes = (r: number, dmg: number) => { for (const v of s.units) if (v.owner !== owner && v.hp > 0 && dist(v, c) < r) { hurt(s, v, dmg, owner); } };
    if (a === 1) for (const v of allies(10)) v.hp = Math.min(hpOf(v), v.hp + hpOf(v) * 0.25);
    if (a === 3) c.rush = 5;
    if (a === 4) hitFoes(6, 150);
    if (a === 5) hitFoes(12, 500);
    if (a === 7) for (const v of allies(15)) v.hp = Math.min(hpOf(v), v.hp + hpOf(v) * 0.15);
    if (a === 8) for (const v of allies(12)) v.stand = 6;
    if (s.shots.length < 200) s.shots.push([c.x, c.y, c.x, c.y - 0.1]);
    return;
  }
  if (cmd.c === 'unlock') { // открытие в штабе
    const b = s.units.find(v => v.id === cmd.id && v.owner === owner && v.kind === 'hq' && v.hp > 0 && v.build >= 1);
    const u = Number(cmd.u), U = UNLOCKS[u];
    if (!b || !U) return;
    if (p.unlock & (1 << u)) return 'Уже открыто';
    if (p.tier < U.tier) return `Нужен тир ${U.tier}`;
    if (b.que.length) return 'Здание нанимает войска';
    if (s.units.some(v => v.owner === owner && v.kind === 'hq' && v.q > 100)) return 'Штаб уже исследует';
    const e = pay(p, U.cost, U.energy, U.relics);
    if (e) return e;
    b.q = 101 + u; b.prog = 0;
    return;
  }
  if (cmd.c === 'strike') { // сверхоружие штаба: удар в любую точку карты
    if (!(p.unlock & 2) || !Number.isFinite(cmd.x) || !Number.isFinite(cmd.y)) return;
    if (p.doom < DOOM.charge) return `Заряд ${Math.floor((p.doom / DOOM.charge) * 100)}%`;
    const e = pay(p, 0, DOOM_SHOT); // каждый пуск ещё и стоит энергии
    if (e) return e;
    p.doom = 0;
    s.strikes.push({ x: clamp(cmd.x, 0, MAP.w), y: clamp(cmd.y, 0, MAP.h), t: DOOM.warn, owner });
    return;
  }
  if (cmd.c === 'scan') { // засвет из штаба: открыть круг на карте
    if (!Number.isFinite(cmd.x) || !Number.isFinite(cmd.y)) return;
    if (!hqOf(s, owner)) return 'Нужен штаб';
    if (p.scanCd > 0) return `Перезарядка ${Math.ceil(p.scanCd)} с`;
    const e = pay(p, 0, SCAN.energy);
    if (e) return e;
    p.scanCd = SCAN.cd;
    s.scans.push({ x: clamp(cmd.x, 0, MAP.w), y: clamp(cmd.y, 0, MAP.h), t: SCAN.t, owner, r: SCAN.r });
    return;
  }
  if (cmd.c === 'uar') { // исследование UA: в своём здании, по одному за раз, вместо найма
    const R = UA_RESEARCH[p.faction], r = Number(cmd.r), x = R?.[r];
    const b = s.units.find(v => v.id === cmd.id && v.owner === owner && v.hp > 0 && v.build >= 1);
    if (!b || !x || !x.ats.includes(b.kind)) return;
    if (p.ur?.includes(r)) return 'Уже изучено';
    if (b.que.length || b.q > 0) return 'Здание занято';
    const miss = uaMissing(p.faction, x.req, haveOf(s, owner), b.ad);
    if (miss) return miss;
    const e = pay(p, x.cost, x.energy);
    if (e) return e;
    b.q = 1000 + r; b.prog = 0;
    return;
  }
  if (cmd.c === 'uaa') { // аддон UA: у своего здания, по одному за раз
    const a = Number(cmd.a), x = UA_ADDONS[p.faction]?.[a];
    const b = s.units.find(v => v.id === cmd.id && v.owner === owner && v.hp > 0 && v.build >= 1);
    if (!b || !x || !x.ats.includes(b.kind)) return;
    if ((b.ad ?? 0) & (1 << a)) return 'Уже достроено';
    if (b.que.length || b.q > 0) return 'Здание занято';
    const miss = uaMissing(p.faction, x.req, haveOf(s, owner), b.ad);
    if (miss) return miss;
    const e = pay(p, x.cost, x.energy);
    if (e) return e;
    b.q = 5000 + a; b.prog = 0;
    return;
  }
  if (cmd.c === 'research') {
    const b = s.units.find(v => v.id === cmd.id && v.owner === owner && v.hp > 0 && v.build >= 1 && /^key[1-4]$/.test(v.kind));
    const r = Number(cmd.r);
    if (!b || !Number.isInteger(r) || r < 0 || r > 3) return;
    const i = (Number(b.kind[3]) - 1) * 4 + r;
    if (has(p, i)) return 'Уже изучено';
    if (b.que.length) return 'Здание нанимает войска';
    if (b.q > 0) return 'Здание уже исследует';
    const c = researchCost(i), e = pay(p, c.cost, c.energy);
    if (e) return e;
    b.q = i + 1; b.prog = 0;
    return;
  }
  if (cmd.c === 'summon') return 'Легенды — обычный найм в зданиях, как в UA';

  if (cmd.c === 'upgrade' && s.units.some(v => v.id === cmd.id && v.kind === 'post' && v.owner === owner)) { // прокачка точки I→II→III
    const u = s.units.find(v => v.id === cmd.id)!, up = POST_UP[u.lvl];
    if (u.build < 1) return 'Строительство не завершено';
    if (!up) return 'Точка уже бастион';
    if (u.upg >= 0) return 'Уже улучшается';
    if (dist(u, s.points[0]) < 2) return 'Критическую точку не укрепить — за неё сражаются';
    if (p.tier < up.tier) return `Нужен тир ${up.tier}`;
    const e = pay(p, up.cost, up.energy);
    if (e) return e;
    u.upg = 0;
    return;
  }
  if (cmd.c === 'upgrade' && s.units.some(v => v.id === cmd.id && v.owner === owner && (v.kind === 'wall' || v.kind === 'wallgate'))) { // укрепить все свои стены и ворота
    if (p.tier < 2) return 'Нужен тир 2';
    const ws = s.units.filter(v => v.owner === owner && (v.kind === 'wall' || v.kind === 'wallgate') && v.hp > 0 && v.build >= 1 && v.lvl < 2 && v.upg < 0);
    if (!ws.length) return 'Стены уже укреплены';
    const e = pay(p, ws.reduce((n, v) => n + UPGRADES[v.kind]!.cost, 0));
    if (e) return e;
    for (const v of ws) v.upg = 0;
    return;
  }
  if (cmd.c === 'upgrade') {
    const u = s.units.find(v => v.id === cmd.id && v.owner === owner && v.hp > 0);
    const up = u && upOf(u.f, u.kind);
    if (!u || !up) return;
    if (u.build < 1) return 'Строительство не завершено';
    if (u.lvl >= 2 || u.upg >= 0) return 'Уже улучшено';
    if (p.tier < up.tier) return `Нужен тир ${up.tier}`;
    const e = pay(p, up.cost, up.energy, up.relics);
    if (e) return e;
    u.upg = 0;
    return;
  }
  if (!Array.isArray(cmd.ids)) return;
  const ids = new Set(cmd.ids.slice(0, 100));
  const mine = s.units.filter(u => ids.has(u.id) && u.owner === owner && !isStruct(u.kind) && u.hp > 0);
  if (cmd.c === 'stop') { for (const u of mine) { u.order = null; u.queue = undefined; } return; }
  if (cmd.c === 'reinforce') { for (const u of mine) if (canReinforce(s, u)) u.reinf = true; return; }
  if (cmd.c === 'gear') { // купить снаряжение выбранным отрядам: у штаба, казарм или капитана
    if (UA_SQ[fac(s, owner)]) return 'У рас UA вместо гранат — стволы отряда';
    const g = Number(cmd.g), G = GEAR[g];
    if (!G) return;
    if (p.tier < 2) return 'Снаряжение — с тира II';
    const ok = mine.filter(u => SQUADS.has(u.kind) && !(u.gear & (1 << g)));
    if (!ok.length) return 'Уже куплено';
    let bought = 0;
    for (const u of ok) {
      if (!s.units.some(v => v.owner === owner && v.hp > 0 && (v.kind === 'hq' || v.kind === 'barracks' || v.kind === 'captain') && dist(v, u) < 25)) continue;
      if (pay(p, G.cost, G.energy)) break;
      u.gear |= 1 << g; u.ch[g] = G.charges; bought++;
    }
    return bought ? undefined : 'Подведите отряд к штабу, казармам или капитану (или не хватает ресурсов)';
  }
  if (cmd.c === 'throw') {
    const g = Number(cmd.g);
    if (!GEAR[g] || !Number.isFinite(cmd.x) || !Number.isFinite(cmd.y)) return;
    const ready = mine.filter(u => u.gear & (1 << g) && u.ch[g] > 0);
    if (!ready.length) return 'Нет зарядов';
    const u = ready.sort((a, b) => a.gcd - b.gcd || dist(a, cmd) - dist(b, cmd))[0]; // бросает один отряд — ближайший готовый
    give(u, { t: 'throw', g, x: clamp(cmd.x, 0, MAP.w), y: clamp(cmd.y, 0, MAP.h) }, cmd.q);
    return;
  }
  if (cmd.c === 'fire') { // огонь по точке: дальнобойные (артиллерия, тяжёлое оружие, снайперы, тяжёлая техника, титаны)
    if (!Number.isFinite(cmd.x) || !Number.isFinite(cmd.y)) return;
    const ok = mine.filter(u => canFireGround(u.kind));
    if (!ok.length) return 'Огонь по точке — у дальнобойных: артиллерия, тяжёлое оружие, снайперы, техника';
    for (const u of ok) give(u, { t: 'fire', x: clamp(cmd.x, 0, MAP.w), y: clamp(cmd.y, 0, MAP.h) }, cmd.q);
    return;
  }
  if (cmd.c === 'attack') {
    const t = s.units.find(u => u.id === cmd.id && u.owner !== owner && u.hp > 0);
    if (t) for (const u of mine) if (ST(u).dmg > 0) give(u, { t: 'attack', id: t.id }, cmd.q);
    return;
  }
  if (cmd.c === 'assist') {
    const t = s.units.find(u => u.id === cmd.id && u.owner === owner && (isStruct(u.kind) || VEHICLES.has(u.kind)) && u.hp > 0);
    if (!t) return;
    if (t.build >= 1 && t.hp >= hpOf(t) - 1e-6) return 'Ремонт не нужен';
    for (const u of mine) if (u.kind === 'builder') give(u, { t: 'build', id: t.id }, cmd.q);
    return;
  }
  if (cmd.c === 'wall') { // протяжка стены: по клетке сетки вдоль линии, занятые клетки пропускаем
    if (NO_BUILD[p.faction]?.includes('wall')) return 'Постройка другой фракции';
    const bs = mine.filter(u => u.kind === 'builder');
    if (!bs.length) return 'Нужны строители';
    if (![cmd.x1, cmd.y1, cmd.x2, cmd.y2].every(Number.isFinite)) return;
    let first: Unit | undefined;
    const structs = s.units.filter(u => isStruct(u.kind) && u.hp > 0);
    for (const { x, y } of wallCells(clamp(cmd.x1, 2, MAP.w - 2), clamp(cmd.y1, 2, MAP.h - 2), clamp(cmd.x2, 2, MAP.w - 2), clamp(cmd.y2, 2, MAP.h - 2))) {
      if (!wallOk(structs, owner, x, y)) continue;
      if (pay(p, STATS.wall.cost)) break;
      const site = spawn(s, owner, 'wall', x, y);
      site.build = 0.05; site.hp = STATS.wall.hp * 0.05; first ??= site;
    }
    if (!first) return 'Здесь нельзя вести стену';
    for (const b2 of bs) give(b2, { t: 'build', id: first.id }, cmd.q);
    return;
  }
  if (cmd.c === 'build') {
    const bs = mine.filter(u => u.kind === 'builder');
    if (!bs.length) return 'Нужны строители';
    if (!(cmd.kind in BUILD_TIER) || !Number.isFinite(cmd.x) || !Number.isFinite(cmd.y)) return;
    if (UA_REQ[p.faction]?.[cmd.kind]) { const miss = uaMissing(p.faction, UA_REQ[p.faction]![cmd.kind], haveOf(s, owner)); if (miss) return miss; } // раса UA — дерево требований мода вместо тиров
    else if (p.tier < BUILD_TIER[cmd.kind]) return `Нужен тир ${BUILD_TIER[cmd.kind]}`;
    const c = statOf(cmd.kind, p.faction);
    if (cmd.kind in FACTION_ONLY && FACTION_ONLY[cmd.kind] !== p.faction || NO_BUILD[p.faction]?.includes(cmd.kind) || cmd.kind === 'spire') return 'Постройка другой фракции';
    if (MEGA.has(cmd.kind) && !(p.unlock & 1)) return `Сначала исследуйте «${UNLOCKS[0].name}» в штабе`;
    { const probe = { ...p }; const e = pay(probe, c.cost, energyOf(cmd.kind, p.faction)); if (e) return e; } // проверка цены теми же правилами, что и оплата
    let { x, y } = snapB(cmd.kind, clamp(cmd.x, 4, MAP.w - 4), clamp(cmd.y, 4, MAP.h - 4)); // встаёт по клеткам сетки
    if (dist(s.points[0], { x, y }) < CRIT_NOBUILD) return 'У критической точки строить нельзя — за неё сражаются';
    if (blocked(x, y, (foot(cmd.kind) * BCELL) / 2)) return 'На скалах строить нельзя';
    if (cmd.kind === 'hq') { // ещё один штаб (у Династий — Монолит): у своей точки или построек, не у чужой базы, не больше трёх
      if (count(s, owner, 'hq') >= 3) return 'Штабов не больше трёх';
      if (s.units.some(u => u.kind === 'hq' && u.owner !== owner && u.hp > 0 && dist(u, { x, y }) < 50)) return 'Слишком близко к чужому штабу';
      if (!nearOwnPoint(s, owner, x, y) && !s.units.some(u => u.owner === owner && isStruct(u.kind) && u.hp > 0 && dist(u, { x, y }) < 30)) return 'Штаб ставится у своей точки или рядом со своими постройками';
    }
    if (cmd.kind === 'post') {
      const pt = s.points.filter(q => dist(q, { x, y }) < 9).sort((a, b) => dist(a, { x, y }) - dist(b, { x, y }))[0];
      if (!pt) return 'Пост строится у стратегической точки';
      if (pt.owner !== owner) return pt.owner >= 0 ? 'Точка занята врагом' : 'Сначала захватите точку'; // как в DoW: пост — только на своей точке
      ({ x, y } = pt);
      if (s.units.some(u => u.kind === 'post' && u.hp > 0 && dist(u, pt) < 2)) return 'На точке уже есть пост';
    } else if (cmd.kind === 'pump' || cmd.kind === 'foundry') { // генераторы: обычный — где угодно, продвинутый (термо) — только на свободную жилу
      if (s.units.filter(u => u.owner === owner && (u.kind === 'pump' || u.kind === 'foundry') && u.hp > 0).length >= GEN_CAP) return `Генераторов не больше ${GEN_CAP}`;
      if (cmd.kind === 'pump') {
        const a = genAnchor(s.points, s.units.filter(u => u.hp > 0), owner, x, y, cmd.kind);
        if (!a) return 'Термогенератор ставится на свободную жилу: одна жила — один генератор';
        ({ x, y } = a);
      }
    } else if (cmd.kind === 'mine' || cmd.kind === 'wallgate' || cmd.kind === 'bunker' || cmd.kind === 'wall' || cmd.kind === 'portal') { // укрепления и портал: своя или нейтральная земля
      if (s.units.some(u => u.kind === 'hq' && u.owner !== owner && u.hp > 0 && dist(u, { x, y }) < 20)) return 'Слишком близко к чужому штабу';
      if (s.points.some(q => q.owner !== owner && dist(q, { x, y }) < POINT_R)) return 'Сначала захватите точку'; // на чужой и ничьей точке укрепляться нельзя
    } else if (cmd.kind === 'turret' || cmd.kind === 'aegis' || DEFENSE.has(cmd.kind) || /^key|^gate/.test(cmd.kind)) {
      if ((/^key|^gate/.test(cmd.kind) || cmd.kind === 'lighthouse' || cmd.kind === 'obelisk' || cmd.kind === 'megagun' || cmd.kind === 'plague') && s.units.some(u => u.owner === owner && u.kind === cmd.kind && u.hp > 0)) return 'Такое здание уже есть';
      if (!s.units.some(u => u.owner === owner && isStruct(u.kind) && u.kind !== 'turret' && u.hp > 0 && dist(u, { x, y }) < 16) && !((cmd.kind === 'turret' || DEFENSE.has(cmd.kind)) && nearOwnPoint(s, owner, x, y)))
        return 'Турель ставится у своих построек или вокруг своей точки';
    } else if (cmd.kind !== 'hq') {
      const hq = hqOf(s, owner), d = hq ? dist(hq, { x, y }) : 99;
      if (d < 8 || d > 32) return 'Казармы строятся рядом со штабом';
    }
    if (/turret$/.test(cmd.kind) && count(s, owner, 'turret') + count(s, owner, 'rturret') + count(s, owner, 'fturret') >= TURRET_CAP) return 'Лимит турелей';
    if (!footFree(s.units.filter(u => isStruct(u.kind) && u.hp > 0), cmd.kind, x, y)) return 'Место занято';
    pay(p, c.cost, energyOf(cmd.kind, p.faction));
    const site = spawn(s, owner, cmd.kind, x, y);
    site.build = 0.05; site.hp = c.hp * 0.05;
    for (const b of bs) give(b, { t: 'build', id: site.id }, cmd.q);
    return;
  }
  if ((cmd.c !== 'move' && cmd.c !== 'amove') || !Number.isFinite(cmd.x) || !Number.isFinite(cmd.y)) return;
  const cols = Math.ceil(Math.sqrt(mine.length)), rows = Math.ceil(mine.length / cols);
  mine.forEach((u, i) => { // строй сеткой вокруг точки, чтобы юниты не толкались на одной клетке
    const x = clamp(cmd.x + ((i % cols) - (cols - 1) / 2) * 2.4, 1, MAP.w - 1);
    const y = clamp(cmd.y + (Math.floor(i / cols) - (rows - 1) / 2) * 2.4, 1, MAP.h - 1);
    give(u, { t: cmd.c === 'amove' && ST(u).dmg > 0 ? 'amove' : 'move', x, y }, cmd.q);
  });
}

export function step(s: State, dt = DT): void {
  if (s.winner !== null) return;
  s.tick++;
  s.players.forEach((p, i) => { // аддоны UA: здание пало — аддон пропал; тир штаба = 1 + аддоны штаба
    if (!UA_ADDONS[p.faction]) return;
    let ad = 0;
    if (p.gad) for (const u of s.units) if (u.owner === i && u.hp > 0 && u.kind === 'turret' && u.build >= 1) u.ad = (u.ad ?? 0) | p.gad;
    for (const u of s.units) if (u.owner === i && u.hp > 0 && u.ad) ad |= u.ad;
    if (ad !== (p.ad ?? 0)) { p.ad = ad; p.um = undefined; for (const u of s.units) if (u.owner === i) refreshUnit(s, u); }
    const hqUps = UA_ADDONS[p.faction]!.filter((a, j) => a.at === 'hq' && ad & (1 << j)).length;
    if (1 + hqUps > p.tier) p.tier = 1 + hqUps;
  });
  const income = s.players.map(() => BASE_INCOME), energy = s.players.map(() => 0);
  for (const pt of s.points) if (pt.owner >= 0) {
    const po = postAt(s, pt); income[pt.owner] += 1 + (po?.owner === pt.owner ? (po.lvl >= 2 ? 3 : 2) : 0); // реликварий теперь обычная точка: пост, влияние
  }
  for (const u of s.units) if (u.build >= 1 && u.hp > 0) energy[u.owner] += (ENERGY_INCOME[u.kind] ?? 0) * (u.kind === 'pump' && hasR(s, u.owner, 6) ? 1.25 : 1);
  s.players.forEach((p, i) => {
    if (!p.alive) return;
    const um = uaMods(p); income[i] *= um.req; energy[i] *= um.power; // доход из исследований UA
    p.req += income[i] * dt; p.energy += energy[i] * dt;
    p.relics = relicsHeld(s, i) + (p.cheat ? 5 : 0);
    if (p.waagh > 0) p.waagh = Math.max(0, p.waagh - dt);
  });
  for (const r of s.rewind) r.t -= dt; // Перезавод: отряд встаёт на месте гибели
  for (const r of s.rewind.filter(r => r.t <= 0)) if (s.players[r.owner].alive) spawn(s, r.owner, 'guard', r.x, r.y);
  s.rewind = s.rewind.filter(r => r.t > 0);
  for (const u of s.units) if (u.hero) for (let i = 0; i < u.hero.acd.length; i++) u.hero.acd[i] = Math.max(0, u.hero.acd[i] - dt);
  for (const p of s.players) { p.stopCd = Math.max(0, p.stopCd - dt); p.scanCd = Math.max(0, p.scanCd - dt); if (p.unlock & 2) p.doom = Math.min(DOOM.charge, p.doom + dt); }
  const byId = new Map(s.units.map(u => [u.id, u]));
  for (const u of s.units) {
    if (!s.players[u.owner].alive) continue;
    u.hit += dt;
    u.rush = Math.max(0, u.rush - dt); u.stand = Math.max(0, u.stand - dt);
    if (u.frozen > 0) { u.frozen -= dt; continue; } // Остановка времени
    if (u.kind === 'aegis' && u.build >= 1) { if (u.off > 0) u.off -= dt; else u.sh = Math.min(AEGIS.pool, u.sh + AEGIS.regen * dt); }
    if (u.rise > 0) { // Вознесение: 4 с превращения, затем капитан становится Богом-Механизмом
      if ((u.rise -= dt) <= 0) { u.rise = 0; u.kind = 'deity'; u.hp = maxHp('deity'); }
      continue;
    }
    if (u.kind === 'captain' && u.hp <= 0) { u.dead = Math.min(0, u.dead + dt); continue; } // павший герой ждёт заказа в здании; dead < 0 — его ещё нельзя заказать
    if (u.hp <= 0) continue;
    if (u.upg >= 0 && u.kind === 'hq') { if ((u.upg += dt) >= TIER_TIME) { u.upg = -1; s.players[u.owner].tier++; } }
    else if (u.upg >= 0 && u.kind === 'post') { if ((u.upg += dt) >= 12) { u.upg = -1; u.lvl++; } }
    else if (u.upg >= 0) { // идёт апгрейд
      const up = upOf(u.f, u.kind) ?? UPGRADES[u.kind]; // стены и ворота укрепляются общим апгрейдом и у рас UA
      if (!up) u.upg = -1;
      else if ((u.upg += dt) >= up.time) { u.upg = -1; u.lvl = 2; }
    }
    if (u.build >= 1) produce(s, u, dt);
    act(s, u, dt, byId);
    reinforce(s, u, dt);
    if (u.wq !== undefined && (u.wt = (u.wt ?? 0) + dt) >= UA_ARM[u.f!]![u.kind]!.opts[u.wq].time) { (u.wu ??= [])[u.wq] = (u.wu[u.wq] ?? 0) + 1; u.wq = undefined; armRange(u); } // ствол бойцу поставлен
  }
  for (const t of s.units) if (t.carry && isStruct(t.kind)) { // турель едет за несущим отрядом
    const sq = s.units.find(v => v.id === t.carry && v.hp > 0);
    if (!sq) { t.carry = 0; continue; }
    t.x = sq.x - Math.cos(sq.face) * 1.8; t.y = sq.y - Math.sin(sq.face) * 1.8;
  }
  for (const m of s.units) { // мины: срабатывают от врага рядом, бьют по площади и исчезают
    if (m.kind !== 'mine' || m.build < 1 || m.hp <= 0) continue;
    if (!s.units.some(e => e.owner !== m.owner && !isStruct(e.kind) && e.hp > 0 && dist(e, m) < STATS.mine.range)) continue;
    for (const e of s.units) if (e.owner !== m.owner && e.hp > 0 && dist(e, m) < 6) { hurt(s, e, STATS.mine.dmg, m.owner); }
    m.hp = 0;
    if (s.shots.length < 200) s.shots.push([m.x, m.y, m.x, m.y - 0.1]);
  }
  for (const st of s.strikes) if ((st.t -= dt) <= 0) doomStrike(s, st); // удар сверхоружия — у каждой фракции свой
  const burning = new Map<Unit, { damage: number; owner: number }>();
  for (const z of s.plagues) {
    z.t -= dt;
    if (s.tick % 20 !== 0) continue;
    for (const v of s.units) {
      if (v.owner === z.owner || v.hp <= 0 || (!z.fire && isStruct(v.kind)) || dist(v, z) >= (z.fire ? FIRE.r : 18)) continue;
      if (!z.fire) { hurt(s, v, hpOf(v) * 0.06, z.owner); continue; } // кислотная чума сохраняет свой процентный урон
      const damage = FIRE.dps * VS.small[armorOf(v.kind, v.f)] * combatArmorMul(s, v);
      const previous = burning.get(v);
      if (!previous || damage > previous.damage) burning.set(v, { damage, owner: z.owner });
    }
  }
  // Overlapping incendiary patches refresh the hazard, never multiply its DPS.
  for (const [v, fire] of burning) hurt(s, v, fire.damage, fire.owner);
  s.plagues = s.plagues.filter(z => z.t > 0);
  s.strikes = s.strikes.filter(st => st.t > 0);
  s.scans = s.scans.filter(c => (c.t -= dt) > 0);
  for (const b of s.blasts) if ((b.t -= dt) <= 0) { // гранаты долетели
    const G = GEAR[b.g];
    if (b.g === 2) s.smoke.push({ x: b.x, y: b.y, t: SMOKE_TIME });
    else for (const v of s.units) { // только врагов: своих не задевает
      if (v.hp <= 0 || v.owner === b.owner || dist(v, b) > G.r + (isStruct(v.kind) ? ST(v).radius : 0)) continue;
      const a = armorOf(v.kind, v.f), k = b.g === 1 ? (a === 'veh' || a === 'light' || a === 'struct' ? 1 : a === 'titan' ? 0.5 : 0.25) : a === 'inf' ? 1 : a === 'hinf' ? 0.6 : 0.2;
      hurt(s, v, G.dmg * k, b.owner);
    }
    if (s.shots.length < 200) s.shots.push([b.x, b.y, b.x, b.y - 0.1, b.g === 2 ? 9 : 8]);
  }
  s.blasts = s.blasts.filter(b => b.t > 0);
  for (const c of s.smoke) c.t -= dt;
  s.smoke = s.smoke.filter(c => c.t > 0);
  separate(s);
  capture(s, dt);
  cleanup(s);
}

/** Рядом со своей захваченной точкой (стратегической или реликварием): там можно ставить генераторы. */
export const GEN_R = 14;
/** Генераторов (насосов и литеен) у игрока не больше GEN_CAP: энергия не должна литься рекой. */
export const GEN_CAP = 5;
export const nearOwnPoint = (s: State, owner: number, x: number, y: number) => s.points.some((p, i) => i !== 0 && p.owner === owner && dist(p, { x, y }) < GEN_R); // критическая точка не в счёт
/** Якорь генератора: жила (насос), своя точка кроме критической или свой штаб (литейня). На якоре — один генератор: каждый генератор принадлежит ближайшему якорю в досягаемости. */
type At = { x: number; y: number; owner: number };
/** Та же проверка в превью клиента: points — стратегические и реликварии по порядку s.points, units — живые постройки. */
export function genAnchor(points: At[], units: (At & { kind: Kind })[], owner: number, x: number, y: number, kind: 'pump' | 'foundry') {
  const anchors = [
    ...VENTS.map(([vx, vy]) => ({ x: vx, y: vy, r: 6, vent: true })),
    ...points.filter((p, i) => i !== 0 && p.owner === owner).map(p => ({ x: p.x, y: p.y, r: GEN_R, vent: false })),
    ...units.filter(u => u.owner === owner && u.kind === 'hq').map(u => ({ x: u.x, y: u.y, r: 16, vent: false })),
  ];
  const near = (q: { x: number; y: number }) => anchors.filter(a => dist(a, q) < a.r).sort((a, b) => dist(a, q) - dist(b, q))[0];
  const taken = new Set(units.filter(u => u.kind === 'pump' || u.kind === 'foundry').map(near));
  return anchors.filter(a => a.vent === (kind === 'pump') && dist(a, { x, y }) < a.r && !taken.has(a)).sort((a, b) => dist(a, { x, y }) - dist(b, { x, y }))[0];
}
/** У критической точки (центр) строить нельзя ничего: за неё только сражаются. */
export const CRIT_NOBUILD = 12;
/** Клетка стены годится: свободна от скал и построек, не у критической точки, не ближе 20 м к чужому штабу. Та же проверка в подсказке клиента. */
export const wallOk = (structs: { kind: Kind; x: number; y: number; owner: number }[], owner: number, x: number, y: number) =>
  footFree(structs, 'wall', x, y) && dist({ x: POINTS[0][0], y: POINTS[0][1] }, { x, y }) >= CRIT_NOBUILD && !structs.some(u => u.kind === 'hq' && u.owner !== owner && dist(u, { x, y }) < 20);
/** Уникальные оборонительные постройки ставятся как турели: у своих построек или вокруг своей точки. */
export const DEFENSE = new Set<Kind>(['battery', 'pylon', 'pyre', 'bell', 'lighthouse', 'obelisk', 'megagun', 'plague', 'spire']);
const postAt = (s: State, pt: { x: number; y: number }) => s.units.find(u => u.kind === 'post' && u.build >= 1 && u.hp > 0 && dist(u, pt) < 2);

function produce(s: State, b: Unit, dt: number) {
  const p = s.players[b.owner];
  if (b.q >= 5000) { // аддон UA: достраивается к зданию
    const i = b.q - 5000, x = UA_ADDONS[p.faction]?.[i];
    if (!x) { b.q = 0; return; }
    if ((b.prog += dt) >= x.time) { b.ad = (b.ad ?? 0) | (1 << i); b.q = 0; b.prog = 0; if (b.kind === 'turret') p.gad = (p.gad ?? 0) | (1 << i); } // аддон турели — на все турели игрока
    return;
  }
  if (b.q >= 1000) { // исследование UA
    const x = UA_RESEARCH[p.faction]?.[b.q - 1000];
    if (!x) { b.q = 0; return; }
    if ((b.prog += dt) >= x.time) { (p.ur ??= []).push(b.q - 1000); p.um = undefined; b.q = 0; b.prog = 0; for (const u of s.units) if (u.owner === b.owner) refreshUnit(s, u); }
    return;
  }
  if (b.q > 100) { const U = UNLOCKS[b.q - 101]; if ((b.prog += dt) >= U.time) { p.unlock |= 1 << (b.q - 101); b.q = 0; b.prog = 0; } return; }
  if (/^key[1-4]$/.test(b.kind) && b.q > 0 && !b.que.length) { // исследование
    if ((b.prog += dt) >= researchCost(b.q - 1).time) { p.research |= 1 << (b.q - 1); b.q = 0; b.prog = 0; }
    return;
  }
  if (b.kind === 'gate' && b.q > 0) { // призыв легенды: 20 с, виден всем
    if ((b.prog += dt) >= SUMMON_TIME) { const l = spawn(s, b.owner, 'legend', ...nearHq(b.x, b.y, STATS.gate.radius + 2.5)); l.q = b.q - 1; b.q = 0; b.prog = 0; }
    return;
  }
  b.q = b.que.length;
  const what = b.que[0];
  if (!what) return;
  b.prog += dt * uaMods(p).prod; // скорость производства из исследований UA
  if (b.prog >= trainTime(b.f, what, p) * (ROLES[what]?.from === 'barracks' && has(p, 1) ? 0.85 : 1)) {
    const [, , , , ai] = b.paid[0] ?? [];
    b.prog = 0; b.que.shift(); b.paid.shift(); b.q = b.que.length;
    const at = nearHq(b.x, b.y, ST(b).radius + 2.5 + statOf(what, b.f).radius);
    if (what === 'captain') { // герой: павший встаёт с прежним уровнем и снаряжением, иначе — новый
      const a = ARCHS[ai ?? -1] ?? p.arch, fallen = s.units.find(u => u.owner === b.owner && u.kind === 'captain' && u.hp <= 0 && archOf(s, u) === a);
      if (fallen) { fallen.hp = maxHp('captain', b.f); fallen.dead = 0; fallen.order = null; [fallen.x, fallen.y] = at; }
      else { const h = spawn(s, b.owner, 'captain', ...at); if (a !== p.arch) h.arch = a; }
    } else spawn(s, b.owner, what, ...at);
  }
}

function reinforce(s: State, u: Unit, dt: number) {
  if (!u.reinf) return;
  if (!canReinforce(s, u)) { u.reinf = false; return; }
  if (u.hit < 2) return; // под огнём пополняться нельзя
  u.rt += dt;
  const sq = UA_SQ[u.f!]?.[u.kind]; // отряд мода: боец по цене и времени мода
  if (u.rt < (sq?.time ?? REINFORCE_TIME)) return;
  const p = s.players[u.owner];
  if (pay(p, sq ? sq.cost : Math.round(REINFORCE_COST * ST(u).cost / 100))) { u.reinf = false; return; }
  u.rt = 0;
  const one = u.mh ?? ST(u).hp;
  if (u.hp < hpOf(u) - 1e-6) u.hp = Math.min(hpOf(u), u.hp + one); // вернуть павшего
  else { u.sz = u.mn = (u.mn ?? ST(u).n) + 1; u.mh = one; u.hp += one; } // новый боец сверх прежнего размера
}

// ---------- поиск пути: A* по той же сетке, что и постройки, вокруг скал и следов построек (на открытой карте — прямо) ----------
const CELL = BCELL;
type Grid = { w: number; h: number; b: Uint8Array; any: boolean };
let rocks: { blocks: typeof BLOCKS; b: Uint8Array[] } | null = null;
let gridCache: { s: State; tick: number; g: Grid[] } | null = null;
/** Запас от скал по размеру юнита (в клетках): крупному нужен проход шире — как классы проходимости в DoW. */
const sizeK = (u: Unit) => Math.min(3, Math.max(0, Math.round((ST(u).radius * 0.6 - 0.5) / CELL)));
function grid(s: State, owner: number, k = 0): Grid { // у каждого игрока своя: через свои ворота можно; k — запас от скал по размеру юнита
  if (!gridCache || gridCache.s !== s || gridCache.tick !== s.tick) gridCache = { s, tick: s.tick, g: [] };
  const key = owner * 4 + k;
  if (gridCache.g[key]) return gridCache.g[key];
  const w = Math.ceil(MAP.w / CELL), h = Math.ceil(MAP.h / CELL);
  if (!rocks || rocks.blocks !== BLOCKS) { // скалы не меняются: считаем раз на карту
    const b0 = new Uint8Array(w * h);
    for (let cy = 0; cy < h; cy++) for (let cx = 0; cx < w; cx++) if (blocked(cx * CELL + CELL / 2, cy * CELL + CELL / 2, 0.5)) b0[cy * w + cx] = 1;
    rocks = { blocks: BLOCKS, b: [b0] };
  }
  for (let i = rocks.b.length; i <= k; i++) { // расширяем скалы на клетку за шаг
    const p = rocks.b[i - 1], b = p.slice();
    for (let cy = 0; cy < h; cy++) for (let cx = 0; cx < w; cx++) if (p[cy * w + cx]) for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) { const nx = cx + dx, ny = cy + dy; if (nx >= 0 && ny >= 0 && nx < w && ny < h) b[ny * w + nx] = 1; }
    rocks.b.push(b);
  }
  const b = rocks.b[k].slice();
  for (const u of s.units) if (isStruct(u.kind) && u.hp > 0 && u.kind !== 'mine' && u.kind !== 'aegis' && !u.carry && !(u.kind === 'wallgate' && u.owner === owner)) { // след постройки закрывает свои клетки
    const f = footRect(u.kind, u.x, u.y);
    for (let cy = Math.max(0, f.y0 - k); cy < Math.min(h, f.y0 + f.n + k); cy++) for (let cx = Math.max(0, f.x0 - k); cx < Math.min(w, f.x0 + f.n + k); cx++) b[cy * w + cx] = 1;
  }
  return (gridCache.g[key] = { w, h, b, any: b.includes(1) });
}
const cellFree = (g: Grid, x: number, y: number) => { const cx = Math.floor(x / CELL), cy = Math.floor(y / CELL); return cx >= 0 && cy >= 0 && cx < g.w && cy < g.h && !g.b[cy * g.w + cx]; };
/** Прямая свободна: с w > 0 проверяется коридор шириной 2w — путь не прижимается к углам построек (иначе юнит цепляет угол и дёргается). */
function lineClear(g: Grid, ax: number, ay: number, bx: number, by: number, w = 0) {
  const L = Math.hypot(bx - ax, by - ay), n = Math.ceil(L * 2); // шаг 0,5 м: не перескакиваем угол клетки
  const nx = L > 1e-6 ? (-(by - ay) / L) * w : 0, ny = L > 1e-6 ? ((bx - ax) / L) * w : 0;
  for (let i = 1; i <= n; i++) {
    const x = ax + ((bx - ax) * i) / n, y = ay + ((by - ay) * i) / n;
    if (!cellFree(g, x, y) || (w && i < n && (!cellFree(g, x + nx, y + ny) || !cellFree(g, x - nx, y - ny)))) return false;
  }
  return true;
}
const PATH_W = 0.8;
function findPath(g: Grid, ax: number, ay: number, bx: number, by: number): { x: number; y: number }[] | null {
  const W = g.w, start = Math.floor(ay / CELL) * W + Math.floor(ax / CELL);
  let goal = Math.floor(by / CELL) * W + Math.floor(bx / CELL);
  if (g.b[goal]) { let best = -1, bd = 1e9; for (let i = 0; i < g.b.length; i++) if (!g.b[i]) { const d = Math.hypot((i % W) - (goal % W), Math.floor(i / W) - Math.floor(goal / W)); if (d < bd) { bd = d; best = i; } } goal = best; }
  const gs = new Float32Array(g.b.length).fill(Infinity), from = new Int32Array(g.b.length).fill(-1);
  const hh = (i: number) => Math.hypot((i % W) - (goal % W), Math.floor(i / W) - Math.floor(goal / W));
  const closed = new Uint8Array(g.b.length), open: [number, number][] = [[hh(start), start]]; gs[start] = 0;
  const push = (e: [number, number]) => { open.push(e); for (let i = open.length - 1, p = (i - 1) >> 1; i && open[p][0] > open[i][0]; i = p, p = (i - 1) >> 1) [open[p], open[i]] = [open[i], open[p]]; };
  const pop = () => { // двоичная куча по f; устаревшие записи отсекает closed
    const top = open[0], last = open.pop()!;
    if (open.length) { open[0] = last; for (let i = 0; ;) { const l = 2 * i + 1, r = l + 1; let m = i; if (l < open.length && open[l][0] < open[m][0]) m = l; if (r < open.length && open[r][0] < open[m][0]) m = r; if (m === i) break; [open[m], open[i]] = [open[i], open[m]]; i = m; } }
    return top[1];
  };
  while (open.length) {
    const c = pop();
    if (closed[c]) continue;
    if (c === goal) break;
    closed[c] = 1;
    const cx = c % W, cy = Math.floor(c / W);
    for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
      if (!dx && !dy) continue;
      const nx = cx + dx, ny = cy + dy, n = ny * W + nx;
      if (nx < 0 || ny < 0 || nx >= W || ny >= g.h || g.b[n] || closed[n]) continue;
      if (dx && dy && (g.b[cy * W + nx] || g.b[ny * W + cx])) continue; // не срезаем угол скалы
      const t = gs[c] + (dx && dy ? 1.414 : 1);
      if (t < gs[n]) { gs[n] = t; from[n] = c; push([t + hh(n) * 1.5, n]); } // взвешенная эвристика: путь чуть длиннее, перебор в разы меньше
    }
  }
  if (from[goal] < 0 && goal !== start) return null;
  const cells: number[] = []; for (let c = goal; c !== -1 && c !== start; c = from[c]) cells.unshift(c);
  const pts = cells.map(c => ({ x: (c % W) * CELL + CELL / 2, y: Math.floor(c / W) * CELL + CELL / 2 }));
  pts.push({ x: bx, y: by });
  const out: { x: number; y: number }[] = []; let cur = { x: ax, y: ay }; // срезаем лишние повороты
  for (let i = 0; i < pts.length; i++) { if (i + 1 < pts.length && lineClear(g, cur.x, cur.y, pts[i + 1].x, pts[i + 1].y, PATH_W)) continue; out.push(pts[i]); cur = pts[i]; }
  return out;
}

/** Ближайшая свободная клетка по спирали (до 24 клеток): цель в скале или в постройке — подходим к краю, а не упираемся в стену. */
function freeNear(g: Grid, x: number, y: number) {
  const cx = Math.floor(x / CELL), cy = Math.floor(y / CELL);
  for (let r = 1; r <= 24; r++) {
    let best: { x: number; y: number } | null = null, bd = Infinity;
    for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) {
      if (Math.max(Math.abs(dx), Math.abs(dy)) !== r) continue;
      const nx = cx + dx, ny = cy + dy;
      if (nx < 0 || ny < 0 || nx >= g.w || ny >= g.h || g.b[ny * g.w + nx]) continue;
      const px = nx * CELL + CELL / 2, py = ny * CELL + CELL / 2, d = Math.hypot(px - x, py - y);
      if (d < bd) { bd = d; best = { x: px, y: py }; }
    }
    if (best) return best;
  }
  return { x, y };
}
let budget = { s: null as State | null, tick: -1, n: 0 };
function go(s: State, u: Unit, x: number, y: number, dt: number) {
  const su = UA_SETUP[fac(s, u.owner)]?.[u.kind]; if (su) u.cd = Math.max(u.cd, su); // ствол с развёртыванием (setup_time мода): на ходу не стреляет, встал — ждёт развёртывания
  const g = grid(s, u.owner, sizeK(u));
  if (g.any && !flies(u.kind, fac(s, u.owner)) && !cellFree(g, x, y)) ({ x, y } = freeNear(g, x, y)); // цель в скале: к ближайшей свободной клетке
  if (g.any && !flies(u.kind, fac(s, u.owner)) && !lineClear(g, u.x, u.y, x, y, PATH_W)) { // путь загорожен: идём по точкам A*
    if (!u.path || Math.hypot(u.path.to.x - x, u.path.to.y - y) > 3 || s.tick - u.path.at > 60) {
      if (budget.s !== s || budget.tick !== s.tick) budget = { s, tick: s.tick, n: 0 };
      if (budget.n++ < 24) u.path = { to: { x, y }, at: s.tick, pts: findPath(g, u.x, u.y, x, y) ?? [] }; // ponytail: не больше 24 A* за тик, остальные идут по старому пути (поле потоков, если толпы вырастут)
    }
    while (u.path?.pts.length && Math.hypot(u.path.pts[0].x - u.x, u.path.pts[0].y - u.y) < 1.5) u.path.pts.shift();
    if (u.path?.pts.length) ({ x, y } = u.path.pts[0]);
  } else u.path = undefined;
  const dx = x - u.x, dy = y - u.y, d = Math.hypot(dx, dy);
  if (d < 1e-6) return;
  u.face = Math.atan2(dy, dx);
  const m = Math.min(ST(u).speed * u.sm * dt, d);
  u.x += (dx / d) * m; u.y += (dy / d) * m;
}

function act(s: State, u: Unit, dt: number, byId: Map<number, Unit>) {
  const st = ST(u);
  u.cd = Math.max(0, u.cd - dt); u.gcd = Math.max(0, u.gcd - dt);
  u.sm = speedMul(s, u);
  if (u.queue && u.queue.length > QUEUE_ORDERS) u.queue.length = QUEUE_ORDERS;
  if (!u.order && u.queue?.length) { u.order = u.queue.shift()!; if (!u.queue.length) u.queue = undefined; } // текущий выполнен — берём следующий из очереди
  if (MEGA.has(u.kind) && u.build >= 1 && (u.prog += dt) >= MEGA_SHOT.cd) { // дальний удар мегапостройки
    const foes = s.units.filter(v => v.owner !== u.owner && v.hp > 0 && s.players[v.owner]?.alive && dist(v, u) < MEGA_SHOT.range);
    let t: Unit | undefined, best = 0;
    for (const v of foes) { // ponytail: O(n²) раз в 20 с — бьём в самое плотное скопление, постройки весят вдвое
      let n = 0;
      for (const w of foes) if (dist(v, w) < MEGA_SHOT.aoe) n += isStruct(w.kind) ? 2 : 1;
      if (n > best) { best = n; t = v; }
    }
    if (t) {
      u.prog = 0;
      const tx = t.x, ty = t.y;
      for (const v of s.units) if (v.owner !== u.owner && v.hp > 0 && dist(v, { x: tx, y: ty }) < MEGA_SHOT.aoe + ST(v).radius) hurt(s, v, MEGA_SHOT.dmg * VS.blast[armorOf(v.kind, v.f)], u.owner);
      s.scans.push({ x: tx, y: ty, t: MEGA_SHOT.t, owner: u.owner });
      if (s.shots.length < 200) s.shots.push([u.x, u.y, tx, ty, 12], [tx, ty, tx, ty - 0.1, 8]);
    } else u.prog = MEGA_SHOT.cd;
  }
  if (u.kind === 'plague' && u.build >= 1 && s.tick % 20 === 0) for (const v of s.units) if (v.owner !== u.owner && v.hp > 0 && !isStruct(v.kind) && dist(v, u) < PLAGUE.r) hurt(s, v, hpOf(v) * PLAGUE.pct, u.owner); // Чумной шпиль: −1%/с
  if (u.kind === 'pyre' && u.build >= 1 && s.tick % 4 === 0) for (const v of s.units) if (v.owner !== u.owner && v.hp > 0 && !isStruct(v.kind) && dist(v, u) < PYRE.r) { hurt(s, v, PYRE.dps * dt * 4, u.owner); if (s.shots.length < 200 && Math.random() < 0.3) s.shots.push([u.x, u.y, v.x, v.y, FX.fire]); } // Огненная яма
  if (u.kind === 'titan' && u.order && s.tick % 4 === 0) for (const v of s.units) if (v.owner !== u.owner && !isStruct(v.kind) && armorOf(v.kind, v.f) === 'inf' && v.hp > 0 && dist(v, u) < STATS.titan.radius + 1) { hurt(s, v, 40, u.owner); } // шаг титана давит пехоту
  if (u.kind === 'nurgle' && u.hp > 0 && u.hp < hpOf(u)) u.hp = Math.min(hpOf(u), u.hp + hpOf(u) * 0.02 * dt); // гниль Нургла
  const mc = u.f && UA_MOR[u.f]?.[u.kind];
  if (mc) { // мораль как в UA: восстанавливается; надлом — не меньше minTime с и пока мораль ниже minMorale
    u.mor = Math.min(mc.max, (u.mor ?? mc.max) + mc.rate * dt);
    if (u.brk !== undefined && (u.brk += dt) >= mc.minTime && u.mor >= mc.minMorale) u.brk = undefined;
  }
  const regen = UA_REGEN[fac(s, u.owner)]?.[u.kind]; // у рас из модов — регенерация юнита из мода (HP/с на бойца)
  if (regen !== undefined) { const m = modsOf(s, u); if (u.hp < hpOf(u) && u.hit > 2) u.hp = Math.min(hpOf(u), u.hp + (regen * m.regen + m.regenAdd * UA_K.hp) * membersOf(u) * dt); }
  if (isStruct(u.kind) && u.build < 1) return; // стройка ещё не работает
  const o = u.order;
  if (o?.t === 'build') {
    const site = byId.get(o.id);
    if (site && site.hp > 0 && site.build >= 1 && site.hp < hpOf(site) - 1e-6 && site.owner === u.owner) { // ремонт постройки или техники
      if (dist(u, site) - ST(site).radius > 2) { go(s, u, site.x, site.y, dt); return; }
      const rate = Math.min(REPAIR.rate, hpOf(site) / Math.max(8, (ST(site).time || 20) * 1.5)) * (site.hit < REPAIR.combatDelay ? REPAIR.combatMul : 1) * modsOf(s, u).repair;
      const add = Math.min(rate * dt, hpOf(site) - site.hp);
      if (pay(s.players[u.owner], (add / hpOf(site)) * Math.max(40, ST(site).cost) * 0.5)) { u.order = null; return; } // ремонт стоит половину цены за полное восстановление
      site.hp += add; u.face = Math.atan2(site.y - u.y, site.x - u.x);
      if (s.tick % 10 === 0 && s.shots.length < 200) s.shots.push([u.x, u.y, site.x, site.y, 6]); // искры сварки
      return;
    }
    if (!site || site.hp <= 0 || site.build >= 1) { // стена: строитель переходит к следующему недостроенному сегменту рядом
      const next = s.units.filter(v => v.owner === u.owner && v.kind === 'wall' && v.build < 1 && v.hp > 0 && dist(v, u) < 12).sort((a, b) => dist(a, u) - dist(b, u))[0];
      u.order = next ? { t: 'build', id: next.id } : null;
      return;
    }
    if (dist(u, site) - ST(site).radius > 2) { go(s, u, site.x, site.y, dt); return; }
    const c = ST(site);
    const slow = (hasR(s, u.owner, 3) ? 1.2 : 1) * modsOf(s, u).build; // Свитки каменщиков +20%, construction_speed мода
    site.build = Math.min(1, site.build + (dt * slow) / c.time);
    site.hp = Math.min(c.hp, site.hp + (c.hp * dt) / c.time);
    return;
  }
  if (o?.t === 'throw') { // подойти на дальность броска и бросить
    const G = GEAR[o.g];
    if (dist(u, o) > G.range) { go(s, u, o.x, o.y, dt); return; }
    if (u.gcd > 0) return;
    u.face = Math.atan2(o.y - u.y, o.x - u.x);
    s.blasts.push({ x: o.x, y: o.y, t: 0.9, g: o.g, owner: u.owner });
    u.ch[o.g]--; u.gcd = G.cd; u.order = null;
    if (s.shots.length < 200) s.shots.push([u.x, u.y, o.x, o.y, 7]); // навесной бросок
    return;
  }
  if (o?.t === 'fire') { // огонь по земле: подойти на дальность и бить в точку
    const main = modOf(fac(s, u.owner), u.kind);
    const d = dist(u, o), r = st.range + (main?.range ?? 0) + (u.lvl > 1 ? (main?.up?.range ?? 0) + (LVL2.range[u.kind] ?? 0) : 0);
    if (d > r) { go(s, u, o.x, o.y, dt); return; }
    u.face = Math.atan2(o.y - u.y, o.x - u.x);
    if (u.cd > 0 || (MIN_RANGE[u.kind] ?? main?.minRange ?? 0) > d) return;
    u.cd = st.cd * (main?.cd ?? 1);
    const aoe = ROLES[u.kind]?.aoe ?? 2, type = main?.type ?? dmgOf(u.kind, fac(s, u.owner));
    const base = st.dmg * (multi(u) ? membersOf(u) : 1) * (main?.dmg ?? 1) * (u.lvl > 1 ? LVL2.dmg[u.kind] ?? 1 : 1) * dmgMul(s, u);
    for (const v of s.units) if (v.owner !== u.owner && v.hp > 0 && dist(v, o) < aoe + ST(v).radius) {
      const smoked = st.range > 4 && s.smoke.some(c => dist(c, v) < 6 || dist(c, u) < 6);
      hurt(s, v, base * (UA_VS[fac(s, u.owner)]?.[u.kind] || VS[type])[armorOf(v.kind, v.f)] * combatArmorMul(s, v) * (smoked ? 0.5 : 1), u.owner);
    }
    if (s.shots.length < 200) s.shots.push([u.x, u.y, o.x, o.y, attackFx(u.kind, fac(s, u.owner), u.q)]);
    return;
  }
  if (o?.t === 'move') { // как в DoW: на марше стреляют по тем, кто в досягаемости, но не останавливаются
    if (st.dmg > 0 && u.cd === 0 && (UA_SETUP[fac(s, u.owner)] ? !UA_SETUP[fac(s, u.owner)]![u.kind] : !SETUP.has(u.kind))) { const t = s.units.filter(v => v.owner !== u.owner && v.hp > 0 && s.players[v.owner].alive).sort((a, b) => dist(u, a) - dist(u, b))[0]; if (t) { moving = UA_MOVEACC[fac(s, u.owner)]?.[u.kind] ?? 1; shoot(s, u, t); moving = 1; } }
    const g = grid(s, u.owner, sizeK(u));
    if (g.any && !flies(u.kind, fac(s, u.owner)) && !cellFree(g, o.x, o.y)) ({ x: o.x, y: o.y } = freeNear(g, o.x, o.y)); // точка в скале (или юниту не пролезть) — встаём у края
    if (Math.hypot(o.x - u.x, o.y - u.y) < 0.6 + (g.any && !cellFree(g, o.x + ST(u).radius, o.y) || !cellFree(g, o.x - ST(u).radius, o.y) || !cellFree(g, o.x, o.y + ST(u).radius) || !cellFree(g, o.x, o.y - ST(u).radius) ? ST(u).radius * 1.2 : 0)) u.order = null; else go(s, u, o.x, o.y, dt); // у скалы крупного юнита выталкивает — считаем дошедшим по его размеру
    return;
  }
  if (st.dmg === 0) return; // строители не воюют
  let target: Unit | undefined;
  if (o?.t === 'attack') {
    target = byId.get(o.id);
    if (!target || target.hp <= 0) { u.order = null; target = undefined; }
  }
  if (!target) { // свободный юнит и attack-move сами ищут ближайшего врага
    const um = modOf(fac(s, u.owner), u.kind), rng = st.range + (um?.range ?? 0) + (u.lvl > 1 ? um?.up?.range ?? 0 : 0);
    const sight = sightOf(s.players[u.owner], u), spotting = rng > sight && u.kind !== 'turret'; // артиллерия бьёт дальше своего обзора — по целям, которые видят свои; биопушка чует сама
    let best: number = (spotting || u.kind === 'turret' ? Math.max(rng, sight) : sight) + (hasR(s, u.owner, 11) ? 4 : 0);
    for (const v of s.units) {
      if (v.owner === u.owner || v.hp <= 0 || !s.players[v.owner].alive) continue;
      if (spotting && dist(u, v) > sight && !spotted(s, u.owner, v)) continue;
      if ((MIN_RANGE[u.kind] ?? um?.minRange ?? 0) > dist(u, v) - ST(v).radius && !ST(u).speed) continue; // стационарная батарея не целится в мёртвую зону
      const d = dist(u, v) - ST(v).radius - (isStruct(v.kind) ? SIEGE_RANGE[u.kind] ?? 0 : 0); // по зданиям артиллерия достаёт дальше
      if (d < best) { best = d; target = v; }
    }
  }
  if (!target && u.ah && u.hit < 3 && (!o || o.t === 'amove')) { // ответный огонь: бьют того, кто стреляет из-за обзора (артиллерия, самолёты)
    const a = byId.get(u.ah);
    if (a && a.hp > 0 && a.owner !== u.owner && dist(u, a) < 60) target = a;
  }
  if (target) {
    u.face = Math.atan2(target.y - u.y, target.x - u.x);
    if (!shoot(s, u, target) && st.speed) go(s, u, target.x, target.y, dt);
    return;
  }
  if (u.order?.t === 'amove') {
    if (Math.hypot(u.order.x - u.x, u.order.y - u.y) < 0.6) u.order = null; else go(s, u, u.order.x, u.order.y, dt);
  }
}

/** ПВО: постройки и тяжёлое оружие сильнее по самолётам, самолёты слабее по зданиям. */
const aaMul = (u: Unit, t: Unit) => AIRCRAFT.has(t.kind) ? (isStruct(u.kind) ? AA.struct : u.kind === 'heavy' ? AA.heavy : 1) : u.kind === 'jet' && isStruct(t.kind) ? AA.jetVsStruct : 1;
/** Цель видна игроку: обзор его юнитов и построек или засвет. */
const spotted = (s: State, owner: number, v: Unit) => s.scans.some(c => c.owner === owner && dist(c, v) < (c.r ?? MEGA_SHOT.reveal))
  || s.units.some(o => o.owner === owner && o.hp > 0 && dist(o, v) < Math.max(sightOf(s.players[owner], o), 10));
/** Выстрел, если цель в досягаемости: false — далеко (или в мёртвой зоне), надо подойти. */
let moving = 1; // точность на ходу для текущего выстрела (UA_MOVEACC)
/** Удар по морали: у отряда без морали в моде (тираниды) — ничего; до нуля — надлом. */
function moraleHit(t: Unit, d: number) {
  const mc = t.f && UA_MOR[t.f]?.[t.kind];
  if (!mc || d <= 0 || t.hp <= 0) return;
  t.mor = (t.mor ?? mc.max) - d;
  if (t.mor <= 0) { t.mor = 0; t.brk ??= 0; }
}
function shoot(s: State, u: Unit, target: Unit): boolean {
  if (u.f && UA_UNARMED.has(`${u.f}/${u.kind}`) && !addonWeapon(u)) return true; // без аддона-ствола не стреляет (true — подходить некуда, здание)
  const st = ST(u), d = Math.max(0, dist(u, target) - ST(target).radius - (st.range < 5 ? ST(u).radius * 0.8 : 0)); // рукопашник бьёт от своего края: огромный Тригон достаёт соседа
  const melee = false; // ponytail: рукопашник игры (MELEE_GUARD) убран — у рас UA удар и дальность из ствола мода
  const mystic = false; // ponytail: сборки героя игры убраны (герой — как в UA), флаг остался в формулах ниже
  const deceiver = u.kind === 'deity' && archOf(s, u) !== 'assault'; // К'тан по сборке: Обманщик (золотой) жжёт звёздным огнём издалека, Несущий Ночь (штурм) косит в упор
  const tf = modOf(fac(s, u.owner), u.kind); // свой «движ» юнита или турели фракции
  const tooClose = (MIN_RANGE[u.kind] ?? tf?.minRange ?? 0) > d; // артиллерия и мортиры не бьют в упор
  const upR = (addonWeapon(u)?.range ?? 0) + (u.lvl > 1 ? (tf?.up?.range ?? 0) + (UA_UPG[fac(s, u.owner)]?.[u.kind]?.range ?? 0) : 0) + modsOf(s, u).range * UA_K.range; // дальность из исследований UA
  const uc = UA_CLOSE[fac(s, u.owner)]?.[u.kind];
  let near: { range: number; dmg: number; cd: number; type: DmgType; vs?: Record<Armor, number> } | undefined = uc ? (d <= uc.range ? uc : undefined) : CLOSE[u.kind] && !UA_VS[fac(s, u.owner)]?.[u.kind] && d <= CLOSE[u.kind]!.range ? CLOSE[u.kind] : undefined; // второе оружие вблизи: у рас UA — меч/когти мода по умолчанию
  if (near && (u.kind === 'heavy' || u.kind === 'hveh') && !tooClose && d <= st.range + (tf?.range ?? 0) + upR) {
    const armor = armorOf(target.kind, target.f), mainType = tf?.type ?? dmgOf(u.kind, fac(s, u.owner));
    const mainDps = st.dmg * (tf?.dmg ?? 1) * VS[mainType][armor] / (st.cd * (tf?.cd ?? 1));
    const closeDps = near.dmg * VS[near.type][armor] / near.cd;
    if (mainDps > closeDps) near = undefined; // бронецель не заставляет бросать противотанковый ствол ради пистолета
  }
  const main = near ? undefined : tf; // свойства основного ствола — не для второго оружия
  if (near || !tooClose && d <= (u.kind === 'post' && u.lvl >= 3 ? 12 : melee ? MELEE_GUARD.range : mystic ? 9 : deceiver ? 14 : st.range + (tf?.range ?? 0) + upR + (isStruct(target.kind) ? SIEGE_RANGE[u.kind] ?? 0 : 0)) + (u.lvl > 1 && !UA_UPG[fac(s, u.owner)]?.[u.kind] ? LVL2.range[u.kind] ?? 0 : 0) + ((u.kind === 'post' || u.kind === 'turret') && hasR(s, u.owner, 8) ? 3 : 0)) {
    if (u.cd === 0) {
      u.cd = near ? near.cd : melee ? MELEE_GUARD.cd : st.cd * (tf?.cd ?? 1) * (addonWeapon(u)?.cd ?? 1); // ствол аддона стреляет со своей перезарядкой
      const ua2 = armOf(u) ?? addonWeapon(u) ?? (u.lvl > 1 ? UA_UPG[fac(s, u.owner)]?.[u.kind] : undefined); // оружие UA: купленное бойцам или апгрейд турели
      const mult = (ua2 ? ua2.dmg : u.lvl > 1 ? LVL2.dmg[u.kind] ?? 1 : 1) * (main?.dmg ?? 1);
      const vs = (t: Unit) => ((!melee && st.range > 4 && s.smoke.some(c => dist(c, t) < 6 || dist(c, u) < 6)) ? 0.5 : 1)
        * (near?.vs || (!near && (ua2?.vs ?? UA_VS[fac(s, u.owner)]?.[u.kind])) || VS[near?.type ?? main?.type ?? (u.kind === 'turret' && u.lvl > 1 ? 'heavy' : dmgOf(u.kind, fac(s, u.owner)))])[armorOf(t.kind, t.f)];
      const base = (near ? near.dmg : u.kind === 'post' && u.lvl >= 3 ? 14 : melee ? MELEE_GUARD.dmg : st.dmg) * (multi(u) ? membersOf(u) : 1) * mult * (deceiver ? 0.7 : 1) * dmgMul(s, u) * moving * (u.brk !== undefined ? UA_MOR[u.f!]?.[u.kind]?.acc ?? 1 : 1); // надломлен — точность мода
      const damageFor = (t: Unit) => base * combatArmorMul(s, t) * vs(t) * aaMul(u, t) * (st.range < 5 ? modsOf(s, t).melee : 1);
      const dealt = damageFor(target);
      hurt(s, target, dealt, u.owner); target.ah = u.id;
      moraleHit(target, (UA_MDMG[fac(s, u.owner)]?.[u.kind] ?? 0) * (multi(u) ? membersOf(u) : 1) * moving);
      if (main?.leech) u.hp = Math.min(hpOf(u), u.hp + dealt * main.leech);
      if (main?.freeze && !isStruct(target.kind)) target.frozen = Math.max(target.frozen, main.freeze);
      if (main?.fire && s.plagues.length < 60) s.plagues.push({ x: target.x, y: target.y, t: FIRE.t, owner: u.owner, fire: true });
      const nade = u.kind === 'lveh' && u.lvl > 1; // Багги с гранатомётом
      const aoe = near ? undefined : (nade ? 3 : undefined) ?? (addonWeapon(u)?.aoe || undefined) ?? (UA_AOE[fac(s, u.owner)]?.[u.kind] !== undefined ? UA_AOE[fac(s, u.owner)]![u.kind] || undefined : ROLES[u.kind]?.aoe) ?? STRUCT_AOE[u.kind] ?? (tf?.aoe ? tf.aoe + (u.lvl > 1 ? tf.up?.aoe ?? 0 : 0) : undefined) ?? (mystic ? 3 : deceiver ? 4 : undefined);
      if (aoe) for (const v of s.units) if (v !== target && v.owner !== u.owner && v.hp > 0 && dist(v, target) < aoe) { hurt(s, v, damageFor(v) * 0.6, u.owner); } // взрыв по площади: защита каждого потерпевшего
      const pa = s.players[u.owner];
      if (u.kind === 'bomber' && s.shots.length < 200) s.shots.push([target.x, target.y, target.x + (aoe ?? 9), target.y, 18]); // мини-атомка: гриб радиусом взрыва
      if (s.shots.length < 200) s.shots.push([u.x, u.y, target.x, target.y, mystic ? FX.fire : deceiver ? FX.beam : nade ? 12 : attackFx(u.kind, fac(s, u.owner), u.q)]);
    }
    return true;
  }
  return false;
}

function separate(s: State) { // ponytail: O(n²) по парам, на сотнях юнитов ок; spatial hash если упрёмся
  const mob = s.units.filter(u => !isStruct(u.kind) && u.hp > 0);
  const structs = s.units.filter(u => isStruct(u.kind) && u.hp > 0);
  for (let i = 0; i < mob.length; i++) {
    const a = mob[i];
    for (let j = i + 1; j < mob.length; j++) {
      const b = mob[j], dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy), min = (ST(a).radius + ST(b).radius) * 0.8;
      if (d < min && d > 1e-3) { const p = ((min - d) * 0.5) / d; a.x -= dx * p; a.y -= dy * p; b.x += dx * p; b.y += dy * p; }
    }
    const r = ST(a).radius * 0.6, out = (bx: number, by: number, bw: number, bh: number) => { // из прямоугольника — к ближайшему краю
      if (a.x <= bx - r || a.x >= bx + bw + r || a.y <= by - r || a.y >= by + bh + r) return;
      const opts = [[bx - r - a.x, 0], [bx + bw + r - a.x, 0], [0, by - r - a.y], [0, by + bh + r - a.y]].sort((p, q) => Math.abs(p[0] + p[1]) - Math.abs(q[0] + q[1]))[0];
      a.x += opts[0]; a.y += opts[1];
    };
    if (!flies(a.kind, fac(s, a.owner))) {
      for (const h of structs) { // постройки — квадратные следы на сетке
        if (h.kind === 'mine' || h.kind === 'aegis' || (h.kind === 'wallgate' && h.owner === a.owner) || h.carry === a.id) continue;
        const f = footRect(h.kind, h.x, h.y);
        out(f.x0 * BCELL, f.y0 * BCELL, f.n * BCELL, f.n * BCELL);
      }
      for (const [bx, by, bw, bh] of BLOCKS) out(bx, by, bw, bh); // скалы
    }
    a.x = clamp(a.x, 0.5, MAP.w - 0.5); a.y = clamp(a.y, 0.5, MAP.h - 0.5);
  }
}

/** Уникальное сверхоружие фракций. */
function doomStrike(s: State, st: { x: number; y: number; owner: number }) {
  const f = s.players[st.owner]?.faction ?? 'inquisition', R = DOOM_R[f] ?? 16, boom = (x: number, y: number, r: number, dmg: number) => {
    for (const v of s.units) if (v.owner !== st.owner && v.hp > 0 && dist(v, { x, y }) < r + ST(v).radius) hurt(s, v, dmg * (1 - dist(v, { x, y }) / (r * 2)) * (isStruct(v.kind) ? DOOM.struct : 1), st.owner);
    if (s.shots.length < 200) s.shots.push([x, y, x + r, y, 18]); // x2 − x1 — радиус взрыва
  };
  if (f === 'tyranids') { boom(st.x, st.y, R, 800); s.plagues.push({ x: st.x, y: st.y, t: 20, owner: st.owner }); } // Варп-шторм: облако 20 с
  else boom(st.x, st.y, R, 3500); // Экстерминатус Инквизиции: залп с ударного крейсера
}

/** Кто что видит: id юнитов в обзоре своих войск и построек (туман войны считается на сервере). */
export function visibleTo(s: State, owner: number): Set<number> {
  const eyes = [...s.units.filter(u => u.owner === owner && u.hp > 0).map(u => ({ x: u.x, y: u.y, r: Math.max(sightOf(s.players[owner], u), isStruct(u.kind) ? SIGHT_STRUCT : 10) + (hasR(s, owner, 11) ? 4 : 0) })),
    ...s.points.filter(p => p.owner === owner).map(p => ({ x: p.x, y: p.y, r: SIGHT_STRUCT + (hasR(s, owner, 11) ? 4 : 0) })), // своя точка видит и без башни
    ...s.scans.filter(c => c.owner === owner).map(c => ({ x: c.x, y: c.y, r: c.r ?? MEGA_SHOT.reveal }))];
  const seen = new Set<number>();
  for (const u of s.units) {
    if (u.owner === owner || (eyes.some(e => (e.x - u.x) ** 2 + (e.y - u.y) ** 2 < (e.r + ST(u).radius) ** 2))) seen.add(u.id);
  }
  return seen;
}

function capture(s: State, dt: number) {
  for (const p of s.points) {
    const post = postAt(s, p);
    if (post && s.players[post.owner].alive) { p.owner = post.owner; p.prog = 0; p.by = -1; continue; } // пост удерживает точку
    const present = new Set<number>();
    for (const u of s.units) if (!isStruct(u.kind) && u.kind !== 'builder' && !VEHICLES.has(u.kind) && u.hp > 0 && dist(u, p) < POINT_R) present.add(u.owner); // как в DoW: строители и техника точки не берут
    const o = present.size === 1 ? [...present][0] : -1;
    if (o >= 0 && o !== p.owner) {
      if (p.by !== o) { p.by = o; p.prog = 0; }
      p.prog += dt / CAPTURE_TIME;
      if (p.prog >= 1) { p.owner = o; p.prog = 0; p.by = -1; gainXp(s, o, XP_CAPTURE, p); }
    } else if (p.prog > 0) {
      p.prog = Math.max(0, p.prog - dt / (CAPTURE_TIME * 2));
      if (p.prog === 0) p.by = -1;
    }
  }
}

function cleanup(s: State) {
  for (const u of s.units) if (u.kind === 'deity' && u.hp <= 0 && u.stand <= 0) { // гибель бога: капитан недоступен 5 минут
    u.kind = 'captain'; u.hp = 0; u.dead = -DEITY.deathLock;
  }
  for (const u of s.units) if (u.hp <= 0 && u.stand > 0) u.hp = 1; // Последний рубеж
  for (const u of s.units) { // опыт капитану за убийство
    if (u.hp > 0 || u.by < 0 || u.by === u.owner) continue; // by сбрасывается — награда один раз, и для павшего капитана тоже
    gainXp(s, u.by, isStruct(u.kind) ? (u.kind === 'wall' || u.kind === 'mine' ? 0 : XP_STRUCT) : XP_KILL[u.kind] ?? 0, u);
    const killer = s.players[u.by];
    if (killer && !isStruct(u.kind)) {
      ++killer.kills;
    }
    u.by = -1;
    if (u.hero && u.hero.abil & (1 << 2)) // Мученичество: у павшего героя
      for (const v of s.units) if (v.owner === u.owner && v !== u && !isStruct(v.kind) && v.hp > 0 && dist(v, u) < 12) v.hp = hpOf(v);
  }
  for (const u of s.units) {
    if (u.hp > 0 || isStruct(u.kind) || (u.kind === 'captain' && u.dead > 0)) continue;
    const o = s.players[u.owner];
    if (u.kind === 'legend') s.players.forEach((q, i) => { if (i !== u.owner && q.alive) q.energy += LEGEND_BOUNTY; }); // убийство легенды: энергия всем врагам
  }
  for (const u of s.units) if (u.hp <= 0 && u.kind !== 'captain') s.died.push(u.id);
  s.players.forEach((p, i) => { if (p.alive && !s.units.some(u => u.owner === i && PRODUCERS.has(u.kind) && u.hp > 0 && u.build >= 1)) p.alive = false; }); // проигрыш — когда пали штабы и все здания найма
  s.units = s.units.filter(u => s.players[u.owner].alive && (u.hp > 0 || u.kind === 'captain'));
  for (const p of s.points) if (p.owner >= 0 && !s.players[p.owner].alive) p.owner = -1;
  const alive = s.players.flatMap((p, i) => (p.alive ? [i] : []));
  if (alive.length <= 1) s.winner = alive.length ? alive[0] : -1;
}

const prodPct = (u: Unit) => u.q <= 0 || u.kind === 'legend' ? 0
  : u.q >= 1000 ? Math.floor((u.prog / (UA_RESEARCH[u.f!]?.[u.q - 1000]?.time ?? 1)) * 100)
  : u.q > 100 ? Math.floor((u.prog / UNLOCKS[u.q - 101].time) * 100)
  : /^key/.test(u.kind) && !u.que.length ? Math.floor((u.prog / researchCost(u.q - 1).time) * 100)
  : u.kind === 'gate' ? Math.floor((u.prog / SUMMON_TIME) * 100)
  : u.que[0] ? Math.floor((u.prog / statOf(u.que[0], u.f).time) * 100) : 0;

/** Компактный снимок для сети: целые числа вместо float, чтобы JSON был короче. */
export type Snap = { mo?: number[][]; ad?: number[][]; wu?: number[][]; sq?: number[][]; ur?: number[][]; d: number[]; ss: number[][]; mg: number[][]; tick: number; u: number[][]; p: number[][]; pl: number[][]; sh: number[][]; w: number | null; qk: Record<number, number[]>; sm: number[][]; ps: number[][]; sc?: number[][] };
/** Снимок для одного игрока: враги вне обзора вырезаны, выстрелы — только видимые концом или началом. */
export function snapshotFor(s: State, owner: number): Snap {
  const full = snapshot(s), seen = visibleTo(s, owner), near = (x: number, y: number) => s.units.some(u => u.owner === owner && u.hp > 0 && Math.hypot(u.x - x / 10, u.y - y / 10) < Math.max(sightOf(s.players[owner], u), 12)) || s.points.some(p => p.owner === owner && Math.hypot(p.x - x / 10, p.y - y / 10) < SIGHT_STRUCT);
  return { ...full, sc: s.scans.filter(c => c.owner === owner).map(c => [Math.round(c.x * 10), Math.round(c.y * 10), c.r ?? MEGA_SHOT.reveal]), u: full.u.filter(r => seen.has(r[0])), sq: full.sq?.filter(r => seen.has(r[0])), wu: full.wu?.filter(r => seen.has(r[0])), sh: full.sh.filter(v => near(v[0], v[1]) || near(v[2], v[3])), qk: Object.fromEntries(Object.entries(full.qk).filter(([id]) => s.units.some(u => u.id === Number(id) && u.owner === owner))) };
}
export function snapshot(s: State): Snap {
  return {
    d: [...s.died], mg: s.units.filter(u => MEGA.has(u.kind) && u.hp > 0).map(u => [u.id, Math.round(u.x * 10), Math.round(u.y * 10), KINDS.indexOf(u.kind), u.owner, Math.floor(u.build * 100)]), /* мегапостройки видят все */ ss: s.strikes.map(st => [Math.round(st.x * 10), Math.round(st.y * 10), Math.ceil(st.t), st.owner]),
    tick: s.tick,
    // [id, owner, kind, x*10, y*10, hp, face*100, очередь, стройка %, пополняется, уровень, апгрейд %, найм текущего %]
    u: s.units.map(u => [u.id, u.owner, KINDS.indexOf(u.kind), Math.round(u.x * 10), Math.round(u.y * 10), (u.hp > 0 ? Math.max(1, Math.round(u.hp)) : 0), Math.round(u.face * 100), u.q, Math.floor(u.build * 100), u.reinf ? 1 : 0, u.lvl, u.upg < 0 ? -1 : Math.floor((u.upg / (u.kind === 'hq' ? TIER_TIME : u.kind === 'post' ? 12 : upOf(u.f, u.kind)!.time)) * 100), prodPct(u), u.gear, ...u.ch, Math.ceil(u.gcd), Math.round(u.sh), Math.ceil(u.frozen * 10), u.carry, Math.ceil(u.rise * 10), u.off > 0 ? 1 : 0, u.kind === 'captain' && u.hp <= 0 ? Math.ceil(-u.dead) : 0, u.kind === 'captain' ? ARCHS.indexOf(archOf(s, u)) : -1, ...(u.hero ? [u.hero.lvl, Math.floor(u.hero.xp), u.hero.pts, u.hero.abil, ...u.hero.acd.map(Math.ceil)] : [])] /* 25+ у героя: уровень, опыт, очки, способности, перезарядки */), // 24 — архетип героя // 23 — секунд, пока павшего героя нельзя заказать // 18 щит, 19 заморозка, 20 тащит/тащат, 21 вознесение, 22 купол пробит
    ps: s.players.map(p => [Math.ceil(p.stopCd), p.unlock, Math.floor((p.doom / DOOM.charge) * 100), Math.ceil(p.scanCd)]), // 13 снаряжение, 14–16 заряды, 17 перезарядка броска
    qk: Object.fromEntries(s.units.filter(u => u.que.length).map(u => [u.id, u.que.map(k => KINDS.indexOf(k))])),
    sm: [...s.smoke.map(c => [Math.round(c.x * 10), Math.round(c.y * 10), Math.ceil(c.t)]), ...s.plagues.map(c => [Math.round(c.x * 10), Math.round(c.y * 10), Math.ceil(c.t), c.fire ? 2 : 1])],
    p: s.points.map(p => [p.owner, Math.round(p.prog * 100), p.by]),
    pl: s.players.map(p => [Math.floor(p.req), p.alive ? 1 : 0, p.tier, Math.floor(p.energy), Math.floor(p.relics), Math.floor(p.rage), Math.ceil(p.waagh), p.kills, p.research]),
    ur: s.players.map(p => p.ur ?? []), // изученное из UA_RESEARCH
    ad: s.units.filter(u => u.ad).map(u => [u.id, u.ad!]), // аддоны UA у зданий: [id, маска UA_ADDONS]
    wu: s.units.filter(u => u.hp > 0 && UA_ARM[u.f!]?.[u.kind]).map(u => [u.id, u.wq ?? -1, u.wq === undefined ? 0 : Math.floor((u.wt ?? 0) / UA_ARM[u.f!]![u.kind]!.opts[u.wq].time * 100), ...(u.wu ?? [])]), // стволы отрядов UA: ставится сейчас, %, куплено по вариантам
    mo: s.units.filter(u => u.hp > 0 && u.mor !== undefined && u.f && UA_MOR[u.f]?.[u.kind]).map(u => [u.id, Math.round(u.mor! / UA_MOR[u.f!]![u.kind]!.max * 100), u.brk !== undefined ? 1 : 0]), // мораль отрядов: %, надломлен
    sq: s.units.filter(u => u.hp > 0 && (u.mn !== undefined || UA_SQ[u.f!]?.[u.kind])).map(u => [u.id, u.mh ?? ST(u).hp, u.mn ?? ST(u).n, squadCap(s, u)]), // отряды: HP бойца, бойцов, предел пополнения
    sh: s.shots.map(v => v.map(n => Math.round(n * 10))),
    w: s.winner,
  };
}
