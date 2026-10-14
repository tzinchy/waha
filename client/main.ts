// Меню, лобби и сеть. Игра живёт в game.ts.
import type { C2S, LobbyPlayer, S2C } from '../shared/protocol.ts';
import type { CaptainCfg } from '../shared/sim.ts';
import { CaptainPreview } from './captain.ts';
import { Game } from './game.ts';
import { allReady } from './models.ts';
import { audio } from './audio.ts';
import { isAscii, setTheme } from './theme.ts';

const $ = <T extends HTMLElement = HTMLElement>(id: string) => document.getElementById(id) as T;
const hex = (c: number) => '#' + c.toString(16).padStart(6, '0');
const esc = (s: string) => s.replace(/[<>&"]/g, '');
const store = {
  get: (k: string) => { try { return localStorage.getItem(k); } catch { return null; } },
  set: (k: string, v: string) => { try { localStorage.setItem(k, v); } catch { /* приватный режим */ } },
};

// ---------- капитан ----------
const ARMOR = [0x2f6bd1, 0xb02a2a, 0x2e8b57, 0x6a3fa0, 0x4a4a4a, 0x1e90a0, 0x8b5a2b, 0xc9a227];
const TRIM = [0xf3d36b, 0xe0e0e0, 0x22c1c3, 0xff7a1a, 0xd04a6a, 0x222222];
let cfg: CaptainCfg = { armor: ARMOR[0], trim: TRIM[0], weapon: 'sword', banner: true };
try { cfg = { ...cfg, ...JSON.parse(store.get('waha.captain') ?? '{}') }; } catch { /* битые данные: берём умолчания */ }
const graphicsQuality = $<HTMLSelectElement>('graphicsQuality');
graphicsQuality.value = store.get('waha.graphics') === 'cinematic' ? 'cinematic' : 'basic';
graphicsQuality.onchange = () => store.set('waha.graphics', graphicsQuality.value);
const preview = new CaptainPreview($<HTMLCanvasElement>('preview'));
const factionChoice = $<HTMLSelectElement>('factionChoice');
factionChoice.value = cfg.faction ?? 'legion';
factionChoice.onchange = () => { cfg.faction = factionChoice.value as NonNullable<CaptainCfg['faction']>; applyCfg(); };

function applyCfg() {
  store.set('waha.captain', JSON.stringify(cfg));
  preview.set(cfg);
  factionChoice.value = cfg.faction ?? 'legion';
  $<HTMLInputElement>('armorIn').value = hex(cfg.armor);
  $<HTMLInputElement>('trimIn').value = hex(cfg.trim);
  document.querySelectorAll('#armorSw .sw').forEach(s => s.classList.toggle('on', (s as HTMLElement).dataset.c === String(cfg.armor)));
  document.querySelectorAll('#trimSw .sw').forEach(s => s.classList.toggle('on', (s as HTMLElement).dataset.c === String(cfg.trim)));
  document.querySelectorAll('#weapon button').forEach(b => b.classList.toggle('on', (b as HTMLElement).dataset.w === cfg.weapon));
  $('banner').textContent = cfg.banner ? 'Есть' : 'Нет';
  $('banner').classList.toggle('on', cfg.banner);
  tx({ t: 'captain', captain: cfg });
}
function swatches(id: string, list: number[], key: 'armor' | 'trim') {
  for (const c of list) {
    const s = document.createElement('span');
    s.className = 'sw'; s.dataset.c = String(c); s.style.background = hex(c);
    s.onclick = () => { cfg[key] = c; applyCfg(); };
    $(id).appendChild(s);
  }
}
swatches('armorSw', ARMOR, 'armor');
swatches('trimSw', TRIM, 'trim');
$<HTMLInputElement>('armorIn').oninput = e => { cfg.armor = parseInt((e.target as HTMLInputElement).value.slice(1), 16); applyCfg(); };
$<HTMLInputElement>('trimIn').oninput = e => { cfg.trim = parseInt((e.target as HTMLInputElement).value.slice(1), 16); applyCfg(); };
document.querySelectorAll<HTMLElement>('#weapon button').forEach(b => { b.onclick = () => { cfg.weapon = b.dataset.w as CaptainCfg['weapon']; applyCfg(); }; });
$('banner').onclick = () => { cfg.banner = !cfg.banner; applyCfg(); };

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
  t.textContent = msg; t.classList.remove('hidden');
  clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => t.classList.add('hidden'), 3500);
}
function connect(then: () => void) {
  if (ws?.readyState === 1) return then();
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
}

function onMsg(m: S2C) {
  if (m.t === 'lobby') { lobby = m; if (!game) renderLobby(); }
  else if (m.t === 'start') startGame(m.slot, m.players);
  else if (m.t === 'snap') game?.onSnap(m.s);
  else if (m.t === 'left') { lobby = null; show('menu'); }
  else if (m.t === 'error') { toast(m.msg); audio.error(); }
}

function startGame(slot: number, players: LobbyPlayer[]) {
  game?.destroy();
  $('result').classList.add('hidden');
  show('game');
  allReady.then(() => { game = new Game($('view'), slot, players, cmd => tx({ t: 'cmd', cmd }), winner => {
    $('result-title').textContent = winner === slot ? 'Победа' : winner < 0 ? 'Ничья' : `Победил ${esc(players[winner].name)}`;
    $('result').classList.remove('hidden');
    if (winner === slot) audio.win(); else audio.lose();
  }, graphicsQuality.value === 'cinematic' ? 'cinematic' : 'basic'); });
}
$('result-back').onclick = () => {
  game?.destroy(); game = null;
  if (lobby) renderLobby(); else show('menu');
};

// ---------- меню и лобби ----------
const player = () => ({ name: nameIn.value, captain: cfg });
$('create').onclick = () => { store.set('waha.name', nameIn.value); connect(() => tx({ t: 'create', ...player() })); };
$('join').onclick = () => {
  const code = $<HTMLInputElement>('code').value.trim();
  if (!code) return toast('Введите код лобби');
  store.set('waha.name', nameIn.value);
  connect(() => tx({ t: 'join', code, ...player() }));
};

function renderLobby() {
  if (!lobby) return;
  show('lobby');
  const me = lobby.players.find(p => p.id === lobby!.you)!, host = lobby.host === lobby.you;
  $('lcode').textContent = lobby.code;
  $('plist').innerHTML = lobby.players.map(p => `<li>
    <span class="dot" style="background:${hex(p.captain.armor)}"></span>
    <span class="name">${esc(p.name)}</span>
    ${p.id === lobby!.host ? '<span class="tag">хост</span>' : ''}
    <span class="tag ${p.ready ? 'ready' : ''}">${p.bot ? 'бот' : p.ready ? 'готов' : 'не готов'}</span>
    ${host && p.id !== lobby!.you ? `<button data-kick="${p.id}">✕</button>` : ''}</li>`).join('');
  $('plist').querySelectorAll<HTMLElement>('[data-kick]').forEach(b => { b.onclick = () => tx({ t: 'kick', id: b.dataset.kick! }); });
  $('ready').textContent = me.ready ? 'Не готов' : 'Готов';
  $('ready').classList.toggle('on', me.ready);
  $('addbot').classList.toggle('hidden', !host);
  $('start').classList.toggle('hidden', !host);
}
$('ready').onclick = () => { const me = lobby?.players.find(p => p.id === lobby!.you); if (me) tx({ t: 'ready', ready: !me.ready }); };
$('addbot').onclick = () => tx({ t: 'bot' });
$('start').onclick = () => tx({ t: 'start' });
$('leave').onclick = () => tx({ t: 'leave' });
$('copy').onclick = () => {
  if (!lobby) return;
  navigator.clipboard?.writeText(`${location.origin}/?join=${lobby.code}`).then(() => toast('Ссылка скопирована'), () => toast(`Код: ${lobby!.code}`));
};

document.addEventListener('click', e => { if ((e.target as HTMLElement).closest('button')) audio.click(); });
const muteBtn = $('mute');
const paintMute = () => { muteBtn.textContent = audio.muted ? 'Звук: выкл (M)' : 'Звук: вкл (M)'; };
const toggleMute = () => { audio.setMuted(!audio.muted); paintMute(); };
muteBtn.onclick = toggleMute;
addEventListener('keydown', e => { if (e.key.toLowerCase() === 'm' && !(e.target instanceof HTMLInputElement)) toggleMute(); });
paintMute();

const themeBtn = $('theme');
const paintTheme = () => { themeBtn.textContent = isAscii() ? 'Стиль: ASCII' : 'Стиль: Art Deco'; };
themeBtn.onclick = () => { setTheme(isAscii() ? 'deco' : 'ascii'); paintTheme(); };
paintTheme();

applyCfg();
show('menu');
