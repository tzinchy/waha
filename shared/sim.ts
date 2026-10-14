import { ARCH_OPTS, type FactionId } from './factions.ts';

// Вся игровая логика. Чистые функции без DOM и сети: сервер гонит step(), клиент только рисует snapshot().
import { MAP, HQ_POS, POINTS, RELICS, VENTS, BLOCKS, blocked, setMap, MAPS } from './mapdata.ts';
export { MAP, HQ_POS, POINTS, RELICS, VENTS, setMap, MAPS };
export const DT = 1 / 20;

/** Сборка капитана (пресет CaptainArchetypes): Штурм — рукопашная, Командор — ауры, Мистик — урон по площади и лечение. */
export type Arch = 'assault' | 'commander' | 'mystic';
export const ARCHS: Arch[] = ['assault', 'commander', 'mystic'];
export type CaptainCfg = { arch: Arch };
export type Kind = 'captain' | 'builder' | 'guard' | 'hq' | 'barracks' | 'post' | 'turret' | 'foundry' | 'pump' | 'key1' | 'key2' | 'key3' | 'key4' | 'gate' | 'legend' | 'wall' | 'wallgate' | 'bunker' | 'mine'
  | 'sniper' | 'heavy' | 'support' | 'elite' | 'healer' | 'lveh' | 'mveh' | 'hveh' | 'titan' | 'deity' | 'aegis' | 'rturret' | 'fturret' | 'arty' | 'battery' | 'pylon' | 'pyre' | 'bell' | 'doom' | 'lighthouse' | 'obelisk' | 'megagun' | 'plague' | 'motorpool' | 'yard';
export const KINDS: Kind[] = ['captain', 'builder', 'guard', 'hq', 'barracks', 'post', 'turret', 'foundry', 'pump', 'key1', 'key2', 'key3', 'key4', 'gate', 'legend', 'wall', 'wallgate', 'bunker', 'mine', 'sniper', 'heavy', 'support', 'elite', 'healer', 'lveh', 'mveh', 'hveh', 'titan', 'deity', 'aegis', 'rturret', 'fturret', 'arty', 'battery', 'pylon', 'pyre', 'bell', 'doom', 'lighthouse', 'obelisk', 'megagun', 'plague', 'motorpool', 'yard']; // новые — только в конец: индексы идут в снимки
const MOBILE = new Set<Kind>(['captain', 'builder', 'guard', 'legend', 'sniper', 'heavy', 'support', 'elite', 'healer', 'lveh', 'mveh', 'hveh', 'titan', 'deity', 'arty']);
export const isStruct = (k: Kind) => !MOBILE.has(k);
export type Buildable = 'hq' | 'barracks' | 'post' | 'turret' | 'foundry' | 'pump' | 'key1' | 'key2' | 'key3' | 'key4' | 'gate' | 'wall' | 'wallgate' | 'bunker' | 'mine' | 'aegis' | 'rturret' | 'fturret' | 'battery' | 'pylon' | 'pyre' | 'bell' | 'doom' | 'lighthouse' | 'obelisk' | 'megagun' | 'plague' | 'motorpool' | 'yard';

// hp: у отрядов хп ОДНОЙ модели (общий пул = hp * n), у остальных общий. dmg: урон одной модели.
type Stat = { hp: number; n: number; dmg: number; range: number; cd: number; speed: number; sight: number; radius: number; cost: number; time: number };
export const STATS: Record<Kind, Stat> = {
  captain: { hp: 800, n: 1, dmg: 20, range: 3.5, cd: 0.8, speed: 8, sight: 14, radius: 1, cost: 0, time: 0 },
  builder: { hp: 70, n: 2, dmg: 0, range: 0, cd: 1, speed: 7, sight: 0, radius: 1.1, cost: 30, time: 3 },
  guard: { hp: 100, n: 5, dmg: 3.2, range: 9, cd: 1, speed: 7, sight: 14, radius: 1.8, cost: 80, time: 6 },
  hq: { hp: 4000, n: 1, dmg: 14, range: 12, cd: 1.2, speed: 0, sight: 12, radius: 4.5, cost: 600, time: 60 },
  barracks: { hp: 1600, n: 1, dmg: 0, range: 0, cd: 1, speed: 0, sight: 0, radius: 3.2, cost: 150, time: 20 },
  post: { hp: 800, n: 1, dmg: 6, range: 10, cd: 1.5, speed: 0, sight: 10, radius: 1.4, cost: 50, time: 8 },
  turret: { hp: 700, n: 1, dmg: 12, range: 13, cd: 1.2, speed: 0, sight: 13, radius: 1.3, cost: 80, time: 10 },
  foundry: { hp: 900, n: 1, dmg: 0, range: 0, cd: 1, speed: 0, sight: 0, radius: 2.6, cost: 120, time: 15 }, // Литейня: энергия
  pump: { hp: 600, n: 1, dmg: 0, range: 0, cd: 1, speed: 0, sight: 0, radius: 1.6, cost: 100, time: 12 },     // Глубинный насос на жиле
  key1: { hp: 1500, n: 1, dmg: 0, range: 0, cd: 1, speed: 0, sight: 0, radius: 2.6, cost: 150, time: 20 },    // ключевые здания тиров I–IV
  key2: { hp: 1800, n: 1, dmg: 0, range: 0, cd: 1, speed: 0, sight: 0, radius: 2.8, cost: 250, time: 25 },
  motorpool: { hp: 2600, n: 1, dmg: 0, range: 0, cd: 1, speed: 0, sight: 10, radius: 3.4, cost: 300, time: 45 }, // техцех: вся техника
  yard: { hp: 5000, n: 1, dmg: 0, range: 0, cd: 1, speed: 0, sight: 12, radius: 5.5, cost: 1000, time: 120 },    // верфь титана
  key3: { hp: 2000, n: 1, dmg: 0, range: 0, cd: 1, speed: 0, sight: 0, radius: 2.8, cost: 350, time: 30 },
  key4: { hp: 2400, n: 1, dmg: 0, range: 0, cd: 1, speed: 0, sight: 0, radius: 3, cost: 450, time: 35 },
  gate: { hp: 3000, n: 1, dmg: 0, range: 0, cd: 1, speed: 0, sight: 0, radius: 3.6, cost: 500, time: 40 },    // Врата призыва, тир V
  legend: { hp: 3000, n: 1, dmg: 50, range: 5, cd: 1, speed: 8, sight: 16, radius: 1.4, cost: 0, time: 0 },
  // укрепления (пресет Fortifications)
  wall: { hp: 1200, n: 1, dmg: 0, range: 0, cd: 1, speed: 0, sight: 0, radius: 1.6, cost: 30, time: 4 },      // сегмент стены
  wallgate: { hp: 1800, n: 1, dmg: 0, range: 0, cd: 1, speed: 0, sight: 0, radius: 1.6, cost: 120, time: 10 }, // ворота: свои проходят
  bunker: { hp: 2500, n: 1, dmg: 0, range: 0, cd: 1, speed: 0, sight: 0, radius: 2.2, cost: 250, time: 18 },  // крипта: пехота рядом −50% урона
  mine: { hp: 60, n: 1, dmg: 180, range: 2, cd: 1, speed: 0, sight: 0, radius: 0.6, cost: 40, time: 3 },      // мина: невидима, 180 урона по 6 м
  // роли пехоты (пресет UnitRoles)
  sniper: { hp: 85, n: 2, dmg: 30, range: 22, cd: 3, speed: 6.5, sight: 24, radius: 1.4, cost: 90, time: 10 },
  heavy: { hp: 110, n: 3, dmg: 16, range: 17, cd: 2.2, speed: 5, sight: 18, radius: 1.8, cost: 120, time: 12 },
  support: { hp: 95, n: 2, dmg: 4, range: 9, cd: 1, speed: 7, sight: 14, radius: 1.5, cost: 80, time: 8 },
  elite: { hp: 260, n: 3, dmg: 15, range: 2.6, cd: 1.1, speed: 6, sight: 14, radius: 2, cost: 200, time: 16 },
  healer: { hp: 700, n: 1, dmg: 6, range: 6, cd: 1, speed: 8, sight: 16, radius: 1.4, cost: 170, time: 18 },
  // техника (пресет Vehicles) и титаны (пресет Titans)
  lveh: { hp: 700, n: 1, dmg: 9, range: 12, cd: 0.6, speed: 12, sight: 18, radius: 2.2, cost: 100, time: 14 },
  mveh: { hp: 1200, n: 1, dmg: 10, range: 14, cd: 0.5, speed: 7, sight: 16, radius: 2.7, cost: 130, time: 18 },
  hveh: { hp: 2600, n: 1, dmg: 95, range: 20, cd: 3, speed: 5, sight: 22, radius: 3, cost: 180, time: 24 },
  titan: { hp: 15000, n: 1, dmg: 280, range: 26, cd: 3, speed: 3.2, sight: 30, radius: 5, cost: 3000, time: 240 }, // титан: 3000 влияния, 5000 энергии, 15 реликвий, 4 минуты
  // особые механики фракций (пресет FactionSpecials)
  deity: { hp: 4200, n: 1, dmg: 95, range: 6, cd: 1, speed: 9, sight: 22, radius: 2.2, cost: 0, time: 0 },        // Бог-Механизм Династий
  aegis: { hp: 700, n: 1, dmg: 0, range: 0, cd: 1, speed: 0, sight: 0, radius: 1.3, cost: 150, time: 14 },        // Купол-эгида Консенсуса
  rturret: { hp: 600, n: 1, dmg: 26, range: 16, cd: 3, speed: 0, sight: 16, radius: 1.3, cost: 110, time: 12 },   // Ракетная бочка Орды
  // артиллерия (техника всех фракций) и уникальные постройки Ордена, Нежити, Династий, Синклита
  arty: { hp: 900, n: 1, dmg: 130, range: 45, cd: 4.5, speed: 4, sight: 18, radius: 2.6, cost: 200, time: 28 },
  battery: { hp: 1400, n: 1, dmg: 150, range: 40, cd: 5, speed: 0, sight: 20, radius: 2, cost: 200, time: 20 },   // Орган-батарея Ордена
  pylon: { hp: 1200, n: 1, dmg: 70, range: 30, cd: 2.4, speed: 0, sight: 30, radius: 1.6, cost: 180, time: 18 },    // Гаусс-пилон Династий
  pyre: { hp: 1000, n: 1, dmg: 0, range: 0, cd: 1, speed: 0, sight: 10, radius: 1.8, cost: 150, time: 14 },         // Огненная яма Синклита: жжёт всё вокруг
  bell: { hp: 1100, n: 1, dmg: 0, range: 0, cd: 1, speed: 0, sight: 16, radius: 1.6, cost: 160, time: 16 },         // Колокол Скорби Нежити
  // сверхоружие (тир V) и мегапостройки обороны (тир IV)
  doom: { hp: 3500, n: 1, dmg: 0, range: 0, cd: 1, speed: 0, sight: 12, radius: 3, cost: 3000, time: 240 },
  lighthouse: { hp: 3000, n: 1, dmg: 0, range: 0, cd: 1, speed: 0, sight: 70, radius: 2.4, cost: 1200, time: 150 },  // Великий Маяк Ордена: видит 70 м
  obelisk: { hp: 4000, n: 1, dmg: 220, range: 40, cd: 3, speed: 0, sight: 40, radius: 3, cost: 1400, time: 150 },    // Обелиск Вечности Династий
  megagun: { hp: 3500, n: 1, dmg: 180, range: 38, cd: 4, speed: 0, sight: 30, radius: 3, cost: 1300, time: 150 },    // Мега-Пушка Орды
  plague: { hp: 3000, n: 1, dmg: 0, range: 0, cd: 1, speed: 0, sight: 30, radius: 2.4, cost: 1100, time: 150 },       // Чумной шпиль Нежити
  fturret: { hp: 700, n: 1, dmg: 9, range: 6, cd: 0.4, speed: 0, sight: 8, radius: 1.3, cost: 90, time: 10 },     // Огнемётная печь Орды
};
/** Артиллерия не стреляет в упор (мёртвая зона), уникальные постройки: радиусы аур. */
export const MIN_RANGE: Partial<Record<Kind, number>> = { arty: 10, battery: 8, megagun: 8 };
/** Сверхоружие: заряд 3 минуты, предупреждение 6 с всем игрокам, 2500 урона по 16 м (своих тоже). */
export const DOOM = { charge: 180, warn: 6, r: 16, energy: 1500, relics: 6 }; // r — радиус предупреждения; урон у каждой фракции свой (doomStrike)
/** Открытия в ключевом здании тира IV: мегапостройки обороны и сверхоружие (дорого). */
export const UNLOCKS = [
  { name: 'Мегапостройки', info: 'открывает мегапостройку обороны фракции', cost: 1500, energy: 1200, relics: 5, time: 90, tier: 4 },
  { name: 'Сверхоружие', info: 'открывает сверхоружие фракции', cost: 3000, energy: 3000, relics: 12, time: 120, tier: 5 },
];
export const DOOM_SHOT = 800;
/** Пожар от зажигательного снаряда: радиус, урон в секунду (и по зданиям), длительность. */
export const FIRE = { r: 4, dps: 25, t: 6 };
export const MEGA = new Set<Kind>(['lighthouse', 'obelisk', 'megagun', 'plague', 'doom']);
export const LIGHTHOUSE = { r: 25, armor: 0.85 }, PLAGUE = { r: 30, pct: 0.01 };
export const PYRE = { r: 8, dps: 18 }, BELL = { r: 14, dmg: 0.8, speed: 0.8 };
export const AEGIS = { pool: 1200, r: 12, regen: 1200 / 30, broken: 10 };   // щит купола: 1200 урона, полностью за 30 с, после пробоя 10 с не работает
export const DRONE_SHIELD = 300;                                              // личный щит отряда от щитового дрона
export const DEITY = { energy: 600, lvl: 10, tier: 4, stop: 12, stopTime: 3, stopCd: 45, deathLock: 300, rise: 4 };
export const ARCHANGEL_REVIVE = 60;
/** Победные очки: держишь меньше точек, чем враг, — твои очки тают; критическая точка (центр) считается за две. */
export const VP_START = 500;
export const VP_RATE = 0.5; // очков в секунду за каждую точку перевеса противника (перевес в 3 точки ≈ 5.5 минуты до поражения)
/** Туман войны: радиус обзора по умолчанию у построек и юнитов без своего обзора. */
export const SIGHT_STRUCT = 12;
/** Захват точки отрядом, секунд (без поста); прогресс без отряда спадает вдвое медленнее. */
export const CAPTURE_TIME = 12;

// ---------- состав армии: откуда, с какого тира, сколько Легиона, броня и тип урона ----------
export type Armor = 'inf' | 'hinf' | 'light' | 'veh' | 'titan' | 'struct'; // light — лёгкая техника: стрелковое оружие её царапает
export type DmgType = 'small' | 'sniper' | 'heavy' | 'melee' | 'blast';
export type Role = { from: Kind; tier: number; pop: number; armor: Armor; dmg: DmgType; energy?: number; relics?: number; aoe?: number; heal?: number; meters: number; one?: boolean };
export const ROLES: Partial<Record<Kind, Role>> = {
  builder: { from: 'hq', tier: 1, pop: 0, armor: 'inf', dmg: 'small', energy: 10, meters: 1.8 },
  guard: { from: 'barracks', tier: 1, pop: 2, armor: 'inf', dmg: 'small', energy: 35, meters: 2.4 },
  sniper: { from: 'barracks', tier: 2, pop: 2, armor: 'inf', dmg: 'sniper', energy: 60, meters: 2.3 },
  heavy: { from: 'barracks', tier: 2, pop: 3, armor: 'inf', dmg: 'heavy', energy: 90, meters: 2.6 },
  support: { from: 'barracks', tier: 2, pop: 2, armor: 'inf', dmg: 'small', energy: 50, meters: 2.2 },
  elite: { from: 'barracks', tier: 3, pop: 4, armor: 'hinf', dmg: 'melee', energy: 120, meters: 3.1 },
  healer: { from: 'barracks', tier: 3, pop: 4, armor: 'hinf', dmg: 'small', energy: 140, heal: 0.05, meters: 3.4 },
  lveh: { from: 'motorpool', tier: 3, pop: 4, armor: 'light', dmg: 'small', energy: 70, meters: 4.5 },
  mveh: { from: 'motorpool', tier: 3, pop: 6, armor: 'veh', dmg: 'small', energy: 160, aoe: 3, meters: 6 },
  hveh: { from: 'motorpool', tier: 3, pop: 8, armor: 'veh', dmg: 'heavy', energy: 260, aoe: 2.5, meters: 8 },
  arty: { from: 'motorpool', tier: 3, pop: 6, armor: 'veh', dmg: 'blast', energy: 200, aoe: 5, meters: 6 },
  titan: { from: 'yard', tier: 4, pop: 20, armor: 'titan', dmg: 'blast', energy: 5000, relics: 15, aoe: 7, meters: 34, one: true },
};
/** Урон по броне (как в DoW/WH40k): болтеры и пулемёты почти не пробивают технику, снайпер косит пехоту, противотанковое — технику, взрывчатка — здания. */
export const VS: Record<DmgType, Record<Armor, number>> = {
  small: { inf: 1, hinf: 0.7, light: 0.35, veh: 0.04, titan: 0.01, struct: 0.15 },
  sniper: { inf: 1.8, hinf: 0.8, light: 0.1, veh: 0.02, titan: 0.01, struct: 0.05 },
  heavy: { inf: 0.4, hinf: 1.1, light: 1.3, veh: 1.2, titan: 1, struct: 1.2 },
  melee: { inf: 1.1, hinf: 1, light: 0.6, veh: 0.3, titan: 0.15, struct: 0.4 },
  blast: { inf: 1.3, hinf: 0.9, light: 0.9, veh: 0.7, titan: 0.5, struct: 1.6 },
};
/** Тяжёлое оружие пехоты: у Орды пулемёты-шуты, у Синклита огнемёты — это против пехоты, не против брони. */
const HEAVY_SMALL = new Set<FactionId>(['orks', 'ashen']);
const STRUCT_DMG: Partial<Record<Kind, DmgType>> = { rturret: 'blast', battery: 'blast', pylon: 'heavy', obelisk: 'heavy', megagun: 'blast' };
export const STRUCT_AOE: Partial<Record<Kind, number>> = { rturret: 3, battery: 4, megagun: 6 };
export const armorOf = (k: Kind): Armor => (isStruct(k) ? 'struct' : ROLES[k]?.armor ?? (k === 'legend' || k === 'captain' ? 'hinf' : 'inf'));
export const dmgOf = (k: Kind, f: FactionId): DmgType => (k === 'guard' && isMelee('guard', f)) || k === 'captain' || k === 'legend' || k === 'deity' ? 'melee' : k === 'heavy' && HEAVY_SMALL.has(f) ? 'small' : ROLES[k]?.dmg ?? STRUCT_DMG[k] ?? 'small';
export const LEGION_CAP = 40, MOTOR_CAP = 30; // пехота и техника считаются отдельно
export const SQUADS = new Set<Kind>(['guard', 'sniper', 'heavy', 'support', 'elite']); // пополняются бойцами
export const VEHICLES = new Set<Kind>(['lveh', 'mveh', 'hveh', 'titan']);          // не лечатся — их чинят строители
/** Снаряжение отряда (пресет SquadWargear): 0 — граната, 1 — заряд против техники и зданий, 2 — дым. */
export const GEAR = [
  { name: 'Граната', range: 18, r: 4, dmg: 80, charges: 3, cd: 25, cost: 40, energy: 0 },
  { name: 'Подрывной заряд', range: 8, r: 3, dmg: 240, charges: 1, cd: 40, cost: 60, energy: 30 },
  { name: 'Дым', range: 16, r: 6, dmg: 0, charges: 2, cd: 30, cost: 30, energy: 0 },
];
export const SMOKE_TIME = 12;
export const producible = (b: Kind) => (Object.keys(ROLES) as Kind[]).filter(k => ROLES[k]!.from === b);
export const TURRET_CAP = 12;
/** Постройки держат удар: пехота и капитаны наносят им 40% урона (как в DoW — здания ломают техникой и тяжёлым оружием). */
export const STRUCT_ARMOR = 0.4;
export const WALL_STEP = 2.4;
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
  4: { cost: 0, energy: 1000, relics: 6, key: 'key4', seal: true },
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
  'лимит Легиона +2', 'капитан и легенды получают −20% урона', '+1 реликвия раз в 120 с', 'открывает тир V',
];
export const researchCost = (i: number) => ({ cost: 100 * (Math.floor(i / 4) + 1), energy: 50 * (Math.floor(i / 4) + 1), time: 20 });
export const LEGEND_COST = [{ relics: 3, energy: 400 }, { relics: 4, energy: 300 }, { relics: 5, energy: 500 }];
export const SUMMON_TIME = 20;

/** Тип атаки = форма следа (пресет AttackVFX): 0 пуля, 1 рубящий, 2 когти, 3 луч, 4 огонь, 5 укол. */
/** 6 сварка, 7 бросок, 8 взрыв гранаты, 9 дым, 10 снайпер, 11 тяжёлое орудие, 12 снаряд осады, 13 титан, 14 очередь. */
export const FX = { shot: 0, chop: 1, claws: 2, beam: 3, fire: 4, thrust: 5 } as const;
const GUARD_FX: Record<FactionId, number> = { order: FX.shot, undead: FX.thrust, prism: FX.beam, clockwork: FX.beam, orks: FX.chop, ashen: FX.fire }; // Вечные — изумрудные распылители, Отступники — адострелы
/** Рукопашные: капитаны, легенды-бойцы, пехота Орды, Нежити и Синклита. */
export const isMelee = (k: Kind, f: FactionId) => k === 'captain' || (k === 'guard' && (f === 'undead' || f === 'orks'));
export function attackFx(k: Kind, f: FactionId, variant = 0) {
  if (k === 'guard') return GUARD_FX[f];
  if (k === 'captain') return f === 'ashen' || f === 'orks' ? FX.claws : FX.chop; // мистика переопределяет act
  if (k === 'legend') return variant === 2 ? FX.fire : variant === 1 ? FX.chop : FX.beam;
  if (k === 'titan' && f === 'clockwork') return 20; // Монолит: изумрудный разряд с ветвящимися молниями
  if (k === 'titan' && f === 'orks') return 12; // Топтун лупит снарядами из брюха и многоствольника
  if (k === 'turret' && f === 'ashen') return 19; // идол Синклита плюётся огненными шарами
  if (k === 'sniper' && f === 'ashen') return FX.fire; // Колдун Пепла: огненный сгусток
  if (k === 'elite') return f === 'prism' || f === 'clockwork' ? FX.chop : f === 'order' ? FX.thrust : FX.claws; // Склеповая стража — булавы, Осколочная стража — клинки
  return ({ obelisk: 3, megagun: 12, arty: 12, battery: 12, pylon: 3, rturret: 12, fturret: FX.fire, deity: FX.chop, sniper: 10, heavy: 11, hveh: 12, titan: 13, mveh: f === 'ashen' || f === 'orks' ? FX.fire : 14, lveh: 14 } as Partial<Record<Kind, number>>)[k] ?? FX.shot;
}
/** Рукопашная пехота: дальность в упор, бьёт сильнее и реже, бегает быстрее. */
const MELEE_GUARD = { range: 1.4, dmg: 6, cd: 1.3, speed: 8.6 };

// ---------- капитан: опыт, уровни 1–10 и дерево способностей (CaptainLevelUp, CaptainAbilities) ----------
export const XP_KILL: Partial<Record<Kind, number>> = { arty: 60, deity: 300, builder: 5, guard: 20, sniper: 20, heavy: 25, support: 15, elite: 45, healer: 45, lveh: 40, mveh: 60, hveh: 90, captain: 40, legend: 200, titan: 300 };
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
export function canLearn(p: Player, a: number) {
  const t = a % 3, g = ABIL_GATE[t];
  if (p.abil & (1 << a)) return 'Уже изучено';
  if (p.pts <= 0) return 'Нет очков';
  if (p.clvl < g.lvl || p.tier < g.tier) return `Нужен уровень ${g.lvl} и тир ${g.tier}`;
  if (t > 0 && !(p.abil & (1 << (a - 1)))) return 'Сначала предыдущая способность ветки';
}
/** Рядом со своим капитаном нужной сборки (аура Командора — 12 м). */
/** Архетип героя: у призванного — свой, у первого капитана — выбранный в лобби. */
export const archOf = (s: State, u: Unit): Arch => u.arch ?? s.players[u.owner].arch;
const nearArch = (s: State, u: Unit, a: Arch) => s.units.some(c => c.owner === u.owner && c.kind === 'captain' && c.hp > 0 && archOf(s, c) === a && dist(c, u) < 12);
/** Второй герой (другой архетип фракции) — с тира III из ячейки героя. */
export const HERO = { cost: 400, energy: 250, relics: 2, tier: 3 };
const capOf = (s: State, owner: number) => s.units.find(u => u.owner === owner && (u.kind === 'captain' || u.kind === 'deity'));
/** Летают: Бог-Механизм и Архангел Ордена — здания их не останавливают. */
export const flies = (k: Kind, f: FactionId) => k === 'deity' || (k === 'healer' && f === 'order');
function gainXp(s: State, owner: number, xp: number) {
  const p = s.players[owner];
  if (!p || p.clvl >= MAX_LVL) return;
  p.xp += xp;
  while (p.clvl < MAX_LVL && p.xp >= xpNeed(p.clvl)) { p.xp -= xpNeed(p.clvl); p.clvl++; p.pts++; }
}
const nearCapWith = (s: State, u: Unit, a: number, r: number) => {
  const p = s.players[u.owner];
  if (!(p.abil & (1 << a))) return false;
  const c = capOf(s, u.owner);
  return !!c && c.hp > 0 && dist(c, u) < r;
};
/** Три ресурса пресета: Влияние (req, с точек), Энергия (с Литейни и насосов), Реликвии (с реликтовых точек). */
export const ENERGY_COST: Partial<Record<Kind, number>> = { motorpool: 150, yard: 800, turret: 30, aegis: 100, rturret: 20, battery: 150, pylon: 120, pyre: 60, bell: 60, doom: 3000, lighthouse: 800, obelisk: 1200, megagun: 800, plague: 800 };
export const ENERGY_INCOME: Partial<Record<Kind, number>> = { hq: 1, foundry: 2, pump: 4 };
export const RELIC_RATE = 1 / 20; // реликвий в секунду с одной реликтовой точки
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
  captain: { cost: 0, energy: 0, relics: 2, time: 5, tier: 1, name: 'Реликвийный доспех' },
  lveh: { cost: 60, energy: 40, relics: 0, time: 8, tier: 3, name: 'Гранатомёт' }, // только Багги Орды: выстрел по площади 3 м
};
const LVL2 = { dmg: { post: 1, turret: 1.8, guard: 1.6, captain: 1.5 } as Partial<Record<Kind, number>>, armor: { post: 1, turret: 0.6, guard: 0.8, captain: 0.7, wall: 0.5, wallgate: 0.5 } as Partial<Record<Kind, number>>, range: { post: 0, turret: 3 } as Partial<Record<Kind, number>> };
export const BUILD_TIER: Record<Buildable, number> = { hq: 2, barracks: 1, post: 1, turret: 1, foundry: 1, pump: 1, key1: 1, key2: 2, key3: 3, key4: 4, gate: 5, motorpool: 3, yard: 4, wall: 1, wallgate: 1, bunker: 2, mine: 1, aegis: 2, rturret: 1, fturret: 1, battery: 2, pylon: 2, pyre: 2, bell: 2, doom: 5, lighthouse: 4, obelisk: 4, megagun: 4, plague: 4 };
/** Постройки только своей фракции. */
export const FACTION_ONLY: Partial<Record<Buildable, FactionId>> = { aegis: 'prism', rturret: 'orks', fturret: 'orks', battery: 'order', bell: 'undead', pylon: 'clockwork', pyre: 'ashen', lighthouse: 'order', obelisk: 'clockwork', megagun: 'orks', plague: 'undead' };
export const maxHp = (k: Kind) => STATS[k].hp * STATS[k].n;
/** Сколько моделей показывать: хп пула / хп одной модели, округлено вверх. */
export const members = (k: Kind, hp: number) => (hp <= 0 ? 0 : Math.min(STATS[k].n, Math.ceil(hp / STATS[k].hp - 1e-6)));

export const REINFORCE_COST = 18; // за порцию в одну модель
export const REINFORCE_TIME = 1.2;
export const CAP = { builder: 4, guard: 8 };
export const QUEUE_MAX = 5;
export const CAPTAIN_RESPAWN = 15;
export const START_REQ = 300, START_ENERGY = 100, BASE_INCOME = 2; // влияние в секунду от штаба без точек
export const POINT_R = 6;
export const MAX_PLAYERS = 4; // у карты может быть меньше: MAPS[i].hq.length

export type Order =
  | { t: 'move'; x: number; y: number }
  | { t: 'amove'; x: number; y: number }
  | { t: 'attack'; id: number }
  | { t: 'build'; id: number }
  | { t: 'throw'; g: number; x: number; y: number };
export type Unit = {
  id: number; owner: number; kind: Kind; x: number; y: number; hp: number; face: number;
  cd: number; order: Order | null;
  q: number; prog: number;      // счётчик: исследование/призыв; у найма — длина que
  que: Kind[];                  // очередь найма (штаб, казармы, кузня)
  paid: number[][];             // что списано за каждое место очереди: [влияние, энергия, реликвии, останки] — возврат при отмене
  arch?: Arch;                  // архетип призванного героя (у первого капитана — из лобби)
  gear: number; ch: number[]; gcd: number; // снаряжение отряда: биты купленного, заряды, перезарядка броска
  sh: number; off: number;      // щит: личный (дрон) или пул купола-эгиды; off — купол пробит, секунд до включения
  frozen: number;               // Остановка времени: секунд неподвижности
  mark: number;                 // Сеть наведения Консенсуса: секунд метки
  carry: number;                // Орда: id турели, которую тащит отряд (0 — нет); у турели — id несущего
  rise: number;                 // Вознесение: секунд до появления Бога-Механизма
  build: number;                // 0..1, готовность постройки (у юнитов всегда 1)
  dead: number;                 // таймер возрождения капитана
  by: number;                   // кто ударил последним (опыт за убийство)
  rush: number; stand: number;  // Рывок и Последний рубеж: оставшиеся секунды
  reinf: boolean; rt: number;   // идёт пополнение отряда
  hit: number;                  // секунд с последнего урона (пополнять под огнём нельзя)
  lvl: number; upg: number;     // уровень и прогресс апгрейда в секундах (-1: нет)
  sm: number;                   // множитель скорости фракции на этот тик
  path?: { to: { x: number; y: number }; at: number; pts: { x: number; y: number }[] }; // маршрут в обход препятствий (не уходит в снимок)
};
export type Point = { x: number; y: number; owner: number; prog: number; by: number; relic?: boolean };
export type Player = {
  req: number; energy: number; relics: number; alive: boolean; tier: number;
  faction: FactionId; arch: Arch; rage: number; waagh: number; remains: number; // ярость и ВААГХ Орды, останки Нежити
  research: number;                  // битовая маска изученного (RESEARCH)
  unlock: number;                    // открытия: 1 — мегапостройки, 2 — сверхоружие
  xp: number; clvl: number; pts: number; abil: number; acd: number[]; // капитан: опыт, уровень, очки, способности и их перезарядка
  stopCd: number; revive: number; // перезарядка Остановки времени, таймер воскрешения Архангела
};
export type State = {
  tick: number; units: Unit[]; points: Point[]; players: Player[]; nextId: number;
  winner: number | null; shots: number[][];
  dev?: boolean; // разработка: разрешён чит
  vp: number[];  // победные очки (пресет CapturePoint)
  died: number[]; // кто погиб с прошлого снимка (чтобы отличать смерть от ухода в туман)
  rewind: { owner: number; x: number; y: number; t: number }[]; // Перезавод Династий: отряды, которые встанут
  blasts: { x: number; y: number; t: number; g: number; owner: number }[]; // летящие гранаты
  strikes: { x: number; y: number; t: number; owner: number }[];          // удары сверхоружия: предупреждение всем
  plagues: { x: number; y: number; t: number; owner: number; fire?: boolean }[]; // чумные облака Колокола Конца и пожары зажигательных снарядов
  smoke: { x: number; y: number; t: number }[];
};
export type Cmd =
  | { c: 'move' | 'amove'; ids: number[]; x: number; y: number }
  | { c: 'attack'; ids: number[]; id: number }
  | { c: 'stop'; ids: number[] }
  | { c: 'train'; id: number; k?: Kind }
  | { c: 'cancel'; id: number; i: number }
  | { c: 'hero'; a: Arch }
  | { c: 'build'; ids: number[]; kind: Buildable; x: number; y: number }
  | { c: 'assist'; ids: number[]; id: number }
  | { c: 'reinforce'; ids: number[] }
  | { c: 'upgrade'; id: number }
  | { c: 'research'; id: number; r: number }
  | { c: 'summon'; id: number; v: number }
  | { c: 'wall'; ids: number[]; x1: number; y1: number; x2: number; y2: number }
  | { c: 'gear'; ids: number[]; g: number }
  | { c: 'throw'; ids: number[]; g: number; x: number; y: number }
  | { c: 'cheat' }
  | { c: 'ascend' }
  | { c: 'timestop' }
  | { c: 'drag'; ids: number[]; id: number }
  | { c: 'sacrifice'; ids: number[] }
  | { c: 'strike'; id: number; x: number; y: number }
  | { c: 'unlock'; id: number; u: number }
  | { c: 'learn'; a: number }
  | { c: 'ability'; a: number };

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const dist = (a: { x: number; y: number }, b: { x: number; y: number }) => Math.hypot(a.x - b.x, a.y - b.y);

export function newState(n: number, factions: FactionId[] = [], archs: Arch[] = []): State {
  const s: State = { tick: 0, units: [], points: [...POINTS.map(([x, y]) => ({ x, y, owner: -1, prog: 0, by: -1 })), ...RELICS.map(([x, y]) => ({ x, y, owner: -1, prog: 0, by: -1, relic: true }))], players: [], nextId: 1, winner: null, shots: [], rewind: [], blasts: [], smoke: [], vp: [], died: [], strikes: [], plagues: [] };
  for (let i = 0; i < n; i++) {
    s.players.push({ req: START_REQ, energy: START_ENERGY, relics: 0, alive: true, tier: 1, faction: factions[i] ?? 'order', arch: archs[i] ?? 'commander', rage: 0, waagh: 0, remains: 0, research: 0, unlock: 0, xp: 0, clvl: 1, pts: 1, abil: 0, acd: ABILITIES.map(() => 0), stopCd: 0, revive: 0 });
    s.vp.push(VP_START);
    const [hx, hy] = HQ_POS[i];
    spawn(s, i, 'hq', hx, hy);
    spawn(s, i, 'captain', ...nearHq(hx, hy, 8));
    spawn(s, i, 'builder', ...nearHq(hx, hy, 9)); // как в Dawn of War: начинаем со штабом, капитаном и строителями
  }
  return s;
}

const nearHq = (hx: number, hy: number, d: number): [number, number] => {
  const a = Math.atan2(MAP.h / 2 - hy, MAP.w / 2 - hx);
  return [hx + Math.cos(a) * d + (Math.random() - 0.5) * 3, hy + Math.sin(a) * d + (Math.random() - 0.5) * 3];
};

export function spawn(s: State, owner: number, kind: Kind, x: number, y: number): Unit {
  const u: Unit = { id: s.nextId++, owner, kind, x, y, hp: maxHp(kind), face: Math.atan2(MAP.h / 2 - y, MAP.w / 2 - x), cd: 0, order: null, q: 0, prog: 0, que: [], paid: [], gear: 0, ch: [0, 0, 0], gcd: 0, sh: kind === 'aegis' ? AEGIS.pool : 0, off: 0, frozen: 0, mark: 0, carry: 0, rise: 0, build: 1, dead: 0, reinf: false, rt: 0, hit: 9, lvl: 1, upg: -1, sm: 1, by: -1, rush: 0, stand: 0 };
  s.units.push(u);
  return u;
}

const count = (s: State, owner: number, k: Kind) => s.units.filter(u => u.owner === owner && u.kind === k && u.hp > 0).length;
const hqOf = (s: State, owner: number) => s.units.find(u => u.kind === 'hq' && u.owner === owner);
const producing = (k: Kind): Kind | null => producible(k)[0] ?? null;
export const queued = (s: State, owner: number, what: Kind) => s.units.reduce((n, u) => n + (u.owner === owner ? u.que.filter(k => k === what).length : 0), 0);
/** Занятый Легион: живые и заказанные боевые юниты; veh — техника (свой лимит), иначе пехота. */
export const legion = (s: State, owner: number, veh = false) => { const pop = (k: Kind) => (VEHICLES.has(k) || k === 'arty') === veh ? ROLES[k]?.pop ?? 0 : 0; return s.units.reduce((n, u) => n + (u.owner === owner && u.hp > 0 ? pop(u.kind) : 0) + (u.owner === owner ? u.que.reduce((m, k) => m + pop(k), 0) : 0), 0); };
export const legionCap = (p: Player, veh = false) => (veh ? MOTOR_CAP : LEGION_CAP) + (has(p, 12) ? 6 : 0);

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
export const REMAINS_PER_SQUAD = 5;
const fac = (s: State, owner: number) => s.players[owner].faction;
const nearOwn = (s: State, owner: number, x: number, y: number, r: number, kinds?: Kind[]) =>
  s.units.some(u => u.owner === owner && u.hp > 0 && u.build >= 1 && isStruct(u.kind) && (!kinds || kinds.includes(u.kind)) && dist(u, { x, y }) < r + STATS[u.kind].radius);
/** Множитель скорости: Орден медленнее, Орда в ВААГХ быстрее. */
const speedMul = (s: State, u: Unit) => { const p = s.players[u.owner]; return (s.units.some(w => w.kind === 'bell' && w.owner !== u.owner && w.build >= 1 && w.hp > 0 && dist(w, u) < BELL.r) ? BELL.speed : 1) * (u.kind === 'captain' && archOf(s, u) === 'assault' ? 1.15 : 1) * (u.carry ? 0.6 : 1) * (u.kind === 'guard' && isMelee('guard', p.faction) ? MELEE_GUARD.speed / STATS.guard.speed : 1) * (p.faction === 'order' ? 0.9 : p.faction === 'orks' && p.waagh > 0 ? 1.3 : 1) * (has(p, 7) ? 1.1 : 1) * (u.kind === 'legend' && u.q === 1 ? 1.5 : 1) * (u.rush > 0 ? 2 : 1); };
/** Урон атакующего: ВААГХ +30%, ближний бой Консенсуса −40%. */
function dmgMul(s: State, u: Unit) {
  const p = s.players[u.owner];
  const fear = (s.units.some(w => w.kind === 'elite' && w.owner !== u.owner && fac(s, w.owner) === 'undead' && w.hp > 0 && dist(w, u) < 10) ? 0.8 : 1) * (s.units.some(w => w.kind === 'bell' && w.owner !== u.owner && w.build >= 1 && w.hp > 0 && dist(w, u) < BELL.r) ? BELL.dmg : 1); // Плакальщица и Колокол Скорби
  const capA = (u.kind === 'captain' && archOf(s, u) === 'assault' ? 1.3 : 1) * fear, cmdA = !isStruct(u.kind) && u.kind !== 'captain' && nearArch(s, u, 'commander') ? 1.1 : 1;
  const r = capA * cmdA * (u.kind === 'guard' ? (has(p, 2) ? 1.1 : 1) * (has(p, 9) ? 1.1 : 1) : 1) * (u.kind === 'turret' && has(p, 5) ? 1.25 : 1) * (u.kind === 'captain' && has(p, 10) ? 1.2 : 1) * (u.kind === 'legend' && u.q === 1 ? 1.5 : 1) * (u.rush > 0 ? 1.5 : 1) * (u.kind === 'guard' && nearCapWith(s, u, 6, 12) ? 1.15 : 1);
  return r * factionDmg(s, u, p);
}
function factionDmg(s: State, u: Unit, p: Player) {
  if (p.faction === 'orks' && p.waagh > 0) return 1.3;
  if (p.faction === 'prism' && STATS[u.kind].range < 5) return 0.6;
  return 1;
}
/** Получаемый урон: Орден и Династии −8% (Орден у своих реликвариев и штаба ещё −20%, Свет веры), Орда +10%. */
function armorMul(s: State, t: Unit) {
  const f = fac(s, t.owner), p = s.players[t.owner];
  if (isStruct(t.kind)) return (has(p, 4) ? 0.8 : 1) * (t.kind === 'post' && t.lvl >= 2 ? 0.5 : 1) * (t.kind === 'wall' ? 0.6 : 1);
  if (s.units.some(b => b.kind === 'bunker' && b.owner === t.owner && b.build >= 1 && b.hp > 0 && dist(b, t) < STATS.bunker.radius + 3)) return 0.5; // крипта-бункер
  const res = (s.units.some(l => l.kind === 'lighthouse' && l.owner === t.owner && l.build >= 1 && l.hp > 0 && dist(l, t) < LIGHTHOUSE.r) ? LIGHTHOUSE.armor : 1) * (t.kind === 'captain' && archOf(s, t) === 'assault' ? 0.9 : 1) * (t.kind !== 'captain' && nearArch(s, t, 'commander') ? 0.9 : 1) * (s.units.some(a => a.kind === 'support' && a.owner === t.owner && a.hp > 0 && dist(a, t) < 10) ? (f === 'order' ? 0.75 : 0.85) : 1) // Кадильщица Ордена: Свет веры * (nearCapWith(s, t, 0, 12) ? 0.85 : 1) * (t.kind === 'guard' && has(p, 0) ? 0.9 : 1) * ((t.kind === 'captain' || t.kind === 'legend') && has(p, 13) ? 0.8 : 1);
  return res * factionArmor(f, s, t);
}
function factionArmor(f: FactionId, s: State, t: Unit) {
  if (f === 'clockwork') return 0.92; // живой металл
  if (f === 'order') return 0.92 * (nearOwn(s, t.owner, t.x, t.y, 12, ['post', 'hq']) ? 0.8 : 1);
  if (f === 'orks') return 1.1;
  return 1;
}
const rangeMul = (s: State, u: Unit) => (fac(s, u.owner) === 'prism' ? 1.1 : 1);
/** Цена для сервера и интерфейса: Династии платят энергией, Нежить заменяет её нехватку влиянием. */
export function resourceCost(faction: FactionId, req: number, energy = 0, availableEnergy = 0) {
  if (faction === 'clockwork') return { req: 0, energy: energy + req };
  if (faction === 'undead') {
    const used = Math.min(energy, Math.max(0, availableEnergy));
    return { req: req + energy - used, energy: used };
  }
  return { req, energy };
}
function pay(p: Player, req: number, energy = 0, relics = 0): string | undefined {
  ({ req, energy } = resourceCost(p.faction, req, energy, p.energy));
  if (p.req < req) return 'Не хватает влияния';
  if (p.energy < energy) return 'Не хватает энергии';
  if (p.relics < relics) return 'Не хватает реликвий';
  p.req -= req; p.energy -= energy; p.relics -= relics;
}
/** Цена найма с учётом фракции: Орда −20% на пехоту, Нежить поднимает отряд из останков бесплатно. */
export const trainCost = (f: FactionId, what: Kind) => Math.round(STATS[what].cost * (f === 'orks' && what === 'guard' ? 0.8 : 1));

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
    const what = (cmd.k && producible(b.kind).includes(cmd.k) ? cmd.k : producing(b.kind)) as Kind | null;
    const r = what && ROLES[what];
    if (!what || !r) return;
    if (b.build < 1) return 'Строительство не завершено';
    if (/^key[1-4]$/.test(b.kind) && b.q > 0 && !b.que.length) return 'Здание уже исследует';
    if (b.que.length >= QUEUE_MAX) return 'Очередь заполнена';
    if (p.tier < r.tier) return `Нужен тир ${r.tier}`;
    if (what === 'builder' && count(s, owner, 'builder') + queued(s, owner, 'builder') >= CAP.builder) return 'Достигнут лимит строителей';
    if (r.one && (count(s, owner, what) + queued(s, owner, what)) > 0) return 'Титан у армии один';
    const veh = VEHICLES.has(what) || what === 'arty';
    if (r.pop && legion(s, owner, veh) + r.pop > legionCap(p, veh)) return veh ? 'Не хватает лимита техники' : 'Не хватает Легиона';
    if (what === 'guard' && p.faction === 'undead' && p.remains >= REMAINS_PER_SQUAD) { p.remains -= REMAINS_PER_SQUAD; b.que.push(what); b.paid.push([0, 0, 0, REMAINS_PER_SQUAD]); return; } // Жатва
    const c = resourceCost(p.faction, trainCost(p.faction, what), r.energy ?? 0, p.energy);
    const e = pay(p, trainCost(p.faction, what), r.energy ?? 0, r.relics ?? 0);
    if (e) return e;
    b.que.push(what); b.paid.push([c.req, c.energy, r.relics ?? 0, 0]);
    return;
  }
  if (cmd.c === 'hero') { // призыв второго героя у штаба
    const a = cmd.a;
    if (!ARCHS.includes(a) || !ARCH_OPTS[p.faction][a] || a === p.arch) return;
    if (s.units.some(u => u.owner === owner && u.kind === 'captain' && archOf(s, u) === a)) return 'Этот герой уже в армии';
    if (p.tier < HERO.tier) return 'Нужен тир III';
    const hq = s.units.find(u => u.owner === owner && u.kind === 'hq' && u.hp > 0 && u.build >= 1);
    if (!hq) return 'Нужен штаб';
    const e = pay(p, HERO.cost, HERO.energy, HERO.relics);
    if (e) return e;
    spawn(s, owner, 'captain', ...nearHq(hq.x, hq.y, STATS.hq.radius + 3)).arch = a;
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
  if (cmd.c === 'upgrade' && s.units.some(v => v.id === cmd.id && v.kind === 'hq' && v.owner === owner)) { // переход тира
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
  if (cmd.c === 'cheat') { if (s.dev) Object.assign(p, { req: p.req + 5000, energy: p.energy + 5000, relics: p.relics + 20, tier: Math.max(p.tier, 4), clvl: Math.max(p.clvl, 10) }); return; }
  if (cmd.c === 'ascend') { // Вознесение капитана Династий
    const c = capOf(s, owner);
    if (p.faction !== 'clockwork') return 'Вознесение — только у Часовых Династий';
    if (!c || c.kind !== 'captain' || c.hp <= 0) return 'Капитан должен быть жив';
    if (c.rise > 0) return 'Вознесение уже идёт';
    if (p.clvl < DEITY.lvl || p.tier < DEITY.tier) return `Нужен ${DEITY.lvl}-й уровень капитана и тир IV`;
    const e = pay(p, 0, DEITY.energy);
    if (e) return e;
    c.rise = DEITY.rise; c.order = null;
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
    const a = Number(cmd.a);
    if (!Number.isInteger(a) || a < 0 || a >= ABILITIES.length) return;
    const e = canLearn(p, a);
    if (e) return e;
    p.abil |= 1 << a; p.pts--;
    return;
  }
  if (cmd.c === 'ability') {
    const a = Number(cmd.a), c = capOf(s, owner);
    if (!Number.isInteger(a) || !ABILITIES[a]?.cd || !(p.abil & (1 << a))) return;
    if (!c || c.hp <= 0) return 'Капитан пал';
    if (p.acd[a] > 0) return `Перезарядка ${Math.ceil(p.acd[a])} с`;
    p.acd[a] = ABILITIES[a].cd;
    const allies = (r: number) => s.units.filter(v => v.owner === owner && !isStruct(v.kind) && v.hp > 0 && dist(v, c) < r);
    const hitFoes = (r: number, dmg: number) => { for (const v of s.units) if (v.owner !== owner && v.hp > 0 && dist(v, c) < r) { hurt(s, v, dmg, owner); } };
    if (a === 1) for (const v of allies(10)) v.hp = Math.min(maxHp(v.kind), v.hp + maxHp(v.kind) * 0.25);
    if (a === 3) c.rush = 5;
    if (a === 4) hitFoes(6, 150);
    if (a === 5) hitFoes(12, 500);
    if (a === 7) for (const v of allies(15)) v.hp = Math.min(maxHp(v.kind), v.hp + maxHp(v.kind) * 0.15);
    if (a === 8) for (const v of allies(12)) v.stand = 6;
    if (s.shots.length < 200) s.shots.push([c.x, c.y, c.x, c.y - 0.1]);
    return;
  }
  if (cmd.c === 'unlock') { // открытие в ключевом здании тира IV
    const b = s.units.find(v => v.id === cmd.id && v.owner === owner && v.kind === 'key4' && v.hp > 0 && v.build >= 1);
    const u = Number(cmd.u), U = UNLOCKS[u];
    if (!b || !U) return;
    if (p.unlock & (1 << u)) return 'Уже открыто';
    if (p.tier < U.tier) return `Нужен тир ${U.tier}`;
    if (b.q > 0) return 'Здание уже исследует';
    const e = pay(p, U.cost, U.energy, U.relics);
    if (e) return e;
    b.q = 101 + u; b.prog = 0;
    return;
  }
  if (cmd.c === 'strike') { // сверхоружие: удар в любую точку карты
    const d = s.units.find(v => v.id === cmd.id && v.owner === owner && v.kind === 'doom' && v.hp > 0 && v.build >= 1);
    if (!d || !Number.isFinite(cmd.x) || !Number.isFinite(cmd.y)) return;
    if (d.prog < DOOM.charge) return `Заряд ${Math.floor((d.prog / DOOM.charge) * 100)}%`;
    const e = pay(s.players[owner], 0, DOOM_SHOT); // каждый пуск ещё и стоит энергии
    if (e) return e;
    d.prog = 0;
    s.strikes.push({ x: clamp(cmd.x, 0, MAP.w), y: clamp(cmd.y, 0, MAP.h), t: DOOM.warn, owner });
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
  if (cmd.c === 'summon') {
    const g = s.units.find(v => v.id === cmd.id && v.owner === owner && v.kind === 'gate' && v.hp > 0 && v.build >= 1);
    const v = Number(cmd.v);
    if (!g || !Number.isInteger(v) || v < 0 || v > 2) return;
    if (g.q > 0 || s.units.some(u => u.owner === owner && u.kind === 'legend' && u.hp > 0)) return 'Врата заняты';
    const c = LEGEND_COST[v], e = pay(p, 0, c.energy, c.relics);
    if (e) return e;
    g.q = v + 1; g.prog = 0;
    return;
  }
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
    const up = u && UPGRADES[u.kind];
    if (!u || !up) return;
    if (u.kind === 'lveh' && fac(s, owner) !== 'orks') return 'Только у Ржавой Орды';
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
  if (cmd.c === 'stop') { for (const u of mine) u.order = null; return; }
  if (cmd.c === 'reinforce') { for (const u of mine) if (SQUADS.has(u.kind) && u.hp < maxHp(u.kind)) u.reinf = true; return; }
  if (cmd.c === 'gear') { // купить снаряжение выбранным отрядам: у штаба, казарм или капитана
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
    u.order = { t: 'throw', g, x: clamp(cmd.x, 0, MAP.w), y: clamp(cmd.y, 0, MAP.h) };
    return;
  }
  if (cmd.c === 'sacrifice') { // Синклит: отряд у Чёрного Алтаря (штаба) обращается в демона
    if (p.faction !== 'ashen') return 'Жертвы приносит только Синклит';
    const hq = hqOf(s, owner);
    const victims = mine.filter(u => (SQUADS.has(u.kind) || VEHICLES.has(u.kind)) && u.kind !== 'elite' && u.kind !== 'titan' && hq && dist(u, hq) < 14);
    if (!victims.length) return 'Подведите отряд к Алтарю';
    for (const v of victims) {
      const weight = ROLES[v.kind]?.pop ?? 2, d = spawn(s, owner, 'elite', v.x, v.y);
      d.hp = maxHp('elite') * Math.min(1, weight / ROLES.elite!.pop); // демон того же веса
      v.hp = 0; v.by = -1;
      if (s.shots.length < 200) s.shots.push([v.x, v.y, v.x, v.y - 0.1, FX.fire]);
    }
    return;
  }
  if (cmd.c === 'drag') { // Орда: отряд Рубак утаскивает свою турель (или бросает, если уже тащит)
    if (p.faction !== 'orks') return 'Таскать турели умеет только Орда';
    const carrying = mine.find(u => u.carry);
    if (carrying) { const t = s.units.find(v => v.id === carrying.carry); if (t) t.carry = 0; carrying.carry = 0; return; }
    const t = s.units.find(v => v.id === cmd.id && v.owner === owner && /turret$/.test(v.kind) && v.build >= 1 && !v.carry);
    if (!t) return;
    const sq = mine.filter(u => u.kind === 'guard').sort((a, b) => dist(a, t) - dist(b, t))[0];
    if (!sq) return 'Нужен отряд Рубак';
    if (dist(sq, t) > 6) return 'Подведите Рубак к турели';
    sq.carry = t.id; t.carry = sq.id;
    return;
  }
  if (cmd.c === 'attack') {
    const t = s.units.find(u => u.id === cmd.id && u.owner !== owner && u.hp > 0);
    if (t) for (const u of mine) if (STATS[u.kind].dmg > 0) u.order = { t: 'attack', id: t.id };
    return;
  }
  if (cmd.c === 'assist') {
    const t = s.units.find(u => u.id === cmd.id && u.owner === owner && (isStruct(u.kind) || VEHICLES.has(u.kind)) && u.hp > 0);
    if (!t) return;
    if (t.build >= 1 && t.hp >= maxHp(t.kind) - 1e-6) return 'Ремонт не нужен';
    for (const u of mine) if (u.kind === 'builder') u.order = { t: 'build', id: t.id };
    return;
  }
  if (cmd.c === 'wall') { // протяжка стены: сегменты каждые WALL_STEP вдоль линии, не больше 16
    const bs = mine.filter(u => u.kind === 'builder');
    if (!bs.length) return 'Нужны строители';
    if (![cmd.x1, cmd.y1, cmd.x2, cmd.y2].every(Number.isFinite)) return;
    const a = { x: clamp(cmd.x1, 2, MAP.w - 2), y: clamp(cmd.y1, 2, MAP.h - 2) }, b = { x: clamp(cmd.x2, 2, MAP.w - 2), y: clamp(cmd.y2, 2, MAP.h - 2) };
    const n = Math.min(16, Math.floor(dist(a, b) / WALL_STEP) + 1);
    let first: Unit | undefined, built = 0;
    for (let i = 0; i < n; i++) {
      const x = a.x + ((b.x - a.x) * i) / Math.max(1, n - 1), y = a.y + ((b.y - a.y) * i) / Math.max(1, n - 1);
      if (s.units.some(u => isStruct(u.kind) && u.hp > 0 && dist(u, { x, y }) < (u.kind === 'wall' ? 1 : STATS[u.kind].radius + STATS.wall.radius))) continue;
      if (s.units.some(u => u.kind === 'hq' && u.owner !== owner && u.hp > 0 && dist(u, { x, y }) < 20)) continue;
      if (dist(s.points[0], { x, y }) < CRIT_NOBUILD) continue; // не у критической точки
      if (pay(p, STATS.wall.cost)) break;
      const site = spawn(s, owner, 'wall', x, y);
      site.build = 0.05; site.hp = STATS.wall.hp * 0.05; first ??= site; built++;
    }
    if (!first) return 'Здесь нельзя вести стену';
    for (const b2 of bs) b2.order = { t: 'build', id: first.id };
    return;
  }
  if (cmd.c === 'build') {
    const bs = mine.filter(u => u.kind === 'builder');
    if (!bs.length) return 'Нужны строители';
    if (!(cmd.kind in BUILD_TIER) || !Number.isFinite(cmd.x) || !Number.isFinite(cmd.y)) return;
    if (p.tier < BUILD_TIER[cmd.kind]) return `Нужен тир ${BUILD_TIER[cmd.kind]}`;
    const c = STATS[cmd.kind];
    if ((cmd.kind === 'foundry' || cmd.kind === 'pump') && p.faction === 'undead') return 'Нежити не нужны генераторы: энергию даёт Скорбь';
    if (FACTION_ONLY[cmd.kind] && FACTION_ONLY[cmd.kind] !== p.faction) return 'Постройка другой фракции';
    if (MEGA.has(cmd.kind) && !(p.unlock & (cmd.kind === 'doom' ? 2 : 1))) return `Сначала исследуйте «${UNLOCKS[cmd.kind === 'doom' ? 1 : 0].name}» в ключевом здании тира IV`;
    { const probe = { ...p }; const e = pay(probe, c.cost, ENERGY_COST[cmd.kind] ?? 0); if (e) return e; } // проверка цены теми же правилами, что и оплата
    let x = clamp(cmd.x, 4, MAP.w - 4), y = clamp(cmd.y, 4, MAP.h - 4);
    if (dist(s.points[0], { x, y }) < CRIT_NOBUILD) return 'У критической точки строить нельзя — за неё сражаются';
    if (blocked(x, y, STATS[cmd.kind].radius)) return 'На скалах строить нельзя';
    if (cmd.kind === 'hq') { // ещё один штаб (у Династий — Монолит): у своей точки или построек, не у чужой базы, не больше трёх
      if (count(s, owner, 'hq') >= 3) return 'Штабов не больше трёх';
      if (s.units.some(u => u.kind === 'hq' && u.owner !== owner && u.hp > 0 && dist(u, { x, y }) < 50)) return 'Слишком близко к чужому штабу';
      if (!nearOwnPoint(s, owner, x, y) && !s.units.some(u => u.owner === owner && isStruct(u.kind) && u.hp > 0 && dist(u, { x, y }) < 30)) return 'Штаб ставится у своей точки или рядом со своими постройками';
    }
    if (cmd.kind === 'post') {
      const pt = s.points.filter(q => !q.relic && dist(q, { x, y }) < 9).sort((a, b) => dist(a, { x, y }) - dist(b, { x, y }))[0];
      if (!pt) return 'Пост строится у стратегической точки';
      if (pt.owner >= 0 && pt.owner !== owner) return 'Точка занята врагом';
      ({ x, y } = pt);
      if (s.units.some(u => u.kind === 'post' && u.hp > 0 && dist(u, pt) < 2)) return 'На точке уже есть пост';
    } else if (cmd.kind === 'pump' || cmd.kind === 'foundry') { // генераторы: на жилу или рядом со своей точкой (как в DoW)
      const v = cmd.kind === 'pump' ? VENTS.map(([vx, vy]) => ({ x: vx, y: vy })).filter(q => dist(q, { x, y }) < 6).sort((a, b) => dist(a, { x, y }) - dist(b, { x, y }))[0] : undefined;
      if (v) ({ x, y } = v);
      else if (!nearOwnPoint(s, owner, x, y) && !(cmd.kind === 'foundry' && s.units.some(u => u.owner === owner && isStruct(u.kind) && u.kind !== 'turret' && u.hp > 0 && dist(u, { x, y }) < 16)))
        return cmd.kind === 'pump' ? 'Генератор ставится на жилу или рядом со своей точкой' : 'Литейня ставится рядом со своей точкой или постройками';
    } else if (cmd.kind === 'mine' || cmd.kind === 'wallgate' || cmd.kind === 'bunker' || cmd.kind === 'wall') { // укрепления: своя или нейтральная земля
      if (s.units.some(u => u.kind === 'hq' && u.owner !== owner && u.hp > 0 && dist(u, { x, y }) < 20)) return 'Слишком близко к чужому штабу';
    } else if (/turret$/.test(cmd.kind) && p.faction === 'orks') { // Орда ставит турели где угодно, кроме 20 м у чужого штаба
      if (s.units.some(u => u.kind === 'hq' && u.owner !== owner && u.hp > 0 && dist(u, { x, y }) < 20)) return 'Слишком близко к чужому штабу';
    } else if (cmd.kind === 'turret' || cmd.kind === 'aegis' || DEFENSE.has(cmd.kind) || /^key|^gate/.test(cmd.kind)) {
      if ((/^key|^gate/.test(cmd.kind) || cmd.kind === 'doom' || cmd.kind === 'lighthouse' || cmd.kind === 'obelisk' || cmd.kind === 'megagun' || cmd.kind === 'plague') && s.units.some(u => u.owner === owner && u.kind === cmd.kind && u.hp > 0)) return 'Такое здание уже есть';
      if (!s.units.some(u => u.owner === owner && isStruct(u.kind) && u.kind !== 'turret' && u.hp > 0 && dist(u, { x, y }) < 16) && !((cmd.kind === 'turret' || DEFENSE.has(cmd.kind)) && nearOwnPoint(s, owner, x, y)))
        return 'Турель ставится у своих построек или вокруг своей точки';
    } else if (cmd.kind !== 'hq') {
      const hq = hqOf(s, owner), d = hq ? dist(hq, { x, y }) : 99;
      if (d < 8 || d > 32) return 'Казармы строятся рядом со штабом';
    }
    if (/turret$/.test(cmd.kind) && count(s, owner, 'turret') + count(s, owner, 'rturret') + count(s, owner, 'fturret') >= (p.faction === 'orks' ? 30 : TURRET_CAP)) return 'Лимит турелей';
    if (s.units.some(u => isStruct(u.kind) && u.hp > 0 && dist(u, { x, y }) < STATS[u.kind].radius + c.radius + (cmd.kind === 'mine' ? 0 : 1))) return 'Место занято';
    if (s.players.some((q, i) => i !== owner && q.faction === 'ashen' && nearOwn(s, i, x, y, 14))) return 'Земля осквернена Порчей';
    pay(p, c.cost, ENERGY_COST[cmd.kind] ?? 0);
    const site = spawn(s, owner, cmd.kind, x, y);
    site.build = 0.05; site.hp = c.hp * 0.05;
    for (const b of bs) b.order = { t: 'build', id: site.id };
    return;
  }
  if ((cmd.c !== 'move' && cmd.c !== 'amove') || !Number.isFinite(cmd.x) || !Number.isFinite(cmd.y)) return;
  const cols = Math.ceil(Math.sqrt(mine.length)), rows = Math.ceil(mine.length / cols);
  mine.forEach((u, i) => { // строй сеткой вокруг точки, чтобы юниты не толкались на одной клетке
    const x = clamp(cmd.x + ((i % cols) - (cols - 1) / 2) * 2.4, 1, MAP.w - 1);
    const y = clamp(cmd.y + (Math.floor(i / cols) - (rows - 1) / 2) * 2.4, 1, MAP.h - 1);
    u.order = { t: cmd.c === 'amove' && STATS[u.kind].dmg > 0 ? 'amove' : 'move', x, y };
  });
}

export function step(s: State, dt = DT): void {
  if (s.winner !== null) return;
  s.tick++;
  const income = s.players.map(() => BASE_INCOME), energy = s.players.map(() => 0), relics = s.players.map(() => 0);
  for (const pt of s.points) if (pt.owner >= 0) {
    if (pt.relic) relics[pt.owner] += RELIC_RATE;
    else { const po = postAt(s, pt); income[pt.owner] += 1 + (po?.owner === pt.owner ? (po.lvl >= 2 ? 3 : 2) : 0); }
  }
  for (const u of s.units) if (u.build >= 1 && u.hp > 0) energy[u.owner] += (ENERGY_INCOME[u.kind] ?? 0) * (u.kind === 'pump' && hasR(s, u.owner, 6) ? 1.25 : 1);
  s.players.forEach((p, i) => {
    if (!p.alive) return;
    if (p.faction === 'clockwork') { p.energy += (income[i] + energy[i]) * dt; } // у Династий нет влияния
    else { p.req += income[i] * dt; p.energy += energy[i] * dt; }
    p.relics += relics[i] * dt;
    if (p.waagh > 0) p.waagh = Math.max(0, p.waagh - dt);
  });
  for (const r of s.rewind) r.t -= dt; // Перезавод: отряд встаёт на месте гибели
  for (const r of s.rewind.filter(r => r.t <= 0)) if (s.players[r.owner].alive) spawn(s, r.owner, 'guard', r.x, r.y);
  s.rewind = s.rewind.filter(r => r.t > 0);
  for (const p of s.players) { for (let i = 0; i < p.acd.length; i++) p.acd[i] = Math.max(0, p.acd[i] - dt); p.stopCd = Math.max(0, p.stopCd - dt); }
  const byId = new Map(s.units.map(u => [u.id, u]));
  for (const u of s.units) {
    if (!s.players[u.owner].alive) continue;
    u.hit += dt;
    u.rush = Math.max(0, u.rush - dt); u.stand = Math.max(0, u.stand - dt);
    if (u.mark > 0) u.mark -= dt;
    if (u.frozen > 0) { u.frozen -= dt; continue; } // Остановка времени
    if (u.kind === 'aegis' && u.build >= 1) { if (u.off > 0) u.off -= dt; else u.sh = Math.min(AEGIS.pool, u.sh + AEGIS.regen * dt); }
    if (u.rise > 0) { // Вознесение: 4 с превращения, затем капитан становится Богом-Механизмом
      if ((u.rise -= dt) <= 0) { u.rise = 0; u.kind = 'deity'; u.hp = maxHp('deity'); }
      continue;
    }
    if (u.kind === 'captain' && u.hp <= 0) {
      u.dead += dt;
      const hq = hqOf(s, u.owner);
      if (u.dead >= CAPTAIN_RESPAWN + 2 * s.players[u.owner].clvl && hq) { u.hp = maxHp('captain'); u.dead = 0; u.order = null; [u.x, u.y] = nearHq(hq.x, hq.y, 8); }
      continue;
    }
    if (u.hp <= 0) continue;
    if (u.upg >= 0 && u.kind === 'hq') { if ((u.upg += dt) >= TIER_TIME) { u.upg = -1; s.players[u.owner].tier++; } }
    else if (u.upg >= 0 && u.kind === 'post') { if ((u.upg += dt) >= 12) { u.upg = -1; u.lvl++; } }
    else if (u.upg >= 0) { // идёт апгрейд
      const up = UPGRADES[u.kind]!;
      if ((u.upg += dt) >= up.time) { u.upg = -1; u.lvl = 2; }
    }
    if (u.build >= 1) produce(s, u, dt);
    act(s, u, dt, byId);
    reinforce(s, u, dt);
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
  for (const z of s.plagues) { z.t -= dt; if (s.tick % 20 === 0) for (const v of s.units) if (v.owner !== z.owner && v.hp > 0 && (z.fire || !isStruct(v.kind)) && dist(v, z) < (z.fire ? FIRE.r : 18)) hurt(s, v, z.fire ? FIRE.dps : maxHp(v.kind) * 0.06, z.owner); }
  s.plagues = s.plagues.filter(z => z.t > 0);
  s.strikes = s.strikes.filter(st => st.t > 0);
  for (const b of s.blasts) if ((b.t -= dt) <= 0) { // гранаты долетели
    const G = GEAR[b.g];
    if (b.g === 2) s.smoke.push({ x: b.x, y: b.y, t: SMOKE_TIME });
    else for (const v of s.units) { // только врагов: своих не задевает
      if (v.hp <= 0 || v.owner === b.owner || dist(v, b) > G.r + (isStruct(v.kind) ? STATS[v.kind].radius : 0)) continue;
      const a = armorOf(v.kind), k = b.g === 1 ? (a === 'veh' || a === 'light' || a === 'struct' ? 1 : a === 'titan' ? 0.5 : 0.25) : a === 'inf' ? 1 : a === 'hinf' ? 0.6 : 0.2;
      hurt(s, v, G.dmg * k, b.owner);
    }
    if (s.shots.length < 200) s.shots.push([b.x, b.y, b.x, b.y - 0.1, b.g === 2 ? 9 : 8]);
  }
  s.blasts = s.blasts.filter(b => b.t > 0);
  for (const c of s.smoke) c.t -= dt;
  s.smoke = s.smoke.filter(c => c.t > 0);
  separate(s);
  capture(s, dt);
  victoryPoints(s, dt);
  cleanup(s);
}

/** Рядом со своей захваченной точкой (стратегической или реликварием): там можно ставить генераторы. */
export const GEN_R = 14;
export const nearOwnPoint = (s: State, owner: number, x: number, y: number) => s.points.some((p, i) => i !== 0 && p.owner === owner && dist(p, { x, y }) < GEN_R); // критическая точка не в счёт
/** У критической точки (центр) строить нельзя ничего: за неё только сражаются. */
export const CRIT_NOBUILD = 12;
/** Уникальные оборонительные постройки ставятся как турели: у своих построек или вокруг своей точки. */
export const DEFENSE = new Set<Kind>(['battery', 'pylon', 'pyre', 'bell', 'lighthouse', 'obelisk', 'megagun', 'plague', 'doom']);
const postAt = (s: State, pt: { x: number; y: number }) => s.units.find(u => u.kind === 'post' && u.build >= 1 && u.hp > 0 && dist(u, pt) < 2);

function produce(s: State, b: Unit, dt: number) {
  const p = s.players[b.owner];
  if (b.kind === 'key4' && b.q > 100) { const U = UNLOCKS[b.q - 101]; if ((b.prog += dt) >= U.time) { p.unlock |= 1 << (b.q - 101); b.q = 0; b.prog = 0; } return; }
  if (/^key[1-4]$/.test(b.kind) && b.q > 0 && !b.que.length) { // исследование
    if ((b.prog += dt) >= researchCost(b.q - 1).time) { p.research |= 1 << (b.q - 1); b.q = 0; b.prog = 0; }
    return;
  }
  if (b.kind === 'gate' && b.q > 0) { // призыв легенды: 20 с, виден всем
    if ((b.prog += dt) >= SUMMON_TIME) { const l = spawn(s, b.owner, 'legend', ...nearHq(b.x, b.y, STATS.gate.radius + 2.5)); l.q = b.q - 1; b.q = 0; b.prog = 0; }
    return;
  }
  if (b.kind === 'key4' && has(p, 14)) p.relics += dt / 120; // Ковчег мощей
  if (b.kind === 'doom') b.prog = Math.min(DOOM.charge, b.prog + dt); // заряд сверхоружия
  b.q = b.que.length;
  const what = b.que[0];
  if (!what) return;
  b.prog += dt;
  if (b.prog >= STATS[what].time * (ROLES[what]?.from === 'barracks' && has(p, 1) ? 0.85 : 1)) {
    b.prog = 0; b.que.shift(); b.paid.shift(); b.q = b.que.length;
    spawn(s, b.owner, what, ...nearHq(b.x, b.y, STATS[b.kind].radius + 2.5 + STATS[what].radius));
  }
}

function reinforce(s: State, u: Unit, dt: number) {
  if (!u.reinf) return;
  if (u.hp >= maxHp(u.kind) - 1e-6) { u.reinf = false; return; }
  if (u.hit < 2) return; // под огнём пополняться нельзя
  u.rt += dt;
  if (u.rt < REINFORCE_TIME) return;
  const p = s.players[u.owner];
  if (pay(p, Math.round(REINFORCE_COST * STATS[u.kind].cost / 100))) { u.reinf = false; return; }
  u.rt = 0;
  u.hp = Math.min(maxHp(u.kind), u.hp + STATS[u.kind].hp);
}

// ---------- поиск пути: A* по сетке 4×4 м вокруг скал и стен (на открытой карте — прямо) ----------
const CELL = 4;
type Grid = { w: number; h: number; b: Uint8Array; any: boolean };
let gridCache: { s: State; tick: number; g: Grid } | null = null;
function grid(s: State): Grid {
  if (gridCache && gridCache.s === s && gridCache.tick === s.tick) return gridCache.g;
  const w = Math.ceil(MAP.w / CELL), h = Math.ceil(MAP.h / CELL), b = new Uint8Array(w * h);
  let any = false;
  for (let cy = 0; cy < h; cy++) for (let cx = 0; cx < w; cx++) if (blocked(cx * CELL + CELL / 2, cy * CELL + CELL / 2, 0.5)) { b[cy * w + cx] = 1; any = true; }
  for (const u of s.units) if (u.kind === 'wall' && u.hp > 0) { const i = Math.floor(u.y / CELL) * w + Math.floor(u.x / CELL); if (i >= 0 && i < b.length) { b[i] = 1; any = true; } }
  const g = { w, h, b, any };
  gridCache = { s, tick: s.tick, g };
  return g;
}
const cellFree = (g: Grid, x: number, y: number) => { const cx = Math.floor(x / CELL), cy = Math.floor(y / CELL); return cx >= 0 && cy >= 0 && cx < g.w && cy < g.h && !g.b[cy * g.w + cx]; };
function lineClear(g: Grid, ax: number, ay: number, bx: number, by: number) {
  const n = Math.ceil(Math.hypot(bx - ax, by - ay));
  for (let i = 1; i <= n; i++) if (!cellFree(g, ax + ((bx - ax) * i) / n, ay + ((by - ay) * i) / n)) return false;
  return true;
}
function findPath(g: Grid, ax: number, ay: number, bx: number, by: number): { x: number; y: number }[] | null {
  const W = g.w, start = Math.floor(ay / CELL) * W + Math.floor(ax / CELL);
  let goal = Math.floor(by / CELL) * W + Math.floor(bx / CELL);
  if (g.b[goal]) { let best = -1, bd = 1e9; for (let i = 0; i < g.b.length; i++) if (!g.b[i]) { const d = Math.hypot((i % W) - (goal % W), Math.floor(i / W) - Math.floor(goal / W)); if (d < bd) { bd = d; best = i; } } goal = best; }
  const gs = new Float32Array(g.b.length).fill(Infinity), from = new Int32Array(g.b.length).fill(-1), open: number[] = [start];
  const hh = (i: number) => Math.hypot((i % W) - (goal % W), Math.floor(i / W) - Math.floor(goal / W));
  const fs = new Float32Array(g.b.length).fill(Infinity); gs[start] = 0; fs[start] = hh(start);
  const closed = new Uint8Array(g.b.length);
  while (open.length) { // ponytail: открытый список массивом, O(n²) на 2–4 тыс. клеток ок; куча, если карты вырастут
    let k = 0; for (let i = 1; i < open.length; i++) if (fs[open[i]] < fs[open[k]]) k = i;
    const c = open.splice(k, 1)[0];
    if (c === goal) break;
    closed[c] = 1;
    const cx = c % W, cy = Math.floor(c / W);
    for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
      if (!dx && !dy) continue;
      const nx = cx + dx, ny = cy + dy, n = ny * W + nx;
      if (nx < 0 || ny < 0 || nx >= W || ny >= g.h || g.b[n] || closed[n]) continue;
      if (dx && dy && (g.b[cy * W + nx] || g.b[ny * W + cx])) continue; // не срезаем угол скалы
      const t = gs[c] + (dx && dy ? 1.414 : 1);
      if (t < gs[n]) { gs[n] = t; fs[n] = t + hh(n); from[n] = c; if (!open.includes(n)) open.push(n); }
    }
  }
  if (from[goal] < 0 && goal !== start) return null;
  const cells: number[] = []; for (let c = goal; c !== -1 && c !== start; c = from[c]) cells.unshift(c);
  const pts = cells.map(c => ({ x: (c % W) * CELL + CELL / 2, y: Math.floor(c / W) * CELL + CELL / 2 }));
  pts.push({ x: bx, y: by });
  const out: { x: number; y: number }[] = []; let cur = { x: ax, y: ay }; // срезаем лишние повороты
  for (let i = 0; i < pts.length; i++) { if (i + 1 < pts.length && lineClear(g, cur.x, cur.y, pts[i + 1].x, pts[i + 1].y)) continue; out.push(pts[i]); cur = pts[i]; }
  return out;
}

function go(s: State, u: Unit, x: number, y: number, dt: number) {
  const g = grid(s);
  if (g.any && !flies(u.kind, fac(s, u.owner)) && !lineClear(g, u.x, u.y, x, y)) { // путь загорожен: идём по точкам A*
    if (!u.path || Math.hypot(u.path.to.x - x, u.path.to.y - y) > 3 || s.tick - u.path.at > 60) u.path = { to: { x, y }, at: s.tick, pts: findPath(g, u.x, u.y, x, y) ?? [] };
    while (u.path.pts.length && Math.hypot(u.path.pts[0].x - u.x, u.path.pts[0].y - u.y) < 1.5) u.path.pts.shift();
    if (u.path.pts.length) ({ x, y } = u.path.pts[0]);
  } else u.path = undefined;
  const dx = x - u.x, dy = y - u.y, d = Math.hypot(dx, dy);
  if (d < 1e-6) return;
  u.face = Math.atan2(dy, dx);
  const m = Math.min(STATS[u.kind].speed * u.sm * dt, d);
  u.x += (dx / d) * m; u.y += (dy / d) * m;
}

function act(s: State, u: Unit, dt: number, byId: Map<number, Unit>) {
  const st = STATS[u.kind];
  u.cd = Math.max(0, u.cd - dt); u.gcd = Math.max(0, u.gcd - dt);
  u.sm = speedMul(s, u);
  if (u.kind === 'legend' && u.q === 0) for (const v of s.units) if (v.owner === u.owner && v !== u && !isStruct(v.kind) && v.hp > 0 && dist(v, u) < 15) v.hp = Math.min(maxHp(v.kind), v.hp + maxHp(v.kind) * 0.05 * dt); // аура лечения
  if (u.kind === 'support' && fac(s, u.owner) === 'prism') for (const v of s.units) // щитовой дрон: личный щит отрядам рядом
    if (v.owner === u.owner && SQUADS.has(v.kind) && v.hp > 0 && v.hit > 3 && dist(v, u) < 8) v.sh = Math.min(DRONE_SHIELD, v.sh + 25 * dt);
  if (u.kind === 'healer' && fac(s, u.owner) === 'order') { // Архангел Милосердия: раз в 60 с поднимает павшего бойца
    const p = s.players[u.owner];
    if ((p.revive += dt) >= ARCHANGEL_REVIVE) {
      const sq = s.units.filter(v => v.owner === u.owner && SQUADS.has(v.kind) && v.hp > 0 && members(v.kind, v.hp) < STATS[v.kind].n && dist(v, u) < 15)[0];
      if (sq) { p.revive = 0; sq.hp = Math.min(maxHp(sq.kind), sq.hp + STATS[sq.kind].hp); if (s.shots.length < 200) s.shots.push([sq.x, sq.y, sq.x, sq.y - 0.1, 16]); }
    }
  }
  if (u.kind === 'captain' && archOf(s, u) === 'mystic') for (const v of s.units) if (v.owner === u.owner && v !== u && !isStruct(v.kind) && !VEHICLES.has(v.kind) && v.hp > 0 && dist(v, u) < 10) v.hp = Math.min(maxHp(v.kind), v.hp + maxHp(v.kind) * 0.015 * dt); // Мистик: лампа лечит
  if (u.kind === 'plague' && u.build >= 1 && s.tick % 20 === 0) for (const v of s.units) if (v.owner !== u.owner && v.hp > 0 && !isStruct(v.kind) && dist(v, u) < PLAGUE.r) hurt(s, v, maxHp(v.kind) * PLAGUE.pct, u.owner); // Чумной шпиль: −1%/с
  if (u.kind === 'pyre' && u.build >= 1 && s.tick % 4 === 0) for (const v of s.units) if (v.owner !== u.owner && v.hp > 0 && !isStruct(v.kind) && dist(v, u) < PYRE.r) { hurt(s, v, PYRE.dps * dt * 4, u.owner); if (s.shots.length < 200 && Math.random() < 0.3) s.shots.push([u.x, u.y, v.x, v.y, FX.fire]); } // Огненная яма
  if (u.kind === 'healer') for (const v of s.units) if (v.owner === u.owner && v !== u && !isStruct(v.kind) && !VEHICLES.has(v.kind) && v.hp > 0 && dist(v, u) < 15) v.hp = Math.min(maxHp(v.kind), v.hp + maxHp(v.kind) * ROLES.healer!.heal! * dt); // целитель: 5%/с
  if (u.kind === 'titan' && u.order && s.tick % 4 === 0) for (const v of s.units) if (v.owner !== u.owner && !isStruct(v.kind) && armorOf(v.kind) === 'inf' && v.hp > 0 && dist(v, u) < STATS.titan.radius + 1) { hurt(s, v, 40, u.owner); } // шаг титана давит пехоту
  if (fac(s, u.owner) === 'ashen' && !isStruct(u.kind) && u.hp < maxHp(u.kind) && nearOwn(s, u.owner, u.x, u.y, 14)) u.hp = Math.min(maxHp(u.kind), u.hp + maxHp(u.kind) * 0.02 * dt); // Порча лечит
  if (isStruct(u.kind) && u.build < 1) return; // стройка ещё не работает
  const o = u.order;
  if (o?.t === 'build') {
    const site = byId.get(o.id);
    if (site && site.hp > 0 && site.build >= 1 && site.hp < maxHp(site.kind) - 1e-6 && site.owner === u.owner) { // ремонт постройки или техники
      if (dist(u, site) - STATS[site.kind].radius > 2) { go(s, u, site.x, site.y, dt); return; }
      const rate = maxHp(site.kind) / Math.max(8, (STATS[site.kind].time || 20) * 1.5), add = Math.min(rate * dt, maxHp(site.kind) - site.hp);
      if (pay(s.players[u.owner], (add / maxHp(site.kind)) * Math.max(40, STATS[site.kind].cost) * 0.5)) { u.order = null; return; } // ремонт стоит половину цены за полное восстановление
      site.hp += add; u.face = Math.atan2(site.y - u.y, site.x - u.x);
      if (s.tick % 10 === 0 && s.shots.length < 200) s.shots.push([u.x, u.y, site.x, site.y, 6]); // искры сварки
      return;
    }
    if (!site || site.hp <= 0 || site.build >= 1) { // стена: строитель переходит к следующему недостроенному сегменту рядом
      const next = s.units.filter(v => v.owner === u.owner && v.kind === 'wall' && v.build < 1 && v.hp > 0 && dist(v, u) < 12).sort((a, b) => dist(a, u) - dist(b, u))[0];
      u.order = next ? { t: 'build', id: next.id } : null;
      return;
    }
    if (dist(u, site) - STATS[site.kind].radius > 2) { go(s, u, site.x, site.y, dt); return; }
    const c = STATS[site.kind];
    const slow = (fac(s, u.owner) === 'clockwork' ? 0.75 : 1) * (hasR(s, u.owner, 3) ? 1.2 : 1); // Династии −25%, Свитки каменщиков +20%
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
  if (o?.t === 'move') { // как в DoW: на марше стреляют по тем, кто в досягаемости, но не останавливаются
    if (st.dmg > 0 && u.cd === 0) { const t = s.units.filter(v => v.owner !== u.owner && v.hp > 0 && s.players[v.owner].alive).sort((a, b) => dist(u, a) - dist(u, b))[0]; if (t) shoot(s, u, t); }
    if (Math.hypot(o.x - u.x, o.y - u.y) < 0.6) u.order = null; else go(s, u, o.x, o.y, dt);
    return;
  }
  if (st.dmg === 0) return; // строители не воюют
  let target: Unit | undefined;
  if (o?.t === 'attack') {
    target = byId.get(o.id);
    if (!target || target.hp <= 0) { u.order = null; target = undefined; }
  }
  if (!target) { // свободный юнит и attack-move сами ищут ближайшего врага
    const spotting = st.range > st.sight; // артиллерия: бьёт дальше своего обзора — по целям, которые видят свои
    let best: number = (spotting ? st.range : st.sight) + (hasR(s, u.owner, 11) ? 4 : 0);
    for (const v of s.units) {
      if (v.owner === u.owner || v.hp <= 0 || !s.players[v.owner].alive) continue;
      if (spotting && dist(u, v) > st.sight && !s.units.some(o => o.owner === u.owner && o.hp > 0 && o !== u && dist(o, v) < Math.max(STATS[o.kind].sight, 10))) continue;
      if ((MIN_RANGE[u.kind] ?? 0) > dist(u, v) - STATS[v.kind].radius && !STATS[u.kind].speed) continue; // стационарная батарея не целится в мёртвую зону
      const d = dist(u, v) - STATS[v.kind].radius;
      if (d < best) { best = d; target = v; }
    }
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

/** Выстрел, если цель в досягаемости: false — далеко (или в мёртвой зоне), надо подойти. */
function shoot(s: State, u: Unit, target: Unit): boolean {
  const st = STATS[u.kind], d = dist(u, target) - STATS[target.kind].radius;
  const melee = u.kind === 'guard' && isMelee('guard', fac(s, u.owner));
  const mystic = u.kind === 'captain' && archOf(s, u) === 'mystic'; // посох-лампа и кадило: дальше и по площади
  const tooClose = (MIN_RANGE[u.kind] ?? 0) > d; // артиллерия не бьёт в упор
  if (!tooClose && d <= (u.kind === 'post' && u.lvl >= 3 ? 12 : melee ? MELEE_GUARD.range : mystic ? 9 : st.range) * rangeMul(s, u) + (u.lvl > 1 ? LVL2.range[u.kind] ?? 0 : 0) + ((u.kind === 'post' || u.kind === 'turret') && hasR(s, u.owner, 8) ? 3 : 0)) {
    if (u.cd === 0) {
      u.cd = melee ? MELEE_GUARD.cd : st.cd;
      const mult = u.lvl > 1 ? LVL2.dmg[u.kind] ?? 1 : 1, armor = target.lvl > 1 ? LVL2.armor[target.kind] ?? 1 : 1;
      const smoked = !melee && st.range > 4 && s.smoke.some(c => dist(c, target) < 6 || dist(c, u) < 6); // в дыму стрельба вслепую
      const netted = fac(s, u.owner) === 'prism' && target.mark > 0 ? 1.1 : 1; // Сеть наведения
      if (fac(s, u.owner) === 'prism' && !melee) target.mark = 5;
      const vs = (t: Unit) => netted * (smoked ? 0.5 : 1) * VS[u.kind === 'turret' && u.lvl > 1 ? 'heavy' : dmgOf(u.kind, fac(s, u.owner))][armorOf(t.kind)];
      const dealt = (u.kind === 'post' && u.lvl >= 3 ? 14 : melee ? MELEE_GUARD.dmg : st.dmg) * (SQUADS.has(u.kind) ? members(u.kind, u.hp) : 1) * mult * armor * dmgMul(s, u) * armorMul(s, target) * vs(target);
      hurt(s, target, dealt, u.owner);
      if (fac(s, u.owner) === 'ashen' && !isStruct(u.kind)) u.hp = Math.min(maxHp(u.kind), u.hp + dealt * 0.1); // Порча: удар питает демона
      const nade = u.kind === 'lveh' && u.lvl > 1; // Багги с гранатомётом
      const aoe = (nade ? 3 : undefined) ?? ROLES[u.kind]?.aoe ?? STRUCT_AOE[u.kind] ?? (mystic ? 3 : undefined);
      if (u.kind === 'arty' && fac(s, u.owner) === 'ashen' && s.plagues.length < 60) s.plagues.push({ x: target.x, y: target.y, t: FIRE.t, owner: u.owner, fire: true }); // Адская мортира: зажигательный снаряд, земля горит
      if (aoe) for (const v of s.units) if (v !== target && v.owner !== u.owner && v.hp > 0 && dist(v, target) < aoe) { hurt(s, v, dealt * 0.6 * (vs(v) / Math.max(0.01, vs(target))), u.owner); } // взрыв по площади
      if (u.kind === 'legend' && u.q === 2) for (const v of s.units) if (v !== target && v.owner === target.owner && v.hp > 0 && dist(v, target) < 4) { hurt(s, v, dealt * 0.5, u.owner); } // огненная буря
      const pa = s.players[u.owner];
      if (pa.faction === 'orks' && pa.waagh <= 0) { pa.rage += (dealt * 0.08 + (target.hp <= 0 ? 6 : 0)) * (s.units.some(w => w.kind === 'elite' && w.owner === u.owner && w.hp > 0 && dist(w, u) < 12) ? 2 : 1); /* Вожак рядом — ярость вдвое */ if (pa.rage >= RAGE_MAX) { pa.rage = 0; pa.waagh = WAAGH_TIME; } } // Ярость
      if (s.shots.length < 200) s.shots.push([u.x, u.y, target.x, target.y, mystic ? FX.fire : nade ? 12 : attackFx(u.kind, fac(s, u.owner), u.q)]);
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
      const b = mob[j], dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy), min = (STATS[a.kind].radius + STATS[b.kind].radius) * 0.8;
      if (d < min && d > 1e-3) { const p = ((min - d) * 0.5) / d; a.x -= dx * p; a.y -= dy * p; b.x += dx * p; b.y += dy * p; }
    }
    for (const h of structs) {
      if (h.kind === 'mine' || h.kind === 'aegis' || (h.kind === 'wallgate' && h.owner === a.owner) || h.carry === a.id || flies(a.kind, fac(s, a.owner))) continue;
      const dx = a.x - h.x, dy = a.y - h.y, d = Math.hypot(dx, dy), min = STATS[h.kind].radius + STATS[a.kind].radius * 0.6;
      if (d < min && d > 1e-3) { a.x = h.x + (dx / d) * min; a.y = h.y + (dy / d) * min; }
    }
    if (!flies(a.kind, fac(s, a.owner))) for (const [bx, by, bw, bh] of BLOCKS) { // скалы: выталкиваем к ближайшему краю
      const r = STATS[a.kind].radius * 0.6;
      if (a.x <= bx - r || a.x >= bx + bw + r || a.y <= by - r || a.y >= by + bh + r) continue;
      const opts = [[bx - r - a.x, 0], [bx + bw + r - a.x, 0], [0, by - r - a.y], [0, by + bh + r - a.y]].sort((p, q) => Math.abs(p[0] + p[1]) - Math.abs(q[0] + q[1]))[0];
      a.x += opts[0]; a.y += opts[1];
    }
    a.x = clamp(a.x, 0.5, MAP.w - 0.5); a.y = clamp(a.y, 0.5, MAP.h - 0.5);
  }
}

/** Уникальное сверхоружие фракций. */
function doomStrike(s: State, st: { x: number; y: number; owner: number }) {
  const f = s.players[st.owner]?.faction ?? 'order', boom = (x: number, y: number, r: number, dmg: number) => {
    for (const v of s.units) if (v.hp > 0 && dist(v, { x, y }) < r + STATS[v.kind].radius) hurt(s, v, dmg * (1 - dist(v, { x, y }) / (r * 2)), st.owner);
    if (s.shots.length < 200) s.shots.push([x, y, x, y - 0.1, 18]);
  };
  if (f === 'order') boom(st.x, st.y, 12, 3500);                         // Длань Лампы: орбитальное копьё
  else if (f === 'prism') boom(st.x, st.y, 8, 6000);                     // Солнечное копьё: точный луч, рвёт титанов
  else if (f === 'undead') { boom(st.x, st.y, 18, 800); s.plagues.push({ x: st.x, y: st.y, t: 20, owner: st.owner }); } // Колокол Конца: чумное облако 20 с
  else if (f === 'clockwork') { boom(st.x, st.y, 20, 1500); for (const v of s.units) if (v.owner !== st.owner && v.hp > 0 && dist(v, st) < 20) v.frozen = 8; } // Звёздный жнец: время встаёт
  else if (f === 'orks') for (let i = 0; i < 5; i++) { const a = (i / 5) * Math.PI * 2 + Math.random(), d = Math.random() * 16; boom(st.x + Math.cos(a) * d, st.y + Math.sin(a) * d, 9, 1400); } // Большая Красная Кнопка
  else { boom(st.x, st.y, 14, 1500); for (let i = 0; i < 3; i++) spawn(s, st.owner, 'elite', st.x + (i - 1) * 3, st.y + 2); } // Око Разлома: из разлома выходят демоны
}

function victoryPoints(s: State, dt: number) {
  const held = s.players.map((_, i) => s.points.reduce((n, p, k) => n + (p.owner === i && !p.relic ? (k === 0 ? 2 : 1) : 0), 0));
  s.players.forEach((p, i) => {
    if (!p.alive) return;
    const enemy = Math.max(0, ...held.filter((_, j) => j !== i && s.players[j].alive));
    const drain = Math.max(0, enemy - held[i]) * VP_RATE * dt;
    s.vp[i] = Math.max(0, s.vp[i] - drain); // только счёт перевеса: поражение — лишь когда пали все штабы
  });
}

/** Кто что видит: id юнитов в обзоре своих войск и построек (туман войны считается на сервере). */
export function visibleTo(s: State, owner: number): Set<number> {
  const eyes = [...s.units.filter(u => u.owner === owner && u.hp > 0).map(u => ({ x: u.x, y: u.y, r: Math.max(STATS[u.kind].sight, isStruct(u.kind) ? SIGHT_STRUCT : 10) + (hasR(s, owner, 11) ? 4 : 0) })),
    ...s.points.filter(p => p.owner === owner).map(p => ({ x: p.x, y: p.y, r: SIGHT_STRUCT + (hasR(s, owner, 11) ? 4 : 0) }))]; // своя точка видит и без башни
  const seen = new Set<number>();
  for (const u of s.units) {
    if (u.owner === owner || eyes.some(e => (e.x - u.x) ** 2 + (e.y - u.y) ** 2 < (e.r + STATS[u.kind].radius) ** 2)) seen.add(u.id);
  }
  return seen;
}

function capture(s: State, dt: number) {
  for (const p of s.points) {
    const post = postAt(s, p);
    if (post && s.players[post.owner].alive) { p.owner = post.owner; p.prog = 0; p.by = -1; continue; } // пост удерживает точку
    const present = new Set<number>();
    for (const u of s.units) if (!isStruct(u.kind) && u.hp > 0 && dist(u, p) < POINT_R) present.add(u.owner);
    const o = present.size === 1 ? [...present][0] : -1;
    if (o >= 0 && o !== p.owner) {
      if (p.by !== o) { p.by = o; p.prog = 0; }
      p.prog += dt / CAPTURE_TIME;
      if (p.prog >= 1) { p.owner = o; p.prog = 0; p.by = -1; gainXp(s, o, XP_CAPTURE); }
    } else if (p.prog > 0) {
      p.prog = Math.max(0, p.prog - dt / (CAPTURE_TIME * 2));
      if (p.prog === 0) p.by = -1;
    }
  }
}

function cleanup(s: State) {
  for (const u of s.units) if (u.kind === 'deity' && u.hp <= 0 && u.stand <= 0) { // гибель бога: капитан недоступен 5 минут
    u.kind = 'captain'; u.hp = 0; u.dead = CAPTAIN_RESPAWN + 2 * s.players[u.owner].clvl - DEITY.deathLock;
  }
  for (const u of s.units) if (u.hp <= 0 && u.stand > 0) u.hp = 1; // Последний рубеж
  for (const u of s.units) { // опыт капитану за убийство
    if (u.hp > 0 || u.by < 0 || u.by === u.owner) continue; // by сбрасывается — награда один раз, и для павшего капитана тоже
    gainXp(s, u.by, isStruct(u.kind) ? (u.kind === 'wall' || u.kind === 'mine' ? 0 : XP_STRUCT) : XP_KILL[u.kind] ?? 0);
    u.by = -1;
    if (u.kind === 'captain' && s.players[u.owner].abil & (1 << 2)) // Мученичество
      for (const v of s.units) if (v.owner === u.owner && v !== u && !isStruct(v.kind) && v.hp > 0 && dist(v, u) < 12) v.hp = maxHp(v.kind);
  }
  for (const u of s.units) {
    if (u.hp > 0 || isStruct(u.kind) || (u.kind === 'captain' && u.dead > 0)) continue;
    s.players.forEach((p, i) => { // Жатва и Скорбь: смерти рядом с постройками Нежити
      if (p.faction === 'undead' && p.alive && nearOwn(s, i, u.x, u.y, 25)) { p.remains += 1; p.energy += 1; }
    });
    const o = s.players[u.owner];
    if (u.kind === 'legend') s.players.forEach((q, i) => { if (i !== u.owner && q.alive) q.relics += 1; }); // убийство легенды: +1 реликвия
    if (u.kind === 'guard' && o.faction === 'clockwork') { // Перезавод: рядом капитан или штаб
      const cap = s.units.find(c => c.owner === u.owner && (c.kind === 'captain' || c.kind === 'elite') && c.hp > 0 && dist(c, u) < 15); // капитан или Хронарх
      if (cap || nearOwn(s, u.owner, u.x, u.y, 20, ['hq'])) s.rewind.push({ owner: u.owner, x: u.x, y: u.y, t: 12 * (s.points.some(p => p.owner === u.owner) ? 0.7 : 1) });
    }
  }
  for (const u of s.units) if (u.hp <= 0 && u.kind !== 'captain') s.died.push(u.id);
  s.players.forEach((p, i) => { if (p.alive && !s.units.some(u => u.owner === i && u.kind === 'hq' && u.hp > 0)) p.alive = false; }); // проигрыш — когда пали все штабы
  s.units = s.units.filter(u => s.players[u.owner].alive && (u.hp > 0 || u.kind === 'captain'));
  for (const p of s.points) if (p.owner >= 0 && !s.players[p.owner].alive) p.owner = -1;
  const alive = s.players.flatMap((p, i) => (p.alive ? [i] : []));
  if (alive.length <= 1) s.winner = alive.length ? alive[0] : -1;
}

const prodPct = (u: Unit) => u.kind === 'doom' ? Math.floor((u.prog / DOOM.charge) * 100) : u.q <= 0 || u.kind === 'legend' ? 0
  : u.kind === 'key4' && u.q > 100 ? Math.floor((u.prog / UNLOCKS[u.q - 101].time) * 100)
  : /^key/.test(u.kind) && !u.que.length ? Math.floor((u.prog / researchCost(u.q - 1).time) * 100)
  : u.kind === 'gate' ? Math.floor((u.prog / SUMMON_TIME) * 100)
  : u.que[0] ? Math.floor((u.prog / STATS[u.que[0]].time) * 100) : 0;

/** Компактный снимок для сети: целые числа вместо float, чтобы JSON был короче. */
export type Snap = { vp: number[]; d: number[]; ss: number[][]; mg: number[][]; tick: number; u: number[][]; p: number[][]; pl: number[][]; sh: number[][]; w: number | null; qk: Record<number, number[]>; sm: number[][]; ps: number[][] };
/** Снимок для одного игрока: враги вне обзора вырезаны, выстрелы — только видимые концом или началом. */
export function snapshotFor(s: State, owner: number): Snap {
  const full = snapshot(s), seen = visibleTo(s, owner), near = (x: number, y: number) => s.units.some(u => u.owner === owner && u.hp > 0 && Math.hypot(u.x - x / 10, u.y - y / 10) < Math.max(STATS[u.kind].sight, 12)) || s.points.some(p => p.owner === owner && Math.hypot(p.x - x / 10, p.y - y / 10) < SIGHT_STRUCT);
  return { ...full, u: full.u.filter(r => seen.has(r[0])), sh: full.sh.filter(v => near(v[0], v[1]) || near(v[2], v[3])), qk: Object.fromEntries(Object.entries(full.qk).filter(([id]) => s.units.some(u => u.id === Number(id) && u.owner === owner))) };
}
export function snapshot(s: State): Snap {
  return {
    vp: s.vp.map(Math.ceil), d: [...s.died], mg: s.units.filter(u => MEGA.has(u.kind) && u.hp > 0).map(u => [u.id, Math.round(u.x * 10), Math.round(u.y * 10), KINDS.indexOf(u.kind), u.owner, Math.floor(u.build * 100)]), /* мегапостройки видят все */ ss: s.strikes.map(st => [Math.round(st.x * 10), Math.round(st.y * 10), Math.ceil(st.t), st.owner]),
    tick: s.tick,
    // [id, owner, kind, x*10, y*10, hp, face*100, очередь, стройка %, пополняется, уровень, апгрейд %, найм текущего %]
    u: s.units.map(u => [u.id, u.owner, KINDS.indexOf(u.kind), Math.round(u.x * 10), Math.round(u.y * 10), (u.hp > 0 ? Math.max(1, Math.round(u.hp)) : 0), Math.round(u.face * 100), u.q, Math.floor(u.build * 100), u.reinf ? 1 : 0, u.lvl, u.upg < 0 ? -1 : Math.floor((u.upg / (u.kind === 'hq' ? TIER_TIME : u.kind === 'post' ? 12 : UPGRADES[u.kind]!.time)) * 100), prodPct(u), u.gear, ...u.ch, Math.ceil(u.gcd), Math.round(u.sh), Math.ceil(u.frozen * 10), u.carry, Math.ceil(u.rise * 10), u.off > 0 ? 1 : 0, u.kind === 'captain' && u.hp <= 0 ? Math.max(0, Math.ceil(CAPTAIN_RESPAWN + 2 * (s.players[u.owner]?.clvl ?? 1) - u.dead)) : 0, u.kind === 'captain' ? ARCHS.indexOf(archOf(s, u)) : -1]), // 24 — архетип героя // 23 — секунд до возрождения капитана // 18 щит, 19 заморозка, 20 тащит/тащат, 21 вознесение, 22 купол пробит
    ps: s.players.map(p => [Math.ceil(p.stopCd), p.unlock]), // 13 снаряжение, 14–16 заряды, 17 перезарядка броска
    qk: Object.fromEntries(s.units.filter(u => u.que.length).map(u => [u.id, u.que.map(k => KINDS.indexOf(k))])),
    sm: [...s.smoke.map(c => [Math.round(c.x * 10), Math.round(c.y * 10), Math.ceil(c.t)]), ...s.plagues.map(c => [Math.round(c.x * 10), Math.round(c.y * 10), Math.ceil(c.t), c.fire ? 2 : 1])],
    p: s.points.map(p => [p.owner, Math.round(p.prog * 100), p.by]),
    pl: s.players.map(p => [Math.floor(p.req), p.alive ? 1 : 0, p.tier, Math.floor(p.energy), Math.floor(p.relics), Math.floor(p.rage), Math.ceil(p.waagh), p.remains, p.research, p.clvl, Math.floor(p.xp), p.pts, p.abil, ...p.acd.map(Math.ceil)]), // 9..13 капитан, 14+ перезарядки способностей
    sh: s.shots.map(v => v.map(n => Math.round(n * 10))),
    w: s.winner,
  };
}
