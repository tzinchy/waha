// Вся игровая логика. Чистые функции без DOM и сети: сервер гонит step(), клиент только рисует snapshot().
export const MAP = { w: 100, h: 100 };
export const DT = 1 / 20;

export type Weapon = 'sword' | 'hammer';
export type CaptainCfg = { armor: number; trim: number; weapon: Weapon; banner: boolean; faction?: 'legion' | 'heretics' | 'scrap' | 'necrons' | 'drukhari' | 'daemons' };
export type Kind = 'captain' | 'builder' | 'guard' | 'hq' | 'barracks' | 'post' | 'turret';
export const KINDS: Kind[] = ['captain', 'builder', 'guard', 'hq', 'barracks', 'post', 'turret'];
export const isStruct = (k: Kind) => k === 'hq' || k === 'barracks' || k === 'post' || k === 'turret';
export type Buildable = 'barracks' | 'post' | 'turret';

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
};
/**
 * Апгрейды (команда 'upgrade'). lvl 1 -> 2. Штаб: тир 2 открывает остальные апгрейды.
 * Пост 2 уровня: урон x2.3, дальность +3, получает вдвое меньше урона. Отряд 2 уровня: урон x1.6, получает на 20% меньше.
 */
export const UPGRADES: Partial<Record<Kind, { cost: number; time: number; tier: number; name: string }>> = {
  hq: { cost: 200, time: 30, tier: 1, name: 'Тир 2' },
  post: { cost: 100, time: 12, tier: 2, name: 'Укрепить пост' },
  turret: { cost: 90, time: 10, tier: 2, name: 'Тяжёлая турель' },
  guard: { cost: 80, time: 8, tier: 2, name: 'Тяжёлое оружие' },
};
const LVL2 = { dmg: { post: 2.3, turret: 1.8, guard: 1.6 } as Partial<Record<Kind, number>>, armor: { post: 0.5, turret: 0.6, guard: 0.8 } as Partial<Record<Kind, number>>, range: { post: 3, turret: 3 } as Partial<Record<Kind, number>> };
export const BUILD_TIER: Record<Buildable, number> = { barracks: 1, post: 1, turret: 1 };
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
  reinf: boolean; rt: number;   // идёт пополнение отряда
  hit: number;                  // секунд с последнего урона (пополнять под огнём нельзя)
  lvl: number; upg: number;     // уровень и прогресс апгрейда в секундах (-1: нет)
  gear?: Partial<Record<'weapon' | 'armor' | 'mobility' | 'relic', number>>;
  grenadeCd?: number;
};
export type Point = { x: number; y: number; owner: number; prog: number; by: number };
export type Player = { req: number; alive: boolean; tier: number };
export type State = {
  tick: number; units: Unit[]; points: Point[]; players: Player[]; nextId: number;
  winner: number | null; shots: number[][];
  blasts?: { x: number; y: number; age: number; radius: number }[];
  nuclearCooldowns?: number[];
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
  | { c: 'equip'; id: number; slot: 'weapon' | 'armor' | 'mobility' | 'relic' }
  | { c: 'nuke'; x: number; y: number }
  | { c: 'grenade'; id: number; x: number; y: number };

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const dist = (a: { x: number; y: number }, b: { x: number; y: number }) => Math.hypot(a.x - b.x, a.y - b.y);

export function newState(n: number): State {
  const s: State = { tick: 0, units: [], points: POINTS.map(([x, y]) => ({ x, y, owner: -1, prog: 0, by: -1 })), players: [], nextId: 1, winner: null, shots: [], blasts: [], nuclearCooldowns: Array(n).fill(0) };
  for (let i = 0; i < n; i++) {
    s.players.push({ req: START_REQ, alive: true, tier: 1 });
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

function spawn(s: State, owner: number, kind: Kind, x: number, y: number): Unit {
  const u: Unit = { id: s.nextId++, owner, kind, x, y, hp: maxHp(kind), face: Math.atan2(MAP.h / 2 - y, MAP.w / 2 - x), cd: 0, order: null, q: 0, prog: 0, build: 1, dead: 0, reinf: false, rt: 0, hit: 9, lvl: 1, upg: -1 };
  s.units.push(u);
  return u;
}

const count = (s: State, owner: number, k: Kind) => s.units.filter(u => u.owner === owner && u.kind === k && u.hp > 0).length;
const hqOf = (s: State, owner: number) => s.units.find(u => u.kind === 'hq' && u.owner === owner);
const producing = (k: Kind): Kind | null => (k === 'hq' ? 'builder' : k === 'barracks' ? 'guard' : null);
export const queued = (s: State, owner: number, what: Kind) => s.units.reduce((n, u) => n + (u.owner === owner && producing(u.kind) === what ? u.q : 0), 0);

/**
 * Команда игрока. Всё, что пришло от клиента, проверяется здесь: чужие юниты, NaN, огромные массивы.
 * Возвращает текст ошибки, если команду нельзя выполнить (сервер покажет его игроку).
 */
export function applyCmd(s: State, owner: number, cmd: Cmd): string | undefined {
  const p = s.players[owner];
  if (s.winner !== null || !p?.alive || !cmd || typeof cmd !== 'object') return;
  if (cmd.c === 'grenade') {
    const u = s.units.find(v => v.id === cmd.id && v.owner === owner && v.hp > 0 && (v.kind === 'captain' || v.kind === 'guard'));
    if (!u) return 'Гранату может бросить только капитан или гвардия';
    if (!Number.isFinite(cmd.x) || !Number.isFinite(cmd.y) || cmd.x < 0 || cmd.x > MAP.w || cmd.y < 0 || cmd.y > MAP.h) return 'Недопустимая цель';
    if (Math.hypot(cmd.x - u.x, cmd.y - u.y) > 14) return 'Цель слишком далеко';
    if ((u.grenadeCd ?? 0) > 0) return 'Граната перезаряжается';
    u.grenadeCd = 18;
    for (const target of s.units) {
      if (target.hp <= 0 || target.owner === owner) continue;
      const d = Math.hypot(target.x - cmd.x, target.y - cmd.y);
      if (d <= 4 + STATS[target.kind].radius) {
        target.hp -= 110 * Math.max(0.2, 1 - d / (4 + STATS[target.kind].radius));
        target.hit = 0;
      }
    }
    (s.blasts ??= []).push({ x: cmd.x, y: cmd.y, age: 0, radius: 4 });
    return;
  }
  if (cmd.c === 'equip') {
    const u = s.units.find(v => v.id === cmd.id && v.owner === owner && v.hp > 0 && !isStruct(v.kind));
    const slots = ['weapon', 'armor', 'mobility', 'relic'] as const;
    if (!u || !slots.includes(cmd.slot)) return 'Недопустимый юнит или слот';
    if (p.tier < 2) return 'Нужен тир 2';
    const gear = u.gear ?? (u.gear = {});
    const current = gear[cmd.slot] ?? 0;
    if (current >= 2) return 'Максимальный уровень снаряжения';
    const cost = (current + 1) * 125;
    if (p.req < cost) return 'Не хватает requisition';
    p.req -= cost; gear[cmd.slot] = current + 1;
    if (cmd.slot === 'armor') u.hp += STATS[u.kind].hp * STATS[u.kind].n * 0.15;
    return;
  }
  if (cmd.c === 'nuke') {
    if (!Number.isFinite(cmd.x) || !Number.isFinite(cmd.y) || cmd.x < 0 || cmd.x > MAP.w || cmd.y < 0 || cmd.y > MAP.h) return 'Недопустимая цель';
    if (p.tier < 2 || !s.units.some(u => u.owner === owner && u.kind === 'hq' && u.hp > 0)) return 'Нужен штаб второго уровня';
    const cooldown = s.nuclearCooldowns ?? (s.nuclearCooldowns = Array(s.players.length).fill(0));
    if (cooldown[owner] > 0) return 'Ядерное оружие перезаряжается';
    if (p.req < 900) return 'Не хватает requisition';
    p.req -= 900; cooldown[owner] = 240;
    const radius = 17;
    for (const u of s.units) {
      if (u.hp <= 0) continue;
      const d = Math.hypot(u.x - cmd.x, u.y - cmd.y);
      if (d > radius + STATS[u.kind].radius) continue;
      const falloff = Math.max(0.15, 1 - d / (radius + STATS[u.kind].radius));
      u.hp -= 650 * falloff; u.hit = 0;
    }
    (s.blasts ??= []).push({ x: cmd.x, y: cmd.y, age: 0, radius });
    return;
  }
  if (cmd.c === 'train') {
    const b = s.units.find(u => u.id === cmd.id && u.owner === owner && u.hp > 0);
    const what = b && producing(b.kind);
    if (!b || !what) return;
    if (b.build < 1) return 'Строительство не завершено';
    if (b.q >= QUEUE_MAX) return 'Очередь заполнена';
    if (count(s, owner, what) + queued(s, owner, what) >= CAP[what as 'builder' | 'guard']) return 'Достигнут лимит';
    if (p.req < STATS[what].cost) return 'Не хватает requisition';
    p.req -= STATS[what].cost; b.q++;
    return;
  }
  if (cmd.c === 'upgrade') {
    const u = s.units.find(v => v.id === cmd.id && v.owner === owner && v.hp > 0);
    const up = u && UPGRADES[u.kind];
    if (!u || !up) return;
    if (u.build < 1) return 'Строительство не завершено';
    if (u.lvl >= 2 || u.upg >= 0) return 'Уже улучшено';
    if (p.tier < up.tier) return `Нужен тир ${up.tier}`;
    if (p.req < up.cost) return 'Не хватает requisition';
    p.req -= up.cost; u.upg = 0;
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
  if (cmd.c === 'build') {
    const bs = mine.filter(u => u.kind === 'builder');
    if (!bs.length) return 'Нужны строители';
    if (!(cmd.kind in BUILD_TIER) || !Number.isFinite(cmd.x) || !Number.isFinite(cmd.y)) return;
    if (p.tier < BUILD_TIER[cmd.kind]) return `Нужен тир ${BUILD_TIER[cmd.kind]}`;
    const c = STATS[cmd.kind];
    if (p.req < c.cost) return 'Не хватает requisition';
    let x = clamp(cmd.x, 4, MAP.w - 4), y = clamp(cmd.y, 4, MAP.h - 4);
    if (cmd.kind === 'post') {
      const pt = s.points.filter(q => dist(q, { x, y }) < 9).sort((a, b) => dist(a, { x, y }) - dist(b, { x, y }))[0];
      if (!pt) return 'Пост строится у стратегической точки';
      if (pt.owner >= 0 && pt.owner !== owner) return 'Точка занята врагом';
      ({ x, y } = pt);
      if (s.units.some(u => u.kind === 'post' && u.hp > 0 && dist(u, pt) < 2)) return 'На точке уже есть пост';
    } else if (cmd.kind === 'turret') {
      if (!s.units.some(u => u.owner === owner && isStruct(u.kind) && u.kind !== 'turret' && u.hp > 0 && dist(u, { x, y }) < 16)) return 'Турель ставится рядом с вашим штабом, казармами или постом';
    } else {
      const hq = hqOf(s, owner), d = hq ? dist(hq, { x, y }) : 99;
      if (d < 8 || d > 32) return 'Казармы строятся рядом со штабом';
    }
    if (s.units.some(u => isStruct(u.kind) && u.hp > 0 && dist(u, { x, y }) < STATS[u.kind].radius + c.radius + 1)) return 'Место занято';
    p.req -= c.cost;
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
  for (const u of s.units) if (u.grenadeCd && u.grenadeCd > 0) u.grenadeCd = Math.max(0, u.grenadeCd - dt);
  if (s.nuclearCooldowns) s.nuclearCooldowns = s.nuclearCooldowns.map(v => Math.max(0, v - dt));
  if (s.blasts) {
    for (const b of s.blasts) b.age += dt;
    s.blasts = s.blasts.filter(b => b.age < 3);
  }
  const income = s.players.map(() => 1);
  for (const pt of s.points) if (pt.owner >= 0) income[pt.owner] += 1 + (postAt(s, pt)?.owner === pt.owner ? 2 : 0);
  s.players.forEach((p, i) => { if (p.alive) p.req += income[i] * dt; });
  const byId = new Map(s.units.map(u => [u.id, u]));
  for (const u of s.units) {
    if (!s.players[u.owner].alive) continue;
    u.hit += dt;
    if (u.kind === 'captain' && u.hp <= 0) {
      u.dead += dt;
      const hq = hqOf(s, u.owner);
      if (u.dead >= CAPTAIN_RESPAWN && hq) { u.hp = maxHp('captain'); u.dead = 0; u.order = null; [u.x, u.y] = nearHq(hq.x, hq.y, 8); }
      continue;
    }
    if (u.hp <= 0) continue;
    if (u.upg >= 0) { // идёт апгрейд
      const up = UPGRADES[u.kind]!;
      if ((u.upg += dt) >= up.time) { u.upg = -1; u.lvl = 2; if (u.kind === 'hq') s.players[u.owner].tier = 2; }
    }
    if (u.build >= 1) produce(s, u, dt);
    act(s, u, dt, byId);
    reinforce(s, u, dt);
  }
  separate(s);
  capture(s, dt);
  cleanup(s);
}

const postAt = (s: State, pt: { x: number; y: number }) => s.units.find(u => u.kind === 'post' && u.build >= 1 && u.hp > 0 && dist(u, pt) < 2);

function produce(s: State, b: Unit, dt: number) {
  const what = producing(b.kind);
  if (!what || b.q <= 0) return;
  b.prog += dt;
  if (b.prog >= STATS[what].time) {
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
  if (p.req < REINFORCE_COST) { u.reinf = false; return; }
  p.req -= REINFORCE_COST; u.rt = 0;
  u.hp = Math.min(maxHp('guard'), u.hp + STATS.guard.hp);
}

function go(u: Unit, x: number, y: number, dt: number) {
  const dx = x - u.x, dy = y - u.y, d = Math.hypot(dx, dy);
  if (d < 1e-6) return;
  u.face = Math.atan2(dy, dx);
  const m = Math.min(STATS[u.kind].speed * (1 + (u.gear?.mobility ?? 0) * 0.1) * dt, d);
  u.x += (dx / d) * m; u.y += (dy / d) * m;
}

function act(s: State, u: Unit, dt: number, byId: Map<number, Unit>) {
  const st = STATS[u.kind];
  u.cd = Math.max(0, u.cd - dt);
  if (isStruct(u.kind) && u.build < 1) return; // стройка ещё не работает
  const o = u.order;
  if (o?.t === 'build') {
    const site = byId.get(o.id);
    if (!site || site.hp <= 0 || site.build >= 1) { u.order = null; return; }
    if (dist(u, site) - STATS[site.kind].radius > 2) { go(u, site.x, site.y, dt); return; }
    const c = STATS[site.kind];
    site.build = Math.min(1, site.build + dt / c.time);
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
    let best: number = st.sight;
    for (const v of s.units) {
      if (v.owner === u.owner || v.hp <= 0 || !s.players[v.owner].alive) continue;
      const d = dist(u, v) - STATS[v.kind].radius;
      if (d < best) { best = d; target = v; }
    }
  }
  if (target) {
    const d = dist(u, target) - STATS[target.kind].radius;
    u.face = Math.atan2(target.y - u.y, target.x - u.x);
    if (d <= st.range + (u.lvl > 1 ? LVL2.range[u.kind] ?? 0 : 0)) {
      if (u.cd === 0) {
        u.cd = st.cd;
        const mult = u.lvl > 1 ? LVL2.dmg[u.kind] ?? 1 : 1, armor = target.lvl > 1 ? LVL2.armor[target.kind] ?? 1 : 1;
        target.hp -= st.dmg * (u.kind === 'guard' ? members('guard', u.hp) : 1) * mult * armor * (1 + (u.gear?.weapon ?? 0) * 0.1) * (1 - (target.gear?.armor ?? 0) * 0.1);
        target.hit = 0;
        if (s.shots.length < 200) s.shots.push([u.x, u.y, target.x, target.y]);
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
      if (p.prog >= 1) { p.owner = o; p.prog = 0; p.by = -1; }
    } else if (p.prog > 0) {
      p.prog = Math.max(0, p.prog - dt / 8);
      if (p.prog === 0) p.by = -1;
    }
  }
}

function cleanup(s: State) {
  for (const u of s.units) if (u.kind === 'hq' && u.hp <= 0) s.players[u.owner].alive = false;
  s.units = s.units.filter(u => s.players[u.owner].alive && (u.hp > 0 || u.kind === 'captain'));
  for (const p of s.points) if (p.owner >= 0 && !s.players[p.owner].alive) p.owner = -1;
  const alive = s.players.flatMap((p, i) => (p.alive ? [i] : []));
  if (alive.length <= 1) s.winner = alive.length ? alive[0] : -1;
}

/** Компактный снимок для сети: целые числа вместо float, чтобы JSON был короче. */
export type Snap = { tick: number; u: number[][]; p: number[][]; pl: number[][]; sh: number[][]; w: number | null; blasts?: number[][]; gear?: number[][]; nuclearCooldowns?: number[] };
export function snapshot(s: State): Snap {
  return {
    tick: s.tick,
    // [id, owner, kind, x*10, y*10, hp, face*100, очередь, стройка %, пополняется, уровень, апгрейд %]
    u: s.units.map(u => [u.id, u.owner, KINDS.indexOf(u.kind), Math.round(u.x * 10), Math.round(u.y * 10), Math.max(0, Math.round(u.hp)), Math.round(u.face * 100), u.q, Math.floor(u.build * 100), u.reinf ? 1 : 0, u.lvl, u.upg < 0 ? -1 : Math.floor((u.upg / UPGRADES[u.kind]!.time) * 100)]),
    p: s.points.map(p => [p.owner, Math.round(p.prog * 100), p.by]),
    pl: s.players.map(p => [Math.floor(p.req), p.alive ? 1 : 0, p.tier]),
    sh: s.shots.map(v => v.map(n => Math.round(n * 10))),
    w: s.winner,
    blasts: (s.blasts ?? []).map(b => [Math.round(b.x * 10), Math.round(b.y * 10), Math.round(b.age * 100), Math.round(b.radius * 10)]),
    gear: s.units.map(u => [u.id, u.gear?.weapon ?? 0, u.gear?.armor ?? 0, u.gear?.mobility ?? 0, u.gear?.relic ?? 0]),
    nuclearCooldowns: (s.nuclearCooldowns ?? []).map(v => Math.ceil(v)),
  };
}
