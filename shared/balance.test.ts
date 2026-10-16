import { test } from 'node:test';
import assert from 'node:assert/strict';
import { applyCmd, DT, hurt, maxHp, newState, spawn, step, type Kind, type State, type Unit } from './sim.ts';
import { FACTION_IDS, type FactionId } from './factions.ts';

// Keep each player's remote headquarters so a target's death does not end the simulation.
// Frozen targets isolate damage; tests marked return fire leave their actual combat AI active.
function arena(factions: FactionId[] = ['order', 'order']) {
  const s = newState(2, factions);
  s.units = s.units.filter(u => u.kind === 'hq');
  s.points = [];
  return s;
}
function advance(s: State, seconds: number) {
  for (let i = 0; i < Math.round(seconds / DT); i++) step(s);
}
function duel(attacker: Kind, target: Kind, distance: number, retaliate = false, factions?: FactionId[]) {
  const s = arena(factions), victim = spawn(s, 1, target, 120 + distance, 60), source = spawn(s, 0, attacker, 120, 60);
  if (!retaliate) victim.frozen = 1e6;
  assert.equal(applyCmd(s, 0, { c: 'attack', ids: [source.id], id: victim.id }), undefined);
  return { s, source, victim };
}
function damageAfter(attacker: Kind, target: Kind, distance: number, seconds: number) {
  const { s, victim } = duel(attacker, target, distance);
  const hp = victim.hp;
  advance(s, seconds);
  return hp - Math.max(0, victim.hp);
}
function firstHit(configure: (s: State, victim: Unit) => void) {
  const { s, victim } = duel('heavy', 'guard', 16), hp = victim.hp;
  configure(s, victim);
  step(s);
  return hp - victim.hp;
}

test('баланс: обычный отряд не сносит штаб, а осадное оружие наносит заметный урон', () => {
  const rifles = damageAfter('guard', 'hq', 12.5, 60), siege = damageAfter('arty', 'hq', 30, 60);
  assert.ok(rifles > 0 && rifles < maxHp('hq') * 0.1, 'стрелковое оружие только царапает завершённый штаб за минуту');
  assert.ok(siege > maxHp('hq') * 0.15 && siege > rifles * 5, 'артиллерия остаётся полезным средством осады');
  const { s, source, victim } = duel('guard', 'hq', 12.5, true);
  advance(s, 120);
  assert.ok(source.hp <= 0 && victim.hp > maxHp('hq') * 0.85, 'один ранний отряд проигрывает огню штаба');
});

test('баланс: завершённый штаб каждой из шести фракций выдерживает один ранний отряд', () => {
  for(const faction of FACTION_IDS) {
    const { s, victim }=duel('guard','hq',12.5,true,[faction,faction]);
    advance(s,120);
    assert.ok(victim.hp>maxHp('hq')*0.8,`${faction}: один отряд не разрушает базу за две минуты`);
  }
});

test('баланс: лёгкая техника уязвима для стрелков, тяжёлая требует противотанкового оружия', () => {
  const light = damageAfter('guard', 'lveh', 11, 30), tank = damageAfter('guard', 'hveh', 11.5, 30);
  const antiTank = damageAfter('heavy', 'hveh', 16, 30), closeAntiTank = damageAfter('heavy', 'hveh', 5.8, 30);
  assert.ok(light > maxHp('lveh') * 0.15 && light > tank * 3, 'винтовки опасны лёгкой машине');
  assert.ok(tank < maxHp('hveh') * 0.05, 'винтовки не заменяют противотанковый отряд');
  assert.ok(antiTank > maxHp('hveh') * 0.15 && antiTank > tank * 5, 'противотанковое вооружение действительно пробивает танк');
  assert.ok(closeAntiTank >= antiTank * 0.75, 'сближение с танком не переключает отряд на бесполезные пистолеты');
});

test('баланс: смешанный отряд из двух противотанковых расчётов и стрелков побеждает один танк', () => {
  const { s, source: rifles, victim: tank }=duel('guard','hveh',12,true);
  const teams=[spawn(s,0,'heavy',118,55),spawn(s,0,'heavy',118,65)];
  for(const team of teams)assert.equal(applyCmd(s,0,{c:'attack',ids:[team.id],id:tank.id}),undefined);
  for(let t=0;t<Math.round(150/DT)&&tank.hp>0;t++)step(s);
  assert.ok(tank.hp<=0,'два противотанковых отряда могут уничтожить танк под ответным огнём');
  assert.ok([rifles,...teams].some(u=>u.hp>0),'танк не стирает весь смешанный отряд раньше, чем тот реализует своё оружие');
});

test('баланс: пехота выдерживает несколько попаданий техники, ближний бой остаётся полезным', () => {
  for (const [weapon, distance] of [['hveh', 16], ['arty', 30]] as const) {
    const { s, victim } = duel(weapon, 'guard', distance), hp = victim.hp;
    advance(s, 1);
    assert.ok(victim.hp > hp * 0.5, `${weapon}: первый выстрел не стирает полный отряд`);
    advance(s, 89);
    assert.ok(victim.hp <= 0, `${weapon}: стационарная пехота не бессмертна под огнём техники`);
  }
  const { s, victim } = duel('elite', 'guard', 4);
  advance(s, 60);
  assert.ok(victim.hp <= 0, 'элитная рукопашная пехота побеждает обычный отряд, если добралась до него');
});

test('защита: исследование брони и изученная аура капитана реально уменьшают входящий урон', () => {
  const unprotected = firstHit(() => undefined);
  const researched = firstHit(s => { s.players[1].research |= 1 << 0; });
  const aura = firstHit((s, victim) => {
    const captain = spawn(s, 1, 'captain', victim.x + 7, victim.y + 4);
    captain.arch = 'assault'; captain.frozen = 1e6; captain.hero!.abil |= 1 << 0;
  });
  assert.ok(unprotected > 0, 'контрольный выстрел попал');
  assert.ok(researched > 0 && researched < unprotected * 0.95, 'исследование не потерялось в комментарии формулы');
  assert.ok(aura > 0 && aura < unprotected * 0.9, 'пассивная аура не зависит от архетипа командора');
});

test('защита от взрыва: броня основной цели не передаётся соседям, улучшение защищает самого потерпевшего', () => {
  function splash(primaryLevel: number, victimLevel: number) {
    const { s, victim: primary } = duel('arty', 'guard', 20);
    const secondary = spawn(s, 1, 'guard', primary.x + 1.5, primary.y + 1);
    secondary.frozen = 1e6; secondary.lvl = victimLevel; primary.lvl = primaryLevel;
    const hp = secondary.hp;
    step(s);
    return hp - secondary.hp;
  }
  const ordinary = splash(1, 1), primaryArmored = splash(2, 1), secondaryArmored = splash(1, 2);
  assert.ok(ordinary > 0, 'сосед получил осколки');
  assert.ok(Math.abs(primaryArmored - ordinary) < ordinary * 0.02, 'броня выбранной цели не уменьшает урон соседнему отряду');
  assert.ok(secondaryArmored > 0 && secondaryArmored < ordinary * 0.9, 'улучшенная броня соседнего отряда действует на сплэш');
});

test('зажигательный огонь: перекрывающиеся пожары не складываются и учитывают броню', () => {
  function burn(kind: Kind, patches: number) {
    const s = arena(), victim = spawn(s, 1, kind, 140, 60), hp = victim.hp;
    victim.frozen = 1e6;
    for (let i = 0; i < patches; i++) s.plagues.push({ x: victim.x, y: victim.y, t: 6, owner: 0, fire: true });
    advance(s, 1);
    return hp - victim.hp;
  }
  const single = burn('barracks', 1), overlapping = burn('barracks', 12);
  assert.ok(single > 0, 'один пожар наносит урон зданию');
  assert.ok(Math.abs(overlapping - single) < 0.01, 'дюжина одновременных пятен не умножает урон казарме');
  assert.ok(burn('hveh', 1) < burn('guard', 1) * 0.2, 'огонь не игнорирует тяжёлую броню');
});

test('ремонт: один строитель не обнуляет осаду, под огнём чинит медленнее', () => {
  function restored(underFire: boolean) {
    const s = arena(), site = spawn(s, 0, 'barracks', 140, 60), builder = spawn(s, 0, 'builder', 136, 60);
    hurt(s, site, 500, 1);
    site.hit = underFire ? 0 : 10;
    builder.order = { t: 'build', id: site.id };
    const hp = site.hp;
    advance(s, 1);
    return site.hp - hp;
  }
  const calm = restored(false), fighting = restored(true);
  assert.ok(calm > 0 && calm <= 35, 'ремонт ограничен абсолютной скоростью, а не процентом огромного запаса HP');
  assert.ok(fighting > 0 && fighting < calm * 0.6, 'под огнём остаётся только аварийный ремонт');
});

test('живой металл: некронские здания не регенерируют сразу после попадания', () => {
  const s = arena(['order', 'clockwork']), site = spawn(s, 1, 'barracks', 140, 60);
  hurt(s, site, 500, 0);
  const hp = site.hp;
  advance(s, 3);
  assert.equal(site.hp, hp, 'недавний урон прерывает пассивный ремонт');
  advance(s, 4);
  assert.ok(site.hp > hp, 'после затишья живой металл снова восстанавливает здание');
});

test('артиллерия считается техникой: медик лечит пехоту рядом, машину чинит строитель', () => {
  const s=arena(), artillery=spawn(s,0,'arty',140,60), infantry=spawn(s,0,'guard',143,63);
  spawn(s,0,'healer',145,65);
  hurt(s,artillery,200,1);hurt(s,infantry,100,1);
  const artilleryHp=artillery.hp,infantryHp=infantry.hp;
  advance(s,1);
  assert.ok(infantry.hp>infantryHp,'медик действует: соседняя пехота получает лечение');
  assert.equal(artillery.hp,artilleryHp,'лечение пехоты не восстанавливает артиллерию');
  const builder=spawn(s,0,'builder',136,60);
  assert.equal(applyCmd(s,0,{c:'assist',ids:[builder.id],id:artillery.id}),undefined);
  advance(s,1);
  assert.ok(artillery.hp>artilleryHp,'повреждённую артиллерию можно отремонтировать строителем');
});

test('ПВО: постройки сбивают самолёты, самолёт не сносит штаб в одиночку', () => {
  const { s, victim: jet } = duel('turret', 'jet', 10);
  advance(s, 20);
  assert.ok(maxHp('jet') - jet.hp > maxHp('jet') * 0.3, 'турель за 20 с снимает самолёту больше трети здоровья');
  const toHq = damageAfter('jet', 'hq', 12, 60);
  assert.ok(toHq > 0 && toHq < maxHp('hq') * 0.2, 'самолёт по зданиям бьёт вполсилы');
});

test('осада: артиллерия по зданиям бьёт дальше, чем по войскам, если цель засвечена', () => {
  const s = arena(), hq = s.units.find(u => u.owner === 1)!, arty = spawn(s, 0, 'arty', hq.x - 55 - 4.5, hq.y);
  s.players[0].energy = 1000;
  assert.equal(applyCmd(s, 0, { c: 'scan', x: hq.x, y: hq.y }), undefined);
  assert.match(applyCmd(s, 0, { c: 'scan', x: hq.x, y: hq.y }) ?? '', /Перезарядка/);
  const hp = hq.hp;
  arty.frozen = 0; step(s);
  assert.ok(hq.hp < hp, 'засвеченный штаб в 55 м под огнём артиллерии');
});

test('засвет открывает скрытых порталом, обычная армия отвечает тому, кто бьёт издалека', async () => {
  const { visibleTo } = await import('./sim.ts');
  const s = arena(['eldar', 'order']), portal = spawn(s, 0, 'portal', 100, 100), hidden = spawn(s, 0, 'guard', 104, 100);
  spawn(s, 1, 'guard', 120, 100).frozen = 1e6;
  void portal; step(s);
  assert.ok(!visibleTo(s, 1).has(hidden.id), 'под порталом отряд скрыт');
  s.players[1].energy = 1000;
  assert.equal(applyCmd(s, 1, { c: 'scan', x: 104, y: 100 }), undefined);
  assert.ok(visibleTo(s, 1).has(hidden.id), 'засвет его показывает');

  const t = arena(), arty = spawn(t, 0, 'arty', 60, 160), guard = spawn(t, 1, 'guard', 100, 160);
  assert.equal(applyCmd(t, 0, { c: 'attack', ids: [arty.id], id: guard.id }), undefined);
  advance(t, 0.2);
  const d0 = Math.hypot(guard.x - arty.x, guard.y - arty.y);
  advance(t, 3);
  assert.ok(Math.hypot(guard.x - arty.x, guard.y - arty.y) < d0 - 10, 'обстрелянный отряд идёт на стрелка');
});

test('генераторы: один на точку, жилу или штаб; титан не занимает лимит техники', async () => {
  const { VENTS, legion } = await import('./sim.ts');
  const s = newState(2), p = s.players[0], hq = s.units.find(u => u.owner === 0 && u.kind === 'hq')!, b = s.units.find(u => u.owner === 0 && u.kind === 'builder')!;
  Object.assign(p, { req: 1e4, energy: 1e4 });
  assert.equal(applyCmd(s, 0, { c: 'build', ids: [b.id], kind: 'foundry', x: hq.x + 8, y: hq.y + 3 }), undefined);
  assert.match(applyCmd(s, 0, { c: 'build', ids: [b.id], kind: 'foundry', x: hq.x - 8, y: hq.y + 6 }) ?? '', /один генератор/);
  assert.equal(applyCmd(s, 0, { c: 'build', ids: [b.id], kind: 'pump', x: VENTS[0][0] + 2, y: VENTS[0][1] }), undefined);
  assert.match(applyCmd(s, 0, { c: 'build', ids: [b.id], kind: 'pump', x: VENTS[0][0] - 2, y: VENTS[0][1] }) ?? '', /жил/);
  spawn(s, 0, 'titan', hq.x + 30, hq.y + 30);
  assert.equal(legion(s, 0, true), 0);
  const yard = spawn(s, 0, 'yard', hq.x - 25, hq.y); p.tier = 4; s.points[0].owner = 0; Object.assign(p, { req: 1e5, energy: 1e5, relics: 100 });
  for (let i = 0; i < 6; i++) spawn(s, 0, 'hveh', hq.x + 40, hq.y + i * 4); // лимит техники забит: 48 из 45
  assert.equal(applyCmd(s, 0, { c: 'train', id: yard.id, k: 'titan' }), undefined, 'полный техцех не мешает титану');
});

test('Теневой портал: ставится в поле, прячет стены и постройки, видно только вплотную', async () => {
  const { visibleTo, PORTAL } = await import('./sim.ts');
  const s = newState(2, ['eldar', 'order']), p = s.players[0], b = s.units.find(u => u.owner === 0 && u.kind === 'builder')!;
  Object.assign(p, { req: 1e4, energy: 1e4, tier: 2 });
  assert.equal(applyCmd(s, 0, { c: 'build', ids: [b.id], kind: 'portal', x: 100, y: 160 }), undefined, 'далеко от базы — можно');
  const portal = s.units.find(u => u.kind === 'portal')!; portal.build = 1; portal.hp = maxHp('portal');
  const wall = spawn(s, 0, 'wall', portal.x + 8, portal.y), scout = spawn(s, 1, 'guard', wall.x + 12, wall.y);
  scout.frozen = 1e6; step(s);
  assert.ok(!visibleTo(s, 1).has(wall.id), 'стена под порталом скрыта');
  scout.x = wall.x + PORTAL.reveal; step(s);
  assert.ok(visibleTo(s, 1).has(wall.id), 'вплотную видно');
});

test('генераторов не больше GEN_CAP', async () => {
  const { GEN_CAP } = await import('./sim.ts');
  const s = newState(2), b = s.units.find(u => u.owner === 0 && u.kind === 'builder')!;
  Object.assign(s.players[0], { req: 1e4, energy: 1e4 });
  for (let i = 0; i < GEN_CAP; i++) spawn(s, 0, 'foundry', 5 + i * 3, 230);
  s.points[1].owner = 0;
  assert.match(applyCmd(s, 0, { c: 'build', ids: [b.id], kind: 'foundry', x: s.points[1].x + 7, y: s.points[1].y }) ?? '', /не больше/);
});
