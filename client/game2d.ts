// 2D-клиент матча на силуэтах дизайн-системы «Латунный Собор»: каждый юнит и здание — живой SVG из ds/assets,
// окрашенный палитрой art-* и анимированный классами lc-anim-* из bundle.css. Правил игры здесь нет: только снимки сервера и ввод.
import { isMelee, ABILITIES, MAX_LVL, canLearn, xpNeed, CAP, ENERGY_COST, LEGEND_COST, POST_UP, WALL_STEP, RAGE_MAX, RESEARCH, RESEARCH_INFO, TIER_UP, researchCost, trainCost, KINDS, MAP, POINTS, POINT_R, REINFORCE_COST, RELICS, STATS, UPGRADES, VENTS, isStruct, maxHp, members, type Buildable, type Cmd, type Kind, type Snap } from '../shared/sim.ts';
import { FACTIONS, type FactionId } from '../shared/factions.ts';
import type { LobbyPlayer } from '../shared/protocol.ts';
import { audio } from './audio.ts';

const S = 26; // пикселей мира на единицу симуляции
const $ = (id: string) => document.getElementById(id)!;

/** Ячейка сетки команд (пресет CommandGrid) и её подсказка (Tooltip). */
type Cell = { act: string; name: string; hot: string; icon?: string; art?: string; cost?: number; en?: number; rel?: number; ok?: boolean; info?: string; req?: string; done?: boolean; prog?: number; cd?: number; cdMax?: number; active?: boolean; ult?: boolean; queue?: number };
const ico = (d: string) => `<svg viewBox="0 0 24 24" aria-hidden="true">${d}</svg>`;
/** Иконки команд из пресета CommandGrid (одна форма — один смысл). */
const ICON = {
  move: ico('<path d="M5 5l7 7-7 7M12 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="2"/>'),
  stop: ico('<path d="M8 3h8l5 5v8l-5 5H8l-5-5V8Z" fill="none" stroke="currentColor" stroke-width="2"/><path d="M8 11h8v2H8z" fill="currentColor"/>'),
  attack: ico('<path d="M5 19 17.5 6.5M14 4h6v6" fill="none" stroke="currentColor" stroke-width="2"/><path d="M4 14l6 6-2 2-6-6Z" fill="currentColor"/>'),
  build: ico('<path d="M2 21h20v-3h-3v-3h-3v-3h-2V3h-4v9H8v3H5v3H2Z" fill="none" stroke="currentColor" stroke-width="2"/>'),
  reinforce: ico('<path d="M12 2.5 20 5.5V12c0 4.6-3.3 8-8 9.5C7.3 20 4 16.6 4 12V5.5Z" fill="none" stroke="currentColor" stroke-width="2"/><path d="M11 8h2v8h-2zM8 11h8v2H8z" fill="currentColor"/>'),
  tier: ico('<path d="M12 2 22 12 12 22 2 12Z" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 7l4 5h-3v5h-2v-5H8Z" fill="currentColor"/>'),
  research: ico('<path d="M6 3h12M6 21h12M7 3c0 6 10 6 10 9S7 15 7 21M17 3c0 6-10 6-10 9s10 3 10 9" fill="none" stroke="currentColor" stroke-width="2"/>'),
};
const ABIL_ICON: Record<number, string> = {
  1: ico('<circle cx="12" cy="12" r="4" fill="currentColor"/><path d="M12 1v4M12 19v4M1 12h4M19 12h4M4 4l3 3M17 17l3 3M4 20l3-3M17 7l3-3" stroke="currentColor" stroke-width="2"/>'),
  3: ico('<path d="M3 12h12M11 6l6 6-6 6M19 5v14" fill="none" stroke="currentColor" stroke-width="2.4"/>'),
  4: ico('<path d="M12 3a9 9 0 1 1-9 9M12 7a5 5 0 1 1-5 5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M3 12l-2-3h4Z" fill="currentColor"/>'),
  5: ico('<path d="M12 1 15 10H9Z" fill="currentColor"/><path d="M12 10v8M5 21h14M7 17l5 4 5-4" fill="none" stroke="currentColor" stroke-width="2"/>'),
  7: ico('<path d="M5 4v16M5 4h12l-3 4 3 4H5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M9 7h2v3H9z" fill="currentColor"/>'),
  8: ico('<path d="M4 20h16M6 20V9l6-5 6 5v11" fill="none" stroke="currentColor" stroke-width="2"/><path d="M10 13h4v7h-4z" fill="currentColor"/>'),
};
const KIND_NAME: Partial<Record<Kind, string>> = { hq: 'Штаб', barracks: 'Казарма', post: 'Реликварий', turret: 'Турель', foundry: 'Литейня', pump: 'Глубинный насос', wall: 'Стена', wallgate: 'Ворота', bunker: 'Крипта-бункер', mine: 'Мина' };
const hex = (c: number) => '#' + c.toString(16).padStart(6, '0');
export const SLOT_COLORS = [0x4fa392, 0xe0675c, 0xe0a53a, 0xb9c3c6];

// какой силуэт из пресетов у какого юнита, его ширина в мире и сколько бойцов в отряде
// ширина силуэта в мире (единиц симуляции); сами силуэты — по фракции игрока (shared/factions.ts)
const WIDTH: Record<Kind, number> = { captain: 3.2, builder: 2.3, guard: 2.4, hq: 11, barracks: 8, post: 4.2, turret: 3.6, foundry: 6.5, pump: 4.4, key1: 6, key2: 6.5, key3: 6.5, key4: 7, gate: 9, legend: 4.4, wall: 3.4, wallgate: 4.6, bunker: 5.5, mine: 1.6 };
const NEUTRAL: Partial<Record<Kind, [string, string]>> = {
  wall: ['Defenses/wall.svg', 'Defenses/wall.svg'], wallgate: ['Defenses/gate.svg', 'Defenses/gate.svg'], bunker: ['Defenses/bunker.svg', 'Defenses/bunker.svg'], mine: ['Defenses/mine.svg', 'Defenses/mine.svg'],
  key1: ['Buildings/scriptorium.svg', 'Buildings/scriptorium.svg'], key2: ['Buildings/forge.svg', 'Buildings/forge.svg'], key3: ['Buildings/observatory.svg', 'Buildings/observatory.svg'],
  key4: ['Buildings/reliqhall.svg', 'Buildings/reliqhall.svg'], gate: ['Buildings/gate.svg', 'Buildings/gate.svg'], post: ['Defenses/point-1.svg', 'Defenses/point-2.svg'], foundry: ['Buildings/foundry.svg', 'Buildings/foundry.svg'], pump: ['Buildings/pump.svg', 'Buildings/pump.svg'] };
/** Путь к силуэту юнита: по фракции, уровню и (у капитана) оружию. */
export function artFor(kind: Kind, faction: FactionId, lvl = 1, weapon: 'sword' | 'hammer' = 'sword', variant = 0) {
  const a = FACTIONS[faction].art;
  if (kind === 'legend') return FACTIONS[faction].legendArt[variant] ?? FACTIONS[faction].legendArt[0];
  if (kind === 'captain') return a.captain[weapon === 'sword' ? 0 : 1];
  if (kind === 'turret') return a.turret[lvl > 1 ? 1 : 0];
  if (kind === 'post') return lvl >= 3 ? 'Defenses/point-3.svg' : lvl === 2 ? 'Defenses/point-2.svg' : 'Defenses/point-1.svg';
  if (NEUTRAL[kind]) return NEUTRAL[kind]![lvl > 1 ? 1 : 0];
  return a[kind as 'builder' | 'guard' | 'hq' | 'barracks'];
}
const FORM: Partial<Record<Kind, [number, number][]>> = {
  guard: [[0.8, 0.1], [0, -0.5], [0, 0.6], [-0.8, -0.2], [-0.8, 0.7]], // плотный строй, как в карточке LivingSquads
  builder: [[0.3, -0.4], [-0.3, 0.4]],
};

const svgCache = new Map<string, string>();
/** Загружает все силуэты один раз. */
const ALL_ART = new Set([...Object.values(FACTIONS).flatMap(f => [...f.legendArt, ...f.art.captain, f.art.builder, f.art.guard, f.art.hq, f.art.barracks, ...f.art.turret]), ...Object.values(NEUTRAL).flat(), 'Defenses/point-3.svg', 'Buildings/reliquary.svg']);
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
  atkUntil: number; melee?: boolean; artPath: string; prog: number; prod: number;
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
  private shots: { el: SVGElement; until: number }[] = [];
  private ghost = document.createElement('div');
  private wallLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  private place: Buildable | null = null;
  private drag: { x0: number; y0: number; x1: number; y1: number } | null = null;
  private mouse: { x: number; y: number } | null = null;
  private amove = false;
  private moveMode = false;
  private centered = false;
  private ended = false;
  private req = 0;
  private tier = 1;
  private energy = 0;
  private relics = 0;
  private lastRemains = 0;
  private research = 0;
  private cap = { lvl: 1, xp: 0, pts: 0, abil: 0, cd: [] as number[] };
  private learnHtml = '';
  private lvlUpAt = 0;
  private lvlUpOpen = false;
  private mini = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  private miniCam = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  private miniPing = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
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
    this.wallLine.classList.add('w2d-wallline');
    this.wallLine.setAttribute('visibility', 'hidden');
    this.fx.append(this.wallLine);
    this.world.append(this.ground, this.fx, this.ghost);
    root.prepend(this.world);
    this.buildMap();
    this.buildMini();
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
  private mk(id: number, owner: number, kind: Kind, x: number, y: number, variant = 0): View {
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
    const pl = this.players[owner], artPath = artFor(kind, pl.faction ?? 'order', 1, pl.captain.weapon, variant);
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
    return { id, owner, kind, el, body, svgs, bar, fg, sel, x, y, tx: x, ty: y, f: 0, hp: maxHp(kind), build: 1, q: 0, dead: false, lvl: 1, upg: -1, atkUntil: 0, artPath, prog: 0, prod: 0 };
  }

  onSnap(s: Snap) {
    const seen = new Set<number>(), first = this.snapN++ === 0, now = performance.now();
    for (const [id, owner, ki, x, y, hp, face, q, bp, , lvl, upg, prog] of s.u) {
      const kind = KINDS[ki];
      if (kind === 'mine' && owner !== this.slot) continue; // чужие мины невидимы
      seen.add(id);
      let v = this.views.get(id);
      if (!v) {
        this.views.set(id, (v = this.mk(id, owner, kind, x / 10, y / 10, q)));
        if (kind === 'legend') v.el.classList.add('legend');
        if (!first && owner === this.slot && !isStruct(kind)) audio.trained();
      } else if (owner === this.slot) {
        if (v.build < 1 && bp >= 100) { audio.built(); this.alert('ok', 'Постройка готова', this.nameOf(v), v.tx, v.ty); }
        if (kind === 'captain' && v.hp > 0 && hp <= 0) { audio.alarm(); this.alert('danger', 'Капитан пал', 'возродится в штабе', x / 10, y / 10); }
        else if (hp < v.hp && now - this.lastAlert > 8000) { this.lastAlert = now; audio.alarm(); this.pingMini(x / 10, y / 10); this.alert('danger', 'Нас атакуют', this.nameOf(v), x / 10, y / 10); }
      }
      v.tx = x / 10; v.ty = y / 10; v.f = face / 100; v.hp = hp; v.q = q; v.build = bp / 100; v.dead = hp <= 0;
      const lvlArt = artFor(kind, this.players[owner].faction ?? 'order', lvl, this.players[owner].captain.weapon, kind === 'legend' ? q : 0);
      if (lvl !== v.lvl && lvlArt !== v.artPath) { // апгрейд: новый силуэт уровня 2
        v.artPath = lvlArt;
        const a = art(lvlArt, WIDTH[kind] * S * 1.1);
        v.body.replaceChildren(a); v.svgs = [a.querySelector('svg')!];
      }
      v.lvl = lvl; v.upg = upg; v.prog = prog ?? 0; v.prod = prog ?? 0;
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
    for (const [x1, y1, x2, y2, fx = 0] of s.sh) this.shot(x1 / 10, y1 / 10, x2 / 10, y2 / 10, now, Math.round(fx / 10));
    let heard = 0;
    for (const [x1, y1] of s.sh) { const a = this.audioAt(x1 / 10, y1 / 10); if (a && heard++ < 4) audio.shot(a.pan); }
    audio.heat(Math.min(0.4, s.sh.length * 0.02));
    this.hud(s);
    if (s.w !== null && !this.ended) { this.ended = true; this.onEnd(s.w); }
  }

  /** Атака (пресет AttackVFX): у каждого оружия своя форма следа — пуля, рубящая дуга, три когтя, луч, огонь, укол. */
  private shot(x1: number, y1: number, x2: number, y2: number, now: number, fx = 0) {
    let best: View | undefined, bd = 2.2;
    for (const v of this.views.values()) { const d = Math.hypot(v.tx - x1, v.ty - y1); if (d < bd && !v.dead) { bd = d; best = v; } }
    const melee = fx === 1 || fx === 2 || fx === 5;
    if (best) { best.atkUntil = now + (melee ? 1300 : 700); best.melee = melee; }
    if (this.shots.length > 120) return;
    const ns = 'http://www.w3.org/2000/svg', g = document.createElementNS(ns, 'g');
    const h = best && !isStruct(best.kind) ? 1.2 : 2.2, X1 = x1 * S, Y1 = (y1 - h) * S, X2 = x2 * S, Y2 = (y2 - 1) * S;
    const dir = Math.sign(X2 - X1) || 1;
    if (fx === 0) g.innerHTML = `<line class="w2d-tracer" x1="${X1}" y1="${Y1}" x2="${X2}" y2="${Y2}"/><circle class="w2d-muzzle" cx="${X1}" cy="${Y1}" r="5"/>`;
    else if (fx === 1) g.innerHTML = `<path class="w2d-slash" d="M${X2 - 14 * dir} ${Y2 - 30} Q${X2 + 22 * dir} ${Y2 - 14} ${X2 + 6 * dir} ${Y2 + 18}"/><ellipse class="w2d-dust" cx="${X2}" cy="${Y2 + 20}" rx="18" ry="6"/>`;
    else if (fx === 2) g.innerHTML = [-8, 0, 8].map(o => `<path class="w2d-claw" d="M${X2 - 16 * dir + o} ${Y2 - 26} Q${X2 + 10 * dir + o} ${Y2 - 8} ${X2 + o} ${Y2 + 16}"/>`).join('') + `<circle class="w2d-spark" cx="${X2}" cy="${Y2}" r="4"/>`;
    else if (fx === 3) g.innerHTML = `<line class="w2d-beam" x1="${X1}" y1="${Y1}" x2="${X2}" y2="${Y2}"/><circle class="w2d-hitring" cx="${X2}" cy="${Y2}" r="8"/>`;
    else if (fx === 4) g.innerHTML = `<path class="w2d-fire" d="M${X1} ${Y1} Q${(X1 + X2) / 2} ${Math.min(Y1, Y2) - 50} ${X2} ${Y2}"/><circle class="w2d-blast" cx="${X2}" cy="${Y2}" r="14"/>`;
    else g.innerHTML = [-5, 5].map(o => `<line class="w2d-thrust" x1="${X2 - 26 * dir}" y1="${Y2 + o}" x2="${X2 + 6 * dir}" y2="${Y2 + o}"/>`).join('') + `<circle class="w2d-spark" cx="${X2 + 4 * dir}" cy="${Y2}" r="3"/>`;
    this.fx.append(g);
    this.shots.push({ el: g, until: now + (fx === 0 ? 160 : fx === 3 ? 420 : 340) });
  }

  private shake(px: number) {
    this.world.animate([{ translate: `${px}px 0` }, { translate: `${-px}px ${px / 2}px` }, { translate: '0 0' }], { duration: 260, composite: 'add' });
  }

  // ---------- мини-карта (пресет Minimap): квадраты — свои, треугольники — враги, ромбы — точки ----------
  private buildMini() {
    const svg = $('mini-svg') as unknown as SVGSVGElement;
    svg.innerHTML = `<rect class="ground" width="100" height="100"/><path class="river" d="M0 50 C25 44 40 60 50 50 S75 42 100 50" style="stroke-width:3;opacity:.5"/>`
      + VENTS.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.5" fill="var(--amber-500)" opacity=".6"/>`).join('');
    this.miniCam.classList.add('cam'); this.miniPing.classList.add('ping', 'lc-ping'); this.miniPing.setAttribute('r', '4'); this.miniPing.style.display = 'none';
    svg.append(this.mini, this.miniCam, this.miniPing);
    const go = (e: PointerEvent) => { const r = svg.getBoundingClientRect(); this.cam.x = ((e.clientX - r.left) / r.width) * MAP.w; this.cam.y = ((e.clientY - r.top) / r.height) * MAP.h; };
    svg.addEventListener('pointerdown', e => { e.stopPropagation(); go(e); svg.setPointerCapture(e.pointerId); }, { signal: this.ac.signal });
    svg.addEventListener('pointermove', e => { if (e.buttons & 1) go(e); }, { signal: this.ac.signal });
  }

  private drawMini(s: Snap) {
    const k = 100 / MAP.w, own = (o: number) => (o === this.slot ? 'ally' : 'enemy');
    let h = s.p.map(([o], i) => { const [x, y] = [...POINTS, ...RELICS][i] ?? [0, 0]; return `<path class="${o < 0 ? 'pt' : o === this.slot ? 'pt-ally' : 'pt-enemy'}" d="M${x * k} ${y * k - 3}l3 3-3 3-3-3z"/>`; }).join('');
    for (const [, o, ki, x, y, hp] of s.u) {
      const kind = KINDS[ki], X = (x / 10) * k, Y = (y / 10) * k;
      if (hp <= 0 || (kind === 'mine' && o !== this.slot)) continue;
      if (kind === 'hq') h += o === this.slot ? `<rect class="base-ally" x="${X - 4}" y="${Y - 4}" width="8" height="8"/>` : `<path class="base-enemy" d="M${X} ${Y - 5}l5 9h-10z"/>`;
      else if (isStruct(kind)) h += `<rect class="${own(o)}" x="${X - 1.2}" y="${Y - 1.2}" width="2.4" height="2.4" opacity=".7"/>`;
      else h += o === this.slot ? `<rect class="ally" x="${X - 1}" y="${Y - 1}" width="2" height="2"/>` : `<path class="enemy" d="M${X} ${Y - 1.4}l1.4 2.6h-2.8z"/>`;
    }
    this.mini.innerHTML = h;
  }

  private pingMini(x: number, y: number) {
    const k = 100 / MAP.w;
    this.miniPing.setAttribute('cx', String(x * k)); this.miniPing.setAttribute('cy', String(y * k));
    this.miniPing.style.display = ''; clearTimeout(this.pingT); this.pingT = window.setTimeout(() => (this.miniPing.style.display = 'none'), 3600);
  }
  private pingT = 0;

  // ---------- капитан: опыт, уровень, дерево способностей ----------
  private capHud(me: number[]) {
    const c = this.cap;
    const [lvl, xp, pts, abil] = [me[9] ?? 1, me[10] ?? 0, me[11] ?? 0, me[12] ?? 0];
    if (lvl > c.lvl && this.snapN > 2) { audio.built(); this.alert('ok', `Ранг ${lvl}`, 'выберите дар'); const v = [...this.views.values()].find(u => u.owner === this.slot && u.kind === 'captain'); v?.el.animate([{ filter: 'drop-shadow(0 0 0 var(--gilt-300))' }, { filter: 'drop-shadow(0 0 22px var(--gilt-300))' }, { filter: 'none' }], { duration: 900 }); }
    Object.assign(c, { lvl, xp, pts, abil, cd: me.slice(13) });
    $('cap-lvl').textContent = String(lvl);
    $('cap-xp').style.setProperty('--xp', lvl >= MAX_LVL ? '100%' : `${(xp / xpNeed(lvl)) * 100}%`);
    $('cap-xpt').textContent = lvl >= MAX_LVL ? 'ур. 10 · предел' : `ур. ${lvl} → ${lvl + 1} · ${xp} / ${xpNeed(lvl)}`;
    const fake = { abil, pts, clvl: lvl, tier: this.tier } as Parameters<typeof canLearn>[0];
    const open = ABILITIES.map((a, i) => ({ ...a, i })).filter(a => !canLearn(fake, a.i));
    const html = pts > 0 && open.length ? `<p class="lc-levelup__rank">Ранг ${lvl}</p><p class="lc-levelup__sub">Выберите дар · очков: ${pts}</p><div class="lc-choices">`
      + open.map((a, n) => `<button class="lc-choice" data-learn="${a.i}"><kbd>Alt+${n + 1}</kbd><strong>${a.name}</strong><span>${a.info}${a.cd ? ` · <em>перезарядка ${a.cd} с</em>` : ' · <em>пассивная</em>'}</span></button>`).join('') + '</div>' : '';
    if (html !== this.learnHtml) { this.learnHtml = html; $('hud-levelup').innerHTML = html; this.lvlUpAt = performance.now(); this.lvlUpOpen = !!html; }
    if (this.lvlUpOpen && performance.now() - this.lvlUpAt > 15000) this.lvlUpOpen = false; // не выбрал за 15 с — сворачивается в ромб уровня
    $('hud-levelup').classList.toggle('hidden', !this.lvlUpOpen);
    $('hud-cap').classList.toggle('has-pts', pts > 0 && !this.lvlUpOpen);
  }

  private learn(n: number) {
    const b = $('hud-levelup').querySelectorAll<HTMLElement>('[data-learn]')[n];
    if (b) this.cmd({ c: 'learn', a: Number(b.dataset.learn) });
  }

  /** Лента оповещений (пресет Alert): до 4 строк, тревога гаснет через 8 с, остальное через 5 с; клик по тревоге — камера к событию. */
  alert(tone: 'danger' | 'warn' | 'ok' | '', text: string, meta = '', x?: number, y?: number) {
    const box = $('hud-alerts'), el = document.createElement('div');
    const glyph = tone === 'danger' ? '<path d="M12 2 23 21H1Z" fill="none" stroke="currentColor" stroke-width="2"/><path d="M11 9h2v6h-2zM11 17h2v2h-2z" fill="currentColor"/>'
      : tone === 'warn' ? '<path d="M6 2h12M6 22h12M7 2c0 6 10 6 10 10S7 16 7 22M17 2c0 6-10 6-10 10s10 4 10 10" fill="none" stroke="currentColor" stroke-width="2"/>'
      : tone === 'ok' ? '<path d="M12 2 22 12 12 22 2 12Z" fill="none" stroke="currentColor" stroke-width="2"/><path d="M8 12l3 3 5-6" fill="none" stroke="currentColor" stroke-width="2"/>'
      : '<path d="M12 2 22 12 12 22 2 12Z" fill="currentColor"/>';
    el.className = `lc-alert${tone ? ' lc-alert--' + tone : ''}`;
    el.setAttribute('role', tone === 'danger' ? 'alert' : 'status');
    el.innerHTML = `<span class="lc-alert__glyph"><svg viewBox="0 0 24 24" aria-hidden="true">${glyph}</svg></span><span class="lc-alert__text">${text.replace(/[<>&]/g, '')}</span>${meta ? `<span class="lc-alert__meta">${meta.replace(/[<>&]/g, '')}</span>` : ''}`;
    if (x !== undefined && y !== undefined) { el.style.cursor = 'pointer'; el.onclick = () => { this.cam.x = x; this.cam.y = y; }; }
    box.prepend(el);
    while (box.children.length > 4) box.lastElementChild!.remove();
    setTimeout(() => el.remove(), tone === 'danger' ? 8000 : 5000);
  }

  // ---------- HUD ----------
  private hud(s: Snap) {
    const me = s.pl[this.slot];
    this.req = me[0]; this.energy = me[3] ?? 0; this.relics = me[4] ?? 0;
    const learnt = (me[8] ?? 0) & ~this.research;
    if (learnt && this.snapN > 2) RESEARCH.forEach((n, i) => { if (learnt & (1 << i)) this.alert('ok', 'Исследовано', n); });
    if ((s.pl[this.slot][2] ?? 1) > this.tier && this.snapN > 2) this.alert('ok', `Тир ${['I', 'II', 'III', 'IV', 'V'][s.pl[this.slot][2] - 1]}`, 'новые постройки и войска');
    this.lastRemains = me[7] ?? 0; this.research = me[8] ?? 0;
    this.capHud(me);
    this.drawMini(s);
    $('hud-energy').textContent = String(this.energy); $('hud-relics').textContent = String(this.relics);
    const f = this.fac(), extra = $('hud-extra');
    extra.innerHTML = f === 'orks' ? (me[6] ? `<b class="waagh">ВААГХ ${me[6]} с</b>` : `<span class="rage"><i style="--v:${(me[5] / RAGE_MAX) * 100}%"></i></span>Ярость`)
      : f === 'undead' ? `<b>${me[7] ?? 0}</b> останков` : f === 'clockwork' ? 'Перезавод' : f === 'prism' ? 'Сеть наведения' : f === 'ashen' ? 'Порча' : 'Свет веры';
    extra.title = FACTIONS[f].mech;
    this.tier = s.pl[this.slot][2] ?? 1;
    $('hud-tier').textContent = ['I', 'II', 'III', 'IV', 'V'][this.tier - 1] ?? String(this.tier);
    let builders = 0, guards = 0, dead = false;
    for (const u of s.u) if (u[1] === this.slot) { if (u[2] === 1) builders++; else if (u[2] === 2) guards++; else if (u[2] === 0 && u[5] <= 0) dead = true; }
    $('hud-req').textContent = this.fac() === 'clockwork' ? '—' : String(this.req);
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
      if (v.owner !== this.slot || v.q <= 0 || (v.kind !== 'hq' && v.kind !== 'barracks')) continue;
      const what: Kind = v.kind === 'hq' ? 'builder' : 'guard', name = v.kind === 'hq' ? FACTIONS[this.fac()].builder : FACTIONS[this.fac()].guard;
      for (let i = 0; i < v.q; i++) items.push(`<div class="w2d-qitem${i ? '' : ' now'}" title="${name}">${miniArt(artFor(what, this.players[this.slot].faction ?? 'order'))}${i ? '' : `<span class="w2d-qbar" style="--v:${v.prog}%"></span>`}</div>`);
    }
    const q = $('hud-queue');
    q.classList.toggle('hidden', !items.length);
    const html = items.length ? `<span class="w2d-qlabel">Производство</span>${items.join('')}` : '';
    if (q.innerHTML !== html) q.innerHTML = html;
  }

  private fac(owner = this.slot): FactionId { return this.players[owner]?.faction ?? 'order'; }

  private selected() { return [...this.sel].map(id => this.views.get(id)).filter((v): v is View => !!v); }

  // ---------- нижний HUD по пресетам: UnitCard + CommandGrid 4×3 / BuildMenu + Tooltip ----------
  private buildOpen = false;
  private buildTab = 0;
  private lastSelKey = '';
  private cells: Cell[] = [];
  private tipAct = '';

  private price(cost: number, en = 0, rel = 0) {
    if (this.fac() === 'clockwork') { en += cost; cost = 0; } // Династии платят энергией
    return { cost, en, rel, ok: this.req >= cost && this.energy >= en && this.relics >= rel };
  }

  private nameOf(v: View) {
    const F = FACTIONS[this.fac(v.owner)];
    if (v.kind === 'captain') return this.players[v.owner]?.name ?? 'Капитан';
    if (v.kind === 'builder') return F.builder;
    if (v.kind === 'guard') return F.guard;
    if (v.kind === 'legend') return F.legends[v.q] ?? 'Легенда';
    if (/^key[1-4]$/.test(v.kind)) return F.keys[Number(v.kind[3]) - 1];
    if (v.kind === 'gate') return F.gate;
    return KIND_NAME[v.kind] ?? v.kind;
  }

  /** Команды выбранного: фиксированная раскладка — верхний ряд движение/стоп/атака, ниже постройка и способности. */
  private buildCells(sel: View[]): Cell[] {
    const F = FACTIONS[this.fac()], R = ['I', 'II', 'III', 'IV', 'V'], c: Cell[] = [];
    const st = sel.length === 1 && isStruct(sel[0].kind) ? sel[0] : null;
    const own = (k: Kind) => [...this.views.values()].some(v => v.owner === this.slot && v.kind === k);
    if (st) {
      if (st.build < 1) return [{ act: '', name: 'Возводится', hot: '', icon: ICON.build, prog: Math.round(st.build * 100), info: 'Отправьте строителей: выберите их и ПКМ по стройке.' }];
      const free = this.fac() === 'undead' && this.lastRemains >= 5;
      if (st.kind === 'hq' || st.kind === 'barracks') {
        const what: Kind = st.kind === 'hq' ? 'builder' : 'guard';
        c.push({ act: 'train', name: what === 'builder' ? F.builder : F.guard, hot: 'T', art: artFor(what, this.fac()), ...this.price(free && what === 'guard' ? 0 : trainCost(this.fac(), what)), info: what === 'builder' ? 'Строит, чинит и ускоряет стройку.' : (isMelee('guard', this.fac()) ? 'Линейная пехота ближнего боя.' : 'Линейная пехота, стрелки.') + (free ? ' <em>Даром: Жатва</em>' : ''), queue: st.q, prog: st.q ? st.prod : undefined });
      }
      if (st.kind === 'hq') {
        const t = TIER_UP[this.tier], keyOk = t && own(t.key) && [...this.views.values()].some(v => v.owner === this.slot && v.kind === t.key && v.build >= 1);
        if (!t) c.push({ act: '', name: 'Высший тир', hot: '', icon: ICON.tier, info: 'Тир V достигнут.' });
        else {
          const req = !keyOk ? `Нужно здание «${F.keys[this.tier - 1]}»` : t.seal && !(this.research & (1 << 15)) ? 'Нужно исследование «Печать Вознесения»' : undefined;
          c.push({ act: 'tier', name: `Тир ${R[this.tier]}`, hot: 'U', icon: ICON.tier, ...this.price(t.cost, t.energy, t.relics), req, prog: st.upg >= 0 ? st.upg : undefined, info: 'Улучшение штаба открывает новые постройки, исследования и войска.' });
        }
      }
      if (/^key[1-4]$/.test(st.kind)) {
        const k = Number(st.kind[3]);
        for (let r = 0; r < 4; r++) {
          const i = (k - 1) * 4 + r, done = !!(this.research & (1 << i)), busy = st.q > 0 && st.q - 1 !== i;
          c.push({ act: done ? '' : 'res' + r, name: RESEARCH[i], hot: String(r + 1), icon: ICON.research, ...(done ? {} : this.price(researchCost(i).cost, researchCost(i).energy)), info: RESEARCH_INFO[i], done, req: busy ? 'Здание уже исследует' : undefined, prog: st.q - 1 === i ? st.prod : undefined });
        }
      }
      if (st.kind === 'gate') {
        const onField = own('legend');
        F.legends.forEach((n, v) => c.push({ act: 'sum' + v, name: n, hot: String(v + 1), art: F.legendArt[v], ...this.price(0, LEGEND_COST[v].energy, LEGEND_COST[v].relics), info: F.legendInfo[v] + '. Призыв 20 с, виден всем.', req: onField ? 'Легенда уже на поле' : st.q > 0 && st.q - 1 !== v ? 'Врата заняты' : undefined, prog: st.q - 1 === v ? st.prod : undefined }));
      }
      if (st.kind === 'post') {
        const up = POST_UP[st.lvl];
        if (up) c.push({ act: 'upgrade', name: up.name, hot: 'U', icon: ICON.tier, ...this.price(up.cost, up.energy), req: this.tier < up.tier ? 'Нужен тир II' : undefined, prog: st.upg >= 0 ? st.upg : undefined, info: st.lvl === 1 ? '+12 влияния / 10 с, броня, захват дольше.' : 'Бастион: своя турель 12 м.' });
      }
      const up = UPGRADES[st.kind];
      if (up) c.push({ act: st.lvl >= 2 ? '' : 'upgrade', name: up.name, hot: 'U', icon: ICON.tier, ...(st.lvl >= 2 ? {} : this.price(up.cost, up.energy, up.relics)), done: st.lvl >= 2, req: this.tier < up.tier ? `Нужен тир ${up.tier}` : undefined, prog: st.upg >= 0 ? st.upg : undefined, info: 'Больше урона, брони и дальности.' });
      return c;
    }
    if (!sel.length) return c;
    c.push({ act: 'move', name: 'Идти', hot: 'M', icon: ICON.move, info: 'Идти в точку, не отвлекаясь на врагов.', active: this.moveMode },
      { act: 'stop', name: 'Стоп', hot: 'S', icon: ICON.stop, info: 'Остановиться и держать место.' },
      { act: 'amove', name: 'Атака', hot: 'A', icon: ICON.attack, info: 'Идти и атаковать всех врагов по пути.', active: this.amove });
    if (sel.some(v => v.kind === 'builder')) c.push({ act: 'buildmenu', name: 'Строить', hot: 'C', icon: ICON.build, info: 'Меню построек: экономика, армия, оборона, святыни.' });
    else c.push({ act: '', name: '', hot: '', icon: '' });
    const guards = sel.filter(v => v.kind === 'guard'), hurt = guards.filter(v => v.hp < maxHp('guard'));
    if (guards.length) c.push({ act: 'reinforce', name: 'Пополнить', hot: 'R', icon: ICON.reinforce, ...this.price(hurt.reduce((n, v) => n + Math.ceil((maxHp('guard') - v.hp) / STATS.guard.hp) * REINFORCE_COST, 0)), req: hurt.length ? undefined : 'Отряды полные', info: 'Добрать бойцов в отряды. Нужно быть рядом со своей постройкой.' });
    for (const k of ['guard', 'captain'] as Kind[]) {
      const vs = sel.filter(v => v.kind === k), up = UPGRADES[k];
      if (!vs.length || !up) continue;
      const v = vs.find(x => x.lvl < 2);
      c.push({ act: v ? 'upgrade' : '', name: up.name, hot: 'U', icon: ICON.tier, ...(v ? this.price(up.cost, up.energy, up.relics) : {}), done: !v, req: this.tier < up.tier ? `Нужен тир ${up.tier}` : undefined, prog: v && v.upg >= 0 ? v.upg : undefined, info: k === 'captain' ? 'Капитан: урон ×1.5, получаемый урон ×0.7.' : 'Отряд: урон ×1.6, броня.' });
    }
    if (sel.some(v => v.kind === 'captain')) {
      let n = 0;
      ABILITIES.forEach((a, i) => {
        if (!a.cd || !(this.cap.abil & (1 << i))) return;
        const cd = this.cap.cd[i] ?? 0;
        c.push({ act: 'ab' + i, name: a.name, hot: String(++n), icon: ABIL_ICON[i] ?? ICON.attack, info: a.info, cd, cdMax: a.cd, ult: i === 5 });
      });
    }
    return c;
  }

  private cellHtml(x: Cell) {
    if (!x.act && !x.name) return '<span class="lc-cmd__cell lc-cmd__cell--empty"></span>';
    const locked = !!x.req || x.ok === false || x.done, cooling = (x.cd ?? 0) > 0 || x.prog !== undefined;
    const cls = ['lc-cmd__cell', x.active ? 'lc-cmd__cell--active' : '', locked && !cooling ? 'lc-cmd__cell--locked' : '', cooling ? 'lc-cmd__cell--cooldown' : '', x.ult ? 'ult' : '', x.done ? 'done' : ''].filter(Boolean).join(' ');
    const shade = x.prog !== undefined ? 100 - x.prog : x.cd ? (x.cd / (x.cdMax ?? x.cd)) * 100 : 0;
    const icon = x.art ? miniArt(x.art) : x.icon;
    const cost = x.done ? '✓' : x.cost || x.en || x.rel ? [x.cost ? `◆${x.cost}` : '', x.en ? `ϟ${x.en}` : '', x.rel ? `⌂${x.rel}` : ''].filter(Boolean).join(' ') : '';
    return `<button class="${cls}" data-act="${x.act}" data-hot="${x.hot.toLowerCase()}" ${x.active ? 'aria-pressed="true"' : ''} ${locked ? 'aria-disabled="true"' : ''} style="--cd:${shade}%">${icon}<span class="lc-cmd__key">${x.hot}</span>${cost ? `<span class="lc-cmd__cost">${cost}</span>` : ''}${cooling ? `<span class="lc-cmd__timer">${x.prog !== undefined ? x.prog + '%' : x.cd}</span>` : ''}${x.queue ? `<span class="lc-cmd__charges">${x.queue}</span>` : ''}</button>`;
  }

  /** Меню строителя (пресет BuildMenu): вкладки Экономика → Армия → Оборона → Святыни, клавиши не меняются между вкладками. */
  private buildMenuHtml(sel: View[]) {
    const F = FACTIONS[this.fac()], bs = sel.filter(v => v.kind === 'builder');
    const own = (k: Kind) => [...this.views.values()].some(v => v.owner === this.slot && v.kind === k);
    const keyKind = (): Kind | null => { for (let t = 1; t <= Math.min(this.tier, 4); t++) if (!own(('key' + t) as Kind)) return ('key' + t) as Kind; return this.tier >= 5 && !own('gate') ? 'gate' : null; };
    const card = (k: Buildable, name: string, hot: string, info: string, req?: string) => {
      const p = this.price(STATS[k].cost, ENERGY_COST[k] ?? 0), lack = (n: number, have: number) => (n > have ? ' class="lack"' : '');
      const cost = req ? `<span>${req}</span>` : [p.cost ? `<span${lack(p.cost, this.req)}>◆ ${p.cost}</span>` : '', p.en ? `<span${lack(p.en, this.energy)}>ϟ ${p.en}</span>` : '', `<span>⧗ ${STATS[k].time} с</span>`].join('');
      return { k, html: `<button class="lc-bcard${req ? ' lc-bcard--locked' : ''}" data-act="${req ? '' : k}" data-tipname="${name}" data-tipinfo="${info}" ${req ? 'aria-disabled="true"' : ''} ${this.place === k ? 'aria-pressed="true"' : ''}>${miniArt(artFor(k as Kind, this.fac(), 1))}<span><span class="lc-bcard__name">${name}</span><span class="lc-bcard__cost">${cost}</span></span><kbd>${hot}</kbd></button>` };
    };
    const undead = this.fac() === 'undead';
    const tabs: [string, ReturnType<typeof card>[]][] = [
      ['Экономика', [card('post', 'Реликварий', 'P', 'Ставится на захваченную точку: держит её и даёт +2 влияния/с.'), card('foundry', 'Литейня', 'F', '+2 энергии/с. Ставится у своих построек.', undead ? 'Нежити не нужна' : undefined), card('pump', 'Насос', 'N', '+4 энергии/с. Только на жилу.', undead ? 'Нежити не нужен' : undefined)]],
      ['Армия', [card('barracks', 'Казарма', 'B', `Нанимает: ${F.guard}. Строится рядом со штабом.`)]],
      ['Оборона', [card('turret', 'Турель', 'Y', 'Стреляет сама, голова поворачивается к цели.'), card('wall', 'Стена', 'W', 'Протяжка: клик — начало, клик — конец. 30 за сегмент.'), card('wallgate', 'Ворота', 'G', 'Свои проходят, чужие нет.'), card('bunker', 'Бункер', 'X', 'Пехота рядом получает −50% урона.', this.tier < 2 ? 'Нужен тир II' : undefined), card('mine', 'Мина', 'V', 'Невидима врагу, 180 урона по 6 м.')]],
      ['Святыни', (() => { const k = keyKind(); return k ? [card(k as Buildable, k === 'gate' ? F.gate : F.keys[Number(k[3]) - 1], 'K', k === 'gate' ? 'Врата призыва легенд, тир V.' : `Ключевое здание тира ${['I', 'II', 'III', 'IV'][Number(k[3]) - 1]}: открывает переход и 4 исследования.`)] : []; })()],
    ];
    const tab = tabs[this.buildTab] ?? tabs[0];
    return `<div class="lc-buildhead">${miniArt(artFor('builder', this.fac()))}<div><div class="lc-buildhead__who">${F.builder} ×${bs.length}</div><div class="lc-buildhead__meta">скорость стройки ×${bs.length}</div></div><button class="lc-btn lc-btn--sm lc-btn--ghost" data-act="cmdgrid">Команды ▸</button></div>`
      + `<div class="lc-tabs" role="tablist">${tabs.map(([n, cs], i) => `<button role="tab" data-tab="${i}" aria-selected="${i === this.buildTab}">${n}${cs.length ? '' : ' ·'}</button>`).join('')}</div>`
      + `<div class="lc-build">${tab[1].map(x => x.html).join('') || '<p class="lc-buildhint">Ключевое здание текущего тира уже построено. Улучшите штаб.</p>'}</div>`
      + `<p class="lc-buildhint">${this.place ? '<b>ЛКМ</b> поставить · <b>Shift</b> несколько · <b>ПКМ</b>/<b>Esc</b> отмена' : '<b>B P Y F N W G X V K</b> — сразу в установку из любой вкладки'}</p>`;
  }

  /** Карточка выбранного (пресет UnitCard); группа — сетка малых портретов. */
  private cardHtml(sel: View[]) {
    if (!sel.length) return '';
    if (sel.length > 1) return `<div class="w2d-group">${sel.slice(0, 18).map(v => `<button class="w2d-gp${v.owner !== this.slot ? ' foe' : ''}" data-pick="${v.id}">${miniArt(v.artPath)}<i style="--v:${Math.max(0, v.hp / maxHp(v.kind)) * 100}%"></i></button>`).join('')}${sel.length > 18 ? `<span class="w2d-more">+${sel.length - 18}</span>` : ''}</div>`;
    const v = sel[0], st = STATS[v.kind], foe = v.owner !== this.slot, max = maxHp(v.kind), hp = Math.max(0, Math.round(v.hp));
    const melee = isMelee(v.kind, this.fac(v.owner));
    const cls = v.kind === 'captain' ? `Герой · ур. ${foe ? '?' : this.cap.lvl}` : v.kind === 'builder' ? 'Строитель' : v.kind === 'guard' ? `Пехота · ${melee ? 'ближний бой' : 'стрелки'}` : v.kind === 'legend' ? 'Легенда' : 'Постройка';
    const stats: [string, string][] = [];
    if (st.dmg) stats.push(['УРОН', v.kind === 'guard' ? `${melee ? 6.5 : st.dmg}×${members('guard', v.hp)}` : String(st.dmg)], ['ДАЛ.', melee ? 'в упор' : String(st.range)]);
    if (st.speed) stats.push(['СКОР.', String(st.speed)]);
    if (v.kind === 'guard') stats.push(['БОЙЦЫ', `${members('guard', v.hp)}/${st.n}`]);
    if (v.lvl > 1) stats.push(['УР.', `<b class="up">▲${v.lvl}</b>`]);
    if (isStruct(v.kind) && v.build < 1) stats.push(['СТРОЙКА', `${Math.round(v.build * 100)}%`]);
    return `<div class="lc-unit${foe ? ' foe' : ''}"><div class="lc-unit__portrait">${miniArt(v.artPath)}<span class="lc-unit__rank">${['I', 'II', 'III'][Math.min(2, v.lvl - 1)]}</span></div><div><h3 class="lc-unit__name">${this.nameOf(v).replace(/[<>&]/g, '')}</h3><p class="lc-unit__class">${cls}${foe ? ' · враг' : ''}</p><div class="lc-vitals"><div class="lc-vitals__bar" style="--v:${(hp / max) * 100}%"></div><div class="lc-vitals__nums"><span>Здоровье</span><span><b>${hp}/${max}</b></span></div></div><p class="lc-unit__stats">${stats.map(([a, b]) => `<span>${a} <b>${b}</b></span>`).join('')}</p></div></div>`;
  }

  private renderCmd() {
    const sel = this.selected(), key = [...this.sel].join(',');
    if (key !== this.lastSelKey) { this.lastSelKey = key; this.buildOpen = sel.length > 0 && sel.every(v => v.kind === 'builder'); }
    const builders = sel.some(v => v.kind === 'builder') && !sel.some(v => isStruct(v.kind));
    if (!builders) this.buildOpen = false;
    this.cells = this.buildCells(sel);
    let panel: string;
    if (this.buildOpen) panel = this.buildMenuHtml(sel);
    else {
      const grid = this.cells.slice(0, 12);
      while (grid.length < 12) grid.push({ act: '', name: '', hot: '', icon: '' });
      panel = sel.length ? `<div class="lc-cmd" role="toolbar" aria-label="Команды">${grid.map(x => this.cellHtml(x)).join('')}</div>` : `<p class="lc-buildhint">ЛКМ — выбрать, рамка — группа · ПКМ — приказ · Пробел — капитан · H — штаб · колесо — масштаб</p>`;
    }
    const card = this.cardHtml(sel);
    if (panel !== this.cmdHtml) { this.cmdHtml = panel; $('hud-cmd').innerHTML = panel; if (this.tipAct) this.showTip(this.tipAct); }
    if (card !== this.cardHtmlLast) { this.cardHtmlLast = card; $('hud-card').innerHTML = card; $('hud-card').classList.toggle('hidden', !card); }
  }
  private cardHtmlLast = '';

  /** Подсказка (пресет Tooltip): имя, клавиша, цена с нехваткой, описание, невыполненные требования. */
  private showTip(act: string, el?: HTMLElement) {
    const tip = $('hud-tip'), x = this.cells.find(c => c.act === act && act);
    if (act && (!el || !el.isConnected)) el = $('hud-cmd').querySelector<HTMLElement>(`[data-act="${act}"]`) ?? el; // сетка перерисовалась
    this.tipAct = act;
    let html = '';
    if (x) {
      const lack = (n: number, have: number) => (n > have ? ' class="lack"' : '');
      const cost = [x.cost ? `<span${lack(x.cost, this.req)}>◆ ${x.cost} влияния</span>` : '', x.en ? `<span${lack(x.en, this.energy)}>ϟ ${x.en} энергии</span>` : '', x.rel ? `<span${lack(x.rel, this.relics)}>⌂ ${x.rel} реликв.</span>` : '', x.cdMax ? `<span>⧗ ${x.cdMax} с</span>` : ''].filter(Boolean).join('');
      html = `<p class="lc-tip__title"><strong>${x.name}</strong><kbd>${x.hot}</kbd></p>${cost ? `<p class="lc-tip__cost">${cost}</p>` : ''}<p class="lc-tip__body">${x.info ?? ''}</p>${x.req ? `<p class="lc-tip__req">${/^Нужн/.test(x.req) ? x.req : 'Нужно: ' + x.req}</p>` : ''}`;
    } else if (el?.dataset.tipname) html = `<p class="lc-tip__title"><strong>${el.dataset.tipname}</strong><kbd>${el.querySelector('kbd')?.textContent ?? ''}</kbd></p><p class="lc-tip__body">${el.dataset.tipinfo ?? ''}</p>`;
    tip.innerHTML = html;
    tip.classList.toggle('hidden', !html);
    if (el && html) { const r = el.getBoundingClientRect(), pr = $('hud-bottom').getBoundingClientRect(); tip.style.left = Math.min(innerWidth - 316, Math.max(8, r.left)) + 'px'; tip.style.bottom = innerHeight - pr.top + 8 + 'px'; }
  }
  private hideTip() { this.tipAct = ''; $('hud-tip').classList.add('hidden'); }

  private nextKey(): Buildable | null {
    const own = (k: Kind) => [...this.views.values()].some(v => v.owner === this.slot && v.kind === k);
    for (let t = 1; t <= Math.min(this.tier, 4); t++) if (!own(('key' + t) as Kind)) return ('key' + t) as Buildable;
    return this.tier >= 5 && !own('gate') ? 'gate' : null;
  }

  private doAct(act: string) {
    const sel = this.selected();
    if (act === 'amove' || act === 'move') { if (!sel.some(v => !isStruct(v.kind) && v.owner === this.slot)) return; this.amove = act === 'amove'; this.moveMode = act === 'move'; this.place = null; this.ghost.classList.add('hidden'); this.root.style.cursor = 'crosshair'; return; }
    if (act === 'stop') { if (this.sel.size) this.cmd({ c: 'stop', ids: [...this.sel] }); return; }
    if (act === 'buildmenu') { if (sel.some(v => v.kind === 'builder')) this.buildOpen = true; return; }
    if (act === 'cmdgrid') { this.buildOpen = false; return; }
    if (act === 'train') { const st = sel.find(v => isStruct(v.kind)); if (st) this.cmd({ c: 'train', id: st.id }); }
    else if (/^ab\d$/.test(act)) this.cmd({ c: 'ability', a: Number(act.slice(2)) });
    else if (act === 'tier') { const hq = sel.find(v => v.kind === 'hq'); if (hq) this.cmd({ c: 'upgrade', id: hq.id }); }
    else if (/^res[0-3]$/.test(act)) { const k = sel.find(v => /^key/.test(v.kind)); if (k) this.cmd({ c: 'research', id: k.id, r: Number(act[3]) }); }
    else if (/^sum[0-2]$/.test(act)) { const g = sel.find(v => v.kind === 'gate'); if (g) this.cmd({ c: 'summon', id: g.id, v: Number(act[3]) }); }
    else if (/^key[1-4]$|^gate$/.test(act)) { if (sel.some(v => v.kind === 'builder')) this.startPlace(act as Buildable); }
    else if (['barracks', 'post', 'turret', 'foundry', 'pump', 'wall', 'wallgate', 'bunker', 'mine'].includes(act)) { if (sel.some(v => v.kind === 'builder')) this.startPlace(act as Buildable); }
    else if (act === 'upgrade') { for (const v of sel) if ((UPGRADES[v.kind] && v.lvl < 2 || v.kind === 'post') && v.upg < 0) this.cmd({ c: 'upgrade', id: v.id }); }
    else if (act === 'reinforce') this.cmd({ c: 'reinforce', ids: sel.filter(v => v.kind === 'guard').map(v => v.id) });
  }

  private startPlace(k: Buildable) {
    this.place = k; this.amove = false;
    const r = k === 'post' ? POINT_R * 0.5 : STATS[k].radius + 0.6;
    Object.assign(this.ghost.style, { width: r * 2 * S + 'px', height: r * 1.1 * S + 'px' });
    this.root.style.cursor = 'copy';
    this.renderCmd();
  }
  private stopPlace() { this.wallStart = null; this.wallLine?.setAttribute('visibility', 'hidden'); this.place = null; this.ghost.classList.add('hidden'); this.root.style.cursor = ''; this.cmdHtml = ''; this.renderCmd(); }

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
      if (e.altKey && /^Digit[1-9]$/.test(e.code)) { e.preventDefault(); this.learn(Number(e.code[5]) - 1); return; } // Alt+N — дар уровня (на mac e.key с Alt другой)
      this.keys.add(k);
      const hit = /^[a-z]$/.test(k) && !this.buildOpen ? this.cells.find(c => c.act && c.hot.toLowerCase() === k) : undefined;
      if (hit) { this.doAct(hit.act); this.renderCmd(); return; } // клавиша ячейки сетки важнее общих
      if (k === 'a') this.doAct('amove');
      else if (k === 'm') this.doAct('move');
      else if (k === 'c') this.doAct('buildmenu');
      else if (k === 't') this.doAct('train');
      else if (k === 'b') this.doAct('barracks');
      else if (k === 'p') this.doAct('post');
      else if (k === 'y') this.doAct('turret');
      else if (k === 'f') this.doAct('foundry');
      else if (k === 'n') this.doAct('pump');
      else if (k === 'w') this.doAct('wall');
      else if (k === 'g') this.doAct('wallgate');
      else if (k === 'x') this.doAct('bunker');
      else if (k === 'v') this.doAct('mine');
      else if (k === 'k') { const n = this.nextKey(); if (n) this.doAct(n); }
      else if (/^[1-9]$/.test(k)) { const x = this.cells.find(c => c.hot === k && c.act); if (x) this.doAct(x.act); }
      else if (k === 'u') this.doAct('upgrade');
      else if (k === 'r') this.doAct('reinforce');
      else if (k === 's') this.doAct('stop');
      else if (k === ' ') { e.preventDefault(); this.selectOwn('captain'); }
      else if (k === 'h') this.selectOwn('hq');
      else if (k === 'escape') { if (this.place) this.stopPlace(); else if (this.buildOpen) this.buildOpen = false; else if (this.amove || this.moveMode) { this.amove = this.moveMode = false; cv.style.cursor = ''; } else this.sel.clear(); this.lastSelKey = [...this.sel].join(','); }
      this.renderCmd();
    }, sig);
    addEventListener('keyup', e => this.keys.delete(e.key.toLowerCase()), sig);
    $('hud-cap').addEventListener('click', () => { if (this.learnHtml) { this.lvlUpOpen = true; this.lvlUpAt = performance.now(); $('hud-levelup').classList.remove('hidden'); $('hud-cap').classList.remove('has-pts'); } }, sig);
    $('hud-levelup').addEventListener('click', e => { const a = (e.target as HTMLElement).closest<HTMLElement>('[data-learn]')?.dataset.learn; if (a) this.cmd({ c: 'learn', a: Number(a) }); }, sig);
    const hc = $('hud-cmd');
    hc.addEventListener('click', e => {
      const b = (e.target as HTMLElement).closest<HTMLElement>('button');
      if (!b) return;
      if (b.dataset.tab) { this.buildTab = Number(b.dataset.tab); this.renderCmd(); return; }
      if (b.dataset.act) this.doAct(b.dataset.act); // запертая ячейка тоже шлёт команду — сервер ответит, чего не хватает
      this.renderCmd();
    }, sig);
    let tipT = 0;
    hc.addEventListener('pointerover', e => { // подсказка через 250 мс после наведения
      const b = (e.target as HTMLElement).closest<HTMLElement>('[data-act]');
      clearTimeout(tipT);
      if (!b) return this.hideTip();
      tipT = window.setTimeout(() => this.showTip(b.dataset.act ?? '', b), 250);
    }, sig);
    hc.addEventListener('pointerleave', () => { clearTimeout(tipT); this.hideTip(); }, sig);
    $('hud-card').addEventListener('click', e => { const id = (e.target as HTMLElement).closest<HTMLElement>('[data-pick]')?.dataset.pick; if (id) { this.sel.clear(); this.sel.add(Number(id)); this.renderCmd(); } }, sig);
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

  private wallStart: { x: number; y: number } | null = null;

  private click(sx: number, sy: number, add: boolean) {
    if (this.place === 'wall') { // стена: первый клик — начало, второй — конец
      const p = this.toWorld(sx, sy), ids = this.selected().filter(v => v.kind === 'builder').map(v => v.id);
      if (!this.wallStart) { this.wallStart = p; return; }
      if (ids.length) this.cmd({ c: 'wall', ids, x1: this.wallStart.x, y1: this.wallStart.y, x2: p.x, y2: p.y });
      this.wallStart = null; this.wallLine.setAttribute('visibility', 'hidden');
      if (!add) this.stopPlace();
      return;
    }
    if (this.place) {
      const sp = this.placePoint(sx, sy), ids = this.selected().filter(v => v.kind === 'builder').map(v => v.id);
      if (sp && ids.length) this.cmd({ c: 'build', ids, kind: this.place, x: sp.x, y: sp.y });
      if (sp?.ok && !add) this.stopPlace();
      return;
    }
    if (this.amove || this.moveMode) {
      const c = this.amove ? 'amove' : 'move';
      this.amove = this.moveMode = false; this.root.style.cursor = '';
      const p = this.toWorld(sx, sy);
      if (this.sel.size) this.cmd({ c, ids: [...this.sel], x: p.x, y: p.y });
      this.renderCmd();
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
    if (['mine', 'wallgate', 'bunker'].includes(this.place ?? '')) return { ...g, ok: !vs.some(v => isStruct(v.kind) && v.kind !== 'mine' && Math.hypot(v.x - g.x, v.y - g.y) < STATS[v.kind].radius + STATS[this.place!].radius + 1) };
    if (this.place === 'turret' || this.place === 'foundry' || /^key|^gate/.test(this.place ?? '')) {
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
    { const k = 100 / MAP.w, w = (r.width / (S * c.zoom)) * k, h = (r.height / (S * c.zoom)) * k; this.miniCam.setAttribute('x', String(c.x * k - w / 2)); this.miniCam.setAttribute('y', String(c.y * k - h / 2)); this.miniCam.setAttribute('width', String(w)); this.miniCam.setAttribute('height', String(h)); }
    this.world.style.transform = `translate(${r.width / 2 - c.x * S * c.zoom}px, ${r.height / 2 - c.y * S * c.zoom}px) scale(${c.zoom})`;

    if (this.place === 'wall' && this.mouse && this.wallStart) { // пунктир протяжки и итоговая цена
      const p = this.toWorld(this.mouse.x, this.mouse.y), n = Math.min(16, Math.floor(Math.hypot(p.x - this.wallStart.x, p.y - this.wallStart.y) / WALL_STEP) + 1);
      for (const [k, v] of [['x1', this.wallStart.x], ['y1', this.wallStart.y], ['x2', p.x], ['y2', p.y]] as const) this.wallLine.setAttribute(k, String(v * S));
      this.wallLine.setAttribute('visibility', 'visible');
      this.ghost.classList.add('hidden');
      $('hud-sel').textContent = `${n} сегм. · ◆ ${n * STATS.wall.cost}`;
    } else if (this.place && this.mouse) {
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
        const anim = v.dead ? 'death' : building ? 'work' : now < v.atkUntil ? (v.kind === 'guard' && !v.melee ? 'recoil' : 'attack') : moving ? 'walk' : 'idle';
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
