// 2D-клиент матча на силуэтах дизайн-системы «Латунный Собор»: каждый юнит и здание — живой SVG из ds/assets,
// окрашенный палитрой art-* и анимированный классами lc-anim-* из bundle.css. Правил игры здесь нет: только снимки сервера и ввод.
import type { Arch } from '../shared/sim.ts';
import { isMelee, ROLES, GEAR, SQUADS, VEHICLES, LEGION_CAP, producible, ABILITIES, MAX_LVL, canLearn, xpNeed, CAP, ENERGY_COST, LEGEND_COST, POST_UP, WALL_STEP, RAGE_MAX, RESEARCH, RESEARCH_INFO, TIER_UP, researchCost, trainCost, KINDS, MAP, POINTS, POINT_R, REINFORCE_COST, RELICS, STATS, UPGRADES, VENTS, isStruct, maxHp, members, type Buildable, type Cmd, type Kind, type Snap } from '../shared/sim.ts';
import { CAPTAIN_ART, FACTIONS, ROSTER, type FactionId } from '../shared/factions.ts';
import type { LobbyPlayer } from '../shared/protocol.ts';
import { audio } from './audio.ts';
import { paintMap } from './mappaint.ts';
import { voice } from './voice.ts';

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
const GEAR_ICON = [
  ico('<circle cx="12" cy="14" r="6" fill="currentColor"/><path d="M12 8V4h3" fill="none" stroke="currentColor" stroke-width="2"/>'),
  ico('<rect x="5" y="9" width="14" height="10" fill="currentColor"/><path d="M12 9V4M9 4h6" fill="none" stroke="currentColor" stroke-width="2"/>'),
  ico('<circle cx="8" cy="14" r="4" fill="currentColor"/><circle cx="15" cy="12" r="5" fill="currentColor" opacity=".7"/><circle cx="12" cy="8" r="3" fill="currentColor" opacity=".5"/>'),
];
const KIND_NAME: Partial<Record<Kind, string>> = { battery: 'Орган-батарея', pylon: 'Гаусс-пилон', pyre: 'Огненная яма', bell: 'Колокол Скорби', deity: 'Бог-Механизм', aegis: 'Купол-эгида', rturret: 'Ракетная бочка', fturret: 'Огнемётная печь', hq: 'Штаб', barracks: 'Казарма', post: 'Реликварий', turret: 'Турель', foundry: 'Литейня', pump: 'Глубинный насос', wall: 'Стена', wallgate: 'Ворота', bunker: 'Крипта-бункер', mine: 'Мина' };
const hex = (c: number) => '#' + c.toString(16).padStart(6, '0');
export const SLOT_COLORS = [0x4fa392, 0xe0675c, 0xe0a53a, 0xb9c3c6];

// какой силуэт из пресетов у какого юнита, его ширина в мире и сколько бойцов в отряде
// ширина силуэта в мире (единиц симуляции); сами силуэты — по фракции игрока (shared/factions.ts)
const WIDTH: Record<string, number> = { battery: 4.4, pylon: 3.4, pyre: 3.8, bell: 3.8, deity: 9, aegis: 3.2, rturret: 3.6, fturret: 3.6, captain: 3.2, builder: 2.3, guard: 2.4, hq: 11, barracks: 8, post: 4.2, turret: 3.6, foundry: 6.5, pump: 4.4, key1: 6, key2: 6.5, key3: 6.5, key4: 7, gate: 9, legend: 4.4, wall: 3.4, wallgate: 4.6, bunker: 5.5, mine: 1.6 };
/** Ширина силуэта на карте = рост в метрах (все силуэты дизайн-системы в одном поле 120×164): Стражник 2.4 м, титан — 26–34 м. */
const widthOf = (kind: Kind, f: FactionId) => (kind === 'titan' ? ROSTER[f].titanM : ROLES[kind]?.meters && !WIDTH[kind] ? ROLES[kind]!.meters : WIDTH[kind] ?? 2.4);
const NEUTRAL: Partial<Record<Kind, [string, string]>> = {
  battery: ['Defenses/battery.svg', 'Defenses/battery.svg'], pylon: ['Turrets/clockwork-t2.svg', 'Turrets/clockwork-t2.svg'], pyre: ['Turrets/ashen-t2.svg', 'Turrets/ashen-t2.svg'], bell: ['Buildings/beacon.svg', 'Buildings/beacon.svg'],
  aegis: ['Defenses/shieldgen.svg', 'Defenses/shieldgen.svg'], rturret: ['Defenses/rocketbarrel.svg', 'Defenses/rocketbarrel.svg'], fturret: ['Turrets/orks-t2.svg', 'Turrets/orks-t2.svg'],
  wall: ['Defenses/wall.svg', 'Defenses/wall.svg'], wallgate: ['Defenses/gate.svg', 'Defenses/gate.svg'], bunker: ['Defenses/bunker.svg', 'Defenses/bunker.svg'], mine: ['Defenses/mine.svg', 'Defenses/mine.svg'],
  key1: ['Buildings/scriptorium.svg', 'Buildings/scriptorium.svg'], key2: ['Buildings/forge.svg', 'Buildings/forge.svg'], key3: ['Buildings/observatory.svg', 'Buildings/observatory.svg'],
  key4: ['Buildings/reliqhall.svg', 'Buildings/reliqhall.svg'], gate: ['Buildings/gate.svg', 'Buildings/gate.svg'], post: ['Defenses/point-1.svg', 'Defenses/point-2.svg'], foundry: ['Buildings/foundry.svg', 'Buildings/foundry.svg'], pump: ['Buildings/pump.svg', 'Buildings/pump.svg'] };
/** Путь к силуэту юнита: по фракции, уровню и (у капитана) оружию. */
export function artFor(kind: Kind, faction: FactionId, lvl = 1, arch: Arch = 'commander', variant = 0) {
  const a = FACTIONS[faction].art;
  if (kind === 'legend') return FACTIONS[faction].legendArt[variant] ?? FACTIONS[faction].legendArt[0];
  if (kind === 'deity') return 'Factions/deity.svg';
  if (kind in ROSTER[faction] && typeof (ROSTER[faction] as Record<string, unknown>)[kind] === 'object') return ROSTER[faction][kind as 'sniper'].art;
  if (kind === 'captain') return CAPTAIN_ART[faction][arch] ?? a.captain[0];
  if (kind === 'turret') return a.turret[lvl > 1 ? 1 : 0];
  if (kind === 'post') return lvl >= 3 ? 'Defenses/point-3.svg' : lvl === 2 ? 'Defenses/point-2.svg' : 'Defenses/point-1.svg';
  if (NEUTRAL[kind]) return NEUTRAL[kind]![lvl > 1 ? 1 : 0];
  return a[kind as 'builder' | 'guard' | 'hq' | 'barracks'];
}
const FORM: Partial<Record<Kind, [number, number][]>> = {
  guard: [[0.8, 0.1], [0, -0.5], [0, 0.6], [-0.8, -0.2], [-0.8, 0.7]], // плотный строй, как в карточке LivingSquads
  sniper: [[0.4, -0.3], [-0.5, 0.4]], heavy: [[0.7, 0], [-0.2, -0.6], [-0.4, 0.6]], support: [[0.3, -0.3], [-0.4, 0.4]], elite: [[0.8, 0], [-0.3, -0.7], [-0.4, 0.7]],
  builder: [[0.3, -0.4], [-0.3, 0.4]],
};

const svgCache = new Map<string, string>();
/** Загружает все силуэты один раз. */
const ALL_ART = new Set([...Object.values(CAPTAIN_ART).flatMap(o => Object.values(o)), 'Factions/deity.svg', ...Object.values(ROSTER).flatMap(r => Object.values(r).flatMap(v => (typeof v === 'object' ? [v.art] : []))), ...Object.values(FACTIONS).flatMap(f => [...f.legendArt, ...f.art.captain, f.art.builder, f.art.guard, f.art.hq, f.art.barracks, ...f.art.turret]), ...Object.values(NEUTRAL).flat(), 'Defenses/point-3.svg', 'Buildings/reliquary.svg']);
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
export const captainSvg = (a: Arch, f: FactionId = 'order') => svgCache.get(artFor('captain', f, 1, a)) ?? '';
/** Чужой силуэт (Ордена) у другой фракции — перекрасить в её цвета. */
export const needsTint = (path: string, f: FactionId) => f !== 'order' && path.startsWith('Units/');
/** Маленький силуэт для HUD: живой SVG, чтобы палитра art-* применилась. */
const miniArt = (path: string) => (svgCache.get(path) ?? '').replace('<svg ', '<svg class="lc-art" ');

/** Карта на языке пресета MapExample (классы lc-bigmap из bundle.css), в координатах мира. Пока декор: проходимость не меняет. */
function mapSvg() {
  const k = S, W = MAP.w * k, H = MAP.h * k, P = (x: number, y: number) => `${x * k} ${y * k}`;
  const diamond = (x: number, y: number, r = 1.2) => `M${P(x, y - r)}L${P(x + r, y)}L${P(x, y + r)}L${P(x - r, y)}Z`;
  const star = (x: number, y: number, r: number) => { let d = ''; for (let i = 0; i < 16; i++) { const a = (i / 16) * Math.PI * 2, rr = i % 2 ? r * 0.55 : r; d += (i ? 'L' : 'M') + P(x + Math.sin(a) * rr, y - Math.cos(a) * rr); } return d + 'Z'; };
  const letters = ['Д', 'А', 'В', 'Б', 'Г', 'Е', 'Ж'];
  const pts = POINTS.map(([x, y], i) => i === 0
    ? `<path class="pt-crit" d="${star(x, y - POINT_R - 2.2, 1.6)}"/><text class="t t-on" x="${x * k}" y="${(y - POINT_R - 1.8) * k}" style="font-size:22px">II</text>`
    : `<path class="pt-inf" d="${diamond(x, y - POINT_R - 2)}"/><text class="t" x="${x * k}" y="${(y - POINT_R - 1.6) * k}" style="font-size:22px">${letters[i]}</text>`).join('');
  return `<svg class="lc-bigmap" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" style="position:absolute;left:0;top:0;pointer-events:none;background:none">${pts}</svg>`; // метки точек поверх текстуры
}

type View = {
  id: number; owner: number; kind: Kind; el: HTMLElement; body: HTMLElement; svgs: SVGElement[]; bar: HTMLElement; fg: HTMLElement; sel: HTMLElement;
  x: number; y: number; tx: number; ty: number; f: number; hp: number; build: number; q: number; dead: boolean; lvl: number; upg: number;
  atkUntil: number; melee?: boolean; aim?: number; gear: number; ch: number[]; gcd: number; sh: number; frozen: number; carry: number; rise: number; off: boolean; dome?: HTMLElement; shBar?: HTMLElement; artPath: string; prog: number; prod: number;
};

export class Game {
  private world = document.createElement('div');
  private ground = document.createElement('div');
  private fx = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  private views = new Map<number, View>();
  private sel = new Set<number>();
  private cam = { x: 50, y: 50, zoom: 1 };
  private keys = new Set<string>();
  private points: { ring: HTMLElement; fill: HTMLElement; el: HTMLElement; zone: HTMLElement }[] = [];
  private pointOwner: number[] = [];
  private shots: { el: SVGElement; until: number }[] = [];
  private ghost = document.createElement('div');
  private wallLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  private place: Buildable | null = null;
  private drag: { x0: number; y0: number; x1: number; y1: number } | null = null;
  private mouse: { x: number; y: number } | null = null;
  private amove = false;
  private moveMode = false;
  private throwG = -1;
  private stopCd = 0;
  private fogCv = document.createElement('canvas');
  private miniFog = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  private mapTex: HTMLCanvasElement | null = null;
  private aimRing = document.createElement('div');
  private qk: Record<number, number[]> = {};
  private smokes: HTMLElement[] = [];
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
    document.body.classList.toggle('spectating', slot < 0); // режим просмотра: без тумана и команд
    if (slot < 0) { this.cam.x = MAP.w / 2; this.cam.y = MAP.h / 2; this.cam.zoom = 0.6; this.centered = true; }
    this.world.className = 'w2d-world';
    this.ground.className = 'w2d-ground';
    Object.assign(this.ground.style, { width: MAP.w * S + 'px', height: MAP.h * S + 'px' });
    this.fx.classList.add('w2d-fx');
    this.fx.setAttribute('width', String(MAP.w * S)); this.fx.setAttribute('height', String(MAP.h * S));
    this.ghost.className = 'w2d-ghost hidden';
    this.wallLine.classList.add('w2d-wallline');
    this.wallLine.setAttribute('visibility', 'hidden');
    this.fx.append(this.wallLine);
    this.fogCv.width = this.fogCv.height = 320; this.fogCv.className = 'w2d-fog';
    Object.assign(this.fogCv.style, { width: MAP.w * S + 'px', height: MAP.h * S + 'px' });
    this.aimRing.className = 'w2d-aim'; this.aimRing.style.display = 'none';
    this.world.append(this.ground, this.fogCv, this.fx, this.ghost, this.aimRing);
    root.prepend(this.world);
    this.buildMap();
    this.buildMini();
    this.bind();
    this.raf = requestAnimationFrame(this.frame);
    audio.setBattle(true);
    $('hud-players').innerHTML = players.map((p, i) => `<div id="hp${i}"><i style="background:${hex(SLOT_COLORS[i])}"></i>${p.name.replace(/[<>&]/g, '')}</div>`).join('');
  }

  destroy() {
    document.body.classList.remove('spectating');
    audio.setBattle(false);
    cancelAnimationFrame(this.raf);
    this.ac.abort();
    this.world.remove();
    this.root.classList.remove('w2d');
  }

  // ---------- карта ----------
  private buildMap() {
    const tex = (this.mapTex = paintMap()); // пиксельная текстура земли, растянутая вдвое без сглаживания
    Object.assign(tex.style, { position: 'absolute', left: '0', top: '0', width: MAP.w * S + 'px', height: MAP.h * S + 'px', imageRendering: 'pixelated' });
    this.ground.append(tex);
    this.ground.insertAdjacentHTML('beforeend', mapSvg());
    [...POINTS, ...RELICS].forEach(([x, y], i) => {
      const relic = i >= POINTS.length;
      const ring = document.createElement('div'), fill = document.createElement('div');
      ring.className = 'w2d-point'; fill.className = 'w2d-point-fill';
      for (const e of [ring, fill]) Object.assign(e.style, { left: (x - POINT_R) * S + 'px', top: (y - POINT_R) * S + 'px', width: POINT_R * 2 * S + 'px', height: POINT_R * 2 * S + 'px' });
      const el = this.place2(art(relic ? 'Buildings/reliquary.svg' : 'Defenses/point-3.svg', (relic ? 5 : 3.6) * S), x, y); // реликварий / знаменный столп
      el.classList.add('w2d-neutral');
      ring.classList.toggle('relic', relic);
      this.ground.append(ring, fill);
      const zone = document.createElement('div'); zone.className = 'w2d-zone' + (i === 0 ? ' crit' : ''); // территория точки: тут ставят турели и генераторы
      const zr = i === 0 ? 12 : 14;
      Object.assign(zone.style, { left: (x - zr) * S + 'px', top: (y - zr) * S + 'px', width: zr * 2 * S + 'px', height: zr * 2 * S + 'px' });
      this.ground.insertBefore(zone, ring);
      this.points.push({ ring, fill, el, zone });
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
    const pl = this.players[owner], artPath = artFor(kind, pl.faction ?? 'order', 1, pl.captain.arch, variant);
    const svgs: SVGElement[] = [];
    for (const [ox, oy] of FORM[kind] ?? [[0, 0]]) {
      const a = art(artPath, widthOf(kind, pl.faction ?? 'order') * S);
      if (ROSTER[pl.faction ?? 'order'][kind as 'sniper']?.tint || (kind === 'captain' && needsTint(artPath, pl.faction ?? 'order'))) a.style.filter = ROSTER[pl.faction ?? 'order'].tint; // чужой силуэт в цветах фракции
      a.style.transform = `translate(${ox * S}px, ${oy * S * 0.6}px)`;
      body.append(a);
      svgs.push(a.querySelector('svg')!);
    }
    if (kind === 'captain') el.style.setProperty('--art-brass', hex(this.players[owner].captain.armor)); // кастомизация: броня капитана
    if (kind === 'captain') el.style.setProperty('--art-brass-lit', hex(this.players[owner].captain.trim));
    const bar = document.createElement('div'); bar.className = 'lc-vitals w2d-bar';
    const fg = document.createElement('div'); fg.className = 'lc-vitals__bar'; bar.append(fg);
    bar.style.width = Math.max(40, Math.min(widthOf(kind, pl.faction ?? 'order'), 9) * S * (isStruct(kind) ? 0.7 : 1)) + 'px';
    if (kind === 'titan') { bar.style.bottom = widthOf(kind, pl.faction ?? 'order') * 1.36 * S + 'px'; el.classList.add('titan'); } // полоса над головой титана
    el.append(ring, sel, body, bar);
    this.place2(el, x, y);
    return { id, owner, kind, el, body, svgs, bar, fg, sel, x, y, tx: x, ty: y, f: 0, hp: maxHp(kind), build: 1, q: 0, dead: false, lvl: 1, upg: -1, atkUntil: 0, artPath, prog: 0, prod: 0, gear: 0, ch: [0, 0, 0], gcd: 0, sh: 0, frozen: 0, carry: 0, rise: 0, off: false };
  }

  onSnap(s: Snap) {
    const seen = new Set<number>(), first = this.snapN++ === 0, now = performance.now();
    this.qk = s.qk ?? {};
    if (this.slot >= 0) this.renderScore(s);
    this.drawSmoke(s.sm ?? []);
    this.stopCd = s.ps?.[this.slot]?.[0] ?? 0;
    for (const [id, owner, ki, x, y, hp, face, q, bp, , lvl, upg, prog, gear, c0, c1, c2, gcd, sh, frozen, carry, rise, off] of s.u) {
      const kind = KINDS[ki];
      if (kind === 'mine' && owner !== this.slot) continue; // чужие мины невидимы
      seen.add(id);
      let v = this.views.get(id);
      v?.el.classList.remove('ghost');
      if (!v) {
        this.views.set(id, (v = this.mk(id, owner, kind, x / 10, y / 10, q)));
        if (kind === 'legend') v.el.classList.add('legend');
        if (!first && owner === this.slot && !isStruct(kind)) { audio.trained(); voice.say(this.fac(), kind, 'ready'); }
        if (!first && kind === 'titan') { voice.announce(owner === this.slot ? 'Титан вышел на поле боя.' : 'Внимание! Вражеский титан!'); this.alert(owner === this.slot ? 'ok' : 'danger', 'Титан на поле', this.kindName('titan', this.fac(owner)), x / 10, y / 10); this.shakeBy(12); }
      } else if (owner === this.slot) {
        if (v.build < 1 && bp >= 100) { audio.built(); this.alert('ok', 'Постройка готова', this.nameOf(v), v.tx, v.ty); }
        if (kind === 'captain' && v.hp > 0 && hp <= 0) { audio.alarm(); this.alert('danger', 'Капитан пал', 'возродится в штабе', x / 10, y / 10); }
        else if (hp < v.hp && now - this.lastAlert > 8000) { this.lastAlert = now; audio.alarm(); if (isStruct(kind)) voice.announce('Наша база атакована.'); else voice.say(this.fac(), kind, 'hurt'); this.pingMini(x / 10, y / 10); this.alert('danger', 'Нас атакуют', this.nameOf(v), x / 10, y / 10); }
      }
      v.tx = x / 10; v.ty = y / 10; v.f = face / 100; v.hp = hp; v.q = q; v.build = bp / 100; v.dead = hp <= 0;
      const lvlArt = artFor(kind, this.players[owner].faction ?? 'order', lvl, this.players[owner].captain.arch, kind === 'legend' ? q : 0);
      if (lvl !== v.lvl && lvlArt !== v.artPath) { // апгрейд: новый силуэт уровня 2
        v.artPath = lvlArt;
        const a = art(lvlArt, widthOf(kind, this.players[owner].faction ?? 'order') * S * 1.1);
        v.body.replaceChildren(a); v.svgs = [a.querySelector('svg')!];
      }
      v.lvl = lvl; v.upg = upg; v.prog = prog ?? 0; v.prod = prog ?? 0; v.gear = gear ?? 0; v.ch = [c0 ?? 0, c1 ?? 0, c2 ?? 0]; v.gcd = gcd ?? 0;
      if (v.kind !== kind) { v.kind = kind; v.artPath = artFor(kind, this.fac(owner)); const a = art(v.artPath, widthOf(kind, this.fac(owner)) * S); v.body.replaceChildren(a); v.svgs = [a.querySelector('svg')!]; if (kind === 'deity') { this.alert(owner === this.slot ? 'ok' : 'danger', 'Вознесение', 'Бог-Механизм пробудился', x / 10, y / 10); voice.announce(owner === this.slot ? 'Бог-Механизм пробудился.' : 'Враг вознёсся! Бог-Механизм на поле!'); this.shakeBy(14); } } // капитан ⇄ Бог-Механизм
      v.sh = sh ?? 0; v.frozen = frozen ?? 0; v.carry = carry ?? 0; v.rise = (rise ?? 0) / 10; v.off = off === 1;
      if (kind === 'hq' && owner === this.slot && !this.centered) {
        this.centered = true;
        this.cam.x = v.tx + (MAP.w / 2 - v.tx) * 0.25; this.cam.y = v.ty + (MAP.h / 2 - v.ty) * 0.25;
      }
    }
    let gone = 0;
    const died = new Set(s.d ?? []);
    for (const [id, v] of this.views) if (!seen.has(id)) {
      if (v.owner !== this.slot && !died.has(id)) { // ушёл в туман войны, а не погиб
        if (isStruct(v.kind) && !this.inSight(v.x, v.y)) { v.el.classList.add('ghost'); continue; } // здание — призрак последнего увиденного
        this.views.delete(id); this.sel.delete(id); v.el.remove(); v.dome?.remove(); continue;
      }
      // гибель: падение и пепел, потом исчезает
      this.views.delete(id); this.sel.delete(id); v.dome?.remove();
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
      p.zone.style.setProperty('--team', col); p.zone.classList.toggle('owned', owner >= 0); p.zone.classList.toggle('mine', owner === this.slot);
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
    else if (fx === 5) g.innerHTML = [-5, 5].map(o => `<line class="w2d-thrust" x1="${X2 - 26 * dir}" y1="${Y2 + o}" x2="${X2 + 6 * dir}" y2="${Y2 + o}"/>`).join('') + `<circle class="w2d-spark" cx="${X2 + 4 * dir}" cy="${Y2}" r="3"/>`;
    else if (fx === 6) g.innerHTML = this.sparks(X2, Y2 - 10, 5, '#ffd38a', 10); // сварка: ремонт
    else if (fx === 15) { const hx = X1 + (X2 - X1) * 0.85, hy = (y1 - 2) * S + ((y2 - 1) * S - (y1 - 2) * S) * 0.85; g.innerHTML = `<path class="w2d-hex" d="M${hx - 10} ${hy}l5 -9h10l5 9l-5 9h-10z"/>`; } // попадание по куполу: вспышка гексагона
    else if (fx === 16) g.innerHTML = `<rect class="w2d-pillar" x="${X1 - S}" y="${Y1 - 14 * S}" width="${2 * S}" height="${15 * S}"/>` + this.sparks(X1, Y1, 10, '#ffe9a8', 2 * S); // Архангел поднимает бойца
    else if (fx === 17) g.innerHTML = `<circle class="w2d-timestop" cx="${X1}" cy="${Y1}" r="${12 * S}"/><line class="w2d-clockhand" x1="${X1}" y1="${Y1}" x2="${X1}" y2="${Y1 - 10 * S}"/>`; // Остановка времени
    else if (fx === 7) g.innerHTML = `<path class="w2d-arc" d="M${X1} ${Y1} Q${(X1 + X2) / 2} ${Math.min(Y1, Y2) - 120} ${X2} ${Y2 + S}"/>`; // навесной бросок
    else if (fx === 8) g.innerHTML = `<circle class="w2d-boom" cx="${X1}" cy="${Y1 + S}" r="${4 * S}"/><circle class="w2d-boomcore" cx="${X1}" cy="${Y1 + S}" r="${1.6 * S}"/>` + this.sparks(X1, Y1 + S, 14, '#f0a540', 3 * S);
    else if (fx === 9) g.innerHTML = [0, 1, 2, 3, 4].map(i => `<circle class="w2d-puff" cx="${X1 + Math.cos(i * 1.3) * 2 * S}" cy="${Y1 + S + Math.sin(i * 1.3) * S}" r="${2.4 * S}" style="animation-delay:${i * 60}ms"/>`).join('');
    else if (fx === 10) g.innerHTML = `<line class="w2d-snipe" x1="${X1}" y1="${Y1}" x2="${X2}" y2="${Y2}"/><circle class="w2d-muzzle" cx="${X1}" cy="${Y1}" r="7"/>` + this.sparks(X2, Y2, 6, '#ffffff', 18);
    else if (fx === 11) g.innerHTML = `<line class="w2d-las" x1="${X1}" y1="${Y1}" x2="${X2}" y2="${Y2}"/><circle class="w2d-boomcore" cx="${X2}" cy="${Y2}" r="${0.9 * S}"/>` + this.sparks(X2, Y2, 9, '#9fe8ff', 26);
    else if (fx === 12) g.innerHTML = `<path class="w2d-shell" d="M${X1} ${Y1 - 20} Q${(X1 + X2) / 2} ${Math.min(Y1, Y2) - 160} ${X2} ${Y2}"/><circle class="w2d-boom late" cx="${X2}" cy="${Y2}" r="${2.6 * S}"/>` + this.sparks(X2, Y2, 12, '#f0a540', 2 * S, 220);
    else if (fx === 13) g.innerHTML = `<line class="w2d-titanbeam" x1="${X1}" y1="${Y1 - 20 * S}" x2="${X2}" y2="${Y2}"/><circle class="w2d-boom" cx="${X2}" cy="${Y2}" r="${7 * S}"/><circle class="w2d-boomcore" cx="${X2}" cy="${Y2}" r="${3 * S}"/>` + this.sparks(X2, Y2, 24, '#ffd38a', 6 * S);
    else g.innerHTML = [0, 1, 2].map(i => `<line class="w2d-tracer" x1="${X1}" y1="${Y1 + i * 3}" x2="${X2 + (i - 1) * 6}" y2="${Y2 + (i - 1) * 4}" style="animation-delay:${i * 50}ms"/>`).join('') + this.sparks(X2, Y2, 4, '#ffd38a', 10); // очередь
    if (fx === 0 || fx === 14) g.innerHTML += this.sparks(X2, Y2, 3, '#ffe2a0', 8);
    this.fx.append(g);
    const target = fx === 7 || fx === 8 || fx === 9 ? undefined : this.nearest(x2, y2);
    if (target && fx !== 6) this.hitFlash(target, fx, X2 - X1);
    if (fx === 8 || fx === 12 || fx === 13) this.shakeBy(fx === 13 ? 14 : fx === 12 ? 6 : 5);
    const life = ({ 15: 300, 16: 1200, 17: 1600, 0: 160, 3: 420, 7: 900, 8: 600, 9: 1400, 10: 260, 11: 380, 12: 900, 13: 700, 14: 220 } as Record<number, number | undefined>)[fx] ?? 340;
    this.shots.push({ el: g, until: now + life });
  }

  private shake(px: number) {
    this.world.animate([{ translate: `${px}px 0` }, { translate: `${-px}px ${px / 2}px` }, { translate: '0 0' }], { duration: 260, composite: 'add' });
  }

  // ---------- мини-карта (пресет Minimap): квадраты — свои, треугольники — враги, ромбы — точки ----------
  private buildMini() {
    const svg = $('mini-svg') as unknown as SVGSVGElement;
    const thumb = document.createElement('canvas'); thumb.width = thumb.height = 200; // мини-карта — уменьшенная текстура той же карты
    thumb.getContext('2d')!.drawImage(this.mapTex!, 0, 0, 200, 200);
    svg.innerHTML = `<image href="${thumb.toDataURL()}" width="100" height="100" style="image-rendering:pixelated"/>`
      + VENTS.map(([x, y]) => `<circle cx="${(x / MAP.w) * 100}" cy="${(y / MAP.h) * 100}" r="1.5" fill="var(--amber-500)" opacity=".8"/>`).join('');
    this.miniCam.classList.add('cam'); this.miniPing.classList.add('ping', 'lc-ping'); this.miniPing.setAttribute('r', '4'); this.miniPing.style.display = 'none';
    const ns = 'http://www.w3.org/2000/svg', defs = document.createElementNS(ns, 'defs'), mask = document.createElementNS(ns, 'mask'), veil = document.createElementNS(ns, 'rect');
    mask.id = 'mini-fog'; mask.innerHTML = '<rect width="100" height="100" fill="#fff"/>'; mask.append(this.miniFog); defs.append(mask);
    Object.entries({ width: '100', height: '100', mask: 'url(#mini-fog)', fill: 'rgba(6,5,9,.65)' }).forEach(([k, v]) => veil.setAttribute(k, v));
    svg.append(defs, veil, this.mini, this.miniCam, this.miniPing);
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
  /** Мини-портреты в левом верхнем углу: капитан (всегда) и титан (пока на поле). Клик — выбрать и навести камеру. */
  private portraits() {
    const own = (k: Kind) => [...this.views.values()].find(v => v.owner === this.slot && v.kind === k);
    const cap = own('captain') ?? own('deity'), port = $('cap-port');
    if (cap) {
      const key = cap.artPath + (cap.dead ? 'd' : '');
      if (port.dataset.k !== key) { port.dataset.k = key; port.innerHTML = miniArt(cap.artPath) + '<i></i><span class="t hidden"></span>'; if (needsTint(cap.artPath, this.fac())) (port.firstElementChild as HTMLElement).style.filter = ROSTER[this.fac()].tint; }
      port.classList.toggle('dead', cap.dead);
      (port.querySelector('i') as HTMLElement).style.setProperty('--v', Math.max(0, cap.hp / maxHp(cap.kind)) * 100 + '%');
      const t = port.querySelector('.t') as HTMLElement; t.classList.toggle('hidden', !cap.dead); t.textContent = 'пал';
    }
    const ti = own('titan'), box = $('hud-titan');
    box.classList.toggle('hidden', !ti);
    if (ti) {
      if (box.dataset.id !== String(ti.id)) { box.dataset.id = String(ti.id); box.innerHTML = `<button class="w2d-port" id="titan-port" title="Титан: клик — выбрать и навести камеру">${miniArt(ti.artPath)}<i></i></button><div><b>${this.kindName('titan', this.fac())}</b><small id="titan-hp"></small></div>`; $('titan-port').onclick = () => this.focus(ti.id); }
      (box.querySelector('i') as HTMLElement).style.setProperty('--v', Math.max(0, ti.hp / maxHp('titan')) * 100 + '%');
      $('titan-hp').textContent = `${Math.round(ti.hp)} / ${maxHp('titan')}`;
    }
  }
  private focus(id: number) { const v = this.views.get(id); if (!v) return; this.sel.clear(); this.sel.add(id); this.cam.x = v.x; this.cam.y = v.y; this.renderCmd(); }

  private capHud(me: number[]) {
    this.portraits();
    const c = this.cap;
    const [lvl, xp, pts, abil] = [me[9] ?? 1, me[10] ?? 0, me[11] ?? 0, me[12] ?? 0];
    if (lvl > c.lvl && this.snapN > 2) { audio.built(); this.alert('ok', `Ранг ${lvl}`, 'дар: клик по ромбу уровня или Alt+1–3'); const v = [...this.views.values()].find(u => u.owner === this.slot && u.kind === 'captain'); v?.el.animate([{ filter: 'drop-shadow(0 0 0 var(--gilt-300))' }, { filter: 'drop-shadow(0 0 22px var(--gilt-300))' }, { filter: 'none' }], { duration: 900 }); }
    Object.assign(c, { lvl, xp, pts, abil, cd: me.slice(13) });
    $('cap-lvl').textContent = String(lvl);
    $('cap-xp').style.setProperty('--xp', lvl >= MAX_LVL ? '100%' : `${(xp / xpNeed(lvl)) * 100}%`);
    $('cap-xpt').textContent = lvl >= MAX_LVL ? 'ур. 10 · предел' : `ур. ${lvl} → ${lvl + 1} · ${xp} / ${xpNeed(lvl)}`;
    const fake = { abil, pts, clvl: lvl, tier: this.tier } as Parameters<typeof canLearn>[0];
    const open = ABILITIES.map((a, i) => ({ ...a, i })).filter(a => !canLearn(fake, a.i));
    const html = pts > 0 && open.length ? `<p class="lc-levelup__rank">Ранг ${lvl}</p><p class="lc-levelup__sub">Выберите дар · очков: ${pts}</p><div class="lc-choices">`
      + open.map((a, n) => `<button class="lc-choice" data-learn="${a.i}"><kbd>Alt+${n + 1}</kbd><strong>${a.name}</strong><span>${a.info}${a.cd ? ` · <em>перезарядка ${a.cd} с</em>` : ' · <em>пассивная</em>'}</span></button>`).join('') + '</div>' : '';
    if (html !== this.learnHtml) { this.learnHtml = html; $('hud-levelup').innerHTML = html; if (!html) this.lvlUpOpen = false; } // окно не всплывает само: открывается кликом по ромбу уровня
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
    if (this.slot < 0) { this.specHud(s); return; }
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
    let pop = 0; for (const u of s.u) if (u[1] === this.slot) pop += ROLES[KINDS[u[2]]]?.pop ?? 0;
    for (const q of Object.values(s.qk ?? {})) for (const k of q) pop += ROLES[KINDS[k]]?.pop ?? 0;
    $('hud-squads').textContent = `${pop}/${LEGION_CAP + (this.research & (1 << 12) ? 6 : 0)}`; void guards;
    $('hud-sel').textContent = this.sel.size ? `Выбрано: ${this.sel.size}` : '';
    $('hud-dead').classList.toggle('hidden', !dead);
    s.pl.forEach(([, alive], i) => document.getElementById('hp' + i)?.classList.toggle('dead', !alive));
    this.renderQueue();
    this.drawFog();
    this.renderCmd();
  }

  /** Очередь производства: что сейчас нанимается в каждом здании и сколько ждёт следом. */
  private renderQueue() {
    const items: string[] = [], f = this.fac();
    for (const v of this.views.values()) {
      const q = this.qk[v.id];
      if (v.owner !== this.slot || !q?.length) continue;
      q.forEach((ki, i) => { const k = KINDS[ki]; items.push(`<div class="w2d-qitem${i ? '' : ' now'}" title="${this.kindName(k, f)}">${miniArt(artFor(k, f))}${i ? '' : `<span class="w2d-qbar" style="--v:${v.prog}%"></span>`}</div>`); });
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
    if (this.fac() === 'undead' && en > this.energy) { cost += en - Math.max(0, this.energy); en = Math.max(0, this.energy); } // Нежить: недостающая энергия — влиянием
    return { cost, en, rel, ok: this.req >= cost && this.energy >= en && this.relics >= rel };
  }

  private kindName(k: Kind, f: FactionId) {
    const F = FACTIONS[f], R = ROSTER[f] as unknown as Record<string, { name: string } | undefined>;
    return k === 'builder' ? F.builder : k === 'guard' ? F.guard : R[k]?.name ?? KIND_NAME[k] ?? k;
  }
  private nameOf(v: View) {
    const F = FACTIONS[this.fac(v.owner)];
    if (v.kind === 'captain') return this.players[v.owner]?.name ?? 'Капитан';
    if (v.kind === 'builder') return F.builder;
    if (v.kind === 'guard') return F.guard;
    if (v.kind === 'legend') return F.legends[v.q] ?? 'Легенда';
    if (/^key[1-4]$/.test(v.kind)) return F.keys[Number(v.kind[3]) - 1];
    if (v.kind === 'gate') return F.gate;
    return this.kindName(v.kind, this.fac(v.owner));
  }

  /** Команды выбранного: фиксированная раскладка — верхний ряд движение/стоп/атака, ниже постройка и способности. */
  private buildCells(sel: View[]): Cell[] {
    const F = FACTIONS[this.fac()], R = ['I', 'II', 'III', 'IV', 'V'], c: Cell[] = [];
    const st = sel.length === 1 && isStruct(sel[0].kind) ? sel[0] : null;
    const own = (k: Kind) => [...this.views.values()].some(v => v.owner === this.slot && v.kind === k);
    if (st) {
      if (st.build < 1) return [{ act: '', name: 'Возводится', hot: '', icon: ICON.build, prog: Math.round(st.build * 100), info: 'Отправьте строителей: выберите их и ПКМ по стройке.' }];
      const free = this.fac() === 'undead' && this.lastRemains >= 5;
      const HOT = ['T', 'Z', 'X', 'C', 'V', 'B'], ROLE_INFO: Partial<Record<Kind, string>> = {
        builder: 'Строит, чинит постройки и технику.', guard: isMelee('guard', this.fac()) ? 'Линейная пехота ближнего боя.' : 'Линейная пехота, стрелки.',
        sniper: 'Снайпер: косит пехоту издалека, бессилен против техники.', heavy: 'Тяжёлое оружие: против техники, турелей и зданий.', support: 'Поддержка: союзники рядом получают −15% урона, может нести дым.',
        elite: 'Тяжёлая элита: держит удар, бьёт в упор.', healer: 'Целитель: лечит отряды в 15 м на 5%/с.', lveh: 'Лёгкая техника: разведка, захват точек, охота на строителей.',
        mveh: 'Средняя техника: огневая поддержка против пехоты, урон по площади.', hveh: 'Тяжёлая техника: осада, против зданий и техники.', arty: 'Артиллерия: 45 м, по площади, в упор не стреляет — нужна разведка и прикрытие.', titan: 'Титан: один на армию, давит пехоту шагами.' };
      producible(st.kind).forEach((k, i) => {
        const r = ROLES[k]!, n = this.qk[st.id]?.filter(q => q === KINDS.indexOf(k)).length ?? 0, now = this.qk[st.id]?.[0] === KINDS.indexOf(k);
        c.push({ act: 'train:' + k, name: this.kindName(k, this.fac()), hot: k === 'titan' ? 'Z' : HOT[i] ?? '', art: artFor(k, this.fac()), ...this.price(free && k === 'guard' ? 0 : trainCost(this.fac(), k), r.energy ?? 0, r.relics ?? 0),
          info: `${ROLE_INFO[k] ?? ''} Легион: ${r.pop}.`, req: this.tier < r.tier ? `Нужен тир ${['I', 'II', 'III', 'IV', 'V'][r.tier - 1]}` : undefined, queue: n || undefined, prog: now ? st.prod : undefined });
      });
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
    const guards = sel.filter(v => SQUADS.has(v.kind)), hurt = guards.filter(v => v.hp < maxHp(v.kind));
    if (guards.length) c.push({ act: 'reinforce', name: 'Пополнить', hot: 'R', icon: ICON.reinforce, ...this.price(hurt.reduce((n, v) => n + Math.ceil((maxHp(v.kind) - v.hp) / STATS[v.kind].hp) * Math.round(REINFORCE_COST * STATS[v.kind].cost / 100), 0)), req: hurt.length ? undefined : 'Отряды полные', info: 'Добрать бойцов в отряды. Нужно быть рядом со своей постройкой.' });
    if (guards.length) GEAR.forEach((G, g) => { // снаряжение отряда (SquadWargear): купить или бросить
      const NAMES: Record<FactionId, string[]> = { order: ['Огненные лампады', 'Литургический заряд', 'Дымовое кадило'], undead: ['Костяная урна', 'Гробовой заряд', 'Саван'], prism: ['Фотонная граната', 'Резонансный заряд', 'Завеса'], clockwork: ['Гравитационная сфера', 'Заряд распада', 'Туман времени'], orks: ['Бахалка', 'Связка бахалок', 'Дымовуха'], ashen: ['Сосуд с серой', 'Адский заряд', 'Пепельный дым'] };
      const name = NAMES[this.fac()][g], owned = guards.filter(v => v.gear & (1 << g)), ch = owned.reduce((n, v) => n + v.ch[g], 0), cd = Math.min(...owned.map(v => v.gcd), 99);
      if (owned.length) c.push({ act: 'throw:' + g, name, hot: ['G', 'H', 'J'][g], icon: GEAR_ICON[g], info: `Бросок до ${G.range} м, радиус ${G.r} м.${g === 2 ? ' Дым: стрельба в облаке и по нему — вдвое слабее.' : ' Задевает и своих.'}`, req: ch ? undefined : 'Нет зарядов', cd: cd > 0 && cd < 99 ? cd : 0, cdMax: G.cd, queue: ch, active: this.throwG === g });
      else c.push({ act: 'gear:' + g, name: 'Купить: ' + name, hot: ['G', 'H', 'J'][g], icon: GEAR_ICON[g], ...this.price(G.cost * guards.length, G.energy * guards.length), info: `${G.charges} заряд(а), перезарядка ${G.cd} с. Покупается у штаба, казарм или капитана.`, req: this.tier < 2 ? 'Нужен тир II' : undefined });
    });
    const fix = sel.some(v => v.kind === 'builder') ? [...this.views.values()].filter(v => v.owner === this.slot && v.build >= 1 && (isStruct(v.kind) || VEHICLES.has(v.kind)) && v.hp < maxHp(v.kind) - 1) : [];
    if (fix.length) c.push({ act: 'repair', name: 'Ремонт', hot: 'E', icon: ICON.build, info: `Починить ближайшее повреждённое (${fix.length}). Или ПКМ по своей постройке/технике.` });
    for (const k of ['guard', 'captain'] as Kind[]) {
      const vs = sel.filter(v => v.kind === k), up = UPGRADES[k];
      if (!vs.length || !up) continue;
      const v = vs.find(x => x.lvl < 2);
      c.push({ act: v ? 'upgrade' : '', name: up.name, hot: 'U', icon: ICON.tier, ...(v ? this.price(up.cost, up.energy, up.relics) : {}), done: !v, req: this.tier < up.tier ? `Нужен тир ${up.tier}` : undefined, prog: v && v.upg >= 0 ? v.upg : undefined, info: k === 'captain' ? 'Капитан: урон ×1.5, получаемый урон ×0.7.' : 'Отряд: урон ×1.6, броня.' });
    }
    const capt = sel.find(v => v.kind === 'captain' && v.owner === this.slot);
    if (capt && this.fac() === 'clockwork') c.push({ act: 'ascend', name: 'Вознесение', hot: 'Y', icon: ICON.tier, ...this.price(0, 600), ult: true, info: 'Капитан становится Богом-Механизмом: 9 м, летает, Остановка времени. Необратимо; гибель — капитан недоступен 5 минут.', req: this.cap.lvl < 10 || this.tier < 4 ? 'Нужен 10-й уровень капитана и тир IV' : undefined, prog: capt.rise > 0 ? Math.round(100 - capt.rise * 25) : undefined });
    if (sel.some(v => v.kind === 'deity' && v.owner === this.slot)) c.push({ act: 'timestop', name: 'Остановка времени', hot: 'Y', icon: ABIL_ICON[4], ult: true, info: 'Враги в 12 м замирают на 3 с.', cd: this.stopCd, cdMax: 45 });
    if (this.fac() === 'ashen' && sel.some(v => SQUADS.has(v.kind) && v.kind !== 'elite')) c.push({ act: 'sacrifice', name: 'Жертва', hot: 'Y', icon: ICON.reinforce, info: 'Отряд у Чёрного Алтаря (штаба, до 14 м) обращается в демона того же веса.' });
    if (this.fac() === 'orks' && sel.some(v => v.kind === 'guard')) {
      const carrying = sel.some(v => v.carry);
      c.push({ act: 'drag', name: carrying ? 'Бросить турель' : 'Тащить турель', hot: 'Y', icon: ICON.build, info: 'Рубаки утаскивают свою турель за собой (скорость −40%). Турели Орды копят Ярость.' });
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
      ['Экономика', [card('post', 'Реликварий', 'P', 'Ставится на захваченную точку: держит её и даёт +2 влияния/с.'), card('foundry', 'Литейня', 'F', '+2 энергии/с. Ставится у своей точки или построек.', undead ? 'Нежити не нужна' : undefined), card('pump', 'Насос', 'N', '+4 энергии/с. На жилу или у своей точки.', undead ? 'Нежити не нужен' : undefined)]],
      ['Армия', [card('barracks', 'Казарма', 'B', `Нанимает: ${F.guard}. Строится рядом со штабом.`), { k: 'barracks' as Buildable, html: `<p class="lc-buildhint">Техника и танки — в здании «${F.keys[1]}» (ключевое здание тира II, вкладка «Святыни»); открываются с тира III. Титан — в штабе с тира IV.</p>` }]],
      ['Оборона', [card('turret', 'Турель', 'Y', 'Стреляет сама, голова поворачивается к цели.'), card('wall', 'Стена', 'W', 'Протяжка: клик — начало, клик — конец. 30 за сегмент.'), card('wallgate', 'Ворота', 'G', 'Свои проходят, чужие нет.'), card('bunker', 'Бункер', 'X', 'Пехота рядом получает −50% урона.', this.tier < 2 ? 'Нужен тир II' : undefined), card('mine', 'Мина', 'V', 'Невидима врагу, 180 урона по 6 м.'),
        ...(this.fac() === 'prism' ? [card('aegis', 'Купол-эгида', 'E', 'Купол 12 м: поглощает 1200 урона, восстанавливается за 30 с, пробитый 10 с не работает.', this.tier < 2 ? 'Нужен тир II' : undefined)] : []),
        ...(this.fac() === 'orks' ? [card('rturret', 'Ракетная бочка', 'R', 'Ракеты по площади. Копит Ярость.'), card('fturret', 'Огнемётная печь', 'Q', 'Жжёт в упор. Копит Ярость.')] : []),
        ...(this.fac() === 'order' ? [card('battery', 'Орган-батарея', 'R', 'Стационарная артиллерия: 40 м, мёртвая зона 8 м, урон по площади.', this.tier < 2 ? 'Нужен тир II' : undefined)] : []),
        ...(this.fac() === 'undead' ? [card('bell', 'Колокол Скорби', 'R', 'Враги в 14 м бьют на 20% слабее и ходят на 20% медленнее.', this.tier < 2 ? 'Нужен тир II' : undefined)] : []),
        ...(this.fac() === 'clockwork' ? [card('pylon', 'Гаусс-пилон', 'R', 'Дальний луч 30 м: пробивает технику и здания.', this.tier < 2 ? 'Нужен тир II' : undefined)] : []),
        ...(this.fac() === 'ashen' ? [card('pyre', 'Огненная яма', 'R', 'Жжёт всех врагов в 8 м: 18 урона в секунду.', this.tier < 2 ? 'Нужен тир II' : undefined)] : [])]],
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
    const cls = v.kind === 'captain' ? `Герой · ур. ${foe ? '?' : this.cap.lvl}` : v.kind === 'builder' ? 'Строитель' : v.kind === 'guard' ? `Пехота · ${melee ? 'ближний бой' : 'стрелки'}` : v.kind === 'legend' ? 'Легенда' : ({ deity: 'Бог · летает', titan: 'Титан', arty: 'Артиллерия · мёртвая зона 10 м', lveh: 'Лёгкая техника', mveh: 'Средняя техника', hveh: 'Тяжёлая техника', sniper: 'Снайпер', heavy: 'Тяжёлое оружие', support: 'Поддержка', elite: 'Тяжёлая элита', healer: 'Целитель' } as Partial<Record<Kind, string>>)[v.kind] ?? 'Постройка';
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
    if (act === 'ascend') { this.cmd({ c: 'ascend' }); return; }
    if (act === 'sacrifice') { this.cmd({ c: 'sacrifice', ids: [...this.sel] }); return; }
    if (act === 'timestop') { this.cmd({ c: 'timestop' }); return; }
    if (act === 'drag') {
      const sq = sel.find(v => v.kind === 'guard');
      const t = sq && [...this.views.values()].filter(v => v.owner === this.slot && /turret$/.test(v.kind) && v.build >= 1).sort((a, b) => Math.hypot(a.x - sq.x, a.y - sq.y) - Math.hypot(b.x - sq.x, b.y - sq.y))[0];
      this.cmd({ c: 'drag', ids: [...this.sel], id: t?.id ?? 0 }); return;
    }
    if (act.startsWith('train:')) { const st = sel.find(v => isStruct(v.kind)); if (st) this.cmd({ c: 'train', id: st.id, k: act.slice(6) as Kind }); return; }
    if (act.startsWith('gear:')) { this.cmd({ c: 'gear', ids: [...this.sel], g: Number(act.slice(5)) }); return; }
    if (act.startsWith('throw:')) { this.throwG = Number(act.slice(6)); this.root.style.cursor = 'crosshair'; return; }
    if (act === 'repair') {
      const b = sel.find(v => v.kind === 'builder'), fix = [...this.views.values()].filter(v => v.owner === this.slot && v.build >= 1 && (isStruct(v.kind) || VEHICLES.has(v.kind)) && v.hp < maxHp(v.kind) - 1);
      if (b && fix.length) this.cmd({ c: 'assist', ids: [...this.sel], id: fix.sort((p, q) => Math.hypot(p.x - b.x, p.y - b.y) - Math.hypot(q.x - b.x, q.y - b.y))[0].id });
      return;
    }
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
    else if (['barracks', 'post', 'turret', 'foundry', 'pump', 'wall', 'wallgate', 'bunker', 'mine', 'aegis', 'rturret', 'fturret', 'battery', 'pylon', 'pyre', 'bell'].includes(act)) { if (sel.some(v => v.kind === 'builder')) this.startPlace(act as Buildable); }
    else if (act === 'upgrade') { for (const v of sel) if ((UPGRADES[v.kind] && v.lvl < 2 || v.kind === 'post') && v.upg < 0) this.cmd({ c: 'upgrade', id: v.id }); }
    else if (act === 'reinforce') this.cmd({ c: 'reinforce', ids: sel.filter(v => v.kind === 'guard').map(v => v.id) });
  }

  private startPlace(k: Buildable) {
    this.place = k; this.amove = false; this.root.classList.add('placing');
    const r = k === 'post' ? POINT_R * 0.5 : STATS[k].radius + 0.6;
    Object.assign(this.ghost.style, { width: r * 2 * S + 'px', height: r * 1.1 * S + 'px' });
    this.root.style.cursor = 'copy';
    this.renderCmd();
  }
  private stopPlace() { this.root.classList.remove('placing'); this.wallStart = null; this.wallLine?.setAttribute('visibility', 'hidden'); this.place = null; this.ghost.classList.add('hidden'); this.root.style.cursor = ''; this.cmdHtml = ''; this.renderCmd(); }

  // ---------- ввод ----------
  private cmd(c: Cmd) {
    if (this.ended) return;
    this.send(c); audio.order();
    const lead = this.selected().find(v => !isStruct(v.kind) && v.owner === this.slot); // реплика ведущего юнита
    if (lead && (c.c === 'move' || c.c === 'amove' || c.c === 'attack' || c.c === 'throw')) voice.say(this.fac(), lead.kind, c.c === 'move' ? 'move' : 'attack');
  }
  /** Реплика на выбор: говорит первый выбранный свой юнит. */
  private greet() { const v = this.selected().find(u => u.owner === this.slot && !isStruct(u.kind)); if (v) voice.say(this.fac(), v.kind, 'select'); }

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
      else if (e.key === 'F9' && import.meta.env.DEV) { e.preventDefault(); this.cmd({ c: 'cheat' }); }
      else if (k === 'escape') { if (this.throwG >= 0) { this.throwG = -1; this.aimRing.style.display = 'none'; cv.style.cursor = ''; } else if (this.place) this.stopPlace(); else if (this.buildOpen) this.buildOpen = false; else if (this.amove || this.moveMode) { this.amove = this.moveMode = false; cv.style.cursor = ''; } else this.sel.clear(); this.lastSelKey = [...this.sel].join(','); }
      this.renderCmd();
    }, sig);
    addEventListener('keyup', e => this.keys.delete(e.key.toLowerCase()), sig);
    $('cap-port').addEventListener('click', e => { e.stopPropagation(); const v = [...this.views.values()].find(u => u.owner === this.slot && (u.kind === 'captain' || u.kind === 'deity')); if (v) this.focus(v.id); }, sig);
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
    if (this.throwG >= 0) { // бросок снаряжения в точку (GrenadeTargeting)
      const p = this.toWorld(sx, sy);
      this.cmd({ c: 'throw', ids: [...this.sel], g: this.throwG, x: p.x, y: p.y });
      this.throwG = -1; this.root.style.cursor = ''; this.aimRing.style.display = 'none';
      this.renderCmd();
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
    if (v) { this.sel.add(v.id); this.greet(); }
  }

  private boxSelect(d: { x0: number; y0: number; x1: number; y1: number }, add: boolean) {
    if (!add) this.sel.clear();
    const [x0, x1] = [Math.min(d.x0, d.x1), Math.max(d.x0, d.x1)], [y0, y1] = [Math.min(d.y0, d.y1), Math.max(d.y0, d.y1)];
    for (const v of this.views.values()) {
      if (!this.mobile(v)) continue;
      const p = this.toScreen(v.x, v.y - 0.6);
      if (p.x >= x0 && p.x <= x1 && p.y >= y0 && p.y <= y1) this.sel.add(v.id);
    }
    this.greet();
  }

  private selectOwn(kind: Kind) {
    for (const v of this.views.values()) if (v.owner === this.slot && v.kind === kind) { this.sel.clear(); this.sel.add(v.id); this.cam.x = v.x; this.cam.y = v.y; }
  }

  private placePoint(sx: number, sy: number): { x: number; y: number; ok: boolean } {
    const g = this.toWorld(sx, sy), vs = [...this.views.values()];
    if (Math.hypot(POINTS[0][0] - g.x, POINTS[0][1] - g.y) < 12) return { ...g, ok: false }; // у критической точки не строят
    const nearOwnPt = (x: number, y: number) => [...POINTS, ...RELICS].some(([px, py], i) => i !== 0 && this.pointOwner[i] === this.slot && Math.hypot(px - x, py - y) < 14);
    if (this.place === 'post') {
      const i = POINTS.findIndex(([x, y]) => Math.hypot(x - g.x, y - g.y) < 9);
      if (i < 0) return { ...g, ok: false };
      const [x, y] = POINTS[i];
      const taken = vs.some(v => v.kind === 'post' && Math.hypot(v.x - x, v.y - y) < 2);
      return { x, y, ok: (this.pointOwner[i] === this.slot || this.pointOwner[i] < 0) && !taken };
    }
    if (this.place === 'pump' || this.place === 'foundry') { // на жилу (насос) или рядом со своей точкой
      const v = this.place === 'pump' ? VENTS.find(([x, y]) => Math.hypot(x - g.x, y - g.y) < 6) : undefined;
      const p = v ? { x: v[0], y: v[1] } : g;
      const nearPt = nearOwnPt(p.x, p.y);
      const nearBase = this.place === 'foundry' && vs.some(u => u.owner === this.slot && isStruct(u.kind) && u.kind !== 'turret' && Math.hypot(u.x - p.x, u.y - p.y) < 16);
      const free = !vs.some(u => isStruct(u.kind) && Math.hypot(u.x - p.x, u.y - p.y) < STATS[u.kind].radius + STATS[this.place!].radius + 1);
      return { ...p, ok: (!!v || nearPt || nearBase) && free };
    }
    if (['mine', 'wallgate', 'bunker'].includes(this.place ?? '')) return { ...g, ok: !vs.some(v => isStruct(v.kind) && v.kind !== 'mine' && Math.hypot(v.x - g.x, v.y - g.y) < STATS[v.kind].radius + STATS[this.place!].radius + 1) };
    if (this.place === 'turret' || ['battery', 'pylon', 'pyre', 'bell', 'aegis'].includes(this.place ?? '') || /^key|^gate/.test(this.place ?? '')) {
      const near = vs.some(v => v.owner === this.slot && isStruct(v.kind) && v.kind !== 'turret' && Math.hypot(v.x - g.x, v.y - g.y) < 16) || (['turret', 'battery', 'pylon', 'pyre', 'bell'].includes(this.place ?? '') && nearOwnPt(g.x, g.y));
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
    const site = this.pick(sx, sy, v => v.owner === this.slot && !v.dead && (isStruct(v.kind) || VEHICLES.has(v.kind)) && (v.build < 1 || v.hp < maxHp(v.kind) - 1)); // стройка или ремонт
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

  /** Зритель: таблица всех игроков — фракция, очки, ресурсы, тир, армия. */
  private specHud(s: Snap) {
    const rows = this.players.map((p, i) => {
      const pl = s.pl[i] ?? [], alive = pl[1], units = s.u.filter(u => u[1] === i && !isStruct(KINDS[u[2]])).length;
      return `<div class="w2d-specrow${alive ? '' : ' out'}"><i style="background:${hex(SLOT_COLORS[i])}"></i><b>${p.name.replace(/[<>&]/g, '')}</b><span>${FACTIONS[p.faction ?? 'order'].name}</span><span>тир ${['I', 'II', 'III', 'IV', 'V'][(pl[2] ?? 1) - 1]}</span><span>◆${pl[0] ?? 0} ϟ${pl[3] ?? 0} ⌂${pl[4] ?? 0}</span><span>войск ${units}</span><span class="vp">${s.vp?.[i] ?? 0} оч.</span></div>`;
    }).join('');
    const html = `<div class="w2d-spechead">РЕЖИМ ПРОСМОТРА · без тумана · колесо — масштаб, стрелки — камера</div>${rows}`;
    if ($('hud-players').innerHTML !== html) $('hud-players').innerHTML = html;
    this.renderScore(s); this.drawMini(s); this.drawFog();
  }

  /** Видит ли игрок точку: в обзоре своих войск и построек (тот же расчёт, что на сервере). */
  private inSight(x: number, y: number) {
    for (const v of this.views.values()) if (v.owner === this.slot && !v.dead && Math.hypot(v.x - x, v.y - y) < Math.max(STATS[v.kind].sight, isStruct(v.kind) ? 12 : 10)) return true;
    return false;
  }

  /** Туман войны: тёмная вуаль вне обзора — на карте и на мини-карте. */
  private drawFog() {
    if (this.slot < 0) { this.fogCv.getContext('2d')!.clearRect(0, 0, this.fogCv.width, this.fogCv.height); this.miniFog.innerHTML = '<rect width="100" height="100" fill="#000"/>'; return; } // зритель видит всё
    const c = this.fogCv, x = c.getContext('2d')!, k = c.width / MAP.w;
    x.globalCompositeOperation = 'source-over'; x.clearRect(0, 0, c.width, c.height);
    x.fillStyle = 'rgba(6,5,9,0.72)'; x.fillRect(0, 0, c.width, c.height);
    x.globalCompositeOperation = 'destination-out';
    const holes: string[] = [];
    for (const v of this.views.values()) {
      if (v.owner !== this.slot || v.dead) continue;
      const r = Math.max(STATS[v.kind].sight, isStruct(v.kind) ? 12 : 10) + (this.research & (1 << 11) ? 4 : 0);
      const g = x.createRadialGradient(v.x * k, v.y * k, r * k * 0.7, v.x * k, v.y * k, r * k);
      g.addColorStop(0, 'rgba(0,0,0,1)'); g.addColorStop(1, 'rgba(0,0,0,0)');
      x.fillStyle = g; x.beginPath(); x.arc(v.x * k, v.y * k, r * k, 0, Math.PI * 2); x.fill();
      holes.push(`<circle cx="${(v.x / MAP.w) * 100}" cy="${(v.y / MAP.h) * 100}" r="${(r / MAP.w) * 100}" fill="#000"/>`);
    }
    this.miniFog.innerHTML = holes.join('');
  }

  /** Победные очки (CapturePoint): ромбы точек по буквам, перетягивание «мы — сильнейший враг» и счёт. */
  private renderScore(s: Snap) {
    const me = s.vp?.[Math.max(0, this.slot)] ?? 0, foe = Math.max(0, ...(s.vp ?? []).filter((_, i) => i !== Math.max(0, this.slot) && s.pl[i]?.[1])); // зритель: первый игрок против сильнейшего
    const L = ['Д', 'А', 'В', 'Б', 'Г', 'Е', 'Ж'];
    const ally = Math.max(0, this.slot); // зритель смотрит со стороны первого игрока
    const pts = s.p.slice(0, POINTS.length).map(([o], i) => `<span class="lc-score__pt${o >= 0 && o === ally ? ' lc-score__pt--ally' : o >= 0 ? ' lc-score__pt--enemy' : ''}"><span>${L[i]}</span></span>`).join('');
    const total = Math.max(1, me + foe);
    const html = `<div class="lc-score__points">${pts}</div><div class="lc-score__tug"><i class="ally" style="width:${(me / total) * 100}%"></i><i class="enemy" style="width:${(foe / total) * 100}%"></i></div><div class="lc-score__nums"><span class="ally">${me}</span><span class="goal">победные очки · 0 — поражение</span><span class="enemy">${foe}</span></div>`;
    if (html !== this.scoreHtml) { this.scoreHtml = html; $('hud-score').innerHTML = html; }
  }
  private scoreHtml = '';

  /** Облака дыма (SquadWargear): пиксельные клубы держатся, пока живут в симуляции. */
  private drawSmoke(sm: number[][]) {
    while (this.smokes.length > sm.length) this.smokes.pop()!.remove();
    sm.forEach(([x, y, t], i) => {
      let el = this.smokes[i];
      if (!el) { el = document.createElement('div'); el.className = 'w2d-smoke'; this.world.append(el); this.smokes[i] = el; }
      Object.assign(el.style, { left: (x / 10 - 6) * S + 'px', top: (y / 10 - 6) * S + 'px', width: 12 * S + 'px', height: 12 * S + 'px', opacity: String(Math.min(1, t / 3)) });
    });
  }

  /** Искры: короткие лучи из точки попадания. */
  private sparks(x: number, y: number, n: number, col: string, len: number, delay = 0) {
    let h = '';
    for (let i = 0; i < n; i++) { const a = Math.random() * Math.PI * 2, l = len * (0.5 + Math.random()); h += `<line class="w2d-sparkline" x1="${x}" y1="${y}" x2="${x + Math.cos(a) * l}" y2="${y + Math.sin(a) * l * 0.7}" stroke="${col}" style="animation-delay:${delay}ms"/>`; }
    return h;
  }
  private nearest(x: number, y: number) { let best: View | undefined, bd = 3; for (const v of this.views.values()) { const d = Math.hypot(v.tx - x, v.ty - y); if (d < bd + STATS[v.kind].radius && !v.dead) { bd = d; best = v; } } return best; }
  /** Попадание: силуэт вспыхивает и отшатывается от удара (сильнее — от тяжёлого). */
  private hitFlash(v: View, fx: number, dx: number) {
    const heavy = fx >= 10 || fx === 1 || fx === 4, push = (heavy ? 6 : 2) * Math.sign(dx || 1);
    v.body.animate([{ filter: 'brightness(2.6) saturate(0)', translate: `${push}px 0` }, { filter: 'none', translate: '0 0' }], { duration: heavy ? 220 : 120, composite: 'add' });
  }
  private shakeBy(px: number) { this.world.animate([{ translate: `${px}px ${-px / 2}px` }, { translate: `${-px}px ${px / 2}px` }, { translate: '0 0' }], { duration: 300, composite: 'add' }); }

  /** Голова турели (FactionTurrets): целится в ближайшего врага в радиусе — разворот и наклон ствола; без цели осматривает сектор. */
  private aimHead(v: View, now: number) {
    const range = (STATS[v.kind].range || 12) + 4;
    let tgt: View | null = null, bd = range;
    for (const o of this.views.values()) {
      if (o.owner === v.owner || o.dead || o.kind === 'mine') continue;
      const d = Math.hypot(o.x - v.x, o.y - v.y);
      if (d < bd) { bd = d; tgt = o; }
    }
    let flip: boolean, pitch: number;
    if (tgt) {
      flip = tgt.x < v.x;
      pitch = Math.max(-35, Math.min(35, (Math.atan2(v.y - tgt.y, Math.abs(tgt.x - v.x) + 0.01) * 180) / Math.PI)); // y мира вниз → вверх на экране
    } else {
      const ph = (now / 2600 + v.id * 0.37) % 2; // покой: медленно водит стволом и раз в цикл смотрит в другую сторону
      flip = ph > 1;
      pitch = Math.sin((now / 2600 + v.id) * Math.PI) * 18;
    }
    v.aim = v.aim === undefined ? pitch : v.aim + (pitch - v.aim) * 0.15;
    v.body.classList.toggle('flip', flip);
    for (const sv of v.svgs) { const head = sv.querySelector<SVGGElement>('.turret'); if (head) head.style.transform = `rotate(${-v.aim}deg)`; }
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

    if (this.throwG >= 0 && this.mouse) { // прицел броска: зона поражения у курсора, красная — вне дальности
      const p = this.toWorld(this.mouse.x, this.mouse.y), G = GEAR[this.throwG], sq = this.selected().filter(v => v.gear & (1 << this.throwG));
      const d = Math.min(...sq.map(v => Math.hypot(v.x - p.x, v.y - p.y)));
      Object.assign(this.aimRing.style, { display: '', left: (p.x - G.r) * S + 'px', top: (p.y - G.r) * S + 'px', width: G.r * 2 * S + 'px', height: G.r * 2 * S + 'px' });
      this.aimRing.classList.toggle('bad', d > G.range);
      $('hud-sel').textContent = d > G.range ? `вне дальности — ${Math.round(d)} м (подойдут и бросят)` : `${Math.round(d)} м · радиус ${G.r} м`;
    }
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
        if ((v.kind === 'turret' || v.kind === 'post') && v.build >= 1) this.aimHead(v, now);
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
      if ((v.kind === 'pyre' || v.kind === 'bell') && v.build >= 1 && !v.dome) { // аура: огонь ямы, тень колокола
        const r = v.kind === 'pyre' ? 8 : 14; v.dome = document.createElement('div'); v.dome.className = 'w2d-aura ' + v.kind; this.ground.append(v.dome);
        Object.assign(v.dome.style, { left: (v.x - r) * S + 'px', top: (v.y - r) * S + 'px', width: r * 2 * S + 'px', height: r * 2 * S + 'px' });
      }
      if (v.kind === 'aegis' && v.build >= 1) { // купол-эгида: полупрозрачная сфера 12 м, пропадает пробитой
        if (!v.dome) { v.dome = document.createElement('div'); v.dome.className = 'w2d-dome'; this.ground.append(v.dome); }
        Object.assign(v.dome.style, { left: (v.x - 12) * S + 'px', top: (v.y - 12) * S + 'px', width: 24 * S + 'px', height: 24 * S + 'px', opacity: v.off ? '0' : String(0.35 + (v.sh / 1200) * 0.65) });
      }
      if (v.sh > 0 && v.kind !== 'aegis') { // личный щит: синяя полоса над здоровьем
        if (!v.shBar) { v.shBar = document.createElement('div'); v.shBar.className = 'lc-vitals__bar lc-vitals__bar--shield w2d-shbar'; v.bar.prepend(v.shBar); }
        v.shBar.style.setProperty('--v', Math.min(100, (v.sh / 300) * 100) + '%'); v.bar.classList.remove('hidden');
      } else v.shBar?.remove(), (v.shBar = undefined);
      v.el.classList.toggle('frozen', v.frozen > 0);
      v.el.classList.toggle('rising', v.rise > 0);
      v.sel.classList.toggle('on', this.sel.has(v.id));
      v.el.classList.toggle('picked', this.sel.has(v.id));
    }
    const t = performance.now();
    this.shots = this.shots.filter(s => { if (s.until > t) return true; s.el.remove(); return false; });
  };
}
