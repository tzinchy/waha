// Меню, лобби и сеть. Игра живёт в game.ts.
import type { C2S, LobbyInfo, LobbyPlayer, S2C } from '../shared/protocol.ts';
import type { CaptainCfg } from '../shared/sim.ts';
import { CaptainPreview } from './captain.ts';
import { Game, pxIcon, ready2d } from './game2d.ts';
import { archFor, FACTIONS, FACTION_IDS, type FactionId } from '../shared/factions.ts';
import { voice } from './voice.ts';
import { MAPS, setMap } from '../shared/mapdata.ts';
import { audio } from './audio.ts';
import { nextTheme, setTheme, themeName } from './theme.ts';

const $ = <T extends HTMLElement = HTMLElement>(id: string) => document.getElementById(id) as T;
const esc = (s: string) => s.replace(/[<>&"]/g, '');
const store = {
  get: (k: string) => { try { return localStorage.getItem(k); } catch { return null; } },
  set: (k: string, v: string) => { try { localStorage.setItem(k, v); } catch { /* приватный режим */ } },
};

// ---------- капитан ----------
const cfg: CaptainCfg = { arch: 'commander' }; // сборки нет: главный герой — командир (штаб), остальные архетипы заказываются в казармах
let faction: FactionId | null = null; // выбранная в лобби фракция (до лобби — Орден)
const preview = new CaptainPreview($('preview'));


const nameIn = $<HTMLInputElement>('name');
nameIn.value = store.get('waha.name') ?? '';
nameIn.onchange = () => store.set('waha.name', nameIn.value);
const joinParam = new URLSearchParams(location.search).get('join');
if (joinParam) $<HTMLInputElement>('code').value = joinParam.toUpperCase();

// ---------- сеть ----------
let ws: WebSocket | null = null;
let lobby: Extract<S2C, { t: 'lobby' }> | null = null;
let game: Game | null = null;
let toastTimer = 0;

const tx = (m: C2S) => { if (ws?.readyState === 1) ws.send(JSON.stringify(m)); };
function toast(msg: string) {
  const t = $('toast');
  $('toast-text').textContent = msg; t.classList.remove('hidden');
  clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => t.classList.add('hidden'), 3500);
}
function connect(then: () => void) {
  if (ws?.readyState === 1) return then();
  if (ws?.readyState === 0) { ws.addEventListener('open', then, { once: true }); return; } // ещё подключается: второй сокет не открываем, ждём этот
  const sock = (ws = new WebSocket(`${location.protocol === 'https:' ? 'wss' : 'ws'}://${location.host}/ws`));
  sock.onopen = then;
  sock.onmessage = e => onMsg(JSON.parse(e.data));
  sock.onclose = () => {
    if (ws !== sock) return;
    ws = null; lobby = null; game?.destroy(); game = null;
    show('menu');
    toast('Соединение потеряно');
  };
}

function show(screen: 'menu' | 'lobby' | 'game') {
  $('home').classList.toggle('hidden', screen === 'game');
  $('game').classList.toggle('hidden', screen !== 'game');
  $('menu').classList.toggle('hidden', screen !== 'menu');
  $('lobby').classList.toggle('hidden', screen !== 'lobby');
  $('editor').classList.toggle('hidden', screen !== 'lobby'); // облик капитана выбирается в лобби, вместе с фракцией
}

function onMsg(m: S2C) {
  if (m.t === 'lobby') { lobby = m; if (!game) renderLobby(); }
  else if (m.t === 'start') startGame(m.slot, m.players, m.map ?? 0);
  else if (m.t === 'snap') game?.onSnap(m.s);
  else if (m.t === 'left') { lobby = null; show('menu'); }
  else if (m.t === 'lobbies') renderLobbies(m.list);
  else if (m.t === 'pong') showPing(performance.now() - m.at);
  else if (m.t === 'error') { if (game) game.alert('warn', m.msg); else toast(m.msg); audio.error(); }
}

function startGame(slot: number, players: LobbyPlayer[], map = 0) {
  setMap(map); // карта матча: до создания игры
  game?.destroy();
  $('result').classList.add('hidden');
  show('game');
  ready2d.then(() => { game = new Game($('view'), slot, players, cmd => tx({ t: 'cmd', cmd }), winner => {
    $('result-title').textContent = slot < 0 ? (winner < 0 ? 'Ничья' : `Победил ${esc(players[winner].name)}`) : winner === slot ? 'Победа' : winner < 0 ? 'Ничья' : `Победил ${esc(players[winner].name)}`;
    $('result').classList.remove('hidden');
    $('result-watch').classList.remove('hidden');
    if (winner === slot || slot < 0) audio.win(); else audio.lose();
  }); });
}
$('result-watch').onclick = () => { $('result').classList.add('hidden'); game?.watch(); }; // осмотреть карту без тумана
$('result-back').onclick = () => {
  game?.destroy(); game = null;
  if (lobby) renderLobby(); else show('menu');
};

// ---------- меню и лобби ----------
const player = () => ({ name: nameIn.value, captain: cfg });
$('create').onclick = () => { store.set('waha.name', nameIn.value); connect(() => tx({ t: 'create', ...player() })); };
const joinCode = (code: string) => { store.set('waha.name', nameIn.value); connect(() => tx({ t: 'join', code, ...player() })); };
$('join').onclick = () => {
  const code = $<HTMLInputElement>('code').value.trim();
  if (!code) return toast('Введите код лобби');
  joinCode(code);
};
/** Открытые лобби: пока видно меню, раз в 3 с спрашиваем у сервера список. */
function renderLobbies(list: LobbyInfo[]) {
  $('lobbies').innerHTML = list.length ? list.map(l => `<li><span class="name">${esc(l.host)}<br><small class="tag">${MAPS[l.map]?.name ?? ''} · ${l.players}/${l.max}${l.live ? ' · идёт бой' : ''}</small></span><button class="lc-btn lc-btn--sm${l.live ? ' lc-btn--ghost' : ''}" data-code="${l.code}" ${!l.live && l.players >= l.max ? 'disabled' : ''}>${l.live ? 'Смотреть' : 'Войти'}</button></li>`).join('') : '<li class="empty">Открытых лобби нет — созовите своё</li>';
  $('lobbies').querySelectorAll<HTMLElement>('[data-code]').forEach(b => { b.onclick = () => joinCode(b.dataset.code!); });
}
/** Значок пинга: задержка до сервера, цвет — по качеству связи. */
function showPing(ms: number) {
  const el = $('ping'), v = Math.round(ms);
  el.textContent = `${v} мс`; el.dataset.q = v < 80 ? 'good' : v < 180 ? 'mid' : 'bad'; el.classList.remove('hidden');
}
setInterval(() => { if (ws?.readyState === 1) tx({ t: 'ping', at: performance.now() }); }, 2000);
setInterval(() => { if (!$('menu').classList.contains('hidden') && !document.hidden && ws?.readyState !== 0) connect(() => tx({ t: 'list' })); }, 3000); // readyState 0: сокет ещё подключается — второй не открываем
const arena = new URLSearchParams(location.search).get('arena'); // ?arena=order,orks — показательный бой без сервера
if (arena !== null) import('./arena.ts').then(m => m.runArena(arena, $('game')));
else connect(() => tx({ t: 'list' }));

/** Выбор фракции: карточки с силуэтом капитана, тема интерфейса и превью меняются вместе с выбором. */
function renderFactions(mine: FactionId, random = false) {
  $('factions').innerHTML = FACTION_IDS.map(f => `<button class="lc-btn lc-btn--sm ${f === mine && !random ? '' : 'lc-btn--ghost'}" data-f="${f}" title="${FACTIONS[f].mech}">${svgFor(f)}${FACTIONS[f].name}</button>`).join('')
    + `<button class="lc-btn lc-btn--sm ${random ? '' : 'lc-btn--ghost'}" data-f="random" title="Раса выпадет случайно при старте матча">? Случайная</button>`;
  $('factions').querySelectorAll<HTMLElement>('[data-f]').forEach(b => { b.onclick = () => tx({ t: 'faction', f: b.dataset.f as FactionId | 'random' }); });
  $('faction-mech').textContent = random ? 'Раса выпадет случайно при старте матча.' : FACTIONS[mine].mech;
  if (faction !== mine) { faction = mine; setTheme(FACTIONS[mine].theme); preview.setFaction(mine); paintTheme(); preview.set({ ...cfg, arch: archFor(mine, cfg.arch) }); }
}
const svgFor = (f: FactionId) => pxIcon(f, 'captain', true); // пиксельный капитан фракции

function renderLobby() {
  if (!lobby) return;
  show('lobby');
  const me = lobby.players.find(p => p.id === lobby!.you)!, host = lobby.host === lobby.you;
  renderFactions(me.faction, me.random);
  $('lcode').textContent = lobby.code;
  $('plist').innerHTML = lobby.players.map(p => `<li>
    <span class="name">${esc(p.name)}<br><small class="tag">${p.random ? 'Случайная' : FACTIONS[p.faction]?.name ?? ''}</small></span>
    ${p.id === lobby!.host ? '<span class="tag">хост</span>' : ''}
    <span class="tag ${p.ready ? 'ready' : ''}">${p.spec ? 'зритель' : p.bot ? 'бот' : p.ready ? 'готов' : 'не готов'}</span>
    ${host && p.id !== lobby!.you ? `<button data-kick="${p.id}">✕</button>` : ''}</li>`).join('');
  $('plist').querySelectorAll<HTMLElement>('[data-kick]').forEach(b => { b.onclick = () => tx({ t: 'kick', id: b.dataset.kick! }); });
  $('ready').classList.toggle('hidden', !!me.spec);
  $('spec').textContent = me.spec ? 'Играть' : 'Зритель';
  $('ready').textContent = me.ready ? 'Не готов' : 'Готов';
  $('ready').classList.toggle('lc-btn--ghost', !me.ready);
  $('maps').innerHTML = MAPS.map((mp, i) => `<button class="lc-btn lc-btn--sm ${i === lobby!.map ? '' : 'lc-btn--ghost'}" data-map="${i}" ${host ? '' : 'disabled'} title="${mp.info}">${mp.name}</button>`).join('');
  $('map-info').textContent = MAPS[lobby.map]?.info ?? '';
  $('maps').querySelectorAll<HTMLElement>('[data-map]').forEach(b => { b.onclick = () => tx({ t: 'map', m: Number(b.dataset.map) }); });
  $('addbot').classList.toggle('hidden', !host);
  $('start').classList.toggle('hidden', !host);
}
$('ready').onclick = () => { const me = lobby?.players.find(p => p.id === lobby!.you); if (me) tx({ t: 'ready', ready: !me.ready }); };
$('addbot').onclick = () => tx({ t: 'bot' });
$('spec').onclick = () => { const me = lobby?.players.find(p => p.id === lobby!.you); tx({ t: 'spec', on: !me?.spec }); };
$('start').onclick = () => tx({ t: 'start' });
$('leave').onclick = () => tx({ t: 'leave' });
const copyCode = () => { if (lobby) navigator.clipboard?.writeText(lobby.code).then(() => toast(`Код ${lobby!.code} скопирован`), () => toast(`Код: ${lobby!.code}`)); };
$('copycode').onclick = copyCode;
$('lcode').onclick = copyCode;
$('lcode').onkeydown = e => { if (e.key === 'Enter' || e.key === ' ') copyCode(); };
$('copy').onclick = () => {
  if (!lobby) return;
  navigator.clipboard?.writeText(`${location.origin}/?join=${lobby.code}`).then(() => toast('Ссылка скопирована'), () => toast(`Код: ${lobby!.code}`));
};

document.addEventListener('click', e => { if ((e.target as HTMLElement).closest('button')) audio.click(); });
const muteBtn = $('mute');
const paintMute = () => { muteBtn.textContent = audio.muted ? 'Звук: выкл (Shift+M)' : 'Звук: вкл (Shift+M)'; };
const toggleMute = () => { audio.setMuted(!audio.muted); voice.enabled = !audio.muted; paintMute(); };
muteBtn.onclick = toggleMute;
addEventListener('keydown', e => { if (e.code === 'KeyM' && e.shiftKey && !(e.target instanceof HTMLInputElement)) toggleMute(); }); // Shift+M: M — команда «Идти»
paintMute();
// полный экран: в нём курсор упирается в край монитора — прокрутка краем работает всегда
const fsBtn = $('fullscreen');
const toggleFs = () => { if (document.fullscreenElement) void document.exitFullscreen(); else void document.documentElement.requestFullscreen?.().catch(() => toast('Браузер не дал открыть полный экран — нажмите F11')); };
fsBtn.onclick = toggleFs;
document.addEventListener('fullscreenchange', () => { fsBtn.textContent = document.fullscreenElement ? 'Выйти из полного экрана (Shift+F)' : 'Полный экран (Shift+F)'; });
addEventListener('keydown', e => { if (e.code === 'KeyF' && e.shiftKey && !(e.target instanceof HTMLInputElement)) toggleFs(); });

const themeBtn = $('theme');
const paintTheme = () => { themeBtn.textContent = `Тема: ${themeName()}`; };
themeBtn.onclick = () => { nextTheme(); paintTheme(); };
paintTheme();

preview.set(cfg);
show('menu');
