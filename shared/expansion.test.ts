import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import { applyCmd, newState, step, snapshot } from './sim.ts';

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
