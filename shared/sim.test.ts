import { test } from 'node:test';
import { BLOCKS, MAP, blocked } from './mapdata.ts';
import assert from 'node:assert/strict';
import { FROM_FAC, statOf, DOOM, archOf, resourceCost, ROLES, CAPTURE_TIME, TIER_TIME, KINDS, setMap, snapshotFor, hurt, spawn, RESEARCH, TIER_UP, RAGE_MAX, applyCmd, members as membersOf_, maxHp as maxHpOf, newState, step, DT, START_REQ, FSTATS, POINTS, RELICS, VENTS, MAPS, BCELL, footRect, wallCells, flies, producible, FACTION_ONLY, TRIBUTE, isStruct, type Kind, type State } from './sim.ts';

/** Тесты идут за Инквизицию (раса по умолчанию): статы — её, из мода. */
const STATS = FSTATS.inquisition!;
const maxHp = (k: Kind, f: Parameters<typeof maxHpOf>[1] = 'inquisition') => maxHpOf(k, f);
const members = (k: Kind, hp: number, f: Parameters<typeof membersOf_>[2] = 'inquisition') => membersOf_(k, hp, f);
/** Тесты движка: дерево требований UA выключено (чит), его проверяют отдельные тесты UA. */
const freeState = (...a: Parameters<typeof newState>) => { const s = newState(...a); for (const p of s.players) Object.assign(p, { cheat: true, req: 1e4, energy: 1e4 }); return s; }; // цены мода выше стартовых ресурсов
const run = (s: State, sec: number) => { for (let i = 0; i < sec / DT; i++) step(s); };
const unit = (s: State, owner: number, kind: Kind) => s.units.find(u => u.owner === owner && u.kind === kind)!;
/** Капитана теперь заказывают в штабе: тестам, которым он нужен с первой секунды, ставим его у штаба явно. */
const captainAt = (s: State, owner: number) => s.units.find(u => u.owner === owner && u.kind === 'captain') ?? spawn(s, owner, 'captain', unit(s, owner, 'hq').x + 8, unit(s, owner, 'hq').y + 8);

/** Строим казармы и нанимаем отряд гвардии: общий путь для нескольких тестов. */
function withGuard(s: State) {
  const b = unit(s, 0, 'builder'), hq = unit(s, 0, 'hq');
  assert.equal(applyCmd(s, 0, { c: 'build', ids: [b.id], kind: 'barracks', x: hq.x + 10, y: hq.y + 10 }), undefined);
  const bar = unit(s, 0, 'barracks');
  run(s, STATS.barracks.time + 10); // время стройки — из мода
  assert.equal(bar.build, 1);
  applyCmd(s, 0, { c: 'train', id: bar.id });
  run(s, STATS.guard.time + 1);
  return unit(s, 0, 'guard');
}

test('старт: штаб и строители, герой заказывается в здании мода по цене мода и после гибели сам не встаёт', async () => {
  const { HERO_AT } = await import('./sim.ts');
  assert.equal(HERO_AT.tyranids, 'hq', 'Тиран улья — в улье, как в моде');
  assert.equal(HERO_AT.inquisition, 'motorpool', 'Лорд-инквизитор — в «Дозоре» (watch), как в моде');
  const s = freeState(2), p = s.players[0];
  for (const k of ['hq', 'builder'] as Kind[]) assert.ok(unit(s, 0, k), k);
  assert.ok(!s.units.some(u => u.kind === 'captain'), 'капитана на старте нет');
  assert.equal(newState(2).players[0].req, START_REQ, 'стартовые ресурсы');
  assert.match(applyCmd(s, 0, { c: 'hero', a: p.arch }) ?? '', /Watch/, 'без «Дозора» Лорда не заказать');
  const hq = unit(s, 0, 'hq'); spawn(s, 0, 'motorpool', hq.x + 16, hq.y).build = 1;
  assert.equal(applyCmd(s, 0, { c: 'hero', a: p.arch }), undefined, 'заказ в «Дозоре»');
  assert.match(applyCmd(s, 0, { c: 'hero', a: p.arch }) ?? '', /уже/, 'второй раз в очередь не встаёт');
  run(s, statOf('captain', p.faction).time + 1);
  const c = unit(s, 0, 'captain');
  assert.ok(c && c.hp > 0, 'капитан вышел из здания');
  assert.equal(c.hp, statOf('captain', p.faction).hp, 'HP героя — из мода');
  c.hp = 0; run(s, 60);
  assert.ok(c.hp <= 0, 'павший сам не возрождается');
  assert.equal(applyCmd(s, 0, { c: 'hero', a: p.arch }), undefined, 'павшего заказывают заново');
  run(s, statOf('captain', p.faction).time + 1);
  assert.equal(c.hp, statOf('captain', p.faction).hp, 'павший встаёт с полным HP мода');
});

test('штаб нанимает строителя за requisition', () => {
  const s = freeState(2), before = s.players[0].req;
  applyCmd(s, 0, { c: 'train', id: unit(s, 0, 'hq').id });
  assert.ok(s.players[0].req <= before - STATS.builder.cost + 0.01);
  run(s, STATS.builder.time + 0.5);
  assert.equal(s.units.filter(u => u.owner === 0 && u.kind === 'builder').length, 2);
});

test('строители строят казармы, казармы нанимают полный отряд из 5 бойцов', () => {
  const g = withGuard(freeState(2));
  assert.equal(members('guard', g.hp), STATS.guard.n);
});

test('пополнение: докупаем потерянных бойцов за requisition, под огнём нельзя', () => {
  const s = freeState(2);
  const g = withGuard(s);
  g.hp = STATS.guard.hp; g.hit = 0; // остался один целый боец, только что получили урон
  const before = s.players[0].req;
  applyCmd(s, 0, { c: 'reinforce', ids: [g.id] });
  run(s, 1.5);
  assert.equal(g.hp, STATS.guard.hp, 'под огнём пополнение стоит');
  run(s, 6 + STATS.guard.time * 12); // в моде бойцы добираются по одному, до максимума отряда
  assert.ok(g.hp >= maxHp('guard'));
  void before; // цену пополнения UA проверяет тест «пополнение отрядов UA»
});

test('пост: только на своей точке (как в DoW) и держит её; на ничьей и вражеской нельзя', () => {
  const s = freeState(2);
  const b = unit(s, 0, 'builder'), [px, py] = POINTS[1];
  s.points[2].owner = 1;
  assert.match(applyCmd(s, 0, { c: 'build', ids: [b.id], kind: 'post', x: POINTS[2][0], y: POINTS[2][1] }) ?? '', /врагом/);
  assert.match(applyCmd(s, 0, { c: 'build', ids: [b.id], kind: 'post', x: px + 2, y: py }) ?? '', /захватите/);
  assert.match(applyCmd(s, 0, { c: 'build', ids: [b.id], kind: 'mine', x: px + 2, y: py }) ?? '', /захватите/);
  s.points[1].owner = 0;
  assert.equal(applyCmd(s, 0, { c: 'build', ids: [b.id], kind: 'post', x: px + 2, y: py }), undefined);
  run(s, 60); // карта крупная: строителю идти до точки
  assert.equal(s.units.find(u => u.kind === 'post')!.build, 1);
  assert.equal(s.points[1].owner, 0);
});

test('турель ставится у своих построек, строится за время мода', () => {
  const s = freeState(2);
  const hq = unit(s, 0, 'hq'), b = unit(s, 0, 'builder');
  assert.match(applyCmd(s, 0, { c: 'build', ids: [b.id], kind: 'turret', x: hq.x + 60, y: hq.y + 60 }) ?? '', /у своих построек|скалах/);
  assert.equal(applyCmd(s, 0, { c: 'build', ids: [b.id], kind: 'turret', x: hq.x + 7, y: hq.y }), undefined);
  run(s, STATS.turret.time + 5);
  assert.equal(unit(s, 0, 'turret').build, 1);
});
test('найм в недостроенном здании отклоняется', () => {
  const s = freeState(2);
  const b = unit(s, 0, 'builder'), hq = unit(s, 0, 'hq');
  applyCmd(s, 0, { c: 'build', ids: [b.id], kind: 'barracks', x: hq.x + 10, y: hq.y + 10 });
  assert.match(applyCmd(s, 0, { c: 'train', id: unit(s, 0, 'barracks').id }) ?? '', /не завершено/);
});

test('команды: чужими юнитами управлять нельзя, кривая постройка отклоняется', () => {
  const s = freeState(2);
  const enemy = captainAt(s, 1);
  applyCmd(s, 0, { c: 'move', ids: [enemy.id], x: 50, y: 50 });
  assert.equal(enemy.order, null);
  const b = unit(s, 0, 'builder');
  assert.match(applyCmd(s, 0, { c: 'build', ids: [b.id], kind: 'barracks', x: 100, y: 150 }) ?? '', /рядом со штабом/);
  assert.match(applyCmd(s, 0, { c: 'build', ids: [b.id], kind: 'post', x: 30, y: 30 }) ?? '', /точки/);
  assert.equal(applyCmd(s, 0, { c: 'move', ids: [captainAt(s, 0).id], x: NaN, y: 1 }), undefined);
  assert.equal(captainAt(s, 0).order, null);
});

test('бой: тяжёлое оружие добивает вражескую базу, игра заканчивается победой', () => {
  const s = freeState(2);
  const hq = unit(s, 1, 'hq'), cap = spawn(s, 0, 'heavy', hq.x - 20, hq.y); // в моде стрелковое по зданиям не бьёт (пробитие 0), тяжёлое — бьёт
  hq.hp = 1; // уже разбитая база
  applyCmd(s, 0, { c: 'attack', ids: [cap.id], id: hq.id });
  run(s, 240);
  assert.equal(s.winner, 0);
});

test('энергия: литейня и насос на жиле дают энергию; турель стоит энергию', () => {
  const s = freeState(2);
  const b = unit(s, 0, 'builder'), hq = unit(s, 0, 'hq');
  s.players[0].energy = 0;
  assert.match(applyCmd(s, 0, { c: 'build', ids: [b.id], kind: 'turret', x: hq.x + 7, y: hq.y }) ?? '', /энергии/);
  assert.equal(applyCmd(s, 0, { c: 'build', ids: [b.id], kind: 'foundry', x: hq.x + 8, y: hq.y + 3 }), undefined);
  run(s, STATS.foundry.time + 10);
  assert.equal(unit(s, 0, 'foundry').build, 1);
  const e = s.players[0].energy;
  run(s, 5);
  assert.ok(s.players[0].energy > e + 9, 'литейня даёт 2/с');
  assert.match(applyCmd(s, 0, { c: 'build', ids: [b.id], kind: 'pump', x: 50, y: 50 }) ?? '', /жилу/);
  assert.equal(applyCmd(s, 0, { c: 'build', ids: [b.id], kind: 'pump', x: VENTS[0][0] + 2, y: VENTS[0][1] }), undefined);
});

test('укрепления: стена строится по сегментам и не пускает, мина бьёт по площади', () => {
  const s = freeState(2);
  const b = unit(s, 0, 'builder');
  s.players[0].req = 2000;
  assert.equal(applyCmd(s, 0, { c: 'wall', ids: [b.id], x1: 70, y1: 6, x2: 70, y2: 18 }), undefined);
  const walls = s.units.filter(u => u.kind === 'wall');
  assert.ok(walls.length >= 5, 'сегменты заложены');
  run(s, 120 + walls.length * STATS.wall.time);
  assert.ok(walls.every(w => w.build === 1), 'строитель обошёл все сегменты');
  const cap = captainAt(s, 0);
  [cap.x, cap.y] = [66, 12];
  applyCmd(s, 0, { c: 'move', ids: [cap.id], x: 76, y: 12 });
  for (let i = 0; i < 20 * 8; i++) { const x0 = cap.x; run(s, 0.05); if ((x0 - 70) * (cap.x - 70) <= 0) assert.ok(cap.y < 5.5 || cap.y > 18.5, 'сквозь стену не прошёл'); } // обходит, а не проходит насквозь
  assert.ok(cap.x > 70, 'обошёл стену и дошёл');
  assert.equal(applyCmd(s, 0, { c: 'build', ids: [b.id], kind: 'mine', x: 58, y: 32 }), undefined);
  run(s, 60 + STATS.mine.time); // по эту сторону стены: обхода препятствий у юнитов нет
  const enemy = captainAt(s, 1), hp = enemy.hp;
  [enemy.x, enemy.y] = [58, 33];
  run(s, 0.2);
  assert.ok(enemy.hp <= hp - 170, 'мина сработала');
  assert.ok(!s.units.some(u => u.kind === 'mine'), 'мина исчезла');
});

test('сетка построек: стена встаёт на любой свободной земле, клетка за клеткой без дыр', () => {
  const s = freeState(2), b = unit(s, 0, 'builder'), hq = unit(s, 0, 'hq'), foe = unit(s, 1, 'hq');
  s.players[0].req = 1e6;
  for (let x = 6; x < MAP.w; x += 22) for (let y = 6; y < MAP.h; y += 22) {
    if (blocked(x, y, 4) || blocked(x + 3, y, 4)) continue; // скалы карты
    const far = (q: { x: number; y: number }, d: number) => Math.hypot(q.x - x, q.y - y) > d;
    if (far({ x: POINTS[0][0], y: POINTS[0][1] }, 14) && far(foe, 22) && far(hq, 8)) assert.equal(applyCmd(s, 0, { c: 'wall', ids: [b.id], x1: x, y1: y, x2: x + 3, y2: y }), undefined, `${x},${y}`);
  }
  assert.ok(s.units.filter(u => u.kind === 'wall').every(w => w.x % BCELL === 1 && w.y % BCELL === 1), 'сегменты по центрам клеток');
  const cells = wallCells(101, 301, 120, 290); // косая протяжка: соседние клетки — по стороне
  assert.ok(cells.length <= 16 && cells.every((c, i) => !i || Math.abs(c.x - cells[i - 1].x) + Math.abs(c.y - cells[i - 1].y) === BCELL), 'без диагональных дыр');
  assert.match(applyCmd(s, 0, { c: 'wall', ids: [b.id], x1: POINTS[0][0], y1: POINTS[0][1], x2: POINTS[0][0] + 4, y2: POINTS[0][1] }) ?? '', /нельзя/, 'не у критической точки');
  assert.match(applyCmd(s, 0, { c: 'wall', ids: [b.id], x1: foe.x + 10, y1: foe.y, x2: foe.x + 12, y2: foe.y }) ?? '', /нельзя/, 'не у чужого штаба');
  const [bx, by, bw, bh] = BLOCKS.find(([, , w, h]) => w >= 8 && h >= 8)!;
  assert.match(applyCmd(s, 0, { c: 'wall', ids: [b.id], x1: bx + bw / 2 - 2, y1: by + bh / 2, x2: bx + bw / 2 + 2, y2: by + bh / 2 }) ?? '', /нельзя/, 'не на скалах');
});

test('сетка построек: здание привязано к клеткам, занятость по квадратным следам, юниты обходят', () => {
  const s = freeState(2), b = unit(s, 0, 'builder'), hq = unit(s, 0, 'hq');
  s.players[0].req = 1e4;
  assert.equal(applyCmd(s, 0, { c: 'build', ids: [b.id], kind: 'barracks', x: hq.x + 13.3, y: hq.y + 0.7 }), undefined);
  const bar = unit(s, 0, 'barracks'), f = footRect('barracks', bar.x, bar.y);
  assert.deepEqual([bar.x, bar.y], [(f.x0 + f.n / 2) * BCELL, (f.y0 + f.n / 2) * BCELL], 'центр на сетке');
  assert.equal(applyCmd(s, 0, { c: 'build', ids: [b.id], kind: 'barracks', x: bar.x, y: bar.y + (f.n - 1) * BCELL }), 'Место занято', 'следы пересекаются');
  assert.equal(applyCmd(s, 0, { c: 'build', ids: [b.id], kind: 'barracks', x: bar.x, y: bar.y + f.n * BCELL }), undefined, 'вплотную по клеткам можно');
  const cap = captainAt(s, 0), w = spawn(s, 0, 'barracks', 100, 90), g = footRect('barracks', w.x, w.y); // открытая земля «Перевала»
  [cap.x, cap.y] = [w.x - 12, w.y];
  applyCmd(s, 0, { c: 'move', ids: [cap.id], x: w.x + 12, y: w.y });
  for (let i = 0; i < 6 / DT; i++) {
    step(s);
    const inside = cap.x > g.x0 * BCELL && cap.x < (g.x0 + g.n) * BCELL && cap.y > g.y0 * BCELL && cap.y < (g.y0 + g.n) * BCELL;
    assert.ok(!inside, 'не проходит сквозь здание');
  }
  assert.ok(Math.hypot(cap.x - (w.x + 12), cap.y - w.y) < 1, 'обошёл и дошёл');
});

test('туман войны прячет далёких врагов', () => {
  const f = freeState(2), far = unit(f, 1, 'hq');
  const snap = snapshotFor(f, 0);
  assert.ok(!snap.u.some(r => r[0] === far.id), 'чужой штаб в тумане');
  assert.ok(snap.u.some(r => r[0] === unit(f, 0, 'hq').id), 'свой штаб виден');
  const scout = captainAt(f, 0); [scout.x, scout.y] = [far.x - 8, far.y];
  assert.ok(snapshotFor(f, 0).u.some(r => r[0] === far.id), 'разведка открыла штаб');
  const g = freeState(2), home = unit(g, 0, 'hq'), pt = [...g.points].sort((a, b) => Math.hypot(b.x - home.x, b.y - home.y) - Math.hypot(a.x - home.x, a.y - home.y))[0], foe = spawn(g, 1, 'guard', pt.x + 5, pt.y);
  assert.ok(!snapshotFor(g, 0).u.some(r => r[0] === foe.id), 'чужая точка не светит');
  pt.owner = 0;
  assert.ok(snapshotFor(g, 0).u.some(r => r[0] === foe.id), 'своя точка без башни снимает туман');
});

test('точки: турели вокруг своей точки, у критической точки строить нельзя', () => {
  const s = freeState(2, ['inquisition', 'inquisition']);
  const p = s.players[0], b = unit(s, 0, 'builder'), hq = unit(s, 0, 'hq');
  p.req = 1e4; p.tier = 1;
  const pt = s.points[3]; pt.owner = 0;
  assert.equal(applyCmd(s, 0, { c: 'build', ids: [b.id], kind: 'turret', x: pt.x + 8, y: pt.y }), undefined, 'турель у своей точки');
  assert.match(applyCmd(s, 0, { c: 'build', ids: [b.id], kind: 'turret', x: s.points[0].x + 4, y: s.points[0].y }) ?? '', /критической/);
  assert.match(applyCmd(s, 0, { c: 'build', ids: [b.id], kind: 'post', x: s.points[0].x, y: s.points[0].y }) ?? '', /критической/);
});

test('здоровье по лестнице, артиллерия не бьёт в упор', () => {
  const tot = (k: Parameters<typeof maxHp>[0]) => maxHp(k);
  assert.ok(tot('guard') < tot('titan') && tot('hq') < tot('titan'), 'титан крепче всех'); // остальная лестница — как в моде
  const s = freeState(2, ['inquisition', 'inquisition']);
  const p = s.players[0], hq = unit(s, 0, 'hq'); p.req = 1e4; p.tier = 2;
  // артиллерия: цель в 6 м — не стреляет, в 30 м — стреляет
  const art = spawn(s, 0, 'arty', 120, 150), near = spawn(s, 1, 'guard', 126, 150), hp0 = near.hp;
  run(s, 3);
  assert.equal(near.hp, hp0, 'мёртвая зона');
  near.x = 155; near.y = 150; spawn(s, 0, 'sniper', 150, 156); run(s, 6); // корректировщик рядом с целью
  assert.ok(near.hp < hp0, 'достаёт издалека'); void art;
});

test('захват точки длится 12 секунд, отсутствие войск сбрасывает прогресс', () => {
  const s = freeState(2), p = s.points[3], cap = captainAt(s, 0);
  [cap.x, cap.y] = [p.x, p.y];
  run(s, 6);
  assert.equal(p.owner, -1, 'короткого присутствия уже недостаточно');
  assert.ok(p.prog > 0.49 && p.prog < 0.51);
  cap.x += POINTS.length * 10;
  run(s, CAPTURE_TIME + DT);
  assert.equal(p.owner, -1); assert.equal(p.prog, 0);
  [cap.x, cap.y] = [p.x, p.y];
  run(s, 12 - DT);
  assert.equal(p.owner, -1, 'раньше 12 секунд точка не захвачена');
  run(s, DT * 2);
  assert.equal(p.owner, 0);
});


test('отмена найма из очереди возвращает ресурсы полностью', () => {
  const s = freeState(2), p = s.players[0], hq = unit(s, 0, 'hq');
  Object.assign(p, { req: 1000, energy: 500 });
  const b = spawn(s, 0, 'barracks', hq.x + 12, hq.y);
  assert.equal(applyCmd(s, 0, { c: 'train', id: b.id, k: 'guard' }), undefined);
  assert.equal(applyCmd(s, 0, { c: 'train', id: b.id, k: 'guard' }), undefined);
  assert.ok(p.req < 1000);
  run(s, 2);
  applyCmd(s, 0, { c: 'cancel', id: b.id, i: 1 }); applyCmd(s, 0, { c: 'cancel', id: b.id, i: 0 });
  assert.equal(b.que.length, 0);
  assert.equal(b.prog, 0);
  assert.ok(p.req >= 1000, 'влияние вернулось (плюс доход за 2 с)');
});

test('очередь приказов (Shift): юнит выполняет приказы по порядку, обычный приказ очередь сбрасывает', () => {
  const s = freeState(2), b = unit(s, 0, 'builder'), [x0, y0] = [b.x, b.y];
  applyCmd(s, 0, { c: 'move', ids: [b.id], x: x0 + 10, y: y0 });
  applyCmd(s, 0, { c: 'move', ids: [b.id], x: x0 + 10, y: y0 + 10, q: true });
  assert.equal(b.queue?.length, 1, 'второй приказ — в очереди');
  run(s, 6);
  assert.ok(Math.hypot(b.x - (x0 + 10), b.y - (y0 + 10)) < 1.5, 'дошёл до второй точки через первую');
  applyCmd(s, 0, { c: 'move', ids: [b.id], x: x0, y: y0 }); applyCmd(s, 0, { c: 'move', ids: [b.id], x: x0 + 5, y: y0, q: true });
  applyCmd(s, 0, { c: 'move', ids: [b.id], x: x0 + 3, y: y0 + 3 });
  assert.equal(b.queue, undefined, 'приказ без Shift очищает очередь');
});

test('каждая фракция может заказать каждого юнита в каждом своём здании и каждого героя, и он выходит', async () => {
  const { FACTION_IDS, ARCH_OPTS } = await import('./factions.ts');
  for (const f of FACTION_IDS) {
    const s = freeState(2, [f, 'inquisition']), p = s.players[0], hq = unit(s, 0, 'hq');
    p.cheat = true; p.relics = 5; // реликварии держим (реликвии не копятся)
    p.tier = 5; s.points[0].owner = 0; // титан — только с критической точкой
    const homes = ([...new Set(['barracks', 'motorpool', 'yard', ...(f === 'inquisition' ? ['warpgate'] : []), ...Object.values(FROM_FAC[f] ?? {}).filter(k => k !== 'hq')])] as Kind[]).map((k, i) => { const b = spawn(s, 0, k, hq.x + 20 + i * 18, hq.y + 20); b.build = 1; return b; });
    for (const b of [hq, ...homes]) for (const k of producible(b.kind, f)) {
      Object.assign(p, { req: 1e6, energy: 1e6, relics: 1e3 });
      for (const u of s.units) if (u.owner === 0 && !isStruct(u.kind) && u.kind !== 'builder') u.hp = 0; // освободить лимит
      for (const u of s.units) if (u.owner === 1) u.hp = 1e9; // титаны мода (Imperator) сносят штаб за секунды — враг не должен пасть посреди проверки
      run(s, 0.2);
      assert.equal(applyCmd(s, 0, { c: 'train', id: b.id, k }), undefined, `${f}: заказ ${k} в ${b.kind}`);
      run(s, statOf(k, f).time + 2);
      assert.ok(s.units.some(u => u.owner === 0 && u.kind === k && u.hp > 0), `${f}: ${k} вышел из ${b.kind}`);
    }
    for (const a of Object.keys(ARCH_OPTS[f]) as ('assault' | 'commander' | 'mystic')[]) {
      Object.assign(p, { req: 1e6, energy: 1e6, relics: 1e3 });
      assert.equal(applyCmd(s, 0, { c: 'hero', a }), undefined, `${f}: герой ${a}`);
    }
  }
});

test('мегапостройка бьёт на 200 м и засвечивает место удара', () => {
  const s = freeState(2), hq = unit(s, 0, 'hq'), foe = unit(s, 1, 'hq');
  const d = Math.hypot(hq.x - foe.x, hq.y - foe.y), m = spawn(s, 0, 'spire', foe.x + (hq.x - foe.x) * 150 / d, foe.y + (hq.y - foe.y) * 150 / d); m.build = 1;
  for (const u of s.units) if (u.owner === 1 && u !== foe) u.hp = 0; // цель одна — вражеский штаб
  assert.ok(Math.hypot(foe.x - m.x, foe.y - m.y) < 200, 'штаб врага в досягаемости');
  const hp = foe.hp;
  run(s, 26);
  assert.ok(foe.hp < hp, 'удар дошёл');
  assert.ok(snapshotFor(s, 0).u.some(r => r[0] === foe.id), 'место удара засвечено');
});

test('исследования UA: изучаются в своём здании за ресурсы и меняют юнитов (HP ликтора)', async () => {
  const { UA_RESEARCH, hpOf } = await import('./sim.ts');
  const s = freeState(2, ['tyranids', 'inquisition']), p = s.players[0];
  const R = UA_RESEARCH.tyranids!, i = R.findIndex(r => r.mods.some(m => m.type === 'health_maximum' && /lictor/.test(m.target))), x = R[i];
  assert.ok(x, 'есть исследование на HP ликтора');
  const hq = unit(s, 0, 'hq'), b = spawn(s, 0, x.at, hq.x + 20, hq.y + 20), lictor = spawn(s, 0, 'sniper', hq.x + 10, hq.y);
  b.build = 1;
  const hp0 = hpOf(lictor);
  Object.assign(p, { req: 1e4, energy: 1e4 });
  assert.equal(applyCmd(s, 0, { c: 'uar', id: b.id, r: i }), undefined);
  assert.ok(p.req < 1e4 || p.energy < 1e4, 'исследование стоит ресурсов');
  assert.match(applyCmd(s, 0, { c: 'uar', id: b.id, r: i }) ?? '', /занято/);
  run(s, x.time + 1);
  assert.ok(p.ur?.includes(i), 'изучено');
  assert.ok(hpOf(lictor) > hp0, 'ликтор крепче после исследования');
  assert.ok(hpOf(spawn(s, 0, 'sniper', hq.x + 12, hq.y)) > hp0, 'новый ликтор — тоже');
});

test('стволы UA по умолчанию — как в моде: воины тиранид рукопашные, пожиратель покупается и даёт дальность', async () => {
  const { UA_ARM, UA_WEAPONS, ST } = await import('./sim.ts');
  assert.ok(!UA_WEAPONS.tyranids!.heavy!.some(w => /devourer|bioplasma/.test(w)), 'пожиратель и биоплазма не даются даром');
  assert.ok(statOf('heavy', 'tyranids').range <= 3, 'без покупки — ближний бой');
  const A = UA_ARM.tyranids!.heavy!, w = A.opts.findIndex(o => /devourer/.test(o.file)), o = A.opts[w];
  assert.ok(w >= 0 && o.range > 20, 'пожиратель — в покупках, стрелковый');
  const s = freeState(2, ['tyranids', 'inquisition']), g = spawn(s, 0, 'heavy', 100, 100);
  s.players[0].tier = 4; spawn(s, 0, 'key4', 60, 60).build = 1; // требования ствола: тир и здание
  assert.equal(applyCmd(s, 0, { c: 'uaw', id: g.id, w }), undefined);
  run(s, o.time + 0.5);
  assert.equal(ST(g).range, o.range, 'со стволом бьёт с его дальности');
  assert.ok(statOf('heavy', 'tyranids').range <= 3, 'у других отрядов того же вида — по-прежнему ближний бой');
});

test('оружие UA побойцово: Серые Рыцари покупают психопушку из панели отряда, бьют сильнее, лимит отряда держит', async () => {
  const { UA_ARM } = await import('./sim.ts');
  const A = UA_ARM.inquisition?.guard, w = A?.opts.findIndex(o => /psycannon/.test(o.file)) ?? -1, o = A!.opts[w];
  assert.ok(A && w >= 0 && A.ups === 2, 'у Серых Рыцарей психопушка, до 2 стволов');
  const setup = () => {
    const s = freeState(2, ['inquisition', 'tyranids']), p = s.players[0];
    s.units = s.units.filter(u => u.kind === 'hq'); s.points = [];
    for (const k of ['bunker', 'key1'] as const) spawn(s, 0, k, 60 + (k === 'bunker' ? 0 : 20), 60).build = 1; // требования ствола: бункер и либрариум
    Object.assign(p, { req: 1e4, energy: 1e4 });
    const g = spawn(s, 0, 'guard', 100, 100); g.hit = 99;
    return { s, p, g };
  };
  const { s, p, g } = setup();
  assert.equal(applyCmd(s, 0, { c: 'uaw', id: g.id, w }), undefined);
  assert.equal(p.req, 1e4 - o.cost, 'цена ствола из мода');
  assert.match(applyCmd(s, 0, { c: 'uaw', id: g.id, w }) ?? '', /перевооружается/);
  run(s, o.time + 0.5);
  assert.equal(applyCmd(s, 0, { c: 'uaw', id: g.id, w }), undefined); run(s, o.time + 0.5);
  assert.deepEqual(g.wu?.[w], 2);
  assert.match(applyCmd(s, 0, { c: 'uaw', id: g.id, w }) ?? '', /Не больше 2/);
  const dealt = (buy: boolean) => {
    const { s, g } = setup(); const t = spawn(s, 1, 'mveh', 112, 100); t.frozen = 1e6;
    if (buy) g.wu = A.opts.map((_, i) => (i === w ? 2 : 0));
    applyCmd(s, 0, { c: 'attack', ids: [g.id], id: t.id });
    const hp = t.hp; run(s, 10); return hp - t.hp;
  };
  assert.ok(dealt(true) > dealt(false) * 1.2, 'с психопушками урон по технике заметно выше');
});

test('пополнение отрядов UA: павшие возвращаются, потом отряд растёт до максимума мода по цене бойца', async () => {
  const { UA_SQ, hpOf, membersOf, squadCap } = await import('./sim.ts');
  const sq = UA_SQ.tyranids!.guard!; // хормагаунты: 6 → 12
  assert.ok(sq.max > 6);
  const make = () => { const s = freeState(2, ['tyranids', 'inquisition']); s.units = s.units.filter(u => u.kind === 'hq'); s.points = []; s.players[0].req = 1e4; return s; };
  const s = make(), p = s.players[0], ctl = make(); // ctl — та же партия без пополнения: доход штаба вычитаем
  const g = spawn(s, 0, 'guard', 100, 100), one = hpOf(g) / membersOf(g);
  spawn(ctl, 0, 'guard', 100, 100);
  assert.equal(membersOf(g), 6);
  g.hp -= one * 2; g.hit = 99;
  assert.equal(applyCmd(s, 0, { c: 'reinforce', ids: [g.id] }), undefined);
  run(s, sq.time * 30); run(ctl, sq.time * 30);
  assert.equal(membersOf(g), sq.max, 'добран до максимума');
  assert.equal(squadCap(s, g), sq.max);
  assert.ok(Math.abs(ctl.players[0].req - p.req - sq.cost * (2 + sq.max - 6)) < 1, 'каждый боец — по цене пополнения мода');
});

test('аддоны UA: турель Инквизиции — ракетная по требованиям мода, ствол меняется, дальность растёт', async () => {
  const { UA_ADDONS, addonWeapon, uaMissing, UA_REQ } = await import('./sim.ts');
  const s = freeState(2, ['inquisition', 'inquisition']), p = s.players[0], hq = unit(s, 0, 'hq');
  const t = spawn(s, 0, 'turret', hq.x + 20, hq.y); t.build = 1;
  p.cheat = false; // здесь проверяем само дерево требований
  const a = UA_ADDONS.inquisition!.findIndex(x => x.id === 'inquisition_turret_addon');
  Object.assign(p, { req: 1e5, energy: 1e5 });
  assert.match(String(applyCmd(s, 0, { c: 'uaa', id: t.id, a })), /^Нужно/, 'без телепортера или астропатики — закрыто');
  const g = spawn(s, 0, 'barracks', hq.x - 20, hq.y); g.build = 1;
  assert.equal(applyCmd(s, 0, { c: 'uaa', id: t.id, a }), undefined);
  run(s, UA_ADDONS.inquisition![a].time + 1);
  assert.ok(((t.ad ?? 0) & (1 << a)) !== 0, 'аддон достроен');
  assert.ok((addonWeapon(t)?.range ?? 0) > 0, 'ракетная бьёт дальше болтера');
  assert.ok(uaMissing('tyranids', UA_REQ.tyranids!.motorpool, { built: () => true, addon: () => false, research: () => false }), 'тираниды: Carnifex Hive — после Established Link');
});

test('модификаторы исследований UA: лимиты, цена, обзор, стройка; ствол поста — только с аддоном', async () => {
  const { UA_RESEARCH, UA_ADDONS, legionCap, trainCost, sightOf, UA_UNARMED } = await import('./sim.ts');
  const s = freeState(2, ['tyranids', 'inquisition']), ty = s.players[0], iq = s.players[1];
  const R = (f: 'tyranids' | 'inquisition', id: string) => UA_RESEARCH[f]!.findIndex(r => r.id === id);
  const cap0 = legionCap(ty), titan0 = trainCost('tyranids', 'titan', ty), sight0 = sightOf(ty, { kind: 'sniper', f: 'tyranids' });
  ty.ur = [R('tyranids', 'tyranids_caps_research'), R('tyranids', 'tyranids_lictor_upgrade_research_1')];
  ty.ad = 1 << UA_ADDONS.tyranids!.findIndex(a => a.id === 'tyranids_titanchamber_addon_1'); ty.um = undefined;
  assert.equal(legionCap(ty), cap0 + 6);
  assert.equal(trainCost('tyranids', 'titan', ty), titan0 - 500);
  assert.ok(sightOf(ty, { kind: 'sniper', f: 'tyranids' }) > sight0, 'ликтор видит дальше');
  assert.equal(legionCap(iq), legionCap({ ...iq, ur: [], um: undefined })); // чужие исследования не действуют
  assert.ok(UA_UNARMED.has('inquisition/post'), 'пост Инквизиции без аддона не стреляет');
});

test('аддон турели — общее улучшение: ставится на все турели игрока, и на новые', async () => {
  const { UA_ADDONS } = await import('./sim.ts');
  const s = freeState(2, ['inquisition', 'inquisition']), hq = unit(s, 0, 'hq');
  const t1 = spawn(s, 0, 'turret', hq.x + 12, hq.y), t2 = spawn(s, 0, 'turret', hq.x - 12, hq.y), foe = spawn(s, 1, 'turret', hq.x, hq.y + 20);
  const a = UA_ADDONS.inquisition!.findIndex(x => x.id === 'inquisition_turret_addon');
  assert.equal(applyCmd(s, 0, { c: 'uaa', id: t1.id, a }), undefined);
  run(s, UA_ADDONS.inquisition![a].time + 1);
  assert.ok(t2.ad! & (1 << a), 'вторая турель тоже улучшена');
  const t3 = spawn(s, 0, 'turret', hq.x, hq.y - 12); run(s, 0.2);
  assert.ok(t3.ad! & (1 << a), 'новая турель — сразу с улучшением');
  assert.ok(!((foe.ad ?? 0) & (1 << a)), 'у противника нет');
  assert.match(applyCmd(s, 0, { c: 'uaa', id: t2.id, a }) ?? '', /Уже/);
});

test('мораль как в UA: урон по морали надламывает отряд Инквизиции, тираниды бесстрашны, надлом проходит', async () => {
  const { UA_MOR } = await import('./sim.ts');
  assert.ok(!UA_MOR.tyranids?.support, 'у термагантов морали нет');
  const s = freeState(2, ['inquisition', 'tyranids']), st = spawn(s, 0, 'support', 150, 128), mc = UA_MOR.inquisition!.support!;
  for (let i = 0; i < 4; i++) spawn(s, 1, 'support', 175, 120 + i * 5).hit = 99;
  for (let i = 0; i < 40 / DT && st.brk === undefined && st.hp > 0; i++) step(s);
  assert.ok(st.brk !== undefined, 'под огнём отряд надломился');
  for (const u of s.units) if (u.owner === 1 && !isStruct(u.kind)) u.hp = 0;
  st.hp = 1e5; run(s, mc.minTime + (mc.minMorale / mc.rate) + 2);
  assert.equal(st.brk, undefined, 'вне боя мораль вернулась, надлом прошёл');
});
