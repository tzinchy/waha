import { MOD_RACES, UA_ADDONS, UA_ARM, UA_REQ, UA_RESEARCH, type UAReq, canReinforce, hpOf, statOf, fromOf, PRODUCERS, GEN_CAP, TIER_UP, has, VENTS, genAnchor, ABILITIES, canLearn, applyCmd, heroesOf, isStruct, maxHp, producible, ROLES, SQUADS, VEHICLES, MAP, STATS, type Kind, type State } from '../shared/sim.ts';

/** Бот играет по тем же правилам: казармы, второй строитель, посты на точках, гвардия с пополнением, атака на штаб. */
export function botThink(s: State, me: number): void {
  const pl = s.players[me];
  for (const h of heroesOf(s, me)) { // у каждого героя своё дерево: учит первое доступное, в ближнем бою жмёт готовые способности
    if (h.hero!.pts > 0) { const a = ABILITIES.findIndex((_, i) => !canLearn(h.hero!, pl.tier, i)); if (a >= 0) applyCmd(s, me, { c: 'learn', a, id: h.id }); }
    if (s.units.some(u => u.owner !== me && u.hp > 0 && Math.hypot(h.x - u.x, h.y - u.y) < 6))
      for (const a of [4, 1, 7, 5]) if (h.hero!.abil & (1 << a) && !h.hero!.acd[a]) applyCmd(s, me, { c: 'ability', a, id: h.id });
  }
  const cap = s.units.find(c => c.owner === me && c.kind === 'captain' && c.hp > 0);
  if (s.tick % 20 !== (me * 7) % 20) return; // раз в секунду, со сдвигом, чтобы боты не думали в один тик
  const mine = s.units.filter(u => u.owner === me && u.hp > 0);
  const hq = mine.find(u => u.kind === 'hq');
  if (!hq) { // штаб пал, но игра идёт до последней постройки: отстраиваемся у уцелевших зданий, армия защищает их
    const base = mine.find(u => PRODUCERS.has(u.kind) && u.build >= 1), bs = mine.filter(u => u.kind === 'builder');
    if (base && bs.length && !mine.some(u => u.kind === 'hq')) for (const a of [0, 1.6, 3.2, 4.8]) if (!applyCmd(s, me, { c: 'build', ids: bs.map(b => b.id), kind: 'hq', x: base.x + Math.cos(a) * 14, y: base.y + Math.sin(a) * 14 })) break;
    const army = mine.filter(u => !isStruct(u.kind) && u.kind !== 'builder');
    if (base && army.length && s.tick % 100 === (me * 7) % 100) applyCmd(s, me, { c: 'amove', ids: army.map(u => u.id), x: base.x, y: base.y });
    return;
  }
  if (!cap) applyCmd(s, me, { c: 'hero', a: pl.arch }); // капитана заказывают в штабе — и павшего тоже (в очереди второй раз не встанет)
  const of = (k: Kind) => mine.filter(u => u.kind === k);
  const army0 = mine.filter(u => !isStruct(u.kind) && u.kind !== 'builder').length;
  const builders = of('builder'), guards = of('guard'), barracks = of('barracks');
  const req = pl.req;
  const dir = Math.atan2(MAP.h / 2 - hq.y, MAP.w / 2 - hq.x);
  const d = (a: { x: number; y: number }, b: { x: number; y: number }) => Math.hypot(a.x - b.x, a.y - b.y);

  const F0 = pl.faction, UR0 = UA_RESEARCH[F0] ?? [], UA0 = UA_ADDONS[F0] ?? [];
  /** Требования мода к зданию (исследование, аддон): ставим недостающее в своём свободном здании, где оно ведётся (у Инквизиции казармы — после «Темпоральной силы» в штабе). */
  const unlock = (r: UAReq | undefined, depth = 0): void => {
    if (!r || depth > 2) return;
    for (const q of r) for (const id of q.ids) {
      if (q.t === 'structure' || q.t === 'either') { // здания-требования строим у штаба (у Инквизиции — Астра Телепатика до казарм)
        const B = MOD_RACES[F0 as keyof typeof MOD_RACES]?.build as Record<string, string> | undefined, k = B && (Object.keys(B).find(x => id === B[x] || id.endsWith('_' + B[x])) as Kind | undefined);
        if (!k || mine.some(u => u.kind === k) || !builders.length) { if (q.t === 'either') break; continue; }
        if (!mine.some(u => isStruct(u.kind) && u.build < 1)) for (const [a, r] of [[1.6, 16], [-1.6, 16], [2.4, 18], [-2.4, 18], [3.1, 20], [0.9, 22], [-0.9, 22]]) if (!applyCmd(s, me, { c: 'build', ids: builders.map(b => b.id), kind: k as 'key1', x: hq.x + Math.cos(dir + a) * r, y: hq.y + Math.sin(dir + a) * r })) return;
        unlock(UA_REQ[F0]?.[k], depth + 1); return;
      }
      const list = q.t === 'research' ? UR0 : q.t === 'addon' || q.t === 'local_addon' ? UA0 : null, i = list ? list.findIndex(x => x.id === id) : -1;
      if (!list || i < 0 || (q.t === 'research' ? pl.ur?.includes(i) : mine.some(u => ((u.ad ?? 0) & (1 << i)) !== 0 || u.q === 5000 + i))) continue;
      if (q.t === 'research' && mine.some(u => u.q === 1000 + i)) continue; // уже идёт
      const b = mine.find(u => isStruct(u.kind) && u.build >= 1 && !u.q && !u.que.length && list[i].ats.includes(u.kind));
      if (!b || applyCmd(s, me, q.t === 'research' ? { c: 'uar', id: b.id, r: i } : { c: 'uaa', id: b.id, a: i })) unlock(list[i].req, depth + 1);
    }
  };
  const firstArmy = producible('hq', F0).some(k => k !== 'builder' && !isStruct(k)) || of('barracks').some(b => b.build >= 1); // есть где нанять первый отряд
  if (army0 >= 2 || req > 400 || !firstArmy) for (const k of ['barracks', 'key' + Math.min(pl.tier, 4), 'motorpool', 'yard'] as Kind[]) if (!of(k).length) unlock(UA_REQ[F0]?.[k]); // сначала отряд на точки, потом тех
  if (!barracks.length && builders.length && req >= statOf('barracks', F0).cost) {
    for (const [r, a] of [[14, 0.6], [14, -0.6], [17, 1.1], [17, -1.1]]) {
      const err = applyCmd(s, me, { c: 'build', ids: builders.map(b => b.id), kind: 'barracks', x: hq.x + Math.cos(dir + a) * r, y: hq.y + Math.sin(dir + a) * r });
      if (!err) return;
    }
  }
  const site = mine.find(u => isStruct(u.kind) && u.build < 1);
  const idle = builders.filter(b => !b.order);
  if (site) for (const b of idle) applyCmd(s, me, { c: 'assist', ids: [b.id], id: site.id });
  else if (idle.length && req >= statOf('post', F0).cost) {
    const free = s.points.filter(p => p.owner === me && !s.units.some(u => u.kind === 'post' && u.hp > 0 && d(u, p) < 2)).sort((a, b) => d(a, hq) - d(b, hq))[0];
    if (free) applyCmd(s, me, { c: 'build', ids: idle.map(b => b.id), kind: 'post', x: free.x, y: free.y });
  }
  const nest = mine.find(u => u.kind === fromOf('builder', s.players[me].faction) && u.build >= 1); // у тиранидов рипперы выходят из Пула переработки
  if (nest && builders.length + nest.que.filter(k => k === 'builder').length < (army0 >= 2 ? 4 : req >= 250 ? 2 : 1)) applyCmd(s, me, { c: 'train', id: nest.id, k: 'builder' }); // без армии — двое рабочих: павших не перекупаем на всё влияние
  const P = s.players[me], key = ('key' + Math.min(P.tier, 4)) as Kind, up = TIER_UP[P.tier];
  if (up && hq.upg < 0 && of(up.key).some(k => k.build >= 1)) { // тир — первым делом: ключевое здание готово, качаемся сразу, как хватает
    if (up.seal && !has(P, 15)) { const k4 = of('key4').find(k => k.build >= 1 && !k.q); if (k4) applyCmd(s, me, { c: 'research', id: k4.id, r: 3 }); } // Печать Вознесения
    else applyCmd(s, me, { c: 'upgrade', id: hq.id });
  }
  const prio = P.tier >= 3 && !of('motorpool').length ? 'motorpool' : P.tier >= 4 && !of('yard').length ? 'yard' : undefined; // техцех и верфь — раньше турелей и генераторов
  const saving = !!prio && army0 >= 4 || !!up && hq.upg < 0 && army0 >= 4 && (of(up.key).some(k => k.build >= 1) || !of(key).length && req < statOf(key, s.players[me].faction).cost + 100); // копим на тир и ключевое здание
  const P0 = P; // техцех с тира III, верфь титана с тира IV
  for (const [k, t, a] of [['motorpool', 3, 2.0], ['yard', 4, -2.0]] as const) if (P0.tier >= t && !of(k).length && (!site || k === 'yard') && builders.length) // верфь — даже если идёт другая стройка; перебор мест, пока одно не подойдёт
    for (const [da, r] of [[0, 18], [0.7, 20], [-0.7, 20], [1.4, 24], [-1.4, 24], [2.6, 22], [3.14, 26], [0, 28]]) if (!applyCmd(s, me, { c: 'build', ids: (idle.length ? idle : builders).map(b => b.id), kind: k, x: hq.x + Math.cos(dir + a + da) * r, y: hq.y + Math.sin(dir + a + da) * r })) break;
  const big: Kind = 'titan';
  const yard = of('yard').find(y => y.build >= 1 && !y.que.length), titanTime = P.tier >= 4 && army0 >= 6 && !of('yard').some(y => y.que.length); // IV тир и армия есть — копим на титана, пока он не в очереди
  if (yard && s.points[0]?.owner === me) applyCmd(s, me, { c: 'train', id: yard.id, k: big });
  if ((!prio || pl.energy < 600) && barracks.some(b => b.build >= 1) && !site && idle.length && (req >= 140 || pl.energy < 200) && of('foundry').length + of('pump').length < (saving ? 2 : GEN_CAP)) { // энергия: генератор на каждый свободный якорь — жилы, свои точки, штаб
    const spots = [...VENTS.map(([x, y]) => ({ x, y, k: 'pump' as const })), ...[hq, ...s.points.filter(p => p.owner === me)].map(p => ({ x: p.x, y: p.y, k: 'foundry' as const }))]
      .filter(p => genAnchor(s.points, mine, me, p.x, p.y, p.k)).sort((a, b) => d(a, hq) - d(b, hq));
    for (const p of spots.slice(0, 3)) {
      const a = Math.atan2(hq.y - p.y, hq.x - p.x) + (p === spots[0] ? 0 : 0.8), r = p.k === 'pump' ? 0 : p.x === hq.x && p.y === hq.y ? 10 : 7; // литейня — в стороне от поста, к своему штабу
      if (!applyCmd(s, me, { c: 'build', ids: idle.map(b => b.id), kind: p.k, x: p.x + Math.cos(a) * r, y: p.y + Math.sin(a) * r })) break;
    }
  }
  if (barracks.some(b => b.build >= 1) && up && !of(key).length && !site && idle.length) { // ключевое здание своего тира
    applyCmd(s, me, { c: 'build', ids: idle.map(b => b.id), kind: key as 'key1', x: hq.x + Math.cos(dir - 1.2) * (8 + P.tier * 4), y: hq.y + Math.sin(dir - 1.2) * (8 + P.tier * 4) });
  }
  const F = s.players[me].faction; // особые постройки фракции
  const UR = UA_RESEARCH[F]; // исследования UA: свободное здание, ресурсов с запасом — изучаем первое недоступное (раз в ход, чтобы не съесть всю казну)
  if (UR && !saving && req > 400) for (const b of mine) {
    if (!isStruct(b.kind) || b.build < 1 || b.q > 0 || b.que.length) continue;
    const r = UR.findIndex((x, i) => x.ats.includes(b.kind) && !P0.ur?.includes(i) && x.cost < req - 250 && x.energy < pl.energy - 150);
    if (r >= 0 && !applyCmd(s, me, { c: 'uar', id: b.id, r })) break;
  }
  const uniq = ({ order: 'battery', clockwork: 'pylon', ashen: 'pyre', eldar: 'aegis', tyranids: 'bell' } as const)[F as 'order'];
  if (!prio && !saving && !titanTime && uniq && P.tier >= 2 && !of(uniq).length && !site && idle.length) applyCmd(s, me, { c: 'build', ids: idle.map(b => b.id), kind: uniq, x: hq.x + Math.cos(dir - 0.5) * 12, y: hq.y + Math.sin(dir - 0.5) * 12 });
  if (of('deity').length && s.units.some(e => e.owner !== me && e.hp > 0 && of('deity').some(g => Math.hypot(g.x - e.x, g.y - e.y) < 10))) applyCmd(s, me, { c: 'timestop' });
  const turrets = of('turret'), tSpot = [...[0.3, -0.3, 1.2, -1.2].map(a => ({ x: hq.x + Math.cos(dir + a) * 11, y: hq.y + Math.sin(dir + a) * 11 })), // турели: у штаба, потом у своих точек
    ...s.points.filter((p, i) => i !== 0 && p.owner === me).map(p => ({ x: p.x + Math.cos(Math.atan2(hq.y - p.y, hq.x - p.x)) * 6, y: p.y + Math.sin(Math.atan2(hq.y - p.y, hq.x - p.x)) * 6 }))]
    .filter(q => !turrets.some(t => d(t, q) < 8));
  if ((!prio && !saving && !titanTime || req > 600) && turrets.length < (P.tier + 1) * 2 && !site && idle.length && req >= 180) for (const q of tSpot.slice(0, 4)) if (!applyCmd(s, me, { c: 'build', ids: idle.map(b => b.id), kind: 'turret', x: q.x, y: q.y })) break; // первое свободное место
  if (!saving && !titanTime && s.players[me].tier > 1) for (const u of [...of('post'), ...of('turret'), ...guards]) if (u.lvl < 2 && u.upg < 0 && s.players[me].req >= 150) applyCmd(s, me, { c: 'upgrade', id: u.id });
  if (!saving && !titanTime) for (const b of mine) if (PRODUCERS.has(b.kind) && b.build >= 1 && b.que.length < 2 && !b.q) { // смешанный состав из всех зданий найма мода (у тиранид генокрады — в улье); что не открыто требованиями — сервер откажет
    const opts = producible(b.kind, F).filter(k => k !== 'builder' && !isStruct(k) && (ROLES[k]?.tier ?? 1) <= s.players[me].tier);
    for (let t = 0; t < 3 && opts.length; t++) if (!applyCmd(s, me, { c: 'train', id: b.id, k: opts[Math.floor(Math.random() * opts.length)] })) break;
  }
  const broken = mine.find(u => (isStruct(u.kind) || VEHICLES.has(u.kind)) && u.build >= 1 && u.hp < hpOf(u) * 0.6);
  if (broken && idle.length && !site) applyCmd(s, me, { c: 'assist', ids: [idle[0].id], id: broken.id }); // ремонт

  if (s.tick % 100 !== (me * 7) % 100) return; // приказы армии раз в 5 секунд
  const squads = mine.filter(u => SQUADS.has(u.kind)), hurt = mine.filter(g => canReinforce(s, g)); // и отряды мода: добрать до максимума
  if (hurt.length && (!saving && !titanTime || req > 400)) applyCmd(s, me, { c: 'reinforce', ids: hurt.map(g => g.id) });
  if (!saving && !titanTime) for (const u of mine) { const A = UA_ARM[u.f!]?.[u.kind]; if (A) A.opts.some((_, w) => applyCmd(s, me, { c: 'uaw', id: u.id, w: A.opts.length - 1 - w }) === undefined); } // стволы отрядам UA: сначала поздние (сильнее)
  if (!saving && !titanTime && s.players[me].tier >= 2 && squads.length) applyCmd(s, me, { c: 'gear', ids: squads.map(u => u.id), g: 0 }); // гранаты
  const near = s.units.find(e => e.owner !== me && e.hp > 0 && !isStruct(e.kind) && squads.some(q => q.ch[0] > 0 && Math.hypot(q.x - e.x, q.y - e.y) < 16));
  if (near) applyCmd(s, me, { c: 'throw', ids: squads.map(u => u.id), g: 0, x: near.x, y: near.y });
  const army = mine.filter(u => !isStruct(u.kind) && u.kind !== 'builder' && !u.carry);
  if (!army.length) return;
  const foes = s.units.filter(u => PRODUCERS.has(u.kind) && u.owner !== me && u.hp > 0 && s.players[u.owner].alive);
  const enemyHq = foes.filter(u => u.kind === 'hq').sort((a, b) => d(a, hq) - d(b, hq))[0] ?? foes.sort((a, b) => d(a, hq) - d(b, hq))[0]; // штаб пал — добиваем остальные постройки
  const point = s.points.filter(p => p.owner !== me).sort((a, b) => d(a, hq) - d(b, hq))[0];
  const center = s.points[0] && (s.points[0].owner !== me && P.tier >= 3 || titanTime) ? s.points[0] : undefined; // с III тира берём центр, копя на титана — стоим на нём: без него титана не заказать
  const goal = center ?? (army.length >= 6 || !point ? enemyHq : point);
  if (goal) applyCmd(s, me, { c: 'amove', ids: army.map(u => u.id), x: goal.x, y: goal.y });
}
