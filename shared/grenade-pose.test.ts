import assert from 'node:assert/strict';
import { test } from 'node:test';
import { FactionActor } from '../client/faction-models.ts';
import { GRENADE_WINDUP, GRENADE_FLIGHT, applyCmd, newState, step, DT } from './sim.ts';
test('procedural grenade pose releases at server windup and holds completed recovery',()=>{
  const actor=new FactionActor('legion','captain'),arm=actor.root.getObjectByName('UpperArm_R')!;
  actor.pose('throw_grenade',GRENADE_WINDUP);const windup=arm.rotation.x;
  actor.pose('throw_grenade',GRENADE_WINDUP+0.1);assert.ok(arm.rotation.x<windup);
  actor.pose('throw_grenade',GRENADE_WINDUP+GRENADE_FLIGHT);assert.ok(Math.abs(arm.rotation.x)<1e-9);
  actor.pose('throw_grenade',10);assert.ok(Math.abs(arm.rotation.x)<1e-9);
});
test('server holds the thrower during windup and resumes its movement order',()=>{
  const s=newState(2),u=s.units.find(u=>u.owner===0&&u.kind==='captain')!;
  u.x=30;u.y=30;u.order={t:'move',x:40,y:30};
  applyCmd(s,0,{c:'grenade',id:u.id,x:30,y:35});
  step(s,DT);assert.equal(u.x,30);assert.equal(u.y,30);
  for(let i=0;i<8;i++)step(s,DT);assert.ok(u.x>30);
});
