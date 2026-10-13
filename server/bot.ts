import { ABILITIES, canLearn, applyCmd, isStruct, maxHp, producible, ROLES, SQUADS, VEHICLES, MAP, STATS, type Kind, type State } from '../shared/sim.ts';

/** Бот играет по тем же правилам: казармы, второй строитель, посты на точках, гвардия с пополнением, атака на штаб. */
export function botThink(s: State, me: number): void {
  const pl = s.players[me];
  if (pl.pts > 0) { const a = ABILITIES.findIndex((_, i) => !canLearn(pl, i)); if (a >= 0) applyCmd(s, me, { c: 'learn', a }); }
  const cap = s.units.find(c => c.owner === me && c.kind === 'captain' && c.hp > 0);
  if (cap && s.units.some(u => u.owner !== me && u.hp > 0 && Math.hypot(cap.x - u.x, cap.y - u.y) < 6))
    for (const a of [4, 1, 7, 5]) if (pl.abil & (1 << a) && !pl.acd[a]) applyCmd(s, me, { c: 'ability', a });
  if (s.tick % 20 !== (me * 7) % 20) return; // раз в секунду, со сдвигом, чтобы боты не думали в один тик
  const mine = s.units.filter(u => u.owner === me && u.hp > 0);
  const hq = mine.find(u => u.kind === 'hq');
  if (!hq) return;
  const of = (k: Kind) => mine.filter(u => u.kind === k);
  const builders = of('builder'), guards = of('guard'), barracks = of('barracks');
  const req = s.players[me].req;
  const dir = Math.atan2(MAP.h / 2 - hq.y, MAP.w / 2 - hq.x);
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
  if (builders.length + hq.que.filter(k => k === 'builder').length < 3) applyCmd(s, me, { c: 'train', id: hq.id, k: 'builder' });
  if (s.players[me].tier >= 4) applyCmd(s, me, { c: 'train', id: hq.id, k: 'titan' });
  if (barracks.some(b => b.build >= 1) && !of('foundry').length && !site && idle.length && req >= 140) { // энергия: литейня у штаба
    applyCmd(s, me, { c: 'build', ids: idle.map(b => b.id), kind: 'foundry', x: hq.x + Math.cos(dir + 1.4) * 10, y: hq.y + Math.sin(dir + 1.4) * 10 });
  }
  const P = s.players[me], key = ('key' + Math.min(P.tier, 4)) as Kind;
  if (barracks.some(b => b.build >= 1) && P.tier <= 3 && !of(key).length && !site && idle.length) { // ключевое здание своего тира
    applyCmd(s, me, { c: 'build', ids: idle.map(b => b.id), kind: key as 'key1', x: hq.x + Math.cos(dir - 1.2) * (8 + P.tier * 4), y: hq.y + Math.sin(dir - 1.2) * (8 + P.tier * 4) });
  }
  if (P.tier <= 3 && of(key).some(k => k.build >= 1) && hq.upg < 0) applyCmd(s, me, { c: 'upgrade', id: hq.id });
  const F = s.players[me].faction; // особые постройки фракции
  if (F === 'prism' && P.tier >= 2 && !of('aegis').length && !site && idle.length) applyCmd(s, me, { c: 'build', ids: idle.map(b => b.id), kind: 'aegis', x: hq.x + Math.cos(dir) * 7, y: hq.y + Math.sin(dir) * 7 });
  if (F === 'orks' && of('rturret').length < 2 && !site && idle.length && req >= 160) applyCmd(s, me, { c: 'build', ids: idle.map(b => b.id), kind: 'rturret', x: hq.x + Math.cos(dir + 0.5) * 12, y: hq.y + Math.sin(dir + 0.5) * 12 });
  if (F === 'clockwork') applyCmd(s, me, { c: 'ascend' });
  if (of('deity').length && s.units.some(e => e.owner !== me && e.hp > 0 && of('deity').some(g => Math.hypot(g.x - e.x, g.y - e.y) < 10))) applyCmd(s, me, { c: 'timestop' });
  if (!of('turret').length && !site && idle.length && req >= 180) {
    applyCmd(s, me, { c: 'build', ids: idle.map(b => b.id), kind: 'turret', x: hq.x + Math.cos(dir) * 9, y: hq.y + Math.sin(dir) * 9 });
  }
  if (s.players[me].tier > 1) for (const u of [...of('post'), ...of('turret'), ...guards]) if (u.lvl < 2 && u.upg < 0 && s.players[me].req >= 150) applyCmd(s, me, { c: 'upgrade', id: u.id });
  for (const b of [...barracks, ...of('key2')]) if (b.build >= 1 && b.que.length < 2) { // смешанный состав: всё, что открыто тиром
    const opts = producible(b.kind).filter(k => ROLES[k]!.tier <= s.players[me].tier);
    if (opts.length) applyCmd(s, me, { c: 'train', id: b.id, k: opts[Math.floor(Math.random() * opts.length)] });
  }
  const broken = mine.find(u => (isStruct(u.kind) || VEHICLES.has(u.kind)) && u.build >= 1 && u.hp < maxHp(u.kind) * 0.6);
  if (broken && idle.length && !site) applyCmd(s, me, { c: 'assist', ids: [idle[0].id], id: broken.id }); // ремонт

  if (s.tick % 100 !== (me * 7) % 100) return; // приказы армии раз в 5 секунд
  const squads = mine.filter(u => SQUADS.has(u.kind)), hurt = squads.filter(g => g.hp < maxHp(g.kind));
  if (hurt.length) applyCmd(s, me, { c: 'reinforce', ids: hurt.map(g => g.id) });
  if (s.players[me].tier >= 2 && squads.length) applyCmd(s, me, { c: 'gear', ids: squads.map(u => u.id), g: 0 }); // гранаты
  const near = s.units.find(e => e.owner !== me && e.hp > 0 && !isStruct(e.kind) && squads.some(q => q.ch[0] > 0 && Math.hypot(q.x - e.x, q.y - e.y) < 16));
  if (near) applyCmd(s, me, { c: 'throw', ids: squads.map(u => u.id), g: 0, x: near.x, y: near.y });
  const army = mine.filter(u => !isStruct(u.kind) && u.kind !== 'builder' && !u.carry);
  if (!army.length) return;
  const enemyHq = s.units.filter(u => u.kind === 'hq' && u.owner !== me && s.players[u.owner].alive).sort((a, b) => d(a, hq) - d(b, hq))[0];
  const point = s.points.filter(p => p.owner !== me).sort((a, b) => d(a, hq) - d(b, hq))[0];
  const goal = army.length >= 6 || !point ? enemyHq : point;
  if (goal) applyCmd(s, me, { c: 'amove', ids: army.map(u => u.id), x: goal.x, y: goal.y });
}
