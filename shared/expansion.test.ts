import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import { applyCmd, newState, step, snapshot, GRENADE_WINDUP, GRENADE_FLIGHT } from './sim.ts';

test('equipment requires tier two and is paid for server-side', () => {
  const s = newState(2), u = s.units.find(v => v.owner === 0 && v.kind === 'captain')!;
  assert.equal(applyCmd(s, 0, { c: 'equip', id: u.id, slot: 'weapon' }), 'Нужен тир 2');
  s.players[0].tier = 2; s.players[0].req = 1000;
  assert.equal(applyCmd(s, 0, { c: 'equip', id: u.id, slot: 'weapon' }), undefined);
  assert.equal(u.gear?.weapon, 1);
  assert.equal(s.players[0].req, 875);
  assert.equal(applyCmd(s, 1, { c: 'equip', id: u.id, slot: 'weapon' }), 'Недопустимый юнит или слот');
  assert.equal(u.gear?.weapon, 1);
});

test('nuclear strike requires resources, tech and cooldown, and appears in snapshot', () => {
  const s = newState(2); s.players[0].tier = 2; s.players[0].req = 2000;
  const enemy = s.units.find(u => u.owner === 1 && u.kind === 'hq')!;
  const hp = enemy.hp;
  assert.equal(applyCmd(s, 0, { c: 'nuke', x: enemy.x, y: enemy.y }), undefined);
  assert.ok(enemy.hp < hp);
  assert.equal(s.players[0].req, 1100);
  assert.equal(snapshot(s).blasts?.length, 1);
  assert.equal(applyCmd(s, 0, { c: 'nuke', x: enemy.x, y: enemy.y }), 'Ядерное оружие перезаряжается');
  step(s);
  assert.ok((s.nuclearCooldowns?.[0] ?? 0) < 240);
});

test('nuclear strike rejects non-finite coordinates and does not spend resources', () => {
  const s = newState(2); s.players[0].tier = 2; s.players[0].req = 2000;
  assert.equal(applyCmd(s, 0, { c: 'nuke', x: NaN, y: 40 }), 'Недопустимая цель');
  assert.equal(s.players[0].req, 2000);
});

test('grenades require owned infantry, range and cooldown', () => {
  const s = newState(2);
  const captain = s.units.find(u => u.owner === 0 && u.kind === 'captain')!;
  const enemy = s.units.find(u => u.owner === 1 && u.kind === 'captain')!;
  assert.equal(applyCmd(s, 0, { c: 'grenade', id: enemy.id, x: captain.x, y: captain.y }), 'Гранату может бросить только капитан или гвардия');
  assert.equal(applyCmd(s, 0, { c: 'grenade', id: captain.id, x: 99, y: 99 }), 'Цель слишком далеко');
  assert.equal(applyCmd(s, 0, { c: 'grenade', id: captain.id, x: captain.x, y: captain.y }), undefined);
  assert.equal(snapshot(s).blasts?.length, 0);
  assert.equal(snapshot(s).grenades?.length, 1);
  step(s, GRENADE_WINDUP + GRENADE_FLIGHT);
  assert.equal(snapshot(s).blasts?.[0]?.[3], 40);
  assert.equal(applyCmd(s, 0, { c: 'grenade', id: captain.id, x: captain.x, y: captain.y }), 'Граната перезаряжается');
});


test('grenade damage waits for impact, excludes allies and occurs once', () => {
  const s=newState(2), caster=s.units.find(u=>u.owner===0&&u.kind==='captain')!, enemy=s.units.find(u=>u.owner===1&&u.kind==='captain')!;
  caster.x=30;caster.y=30;enemy.x=35;enemy.y=30;
  for(const u of s.units) u.cd=100;
  const hp=enemy.hp, allyHp=caster.hp;
  assert.equal(applyCmd(s,0,{c:'grenade',id:caster.id,x:35,y:30}),undefined);
  const id=snapshot(s).grenades![0][0];
  step(s,GRENADE_WINDUP); assert.equal(enemy.hp,hp);
  step(s,GRENADE_FLIGHT-0.05); assert.equal(enemy.hp,hp);
  step(s,0.05); assert.equal(enemy.hp,hp-110);assert.equal(caster.hp,allyHp);
  assert.equal(snapshot(s).blasts![0][4],id);assert.equal(snapshot(s).grenades!.length,0);
  step(s,0.05);assert.equal(enemy.hp,hp-110);
});

test('grenade validates finite targets and uses position at impact',()=>{
  const s=newState(2),caster=s.units.find(u=>u.owner===0&&u.kind==='captain')!,enemy=s.units.find(u=>u.owner===1&&u.kind==='captain')!;
  caster.x=30;caster.y=30;enemy.x=35;enemy.y=30;
  for(const u of s.units) u.cd=100;
  for(const x of [NaN,Infinity,-1,101]) assert.equal(applyCmd(s,0,{c:'grenade',id:caster.id,x,y:30}),'Недопустимая цель');
  assert.equal(caster.grenadeCd,undefined);
  applyCmd(s,0,{c:'grenade',id:caster.id,x:35,y:30});
  enemy.x=80;enemy.y=80;const hp=enemy.hp;
  step(s,GRENADE_WINDUP+GRENADE_FLIGHT);assert.equal(enemy.hp,hp);
});
