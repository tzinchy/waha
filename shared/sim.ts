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
  | 'sniper' | 'heavy' | 'support' | 'elite' | 'healer' | 'lveh' | 'mveh' | 'hveh' | 'titan' | 'deity' | 'aegis' | 'rturret' | 'fturret' | 'arty' | 'battery' | 'pylon' | 'pyre' | 'bell' | 'doom' | 'lighthouse' | 'obelisk' | 'megagun' | 'plague' | 'motorpool' | 'yard'
  | 'air' | 'warpgate' | 'khorne' | 'nurgle' | 'tzeentch' | 'slaanesh' | 'jet' | 'portal' | 'spire' | 'bomber';
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
/** Артиллерия не стреляет в упор (мёртвая зона), уникальные постройки: радиусы аур. */
export const MIN_RANGE: Partial<Record<Kind, number>> = { arty: 10, battery: 8, megagun: 8 };
/** ПВО: самолёты (jet) получают от построек ×3, от тяжёлого оружия пехоты ×1.5; сами по зданиям бьют вполсилы — штурмовики, а не бомбардировщики. */
export const AA = { struct: 3, heavy: 1.5, jetVsStruct: 0.5 };
/** Осадная дальность: артиллерия бьёт по зданиям дальше, чем по войскам (нужна разведка или засвет). */
export const SIEGE_RANGE: Partial<Record<Kind, number>> = { arty: 15 };
/** Засвет из штаба: круг r м открыт t с, видны и скрытые порталом; стоит энергии, перезарядка cd. */
export const SCAN = { energy: 75, cd: 40, r: 22, t: 12 };

/** Сверхоружие штаба: заряд 3 минуты, предупреждение 6 с всем игрокам; бьёт только врагов, у каждой фракции свой удар (doomStrike). */
export const DOOM = { charge: 240, warn: 6, struct: 0.5 }; // по постройкам сверхоружие бьёт вполсилы: один пуск не сносит базу
/** Радиус поражения сверхоружия по фракциям — по нему же рисуется предупреждение. */
export const DOOM_R: Partial<Record<FactionId, number>> = { order: 12, clockwork: 20, orks: 25, ashen: 14, eldar: 10, tyranids: 18 };
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
export const VP_START = 500;
export const VP_RATE = 0.5; // очков в секунду за каждую точку перевеса противника (перевес в 3 точки ≈ 5.5 минуты до поражения)
/** Туман войны: радиус обзора по умолчанию у построек и юнитов без своего обзора. */
export const SIGHT_STRUCT = 12;
/** Захват точки отрядом, секунд (без поста); прогресс без отряда спадает вдвое медленнее. */
export const CAPTURE_TIME = 12;

// ---------- состав армии: откуда, с какого тира, сколько Легиона, броня и тип урона ----------
export type Armor = 'inf' | 'hinf' | 'light' | 'veh' | 'titan' | 'struct'; // light — лёгкая техника: стрелковое оружие её царапает
export type DmgType = 'small' | 'sniper' | 'heavy' | 'melee' | 'blast';
export type Role = { from: Kind; tier: number; pop: number; armor: Armor; dmg: DmgType; energy?: number; relics?: number; aoe?: number; heal?: number; meters: number; one?: boolean; fac?: FactionId }; // one — титан-класс (свой слот вне лимитов, нужна критическая точка; сколько угодно, если хватает ресурсов), fac — только этой фракции
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
  titan: { from: 'yard', tier: 4, pop: 20, armor: 'titan', dmg: 'blast', energy: 3000, relics: 1, aoe: 7, meters: 34, one: true },
  jet: { from: 'motorpool', tier: 3, pop: 6, armor: 'light', dmg: 'heavy', energy: 280, meters: 7 },
  bomber: { from: 'yard', tier: 4, pop: 20, armor: 'light', dmg: 'blast', energy: 2500, relics: 1, aoe: 9, meters: 18, one: true, fac: 'orks' },
  air: { from: 'barracks', tier: 2, pop: 3, armor: 'inf', dmg: 'small', energy: 80, meters: 2.6 },
  khorne: { from: 'warpgate', tier: 3, pop: 4, armor: 'hinf', dmg: 'melee', energy: 90, meters: 2.6 },
  nurgle: { from: 'warpgate', tier: 4, pop: 5, armor: 'hinf', dmg: 'melee', energy: 160, relics: 1, meters: 2.8 },
  tzeentch: { from: 'warpgate', tier: 4, pop: 5, armor: 'inf', dmg: 'blast', energy: 180, relics: 1, aoe: 2.5, meters: 2.4 },
  slaanesh: { from: 'warpgate', tier: 3, pop: 3, armor: 'inf', dmg: 'melee', energy: 70, meters: 2.4 },
};
/** Урон по броне (как в DoW/WH40k): болтеры и пулемёты почти не пробивают технику, снайпер косит пехоту, противотанковое — технику, взрывчатка — здания. */
export const VS: Record<DmgType, Record<Armor, number>> = {
  small: { inf: 1, hinf: 0.7, light: 0.5, veh: 0.04, titan: 0.01, struct: 0.15 },
  sniper: { inf: 1.8, hinf: 0.8, light: 0.1, veh: 0.02, titan: 0.01, struct: 0.05 },
  heavy: { inf: 0.4, hinf: 1.1, light: 1.3, veh: 1.2, titan: 1, struct: 1.2 },
  melee: { inf: 1.1, hinf: 1, light: 0.6, veh: 0.4, titan: 0.15, struct: 0.4 },
  blast: { inf: 1.2, hinf: 0.9, light: 0.9, veh: 0.7, titan: 0.5, struct: 1.6 },
};
/** Тяжёлое оружие пехоты: у Орды пулемёты-шуты, у Синклита огнемёты — это против пехоты, не против брони. */
const HEAVY_SMALL = new Set<FactionId>(['orks', 'ashen']);
const STRUCT_DMG: Partial<Record<Kind, DmgType>> = { rturret: 'blast', battery: 'blast', pylon: 'heavy', obelisk: 'heavy', megagun: 'blast' };
export const STRUCT_AOE: Partial<Record<Kind, number>> = { rturret: 3, battery: 4, megagun: 6 };
/** Уникальные турели фракций (множители к STATS.turret): тираниды — дальнобойная биопушка со сплэшем, Хаос — Статуя Кхорна (аура ярости, см. KHORNE). */
export const TURRET_FAC: Partial<Record<FactionId, UnitMod & { name: string }>> = {
  eldar: { name: 'Башня Отвращения', info: 'Тёмное копьё: 18 м, бьёт по технике и зданиям вдвое сильнее, медленно.', dmg: 2.4, range: 5, cd: 2, type: 'heavy', aoe: 0 },
  orks: { name: 'Гротская пушка', info: 'Антипехотная: гроты поливают очередями — частая стрельба по пехоте, технику почти не берёт.', dmg: 0.55, range: 0, cd: 0.35, type: 'small' },
  tyranids: { name: 'Споровая мортира', info: 'Навесом кислотными спорами: 25 м, площадь 4 м, мёртвая зона 6 м. Улучшенная: 33 м, площадь 6 м.', dmg: 2.6, range: 12, cd: 2.6, type: 'blast', aoe: 4, minRange: 6, up: { range: 8, aoe: 2 } },
  ashen: { name: 'Статуя Кхорна', info: 'Кровавые черепа по площади 2 м. Свои в 12 м бьют на 15% сильнее.', dmg: 1.5, range: -2, cd: 1, type: 'blast', aoe: 2 },
};
export const KHORNE = { r: 12, dmg: 1.15 };
/** Свой «движ» у техники, титанов и части пехоты по фракциям (множители к STATS и особые эффекты попадания).
 *  fire — земля горит (FIRE), freeze — цель замирает на N с, leech — доля урона лечит стрелка. */
export type UnitMod = { info: string; dmg?: number; range?: number; cd?: number; type?: DmgType; aoe?: number; fire?: boolean; freeze?: number; leech?: number; minRange?: number; up?: { range: number; aoe: number } }; // up — прибавка улучшенной версии (ур. 2)
export const UNIT_FAC: Partial<Record<FactionId, Partial<Record<Kind, UnitMod>>>> = {
  order: { arty: { info: 'Зажигательные ракеты: земля в точке удара горит.', fire: true }, hveh: { info: 'Спаренные лазпушки: +4 м дальности.', range: 4 }, titan: { info: 'Вулкан-мегаболтер: урон по площади 9 м.', aoe: 9 }, jet: { info: 'Штормовой коготь: штурмовая пушка — быстрые очереди.', cd: 0.7, dmg: 0.8 } },
  clockwork: { hveh: { info: 'Ковчег Судного дня: орудие во всю длину — 32 м, медленно, бьёт почти вдвое.', range: 12, cd: 1.7, dmg: 1.8 }, titan: { info: 'Монолит: попадание останавливает время цели на 2 с.', freeze: 2 }, arty: { info: 'Ковчег Аннигиляции: разряд по площади 7 м.', aoe: 7 }, jet: { info: 'Ночной серп: гаусс-излучатели — время цели замирает на 1 с.', freeze: 1 } },
  orks: { titan: { info: 'Стомпа: огнемёты и снаряды — земля горит, площадь 9 м.', aoe: 9, fire: true }, arty: { info: 'Большая пушка: площадь 7 м, но ближе (−6 м).', aoe: 7, range: -6 }, hveh: { info: 'Боевой фургон: таран и дакка — +20% урона.', dmg: 1.2 }, jet: { info: 'Ракетный джет: залпы ракет по площади 3 м — по технике и зданиям.', aoe: 3, cd: 1.5, dmg: 2 }, bomber: { info: 'Мини-атомки: взрыв по площади 9 м, земля горит.', fire: true } },
  ashen: { titan: { info: 'Кровожад: кровь для Кровавого бога — каждый удар лечит его на 8% урона.', leech: 0.08 }, mveh: { info: 'Печь-колесница: поджигает землю.', fire: true }, jet: { info: 'Адский дракон: пламя из пасти — площадь 3 м, земля горит, но вблизи (−6 м).', fire: true, aoe: 3, range: -6 } },
  eldar: { titan: { info: 'Помост разрушения: питается болью — 15% урона лечит.', leech: 0.15 }, hveh: { info: 'Тёмные копья: +6 м дальности.', range: 6 }, jet: { info: 'Бритвокрыл: ракеты-иглы — площадь 3 м, +4 м дальности.', aoe: 3, range: 4 } },
  tyranids: { titan: { info: 'Иерофант: кислотный ливень — площадь 8 м, земля разъедается.', aoe: 8, fire: true }, arty: { info: 'Экзокрин: плазма по площади 6 м, +20% урона.', aoe: 6, dmg: 1.2 }, lveh: { info: 'Равенер: рвёт добычу — 20% урона лечит.', leech: 0.2 }, jet: { info: 'Гарпия: споровые мины — кислота по площади 4 м.', aoe: 4, fire: true, cd: 1.5 } },
};
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
/** Теневой портал Тёмных эльдар: всё своё в r м (войска, стены, постройки) скрыто — видно и бьётся только вплотную (reveal м) или засветом. Рядовая постройка: ставится где угодно, кроме 20 м у чужого штаба. */
export const PORTAL = { r: 16, reveal: 4 };
export const veiled = (s: State, u: Unit) => s.players[u.owner]?.faction === 'eldar' && u.kind !== 'portal' && s.units.some(w => w.kind === 'portal' && w.owner === u.owner && w.build >= 1 && w.hp > 0 && dist(w, u) < PORTAL.r);
/** Вторые механики фракций: сильная сторона с ценой. Тексты — в FACTIONS.mech. */
export const NOFEAR = { hp: 0.3, armor: 0.7 };              // Легион: отряд ниже 30% здоровья получает −30%
export const LIVING_METAL = 0.005;                          // Некроны: техника и постройки чинятся 0.5%/с
export const SCRAP = 0.25;                                  // Орки: 25% цены уничтоженной техники/постройки врага — влиянием
export const TRIBUTE = 20;                                  // Хаос: каждые 20 убийств — 150 энергии (TRIBUTE_ENERGY)
export const PAIN = { per: 10, step: 0.03, max: 0.15 };     // Тёмные эльдар: +3% урона за 10 убийств, до +15%
export const SYNAPSE = { r: 20, on: 1.1, off: 0.85 };       // Тираниды: у синапса +10%, без него −15%
const SYNAPSE_KINDS = new Set<Kind>(['captain', 'healer', 'legend', 'hq']);
export const armorOf = (k: Kind): Armor => (isStruct(k) ? 'struct' : ROLES[k]?.armor ?? (k === 'legend' || k === 'captain' ? 'hinf' : 'inf'));
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
export const PRODUCERS = new Set<Kind>(['hq', 'gate', ...(Object.values(ROLES).map(r => r!.from))]);
export const producible = (b: Kind, f?: FactionId) => (Object.keys(ROLES) as Kind[]).filter(k => ROLES[k]!.from === b && (!f || !ROLES[k]!.fac || ROLES[k]!.fac === f));
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
const GUARD_FX: Record<FactionId, number> = { order: FX.shot, clockwork: FX.beam, orks: FX.chop, ashen: FX.fire , eldar: FX.beam, tyranids: FX.chop }; // Вечные — изумрудные распылители, Отступники — адострелы
/** Рукопашные: капитаны, легенды-бойцы, пехота Орды, Нежити и Синклита. */
export const isMelee = (k: Kind, f: FactionId) => k === 'captain' || (k === 'guard' && (f === 'orks' || f === 'tyranids')); // Хормагаунты рубят
export function attackFx(k: Kind, f: FactionId, variant = 0) {
  if (k === 'guard') return GUARD_FX[f];
  if (k === 'captain') return f === 'ashen' || f === 'orks' ? FX.claws : FX.chop; // мистика переопределяет act
  if (k === 'legend') return variant === 2 ? FX.fire : variant === 1 ? FX.chop : FX.beam;
  if (k === 'titan' && f === 'clockwork') return 20; // Монолит: изумрудный разряд с ветвящимися молниями
  if (k === 'titan' && f === 'orks') return 12; // Топтун лупит снарядами из брюха и многоствольника
  if (k === 'turret' && f === 'ashen') return 19; // идол Синклита плюётся огненными шарами
  if (k === 'sniper' && f === 'ashen') return FX.fire; // Колдун Пепла: огненный сгусток
  if (k === 'elite') return f === 'clockwork' ? FX.chop : f === 'order' ? FX.thrust : FX.claws; // Склеповая стража — булавы
  return ({ obelisk: 3, megagun: 12, arty: 12, battery: 12, pylon: 3, rturret: 12, fturret: FX.fire, deity: FX.chop, sniper: 10, heavy: 11, hveh: 12, titan: 13, mveh: f === 'ashen' || f === 'orks' ? FX.fire : 14, lveh: 14 } as Partial<Record<Kind, number>>)[k] ?? FX.shot;
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
export const heroFrom = (p: Player, a: Arch): Kind => (a === p.arch ? 'hq' : 'barracks');
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
export const flies = (k: Kind, f: FactionId) => k === 'deity' || k === 'air' || AIRCRAFT.has(k) || (k === 'healer' && f === 'order') || (f === 'eldar' && (k === 'lveh' || k === 'hveh' || k === 'arty' || k === 'titan'));
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
/** Постройки только своей фракции. */
/** null — постройка снятых фракций (Консенсус, Нежить): вид остаётся в KINDS ради стабильных индексов, строить нельзя. */
export const FACTION_ONLY: Partial<Record<Buildable, FactionId | null>> = { aegis: 'eldar', rturret: 'orks', fturret: 'orks', battery: 'order', bell: 'tyranids', pylon: 'clockwork', pyre: 'ashen', lighthouse: 'order', obelisk: 'clockwork', megagun: 'orks', plague: 'tyranids', warpgate: 'ashen', portal: 'eldar' }; // Эльдар — Теневое поле (купол), Демоны — Алтарь ужаса и Чумная башня
export const maxHp = (k: Kind) => STATS[k].hp * STATS[k].n;
/** Сколько моделей показывать: хп пула / хп одной модели, округлено вверх. */
export const members = (k: Kind, hp: number) => (hp <= 0 ? 0 : Math.min(STATS[k].n, Math.ceil(hp / STATS[k].hp - 1e-6)));

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
  vp: number[];  // победные очки (пресет CapturePoint)
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
  | { c: 'upgrade'; id: number }
  | { c: 'research'; id: number; r: number }
  | { c: 'summon'; id: number; v: number }
  | { c: 'wall'; ids: number[]; x1: number; y1: number; x2: number; y2: number; q?: boolean }
  | { c: 'gear'; ids: number[]; g: number }
  | { c: 'throw'; ids: number[]; g: number; x: number; y: number; q?: boolean }
  | { c: 'fire'; ids: number[]; x: number; y: number; q?: boolean }
  | { c: 'cheat' }
  | { c: 'ascend'; id?: number }
  | { c: 'timestop' }
  | { c: 'drag'; ids: number[]; id: number }
  | { c: 'sacrifice'; ids: number[] }
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
  const s: State = { tick: 0, units: [], points: [...POINTS.map(([x, y]) => ({ x, y, owner: -1, prog: 0, by: -1 })), ...RELICS.map(([x, y]) => ({ x, y, owner: -1, prog: 0, by: -1, relic: true }))], players: [], nextId: 1, winner: null, shots: [], rewind: [], blasts: [], smoke: [], vp: [], died: [], strikes: [], scans: [], plagues: [] };
  for (let i = 0; i < n; i++) {
    s.players.push({ req: START_REQ, energy: START_ENERGY, relics: 0, alive: true, tier: 1, faction: factions[i] ?? 'order', arch: archs[i] ?? 'commander', rage: 0, waagh: 0, remains: 0, research: 0, unlock: 0, stopCd: 0, revive: 0, doom: 0, kills: 0, scanCd: 0 });
    s.vp.push(VP_START);
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
  const u: Unit = { id: s.nextId++, owner, kind, x, y, hp: maxHp(kind), face: Math.atan2(MAP.h / 2 - y, MAP.w / 2 - x), cd: 0, order: null, q: 0, prog: 0, que: [], paid: [], gear: 0, ch: [0, 0, 0], gcd: 0, sh: kind === 'aegis' ? AEGIS.pool : 0, off: 0, frozen: 0, carry: 0, rise: 0, build: 1, dead: 0, reinf: false, rt: 0, hit: 9, ah: 0, lvl: 1, upg: -1, sm: 1, by: -1, rush: 0, stand: 0 };
  if (kind === 'captain') u.hero = { xp: 0, lvl: 1, pts: 1, abil: 0, acd: ABILITIES.map(() => 0) };
  s.units.push(u);
  return u;
}

const count = (s: State, owner: number, k: Kind) => s.units.filter(u => u.owner === owner && u.kind === k && u.hp > 0).length;
const hqOf = (s: State, owner: number) => s.units.find(u => u.kind === 'hq' && u.owner === owner);
const producing = (k: Kind): Kind | null => producible(k)[0] ?? null;
export const queued = (s: State, owner: number, what: Kind) => s.units.reduce((n, u) => n + (u.owner === owner ? u.que.filter(k => k === what).length : 0), 0);
/** Занятый Легион: живые и заказанные боевые юниты; veh — техника (свой лимит), иначе пехота. */
export const legion = (s: State, owner: number, veh = false) => { const pop = (k: Kind) => (VEHICLES.has(k) || k === 'arty') === veh && !ROLES[k]?.one ? ROLES[k]?.pop ?? 0 : 0; /* титан — свой слот, лимит техники не занимает */ return s.units.reduce((n, u) => n + (u.owner === owner && u.hp > 0 ? pop(u.kind) : 0) + (u.owner === owner ? u.que.reduce((m, k) => m + pop(k), 0) : 0), 0); };
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
const fac = (s: State, owner: number) => s.players[owner].faction;
const nearOwn = (s: State, owner: number, x: number, y: number, r: number, kinds?: Kind[]) =>
  s.units.some(u => u.owner === owner && u.hp > 0 && u.build >= 1 && isStruct(u.kind) && (!kinds || kinds.includes(u.kind)) && dist(u, { x, y }) < r + STATS[u.kind].radius);
/** Множитель скорости: Орден медленнее, Орда в ВААГХ быстрее. */
const speedMul = (s: State, u: Unit) => { const p = s.players[u.owner]; return (s.units.some(w => w.kind === 'bell' && w.owner !== u.owner && w.build >= 1 && w.hp > 0 && dist(w, u) < BELL.r) ? BELL.speed : 1) * (u.kind === 'captain' && archOf(s, u) === 'assault' ? 1.15 : 1) * (u.carry ? 0.6 : 1) * (u.kind === 'guard' && isMelee('guard', p.faction) ? MELEE_GUARD.speed / STATS.guard.speed : 1) * (p.faction === 'order' ? 0.9 : p.faction === 'eldar' ? 1.2 : p.faction === 'orks' && p.waagh > 0 ? 1.3 : 1) * (has(p, 7) ? 1.1 : 1) * (u.kind === 'legend' && u.q === 1 ? 1.5 : 1) * (u.rush > 0 ? 2 : 1); };
/** Урон атакующего: ВААГХ +30%. */
function dmgMul(s: State, u: Unit) {
  const p = s.players[u.owner];
  const fear = (s.units.some(w => w.kind === 'bell' && w.owner !== u.owner && w.build >= 1 && w.hp > 0 && dist(w, u) < BELL.r) ? BELL.dmg : 1); // Колокол Скорби
  const khorne = !isStruct(u.kind) && p.faction === 'ashen' && s.units.some(w => w.kind === 'turret' && w.owner === u.owner && w.build >= 1 && w.hp > 0 && dist(w, u) < KHORNE.r) ? KHORNE.dmg : 1; // Статуя Кхорна
  const capA = (u.kind === 'captain' && archOf(s, u) === 'assault' ? 1.3 : 1) * fear * khorne, cmdA = !isStruct(u.kind) && u.kind !== 'captain' && nearArch(s, u, 'commander') ? 1.1 : 1;
  const r = capA * cmdA * (u.kind === 'guard' ? (has(p, 2) ? 1.1 : 1) * (has(p, 9) ? 1.1 : 1) : 1) * (u.kind === 'turret' && has(p, 5) ? 1.25 : 1) * (u.kind === 'captain' && has(p, 10) ? 1.2 : 1) * (u.kind === 'legend' && u.q === 1 ? 1.5 : 1) * (u.rush > 0 ? 1.5 : 1) * (u.kind === 'guard' && nearCapWith(s, u, 6, 12) ? 1.15 : 1);
  return r * factionDmg(s, u, p);
}
function factionDmg(s: State, u: Unit, p: Player) {
  if (p.faction === 'orks' && p.waagh > 0) return 1.3;
  if (p.faction === 'eldar') return 1 + Math.min(PAIN.max, Math.floor(p.kills / PAIN.per) * PAIN.step); // Сила из боли
  if (p.faction === 'tyranids' && !isStruct(u.kind)) return SYNAPSE_KINDS.has(u.kind) || s.units.some(w => w.owner === u.owner && SYNAPSE_KINDS.has(w.kind) && w.hp > 0 && w.build >= 1 && dist(w, u) < SYNAPSE.r) ? SYNAPSE.on : SYNAPSE.off; // Синапс
  return 1;
}
/** Получаемый урон: Орден и Династии −8% (Орден у своих реликвариев и штаба ещё −20%, Свет веры), Орда +10%. */
function armorMul(s: State, t: Unit) {
  const f = fac(s, t.owner), p = s.players[t.owner];
  if (isStruct(t.kind)) return (has(p, 4) ? 0.8 : 1) * (t.kind === 'post' && t.lvl >= 2 ? 0.5 : 1) * (t.kind === 'wall' ? 0.6 : 1);
  if (s.units.some(b => b.kind === 'bunker' && b.owner === t.owner && b.build >= 1 && b.hp > 0 && dist(b, t) < STATS.bunker.radius + 3)) return 0.5; // крипта-бункер
  const res = (s.units.some(l => l.kind === 'lighthouse' && l.owner === t.owner && l.build >= 1 && l.hp > 0 && dist(l, t) < LIGHTHOUSE.r) ? LIGHTHOUSE.armor : 1)
    * (t.kind === 'captain' && archOf(s, t) === 'assault' ? 0.9 : 1)
    * (t.kind !== 'captain' && nearArch(s, t, 'commander') ? 0.9 : 1)
    * (s.units.some(a => a.kind === 'support' && a.owner === t.owner && a.hp > 0 && dist(a, t) < 10) ? (f === 'order' ? 0.75 : 0.85) : 1) // Знаменосец легиона: силовая броня
    * (nearCapWith(s, t, 0, 12) ? 0.85 : 1)
    * (t.kind === 'guard' && has(p, 0) ? 0.9 : 1)
    * ((t.kind === 'captain' || t.kind === 'legend') && has(p, 13) ? 0.8 : 1);
  return res * factionArmor(f, s, t);
}
function factionArmor(f: FactionId, s: State, t: Unit) {
  if (f === 'clockwork') return 0.92; // живой металл
  if (f === 'eldar') return 1.1; // налётчики: лёгкая броня
  if (f === 'order') return 0.92 * (nearOwn(s, t.owner, t.x, t.y, 12, ['post', 'hq']) ? 0.8 : 1) * (SQUADS.has(t.kind) && t.hp < maxHp(t.kind) * NOFEAR.hp ? NOFEAR.armor : 1); // Не ведают страха
  if (f === 'orks') return 1.1;
  return 1;
}
/** Weapon and ground-fire protection belongs to each victim, including its upgrade. */
const combatArmorMul = (s: State, t: Unit) => armorMul(s, t) * (t.lvl > 1 ? LVL2.armor[t.kind] ?? 1 : 1);
/** Цена для сервера и интерфейса: Династии платят энергией. */
export function resourceCost(faction: FactionId, req: number, energy = 0, availableEnergy = 0) {
  if (faction === 'clockwork') return { req: 0, energy: energy + req };
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
    const what = (cmd.k && producible(b.kind, p.faction).includes(cmd.k) ? cmd.k : producing(b.kind)) as Kind | null;
    const r = what && ROLES[what];
    if (!what || !r) return;
    if (b.build < 1) return 'Строительство не завершено';
    if ((/^key[1-4]$/.test(b.kind) && b.q > 0 && !b.que.length) || b.q > 100) return 'Здание уже исследует';
    if (b.que.length >= QUEUE_MAX) return 'Очередь заполнена';
    if (p.tier < r.tier) return `Нужен тир ${r.tier}`;
    if (what === 'builder' && count(s, owner, 'builder') + queued(s, owner, 'builder') >= CAP.builder) return 'Достигнут лимит строителей';
    if (r.one && s.points[0]?.owner !== owner) return 'Титан строится, только пока вы держите критическую точку'; // как реликвийные юниты Soulstorm: за центр надо драться
    const veh = VEHICLES.has(what) || what === 'arty';
    // титан-класс — вне лимитов
    if (r.pop && !r.one && legion(s, owner, veh) + r.pop > legionCap(p, veh)) return veh ? 'Не хватает лимита техники' : 'Не хватает Легиона';
    const c = resourceCost(p.faction, trainCost(p.faction, what), r.energy ?? 0, p.energy);
    const e = pay(p, trainCost(p.faction, what), r.energy ?? 0, r.relics ?? 0);
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
    if (!main && p.tier < HERO.tier) return 'Нужен тир II';
    const ok = (u: Unit) => u.owner === owner && u.kind === from && u.hp > 0 && u.build >= 1 && u.que.length < QUEUE_MAX;
    const b = s.units.find(u => u.id === cmd.id && ok(u)) ?? s.units.filter(ok).sort((x, y) => x.que.length - y.que.length)[0];
    if (!b) return from === 'hq' ? 'Нужен штаб' : 'Нужны казармы';
    const c = main ? { cost: CAPTAIN_COST.cost, energy: CAPTAIN_COST.energy, relics: 0 } : HERO, paidC = resourceCost(p.faction, c.cost, c.energy, p.energy);
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
  if (cmd.c === 'cheat') { // только в разработке: ресурсы, тир IV и 10-й уровень героям
    if (!s.dev) return;
    Object.assign(p, { req: p.req + 5000, energy: p.energy + 5000, tier: Math.max(p.tier, 4) }); p.cheat = true; // чит: +5 к удерживаемым реликвариям
    for (const c of s.units) if (c.owner === owner && c.hero && c.hero.lvl < 10) { c.hero.pts += 10 - c.hero.lvl; c.hero.lvl = 10; }
    return;
  }
  if (cmd.c === 'ascend') { // Вознесение капитана Династий
    const c = heroBy(s, owner, cmd.id, u => u.kind === 'captain');
    if (p.faction !== 'clockwork') return 'Вознесение — только у Часовых Династий';
    if (!c) return 'Капитан должен быть жив';
    if (c.rise > 0) return 'Вознесение уже идёт';
    if (c.hero!.lvl < DEITY.lvl || p.tier < DEITY.tier) return `Нужен ${DEITY.lvl}-й уровень героя и тир IV`;
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
    if (a === 1) for (const v of allies(10)) v.hp = Math.min(maxHp(v.kind), v.hp + maxHp(v.kind) * 0.25);
    if (a === 3) c.rush = 5;
    if (a === 4) hitFoes(6, 150);
    if (a === 5) hitFoes(12, 500);
    if (a === 7) for (const v of allies(15)) v.hp = Math.min(maxHp(v.kind), v.hp + maxHp(v.kind) * 0.15);
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
  if (cmd.c === 'stop') { for (const u of mine) { u.order = null; u.queue = undefined; } return; }
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
    give(u, { t: 'throw', g, x: clamp(cmd.x, 0, MAP.w), y: clamp(cmd.y, 0, MAP.h) }, cmd.q);
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
  if (cmd.c === 'fire') { // огонь по точке: дальнобойные (артиллерия, тяжёлое оружие, снайперы, тяжёлая техника, титаны)
    if (!Number.isFinite(cmd.x) || !Number.isFinite(cmd.y)) return;
    const ok = mine.filter(u => canFireGround(u.kind));
    if (!ok.length) return 'Огонь по точке — у дальнобойных: артиллерия, тяжёлое оружие, снайперы, техника';
    for (const u of ok) give(u, { t: 'fire', x: clamp(cmd.x, 0, MAP.w), y: clamp(cmd.y, 0, MAP.h) }, cmd.q);
    return;
  }
  if (cmd.c === 'attack') {
    const t = s.units.find(u => u.id === cmd.id && u.owner !== owner && u.hp > 0);
    if (t) for (const u of mine) if (STATS[u.kind].dmg > 0) give(u, { t: 'attack', id: t.id }, cmd.q);
    return;
  }
  if (cmd.c === 'assist') {
    const t = s.units.find(u => u.id === cmd.id && u.owner === owner && (isStruct(u.kind) || VEHICLES.has(u.kind)) && u.hp > 0);
    if (!t) return;
    if (t.build >= 1 && t.hp >= maxHp(t.kind) - 1e-6) return 'Ремонт не нужен';
    for (const u of mine) if (u.kind === 'builder') give(u, { t: 'build', id: t.id }, cmd.q);
    return;
  }
  if (cmd.c === 'wall') { // протяжка стены: по клетке сетки вдоль линии, занятые клетки пропускаем
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
    if (p.tier < BUILD_TIER[cmd.kind]) return `Нужен тир ${BUILD_TIER[cmd.kind]}`;
    const c = STATS[cmd.kind];
    if (cmd.kind in FACTION_ONLY && FACTION_ONLY[cmd.kind] !== p.faction || cmd.kind === 'spire' && p.faction !== 'eldar' && p.faction !== 'ashen') return 'Постройка другой фракции';
    if (MEGA.has(cmd.kind) && !(p.unlock & 1)) return `Сначала исследуйте «${UNLOCKS[0].name}» в штабе`;
    { const probe = { ...p }; const e = pay(probe, c.cost, ENERGY_COST[cmd.kind] ?? 0); if (e) return e; } // проверка цены теми же правилами, что и оплата
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
      if (pt.owner >= 0 && pt.owner !== owner) return 'Точка занята врагом';
      ({ x, y } = pt);
      if (s.units.some(u => u.kind === 'post' && u.hp > 0 && dist(u, pt) < 2)) return 'На точке уже есть пост';
    } else if (cmd.kind === 'pump' || cmd.kind === 'foundry') { // генераторы: один на точку — насос на свободную жилу, литейня у своей точки или штаба
      if (s.units.filter(u => u.owner === owner && (u.kind === 'pump' || u.kind === 'foundry') && u.hp > 0).length >= GEN_CAP) return `Генераторов не больше ${GEN_CAP}`;
      const a = genAnchor(s.points, s.units.filter(u => u.hp > 0), owner, x, y, cmd.kind);
      if (!a) return cmd.kind === 'pump' ? 'Насос ставится на свободную жилу: одна жила — один генератор' : 'Литейня ставится у своей точки или штаба, где ещё нет генератора: одна точка — один генератор';
      if (a.vent) ({ x, y } = a);
    } else if (cmd.kind === 'mine' || cmd.kind === 'wallgate' || cmd.kind === 'bunker' || cmd.kind === 'wall' || cmd.kind === 'portal') { // укрепления и портал: своя или нейтральная земля
      if (s.units.some(u => u.kind === 'hq' && u.owner !== owner && u.hp > 0 && dist(u, { x, y }) < 20)) return 'Слишком близко к чужому штабу';
    } else if (/turret$/.test(cmd.kind) && p.faction === 'orks') { // Орда ставит турели где угодно, кроме 20 м у чужого штаба
      if (s.units.some(u => u.kind === 'hq' && u.owner !== owner && u.hp > 0 && dist(u, { x, y }) < 20)) return 'Слишком близко к чужому штабу';
    } else if (cmd.kind === 'turret' || cmd.kind === 'aegis' || DEFENSE.has(cmd.kind) || /^key|^gate/.test(cmd.kind)) {
      if ((/^key|^gate/.test(cmd.kind) || cmd.kind === 'lighthouse' || cmd.kind === 'obelisk' || cmd.kind === 'megagun' || cmd.kind === 'plague' || cmd.kind === 'spire') && s.units.some(u => u.owner === owner && u.kind === cmd.kind && u.hp > 0)) return 'Такое здание уже есть';
      if (!s.units.some(u => u.owner === owner && isStruct(u.kind) && u.kind !== 'turret' && u.hp > 0 && dist(u, { x, y }) < 16) && !((cmd.kind === 'turret' || DEFENSE.has(cmd.kind)) && nearOwnPoint(s, owner, x, y)))
        return 'Турель ставится у своих построек или вокруг своей точки';
    } else if (cmd.kind !== 'hq') {
      const hq = hqOf(s, owner), d = hq ? dist(hq, { x, y }) : 99;
      if (d < 8 || d > 32) return 'Казармы строятся рядом со штабом';
    }
    if (/turret$/.test(cmd.kind) && count(s, owner, 'turret') + count(s, owner, 'rturret') + count(s, owner, 'fturret') >= (p.faction === 'orks' ? 30 : TURRET_CAP)) return 'Лимит турелей';
    if (!footFree(s.units.filter(u => isStruct(u.kind) && u.hp > 0), cmd.kind, x, y)) return 'Место занято';
    if (s.players.some((q, i) => i !== owner && q.faction === 'ashen' && nearOwn(s, i, x, y, 14))) return 'Земля осквернена Порчей';
    pay(p, c.cost, ENERGY_COST[cmd.kind] ?? 0);
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
    give(u, { t: cmd.c === 'amove' && STATS[u.kind].dmg > 0 ? 'amove' : 'move', x, y }, cmd.q);
  });
}

export function step(s: State, dt = DT): void {
  if (s.winner !== null) return;
  s.tick++;
  const income = s.players.map(() => BASE_INCOME), energy = s.players.map(() => 0);
  for (const pt of s.points) if (pt.owner >= 0) {
    const po = postAt(s, pt); income[pt.owner] += 1 + (po?.owner === pt.owner ? (po.lvl >= 2 ? 3 : 2) : 0); // реликварий теперь обычная точка: пост, влияние
  }
  for (const u of s.units) if (u.build >= 1 && u.hp > 0) energy[u.owner] += (ENERGY_INCOME[u.kind] ?? 0) * (u.kind === 'pump' && hasR(s, u.owner, 6) ? 1.25 : 1);
  s.players.forEach((p, i) => {
    if (!p.alive) return;
    if (p.faction === 'clockwork') { p.energy += (income[i] + energy[i]) * dt; } // у Династий нет влияния
    else { p.req += income[i] * dt; p.energy += energy[i] * dt; }
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
  const burning = new Map<Unit, { damage: number; owner: number }>();
  for (const z of s.plagues) {
    z.t -= dt;
    if (s.tick % 20 !== 0) continue;
    for (const v of s.units) {
      if (v.owner === z.owner || v.hp <= 0 || (!z.fire && isStruct(v.kind)) || dist(v, z) >= (z.fire ? FIRE.r : 18)) continue;
      if (!z.fire) { hurt(s, v, maxHp(v.kind) * 0.06, z.owner); continue; } // кислотная чума сохраняет свой процентный урон
      const damage = FIRE.dps * VS.small[armorOf(v.kind)] * combatArmorMul(s, v);
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
  b.prog += dt;
  if (b.prog >= STATS[what].time * (ROLES[what]?.from === 'barracks' && has(p, 1) ? 0.85 : 1)) {
    const [, , , , ai] = b.paid[0] ?? [];
    b.prog = 0; b.que.shift(); b.paid.shift(); b.q = b.que.length;
    const at = nearHq(b.x, b.y, STATS[b.kind].radius + 2.5 + STATS[what].radius);
    if (what === 'captain') { // герой: павший встаёт с прежним уровнем и снаряжением, иначе — новый
      const a = ARCHS[ai ?? -1] ?? p.arch, fallen = s.units.find(u => u.owner === b.owner && u.kind === 'captain' && u.hp <= 0 && archOf(s, u) === a);
      if (fallen) { fallen.hp = maxHp('captain'); fallen.dead = 0; fallen.order = null; [fallen.x, fallen.y] = at; }
      else { const h = spawn(s, b.owner, 'captain', ...at); if (a !== p.arch) h.arch = a; }
    } else spawn(s, b.owner, what, ...at);
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

// ---------- поиск пути: A* по той же сетке, что и постройки, вокруг скал и следов построек (на открытой карте — прямо) ----------
const CELL = BCELL;
type Grid = { w: number; h: number; b: Uint8Array; any: boolean };
let rocks: { blocks: typeof BLOCKS; b: Uint8Array } | null = null;
let gridCache: { s: State; tick: number; g: Grid[] } | null = null;
function grid(s: State, owner: number): Grid { // у каждого игрока своя: через свои ворота можно
  if (!gridCache || gridCache.s !== s || gridCache.tick !== s.tick) gridCache = { s, tick: s.tick, g: [] };
  if (gridCache.g[owner]) return gridCache.g[owner];
  const w = Math.ceil(MAP.w / CELL), h = Math.ceil(MAP.h / CELL);
  if (!rocks || rocks.blocks !== BLOCKS) { // скалы не меняются: считаем раз на карту
    rocks = { blocks: BLOCKS, b: new Uint8Array(w * h) };
    for (let cy = 0; cy < h; cy++) for (let cx = 0; cx < w; cx++) if (blocked(cx * CELL + CELL / 2, cy * CELL + CELL / 2, 0.5)) rocks.b[cy * w + cx] = 1;
  }
  const b = rocks.b.slice();
  for (const u of s.units) if (isStruct(u.kind) && u.hp > 0 && u.kind !== 'mine' && u.kind !== 'aegis' && !u.carry && !(u.kind === 'wallgate' && u.owner === owner)) { // след постройки закрывает свои клетки
    const f = footRect(u.kind, u.x, u.y);
    for (let cy = Math.max(0, f.y0); cy < Math.min(h, f.y0 + f.n); cy++) for (let cx = Math.max(0, f.x0); cx < Math.min(w, f.x0 + f.n); cx++) b[cy * w + cx] = 1;
  }
  return (gridCache.g[owner] = { w, h, b, any: b.includes(1) });
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

let budget = { s: null as State | null, tick: -1, n: 0 };
function go(s: State, u: Unit, x: number, y: number, dt: number) {
  const g = grid(s, u.owner);
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
  const m = Math.min(STATS[u.kind].speed * u.sm * dt, d);
  u.x += (dx / d) * m; u.y += (dy / d) * m;
}

function act(s: State, u: Unit, dt: number, byId: Map<number, Unit>) {
  const st = STATS[u.kind];
  u.cd = Math.max(0, u.cd - dt); u.gcd = Math.max(0, u.gcd - dt);
  u.sm = speedMul(s, u);
  if (u.queue && u.queue.length > QUEUE_ORDERS) u.queue.length = QUEUE_ORDERS;
  if (!u.order && u.queue?.length) { u.order = u.queue.shift()!; if (!u.queue.length) u.queue = undefined; } // текущий выполнен — берём следующий из очереди
  if (u.kind === 'legend' && u.q === 0) for (const v of s.units) if (v.owner === u.owner && v !== u && !isStruct(v.kind) && v.hp > 0 && dist(v, u) < 15) v.hp = Math.min(maxHp(v.kind), v.hp + maxHp(v.kind) * 0.05 * dt); // аура лечения
  if (u.kind === 'captain' && archOf(s, u) === 'mystic') for (const v of s.units) if (v.owner === u.owner && v !== u && !isStruct(v.kind) && !VEHICLES.has(v.kind) && v.hp > 0 && dist(v, u) < 10) v.hp = Math.min(maxHp(v.kind), v.hp + maxHp(v.kind) * 0.015 * dt); // Мистик: лампа лечит
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
      for (const v of s.units) if (v.owner !== u.owner && v.hp > 0 && dist(v, { x: tx, y: ty }) < MEGA_SHOT.aoe + STATS[v.kind].radius) hurt(s, v, MEGA_SHOT.dmg * VS.blast[armorOf(v.kind)], u.owner);
      s.scans.push({ x: tx, y: ty, t: MEGA_SHOT.t, owner: u.owner });
      if (s.shots.length < 200) s.shots.push([u.x, u.y, tx, ty, 12], [tx, ty, tx, ty - 0.1, 8]);
    } else u.prog = MEGA_SHOT.cd;
  }
  if (u.kind === 'plague' && u.build >= 1 && s.tick % 20 === 0) for (const v of s.units) if (v.owner !== u.owner && v.hp > 0 && !isStruct(v.kind) && dist(v, u) < PLAGUE.r) hurt(s, v, maxHp(v.kind) * PLAGUE.pct, u.owner); // Чумной шпиль: −1%/с
  if (u.kind === 'pyre' && u.build >= 1 && s.tick % 4 === 0) for (const v of s.units) if (v.owner !== u.owner && v.hp > 0 && !isStruct(v.kind) && dist(v, u) < PYRE.r) { hurt(s, v, PYRE.dps * dt * 4, u.owner); if (s.shots.length < 200 && Math.random() < 0.3) s.shots.push([u.x, u.y, v.x, v.y, FX.fire]); } // Огненная яма
  if (u.kind === 'titan' && u.order && s.tick % 4 === 0) for (const v of s.units) if (v.owner !== u.owner && !isStruct(v.kind) && armorOf(v.kind) === 'inf' && v.hp > 0 && dist(v, u) < STATS.titan.radius + 1) { hurt(s, v, 40, u.owner); } // шаг титана давит пехоту
  if (u.kind === 'nurgle' && u.hp > 0 && u.hp < maxHp(u.kind)) u.hp = Math.min(maxHp(u.kind), u.hp + maxHp(u.kind) * 0.02 * dt); // гниль Нургла
  if (fac(s, u.owner) === 'tyranids' && !isStruct(u.kind) && u.hp < maxHp(u.kind)) u.hp = Math.min(maxHp(u.kind), u.hp + maxHp(u.kind) * 0.01 * dt); // демоническая плоть
  if (fac(s, u.owner) === 'ashen' && !isStruct(u.kind) && u.hp < maxHp(u.kind) && nearOwn(s, u.owner, u.x, u.y, 14)) u.hp = Math.min(maxHp(u.kind), u.hp + maxHp(u.kind) * 0.02 * dt); // Порча лечит
  if (fac(s, u.owner) === 'clockwork' && (isStruct(u.kind) || VEHICLES.has(u.kind)) && (!isStruct(u.kind) || u.hit >= REPAIR.combatDelay) && u.build >= 1 && u.hp > 0 && u.hp < maxHp(u.kind)) u.hp = Math.min(maxHp(u.kind), u.hp + maxHp(u.kind) * LIVING_METAL * dt); // Живой металл: постройки восстанавливаются после выхода из боя
  if (isStruct(u.kind) && u.build < 1) return; // стройка ещё не работает
  const o = u.order;
  if (o?.t === 'build') {
    const site = byId.get(o.id);
    if (site && site.hp > 0 && site.build >= 1 && site.hp < maxHp(site.kind) - 1e-6 && site.owner === u.owner) { // ремонт постройки или техники
      if (dist(u, site) - STATS[site.kind].radius > 2) { go(s, u, site.x, site.y, dt); return; }
      const rate = Math.min(REPAIR.rate, maxHp(site.kind) / Math.max(8, (STATS[site.kind].time || 20) * 1.5)) * (site.hit < REPAIR.combatDelay ? REPAIR.combatMul : 1);
      const add = Math.min(rate * dt, maxHp(site.kind) - site.hp);
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
  if (o?.t === 'fire') { // огонь по земле: подойти на дальность и бить в точку
    const main = modOf(fac(s, u.owner), u.kind);
    const d = dist(u, o), r = st.range + (main?.range ?? 0) + (u.lvl > 1 ? (main?.up?.range ?? 0) + (LVL2.range[u.kind] ?? 0) : 0);
    if (d > r) { go(s, u, o.x, o.y, dt); return; }
    u.face = Math.atan2(o.y - u.y, o.x - u.x);
    if (u.cd > 0 || (MIN_RANGE[u.kind] ?? main?.minRange ?? 0) > d) return;
    u.cd = st.cd * (main?.cd ?? 1);
    const aoe = ROLES[u.kind]?.aoe ?? 2, type = main?.type ?? dmgOf(u.kind, fac(s, u.owner));
    const base = st.dmg * (SQUADS.has(u.kind) ? members(u.kind, u.hp) : 1) * (main?.dmg ?? 1) * (u.lvl > 1 ? LVL2.dmg[u.kind] ?? 1 : 1) * dmgMul(s, u);
    for (const v of s.units) if (v.owner !== u.owner && v.hp > 0 && dist(v, o) < aoe + STATS[v.kind].radius) {
      const smoked = st.range > 4 && s.smoke.some(c => dist(c, v) < 6 || dist(c, u) < 6);
      hurt(s, v, base * VS[type][armorOf(v.kind)] * combatArmorMul(s, v) * (smoked ? 0.5 : 1), u.owner);
    }
    if (s.shots.length < 200) s.shots.push([u.x, u.y, o.x, o.y, attackFx(u.kind, fac(s, u.owner), u.q)]);
    return;
  }
  if (o?.t === 'move') { // как в DoW: на марше стреляют по тем, кто в досягаемости, но не останавливаются
    if (st.dmg > 0 && u.cd === 0 && !SETUP.has(u.kind)) { const t = s.units.filter(v => v.owner !== u.owner && v.hp > 0 && s.players[v.owner].alive && !(veiled(s, v) && dist(u, v) > PORTAL.reveal + STATS[v.kind].radius)).sort((a, b) => dist(u, a) - dist(u, b))[0]; if (t) shoot(s, u, t); }
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
    const um = modOf(fac(s, u.owner), u.kind), rng = st.range + (um?.range ?? 0) + (u.lvl > 1 ? um?.up?.range ?? 0 : 0);
    const spotting = rng > st.sight && u.kind !== 'turret'; // артиллерия бьёт дальше своего обзора — по целям, которые видят свои; биопушка чует сама
    let best: number = (spotting || u.kind === 'turret' ? Math.max(rng, st.sight) : st.sight) + (hasR(s, u.owner, 11) ? 4 : 0);
    for (const v of s.units) {
      if (v.owner === u.owner || v.hp <= 0 || !s.players[v.owner].alive) continue;
      if (dist(u, v) > PORTAL.reveal + STATS[v.kind].radius && veiled(s, v)) continue; // скрытого порталом не видно издали
      if (spotting && dist(u, v) > st.sight && !spotted(s, u.owner, v)) continue;
      if ((MIN_RANGE[u.kind] ?? um?.minRange ?? 0) > dist(u, v) - STATS[v.kind].radius && !STATS[u.kind].speed) continue; // стационарная батарея не целится в мёртвую зону
      const d = dist(u, v) - STATS[v.kind].radius - (isStruct(v.kind) ? SIEGE_RANGE[u.kind] ?? 0 : 0); // по зданиям артиллерия достаёт дальше
      if (d < best) { best = d; target = v; }
    }
  }
  if (!target && u.ah && u.hit < 3 && (!o || o.t === 'amove')) { // ответный огонь: бьют того, кто стреляет из-за обзора (артиллерия, самолёты)
    const a = byId.get(u.ah);
    if (a && a.hp > 0 && a.owner !== u.owner && dist(u, a) < 60 && !(veiled(s, a) && dist(u, a) > PORTAL.reveal + STATS[a.kind].radius)) target = a;
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
/** Цель видна игроку: обзор его юнитов и построек или засвет; скрытого порталом видно только вплотную или засветом. */
const spotted = (s: State, owner: number, v: Unit) => s.scans.some(c => c.owner === owner && dist(c, v) < (c.r ?? MEGA_SHOT.reveal))
  || (veiled(s, v) ? s.units.some(o => o.owner === owner && o.hp > 0 && !isStruct(o.kind) && dist(o, v) < PORTAL.reveal + STATS[v.kind].radius)
    : s.units.some(o => o.owner === owner && o.hp > 0 && dist(o, v) < Math.max(STATS[o.kind].sight, 10)));
/** Выстрел, если цель в досягаемости: false — далеко (или в мёртвой зоне), надо подойти. */
function shoot(s: State, u: Unit, target: Unit): boolean {
  const st = STATS[u.kind], d = dist(u, target) - STATS[target.kind].radius;
  const melee = u.kind === 'guard' && isMelee('guard', fac(s, u.owner));
  const mystic = u.kind === 'captain' && archOf(s, u) === 'mystic'; // психосила библиария: дальше и по площади
  const deceiver = u.kind === 'deity' && archOf(s, u) !== 'assault'; // К'тан по сборке: Обманщик (золотой) жжёт звёздным огнём издалека, Несущий Ночь (штурм) косит в упор
  const tf = modOf(fac(s, u.owner), u.kind); // свой «движ» юнита или турели фракции
  const tooClose = (MIN_RANGE[u.kind] ?? tf?.minRange ?? 0) > d; // артиллерия и мортиры не бьют в упор
  const upR = u.lvl > 1 ? tf?.up?.range ?? 0 : 0;
  let near = CLOSE[u.kind] && d <= CLOSE[u.kind]!.range ? CLOSE[u.kind] : undefined; // второе оружие вблизи
  if (near && (u.kind === 'heavy' || u.kind === 'hveh') && !tooClose && d <= st.range + (tf?.range ?? 0) + upR) {
    const armor = armorOf(target.kind), mainType = tf?.type ?? dmgOf(u.kind, fac(s, u.owner));
    const mainDps = st.dmg * (tf?.dmg ?? 1) * VS[mainType][armor] / (st.cd * (tf?.cd ?? 1));
    const closeDps = near.dmg * VS[near.type][armor] / near.cd;
    if (mainDps > closeDps) near = undefined; // бронецель не заставляет бросать противотанковый ствол ради пистолета
  }
  const main = near ? undefined : tf; // свойства основного ствола — не для второго оружия
  if (near || !tooClose && d <= (u.kind === 'post' && u.lvl >= 3 ? 12 : melee ? MELEE_GUARD.range : mystic ? 9 : deceiver ? 14 : st.range + (tf?.range ?? 0) + upR + (isStruct(target.kind) ? SIEGE_RANGE[u.kind] ?? 0 : 0)) + (u.lvl > 1 ? LVL2.range[u.kind] ?? 0 : 0) + ((u.kind === 'post' || u.kind === 'turret') && hasR(s, u.owner, 8) ? 3 : 0)) {
    if (u.cd === 0) {
      u.cd = near ? near.cd : melee ? MELEE_GUARD.cd : st.cd * (tf?.cd ?? 1);
      const mult = (u.lvl > 1 ? LVL2.dmg[u.kind] ?? 1 : 1) * (main?.dmg ?? 1);
      const vs = (t: Unit) => ((!melee && st.range > 4 && s.smoke.some(c => dist(c, t) < 6 || dist(c, u) < 6)) ? 0.5 : 1)
        * VS[near?.type ?? main?.type ?? (u.kind === 'turret' && u.lvl > 1 ? 'heavy' : dmgOf(u.kind, fac(s, u.owner)))][armorOf(t.kind)];
      const base = (near ? near.dmg : u.kind === 'post' && u.lvl >= 3 ? 14 : melee ? MELEE_GUARD.dmg : st.dmg) * (SQUADS.has(u.kind) ? members(u.kind, u.hp) : 1) * mult * (deceiver ? 0.7 : 1) * dmgMul(s, u);
      const damageFor = (t: Unit) => base * combatArmorMul(s, t) * vs(t) * aaMul(u, t);
      const dealt = damageFor(target);
      hurt(s, target, dealt, u.owner); target.ah = u.id;
      if (main?.leech) u.hp = Math.min(maxHp(u.kind), u.hp + dealt * main.leech);
      if (main?.freeze && !isStruct(target.kind)) target.frozen = Math.max(target.frozen, main.freeze);
      if ((main?.fire || (u.kind === 'arty' && fac(s, u.owner) === 'ashen')) && s.plagues.length < 60) s.plagues.push({ x: target.x, y: target.y, t: FIRE.t, owner: u.owner, fire: true });
      if (fac(s, u.owner) === 'ashen' && !isStruct(u.kind) && u.kind !== 'titan') u.hp = Math.min(maxHp(u.kind), u.hp + dealt * 0.1); // Порча: удар питает демона
      const nade = u.kind === 'lveh' && u.lvl > 1; // Багги с гранатомётом
      const aoe = near ? undefined : (nade ? 3 : undefined) ?? ROLES[u.kind]?.aoe ?? STRUCT_AOE[u.kind] ?? (tf?.aoe ? tf.aoe + (u.lvl > 1 ? tf.up?.aoe ?? 0 : 0) : undefined) ?? (mystic ? 3 : deceiver ? 4 : undefined);
      if (aoe) for (const v of s.units) if (v !== target && v.owner !== u.owner && v.hp > 0 && dist(v, target) < aoe) { hurt(s, v, damageFor(v) * 0.6, u.owner); } // взрыв по площади: защита каждого потерпевшего
      if (u.kind === 'legend' && u.q === 2) for (const v of s.units) if (v !== target && v.owner === target.owner && v.hp > 0 && dist(v, target) < 4) { hurt(s, v, damageFor(v) * 0.5, u.owner); } // огненная буря
      const pa = s.players[u.owner];
      if (pa.faction === 'orks' && pa.waagh <= 0) { pa.rage += (dealt * 0.08 + (target.hp <= 0 ? 6 : 0)) * (s.units.some(w => w.kind === 'elite' && w.owner === u.owner && w.hp > 0 && dist(w, u) < 12) ? 2 : 1); /* Вожак рядом — ярость вдвое */ if (pa.rage >= RAGE_MAX) { pa.rage = 0; pa.waagh = WAAGH_TIME; } } // Ярость
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
      const b = mob[j], dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy), min = (STATS[a.kind].radius + STATS[b.kind].radius) * 0.8;
      if (d < min && d > 1e-3) { const p = ((min - d) * 0.5) / d; a.x -= dx * p; a.y -= dy * p; b.x += dx * p; b.y += dy * p; }
    }
    const r = STATS[a.kind].radius * 0.6, out = (bx: number, by: number, bw: number, bh: number) => { // из прямоугольника — к ближайшему краю
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
  const f = s.players[st.owner]?.faction ?? 'order', R = DOOM_R[f] ?? 16, boom = (x: number, y: number, r: number, dmg: number) => {
    for (const v of s.units) if (v.owner !== st.owner && v.hp > 0 && dist(v, { x, y }) < r + STATS[v.kind].radius) hurt(s, v, dmg * (1 - dist(v, { x, y }) / (r * 2)) * (isStruct(v.kind) ? DOOM.struct : 1), st.owner);
    if (s.shots.length < 200) s.shots.push([x, y, x + r, y, 18]); // x2 − x1 — радиус взрыва
  };
  if (f === 'eldar') boom(st.x, st.y, R, 3000);                          // Тёмное солнце
  else if (f === 'tyranids') { boom(st.x, st.y, R, 800); s.plagues.push({ x: st.x, y: st.y, t: 20, owner: st.owner }); } // Варп-шторм: облако 20 с
  else if (f === 'order') boom(st.x, st.y, R, 3500);                         // Орбитальный удар космодесанта
  else if (f === 'clockwork') { boom(st.x, st.y, R, 1500); for (const v of s.units) if (v.owner !== st.owner && v.hp > 0 && dist(v, st) < R) v.frozen = 8; } // Звёздный жнец: время встаёт
  else if (f === 'orks') for (let i = 0; i < 5; i++) { const a = (i / 5) * Math.PI * 2 + Math.random(), d = Math.random() * (R - 9); boom(st.x + Math.cos(a) * d, st.y + Math.sin(a) * d, 9, 1400); } // Большая Красная Кнопка
  else { boom(st.x, st.y, R, 1500); for (let i = 0; i < 3; i++) spawn(s, st.owner, 'elite', st.x + (i - 1) * 3, st.y + 2); } // Око Разлома: из разлома выходят демоны
}

function victoryPoints(s: State, dt: number) {
  const held = s.players.map((_, i) => s.points.reduce((n, p, k) => n + (p.owner === i ? (k === 0 ? 2 : 1) : 0), 0));
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
    ...s.points.filter(p => p.owner === owner).map(p => ({ x: p.x, y: p.y, r: SIGHT_STRUCT + (hasR(s, owner, 11) ? 4 : 0) })), // своя точка видит и без башни
    ...s.scans.filter(c => c.owner === owner).map(c => ({ x: c.x, y: c.y, r: c.r ?? MEGA_SHOT.reveal }))];
  const seen = new Set<number>();
  for (const u of s.units) {
    const hid = u.owner !== owner && veiled(s, u); // под Теневым порталом видно только вплотную
    if (u.owner === owner || (hid ? s.units.some(e => e.owner === owner && e.hp > 0 && !isStruct(e.kind) && dist(e, u) < PORTAL.reveal + STATS[u.kind].radius) || s.scans.some(c => c.owner === owner && c.r && dist(c, u) < c.r) : eyes.some(e => (e.x - u.x) ** 2 + (e.y - u.y) ** 2 < (e.r + STATS[u.kind].radius) ** 2))) seen.add(u.id);
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
      if (killer.faction === 'eldar') killer.energy += 3; // Жатва душ
      if (++killer.kills % TRIBUTE === 0 && killer.faction === 'ashen') killer.energy += TRIBUTE_ENERGY; // Жертва богам
    }
    if (killer?.faction === 'orks' && (VEHICLES.has(u.kind) || (isStruct(u.kind) && u.kind !== 'wall' && u.kind !== 'mine'))) killer.req += STATS[u.kind].cost * SCRAP; // Сборщики лома
    u.by = -1;
    if (u.hero && u.hero.abil & (1 << 2)) // Мученичество: у павшего героя
      for (const v of s.units) if (v.owner === u.owner && v !== u && !isStruct(v.kind) && v.hp > 0 && dist(v, u) < 12) v.hp = maxHp(v.kind);
  }
  for (const u of s.units) {
    if (u.hp > 0 || isStruct(u.kind) || (u.kind === 'captain' && u.dead > 0)) continue;
    const o = s.players[u.owner];
    if (u.kind === 'legend') s.players.forEach((q, i) => { if (i !== u.owner && q.alive) q.energy += LEGEND_BOUNTY; }); // убийство легенды: энергия всем врагам
    if (u.kind === 'guard' && o.faction === 'clockwork') { // Перезавод: рядом капитан или штаб
      const cap = s.units.find(c => c.owner === u.owner && (c.kind === 'captain' || c.kind === 'elite') && c.hp > 0 && dist(c, u) < 15); // капитан или Хронарх
      if (cap || nearOwn(s, u.owner, u.x, u.y, 20, ['hq'])) s.rewind.push({ owner: u.owner, x: u.x, y: u.y, t: 12 * (s.points.some(p => p.owner === u.owner) ? 0.7 : 1) });
    }
  }
  for (const u of s.units) if (u.hp <= 0 && u.kind !== 'captain') s.died.push(u.id);
  s.players.forEach((p, i) => { if (p.alive && !s.units.some(u => u.owner === i && PRODUCERS.has(u.kind) && u.hp > 0 && u.build >= 1)) p.alive = false; }); // проигрыш — когда пали штабы и все здания найма
  s.units = s.units.filter(u => s.players[u.owner].alive && (u.hp > 0 || u.kind === 'captain'));
  for (const p of s.points) if (p.owner >= 0 && !s.players[p.owner].alive) p.owner = -1;
  const alive = s.players.flatMap((p, i) => (p.alive ? [i] : []));
  if (alive.length <= 1) s.winner = alive.length ? alive[0] : -1;
}

const prodPct = (u: Unit) => u.q <= 0 || u.kind === 'legend' ? 0
  : u.q > 100 ? Math.floor((u.prog / UNLOCKS[u.q - 101].time) * 100)
  : /^key/.test(u.kind) && !u.que.length ? Math.floor((u.prog / researchCost(u.q - 1).time) * 100)
  : u.kind === 'gate' ? Math.floor((u.prog / SUMMON_TIME) * 100)
  : u.que[0] ? Math.floor((u.prog / STATS[u.que[0]].time) * 100) : 0;

/** Компактный снимок для сети: целые числа вместо float, чтобы JSON был короче. */
export type Snap = { vp: number[]; d: number[]; ss: number[][]; mg: number[][]; tick: number; u: number[][]; p: number[][]; pl: number[][]; sh: number[][]; w: number | null; qk: Record<number, number[]>; sm: number[][]; ps: number[][]; sc?: number[][] };
/** Снимок для одного игрока: враги вне обзора вырезаны, выстрелы — только видимые концом или началом. */
export function snapshotFor(s: State, owner: number): Snap {
  const full = snapshot(s), seen = visibleTo(s, owner), near = (x: number, y: number) => s.units.some(u => u.owner === owner && u.hp > 0 && Math.hypot(u.x - x / 10, u.y - y / 10) < Math.max(STATS[u.kind].sight, 12)) || s.points.some(p => p.owner === owner && Math.hypot(p.x - x / 10, p.y - y / 10) < SIGHT_STRUCT);
  return { ...full, sc: s.scans.filter(c => c.owner === owner).map(c => [Math.round(c.x * 10), Math.round(c.y * 10), c.r ?? MEGA_SHOT.reveal]), u: full.u.filter(r => seen.has(r[0])), sh: full.sh.filter(v => near(v[0], v[1]) || near(v[2], v[3])), qk: Object.fromEntries(Object.entries(full.qk).filter(([id]) => s.units.some(u => u.id === Number(id) && u.owner === owner))) };
}
export function snapshot(s: State): Snap {
  return {
    vp: s.vp.map(Math.ceil), d: [...s.died], mg: s.units.filter(u => MEGA.has(u.kind) && u.hp > 0).map(u => [u.id, Math.round(u.x * 10), Math.round(u.y * 10), KINDS.indexOf(u.kind), u.owner, Math.floor(u.build * 100)]), /* мегапостройки видят все */ ss: s.strikes.map(st => [Math.round(st.x * 10), Math.round(st.y * 10), Math.ceil(st.t), st.owner]),
    tick: s.tick,
    // [id, owner, kind, x*10, y*10, hp, face*100, очередь, стройка %, пополняется, уровень, апгрейд %, найм текущего %]
    u: s.units.map(u => [u.id, u.owner, KINDS.indexOf(u.kind), Math.round(u.x * 10), Math.round(u.y * 10), (u.hp > 0 ? Math.max(1, Math.round(u.hp)) : 0), Math.round(u.face * 100), u.q, Math.floor(u.build * 100), u.reinf ? 1 : 0, u.lvl, u.upg < 0 ? -1 : Math.floor((u.upg / (u.kind === 'hq' ? TIER_TIME : u.kind === 'post' ? 12 : UPGRADES[u.kind]!.time)) * 100), prodPct(u), u.gear, ...u.ch, Math.ceil(u.gcd), Math.round(u.sh), Math.ceil(u.frozen * 10), u.carry, Math.ceil(u.rise * 10), u.off > 0 ? 1 : 0, u.kind === 'captain' && u.hp <= 0 ? Math.ceil(-u.dead) : 0, u.kind === 'captain' ? ARCHS.indexOf(archOf(s, u)) : -1, ...(u.hero ? [u.hero.lvl, Math.floor(u.hero.xp), u.hero.pts, u.hero.abil, ...u.hero.acd.map(Math.ceil)] : [])] /* 25+ у героя: уровень, опыт, очки, способности, перезарядки */), // 24 — архетип героя // 23 — секунд, пока павшего героя нельзя заказать // 18 щит, 19 заморозка, 20 тащит/тащат, 21 вознесение, 22 купол пробит
    ps: s.players.map(p => [Math.ceil(p.stopCd), p.unlock, Math.floor((p.doom / DOOM.charge) * 100), Math.ceil(p.scanCd)]), // 13 снаряжение, 14–16 заряды, 17 перезарядка броска
    qk: Object.fromEntries(s.units.filter(u => u.que.length).map(u => [u.id, u.que.map(k => KINDS.indexOf(k))])),
    sm: [...s.smoke.map(c => [Math.round(c.x * 10), Math.round(c.y * 10), Math.ceil(c.t)]), ...s.plagues.map(c => [Math.round(c.x * 10), Math.round(c.y * 10), Math.ceil(c.t), c.fire ? 2 : 1])],
    p: s.points.map(p => [p.owner, Math.round(p.prog * 100), p.by]),
    pl: s.players.map(p => [Math.floor(p.req), p.alive ? 1 : 0, p.tier, Math.floor(p.energy), Math.floor(p.relics), Math.floor(p.rage), Math.ceil(p.waagh), p.kills, p.research]),
    sh: s.shots.map(v => v.map(n => Math.round(n * 10))),
    w: s.winner,
  };
}
