import { test } from 'node:test';
import assert from 'node:assert/strict';
import { snapshotFor, hurt, spawn, RESEARCH, TIER_UP, RAGE_MAX, REMAINS_PER_SQUAD, applyCmd, members, maxHp, newState, step, DT, START_REQ, STATS, POINTS, RELICS, VENTS, type Kind, type State } from './sim.ts';

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
  assert.match(applyCmd(s, 0, { c: 'build', ids: [b.id], kind: 'turret', x: 60, y: 60 }) ?? '', /у своих построек/);
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
  hq.hp = 400; // уже побитая база: по зданиям пехота бьёт слабо (STRUCT_ARMOR)
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
  run(s, 13); // CAPTURE_TIME 12 с
  assert.equal(s.points[ri].owner, 0);
  assert.match(applyCmd(s, 0, { c: 'upgrade', id: cap.id }) ?? '', /реликвий/);
  run(s, 40);
  assert.ok(s.players[0].relics >= 2);
  assert.equal(applyCmd(s, 0, { c: 'upgrade', id: cap.id }), undefined);
  run(s, 6);
  assert.equal(cap.lvl, 2);
});

test('Династии: платят энергией, влияния нет', () => {
  const s = newState(2, ['clockwork', 'order']);
  const hq = unit(s, 0, 'hq');
  assert.match(applyCmd(s, 0, { c: 'train', id: hq.id }) ?? '', /энергии/);
  s.players[0].energy = 100;
  assert.equal(applyCmd(s, 0, { c: 'train', id: hq.id }), undefined);
  assert.equal(s.players[0].energy, 100 - STATS.builder.cost);
  const r = s.players[0].req;
  run(s, 2);
  assert.equal(s.players[0].req, r, 'влияние не копится');
});

test('Нежить: генераторы нельзя, отряд из останков бесплатно', () => {
  const s = newState(2, ['undead', 'order']);
  const b = unit(s, 0, 'builder'), hq = unit(s, 0, 'hq');
  assert.match(applyCmd(s, 0, { c: 'build', ids: [b.id], kind: 'foundry', x: hq.x + 8, y: hq.y + 3 }) ?? '', /Скорбь/);
  applyCmd(s, 0, { c: 'build', ids: [b.id], kind: 'barracks', x: hq.x + 10, y: hq.y + 10 });
  run(s, 30);
  s.players[0].remains = REMAINS_PER_SQUAD; s.players[0].req = 0;
  assert.equal(applyCmd(s, 0, { c: 'train', id: unit(s, 0, 'barracks').id }), undefined);
  assert.equal(s.players[0].remains, 0);
});

test('Орда: ярость копится от урона и запускает ВААГХ', () => {
  const s = newState(2, ['orks', 'order']);
  const cap = unit(s, 0, 'captain'), hq = unit(s, 1, 'hq');
  s.units = s.units.filter(u => u !== unit(s, 1, 'captain'));
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
  const cap = unit(s, 0, 'captain');
  [cap.x, cap.y] = [66, 56];
  applyCmd(s, 0, { c: 'move', ids: [cap.id], x: 76, y: 56 });
  run(s, 3);
  assert.ok(cap.x < 70, 'стена не пропускает');
  assert.equal(applyCmd(s, 0, { c: 'build', ids: [b.id], kind: 'mine', x: 58, y: 76 }), undefined);
  run(s, 15); // по эту сторону стены: обхода препятствий у юнитов нет
  const enemy = unit(s, 1, 'captain'), hp = enemy.hp;
  [enemy.x, enemy.y] = [58, 77];
  run(s, 0.2);
  assert.ok(enemy.hp <= hp - 170, 'мина сработала');
  assert.ok(!s.units.some(u => u.kind === 'mine'), 'мина исчезла');
});

test('прокачка точки: столп → укреплённый → бастион, центр не укрепить', () => {
  const s = newState(2);
  const p = s.players[0], b = unit(s, 0, 'builder');
  p.req = 5000; p.energy = 5000; p.tier = 2;
  applyCmd(s, 0, { c: 'build', ids: [b.id], kind: 'post', x: POINTS[1][0], y: POINTS[1][1] });
  run(s, 25);
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
  const p = s.players[0], cap = unit(s, 0, 'captain');
  assert.equal(p.clvl, 1); assert.equal(p.pts, 1);
  assert.match(applyCmd(s, 0, { c: 'learn', a: 4 }) ?? '', /предыдущая|уровень/);
  assert.equal(applyCmd(s, 0, { c: 'learn', a: 3 }), undefined);
  assert.match(applyCmd(s, 0, { c: 'learn', a: 0 }) ?? '', /очков/);
  const e = unit(s, 1, 'builder');
  [e.x, e.y] = [cap.x + 1, cap.y];
  run(s, 10);
  assert.ok(!s.units.includes(e), 'строитель врага убит');
  assert.equal(p.xp, 5);
  [cap.x, cap.y] = POINTS[3];
  run(s, 13);
  assert.equal(s.points[3].owner, 0);
  assert.equal(p.xp, 30, 'захват точки +25');
  p.xp = 95; const ec = unit(s, 1, 'captain'); ec.by = 0; ec.hp = 0; run(s, 0.1);
  assert.equal(p.clvl, 2); assert.equal(p.xp, 35); assert.equal(p.pts, 1, 'новый уровень — очко');
  p.clvl = 4; p.tier = 2;
  assert.equal(applyCmd(s, 0, { c: 'learn', a: 4 }), undefined);
  const foe = unit(s, 1, 'hq'), hp = foe.hp;
  [cap.x, cap.y] = [foe.x + 5, foe.y];
  assert.equal(applyCmd(s, 0, { c: 'ability', a: 4 }), undefined);
  assert.ok(foe.hp <= hp - 150, 'Вихрь ранит');
  assert.match(applyCmd(s, 0, { c: 'ability', a: 4 }) ?? '', /Перезарядка/);
});

test('Рубаки Орды бьют в упор, Стражники Ордена стреляют издалека', () => {
  const s = newState(2, ['orks', 'order']);
  const hq0 = unit(s, 0, 'hq'), hq1 = unit(s, 1, 'hq');
  const choppa = spawn(s, 0, 'guard', 50, 50), target = spawn(s, 1, 'guard', 57, 50);
  void hq0; void hq1;
  run(s, 0.2);
  assert.ok(s.shots.length === 0 || s.shots.every(sh => sh[4] !== 1), 'с 7 м Рубаки ещё не бьют');
  assert.ok(s.shots.some(sh => sh[4] === 0), 'Стражник уже стреляет');
  s.shots.length = 0;
  run(s, 2);
  assert.ok(Math.hypot(choppa.x - target.x, choppa.y - target.y) < 5, 'Рубаки сблизились');
  assert.ok(s.shots.some(sh => sh[4] === 1), 'рубящий удар');
});

test('армия по ролям: найм по тиру, Легион, урон по броне, ремонт, гранаты, титан один', () => {
  const s = newState(2);
  const p = s.players[0], hq = unit(s, 0, 'hq'), b = unit(s, 0, 'builder');
  p.req = 1e5; p.energy = 1e5; p.relics = 20;
  const bar = spawn(s, 0, 'barracks', hq.x + 12, hq.y);
  assert.match(applyCmd(s, 0, { c: 'train', id: bar.id, k: 'sniper' }) ?? '', /тир/);
  p.tier = 4;
  for (const k of ['sniper', 'heavy', 'support', 'elite', 'healer'] as const) assert.equal(applyCmd(s, 0, { c: 'train', id: bar.id, k }), undefined, k);
  run(s, 70);
  for (const k of ['sniper', 'heavy', 'support', 'elite', 'healer'] as const) assert.ok(s.units.some(u => u.owner === 0 && u.kind === k), k + ' нанят');
  // Легион: титан занимает 20, второго не дадут
  assert.equal(applyCmd(s, 0, { c: 'train', id: hq.id, k: 'titan' }), undefined);
  assert.match(applyCmd(s, 0, { c: 'train', id: hq.id, k: 'titan' }) ?? '', /один|Легион/);
  // снайпер почти не царапает технику, тяжёлое оружие — сильно
  const veh = spawn(s, 1, 'mveh', 80, 80), sn = unit(s, 0, 'sniper'), hv = unit(s, 0, 'heavy');
  [sn.x, sn.y] = [80, 66]; const hp0 = veh.hp; sn.order = { t: 'attack', id: veh.id }; hv.x = -50;
  run(s, 3.5); const bySniper = hp0 - veh.hp;
  [hv.x, hv.y] = [80, 66]; sn.x = -50; sn.order = null; hv.order = { t: 'attack', id: veh.id };
  const hp1 = veh.hp; run(s, 3.5); const byHeavy = hp1 - veh.hp;
  assert.ok(byHeavy > bySniper * 5, `тяжёлое ${byHeavy} vs снайпер ${bySniper}`);
  // ремонт: строитель чинит казармы за влияние
  bar.hp = 200; const req = p.req;
  assert.equal(applyCmd(s, 0, { c: 'assist', ids: [b.id], id: bar.id }), undefined);
  run(s, 20);
  assert.ok(bar.hp > 600, 'казармы отремонтированы'); assert.ok(p.req < req, 'ремонт стоит влияния');
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

test('особые механики: купол-эгида и дрон Консенсуса, Архангел Ордена, Бог-Механизм Династий, турели Орды', () => {
  // Консенсус: купол поглощает урон, пробитый — 10 с отдыхает
  const s = newState(2, ['prism', 'orks']);
  const p = s.players[0], hq = unit(s, 0, 'hq'); p.tier = 2; p.req = 1e4; p.energy = 1e4;
  const dome = spawn(s, 0, 'aegis', hq.x + 6, hq.y);
  const g = spawn(s, 0, 'guard', hq.x + 8, hq.y), hp = g.hp;
  hurt(s, g, 500, 1);
  assert.equal(g.hp, hp, 'купол забрал урон'); assert.equal(dome.sh, 700);
  hurt(s, g, 800, 1);
  assert.ok(dome.off > 0, 'купол пробит'); assert.ok(g.hp < hp);
  // дрон: щит отряду
  const sup = spawn(s, 0, 'support', g.x + 2, g.y); void sup;
  g.hit = 9; run(s, 15);
  assert.ok(g.sh > 200, 'дрон дал щит');
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
  cp.energy = 1e4; cp.tier = 4;
  assert.match(applyCmd(c, 0, { c: 'ascend' }) ?? '', /уровень/);
  cp.clvl = 10;
  assert.equal(applyCmd(c, 0, { c: 'ascend' }), undefined);
  run(c, 5);
  const god = c.units.find(u => u.owner === 0 && u.kind === 'deity')!;
  assert.ok(god, 'Бог-Механизм явился');
  const foe = unit(c, 1, 'captain'); [foe.x, foe.y] = [god.x + 5, god.y];
  assert.equal(applyCmd(c, 0, { c: 'timestop' }), undefined);
  const fx = foe.x; applyCmd(c, 1, { c: 'move', ids: [foe.id], x: foe.x + 20, y: foe.y }); run(c, 2);
  assert.equal(foe.x, fx, 'время остановлено');
  god.hp = 0; run(c, 0.1);
  const back = unit(c, 0, 'captain');
  assert.ok(back && back.hp <= 0 && back.dead < 0, 'гибель бога: капитан недоступен надолго');
  // Орден: Архангел поднимает павшего бойца
  const o = newState(2, ['order', 'orks']), oh = unit(o, 0, 'hq');
  const angel = spawn(o, 0, 'healer', oh.x + 6, oh.y), sq = spawn(o, 0, 'guard', oh.x + 7, oh.y);
  void angel; sq.hp = STATS.guard.hp * 2; sq.hit = 0;
  run(o, 62);
  assert.ok(sq.hp >= STATS.guard.hp * 3, 'боец поднят');
});

test('победные очки тают у того, кто держит меньше точек; туман войны прячет далёких врагов', () => {
  const s = newState(2);
  s.points.forEach((p, i) => { if (!p.relic) p.owner = i === 0 ? 1 : i % 2; }); // у игрока 1 больше точек и центр
  const vp0 = s.vp[0];
  run(s, 10);
  assert.ok(s.vp[0] < vp0 - 10, 'очки игрока 0 тают'); // VP_RATE 0.5 × перевес ≥ 2 точек × 10 с assert.equal(s.vp[1], 500);
  s.vp[0] = 1; run(s, 1);
  assert.equal(s.players[0].alive, false); assert.equal(s.winner, 1);
  const f = newState(2), far = unit(f, 1, 'hq');
  const snap = snapshotFor(f, 0);
  assert.ok(!snap.u.some(r => r[0] === far.id), 'чужой штаб в тумане');
  assert.ok(snap.u.some(r => r[0] === unit(f, 0, 'hq').id), 'свой штаб виден');
  const scout = unit(f, 0, 'captain'); [scout.x, scout.y] = [far.x - 8, far.y];
  assert.ok(snapshotFor(f, 0).u.some(r => r[0] === far.id), 'разведка открыла штаб');
});

test('точки: турели вокруг своей точки, у критической точки строить нельзя; Нежить доплачивает энергию влиянием', () => {
  const s = newState(2, ['undead', 'order']);
  const p = s.players[0], b = unit(s, 0, 'builder'), hq = unit(s, 0, 'hq');
  p.req = 1e4; p.tier = 1;
  const pt = s.points[3]; pt.owner = 0;
  assert.equal(applyCmd(s, 0, { c: 'build', ids: [b.id], kind: 'turret', x: pt.x + 8, y: pt.y }), undefined, 'турель у своей точки');
  assert.match(applyCmd(s, 0, { c: 'build', ids: [b.id], kind: 'turret', x: s.points[0].x + 4, y: s.points[0].y }) ?? '', /критической/);
  assert.match(applyCmd(s, 0, { c: 'build', ids: [b.id], kind: 'post', x: s.points[0].x, y: s.points[0].y }) ?? '', /критической/);
  // Нежить: переход на тир II стоит 300 влияния + 150 энергии; энергии нет — доплата влиянием
  spawn(s, 0, 'key1', hq.x + 12, hq.y);
  p.energy = 0; const req = p.req;
  assert.equal(applyCmd(s, 0, { c: 'upgrade', id: hq.id }), undefined);
  assert.equal(req - p.req, 450);
});

test('здоровье по лестнице, стены укрепляются, артиллерия не бьёт в упор, яма жжёт, колокол ослабляет', () => {
  const tot = (k: Parameters<typeof maxHp>[0]) => maxHp(k);
  assert.ok(tot('guard') < tot('elite') && tot('elite') < tot('mveh') && tot('mveh') < tot('barracks') && tot('barracks') < tot('hq') && tot('hq') < tot('titan'), 'лестница здоровья');
  const s = newState(2, ['ashen', 'undead']);
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
  // Колокол Нежити замедляет врага
  const bell = spawn(s, 1, 'bell', 200, 200), me = spawn(s, 0, 'guard', 205, 200); void bell;
  applyCmd(s, 0, { c: 'move', ids: [me.id], x: 230, y: 200 }); const x0 = me.x; run(s, 1);
  assert.ok(me.x - x0 < 8.6 * 0.85, 'замедлен колоколом'); // одержимые Синклита бегут 8.6 м/с, колокол режет на 20%
});
