// Галерея: армии всех фракций на данных игры — юниты с анимациями, капитаны, титаны, легенды, постройки и виды оружия.
import { art, artFor, ready2d, setAnim, needsTint } from './game2d.ts';
import { ARCH_OPTS, DOOM_OF, FACTIONS, FACTION_IDS, HQ_NAME, ROSTER, type FactionId } from '../shared/factions.ts';
import { attackFx, isMelee, ROLES, type Kind } from '../shared/sim.ts';

// стили эффектов и запасных анимаций — из страницы игры; прокрутку здесь возвращаем
const html = await fetch('/').then(r => r.text());
for (const st of new DOMParser().parseFromString(html, 'text/html').querySelectorAll('style')) document.head.append(st);
const unlock = document.createElement('style');
unlock.textContent = 'html,body{overflow:auto!important;height:auto!important;position:static!important;touch-action:auto!important}';
document.head.append(unlock);
await ready2d;

const $ = (id: string) => document.getElementById(id)!;
const ATK: Record<number, string> = { 1: 'chop', 2: 'claw', 5: 'thrust', 3: 'beam', 11: 'beam', 13: 'beam', 4: 'cast' };
const NAMES: Partial<Record<Kind, string>> = { barracks: 'Казарма', turret: 'Турель', post: 'Столп на точке', foundry: 'Литейня', pump: 'Насос', wall: 'Стена', wallgate: 'Ворота', bunker: 'Бункер', mine: 'Мина', aegis: 'Купол-эгида', rturret: 'Ракетная бочка', fturret: 'Огнемётная печь', battery: 'Орган-батарея', bell: 'Колокол Скорби', pylon: 'Гаусс-пилон', pyre: 'Огненная яма', lighthouse: 'Великий Маяк', obelisk: 'Обелиск Вечности', megagun: 'Мега-Пушка', plague: 'Чумной шпиль' };
const ROLE: Partial<Record<Kind, string>> = { builder: 'строитель', guard: 'линейная пехота', sniper: 'снайпер', heavy: 'тяжёлое оружие', support: 'поддержка', elite: 'тяжёлая элита', healer: 'целитель', lveh: 'лёгкая техника', mveh: 'средняя техника', hveh: 'тяжёлая техника', arty: 'артиллерия', titan: 'титан' };

function figure(path: string, f: FactionId, anim: string, cap: string, width: number, tint: boolean) {
  const fig = document.createElement('figure'), a = art(path, width);
  if (tint) a.style.filter = ROSTER[f].tint;
  setAnim(a.querySelector('svg')!, anim);
  fig.append(a);
  fig.insertAdjacentHTML('beforeend', `<figcaption>${cap}</figcaption>`);
  return fig;
}
function card(title: string, sub: string, path: string, f: FactionId, anims: [string, string][], width = 64, tint = false, big = false) {
  const c = document.createElement('div'); c.className = 'card' + (big ? ' big' : '');
  c.innerHTML = `<b>${title}</b><small>${sub}</small>`;
  const row = document.createElement('div'); row.className = 'anims';
  for (const [a, cap] of anims) row.append(figure(path, f, a, cap, width, tint));
  c.append(row);
  return c;
}
function section(title: string, cards: HTMLElement[]) {
  const h = document.createElement('h2'); h.textContent = title;
  const g = document.createElement('div'); g.className = 'cards'; g.append(...cards);
  return [h, g];
}

function render(f: FactionId) {
  const F = FACTIONS[f], R = ROSTER[f] as unknown as Record<string, { name: string; art: string; tint?: boolean }>;
  const unitAnims = (k: Kind): [string, string][] => {
    const fx = attackFx(k, f), melee = isMelee(k, f);
    const walk = k === 'titan' || k === 'hveh' ? 'stride' : k === 'healer' && f === 'order' ? 'hover' : 'walk';
    return [['idle', 'покой'], [walk, 'ходьба'], [ATK[fx] ?? (melee ? 'attack' : 'recoil'), 'удар'], ['death', 'гибель']];
  };
  const army = (['builder', 'guard', 'sniper', 'heavy', 'support', 'elite', 'healer', 'lveh', 'mveh', 'hveh', 'arty'] as Kind[]).map(k => {
    const name = k === 'builder' ? F.builder : k === 'guard' ? F.guard : R[k]?.name ?? k, r = ROLES[k];
    return card(name, `${ROLE[k]}${r ? ` · тир ${r.tier} · Легион ${r.pop}` : ''}`, artFor(k, f), f, unitAnims(k), Math.min(110, (r?.meters ?? 2.4) * 22), !!R[k]?.tint);
  });
  const caps = (Object.entries(ARCH_OPTS[f]) as ['assault' | 'commander' | 'mystic', { name: string; info: string }][]).map(([a, o]) => {
    const p = artFor('captain', f, 1, a);
    return card('Капитан · ' + o.name, o.info, p, f, [['idle', 'покой'], ['walk', 'ходьба'], [a === 'mystic' ? 'cast' : 'attack', 'удар'], ['ritual', 'ритуал']], 70, needsTint(p, f));
  });
  const heroes = [
    card(R.titan.name, `титан · ${ROSTER[f].titanM} м · тир IV`, R.titan.art, f, [['idle', 'покой'], ['stride', 'шаг'], ['beam', 'удар']], 160, false, true),
    ...F.legends.map((n, i) => card(n, 'легенда тира V · ' + F.legendInfo[i], F.legendArt[i], f, [['idle', 'покой'], ['walk', 'ходьба'], ['attack', 'удар']], 80)),
    ...(f === 'clockwork' ? [card('Бог-Механизм', 'вознесённый капитан · летает · Остановка времени', 'Factions/deity.svg', f, [['hover', 'парение'], ['attack', 'удар'], ['ritual', 'вознесение']], 110)] : []),
  ];
  const b = (k: Kind, title: string, sub: string, lvl = 1, path?: string) => card(title, sub, path ?? artFor(k, f, lvl), f, [['idle', 'стоит'], ['build', 'стройка']], 110);
  const uniq: [Kind, string][] = ({ order: [['battery', 'артиллерия 40 м'], ['lighthouse', 'мегапостройка: видит 70 м']], undead: [['bell', 'враги слабее и медленнее'], ['plague', 'мегапостройка: чума 30 м']], prism: [['aegis', 'щит 1200 урона на 12 м']], clockwork: [['pylon', 'луч 30 м против техники'], ['obelisk', 'мегапостройка: луч 40 м']], orks: [['rturret', 'ракеты по площади'], ['fturret', 'огнемёт в упор'], ['megagun', 'мегапостройка: 38 м по площади']], ashen: [['pyre', 'жжёт всех в 8 м']] } as Record<FactionId, [Kind, string][]>)[f];
  const builds = [
    b('hq', HQ_NAME[f], 'штаб · можно строить ещё два'), b('barracks', 'Казарма', 'пехота и роли'),
    ...F.keys.map((n, i) => b(('key' + (i + 1)) as Kind, n, `ключевое здание тира ${['I', 'II', 'III', 'IV'][i]}`)), b('gate', F.gate, 'врата легенд, тир V'),
    card('Турель', 'тир I', artFor('turret', f), f, [['idle', 'стоит'], ['attack', 'огонь']], 110), b('turret', 'Тяжёлая турель', 'тир II', 2),
    ...uniq.map(([k, s]) => b(k, NAMES[k] ?? k, s)),
    b('doom', DOOM_OF[f].name, 'сверхоружие тира V: ' + DOOM_OF[f].info),
    b('post', 'Столп I', 'точка'), b('post', 'Столп II', 'укреплённый', 2), b('post', 'Бастион', 'с турелью', 3),
    b('foundry', 'Литейня', 'энергия'), b('pump', 'Насос', 'энергия с жилы'), b('wall', 'Стена', 'укрепление'), b('wallgate', 'Ворота', 'свои проходят'), b('bunker', 'Бункер', 'пехота рядом −50% урона'), b('mine', 'Мина', 'невидима врагу'),
  ];
  $('out').replaceChildren(...section('Армия', army), ...section('Капитаны', caps), ...section('Титан, легенды', heroes), ...section('Постройки', builds));
  document.documentElement.dataset.theme = F.theme;
  $('tabs').querySelectorAll('button').forEach(x => x.classList.toggle('lc-btn--ghost', x.dataset.f !== f));
}
$('tabs').innerHTML = FACTION_IDS.map(f => `<button class="lc-btn lc-btn--sm" data-f="${f}">${FACTIONS[f].name}</button>`).join('');
$('tabs').querySelectorAll<HTMLElement>('button').forEach(x => { x.onclick = () => render(x.dataset.f as FactionId); });
render('order');

// виды оружия: та же разметка, что рисует игра
const sp = (x: number, y: number, n: number, c: string, l: number) => Array.from({ length: n }, () => { const a = Math.random() * 6.28, d = l * (0.5 + Math.random()); return `<line class="w2d-sparkline" x1="${x}" y1="${y}" x2="${x + Math.cos(a) * d}" y2="${y + Math.sin(a) * d * 0.7}" stroke="${c}"/>`; }).join('');
const FX: [string, string, () => string][] = [
  ['Пуля, очередь', 'пехота Ордена, лёгкая техника', () => `<line class="w2d-tracer" x1="20" y1="70" x2="190" y2="60"/><circle class="w2d-muzzle" cx="20" cy="70" r="5"/>${sp(190, 60, 4, '#ffe2a0', 10)}`],
  ['Рубящий удар', 'Рубаки, капитаны, Пожинатели', () => `<path class="w2d-slash" d="M96 30 Q132 46 116 78"/><ellipse class="w2d-dust" cx="110" cy="80" rx="18" ry="6"/>`],
  ['Когти', 'демоны', () => [-8, 0, 8].map(o => `<path class="w2d-claw" d="M${94 + o} 34 Q${120 + o} 52 ${110 + o} 76"/>`).join('')],
  ['Укол', 'Костяные латники', () => [-5, 5].map(o => `<line class="w2d-thrust" x1="84" y1="${60 + o}" x2="116" y2="${60 + o}"/>`).join('')],
  ['Луч', 'Консенсус, Вечные, Обелиск', () => `<line class="w2d-beam" x1="20" y1="70" x2="190" y2="60"/><circle class="w2d-hitring" cx="190" cy="60" r="8"/>`],
  ['Огненные шары', 'Пламенный идол — турель Синклита', () => `<circle class="w2d-orb" cx="60" cy="52" r="6"/><circle class="w2d-orb" cx="110" cy="34" r="5"/><circle class="w2d-orb" cx="160" cy="44" r="4"/><circle class="w2d-blast" cx="195" cy="80" r="16"/>`],
  ['Огонь', 'адострелы Отступников, огнемёты, Мистик', () => `<path class="w2d-fire" d="M20 80 Q105 10 190 70"/><circle class="w2d-blast" cx="190" cy="70" r="14"/>`],
  ['Снайпер', 'снайперы всех фракций', () => `<line class="w2d-snipe" x1="10" y1="70" x2="200" y2="58"/>${sp(200, 58, 6, '#fff', 18)}`],
  ['Тяжёлое орудие', 'против техники и зданий', () => `<line class="w2d-las" x1="20" y1="70" x2="190" y2="60"/><circle class="w2d-boomcore" cx="190" cy="60" r="22"/>`],
  ['Снаряд осады', 'артиллерия, батареи, Мега-Пушка', () => `<path class="w2d-shell" d="M20 90 Q105 -40 190 80"/><circle class="w2d-boom late" cx="190" cy="80" r="40"/>`],
  ['Луч титана', 'титаны', () => `<line class="w2d-titanbeam" x1="40" y1="0" x2="160" y2="90"/><circle class="w2d-boom" cx="160" cy="90" r="40"/>`],
  ['Граната', 'снаряжение отрядов', () => `<path class="w2d-arc" d="M20 90 Q105 -20 190 90"/><circle class="w2d-boom" cx="190" cy="90" r="30"/>`],
  ['Дым', 'снаряжение отрядов', () => [0, 1, 2, 3, 4].map(i => `<circle class="w2d-puff" cx="${110 + Math.cos(i * 1.3) * 30}" cy="${70 + Math.sin(i * 1.3) * 14}" r="30"/>`).join('')],
  ['Купол-эгида', 'щит Консенсуса', () => `<path class="w2d-hex" d="M100 60l5 -9h10l5 9l-5 9h-10z"/>`],
  ['Остановка времени', 'Бог-Механизм', () => `<circle class="w2d-timestop" cx="110" cy="60" r="56"/>`],
  ['Сверхоружие', 'удар тира V', () => `<circle class="w2d-nuke" cx="110" cy="60" r="56"/><circle class="w2d-boomcore" cx="110" cy="60" r="24"/>${sp(110, 60, 30, '#fff2c8', 60)}`],
];
const cards = FX.map(([n, who]) => { const d = document.createElement('div'); d.className = 'fx'; d.innerHTML = `<svg viewBox="0 0 220 120"></svg><b>${n}</b><small>${who}</small>`; $('fx').append(d); return d.querySelector('svg')!; });
const loop = () => FX.forEach(([, , mk], i) => { cards[i].innerHTML = mk(); });
loop(); setInterval(loop, 1600);
