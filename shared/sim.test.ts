import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DOOM, archOf, resourceCost, ROLES, CAPTURE_TIME, TIER_TIME, KINDS, setMap, snapshotFor, hurt, spawn, RESEARCH, TIER_UP, RAGE_MAX, applyCmd, members, maxHp, newState, step, DT, START_REQ, STATS, POINTS, RELICS, VENTS, MAPS, BCELL, footRect, wallCells, flies, producible, FACTION_ONLY, TRIBUTE, isStruct, type Kind, type State } from './sim.ts';

const run = (s: State, sec: number) => { for (let i = 0; i < sec / DT; i++) step(s); };
const unit = (s: State, owner: number, kind: Kind) => s.units.find(u => u.owner === owner && u.kind === kind)!;
/** Капитана теперь заказывают в штабе: тестам, которым он нужен с первой секунды, ставим его у штаба явно. */
const captainAt = (s: State, owner: number) => s.units.find(u => u.owner === owner && u.kind === 'captain') ?? spawn(s, owner, 'captain', unit(s, owner, 'hq').x + 8, unit(s, owner, 'hq').y + 8);

/** Строим казармы и нанимаем отряд гвардии: общий путь для нескольких тестов. */
function withGuard(s: State) {
  const b = unit(s, 0, 'builder'), hq = unit(s, 0, 'hq');
  assert.equal(applyCmd(s, 0, { c: 'build', ids: [b.id], kind: 'barracks', x: hq.x + 10, y: hq.y + 10 }), undefined);
  const bar = unit(s, 0, 'barracks');
  run(s, 30);
  assert.equal(bar.build, 1);
  applyCmd(s, 0, { c: 'train', id: bar.id });
  run(s, STATS.guard.time + 1);
  return unit(s, 0, 'guard');
}

test('старт: штаб и строители, капитан заказывается в штабе и после гибели сам не встаёт (как в Soulstorm)', () => {
  const s = newState(2), p = s.players[0];
  for (const k of ['hq', 'builder'] as Kind[]) assert.ok(unit(s, 0, k), k);
  assert.ok(!s.units.some(u => u.kind === 'captain'), 'капитана на старте нет');
  assert.equal(p.req, START_REQ);
  assert.equal(applyCmd(s, 0, { c: 'hero', a: p.arch }), undefined, 'заказ в штабе');
  assert.match(applyCmd(s, 0, { c: 'hero', a: p.arch }) ?? '', /уже/, 'второй раз в очередь не встаёт');
  run(s, STATS.captain.time + 1);
  const c = unit(s, 0, 'captain');
  assert.ok(c && c.hp > 0, 'капитан вышел из штаба');
  c.hero!.lvl = 4; c.hp = 0; run(s, 60);
  assert.ok(c.hp <= 0, 'павший сам не возрождается');
  assert.equal(applyCmd(s, 0, { c: 'hero', a: p.arch }), undefined, 'павшего заказывают заново');
  run(s, STATS.captain.time + 1);
  assert.ok(c.hp > 0 && unit(s, 0, 'captain') === c && c.hero!.lvl === 4, 'встаёт тот же герой, уровень сохранён');
});

test('штаб нанимает строителя за requisition', () => {
  const s = newState(2);
  applyCmd(s, 0, { c: 'train', id: unit(s, 0, 'hq').id });
  assert.ok(s.players[0].req <= START_REQ - STATS.builder.cost + 0.01);
  run(s, STATS.builder.time + 0.5);
  assert.equal(s.units.filter(u => u.owner === 0 && u.kind === 'builder').length, 2);
});

test('строители строят казармы, казармы нанимают полный отряд из 5 бойцов', () => {
  const g = withGuard(newState(2));
  assert.equal(members('guard', g.hp), STATS.guard.n);
});

test('пополнение: докупаем потерянных бойцов за requisition, под огнём нельзя', () => {
  const s = newState(2);
  const g = withGuard(s);
  g.hp = STATS.guard.hp; g.hit = 0; // остался один целый боец, только что получили урон
  const before = s.players[0].req;
  applyCmd(s, 0, { c: 'reinforce', ids: [g.id] });
  run(s, 1.5);
  assert.equal(g.hp, STATS.guard.hp, 'под огнём пополнение стоит');
  run(s, 6);
  assert.equal(g.hp, maxHp('guard'));
  assert.equal(g.reinf, false);
  assert.ok(s.players[0].req < before, 'requisition потрачен');
});

test('пост: строитель ставит на ничьей точке, пост её забирает и держит; на вражеской нельзя', () => {
  const s = newState(2);
  const b = unit(s, 0, 'builder'), [px, py] = POINTS[1];
  s.points[2].owner = 1;
  assert.match(applyCmd(s, 0, { c: 'build', ids: [b.id], kind: 'post', x: POINTS[2][0], y: POINTS[2][1] }) ?? '', /врагом/);
  assert.equal(applyCmd(s, 0, { c: 'build', ids: [b.id], kind: 'post', x: px + 2, y: py }), undefined);
  run(s, 60); // карта крупная: строителю идти до точки
  assert.equal(s.units.find(u => u.kind === 'post')!.build, 1);
  assert.equal(s.points[1].owner, 0);
});

test('апгрейды: тир 2 у штаба открывает укрепление поста; турель ставится у своих построек', () => {
  const s = newState(2);
  const hq = unit(s, 0, 'hq'), b = unit(s, 0, 'builder');
  s.players[0].req = 2000; s.players[0].energy = 500;
  assert.match(applyCmd(s, 0, { c: 'build', ids: [b.id], kind: 'turret', x: hq.x + 60, y: hq.y + 60 }) ?? '', /у своих построек/);
  assert.equal(applyCmd(s, 0, { c: 'build', ids: [b.id], kind: 'turret', x: hq.x + 7, y: hq.y }), undefined);
  run(s, 15);
  const t = unit(s, 0, 'turret');
  assert.equal(t.build, 1);
  assert.match(applyCmd(s, 0, { c: 'upgrade', id: t.id }) ?? '', /тир 2/);
  assert.match(applyCmd(s, 0, { c: 'upgrade', id: hq.id }) ?? '', /ключевое/);
  applyCmd(s, 0, { c: 'build', ids: [b.id], kind: 'key1', x: hq.x + 6, y: hq.y + 9 });
  run(s, 25);
  assert.equal(applyCmd(s, 0, { c: 'upgrade', id: hq.id }), undefined);
  run(s, 31);
  assert.equal(s.players[0].tier, 2);
  assert.equal(applyCmd(s, 0, { c: 'upgrade', id: t.id }), undefined);
  run(s, 11);
  assert.equal(t.lvl, 2);
});

test('найм в недостроенном здании отклоняется', () => {
  const s = newState(2);
  const b = unit(s, 0, 'builder'), hq = unit(s, 0, 'hq');
  applyCmd(s, 0, { c: 'build', ids: [b.id], kind: 'barracks', x: hq.x + 10, y: hq.y + 10 });
  assert.match(applyCmd(s, 0, { c: 'train', id: unit(s, 0, 'barracks').id }) ?? '', /не завершено/);
});

test('команды: чужими юнитами управлять нельзя, кривая постройка отклоняется', () => {
  const s = newState(2);
  const enemy = captainAt(s, 1);
  applyCmd(s, 0, { c: 'move', ids: [enemy.id], x: 50, y: 50 });
  assert.equal(enemy.order, null);
  const b = unit(s, 0, 'builder');
  assert.match(applyCmd(s, 0, { c: 'build', ids: [b.id], kind: 'barracks', x: 90, y: 90 }) ?? '', /рядом со штабом/);
  assert.match(applyCmd(s, 0, { c: 'build', ids: [b.id], kind: 'post', x: 30, y: 30 }) ?? '', /точки/);
  assert.equal(applyCmd(s, 0, { c: 'move', ids: [captainAt(s, 0).id], x: NaN, y: 1 }), undefined);
  assert.equal(captainAt(s, 0).order, null);
});

test('бой: капитан добивает вражескую базу, игра заканчивается победой', () => {
  const s = newState(2);
  const cap = captainAt(s, 0), hq = unit(s, 1, 'hq');
  s.units = s.units.filter(u => u !== captainAt(s, 1)); // без защитника, иначе капитан не переживёт
  [cap.x, cap.y] = [hq.x - 5, hq.y];
  hq.hp = 400; // уже побитая база: по зданиям пехота бьёт слабо (STRUCT_ARMOR)
  applyCmd(s, 0, { c: 'attack', ids: [cap.id], id: hq.id });
  run(s, 120);
  assert.equal(s.winner, 0);
});

test('энергия: литейня и насос на жиле дают энергию; турель стоит энергию', () => {
  const s = newState(2);
  const b = unit(s, 0, 'builder'), hq = unit(s, 0, 'hq');
  s.players[0].energy = 0;
  assert.match(applyCmd(s, 0, { c: 'build', ids: [b.id], kind: 'turret', x: hq.x + 7, y: hq.y }) ?? '', /энергии/);
  assert.equal(applyCmd(s, 0, { c: 'build', ids: [b.id], kind: 'foundry', x: hq.x + 8, y: hq.y + 3 }), undefined);
  run(s, 20);
  assert.equal(unit(s, 0, 'foundry').build, 1);
  const e = s.players[0].energy;
  run(s, 5);
  assert.ok(s.players[0].energy > e + 9, 'литейня даёт 2/с');
  assert.match(applyCmd(s, 0, { c: 'build', ids: [b.id], kind: 'pump', x: 50, y: 50 }) ?? '', /жилу/);
  assert.equal(applyCmd(s, 0, { c: 'build', ids: [b.id], kind: 'pump', x: VENTS[0][0] + 2, y: VENTS[0][1] }), undefined);
});

test('реликвии: реликтовая точка даёт реликвии, капитан берёт реликвийный доспех', () => {
  const s = newState(2);
  const cap = captainAt(s, 0), ri = POINTS.length;
  [cap.x, cap.y] = RELICS[0] as [number, number];
  run(s, 13); // CAPTURE_TIME 12 с
  assert.equal(s.points[ri].owner, 0);
  assert.match(applyCmd(s, 0, { c: 'upgrade', id: cap.id }) ?? '', /реликвий/);
  run(s, 121); // RELIC_RATE: 1 реликвия в минуту
  assert.ok(s.players[0].relics >= 2);
  assert.equal(applyCmd(s, 0, { c: 'upgrade', id: cap.id }), undefined);
  run(s, 6);
  assert.equal(cap.lvl, 2);
});

test('Династии: платят энергией, влияния нет', () => {
  const s = newState(2, ['clockwork', 'order']);
  const hq = unit(s, 0, 'hq');
  s.players[0].energy = 0;
  assert.match(applyCmd(s, 0, { c: 'train', id: hq.id }) ?? '', /энергии/);
  s.players[0].energy = 100;
  assert.equal(applyCmd(s, 0, { c: 'train', id: hq.id }), undefined);
  assert.equal(s.players[0].energy, 100 - STATS.builder.cost - ROLES.builder!.energy!, 'Династии платят обе цены энергией');
  const r = s.players[0].req;
  run(s, 2);
  assert.equal(s.players[0].req, r, 'влияние не копится');
});

test('четыре фракции: постройки снятых Нежити и Консенсуса не строит никто', () => {
  for (const f of ['order', 'clockwork', 'orks', 'ashen'] as const) {
    const s = newState(2, [f, 'order']), p = s.players[0], b = unit(s, 0, 'builder'), hq = unit(s, 0, 'hq');
    Object.assign(p, { req: 1e5, energy: 1e5, relics: 50, tier: 5 });
    for (const kind of ['aegis', 'bell', 'plague'] as const) assert.match(applyCmd(s, 0, { c: 'build', ids: [b.id], kind, x: hq.x + 12, y: hq.y }) ?? '', /другой фракции/, `${f} строит ${kind}`);
  }
});

test('Орда: ярость копится от урона и запускает ВААГХ', () => {
  const s = newState(2, ['orks', 'order']);
  const cap = captainAt(s, 0), hq = unit(s, 1, 'hq');
  s.units = s.units.filter(u => u !== captainAt(s, 1));
  [cap.x, cap.y] = [hq.x - 5, hq.y];
  s.players[0].rage = RAGE_MAX * 0.7;
  applyCmd(s, 0, { c: 'attack', ids: [cap.id], id: hq.id });
  for (let i = 0; i < 20 * 60 && s.players[0].waagh <= 0; i++) step(s);
  assert.ok(s.players[0].waagh > 0, 'ВААГХ начался');
  assert.ok(s.players[0].rage < RAGE_MAX);
});

test('тиры I→V: ключевые здания, исследования, Печать, Врата и призыв легенды', () => {
  const s = newState(2);
  const p = s.players[0], hq = unit(s, 0, 'hq'), b = unit(s, 0, 'builder');
  p.req = 1e5; p.energy = 1e5; p.relics = 50;
  const spots: Record<string, [number, number]> = { key1: [10, 0], key2: [0, 10], key3: [10, 10], key4: [18, 4], gate: [4, 19] };
  for (let t = 1; t <= 4; t++) {
    const key = TIER_UP[t].key as 'key1';
    assert.equal(applyCmd(s, 0, { c: 'build', ids: [b.id], kind: key, x: hq.x + spots[key][0], y: hq.y + spots[key][1] }), undefined, key);
    run(s, 45);
    const k = unit(s, 0, key);
    assert.equal(k.build, 1, key + ' построено');
    if (t === 4) {
      assert.match(applyCmd(s, 0, { c: 'upgrade', id: hq.id }) ?? '', /Печать/);
      assert.equal(applyCmd(s, 0, { c: 'research', id: k.id, r: 3 }), undefined);
      run(s, 21);
      assert.ok(p.research & (1 << (RESEARCH.length - 1)), 'Печать изучена');
    }
    assert.equal(applyCmd(s, 0, { c: 'upgrade', id: hq.id }), undefined, 'тир ' + (t + 1));
    run(s, 31);
    assert.equal(p.tier, t + 1);
  }
  assert.equal(applyCmd(s, 0, { c: 'build', ids: [b.id], kind: 'gate', x: hq.x + 4, y: hq.y + 19 }), undefined);
  run(s, 60);
  const g = unit(s, 0, 'gate');
  assert.equal(applyCmd(s, 0, { c: 'summon', id: g.id, v: 0 }), undefined);
  assert.match(applyCmd(s, 0, { c: 'summon', id: g.id, v: 1 }) ?? '', /заняты/);
  run(s, 21);
  assert.ok(unit(s, 0, 'legend'), 'легенда на поле');
});

test('укрепления: стена строится по сегментам и не пускает, мина бьёт по площади', () => {
  const s = newState(2);
  const b = unit(s, 0, 'builder');
  s.players[0].req = 2000;
  assert.equal(applyCmd(s, 0, { c: 'wall', ids: [b.id], x1: 70, y1: 50, x2: 70, y2: 62 }), undefined);
  const walls = s.units.filter(u => u.kind === 'wall');
  assert.ok(walls.length >= 5, 'сегменты заложены');
  run(s, 45);
  assert.ok(walls.every(w => w.build === 1), 'строитель обошёл все сегменты');
  const cap = captainAt(s, 0);
  [cap.x, cap.y] = [66, 56];
  applyCmd(s, 0, { c: 'move', ids: [cap.id], x: 76, y: 56 });
  for (let i = 0; i < 20 * 8; i++) { const x0 = cap.x; run(s, 0.05); if ((x0 - 70) * (cap.x - 70) <= 0) assert.ok(cap.y < 49.5 || cap.y > 62.5, 'сквозь стену не прошёл'); } // обходит, а не проходит насквозь
  assert.ok(cap.x > 70, 'обошёл стену и дошёл');
  assert.equal(applyCmd(s, 0, { c: 'build', ids: [b.id], kind: 'mine', x: 58, y: 76 }), undefined);
  run(s, 15); // по эту сторону стены: обхода препятствий у юнитов нет
  const enemy = captainAt(s, 1), hp = enemy.hp;
  [enemy.x, enemy.y] = [58, 77];
  run(s, 0.2);
  assert.ok(enemy.hp <= hp - 170, 'мина сработала');
  assert.ok(!s.units.some(u => u.kind === 'mine'), 'мина исчезла');
});

test('сетка построек: стена встаёт на любой свободной земле, клетка за клеткой без дыр', () => {
  const s = newState(2), b = unit(s, 0, 'builder'), hq = unit(s, 0, 'hq'), foe = unit(s, 1, 'hq');
  s.players[0].req = 1e6;
  for (let x = 6; x < 400; x += 22) for (let y = 6; y < 400; y += 22) {
    const far = (q: { x: number; y: number }, d: number) => Math.hypot(q.x - x, q.y - y) > d;
    if (far({ x: POINTS[0][0], y: POINTS[0][1] }, 14) && far(foe, 22) && far(hq, 8)) assert.equal(applyCmd(s, 0, { c: 'wall', ids: [b.id], x1: x, y1: y, x2: x + 3, y2: y }), undefined, `${x},${y}`);
  }
  assert.ok(s.units.filter(u => u.kind === 'wall').every(w => w.x % BCELL === 1 && w.y % BCELL === 1), 'сегменты по центрам клеток');
  const cells = wallCells(101, 301, 120, 290); // косая протяжка: соседние клетки — по стороне
  assert.ok(cells.length <= 16 && cells.every((c, i) => !i || Math.abs(c.x - cells[i - 1].x) + Math.abs(c.y - cells[i - 1].y) === BCELL), 'без диагональных дыр');
  assert.match(applyCmd(s, 0, { c: 'wall', ids: [b.id], x1: POINTS[0][0], y1: POINTS[0][1], x2: POINTS[0][0] + 4, y2: POINTS[0][1] }) ?? '', /нельзя/, 'не у критической точки');
  assert.match(applyCmd(s, 0, { c: 'wall', ids: [b.id], x1: foe.x + 10, y1: foe.y, x2: foe.x + 12, y2: foe.y }) ?? '', /нельзя/, 'не у чужого штаба');
  setMap(1);
  try {
    const r = newState(2), rb = unit(r, 0, 'builder'); r.players[0].req = 1e4;
    assert.match(applyCmd(r, 0, { c: 'wall', ids: [rb.id], x1: 156, y1: 156, x2: 160, y2: 156 }) ?? '', /нельзя/, 'не на скалах');
  } finally { setMap(0); }
});

test('сетка построек: здание привязано к клеткам, занятость по квадратным следам, юниты обходят', () => {
  const s = newState(2), b = unit(s, 0, 'builder'), hq = unit(s, 0, 'hq');
  s.players[0].req = 1e4;
  assert.equal(applyCmd(s, 0, { c: 'build', ids: [b.id], kind: 'barracks', x: hq.x + 13.3, y: hq.y + 0.7 }), undefined);
  const bar = unit(s, 0, 'barracks'), f = footRect('barracks', bar.x, bar.y);
  assert.deepEqual([bar.x, bar.y], [(f.x0 + f.n / 2) * BCELL, (f.y0 + f.n / 2) * BCELL], 'центр на сетке');
  assert.equal(applyCmd(s, 0, { c: 'build', ids: [b.id], kind: 'barracks', x: bar.x, y: bar.y + (f.n - 1) * BCELL }), 'Место занято', 'следы пересекаются');
  assert.equal(applyCmd(s, 0, { c: 'build', ids: [b.id], kind: 'barracks', x: bar.x, y: bar.y + f.n * BCELL }), undefined, 'вплотную по клеткам можно');
  const cap = captainAt(s, 0), w = spawn(s, 0, 'barracks', 200, 120), g = footRect('barracks', w.x, w.y);
  [cap.x, cap.y] = [w.x - 12, w.y];
  applyCmd(s, 0, { c: 'move', ids: [cap.id], x: w.x + 12, y: w.y });
  for (let i = 0; i < 6 / DT; i++) {
    step(s);
    const inside = cap.x > g.x0 * BCELL && cap.x < (g.x0 + g.n) * BCELL && cap.y > g.y0 * BCELL && cap.y < (g.y0 + g.n) * BCELL;
    assert.ok(!inside, 'не проходит сквозь здание');
  }
  assert.ok(Math.hypot(cap.x - (w.x + 12), cap.y - w.y) < 1, 'обошёл и дошёл');
});

test('прокачка точки: столп → укреплённый → бастион, центр не укрепить', () => {
  const s = newState(2);
  const p = s.players[0], b = unit(s, 0, 'builder');
  p.req = 5000; p.energy = 5000; p.tier = 2;
  applyCmd(s, 0, { c: 'build', ids: [b.id], kind: 'post', x: POINTS[1][0], y: POINTS[1][1] });
  run(s, 40); // карта крупнее: строителю дальше идти
  const post = unit(s, 0, 'post');
  assert.equal(applyCmd(s, 0, { c: 'upgrade', id: post.id }), undefined);
  run(s, 13);
  assert.equal(post.lvl, 2);
  assert.equal(applyCmd(s, 0, { c: 'upgrade', id: post.id }), undefined);
  run(s, 13);
  assert.equal(post.lvl, 3);
  assert.match(applyCmd(s, 0, { c: 'upgrade', id: post.id }) ?? '', /бастион/);
});

test('капитан: опыт за убийства и точки, уровни, дерево способностей и Вихрь', () => {
  const s = newState(2);
  const p = s.players[0], cap = captainAt(s, 0), h = cap.hero!;
  assert.equal(h.lvl, 1); assert.equal(h.pts, 1);
  assert.match(applyCmd(s, 0, { c: 'learn', a: 4 }) ?? '', /предыдущая|уровень/);
  assert.equal(applyCmd(s, 0, { c: 'learn', a: 3 }), undefined);
  assert.match(applyCmd(s, 0, { c: 'learn', a: 0 }) ?? '', /очков/);
  const e = unit(s, 1, 'builder');
  [e.x, e.y] = [cap.x + 1, cap.y];
  run(s, 10);
  assert.ok(!s.units.includes(e), 'строитель врага убит');
  assert.equal(h.xp, 5);
  [cap.x, cap.y] = POINTS[3];
  run(s, 13);
  assert.equal(s.points[3].owner, 0);
  assert.equal(h.xp, 30, 'захват точки +25');
  h.xp = 95; const ec = captainAt(s, 1); [ec.x, ec.y] = [cap.x + 3, cap.y]; ec.by = 0; ec.hp = 0; run(s, 0.1);
  assert.equal(h.lvl, 2); assert.equal(h.xp, 35); assert.equal(h.pts, 1, 'новый уровень — очко');
  const far = spawn(s, 0, 'captain', 20, 20); far.arch = 'assault';
  const ec2 = spawn(s, 1, 'guard', cap.x + 2, cap.y); ec2.by = 0; ec2.hp = 0; run(s, 0.1);
  assert.equal(far.hero!.xp, 0, 'опыт — героям рядом с боем, у каждого свой');
  assert.equal(applyCmd(s, 0, { c: 'learn', a: 0, id: far.id }), undefined, 'своё дерево у каждого героя');
  assert.ok(far.hero!.abil & 1 && !(h.abil & 1));
  h.lvl = 4; p.tier = 2;
  assert.equal(applyCmd(s, 0, { c: 'learn', a: 4, id: cap.id }), undefined);
  const foe = unit(s, 1, 'hq'), hp = foe.hp;
  [cap.x, cap.y] = [foe.x + 5, foe.y];
  assert.equal(applyCmd(s, 0, { c: 'ability', a: 4, id: cap.id }), undefined);
  assert.ok(foe.hp <= hp - 150, 'Вихрь ранит');
  assert.match(applyCmd(s, 0, { c: 'ability', a: 4 }) ?? '', /Перезарядка/);
});

test('Рубаки Орды бьют в упор, Стражники Ордена стреляют издалека', () => {
  const s = newState(2, ['orks', 'order']);
  const hq0 = unit(s, 0, 'hq'), hq1 = unit(s, 1, 'hq');
  const choppa = spawn(s, 0, 'guard', 120, 60), target = spawn(s, 1, 'guard', 127, 60); // вдали от штабов
  void hq0; void hq1;
  run(s, 0.2);
  assert.ok(s.shots.length === 0 || s.shots.every(sh => sh[4] !== 1), 'с 7 м Рубаки ещё не бьют');
  assert.ok(s.shots.some(sh => sh[4] === 0), 'Стражник уже стреляет');
  s.shots.length = 0;
  run(s, 2);
  assert.ok(Math.hypot(choppa.x - target.x, choppa.y - target.y) < 5, 'Рубаки сблизились');
  assert.ok(s.shots.some(sh => sh[4] === 1), 'рубящий удар');
});

test('армия по ролям: найм по тиру, Легион, урон по броне, ремонт, гранаты, титаны', () => {
  const s = newState(2);
  const p = s.players[0], hq = unit(s, 0, 'hq'), b = unit(s, 0, 'builder');
  p.req = 1e5; p.energy = 1e5; p.relics = 20;
  const bar = spawn(s, 0, 'barracks', hq.x + 12, hq.y);
  assert.match(applyCmd(s, 0, { c: 'train', id: bar.id, k: 'sniper' }) ?? '', /тир/);
  p.tier = 4;
  for (const k of ['sniper', 'heavy', 'support', 'elite', 'healer'] as const) assert.equal(applyCmd(s, 0, { c: 'train', id: bar.id, k }), undefined, k);
  run(s, 70);
  for (const k of ['sniper', 'heavy', 'support', 'elite', 'healer'] as const) assert.ok(s.units.some(u => u.owner === 0 && u.kind === k), k + ' нанят');
  // Легион: титан занимает 20, второго не дадут; строится только на верфи
  const yard = spawn(s, 0, 'yard', hq.x - 20, hq.y);
  assert.match(applyCmd(s, 0, { c: 'train', id: yard.id, k: 'titan' }) ?? '', /критическ/, 'титан — только с критической точкой');
  s.points[0].owner = 0;
  assert.equal(applyCmd(s, 0, { c: 'train', id: hq.id, k: 'titan' }), undefined); // штаб титана не строит: заказ подменяется на строителя
  assert.ok(!hq.que.includes('titan'));
  assert.equal(applyCmd(s, 0, { c: 'train', id: yard.id, k: 'titan' }), undefined);
  p.relics = 20;
  assert.equal(applyCmd(s, 0, { c: 'train', id: yard.id, k: 'titan' }), undefined, 'второй титан — если хватает ресурсов');
  // снайпер почти не царапает технику, тяжёлое оружие — сильно
  const veh = spawn(s, 1, 'mveh', 80, 80), sn = unit(s, 0, 'sniper'), hv = unit(s, 0, 'heavy');
  [sn.x, sn.y] = [80, 66]; const hp0 = veh.hp; sn.order = { t: 'attack', id: veh.id }; hv.x = -50;
  run(s, 3.5); const bySniper = hp0 - veh.hp;
  [hv.x, hv.y] = [80, 66]; sn.x = -50; sn.order = null; hv.order = { t: 'attack', id: veh.id };
  const hp1 = veh.hp; run(s, 3.5); const byHeavy = hp1 - veh.hp;
  assert.ok(byHeavy > bySniper * 5, `тяжёлое ${byHeavy} vs снайпер ${bySniper}`);
  // ремонт: строитель чинит казармы за влияние
  bar.hp = 200;
  const withoutRepair = structuredClone(s); // одинаковый доход и найм, но без приказа ремонта
  assert.equal(applyCmd(s, 0, { c: 'assist', ids: [b.id], id: bar.id }), undefined);
  run(s, 20);
  run(withoutRepair, 20);
  assert.ok(bar.hp > 600, 'казармы отремонтированы'); assert.ok(p.req < withoutRepair.players[0].req, 'ремонт тратит влияние с учётом дохода');
  // граната: купить у штаба, бросить
  const g = unit(s, 0, 'guard') ?? spawn(s, 0, 'guard', hq.x + 5, hq.y + 5);
  [g.x, g.y] = [hq.x + 5, hq.y + 5];
  p.tier = 2;
  assert.equal(applyCmd(s, 0, { c: 'gear', ids: [g.id], g: 0 }), undefined);
  const foe = spawn(s, 1, 'guard', g.x + 10, g.y), fhp = foe.hp;
  assert.equal(applyCmd(s, 0, { c: 'throw', ids: [g.id], g: 0, x: foe.x, y: foe.y }), undefined);
  run(s, 1.5);
  assert.ok(foe.hp < fhp - 60 || !s.units.includes(foe), 'граната взорвалась');
  assert.equal(g.ch[0], 2);
});

test('особые механики: Архангел Ордена, Бог-Механизм Династий, турели Орды', () => {
  const s = newState(2, ['order', 'orks']);
  const p = s.players[0], hq = unit(s, 0, 'hq'); p.tier = 2; p.req = 1e4; p.energy = 1e4;
  // Орда: турели только своей фракции, Рубаки тащат турель
  assert.match(applyCmd(s, 0, { c: 'build', ids: [unit(s, 0, 'builder').id], kind: 'rturret', x: hq.x + 5, y: hq.y + 5 }) ?? '', /другой фракции/);
  const ork = s.players[1], ohq = unit(s, 1, 'hq'); ork.req = 1e4;
  const t = spawn(s, 1, 'rturret', ohq.x - 6, ohq.y - 6), choppa = spawn(s, 1, 'guard', ohq.x - 7, ohq.y - 6);
  assert.equal(applyCmd(s, 1, { c: 'drag', ids: [choppa.id], id: t.id }), undefined);
  applyCmd(s, 1, { c: 'move', ids: [choppa.id], x: ohq.x - 30, y: ohq.y - 6 });
  run(s, 3);
  assert.ok(Math.hypot(t.x - choppa.x, t.y - choppa.y) < 3, 'турель едет за Рубаками');
  // Династии: Вознесение на 10-м уровне и тире IV, Остановка времени
  const c = newState(2, ['clockwork', 'order']), cp = c.players[0];
  cp.energy = 1e4; cp.tier = 4; captainAt(c, 0);
  assert.match(applyCmd(c, 0, { c: 'ascend' }) ?? '', /уровень/);
  captainAt(c, 0).hero!.lvl = 10;
  assert.equal(applyCmd(c, 0, { c: 'ascend' }), undefined);
  run(c, 5);
  const god = c.units.find(u => u.owner === 0 && u.kind === 'deity')!;
  assert.ok(god, 'Бог-Механизм явился');
  const foe = captainAt(c, 1); [foe.x, foe.y] = [god.x + 5, god.y];
  assert.equal(applyCmd(c, 0, { c: 'timestop' }), undefined);
  const fx = foe.x; applyCmd(c, 1, { c: 'move', ids: [foe.id], x: foe.x + 20, y: foe.y }); run(c, 2);
  assert.equal(foe.x, fx, 'время остановлено');
  god.hp = 0; run(c, 0.1);
  const back = captainAt(c, 0);
  assert.ok(back && back.hp <= 0 && back.dead < 0, 'гибель бога: капитан недоступен надолго');
  // Орден: Архангел поднимает павшего бойца
  const o = newState(2, ['order', 'orks']), oh = unit(o, 0, 'hq');
  const angel = spawn(o, 0, 'healer', oh.x + 6, oh.y), sq = spawn(o, 0, 'guard', oh.x + 7, oh.y);
  void angel; sq.hp = STATS.guard.hp * 2; sq.hit = 0;
  run(o, 62);
  assert.ok(sq.hp >= STATS.guard.hp * 3, 'боец поднят');
});

test('победные очки тают у того, кто держит меньше точек, но не убивают; туман войны прячет далёких врагов', () => {
  const s = newState(2);
  s.points.forEach((p, i) => { if (!p.relic) p.owner = i === 0 ? 1 : i % 2; }); // у игрока 1 больше точек и центр
  const vp0 = s.vp[0];
  run(s, 10);
  assert.ok(s.vp[0] < vp0 - 10, 'очки игрока 0 тают'); // VP_RATE 0.5 × перевес ≥ 2 точек × 10 с assert.equal(s.vp[1], 500);
  s.vp[0] = 1; run(s, 5);
  assert.equal(s.vp[0], 0); assert.equal(s.players[0].alive, true, 'без очков не проигрывают: только когда пали все штабы'); assert.equal(s.winner, null);
  const f = newState(2), far = unit(f, 1, 'hq');
  const snap = snapshotFor(f, 0);
  assert.ok(!snap.u.some(r => r[0] === far.id), 'чужой штаб в тумане');
  assert.ok(snap.u.some(r => r[0] === unit(f, 0, 'hq').id), 'свой штаб виден');
  const scout = captainAt(f, 0); [scout.x, scout.y] = [far.x - 8, far.y];
  assert.ok(snapshotFor(f, 0).u.some(r => r[0] === far.id), 'разведка открыла штаб');
  const g = newState(2), pt = g.points[3], foe = spawn(g, 1, 'guard', pt.x + 5, pt.y);
  assert.ok(!snapshotFor(g, 0).u.some(r => r[0] === foe.id), 'чужая точка не светит');
  pt.owner = 0;
  assert.ok(snapshotFor(g, 0).u.some(r => r[0] === foe.id), 'своя точка без башни снимает туман');
});

test('точки: турели вокруг своей точки, у критической точки строить нельзя', () => {
  const s = newState(2, ['order', 'ashen']);
  const p = s.players[0], b = unit(s, 0, 'builder'), hq = unit(s, 0, 'hq');
  p.req = 1e4; p.tier = 1;
  const pt = s.points[3]; pt.owner = 0;
  assert.equal(applyCmd(s, 0, { c: 'build', ids: [b.id], kind: 'turret', x: pt.x + 8, y: pt.y }), undefined, 'турель у своей точки');
  assert.match(applyCmd(s, 0, { c: 'build', ids: [b.id], kind: 'turret', x: s.points[0].x + 4, y: s.points[0].y }) ?? '', /критической/);
  assert.match(applyCmd(s, 0, { c: 'build', ids: [b.id], kind: 'post', x: s.points[0].x, y: s.points[0].y }) ?? '', /критической/);
});

test('здоровье по лестнице, стены укрепляются, артиллерия не бьёт в упор, яма жжёт', () => {
  const tot = (k: Parameters<typeof maxHp>[0]) => maxHp(k);
  assert.ok(tot('guard') < tot('elite') && tot('elite') < tot('mveh') && tot('mveh') < tot('barracks') && tot('barracks') < tot('hq') && tot('hq') < tot('titan'), 'лестница здоровья');
  const s = newState(2, ['ashen', 'order']);
  const p = s.players[0], hq = unit(s, 0, 'hq'); p.req = 1e4; p.tier = 2;
  const w1 = spawn(s, 0, 'wall', hq.x + 15, hq.y), w2 = spawn(s, 0, 'wall', hq.x + 15, hq.y + 2);
  assert.equal(applyCmd(s, 0, { c: 'upgrade', id: w1.id }), undefined);
  run(s, 7);
  assert.equal(w1.lvl, 2); assert.equal(w2.lvl, 2, 'укрепились все стены');
  // артиллерия: цель в 6 м — не стреляет, в 30 м — стреляет
  const art = spawn(s, 0, 'arty', 120, 150), near = spawn(s, 1, 'guard', 126, 150), hp0 = near.hp;
  run(s, 3);
  assert.equal(near.hp, hp0, 'мёртвая зона');
  near.x = 155; near.y = 150; spawn(s, 0, 'sniper', 150, 156); run(s, 6); // корректировщик рядом с целью
  assert.ok(near.hp < hp0, 'достаёт издалека'); void art;
  // Огненная яма Синклита
  const pyre = spawn(s, 0, 'pyre', 60, 200), foe = spawn(s, 1, 'guard', 64, 200), f0 = foe.hp; void pyre;
  run(s, 2); assert.ok(foe.hp < f0 - 20, 'яма жжёт');
});

test('карта «Ущелье Пепла»: на четверых, крест тоннелей, скалы непроходимы, в карманах по 2 реликвария и жила', () => {
  setMap(1);
  try {
    const s = newState(4);
    assert.equal(s.players.length, 4);
    assert.equal(s.points.filter(p => p.relic).length, 8);
    const K = MAPS[1].map.w / 320; // координаты исходной схемы 320×320, карта растянута
    const cap = captainAt(s, 0), b = unit(s, 0, 'builder');
    [cap.x, cap.y] = [40 * K, 120 * K]; // западный карман, у скалы
    applyCmd(s, 0, { c: 'move', ids: [cap.id], x: 120 * K, y: 120 * K }); // приказ прямо в скалу
    run(s, 8);
    assert.ok(cap.x <= 72 * K + 1.2 || cap.y >= 162 * K - 1.2, 'в скалу не залез');
    applyCmd(s, 0, { c: 'move', ids: [cap.id], x: 290 * K, y: 180 * K }); run(s, 45 * K);
    assert.ok(cap.x > 270 * K, 'прошёл тоннелем через развилку к восточному карману');
    s.players[0].req = 1e4; s.players[0].energy = 1e4; s.players[0].tier = 2; s.points[1].owner = 0;
    assert.match(applyCmd(s, 0, { c: 'build', ids: [b.id], kind: 'turret', x: 110 * K, y: 110 * K }) ?? '', /скалах/);
  } finally { setMap(0); }
});

test('Династии: только энергия (доход с точек и столпов — энергией), второй штаб-Монолит, проигрыш только без всех штабов', () => {
  const s = newState(2, ['clockwork', 'order']);
  const p = s.players[0];
  p.req = 0; p.energy = 0;
  s.points[3].owner = 0; spawn(s, 0, 'post', s.points[3].x, s.points[3].y);
  run(s, 10);
  assert.equal(p.req, 0, 'влияния у Династий нет');
  assert.ok(p.energy > 30, 'точка и столп дают энергию');
  // Монолит: второй штаб у своей точки
  p.energy = 2000; p.tier = 2;
  const b = unit(s, 0, 'builder');
  assert.equal(applyCmd(s, 0, { c: 'build', ids: [b.id], kind: 'hq', x: s.points[3].x + 8, y: s.points[3].y }), undefined);
  assert.ok(p.energy <= 1400, 'Монолит оплачен энергией');
  const mono = s.units.filter(u => u.owner === 0 && u.kind === 'hq')[1];
  mono.build = 1; mono.hp = maxHp('hq');
  unit(s, 0, 'hq').hp = 0; run(s, 0.1);
  assert.equal(p.alive, true, 'жив, пока стоит Монолит');
  mono.hp = 0; run(s, 0.1);
  assert.equal(p.alive, true, 'без штабов жив, пока стоят другие постройки');
  for (const u of s.units) if (u.owner === 0 && isStruct(u.kind)) u.hp = 0;
  run(s, 0.1);
  assert.equal(p.alive, false, 'проигрыш — когда пали все постройки');
});

test('сверхоружие и мегапостройки: открытия в штабе, стройка видна всем, удар у каждой фракции свой и только по врагам', () => {
  const s = newState(2, ['order', 'ashen']);
  const p = s.players[0], hq = unit(s, 0, 'hq'), b = unit(s, 0, 'builder');
  p.req = 1e5; p.energy = 1e5; p.relics = 50; p.tier = 5;
  const spot = { x: hq.x + 14, y: hq.y + 4 };
  assert.match(applyCmd(s, 0, { c: 'build', ids: [b.id], kind: 'lighthouse', ...spot }) ?? '', /Мегапостройки/);
  assert.equal(applyCmd(s, 0, { c: 'unlock', id: hq.id, u: 0 }), undefined);
  assert.match(applyCmd(s, 0, { c: 'unlock', id: hq.id, u: 1 }) ?? '', /исследует/, 'по одному открытию');
  assert.match(applyCmd(s, 0, { c: 'train', id: hq.id }) ?? '', /исследует/, 'штаб не нанимает во время открытия');
  run(s, 91);
  assert.equal(applyCmd(s, 0, { c: 'build', ids: [b.id], kind: 'lighthouse', ...spot }), undefined);
  assert.ok(snapshotFor(s, 1).mg.some(r => KINDS[r[3]] === 'lighthouse'), 'враг видит стройку маяка');
  // сверхоружие: открытие в штабе, затем заряд и удар самим штабом
  assert.equal(applyCmd(s, 0, { c: 'strike', x: 200, y: 200 }), undefined, 'без открытия — молча нельзя');
  assert.equal(applyCmd(s, 0, { c: 'unlock', id: hq.id, u: 1 }), undefined);
  run(s, 121);
  assert.ok(p.unlock & 2);
  assert.match(applyCmd(s, 0, { c: 'strike', x: 200, y: 200 }) ?? '', /Заряд/);
  p.doom = DOOM.charge;
  const foe = unit(s, 1, 'hq'), hp = foe.hp;
  assert.equal(applyCmd(s, 0, { c: 'strike', x: foe.x, y: foe.y }), undefined);
  assert.equal(snapshotFor(s, 1).ss.length, 1, 'враг видит предупреждение');
  run(s, 7);
  assert.ok(foe.hp < hp - 1500 && foe.hp > hp - 2000, 'орбитальный удар: по зданиям вполсилы (DOOM.struct)');
  p.doom = DOOM.charge; const own = hq.hp;
  assert.equal(applyCmd(s, 0, { c: 'strike', x: hq.x, y: hq.y }), undefined); run(s, 7);
  assert.equal(hq.hp, own, 'своих не задевает');
  p.doom = DOOM.charge; p.energy = 0; p.req = 0;
  assert.match(applyCmd(s, 0, { c: 'strike', x: foe.x, y: foe.y }) ?? '', /./, 'пуск стоит энергии');
  // Культ: Око Разлома — из разлома выходят три демона
  const u = s.players[1]; u.unlock = 2; u.doom = DOOM.charge; u.req = 1e4; u.energy = 1e4;
  const elites = () => s.units.filter(v => v.owner === 1 && v.kind === 'elite').length, e0 = elites();
  assert.equal(applyCmd(s, 1, { c: 'strike', x: 200, y: 200 }), undefined); run(s, 7);
  assert.equal(elites() - e0, 3, 'демоны из разлома');
});

test('цена: Династии платят всё энергией, остальные — влиянием и энергией', () => {
  assert.deepEqual(resourceCost('clockwork', 300, 150, 0), { req: 0, energy: 450 });
  assert.deepEqual(resourceCost('order', 300, 150, 0), { req: 300, energy: 150 });
});

test('захват точки длится 12 секунд, отсутствие войск сбрасывает прогресс', () => {
  const s = newState(2), p = s.points[3], cap = captainAt(s, 0);
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

for (const faction of ['order', 'clockwork', 'orks', 'ashen'] as const) {
  test(`техника ${faction}: три пресета нанимаются в техцехе на III тире`, () => {
    const s = newState(2, [faction, 'order']), p = s.players[0], hq = unit(s, 0, 'hq');
    const factory = spawn(s, 0, 'motorpool', hq.x + 14, hq.y);
    p.req = 1e5; p.energy = 1e5; p.tier = 2;
    for (const k of ['lveh', 'mveh', 'hveh'] as const) assert.match(applyCmd(s, 0, { c: 'train', id: factory.id, k }) ?? '', /тир 3/);
    assert.equal(factory.que.length, 0);
    p.tier = 3;
    for (const k of ['lveh', 'mveh', 'hveh'] as const) assert.equal(applyCmd(s, 0, { c: 'train', id: factory.id, k }), undefined);
    run(s, STATS.lveh.time + STATS.mveh.time + STATS.hveh.time + 1);
    for (const k of ['lveh', 'mveh', 'hveh'] as const) assert.ok(s.units.some(u => u.owner === 0 && u.kind === k), k + ' вышел на поле');
  });
}

test('титан требует полную цену каждого ресурса и критическую точку; титанов может быть несколько', () => {
  const s = newState(2), p = s.players[0], hq0 = unit(s, 0, 'hq'); p.tier = 4;
  const hq = spawn(s, 0, 'yard', hq0.x - 20, hq0.y); // верфь титана
  s.points[0].owner = 0; // критическая точка
  const cost = STATS.titan.cost, energyCost = ROLES.titan!.energy!, relicCost = ROLES.titan!.relics!;
  assert.ok(cost >= 1500 && energyCost >= 2500 && relicCost >= 10, 'титан — дорогой юнит поздней игры');
  for (const [req, energy, relics, missing] of [[cost - 1, energyCost, relicCost, 'влияния'], [cost, energyCost - 1, relicCost, 'энергии'], [cost, energyCost, relicCost - 1, 'реликвий']] as const) {
    Object.assign(p, { req, energy, relics });
    assert.match(applyCmd(s, 0, { c: 'train', id: hq.id, k: 'titan' }) ?? '', new RegExp(missing));
    assert.equal(hq.que.length, 0);
    assert.deepEqual([p.req, p.energy, p.relics], [req, energy, relics], 'неудачный заказ ничего не списывает');
  }
  Object.assign(p, { req: cost, energy: energyCost, relics: relicCost });
  assert.equal(applyCmd(s, 0, { c: 'train', id: hq.id, k: 'titan' }), undefined);
  assert.deepEqual([p.req, p.energy, p.relics], [0, 0, 0]);
  Object.assign(p, { req: 1e4, energy: 1e4, relics: 100 });
  assert.equal(applyCmd(s, 0, { c: 'train', id: hq.id, k: 'titan' }), undefined, 'титанов сколько позволят ресурсы');
  assert.match(applyCmd(s, 0, { c: 'train', id: hq.id, k: 'bomber' }) ?? 'не тот юнит', /./);
  assert.ok(!hq.que.includes('bomber'), 'Бомбовоз — только у Орды');
});

test('техника — в техцехе, исследования — в ключевом здании: одно другому не мешает', () => {
  const s = newState(2), p = s.players[0], hq = unit(s, 0, 'hq');
  const key = spawn(s, 0, 'key2', hq.x + 12, hq.y), pool = spawn(s, 0, 'motorpool', hq.x - 14, hq.y);
  Object.assign(p, { tier: 3, req: 1e5, energy: 1e5 });
  assert.equal(applyCmd(s, 0, { c: 'train', id: pool.id, k: 'lveh' }), undefined);
  assert.equal(applyCmd(s, 0, { c: 'research', id: key.id, r: 0 }), undefined);
  assert.equal(key.que.length, 0, 'ключевое здание технику не строит');
  run(s, STATS.lveh.time + 1);
  assert.ok(s.units.some(u => u.owner === 0 && u.kind === 'lveh'));
  run(s, 20);
  assert.ok(p.research & (1 << 4));
});

test('Адская мортира: зажигательный снаряд оставляет пожар, он жжёт и здания', () => {
  const s = newState(2, ['ashen', 'order']);
  const m = spawn(s, 0, 'arty', 100, 100), b = spawn(s, 1, 'barracks', 120, 100);
  m.build = 1; b.build = 1; spawn(s, 0, 'guard', 112, 100); // наводчик
  run(s, 4);
  assert.ok(s.plagues.some(z => z.fire), 'земля горит');
  const hp = b.hp; m.hp = 0; run(s, 2);
  assert.ok(b.hp < hp, 'пожар жжёт постройку');
});

test('отмена найма из очереди возвращает ресурсы полностью', () => {
  const s = newState(2), p = s.players[0], hq = unit(s, 0, 'hq');
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

test('второй герой: другой архетип — в казармах с тира II, свой бонус, один на армию; легенда и титан — вместе с ним', () => {
  const s = newState(2, ['order', 'ashen'], ['commander', 'commander']), p = s.players[0];
  Object.assign(p, { req: 1e4, energy: 1e4, relics: 50 });
  captainAt(s, 0);
  assert.match(applyCmd(s, 0, { c: 'hero', a: 'assault' }) ?? '', /тир II/);
  p.tier = 5;
  assert.match(applyCmd(s, 0, { c: 'hero', a: 'commander' }) ?? '', /уже/, 'главный уже в армии');
  assert.match(applyCmd(s, 0, { c: 'hero', a: 'assault' }) ?? '', /казармы/, 'второго героя заказывают в казармах');
  const bar = spawn(s, 0, 'barracks', unit(s, 0, 'hq').x + 14, unit(s, 0, 'hq').y);
  assert.equal(applyCmd(s, 0, { c: 'hero', a: 'assault' }), undefined);
  assert.deepEqual(bar.que, ['captain']);
  run(s, STATS.captain.time + 1);
  const heroes = s.units.filter(u => u.owner === 0 && u.kind === 'captain');
  assert.equal(heroes.length, 2);
  assert.equal(archOf(s, heroes[1]), 'assault');
  assert.match(applyCmd(s, 0, { c: 'hero', a: 'assault' }) ?? '', /уже/);
  const hq = unit(s, 0, 'hq'), yard = spawn(s, 0, 'yard', hq.x - 20, hq.y), gate = spawn(s, 0, 'gate', hq.x + 20, hq.y);
  s.points[0].owner = 0; p.energy = 2e4;
  assert.equal(applyCmd(s, 0, { c: 'train', id: yard.id, k: 'titan' }), undefined);
  assert.equal(applyCmd(s, 0, { c: 'summon', id: gate.id, v: 0 }), undefined, 'легенда вместе с титаном и героями');
});

test('баланс: огонь на марше, гранаты не бьют своих, пулемёты не берут танк, лимиты пехоты и техники раздельно', () => {
  const s = newState(2, ['orks', 'order']);
  const a = spawn(s, 1, 'guard', 120, 60), foe = spawn(s, 0, 'guard', 126, 60), hp = foe.hp; // стрелки Ордена
  applyCmd(s, 1, { c: 'move', ids: [a.id], x: 120, y: 140 });
  run(s, 0.5);
  assert.ok(foe.hp < hp, 'на марше стреляют по врагу в досягаемости');
  const own = spawn(s, 0, 'guard', 200, 100), ownHp = own.hp;
  s.blasts.push({ x: 200, y: 100, t: 0, g: 0, owner: 0 }); run(s, 0.1);
  assert.equal(own.hp, ownHp, 'граната своих не задевает');
  const tank = spawn(s, 1, 'hveh', 300, 300), mg = spawn(s, 0, 'heavy', 312, 300), t0 = tank.hp;
  void mg; run(s, 10);
  assert.ok(t0 - tank.hp < maxHp('hveh') * 0.05, 'шуты Орды почти не царапают тяжёлую технику');
  const p = s.players[0], hq = unit(s, 0, 'hq'); Object.assign(p, { tier: 4, req: 1e5, energy: 1e5 });
  const bar = spawn(s, 0, 'barracks', hq.x + 12, hq.y), pool = spawn(s, 0, 'motorpool', hq.x - 14, hq.y);
  for (let i = 0; i < 5; i++) applyCmd(s, 0, { c: 'train', id: bar.id, k: 'elite' });
  for (let i = 0; i < 6; i++) spawn(s, 0, 'elite', 20, 20 + i * 3); // пехотный Легион почти полон
  assert.equal(applyCmd(s, 0, { c: 'train', id: pool.id, k: 'hveh' }), undefined, 'пехота не съедает лимит техники');
});

test('очередь приказов (Shift): юнит выполняет приказы по порядку, обычный приказ очередь сбрасывает', () => {
  const s = newState(2), b = unit(s, 0, 'builder'), [x0, y0] = [b.x, b.y];
  applyCmd(s, 0, { c: 'move', ids: [b.id], x: x0 + 10, y: y0 });
  applyCmd(s, 0, { c: 'move', ids: [b.id], x: x0 + 10, y: y0 + 10, q: true });
  assert.equal(b.queue?.length, 1, 'второй приказ — в очереди');
  run(s, 6);
  assert.ok(Math.hypot(b.x - (x0 + 10), b.y - (y0 + 10)) < 1.5, 'дошёл до второй точки через первую');
  applyCmd(s, 0, { c: 'move', ids: [b.id], x: x0, y: y0 }); applyCmd(s, 0, { c: 'move', ids: [b.id], x: x0 + 5, y: y0, q: true });
  applyCmd(s, 0, { c: 'move', ids: [b.id], x: x0 + 3, y: y0 + 3 });
  assert.equal(b.queue, undefined, 'приказ без Shift очищает очередь');
});

test('тираниды: биопушка бьёт дальше обычной турели и задевает соседей; авиация и техника эльдар летают; Врата Варпа — только у Хаоса', () => {
  const s = newState(2, ['tyranids', 'order']);
  const hq = unit(s, 0, 'hq'), t = spawn(s, 0, 'turret', hq.x + 8, hq.y); t.build = 1;
  const a = spawn(s, 1, 'guard', t.x + 20, t.y), b = spawn(s, 1, 'guard', t.x + 21.5, t.y);
  const ha = a.hp, hb = b.hp;
  run(s, 1);
  assert.ok(a.hp < ha, 'попала на 20 м (у обычной турели 13)');
  assert.ok(b.hp < hb, 'сплэш задел соседа');
  for (const k of ['lveh', 'hveh', 'arty', 'titan'] as Kind[]) assert.ok(flies(k, 'eldar'), k);
  assert.ok(!flies('lveh', 'order') && flies('air', 'order'));
  assert.equal(FACTION_ONLY.warpgate, 'ashen');
  assert.deepEqual(producible('warpgate'), ['khorne', 'nurgle', 'tzeentch', 'slaanesh']);
});

test('вторые механики: лом орков, жертва Хаоса, живой металл некронов; большие демоны — поздно', () => {
  const s = newState(4, ['orks', 'ashen', 'order', 'tyranids']), [orks, ashen] = s.players;
  const veh = spawn(s, 2, 'hveh', 200, 200), req = orks.req;
  hurt(s, veh, 1e6, 0); run(s, 0.2);
  assert.ok(orks.req >= req + STATS.hveh.cost * 0.25 - 1, 'орки собрали лом');
  const rel = ashen.relics;
  for (let i = 0; i < TRIBUTE; i++) hurt(s, spawn(s, 2, 'builder', 150 + i, 150), 1e6, 1);
  run(s, 0.2);
  assert.equal(ashen.relics, rel + 1, 'жертва богам: реликвия за 20 убийств');
  const n = newState(2, ['clockwork', 'order']), mono = unit(n, 0, 'hq');
  mono.hp = maxHp('hq') / 2; run(n, 10);
  assert.ok(mono.hp > maxHp('hq') / 2 + maxHp('hq') * 0.04, 'живой металл чинит постройку');
  assert.equal(ROLES.nurgle!.tier, 4); assert.equal(ROLES.tzeentch!.tier, 4); assert.equal(ROLES.khorne!.tier, 3);
});

test('каждая фракция может заказать каждого юнита в каждом своём здании и каждого героя, и он выходит', async () => {
  const { FACTION_IDS, ARCH_OPTS } = await import('./factions.ts');
  for (const f of FACTION_IDS) {
    const s = newState(2, [f, 'order']), p = s.players[0], hq = unit(s, 0, 'hq');
    p.tier = 5; s.points[0].owner = 0; // титан — только с критической точкой
    const homes = (['barracks', 'motorpool', 'yard', ...(f === 'ashen' ? ['warpgate'] : [])] as Kind[]).map((k, i) => { const b = spawn(s, 0, k, hq.x + 20 + i * 18, hq.y + 20); b.build = 1; return b; });
    for (const b of [hq, ...homes]) for (const k of producible(b.kind, f)) {
      Object.assign(p, { req: 1e6, energy: 1e6, relics: 1e3 });
      for (const u of s.units) if (u.owner === 0 && !isStruct(u.kind) && u.kind !== 'builder') u.hp = 0; // освободить лимит
      run(s, 0.2);
      assert.equal(applyCmd(s, 0, { c: 'train', id: b.id, k }), undefined, `${f}: заказ ${k} в ${b.kind}`);
      run(s, STATS[k].time + 2);
      assert.ok(s.units.some(u => u.owner === 0 && u.kind === k && u.hp > 0), `${f}: ${k} вышел из ${b.kind}`);
    }
    for (const a of Object.keys(ARCH_OPTS[f]) as ('assault' | 'commander' | 'mystic')[]) {
      Object.assign(p, { req: 1e6, energy: 1e6, relics: 1e3 });
      assert.equal(applyCmd(s, 0, { c: 'hero', a }), undefined, `${f}: герой ${a}`);
    }
  }
});

test('мегапостройка бьёт на 200 м и засвечивает место удара', () => {
  const s = newState(2), hq = unit(s, 0, 'hq'), foe = unit(s, 1, 'hq');
  const d = Math.hypot(hq.x - foe.x, hq.y - foe.y), m = spawn(s, 0, 'spire', foe.x + (hq.x - foe.x) * 150 / d, foe.y + (hq.y - foe.y) * 150 / d); m.build = 1;
  for (const u of s.units) if (u.owner === 1 && u !== foe) u.hp = 0; // цель одна — вражеский штаб
  assert.ok(Math.hypot(foe.x - m.x, foe.y - m.y) < 200, 'штаб врага в досягаемости');
  const hp = foe.hp;
  run(s, 26);
  assert.ok(foe.hp < hp, 'удар дошёл');
  assert.ok(snapshotFor(s, 0).u.some(r => r[0] === foe.id), 'место удара засвечено');
});
