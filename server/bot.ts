import { applyCmd, isStruct, maxHp, STATS, type Kind, type State } from '../shared/sim.ts';

/** Бот играет по тем же правилам: казармы, второй строитель, посты на точках, гвардия с пополнением, атака на штаб. */
export function botThink(s: State, me: number): void {
  if (s.tick % 20 !== (me * 7) % 20) return; // раз в секунду, со сдвигом, чтобы боты не думали в один тик
  const mine = s.units.filter(u => u.owner === me && u.hp > 0);
  const hq = mine.find(u => u.kind === 'hq');
  if (!hq) return;
  const of = (k: Kind) => mine.filter(u => u.kind === k);
  const builders = of('builder'), guards = of('guard'), barracks = of('barracks');
  const req = s.players[me].req;
  const dir = Math.atan2(50 - hq.y, 50 - hq.x);
  const d = (a: { x: number; y: number }, b: { x: number; y: number }) => Math.hypot(a.x - b.x, a.y - b.y);

  if (!barracks.length && builders.length && req >= STATS.barracks.cost) {
    for (const [r, a] of [[14, 0.6], [14, -0.6], [17, 1.1], [17, -1.1]]) {
      const err = applyCmd(s, me, { c: 'build', ids: builders.map(b => b.id), kind: 'barracks', x: hq.x + Math.cos(dir + a) * r, y: hq.y + Math.sin(dir + a) * r });
      if (!err) return;
    }
  }
  const site = mine.find(u => isStruct(u.kind) && u.build < 1);
  const idle = builders.filter(b => !b.order);
  if (site) for (const b of idle) applyCmd(s, me, { c: 'assist', ids: [b.id], id: site.id });
  else if (idle.length && req >= STATS.post.cost) {
    const free = s.points.filter(p => p.owner === me && !s.units.some(u => u.kind === 'post' && u.hp > 0 && d(u, p) < 2)).sort((a, b) => d(a, hq) - d(b, hq))[0];
    if (free) applyCmd(s, me, { c: 'build', ids: idle.map(b => b.id), kind: 'post', x: free.x, y: free.y });
  }
  if (builders.length + hq.q < 2) applyCmd(s, me, { c: 'train', id: hq.id });
  if (barracks.some(b => b.build >= 1) && s.players[me].tier < 2 && hq.upg < 0 && req >= 260) applyCmd(s, me, { c: 'upgrade', id: hq.id });
  if (!of('turret').length && !site && idle.length && req >= 180) {
    applyCmd(s, me, { c: 'build', ids: idle.map(b => b.id), kind: 'turret', x: hq.x + Math.cos(dir) * 9, y: hq.y + Math.sin(dir) * 9 });
  }
  if (s.players[me].tier > 1) for (const u of [...of('post'), ...of('turret'), ...guards]) if (u.lvl < 2 && u.upg < 0 && s.players[me].req >= 150) applyCmd(s, me, { c: 'upgrade', id: u.id });
  for (const b of barracks) if (b.build >= 1 && b.q < 2) applyCmd(s, me, { c: 'train', id: b.id });

  if (s.tick % 100 !== (me * 7) % 100) return; // приказы армии раз в 5 секунд
  const hurt = guards.filter(g => g.hp < maxHp('guard'));
  if (hurt.length) applyCmd(s, me, { c: 'reinforce', ids: hurt.map(g => g.id) });
  const army = [...guards, ...of('captain')];
  if (!army.length) return;
  const enemyHq = s.units.filter(u => u.kind === 'hq' && u.owner !== me && s.players[u.owner].alive).sort((a, b) => d(a, hq) - d(b, hq))[0];
  const point = s.points.filter(p => p.owner !== me).sort((a, b) => d(a, hq) - d(b, hq))[0];
  const goal = guards.length >= 4 || !point ? enemyHq : point;
  if (goal) applyCmd(s, me, { c: 'amove', ids: army.map(u => u.id), x: goal.x, y: goal.y });
}
