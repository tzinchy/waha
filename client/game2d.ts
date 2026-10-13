// 2D-клиент матча на силуэтах дизайн-системы «Латунный Собор»: каждый юнит и здание — живой SVG из ds/assets,
// окрашенный палитрой art-* и анимированный классами lc-anim-* из bundle.css. Правил игры здесь нет: только снимки сервера и ввод.
import { CAP, ENERGY_COST, KINDS, MAP, POINTS, POINT_R, REINFORCE_COST, RELICS, STATS, UPGRADES, VENTS, isStruct, maxHp, members, type Buildable, type Cmd, type Kind, type Snap } from '../shared/sim.ts';
import { FACTIONS, type FactionId } from '../shared/factions.ts';
import type { LobbyPlayer } from '../shared/protocol.ts';
import { audio } from './audio.ts';

const S = 26; // пикселей мира на единицу симуляции
const $ = (id: string) => document.getElementById(id)!;
const hex = (c: number) => '#' + c.toString(16).padStart(6, '0');
export const SLOT_COLORS = [0x4fa392, 0xe0675c, 0xe0a53a, 0xb9c3c6];

// какой силуэт из пресетов у какого юнита, его ширина в мире и сколько бойцов в отряде
// ширина силуэта в мире (единиц симуляции); сами силуэты — по фракции игрока (shared/factions.ts)
const WIDTH: Record<Kind, number> = { captain: 3.2, builder: 2.3, guard: 2.4, hq: 11, barracks: 8, post: 4.2, turret: 3.6, foundry: 6.5, pump: 4.4 };
const NEUTRAL: Partial<Record<Kind, [string, string]>> = { post: ['Defenses/point-1.svg', 'Defenses/point-2.svg'], foundry: ['Buildings/foundry.svg', 'Buildings/foundry.svg'], pump: ['Buildings/pump.svg', 'Buildings/pump.svg'] };
/** Путь к силуэту юнита: по фракции, уровню и (у капитана) оружию. */
export function artFor(kind: Kind, faction: FactionId, lvl = 1, weapon: 'sword' | 'hammer' = 'sword') {
  const a = FACTIONS[faction].art;
  if (kind === 'captain') return a.captain[weapon === 'sword' ? 0 : 1];
  if (kind === 'turret') return a.turret[lvl > 1 ? 1 : 0];
  if (NEUTRAL[kind]) return NEUTRAL[kind]![lvl > 1 ? 1 : 0];
  return a[kind as 'builder' | 'guard' | 'hq' | 'barracks'];
}
const FORM: Partial<Record<Kind, [number, number][]>> = {
  guard: [[0.8, 0.1], [0, -0.5], [0, 0.6], [-0.8, -0.2], [-0.8, 0.7]], // плотный строй, как в карточке LivingSquads
  builder: [[0.3, -0.4], [-0.3, 0.4]],
};

const svgCache = new Map<string, string>();
/** Загружает все силуэты один раз. */
const ALL_ART = new Set([...Object.values(FACTIONS).flatMap(f => [...f.art.captain, f.art.builder, f.art.guard, f.art.hq, f.art.barracks, ...f.art.turret]), ...Object.values(NEUTRAL).flat(), 'Defenses/point-3.svg', 'Buildings/reliquary.svg']);
export const ready2d = Promise.all([...ALL_ART]
  .map(p => fetch('/ds/assets/' + p).then(r => r.text()).then(t => svgCache.set(p, t)))).then(() => undefined);

/** Вставляет силуэт как живой SVG: класс lc-art красит его палитрой, lc-anim-* анимирует. */
function art(path: string, widthPx: number) {
  const wrap = document.createElement('div');
  wrap.className = 'art';
  wrap.innerHTML = svgCache.get(path) ?? '';
  const svg = wrap.querySelector('svg')!;
  svg.removeAttribute('width'); svg.removeAttribute('height');
  svg.classList.add('lc-art', 'lc-anim-idle');
  svg.style.width = widthPx + 'px';
  svg.style.animationDelay = svg.style.getPropertyValue('--d');
  for (const el of svg.querySelectorAll<SVGElement>('*')) el.style.animationDelay = `${-Math.random() * 2}s`; // отряды не дышат в унисон
  return wrap;
}
const setAnim = (svg: SVGElement, a: string) => {
  if (svg.dataset.anim === a) return;
  svg.classList.remove('lc-anim-' + (svg.dataset.anim ?? 'idle'));
  svg.classList.add('lc-anim-' + a);
  svg.dataset.anim = a;
};

/** SVG капитана по оружию (Меч — Штурм, Молот — Командор), для превью в редакторе. */
export const captainSvg = (w: 'sword' | 'hammer', f: FactionId = 'order') => svgCache.get(artFor('captain', f, 1, w)) ?? '';
/** Маленький силуэт для HUD: живой SVG, чтобы палитра art-* применилась. */
const miniArt = (path: string) => (svgCache.get(path) ?? '').replace('<svg ', '<svg class="lc-art" ');

/** Карта на языке пресета MapExample (классы lc-bigmap из bundle.css), в координатах мира. Пока декор: проходимость не меняет. */
function mapSvg() {
  const k = S, W = MAP.w * k, H = MAP.h * k, P = (x: number, y: number) => `${x * k} ${y * k}`;
  const diamond = (x: number, y: number, r = 1.2) => `M${P(x, y - r)}L${P(x + r, y)}L${P(x, y + r)}L${P(x - r, y)}Z`;
  const star = (x: number, y: number, r: number) => { let d = ''; for (let i = 0; i < 16; i++) { const a = (i / 16) * Math.PI * 2, rr = i % 2 ? r * 0.55 : r; d += (i ? 'L' : 'M') + P(x + Math.sin(a) * rr, y - Math.cos(a) * rr); } return d + 'Z'; };
  const letters = ['Д', 'А', 'В', 'Б', 'Г'];
  const pts = POINTS.map(([x, y], i) => i === 0
    ? `<path class="pt-crit" d="${star(x, y - POINT_R - 2.2, 1.6)}"/><text class="t t-on" x="${x * k}" y="${(y - POINT_R - 1.8) * k}" style="font-size:22px">II</text>`
    : `<path class="pt-inf" d="${diamond(x, y - POINT_R - 2)}"/><text class="t" x="${x * k}" y="${(y - POINT_R - 1.6) * k}" style="font-size:22px">${letters[i]}</text>`).join('');
  return `<svg class="lc-bigmap" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" style="position:absolute;left:0;top:0">
<defs><pattern id="cov-h" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line class="hatch" x1="0" y1="0" x2="0" y2="14"/></pattern>
<pattern id="cov-l" width="18" height="18" patternUnits="userSpaceOnUse"><circle class="dots" cx="9" cy="9" r="2.4"/></pattern></defs>
<rect class="low" width="${W}" height="${H}"/>
<path class="plateau" d="M${P(0, 62)}L${P(14, 60)}L${P(26, 70)}L${P(30, 100)}L${P(0, 100)}Z"/><path class="plateau" d="M${P(100, 38)}L${P(86, 40)}L${P(74, 30)}L${P(70, 0)}L${P(100, 0)}Z"/>
<path class="road" style="stroke-width:34" d="M${P(12, 12)}C${P(16, 30)} ${P(18, 50)} ${P(18, 50)}S${P(40, 52)} ${P(50, 50)} ${P(80, 50)} ${P(82, 50)} ${P(86, 74)} ${P(88, 88)}"/>
<path class="road" style="stroke-width:34" d="M${P(12, 12)}C${P(30, 15)} ${P(50, 18)} ${P(50, 18)}S${P(50, 40)} ${P(50, 50)} ${P(50, 80)} ${P(50, 82)} ${P(72, 86)} ${P(88, 88)}"/>
<path class="water" d="M${P(66, 0)}C${P(62, 14)} ${P(68, 26)} ${P(58, 38)}S${P(46, 54)} ${P(44, 62)} ${P(36, 84)} ${P(30, 100)}L${P(37, 100)}C${P(42, 86)} ${P(51, 70)} ${P(53, 62)}S${P(64, 44)} ${P(68, 34)} ${P(70, 14)} ${P(73, 0)}Z"/>
<path class="bridge" d="M${P(45, 47)}H${P(58, 47).split(' ')[0]}V${53 * k}H${45 * k}Z"/>
<path class="high" d="M${P(38, 36)}L${P(43, 34)}L${P(45, 38)}L${P(41, 41)}Z"/><path class="high" d="M${P(62, 64)}L${P(57, 66)}L${P(55, 62)}L${P(59, 59)}Z"/>
<path class="high" d="M${P(28, 70)}L${P(34, 68)}L${P(36, 74)}L${P(31, 77)}Z"/><path class="high" d="M${P(72, 30)}L${P(66, 32)}L${P(64, 26)}L${P(69, 23)}Z"/>
<rect class="cover-h" x="${24 * k}" y="${44 * k}" width="${5 * k}" height="${3 * k}"/><rect class="cover-h" x="${71 * k}" y="${53 * k}" width="${5 * k}" height="${3 * k}"/>
<rect class="cover-h" x="${44 * k}" y="${24 * k}" width="${3 * k}" height="${5 * k}"/><rect class="cover-h" x="${53 * k}" y="${71 * k}" width="${3 * k}" height="${5 * k}"/>
<rect class="cover-h" x="${41 * k}" y="${41 * k}" width="${4 * k}" height="${4 * k}"/><rect class="cover-h" x="${55 * k}" y="${55 * k}" width="${4 * k}" height="${4 * k}"/>
<circle class="cover-l" cx="${34 * k}" cy="${16 * k}" r="${5 * k}"/><circle class="cover-l" cx="${66 * k}" cy="${84 * k}" r="${5 * k}"/><circle class="cover-l" cx="${16 * k}" cy="${34 * k}" r="${5 * k}"/><circle class="cover-l" cx="${84 * k}" cy="${66 * k}" r="${5 * k}"/>
<circle class="vent" cx="${30 * k}" cy="${58 * k}" r="14"/><circle class="vent" cx="${70 * k}" cy="${42 * k}" r="14"/><circle class="vent" cx="${40 * k}" cy="${8 * k}" r="14"/><circle class="vent" cx="${60 * k}" cy="${92 * k}" r="14"/>
${pts}
<text class="lbl" x="${60 * k}" y="${4 * k}" style="font-size:26px">Разлом</text><text class="lbl" x="${24 * k}" y="${24 * k}" style="font-size:26px">Руины собора</text><text class="lbl" x="${64 * k}" y="${78 * k}" style="font-size:26px">Руины собора</text>
</svg>`;
}

type View = {
  id: number; owner: number; kind: Kind; el: HTMLElement; body: HTMLElement; svgs: SVGElement[]; bar: HTMLElement; fg: HTMLElement; sel: HTMLElement;
  x: number; y: number; tx: number; ty: number; f: number; hp: number; build: number; q: number; dead: boolean; lvl: number; upg: number;
  atkUntil: number; artPath: string; prog: number;
};

export class Game {
  private world = document.createElement('div');
  private ground = document.createElement('div');
  private fx = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  private views = new Map<number, View>();
  private sel = new Set<number>();
  private cam = { x: 50, y: 50, zoom: 1 };
  private keys = new Set<string>();
  private points: { ring: HTMLElement; fill: HTMLElement; el: HTMLElement }[] = [];
  private pointOwner: number[] = [];
  private shots: { el: SVGLineElement; until: number }[] = [];
  private ghost = document.createElement('div');
  private place: Buildable | null = null;
  private drag: { x0: number; y0: number; x1: number; y1: number } | null = null;
  private mouse: { x: number; y: number } | null = null;
  private amove = false;
  private centered = false;
  private ended = false;
  private req = 0;
  private tier = 1;
  private energy = 0;
  private relics = 0;
  private snapN = 0;
  private lastAlert = 0;
  private cmdHtml = '';
  private raf = 0;
  private t0 = performance.now();
  private ac = new AbortController();

  constructor(
    private root: HTMLElement, private slot: number, private players: LobbyPlayer[],
    private send: (c: Cmd) => void, private onEnd: (winner: number) => void,
  ) {
    root.classList.add('w2d');
    this.world.className = 'w2d-world';
    this.ground.className = 'w2d-ground';
    Object.assign(this.ground.style, { width: MAP.w * S + 'px', height: MAP.h * S + 'px' });
    this.fx.classList.add('w2d-fx');
    this.fx.setAttribute('width', String(MAP.w * S)); this.fx.setAttribute('height', String(MAP.h * S));
    this.ghost.className = 'w2d-ghost hidden';
    this.world.append(this.ground, this.fx, this.ghost);
    root.prepend(this.world);
    this.buildMap();
    this.bind();
    this.raf = requestAnimationFrame(this.frame);
    audio.setBattle(true);
    $('hud-players').innerHTML = players.map((p, i) => `<div id="hp${i}"><i style="background:${hex(SLOT_COLORS[i])}"></i>${p.name.replace(/[<>&]/g, '')}</div>`).join('');
  }

  destroy() {
    audio.setBattle(false);
    cancelAnimationFrame(this.raf);
    this.ac.abort();
    this.world.remove();
    this.root.classList.remove('w2d');
  }

  // ---------- карта ----------
  private buildMap() {
    this.ground.innerHTML = mapSvg();
    [...POINTS, ...RELICS].forEach(([x, y], i) => {
      const relic = i >= POINTS.length;
      const ring = document.createElement('div'), fill = document.createElement('div');
      ring.className = 'w2d-point'; fill.className = 'w2d-point-fill';
      for (const e of [ring, fill]) Object.assign(e.style, { left: (x - POINT_R) * S + 'px', top: (y - POINT_R) * S + 'px', width: POINT_R * 2 * S + 'px', height: POINT_R * 2 * S + 'px' });
      const el = this.place2(art(relic ? 'Buildings/reliquary.svg' : 'Defenses/point-3.svg', (relic ? 5 : 3.6) * S), x, y); // реликварий / знаменный столп
      el.classList.add('w2d-neutral');
      ring.classList.toggle('relic', relic);
      this.ground.append(ring, fill);
      this.points.push({ ring, fill, el });
    });
  }

  /** Ставит элемент в мир ногами в точку (x, y); глубина — по y. */
  private place2(el: HTMLElement, x: number, y: number) {
    el.classList.add('w2d-ent');
    el.style.transform = `translate(${x * S}px, ${y * S}px)`;
    el.style.zIndex = String(Math.round(y * 10));
    this.world.append(el);
    return el;
  }

  // ---------- юниты ----------
  private mk(id: number, owner: number, kind: Kind, x: number, y: number): View {
    const el = document.createElement('div');
    el.className = 'w2d-unit ' + (owner === this.slot ? 'ally' : 'enemy');
    el.style.setProperty('--team', owner === this.slot ? 'var(--verdigris-500)' : 'var(--blood-300)'); // союзник патина, враг кровь (пресет)
    const r = STATS[kind].radius;
    const sel = document.createElement('div'); sel.className = 'w2d-sel';
    const range = document.createElement('div'); range.className = 'w2d-range';
    const rr = STATS[kind].range + STATS[kind].radius;
    Object.assign(range.style, { width: rr * 2 * S + 'px', height: rr * 2 * S * 0.55 + 'px' });
    el.append(range);
    const ring = document.createElement('div'); ring.className = 'w2d-ring';
    for (const e of [sel, ring]) Object.assign(e.style, { width: r * 2.4 * S + 'px', height: r * 1.3 * S + 'px' });
    const body = document.createElement('div'); body.className = 'w2d-body';
    const pl = this.players[owner], artPath = artFor(kind, pl.faction ?? 'order', 1, pl.captain.weapon);
    const svgs: SVGElement[] = [];
    for (const [ox, oy] of FORM[kind] ?? [[0, 0]]) {
      const a = art(artPath, WIDTH[kind] * S);
      a.style.transform = `translate(${ox * S}px, ${oy * S * 0.6}px)`;
      body.append(a);
      svgs.push(a.querySelector('svg')!);
    }
    if (kind === 'captain') el.style.setProperty('--art-brass', hex(this.players[owner].captain.armor)); // кастомизация: броня капитана
    if (kind === 'captain') el.style.setProperty('--art-brass-lit', hex(this.players[owner].captain.trim));
    const bar = document.createElement('div'); bar.className = 'lc-vitals w2d-bar';
    const fg = document.createElement('div'); fg.className = 'lc-vitals__bar'; bar.append(fg);
    bar.style.width = Math.max(40, WIDTH[kind] * S * (isStruct(kind) ? 0.7 : 1)) + 'px';
    el.append(ring, sel, body, bar);
    this.place2(el, x, y);
    return { id, owner, kind, el, body, svgs, bar, fg, sel, x, y, tx: x, ty: y, f: 0, hp: maxHp(kind), build: 1, q: 0, dead: false, lvl: 1, upg: -1, atkUntil: 0, artPath, prog: 0 };
  }

  onSnap(s: Snap) {
    const seen = new Set<number>(), first = this.snapN++ === 0, now = performance.now();
    for (const [id, owner, ki, x, y, hp, face, q, bp, , lvl, upg, prog] of s.u) {
      seen.add(id);
      const kind = KINDS[ki];
      let v = this.views.get(id);
      if (!v) {
        this.views.set(id, (v = this.mk(id, owner, kind, x / 10, y / 10)));
        if (!first && owner === this.slot && !isStruct(kind)) audio.trained();
      } else if (owner === this.slot) {
        if (v.build < 1 && bp >= 100) audio.built();
        if (kind === 'captain' && v.hp > 0 && hp <= 0) audio.alarm();
        else if (hp < v.hp && now - this.lastAlert > 8000) { this.lastAlert = now; audio.alarm(); }
      }
      v.tx = x / 10; v.ty = y / 10; v.f = face / 100; v.hp = hp; v.q = q; v.build = bp / 100; v.dead = hp <= 0;
      const lvlArt = artFor(kind, this.players[owner].faction ?? 'order', lvl, this.players[owner].captain.weapon);
      if (lvl !== v.lvl && lvlArt !== v.artPath) { // апгрейд: новый силуэт уровня 2
        v.artPath = lvlArt;
        const a = art(lvlArt, WIDTH[kind] * S * 1.1);
        v.body.replaceChildren(a); v.svgs = [a.querySelector('svg')!];
      }
      v.lvl = lvl; v.upg = upg; v.prog = prog ?? 0;
      if (kind === 'hq' && owner === this.slot && !this.centered) {
        this.centered = true;
        this.cam.x = v.tx + (MAP.w / 2 - v.tx) * 0.25; this.cam.y = v.ty + (MAP.h / 2 - v.ty) * 0.25;
      }
    }
    let gone = 0;
    for (const [id, v] of this.views) if (!seen.has(id)) { // гибель: падение и пепел, потом исчезает
      this.views.delete(id); this.sel.delete(id);
      v.bar.remove(); v.sel.remove();
      v.svgs.forEach(sv => setAnim(sv, 'death'));
      v.el.classList.add(isStruct(v.kind) ? 'w2d-razed' : 'w2d-dying');
      setTimeout(() => v.el.remove(), isStruct(v.kind) ? 1200 : 1700);
      const a = this.audioAt(v.x, v.y);
      if (a && !first && gone++ < 2) isStruct(v.kind) ? audio.boom(a.pan) : audio.death(a.pan);
      if (isStruct(v.kind)) this.shake(10);
    }
    s.p.forEach(([owner, prog, by], i) => {
      if (this.pointOwner[i] !== undefined && this.pointOwner[i] !== owner) {
        if (owner === this.slot) audio.captured(); else if (this.pointOwner[i] === this.slot) audio.lost();
      }
      this.pointOwner[i] = owner;
      const p = this.points[i], col = owner >= 0 ? hex(SLOT_COLORS[owner]) : 'var(--art-bone)';
      p.ring.style.setProperty('--team', col);
      p.ring.classList.toggle('owned', owner >= 0);
      p.el.style.setProperty('--art-bone', col); // кристалл реликвария окрашивается по владельцу (пресет Buildings)
      p.fill.style.setProperty('--team', by >= 0 ? hex(SLOT_COLORS[by]) : 'transparent');
      p.fill.style.setProperty('--p', String(prog / 100));
    });
    for (const [x1, y1, x2, y2] of s.sh) this.shot(x1 / 10, y1 / 10, x2 / 10, y2 / 10, now);
    let heard = 0;
    for (const [x1, y1] of s.sh) { const a = this.audioAt(x1 / 10, y1 / 10); if (a && heard++ < 4) audio.shot(a.pan); }
    audio.heat(Math.min(0.4, s.sh.length * 0.02));
    this.hud(s);
    if (s.w !== null && !this.ended) { this.ended = true; this.onEnd(s.w); }
  }

  /** Выстрел: трассер огнём art-fire и вспышка; стрелку — анимация атаки. */
  private shot(x1: number, y1: number, x2: number, y2: number, now: number) {
    let best: View | undefined, bd = 2.2;
    for (const v of this.views.values()) { const d = Math.hypot(v.tx - x1, v.ty - y1); if (d < bd && !v.dead) { bd = d; best = v; } }
    if (best) best.atkUntil = now + 700;
    if (this.shots.length > 120) return;
    const l = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    const h = best && !isStruct(best.kind) ? 1.2 : 2.2;
    l.setAttribute('x1', String(x1 * S)); l.setAttribute('y1', String((y1 - h) * S));
    l.setAttribute('x2', String(x2 * S)); l.setAttribute('y2', String((y2 - 1) * S));
    l.classList.add('w2d-tracer');
    this.fx.append(l);
    this.shots.push({ el: l, until: now + 160 });
  }

  private shake(px: number) {
    this.world.animate([{ translate: `${px}px 0` }, { translate: `${-px}px ${px / 2}px` }, { translate: '0 0' }], { duration: 260, composite: 'add' });
  }

  // ---------- HUD ----------
  private hud(s: Snap) {
    this.req = s.pl[this.slot][0]; this.energy = s.pl[this.slot][3] ?? 0; this.relics = s.pl[this.slot][4] ?? 0;
    $('hud-energy').textContent = String(this.energy); $('hud-relics').textContent = String(this.relics);
    this.tier = s.pl[this.slot][2] ?? 1;
    $('hud-tier').textContent = ['I', 'II', 'III', 'IV', 'V'][this.tier - 1] ?? String(this.tier);
    let builders = 0, guards = 0, dead = false;
    for (const u of s.u) if (u[1] === this.slot) { if (u[2] === 1) builders++; else if (u[2] === 2) guards++; else if (u[2] === 0 && u[5] <= 0) dead = true; }
    $('hud-req').textContent = String(this.req);
    $('hud-builders').textContent = `${builders}/${CAP.builder}`;
    $('hud-squads').textContent = `${guards}/${CAP.guard}`;
    $('hud-sel').textContent = this.sel.size ? `Выбрано: ${this.sel.size}` : '';
    $('hud-dead').classList.toggle('hidden', !dead);
    s.pl.forEach(([, alive], i) => document.getElementById('hp' + i)?.classList.toggle('dead', !alive));
    this.renderQueue();
    this.renderCmd();
  }

  /** Очередь производства: что сейчас нанимается в каждом здании и сколько ждёт следом. */
  private renderQueue() {
    const items: string[] = [];
    for (const v of this.views.values()) {
      if (v.owner !== this.slot || v.q <= 0) continue;
      const what: Kind = v.kind === 'hq' ? 'builder' : 'guard', name = v.kind === 'hq' ? 'Каменщик' : 'Стражники';
      for (let i = 0; i < v.q; i++) items.push(`<div class="w2d-qitem${i ? '' : ' now'}" title="${name}">${miniArt(artFor(what, this.players[this.slot].faction ?? 'order'))}${i ? '' : `<span class="w2d-qbar" style="--v:${v.prog}%"></span>`}</div>`);
    }
    const q = $('hud-queue');
    q.classList.toggle('hidden', !items.length);
    const html = items.length ? `<span class="w2d-qlabel">Производство</span>${items.join('')}` : '';
    if (q.innerHTML !== html) q.innerHTML = html;
  }

  private selected() { return [...this.sel].map(id => this.views.get(id)).filter((v): v is View => !!v); }

  private renderCmd() {
    const sel = this.selected(), req = this.req;
    const btn = (act: string, label: string, cost: number, hot: string, en = 0, rel = 0) => {
      const ok = req >= cost && this.energy >= en && this.relics >= rel;
      const price = [cost ? `◆ ${cost}` : '', en ? `ϟ ${en}` : '', rel ? `⌂ ${rel}` : ''].filter(Boolean).join(' ');
      return `<button class="lc-btn lc-btn--sm" data-act="${act}" ${ok ? '' : 'disabled'}>${label} <i>${hot}</i> <b>${price}</b></button>`;
    };
    let html = '';
    const st = sel.length === 1 && isStruct(sel[0].kind) ? sel[0] : null;
    if (st) {
      const q = `<span class="info">в очереди: ${st.q}</span>`;
      if (st.build < 1) html = `<span class="info">Возводится ${Math.round(st.build * 100)}%. Отправьте строителей (ПКМ)</span>`;
      else {
        if (st.kind === 'hq') html = btn('train', 'Каменщик', STATS.builder.cost, 'T') + q;
        else if (st.kind === 'barracks') html = btn('train', 'Стражники', STATS.guard.cost, 'T') + q;
        else if (st.kind === 'post') html = '<span class="info">Реликварий: +2 влияния/с, держит точку</span>';
        html += this.upgradeBtn([st], btn);
      }
    } else {
      if (sel.some(v => v.kind === 'builder')) html += btn('barracks', 'Казарма', STATS.barracks.cost, 'B') + btn('post', 'Реликварий', STATS.post.cost, 'P') + btn('turret', 'Турель', STATS.turret.cost, 'Y', ENERGY_COST.turret) + btn('foundry', 'Литейня', STATS.foundry.cost, 'F') + btn('pump', 'Насос', STATS.pump.cost, 'N');
      html += this.upgradeBtn(sel.filter(v => v.kind === 'guard'), btn) + this.upgradeBtn(sel.filter(v => v.kind === 'captain'), btn);
      const hurt = sel.filter(v => v.kind === 'guard' && v.hp < maxHp('guard'));
      if (hurt.length) html += btn('reinforce', 'Пополнить', hurt.reduce((n, v) => n + Math.ceil((maxHp('guard') - v.hp) / STATS.guard.hp) * REINFORCE_COST, 0), 'R');
      if (this.place) html += '<span class="info">ЛКМ поставить · ПКМ или Esc отмена</span>';
    }
    if (html !== this.cmdHtml) { this.cmdHtml = html; $('hud-cmd').innerHTML = html; }
  }

  private upgradeBtn(vs: View[], btn: (a: string, l: string, c: number, h: string, en?: number, rel?: number) => string) {
    const v = vs.find(x => x.lvl < 2), up = v && UPGRADES[v.kind];
    if (!v || !up) return vs.length && UPGRADES[vs[0].kind] ? '<span class="info">Улучшено ★</span>' : '';
    if (v.upg >= 0) return `<span class="info">${up.name}: ${v.upg}%</span>`;
    if (this.tier < up.tier) return `<span class="info">${up.name}: нужен тир ${up.tier}</span>`;
    return btn('upgrade', up.name, up.cost, 'U', up.energy, up.relics);
  }

  private doAct(act: string) {
    const sel = this.selected();
    if (act === 'train') { const st = sel.find(v => isStruct(v.kind)); if (st) this.cmd({ c: 'train', id: st.id }); }
    else if (act === 'barracks' || act === 'post' || act === 'turret' || act === 'foundry' || act === 'pump') { if (sel.some(v => v.kind === 'builder')) this.startPlace(act); }
    else if (act === 'upgrade') { for (const v of sel) if (UPGRADES[v.kind] && v.lvl < 2 && v.upg < 0) this.cmd({ c: 'upgrade', id: v.id }); }
    else if (act === 'reinforce') this.cmd({ c: 'reinforce', ids: sel.filter(v => v.kind === 'guard').map(v => v.id) });
  }

  private startPlace(k: Buildable) {
    this.place = k; this.amove = false;
    const r = k === 'post' ? POINT_R * 0.5 : STATS[k].radius + 0.6;
    Object.assign(this.ghost.style, { width: r * 2 * S + 'px', height: r * 1.1 * S + 'px' });
    this.root.style.cursor = 'copy';
    this.renderCmd();
  }
  private stopPlace() { this.place = null; this.ghost.classList.add('hidden'); this.root.style.cursor = ''; this.cmdHtml = ''; this.renderCmd(); }

  // ---------- ввод ----------
  private cmd(c: Cmd) { if (!this.ended) { this.send(c); audio.order(); } }

  private audioAt(x: number, y: number) {
    const p = this.toScreen(x, y), r = this.root.getBoundingClientRect();
    return p.x > r.left - 40 && p.x < r.right + 40 && p.y > r.top - 40 && p.y < r.bottom + 40 ? { pan: Math.max(-0.8, Math.min(0.8, ((p.x - r.left) / r.width - 0.5) * 1.6)) } : null;
  }

  private toScreen(x: number, y: number) {
    const r = this.root.getBoundingClientRect(), z = this.cam.zoom;
    return { x: r.left + r.width / 2 + (x - this.cam.x) * S * z, y: r.top + r.height / 2 + (y - this.cam.y) * S * z };
  }
  private toWorld(sx: number, sy: number) {
    const r = this.root.getBoundingClientRect(), z = this.cam.zoom;
    return { x: this.cam.x + (sx - r.left - r.width / 2) / (S * z), y: this.cam.y + (sy - r.top - r.height / 2) / (S * z) };
  }

  private bind() {
    const cv = this.root, sig = { signal: this.ac.signal };
    cv.addEventListener('contextmenu', e => e.preventDefault(), sig);
    cv.addEventListener('pointerdown', e => {
      if ((e.target as HTMLElement).closest('#hud')) return;
      if (e.button === 0) this.drag = { x0: e.clientX, y0: e.clientY, x1: e.clientX, y1: e.clientY };
      else if (e.button === 2) { if (this.place) this.stopPlace(); else { this.amove = false; cv.style.cursor = ''; this.order(e.clientX, e.clientY); } }
    }, sig);
    cv.addEventListener('pointerleave', () => { this.mouse = null; }, sig);
    addEventListener('pointermove', e => {
      this.mouse = { x: e.clientX, y: e.clientY };
      if (!this.drag) return;
      this.drag.x1 = e.clientX; this.drag.y1 = e.clientY;
      const b = $('selbox'), d = this.drag, moved = Math.hypot(d.x1 - d.x0, d.y1 - d.y0) > 6;
      b.classList.toggle('hidden', !moved);
      if (moved) Object.assign(b.style, { left: Math.min(d.x0, d.x1) + 'px', top: Math.min(d.y0, d.y1) + 'px', width: Math.abs(d.x1 - d.x0) + 'px', height: Math.abs(d.y1 - d.y0) + 'px' });
    }, sig);
    addEventListener('pointerup', e => {
      if (e.button !== 0 || !this.drag) return;
      const d = this.drag; this.drag = null;
      $('selbox').classList.add('hidden');
      if (Math.hypot(d.x1 - d.x0, d.y1 - d.y0) > 6 && !this.place) this.boxSelect(d, e.shiftKey);
      else this.click(e.clientX, e.clientY, e.shiftKey);
      this.renderCmd();
    }, sig);
    cv.addEventListener('wheel', e => { e.preventDefault(); this.cam.zoom = Math.max(0.45, Math.min(1.8, this.cam.zoom * (1 - Math.sign(e.deltaY) * 0.1))); }, { passive: false, ...sig });
    addEventListener('keydown', e => {
      if (e.target instanceof HTMLInputElement) return;
      const k = e.key.toLowerCase();
      this.keys.add(k);
      if (k === 'a') { this.amove = true; this.place = null; this.ghost.classList.add('hidden'); cv.style.cursor = 'crosshair'; }
      else if (k === 't') this.doAct('train');
      else if (k === 'b') this.doAct('barracks');
      else if (k === 'p') this.doAct('post');
      else if (k === 'y') this.doAct('turret');
      else if (k === 'f') this.doAct('foundry');
      else if (k === 'n') this.doAct('pump');
      else if (k === 'u') this.doAct('upgrade');
      else if (k === 'r') this.doAct('reinforce');
      else if (k === 's' && this.sel.size) this.cmd({ c: 'stop', ids: [...this.sel] });
      else if (k === ' ') { e.preventDefault(); this.selectOwn('captain'); }
      else if (k === 'h') this.selectOwn('hq');
      else if (k === 'escape') { this.amove = false; this.sel.clear(); this.stopPlace(); cv.style.cursor = ''; }
      this.renderCmd();
    }, sig);
    addEventListener('keyup', e => this.keys.delete(e.key.toLowerCase()), sig);
    $('hud-cmd').addEventListener('click', e => { const a = (e.target as HTMLElement).closest('button')?.dataset.act; if (a) this.doAct(a); }, sig);
  }

  private pick(sx: number, sy: number, want: (v: View) => boolean) {
    const w = this.toWorld(sx, sy);
    let best: View | null = null, bd = 1e9;
    for (const v of this.views.values()) {
      if (!want(v)) continue;
      const cy = v.y - (isStruct(v.kind) ? STATS[v.kind].radius * 0.6 : 0.8); // центр силуэта выше ног
      const d = Math.hypot(w.x - v.x, w.y - cy), reach = STATS[v.kind].radius + (isStruct(v.kind) ? 1.5 : 1.2);
      if (d < reach && d < bd) { bd = d; best = v; }
    }
    return best;
  }

  private mobile = (v: View) => v.owner === this.slot && !isStruct(v.kind) && !v.dead;
  private ownStruct = (v: View) => v.owner === this.slot && isStruct(v.kind);

  private click(sx: number, sy: number, add: boolean) {
    if (this.place) {
      const sp = this.placePoint(sx, sy), ids = this.selected().filter(v => v.kind === 'builder').map(v => v.id);
      if (sp && ids.length) this.cmd({ c: 'build', ids, kind: this.place, x: sp.x, y: sp.y });
      if (sp?.ok && !add) this.stopPlace();
      return;
    }
    if (this.amove) {
      this.amove = false; this.root.style.cursor = '';
      const p = this.toWorld(sx, sy);
      if (this.sel.size) this.cmd({ c: 'amove', ids: [...this.sel], x: p.x, y: p.y });
      return;
    }
    const v = this.pick(sx, sy, this.mobile) ?? this.pick(sx, sy, this.ownStruct);
    if (!add || (v && isStruct(v.kind))) this.sel.clear();
    if (v) this.sel.add(v.id);
  }

  private boxSelect(d: { x0: number; y0: number; x1: number; y1: number }, add: boolean) {
    if (!add) this.sel.clear();
    const [x0, x1] = [Math.min(d.x0, d.x1), Math.max(d.x0, d.x1)], [y0, y1] = [Math.min(d.y0, d.y1), Math.max(d.y0, d.y1)];
    for (const v of this.views.values()) {
      if (!this.mobile(v)) continue;
      const p = this.toScreen(v.x, v.y - 0.6);
      if (p.x >= x0 && p.x <= x1 && p.y >= y0 && p.y <= y1) this.sel.add(v.id);
    }
  }

  private selectOwn(kind: Kind) {
    for (const v of this.views.values()) if (v.owner === this.slot && v.kind === kind) { this.sel.clear(); this.sel.add(v.id); this.cam.x = v.x; this.cam.y = v.y; }
  }

  private placePoint(sx: number, sy: number): { x: number; y: number; ok: boolean } {
    const g = this.toWorld(sx, sy), vs = [...this.views.values()];
    if (this.place === 'post') {
      const i = POINTS.findIndex(([x, y]) => Math.hypot(x - g.x, y - g.y) < 9);
      if (i < 0) return { ...g, ok: false };
      const [x, y] = POINTS[i];
      const taken = vs.some(v => v.kind === 'post' && Math.hypot(v.x - x, v.y - y) < 2);
      return { x, y, ok: (this.pointOwner[i] === this.slot || this.pointOwner[i] < 0) && !taken };
    }
    if (this.place === 'pump') {
      const v = VENTS.find(([x, y]) => Math.hypot(x - g.x, y - g.y) < 6);
      if (!v) return { ...g, ok: false };
      return { x: v[0], y: v[1], ok: !vs.some(u => u.kind === 'pump' && Math.hypot(u.x - v[0], u.y - v[1]) < 2) };
    }
    if (this.place === 'turret' || this.place === 'foundry') {
      const near = vs.some(v => v.owner === this.slot && isStruct(v.kind) && v.kind !== 'turret' && Math.hypot(v.x - g.x, v.y - g.y) < 16);
      const free = !vs.some(v => isStruct(v.kind) && Math.hypot(v.x - g.x, v.y - g.y) < STATS[v.kind].radius + STATS[this.place!].radius + 1);
      return { ...g, ok: near && free };
    }
    const hq = vs.find(v => v.kind === 'hq' && v.owner === this.slot), d = hq ? Math.hypot(hq.x - g.x, hq.y - g.y) : 99;
    const clear = !vs.some(v => isStruct(v.kind) && Math.hypot(v.x - g.x, v.y - g.y) < STATS[v.kind].radius + STATS.barracks.radius + 1);
    return { ...g, ok: d >= 8 && d <= 32 && clear };
  }

  private order(sx: number, sy: number) {
    if (!this.sel.size) return;
    const sel = this.selected(), ids = [...this.sel];
    if (sel.length === 1 && isStruct(sel[0].kind)) return;
    const enemy = this.pick(sx, sy, v => v.owner !== this.slot && !v.dead);
    if (enemy) return this.cmd({ c: 'attack', ids, id: enemy.id });
    const site = this.pick(sx, sy, v => this.ownStruct(v) && v.build < 1);
    if (site && sel.some(v => v.kind === 'builder')) return this.cmd({ c: 'assist', ids, id: site.id });
    const p = this.toWorld(sx, sy);
    this.cmd({ c: 'move', ids, x: p.x, y: p.y });
    this.marker(p.x, p.y);
  }

  private marker(x: number, y: number) {
    const m = document.createElement('div');
    m.className = 'w2d-marker';
    this.place2(m, x, y);
    setTimeout(() => m.remove(), 600);
  }

  // ---------- кадр ----------
  private frame = (now: number) => {
    this.raf = requestAnimationFrame(this.frame);
    const dt = Math.min(0.05, (now - this.t0) / 1000);
    this.t0 = now;
    const c = this.cam, k = this.keys, sp = 30 * dt / c.zoom;
    let fx = (k.has('arrowright') ? 1 : 0) - (k.has('arrowleft') ? 1 : 0), fy = (k.has('arrowdown') ? 1 : 0) - (k.has('arrowup') ? 1 : 0);
    if (this.mouse && !this.drag) {
      const m = this.mouse, e = 14;
      fx += (m.x > innerWidth - e ? 1 : 0) - (m.x < e ? 1 : 0);
      fy += (m.y > innerHeight - e ? 1 : 0) - (m.y < e ? 1 : 0);
    }
    c.x = Math.max(0, Math.min(MAP.w, c.x + fx * sp));
    c.y = Math.max(0, Math.min(MAP.h, c.y + fy * sp));
    const r = this.root.getBoundingClientRect();
    this.world.style.transform = `translate(${r.width / 2 - c.x * S * c.zoom}px, ${r.height / 2 - c.y * S * c.zoom}px) scale(${c.zoom})`;

    if (this.place && this.mouse) {
      const g = this.placePoint(this.mouse.x, this.mouse.y);
      this.ghost.classList.remove('hidden');
      this.ghost.classList.toggle('bad', !g.ok);
      this.ghost.style.transform = `translate(${g.x * S}px, ${g.y * S}px)`;
    }

    const a = 1 - Math.exp(-dt * 14);
    const sites = [...this.views.values()].filter(v => isStruct(v.kind) && v.build < 1);
    for (const v of this.views.values()) {
      const moving = Math.hypot(v.tx - v.x, v.ty - v.y) > 0.06;
      v.x += (v.tx - v.x) * a; v.y += (v.ty - v.y) * a;
      v.el.style.transform = `translate(${v.x * S}px, ${v.y * S}px)`;
      v.el.style.zIndex = String(Math.round(v.y * 10));
      if (isStruct(v.kind)) {
        v.body.style.clipPath = v.build < 1 ? `inset(${(1 - v.build) * 100}% 0 0 0)` : ''; // здание растёт снизу вверх (Construction)
        v.el.classList.toggle('building', v.build < 1);
        v.svgs.forEach(s => setAnim(s, v.build < 1 ? 'build' : now < v.atkUntil && (v.kind === 'turret' || v.kind === 'hq') ? 'recoil' : 'idle')); // выстрел: отдача
        if (v.kind === 'turret' || v.kind === 'post') { // турель и пост: голова доворачивается к цели (вид сбоку: разворот + наклон)
          v.body.classList.toggle('flip', Math.cos(v.f) < -0.1);
          for (const sv of v.svgs) {
            const head = sv.querySelector<SVGGElement>('.turret');
            if (head) head.style.transform = `rotate(${Math.sin(v.f) * 28 * (Math.cos(v.f) < -0.1 ? -1 : 1)}deg)`;
          }
        }
      } else {
        v.body.classList.toggle('flip', Math.cos(v.f) < -0.1); // силуэты смотрят вправо
        const building = !moving && v.kind === 'builder' && sites.some(s => s.owner === v.owner && Math.hypot(s.x - v.x, s.y - v.y) < STATS[s.kind].radius + 3.5);
        const n = members(v.kind, v.hp);
        const anim = v.dead ? 'death' : building ? 'work' : now < v.atkUntil ? (v.kind === 'guard' ? 'recoil' : 'attack') : moving ? 'walk' : 'idle';
        v.svgs.forEach((sv, i) => {
          const alive = i < n;
          setAnim(sv, alive ? anim : 'death');
          (sv.parentElement as HTMLElement).classList.toggle('fallen', !alive);
        });
      }
      const ratio = Math.max(0, Math.min(1, v.hp / maxHp(v.kind)));
      const show = !v.dead && (v.build < 1 || ratio < 1 || this.sel.has(v.id));
      v.bar.classList.toggle('hidden', !show);
      v.fg.style.setProperty('--v', (v.build < 1 ? v.build : ratio) * 100 + '%');
      v.fg.className = 'lc-vitals__bar' + (v.build < 1 ? ' lc-vitals__bar--shield' : ratio < 0.35 ? ' lc-vitals__bar--critical' : ratio < 0.6 ? ' lc-vitals__bar--worn' : '');
      v.sel.classList.toggle('on', this.sel.has(v.id));
      v.el.classList.toggle('picked', this.sel.has(v.id));
    }
    const t = performance.now();
    this.shots = this.shots.filter(s => { if (s.until > t) return true; s.el.remove(); return false; });
  };
}
