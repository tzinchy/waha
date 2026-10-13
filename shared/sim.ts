import type { FactionId } from './factions.ts';

// Вся игровая логика. Чистые функции без DOM и сети: сервер гонит step(), клиент только рисует snapshot().
export const MAP = { w: 100, h: 100 };
export const DT = 1 / 20;

export type Weapon = 'sword' | 'hammer';
export type CaptainCfg = { armor: number; trim: number; weapon: Weapon; banner: boolean };
export type Kind = 'captain' | 'builder' | 'guard' | 'hq' | 'barracks' | 'post' | 'turret' | 'foundry' | 'pump' | 'key1' | 'key2' | 'key3' | 'key4' | 'gate' | 'legend' | 'wall' | 'wallgate' | 'bunker' | 'mine';
export const KINDS: Kind[] = ['captain', 'builder', 'guard', 'hq', 'barracks', 'post', 'turret', 'foundry', 'pump', 'key1', 'key2', 'key3', 'key4', 'gate', 'legend', 'wall', 'wallgate', 'bunker', 'mine'];
export const isStruct = (k: Kind) => k !== 'captain' && k !== 'builder' && k !== 'guard' && k !== 'legend';
export type Buildable = 'barracks' | 'post' | 'turret' | 'foundry' | 'pump' | 'key1' | 'key2' | 'key3' | 'key4' | 'gate' | 'wall' | 'wallgate' | 'bunker' | 'mine';

// hp: у отрядов хп ОДНОЙ модели (общий пул = hp * n), у остальных общий. dmg: урон одной модели.
type Stat = { hp: number; n: number; dmg: number; range: number; cd: number; speed: number; sight: number; radius: number; cost: number; time: number };
export const STATS: Record<Kind, Stat> = {
  captain: { hp: 600, n: 1, dmg: 35, range: 3.5, cd: 0.7, speed: 8, sight: 14, radius: 1, cost: 0, time: 0 },
  builder: { hp: 50, n: 2, dmg: 0, range: 0, cd: 1, speed: 7, sight: 0, radius: 1.1, cost: 30, time: 3 },
  guard: { hp: 60, n: 5, dmg: 3.2, range: 9, cd: 1, speed: 7, sight: 14, radius: 1.8, cost: 100, time: 6 },
  hq: { hp: 1500, n: 1, dmg: 14, range: 12, cd: 1.2, speed: 0, sight: 12, radius: 4.5, cost: 0, time: 0 },
  barracks: { hp: 700, n: 1, dmg: 0, range: 0, cd: 1, speed: 0, sight: 0, radius: 3.2, cost: 150, time: 20 },
  post: { hp: 400, n: 1, dmg: 6, range: 10, cd: 1.5, speed: 0, sight: 10, radius: 1.4, cost: 50, time: 8 },
  turret: { hp: 500, n: 1, dmg: 12, range: 13, cd: 1.2, speed: 0, sight: 13, radius: 1.3, cost: 80, time: 10 },
  foundry: { hp: 600, n: 1, dmg: 0, range: 0, cd: 1, speed: 0, sight: 0, radius: 2.6, cost: 120, time: 15 }, // Литейня: энергия
  pump: { hp: 400, n: 1, dmg: 0, range: 0, cd: 1, speed: 0, sight: 0, radius: 1.6, cost: 100, time: 12 },     // Глубинный насос на жиле
  key1: { hp: 800, n: 1, dmg: 0, range: 0, cd: 1, speed: 0, sight: 0, radius: 2.6, cost: 150, time: 20 },    // ключевые здания тиров I–IV
  key2: { hp: 1000, n: 1, dmg: 0, range: 0, cd: 1, speed: 0, sight: 0, radius: 2.8, cost: 250, time: 25 },
  key3: { hp: 1200, n: 1, dmg: 0, range: 0, cd: 1, speed: 0, sight: 0, radius: 2.8, cost: 350, time: 30 },
  key4: { hp: 1500, n: 1, dmg: 0, range: 0, cd: 1, speed: 0, sight: 0, radius: 3, cost: 450, time: 35 },
  gate: { hp: 2500, n: 1, dmg: 0, range: 0, cd: 1, speed: 0, sight: 0, radius: 3.6, cost: 500, time: 40 },    // Врата призыва, тир V
  legend: { hp: 3000, n: 1, dmg: 50, range: 5, cd: 1, speed: 8, sight: 16, radius: 1.4, cost: 0, time: 0 },
  // укрепления (пресет Fortifications)
  wall: { hp: 1500, n: 1, dmg: 0, range: 0, cd: 1, speed: 0, sight: 0, radius: 1.6, cost: 30, time: 4 },      // сегмент стены
  wallgate: { hp: 2400, n: 1, dmg: 0, range: 0, cd: 1, speed: 0, sight: 0, radius: 1.6, cost: 120, time: 10 }, // ворота: свои проходят
  bunker: { hp: 3000, n: 1, dmg: 0, range: 0, cd: 1, speed: 0, sight: 0, radius: 2.2, cost: 250, time: 18 },  // крипта: пехота рядом −50% урона
  mine: { hp: 60, n: 1, dmg: 180, range: 2, cd: 1, speed: 0, sight: 0, radius: 0.6, cost: 40, time: 3 },      // мина: невидима, 180 урона по 6 м
};
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
export const FX = { shot: 0, chop: 1, claws: 2, beam: 3, fire: 4, thrust: 5 } as const;
const GUARD_FX: Record<FactionId, number> = { order: FX.shot, undead: FX.thrust, prism: FX.beam, clockwork: FX.shot, orks: FX.chop, ashen: FX.claws };
/** Рукопашные: капитаны, легенды-бойцы, пехота Орды, Нежити и Синклита. */
export const isMelee = (k: Kind, f: FactionId) => k === 'captain' || (k === 'guard' && GUARD_FX[f] !== FX.shot && GUARD_FX[f] !== FX.beam);
export function attackFx(k: Kind, f: FactionId, variant = 0) {
  if (k === 'guard') return GUARD_FX[f];
  if (k === 'captain') return f === 'ashen' || f === 'orks' ? FX.claws : FX.chop;
  if (k === 'legend') return variant === 2 ? FX.fire : variant === 1 ? FX.chop : FX.beam;
  return FX.shot;
}
/** Рукопашная пехота: дальность в упор, бьёт сильнее и реже, бегает быстрее. */
const MELEE_GUARD = { range: 1.4, dmg: 6.5, cd: 1.3, speed: 8.6 };

// ---------- капитан: опыт, уровни 1–10 и дерево способностей (CaptainLevelUp, CaptainAbilities) ----------
export const XP_KILL: Partial<Record<Kind, number>> = { builder: 5, guard: 20, captain: 40, legend: 200 };
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
const capOf = (s: State, owner: number) => s.units.find(u => u.owner === owner && u.kind === 'captain');
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
export const ENERGY_COST: Partial<Record<Kind, number>> = { turret: 30 };
export const ENERGY_INCOME: Partial<Record<Kind, number>> = { foundry: 2, pump: 4 };
export const RELIC_RATE = 1 / 20; // реликвий в секунду с одной реликтовой точки
/**
 * Апгрейды (команда 'upgrade'). lvl 1 -> 2. Штаб: тир 2 открывает остальные апгрейды.
 * Пост 2 уровня: урон x2.3, дальность +3, получает вдвое меньше урона. Отряд 2 уровня: урон x1.6, получает на 20% меньше.
 */
export type Upgrade = { cost: number; energy: number; relics: number; time: number; tier: number; name: string };
export const UPGRADES: Partial<Record<Kind, Upgrade>> = {
  turret: { cost: 90, energy: 40, relics: 0, time: 10, tier: 2, name: 'Тяжёлая турель' },
  guard: { cost: 80, energy: 50, relics: 0, time: 8, tier: 2, name: 'Тяжёлое оружие' },
  captain: { cost: 0, energy: 0, relics: 2, time: 5, tier: 1, name: 'Реликвийный доспех' },
};
const LVL2 = { dmg: { post: 1, turret: 1.8, guard: 1.6, captain: 1.5 } as Partial<Record<Kind, number>>, armor: { post: 1, turret: 0.6, guard: 0.8, captain: 0.7 } as Partial<Record<Kind, number>>, range: { post: 0, turret: 3 } as Partial<Record<Kind, number>> };
export const BUILD_TIER: Record<Buildable, number> = { barracks: 1, post: 1, turret: 1, foundry: 1, pump: 1, key1: 1, key2: 2, key3: 3, key4: 4, gate: 5, wall: 1, wallgate: 1, bunker: 2, mine: 1 };
export const maxHp = (k: Kind) => STATS[k].hp * STATS[k].n;
/** Сколько моделей показывать: хп пула / хп одной модели, округлено вверх. */
export const members = (k: Kind, hp: number) => (hp <= 0 ? 0 : Math.min(STATS[k].n, Math.ceil(hp / STATS[k].hp - 1e-6)));

export const REINFORCE_COST = 18; // за порцию в одну модель
export const REINFORCE_TIME = 1.2;
export const CAP = { builder: 4, guard: 8 };
export const QUEUE_MAX = 5;
export const CAPTAIN_RESPAWN = 15;
export const START_REQ = 300;
export const HQ_POS = [[12, 12], [88, 88], [88, 12], [12, 88]];
export const POINTS = [[50, 50], [50, 18], [50, 82], [18, 50], [82, 50]];
export const POINT_R = 6;
export const RELICS = [[30, 30], [70, 70]]; // реликтовые точки: захват стоянием, дают реликвии
export const VENTS = [[30, 58], [70, 42], [40, 8], [60, 92]]; // жилы под глубинные насосы
export const MAX_PLAYERS = HQ_POS.length;

export type Order =
  | { t: 'move'; x: number; y: number }
  | { t: 'amove'; x: number; y: number }
  | { t: 'attack'; id: number }
  | { t: 'build'; id: number };
export type Unit = {
  id: number; owner: number; kind: Kind; x: number; y: number; hp: number; face: number;
  cd: number; order: Order | null;
  q: number; prog: number;      // очередь найма и прогресс текущего (hq, barracks)
  build: number;                // 0..1, готовность постройки (у юнитов всегда 1)
  dead: number;                 // таймер возрождения капитана
  by: number;                   // кто ударил последним (опыт за убийство)
  rush: number; stand: number;  // Рывок и Последний рубеж: оставшиеся секунды
  reinf: boolean; rt: number;   // идёт пополнение отряда
  hit: number;                  // секунд с последнего урона (пополнять под огнём нельзя)
  lvl: number; upg: number;     // уровень и прогресс апгрейда в секундах (-1: нет)
  sm: number;                   // множитель скорости фракции на этот тик
};
export type Point = { x: number; y: number; owner: number; prog: number; by: number; relic?: boolean };
export type Player = {
  req: number; energy: number; relics: number; alive: boolean; tier: number;
  faction: FactionId; rage: number; waagh: number; remains: number; // ярость и ВААГХ Орды, останки Нежити
  research: number;                  // битовая маска изученного (RESEARCH)
  xp: number; clvl: number; pts: number; abil: number; acd: number[]; // капитан: опыт, уровень, очки, способности и их перезарядка
};
export type State = {
  tick: number; units: Unit[]; points: Point[]; players: Player[]; nextId: number;
  winner: number | null; shots: number[][];
  rewind: { owner: number; x: number; y: number; t: number }[]; // Перезавод Династий: отряды, которые встанут
};
export type Cmd =
  | { c: 'move' | 'amove'; ids: number[]; x: number; y: number }
  | { c: 'attack'; ids: number[]; id: number }
  | { c: 'stop'; ids: number[] }
  | { c: 'train'; id: number }
  | { c: 'build'; ids: number[]; kind: Buildable; x: number; y: number }
  | { c: 'assist'; ids: number[]; id: number }
  | { c: 'reinforce'; ids: number[] }
  | { c: 'upgrade'; id: number }
  | { c: 'research'; id: number; r: number }
  | { c: 'summon'; id: number; v: number }
  | { c: 'wall'; ids: number[]; x1: number; y1: number; x2: number; y2: number }
  | { c: 'learn'; a: number }
  | { c: 'ability'; a: number };

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const dist = (a: { x: number; y: number }, b: { x: number; y: number }) => Math.hypot(a.x - b.x, a.y - b.y);

export function newState(n: number, factions: FactionId[] = []): State {
  const s: State = { tick: 0, units: [], points: [...POINTS.map(([x, y]) => ({ x, y, owner: -1, prog: 0, by: -1 })), ...RELICS.map(([x, y]) => ({ x, y, owner: -1, prog: 0, by: -1, relic: true }))], players: [], nextId: 1, winner: null, shots: [], rewind: [] };
  for (let i = 0; i < n; i++) {
    s.players.push({ req: START_REQ, energy: 0, relics: 0, alive: true, tier: 1, faction: factions[i] ?? 'order', rage: 0, waagh: 0, remains: 0, research: 0, xp: 0, clvl: 1, pts: 1, abil: 0, acd: ABILITIES.map(() => 0) });
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
  const u: Unit = { id: s.nextId++, owner, kind, x, y, hp: maxHp(kind), face: Math.atan2(MAP.h / 2 - y, MAP.w / 2 - x), cd: 0, order: null, q: 0, prog: 0, build: 1, dead: 0, reinf: false, rt: 0, hit: 9, lvl: 1, upg: -1, sm: 1, by: -1, rush: 0, stand: 0 };
  s.units.push(u);
  return u;
}

const count = (s: State, owner: number, k: Kind) => s.units.filter(u => u.owner === owner && u.kind === k && u.hp > 0).length;
const hqOf = (s: State, owner: number) => s.units.find(u => u.kind === 'hq' && u.owner === owner);
const producing = (k: Kind): Kind | null => (k === 'hq' ? 'builder' : k === 'barracks' ? 'guard' : null);
export const queued = (s: State, owner: number, what: Kind) => s.units.reduce((n, u) => n + (u.owner === owner && producing(u.kind) === what ? u.q : 0), 0);

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
const speedMul = (s: State, u: Unit) => { const p = s.players[u.owner]; return (u.kind === 'guard' && isMelee('guard', p.faction) ? MELEE_GUARD.speed / STATS.guard.speed : 1) * (p.faction === 'order' ? 0.9 : p.faction === 'orks' && p.waagh > 0 ? 1.3 : 1) * (has(p, 7) ? 1.1 : 1) * (u.kind === 'legend' && u.q === 1 ? 1.5 : 1) * (u.rush > 0 ? 2 : 1); };
/** Урон атакующего: ВААГХ +30%, Синклит вне Порчи −10%, ближний бой Консенсуса −40%. */
function dmgMul(s: State, u: Unit) {
  const p = s.players[u.owner];
  const r = (u.kind === 'guard' ? (has(p, 2) ? 1.1 : 1) * (has(p, 9) ? 1.1 : 1) : 1) * (u.kind === 'turret' && has(p, 5) ? 1.25 : 1) * (u.kind === 'captain' && has(p, 10) ? 1.2 : 1) * (u.kind === 'legend' && u.q === 1 ? 1.5 : 1) * (u.rush > 0 ? 1.5 : 1) * (u.kind === 'guard' && nearCapWith(s, u, 6, 12) ? 1.15 : 1);
  return r * factionDmg(s, u, p);
}
function factionDmg(s: State, u: Unit, p: Player) {
  if (p.faction === 'orks' && p.waagh > 0) return 1.3;
  if (p.faction === 'ashen' && !nearOwn(s, u.owner, u.x, u.y, 14)) return 0.9;
  if (p.faction === 'prism' && STATS[u.kind].range < 5) return 0.6;
  return 1;
}
/** Получаемый урон: Орден −13% (у своих реликвариев и штаба ещё −20%, Свет веры), Орда +15%. */
function armorMul(s: State, t: Unit) {
  const f = fac(s, t.owner), p = s.players[t.owner];
  if (isStruct(t.kind)) return STRUCT_ARMOR * (has(p, 4) ? 0.8 : 1) * (t.kind === 'post' && t.lvl >= 2 ? 0.5 : 1) * (t.kind === 'wall' ? 0.6 : 1);
  if (s.units.some(b => b.kind === 'bunker' && b.owner === t.owner && b.build >= 1 && b.hp > 0 && dist(b, t) < STATS.bunker.radius + 3)) return 0.5; // крипта-бункер
  const res = (nearCapWith(s, t, 0, 12) ? 0.85 : 1) * (t.kind === 'guard' && has(p, 0) ? 0.9 : 1) * ((t.kind === 'captain' || t.kind === 'legend') && has(p, 13) ? 0.8 : 1);
  return res * factionArmor(f, s, t);
}
function factionArmor(f: FactionId, s: State, t: Unit) {
  if (f === 'order') return 0.87 * (nearOwn(s, t.owner, t.x, t.y, 12, ['post', 'hq']) ? 0.8 : 1);
  if (f === 'orks') return 1.15;
  return 1;
}
const rangeMul = (s: State, u: Unit) => (fac(s, u.owner) === 'prism' ? 1.15 : 1);
/** Плата: Династии платят всё энергией (влияния у них нет). */
function pay(p: Player, req: number, energy = 0, relics = 0): string | undefined {
  if (p.faction === 'clockwork') { energy += req; req = 0; }
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
    const what = b && producing(b.kind);
    if (!b || !what) return;
    if (b.build < 1) return 'Строительство не завершено';
    if (b.q >= QUEUE_MAX) return 'Очередь заполнена';
    if (count(s, owner, what) + queued(s, owner, what) >= CAP[what as 'builder' | 'guard'] + (what === 'guard' && has(p, 12) ? 2 : 0)) return 'Достигнут лимит';
    if (what === 'guard' && p.faction === 'undead' && p.remains >= REMAINS_PER_SQUAD) { p.remains -= REMAINS_PER_SQUAD; b.q++; return; } // Жатва
    const e = pay(p, trainCost(p.faction, what));
    if (e) return e;
    b.q++;
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
    const hitFoes = (r: number, dmg: number) => { for (const v of s.units) if (v.owner !== owner && v.hp > 0 && dist(v, c) < r) { v.hp -= dmg; v.hit = 0; v.by = owner; } };
    if (a === 1) for (const v of allies(10)) v.hp = Math.min(maxHp(v.kind), v.hp + maxHp(v.kind) * 0.25);
    if (a === 3) c.rush = 5;
    if (a === 4) hitFoes(6, 150);
    if (a === 5) hitFoes(12, 500);
    if (a === 7) for (const v of allies(15)) v.hp = Math.min(maxHp(v.kind), v.hp + maxHp(v.kind) * 0.15);
    if (a === 8) for (const v of allies(12)) v.stand = 6;
    if (s.shots.length < 200) s.shots.push([c.x, c.y, c.x, c.y - 0.1]);
    return;
  }
  if (cmd.c === 'research') {
    const b = s.units.find(v => v.id === cmd.id && v.owner === owner && v.hp > 0 && v.build >= 1 && /^key[1-4]$/.test(v.kind));
    const r = Number(cmd.r);
    if (!b || !Number.isInteger(r) || r < 0 || r > 3) return;
    const i = (Number(b.kind[3]) - 1) * 4 + r;
    if (has(p, i)) return 'Уже изучено';
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
  if (cmd.c === 'upgrade') {
    const u = s.units.find(v => v.id === cmd.id && v.owner === owner && v.hp > 0);
    const up = u && UPGRADES[u.kind];
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
  if (cmd.c === 'stop') { for (const u of mine) u.order = null; return; }
  if (cmd.c === 'reinforce') { for (const u of mine) if (u.kind === 'guard' && u.hp < maxHp('guard')) u.reinf = true; return; }
  if (cmd.c === 'attack') {
    const t = s.units.find(u => u.id === cmd.id && u.owner !== owner && u.hp > 0);
    if (t) for (const u of mine) if (STATS[u.kind].dmg > 0) u.order = { t: 'attack', id: t.id };
    return;
  }
  if (cmd.c === 'assist') {
    const t = s.units.find(u => u.id === cmd.id && u.owner === owner && isStruct(u.kind) && u.hp > 0);
    if (t) for (const u of mine) if (u.kind === 'builder') u.order = { t: 'build', id: t.id };
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
    if (p.faction === 'clockwork' ? p.energy < c.cost + (ENERGY_COST[cmd.kind] ?? 0) : p.req < c.cost || p.energy < (ENERGY_COST[cmd.kind] ?? 0)) return p.req < c.cost && p.faction !== 'clockwork' ? 'Не хватает влияния' : 'Не хватает энергии';
    let x = clamp(cmd.x, 4, MAP.w - 4), y = clamp(cmd.y, 4, MAP.h - 4);
    if (cmd.kind === 'post') {
      const pt = s.points.filter(q => !q.relic && dist(q, { x, y }) < 9).sort((a, b) => dist(a, { x, y }) - dist(b, { x, y }))[0];
      if (!pt) return 'Пост строится у стратегической точки';
      if (pt.owner >= 0 && pt.owner !== owner) return 'Точка занята врагом';
      ({ x, y } = pt);
      if (s.units.some(u => u.kind === 'post' && u.hp > 0 && dist(u, pt) < 2)) return 'На точке уже есть пост';
    } else if (cmd.kind === 'pump') {
      const v = VENTS.map(([vx, vy]) => ({ x: vx, y: vy })).filter(q => dist(q, { x, y }) < 6).sort((a, b) => dist(a, { x, y }) - dist(b, { x, y }))[0];
      if (!v) return 'Насос ставится на жилу';
      ({ x, y } = v);
    } else if (cmd.kind === 'mine' || cmd.kind === 'wallgate' || cmd.kind === 'bunker' || cmd.kind === 'wall') { // укрепления: своя или нейтральная земля
      if (s.units.some(u => u.kind === 'hq' && u.owner !== owner && u.hp > 0 && dist(u, { x, y }) < 20)) return 'Слишком близко к чужому штабу';
    } else if (cmd.kind === 'turret' && p.faction === 'orks') { // Орда ставит турели где угодно, кроме 20 м у чужого штаба
      if (s.units.some(u => u.kind === 'hq' && u.owner !== owner && u.hp > 0 && dist(u, { x, y }) < 20)) return 'Слишком близко к чужому штабу';
    } else if (cmd.kind === 'turret' || cmd.kind === 'foundry' || /^key|^gate/.test(cmd.kind)) {
      if (/^key|^gate/.test(cmd.kind) && s.units.some(u => u.owner === owner && u.kind === cmd.kind && u.hp > 0)) return 'Ключевое здание уже есть';
      if (!s.units.some(u => u.owner === owner && isStruct(u.kind) && u.kind !== 'turret' && u.hp > 0 && dist(u, { x, y }) < 16)) return 'Турель ставится рядом с вашим штабом, казармами или постом';
    } else {
      const hq = hqOf(s, owner), d = hq ? dist(hq, { x, y }) : 99;
      if (d < 8 || d > 32) return 'Казармы строятся рядом со штабом';
    }
    if (cmd.kind === 'turret' && count(s, owner, 'turret') >= (p.faction === 'orks' ? 30 : TURRET_CAP)) return 'Лимит турелей';
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
  const income = s.players.map(() => 1), energy = s.players.map(() => 0), relics = s.players.map(() => 0);
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
  for (const p of s.players) for (let i = 0; i < p.acd.length; i++) p.acd[i] = Math.max(0, p.acd[i] - dt);
  const byId = new Map(s.units.map(u => [u.id, u]));
  for (const u of s.units) {
    if (!s.players[u.owner].alive) continue;
    u.hit += dt;
    u.rush = Math.max(0, u.rush - dt); u.stand = Math.max(0, u.stand - dt);
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
  for (const m of s.units) { // мины: срабатывают от врага рядом, бьют по площади и исчезают
    if (m.kind !== 'mine' || m.build < 1 || m.hp <= 0) continue;
    if (!s.units.some(e => e.owner !== m.owner && !isStruct(e.kind) && e.hp > 0 && dist(e, m) < STATS.mine.range)) continue;
    for (const e of s.units) if (e.owner !== m.owner && e.hp > 0 && dist(e, m) < 6) { e.hp -= STATS.mine.dmg; e.hit = 0; e.by = m.owner; }
    m.hp = 0;
    if (s.shots.length < 200) s.shots.push([m.x, m.y, m.x, m.y - 0.1]);
  }
  separate(s);
  capture(s, dt);
  cleanup(s);
}

const postAt = (s: State, pt: { x: number; y: number }) => s.units.find(u => u.kind === 'post' && u.build >= 1 && u.hp > 0 && dist(u, pt) < 2);

function produce(s: State, b: Unit, dt: number) {
  const p = s.players[b.owner];
  if (/^key[1-4]$/.test(b.kind) && b.q > 0) { // исследование
    if ((b.prog += dt) >= researchCost(b.q - 1).time) { p.research |= 1 << (b.q - 1); b.q = 0; b.prog = 0; }
    return;
  }
  if (b.kind === 'gate' && b.q > 0) { // призыв легенды: 20 с, виден всем
    if ((b.prog += dt) >= SUMMON_TIME) { const l = spawn(s, b.owner, 'legend', ...nearHq(b.x, b.y, STATS.gate.radius + 2.5)); l.q = b.q - 1; b.q = 0; b.prog = 0; }
    return;
  }
  if (b.kind === 'key4' && has(p, 14)) p.relics += dt / 120; // Ковчег мощей
  const what = producing(b.kind);
  if (!what || b.q <= 0) return;
  b.prog += dt;
  if (b.prog >= STATS[what].time * (what === 'guard' && has(p, 1) ? 0.85 : 1)) {
    b.prog = 0; b.q--;
    spawn(s, b.owner, what, ...nearHq(b.x, b.y, STATS[b.kind].radius + 2.5));
  }
}

function reinforce(s: State, u: Unit, dt: number) {
  if (!u.reinf) return;
  if (u.hp >= maxHp('guard') - 1e-6) { u.reinf = false; return; }
  if (u.hit < 2) return; // под огнём пополняться нельзя
  u.rt += dt;
  if (u.rt < REINFORCE_TIME) return;
  const p = s.players[u.owner];
  if (pay(p, REINFORCE_COST)) { u.reinf = false; return; }
  u.rt = 0;
  u.hp = Math.min(maxHp('guard'), u.hp + STATS.guard.hp);
}

function go(u: Unit, x: number, y: number, dt: number) {
  const dx = x - u.x, dy = y - u.y, d = Math.hypot(dx, dy);
  if (d < 1e-6) return;
  u.face = Math.atan2(dy, dx);
  const m = Math.min(STATS[u.kind].speed * u.sm * dt, d);
  u.x += (dx / d) * m; u.y += (dy / d) * m;
}

function act(s: State, u: Unit, dt: number, byId: Map<number, Unit>) {
  const st = STATS[u.kind];
  u.cd = Math.max(0, u.cd - dt);
  u.sm = speedMul(s, u);
  if (u.kind === 'legend' && u.q === 0) for (const v of s.units) if (v.owner === u.owner && !isStruct(v.kind) && v.hp > 0 && dist(v, u) < 15) v.hp = Math.min(maxHp(v.kind), v.hp + maxHp(v.kind) * 0.05 * dt); // аура лечения
  if (fac(s, u.owner) === 'ashen' && !isStruct(u.kind) && u.hp < maxHp(u.kind) && nearOwn(s, u.owner, u.x, u.y, 14)) u.hp = Math.min(maxHp(u.kind), u.hp + maxHp(u.kind) * 0.02 * dt); // Порча лечит
  if (isStruct(u.kind) && u.build < 1) return; // стройка ещё не работает
  const o = u.order;
  if (o?.t === 'build') {
    const site = byId.get(o.id);
    if (!site || site.hp <= 0 || site.build >= 1) { // стена: строитель переходит к следующему недостроенному сегменту рядом
      const next = s.units.filter(v => v.owner === u.owner && v.kind === 'wall' && v.build < 1 && v.hp > 0 && dist(v, u) < 12).sort((a, b) => dist(a, u) - dist(b, u))[0];
      u.order = next ? { t: 'build', id: next.id } : null;
      return;
    }
    if (dist(u, site) - STATS[site.kind].radius > 2) { go(u, site.x, site.y, dt); return; }
    const c = STATS[site.kind];
    const slow = (fac(s, u.owner) === 'clockwork' ? 0.75 : 1) * (hasR(s, u.owner, 3) ? 1.2 : 1); // Династии −25%, Свитки каменщиков +20%
    site.build = Math.min(1, site.build + (dt * slow) / c.time);
    site.hp = Math.min(c.hp, site.hp + (c.hp * dt) / c.time);
    return;
  }
  if (o?.t === 'move') {
    if (Math.hypot(o.x - u.x, o.y - u.y) < 0.6) u.order = null; else go(u, o.x, o.y, dt);
    return;
  }
  if (st.dmg === 0) return; // строители не воюют
  let target: Unit | undefined;
  if (o?.t === 'attack') {
    target = byId.get(o.id);
    if (!target || target.hp <= 0) { u.order = null; target = undefined; }
  }
  if (!target) { // свободный юнит и attack-move сами ищут ближайшего врага
    let best: number = st.sight + (hasR(s, u.owner, 11) ? 4 : 0);
    for (const v of s.units) {
      if (v.owner === u.owner || v.hp <= 0 || !s.players[v.owner].alive) continue;
      const d = dist(u, v) - STATS[v.kind].radius;
      if (d < best) { best = d; target = v; }
    }
  }
  if (target) {
    const d = dist(u, target) - STATS[target.kind].radius;
    u.face = Math.atan2(target.y - u.y, target.x - u.x);
    const melee = u.kind === 'guard' && isMelee('guard', fac(s, u.owner));
    if (d <= (u.kind === 'post' && u.lvl >= 3 ? 12 : melee ? MELEE_GUARD.range : st.range) * rangeMul(s, u) + (u.lvl > 1 ? LVL2.range[u.kind] ?? 0 : 0) + ((u.kind === 'post' || u.kind === 'turret') && hasR(s, u.owner, 8) ? 3 : 0)) {
      if (u.cd === 0) {
        u.cd = melee ? MELEE_GUARD.cd : st.cd;
        const mult = u.lvl > 1 ? LVL2.dmg[u.kind] ?? 1 : 1, armor = target.lvl > 1 ? LVL2.armor[target.kind] ?? 1 : 1;
        const dealt = (u.kind === 'post' && u.lvl >= 3 ? 14 : melee ? MELEE_GUARD.dmg : st.dmg) * (u.kind === 'guard' ? members('guard', u.hp) : 1) * mult * armor * dmgMul(s, u) * armorMul(s, target);
        target.hp -= dealt; target.by = u.owner;
        if (u.kind === 'legend' && u.q === 2) for (const v of s.units) if (v !== target && v.owner === target.owner && v.hp > 0 && dist(v, target) < 4) { v.hp -= dealt * 0.5; v.by = u.owner; } // огненная буря
        const pa = s.players[u.owner];
        if (pa.faction === 'orks' && pa.waagh <= 0) { pa.rage += dealt * 0.08 + (target.hp <= 0 ? 6 : 0); if (pa.rage >= RAGE_MAX) { pa.rage = 0; pa.waagh = WAAGH_TIME; } } // Ярость
        target.hit = 0;
        if (s.shots.length < 200) s.shots.push([u.x, u.y, target.x, target.y, attackFx(u.kind, fac(s, u.owner), u.q)]);
      }
    } else if (st.speed) go(u, target.x, target.y, dt);
    return;
  }
  if (u.order?.t === 'amove') {
    if (Math.hypot(u.order.x - u.x, u.order.y - u.y) < 0.6) u.order = null; else go(u, u.order.x, u.order.y, dt);
  }
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
      if (h.kind === 'mine' || (h.kind === 'wallgate' && h.owner === a.owner)) continue;
      const dx = a.x - h.x, dy = a.y - h.y, d = Math.hypot(dx, dy), min = STATS[h.kind].radius + STATS[a.kind].radius * 0.6;
      if (d < min && d > 1e-3) { a.x = h.x + (dx / d) * min; a.y = h.y + (dy / d) * min; }
    }
    a.x = clamp(a.x, 0.5, MAP.w - 0.5); a.y = clamp(a.y, 0.5, MAP.h - 0.5);
  }
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
      p.prog += dt / 4;
      if (p.prog >= 1) { p.owner = o; p.prog = 0; p.by = -1; gainXp(s, o, XP_CAPTURE); }
    } else if (p.prog > 0) {
      p.prog = Math.max(0, p.prog - dt / 8);
      if (p.prog === 0) p.by = -1;
    }
  }
}

function cleanup(s: State) {
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
      const cap = s.units.find(c => c.owner === u.owner && c.kind === 'captain' && c.hp > 0 && dist(c, u) < 15);
      if (cap || nearOwn(s, u.owner, u.x, u.y, 20, ['hq'])) s.rewind.push({ owner: u.owner, x: u.x, y: u.y, t: 12 * (s.points.some(p => p.owner === u.owner) ? 0.7 : 1) });
    }
  }
  for (const u of s.units) if (u.kind === 'hq' && u.hp <= 0) s.players[u.owner].alive = false;
  s.units = s.units.filter(u => s.players[u.owner].alive && (u.hp > 0 || u.kind === 'captain'));
  for (const p of s.points) if (p.owner >= 0 && !s.players[p.owner].alive) p.owner = -1;
  const alive = s.players.flatMap((p, i) => (p.alive ? [i] : []));
  if (alive.length <= 1) s.winner = alive.length ? alive[0] : -1;
}

const prodPct = (u: Unit) => u.q <= 0 || u.kind === 'legend' ? 0
  : /^key/.test(u.kind) ? Math.floor((u.prog / researchCost(u.q - 1).time) * 100)
  : u.kind === 'gate' ? Math.floor((u.prog / SUMMON_TIME) * 100)
  : producing(u.kind) ? Math.floor((u.prog / STATS[producing(u.kind)!].time) * 100) : 0;

/** Компактный снимок для сети: целые числа вместо float, чтобы JSON был короче. */
export type Snap = { tick: number; u: number[][]; p: number[][]; pl: number[][]; sh: number[][]; w: number | null };
export function snapshot(s: State): Snap {
  return {
    tick: s.tick,
    // [id, owner, kind, x*10, y*10, hp, face*100, очередь, стройка %, пополняется, уровень, апгрейд %, найм текущего %]
    u: s.units.map(u => [u.id, u.owner, KINDS.indexOf(u.kind), Math.round(u.x * 10), Math.round(u.y * 10), Math.max(0, Math.round(u.hp)), Math.round(u.face * 100), u.q, Math.floor(u.build * 100), u.reinf ? 1 : 0, u.lvl, u.upg < 0 ? -1 : Math.floor((u.upg / (u.kind === 'hq' ? TIER_TIME : u.kind === 'post' ? 12 : UPGRADES[u.kind]!.time)) * 100), prodPct(u)]),
    p: s.points.map(p => [p.owner, Math.round(p.prog * 100), p.by]),
    pl: s.players.map(p => [Math.floor(p.req), p.alive ? 1 : 0, p.tier, Math.floor(p.energy), Math.floor(p.relics), Math.floor(p.rage), Math.ceil(p.waagh), p.remains, p.research, p.clvl, Math.floor(p.xp), p.pts, p.abil, ...p.acd.map(Math.ceil)]), // 9..13 капитан, 14+ перезарядки способностей
    sh: s.shots.map(v => v.map(n => Math.round(n * 10))),
    w: s.winner,
  };
}
