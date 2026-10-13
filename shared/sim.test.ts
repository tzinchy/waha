import { test } from 'node:test';
import assert from 'node:assert/strict';
import { applyCmd, members, maxHp, newState, step, DT, START_REQ, STATS, POINTS, RELICS, VENTS, type Kind, type State } from './sim.ts';

const run = (s: State, sec: number) => { for (let i = 0; i < sec / DT; i++) step(s); };
const unit = (s: State, owner: number, kind: Kind) => s.units.find(u => u.owner === owner && u.kind === kind)!;

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

test('старт: штаб, капитан и строители, requisition по умолчанию', () => {
  const s = newState(2);
  for (const k of ['hq', 'captain', 'builder'] as Kind[]) assert.ok(unit(s, 0, k), k);
  assert.equal(s.players[0].req, START_REQ);
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
  g.hp = 100; g.hit = 0; // осталось 2 бойца, только что получили урон
  const before = s.players[0].req;
  applyCmd(s, 0, { c: 'reinforce', ids: [g.id] });
  run(s, 1.5);
  assert.equal(g.hp, 100, 'под огнём пополнение стоит');
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
  run(s, 30);
  assert.equal(s.units.find(u => u.kind === 'post')!.build, 1);
  assert.equal(s.points[1].owner, 0);
});

test('апгрейды: тир 2 у штаба открывает укрепление поста; турель ставится у своих построек', () => {
  const s = newState(2);
  const hq = unit(s, 0, 'hq'), b = unit(s, 0, 'builder');
  s.players[0].req = 2000; s.players[0].energy = 500;
  assert.match(applyCmd(s, 0, { c: 'build', ids: [b.id], kind: 'turret', x: 60, y: 60 }) ?? '', /рядом/);
  assert.equal(applyCmd(s, 0, { c: 'build', ids: [b.id], kind: 'turret', x: hq.x + 7, y: hq.y }), undefined);
  run(s, 15);
  const t = unit(s, 0, 'turret');
  assert.equal(t.build, 1);
  assert.match(applyCmd(s, 0, { c: 'upgrade', id: t.id }) ?? '', /тир 2/);
  applyCmd(s, 0, { c: 'upgrade', id: hq.id });
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
  const enemy = unit(s, 1, 'captain');
  applyCmd(s, 0, { c: 'move', ids: [enemy.id], x: 50, y: 50 });
  assert.equal(enemy.order, null);
  const b = unit(s, 0, 'builder');
  assert.match(applyCmd(s, 0, { c: 'build', ids: [b.id], kind: 'barracks', x: 90, y: 90 }) ?? '', /рядом со штабом/);
  assert.match(applyCmd(s, 0, { c: 'build', ids: [b.id], kind: 'post', x: 30, y: 30 }) ?? '', /точки/);
  assert.equal(applyCmd(s, 0, { c: 'move', ids: [unit(s, 0, 'captain').id], x: NaN, y: 1 }), undefined);
  assert.equal(unit(s, 0, 'captain').order, null);
});

test('бой: капитан добивает вражескую базу, игра заканчивается победой', () => {
  const s = newState(2);
  const cap = unit(s, 0, 'captain'), hq = unit(s, 1, 'hq');
  s.units = s.units.filter(u => u !== unit(s, 1, 'captain')); // без защитника, иначе капитан не переживёт
  [cap.x, cap.y] = [hq.x - 5, hq.y];
  applyCmd(s, 0, { c: 'attack', ids: [cap.id], id: hq.id });
  run(s, 120);
  assert.equal(s.winner, 0);
});

test('энергия: литейня и насос на жиле дают энергию; турель стоит энергию', () => {
  const s = newState(2);
  const b = unit(s, 0, 'builder'), hq = unit(s, 0, 'hq');
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
  const cap = unit(s, 0, 'captain'), ri = POINTS.length;
  [cap.x, cap.y] = RELICS[0] as [number, number];
  run(s, 6);
  assert.equal(s.points[ri].owner, 0);
  assert.match(applyCmd(s, 0, { c: 'upgrade', id: cap.id }) ?? '', /реликвий/);
  run(s, 40);
  assert.ok(s.players[0].relics >= 2);
  assert.equal(applyCmd(s, 0, { c: 'upgrade', id: cap.id }), undefined);
  run(s, 6);
  assert.equal(cap.lvl, 2);
});
