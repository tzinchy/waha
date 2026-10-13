// Один процесс: Vite (клиент) + WebSocket (лобби и авторитетная симуляция матча). Запуск: npm run dev
import { createServer } from 'node:http';
import { randomBytes } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { WebSocketServer, type WebSocket } from 'ws';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { applyCmd, newState, snapshot, step, DT, MAX_PLAYERS, type CaptainCfg, type State } from '../shared/sim.ts';
import type { C2S, LobbyPlayer, S2C } from '../shared/protocol.ts';
import { botThink } from './bot.ts';
import { FACTION_IDS, isFaction } from '../shared/factions.ts';

type Member = LobbyPlayer & { ws?: WebSocket; left?: boolean };
type Match = { state: State; slots: Member[]; timer: NodeJS.Timeout };
type Lobby = { code: string; host: string; members: Member[]; match?: Match };

const lobbies = new Map<string, Lobby>();
const memberOf = new WeakMap<WebSocket, { lobby: Lobby; me: Member }>();
const send = (ws: WebSocket | undefined, m: S2C) => ws?.readyState === 1 && ws.send(JSON.stringify(m));

const int = (v: unknown, max: number) => (Number.isFinite(v) ? Math.max(0, Math.min(max, Math.floor(v as number))) : 0);
const cleanCaptain = (c: Partial<CaptainCfg> | undefined): CaptainCfg => ({
  armor: int(c?.armor, 0xffffff), trim: int(c?.trim, 0xffffff),
  weapon: c?.weapon === 'hammer' ? 'hammer' : 'sword', banner: c?.banner !== false,
});
const cleanName = (n: unknown) => (typeof n === 'string' && n.trim() ? n.trim().slice(0, 16) : 'Капитан');
const pub = ({ id, name, captain, ready, bot, faction }: Member): LobbyPlayer => ({ id, name, captain, ready, bot, faction });

function newCode() {
  for (;;) {
    const c = Array.from(randomBytes(4), b => 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'[b % 32]).join('');
    if (!lobbies.has(c)) return c;
  }
}

function broadcastLobby(l: Lobby) {
  for (const m of l.members) send(m.ws, { t: 'lobby', code: l.code, you: m.id, host: l.host, players: l.members.map(pub) });
}

function leave(ws: WebSocket) {
  const ctx = memberOf.get(ws);
  if (!ctx) return;
  memberOf.delete(ws);
  const { lobby: l, me } = ctx;
  if (l.match) { me.bot = true; me.ws = undefined; me.left = true; me.name += ' (бот)'; } // вышел посреди матча: его место занимает бот
  else l.members = l.members.filter(m => m !== me);
  const humans = l.members.filter(m => m.ws);
  if (!humans.length) { if (l.match) clearInterval(l.match.timer); lobbies.delete(l.code); return; }
  if (l.host === me.id) l.host = humans[0].id;
  if (!l.match) broadcastLobby(l);
}

function startMatch(l: Lobby) {
  const state = newState(l.members.length, l.members.map(m => m.faction));
  const slots = [...l.members];
  const m: Match = { state, slots, timer: setInterval(() => tick(l), DT * 1000) };
  l.match = m;
  slots.forEach((p, i) => send(p.ws, { t: 'start', slot: i, players: slots.map(pub) }));
}

function tick(l: Lobby) {
  const m = l.match!;
  m.slots.forEach((p, i) => { if (p.bot && m.state.players[i].alive) botThink(m.state, i); });
  step(m.state);
  const over = m.state.winner !== null;
  if (m.state.tick % 2 === 0 || over) { // симуляция 20 Гц, снимки 10 Гц; ponytail: полный JSON-снимок, дельты/бинарь если не хватит трафика
    const msg: S2C = { t: 'snap', s: snapshot(m.state) };
    for (const p of m.slots) send(p.ws, msg);
    m.state.shots.length = 0;
  }
  if (over) {
    clearInterval(m.timer);
    l.match = undefined;
    l.members = l.members.filter(p => !p.left);
    for (const p of l.members) p.ready = p.bot;
    broadcastLobby(l);
  }
}

function onMessage(ws: WebSocket, raw: string) {
  let m: C2S;
  try { m = JSON.parse(raw); } catch { return; }
  const ctx = memberOf.get(ws);
  const err = (msg: string) => send(ws, { t: 'error', msg });

  if (m.t === 'create' || m.t === 'join') {
    if (ctx) return err('Вы уже в лобби');
    let l: Lobby | undefined;
    if (m.t === 'join') {
      l = lobbies.get(String(m.code).toUpperCase().trim());
      if (!l) return err('Лобби не найдено');
      if (l.match) return err('Матч уже идёт');
      if (l.members.length >= MAX_PLAYERS) return err('Лобби заполнено');
    }
    const me: Member = { id: randomBytes(4).toString('hex'), name: cleanName(m.name), captain: cleanCaptain(m.captain), ready: false, bot: false, faction: 'order', ws };
    if (!l) { l = { code: newCode(), host: me.id, members: [] }; lobbies.set(l.code, l); }
    l.members.push(me);
    memberOf.set(ws, { lobby: l, me });
    return broadcastLobby(l);
  }
  if (!ctx) return;
  const { lobby: l, me } = ctx;
  if (m.t === 'leave') { leave(ws); return send(ws, { t: 'left' }); }
  if (m.t === 'cmd') { // команда от игрока: слот = индекс в списке слотов матча
    const e = l.match && applyCmd(l.match.state, l.match.slots.indexOf(me), m.cmd);
    if (e) err(e);
    return;
  }
  if (l.match) return;
  if (m.t === 'captain') me.captain = cleanCaptain(m.captain);
  else if (m.t === 'ready') me.ready = !!m.ready;
  else if (m.t === 'faction') { if (isFaction(m.f)) me.faction = m.f; }
  else if (l.host !== me.id) return err('Только хост');
  else if (m.t === 'bot') {
    if (l.members.length >= MAX_PLAYERS) return err('Лобби заполнено');
    l.members.push({ id: randomBytes(4).toString('hex'), name: 'Бот', captain: cleanCaptain({ armor: 0x8a2be2 + l.members.length * 0x300a0, trim: 0xe0e0e0, weapon: 'hammer' }), ready: true, bot: true, faction: FACTION_IDS[1 + Math.floor(Math.random() * (FACTION_IDS.length - 1))] });
  } else if (m.t === 'kick') {
    const k = l.members.find(p => p.id === m.id);
    if (k && k !== me) { l.members = l.members.filter(p => p !== k); if (k.ws) { memberOf.delete(k.ws); send(k.ws, { t: 'left' }); } }
  } else if (m.t === 'start') {
    if (l.members.length < 2) return err('Нужно минимум 2 игрока (добавьте бота)');
    if (!l.members.every(p => p.ready)) return err('Не все готовы');
    return startMatch(l);
  }
  broadcastLobby(l);
}

const root = fileURLToPath(new URL('..', import.meta.url));
const PROD = process.env.NODE_ENV === 'production';
const TYPES: Record<string, string> = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.woff2': 'font/woff2', '.ico': 'image/x-icon' };
/** Продакшен: отдаём собранный клиент (npm run build → dist), неизвестные пути — index.html. */
async function serveStatic(req: IncomingMessage, res: ServerResponse) {
  const dist = join(root, 'dist'), path = normalize(decodeURIComponent((req.url ?? '/').split('?')[0])).replace(/^(\.\.[/\\])+/, '');
  const file = join(dist, path === '/' ? 'index.html' : path);
  const body = file.startsWith(dist) ? await readFile(file).catch(() => null) : null;
  if (body) { res.writeHead(200, { 'content-type': TYPES[extname(file)] ?? 'application/octet-stream', 'cache-control': path.startsWith('/assets/') ? 'public, max-age=31536000, immutable' : 'no-cache' }); return res.end(body); }
  res.writeHead(200, { 'content-type': TYPES['.html'] }); res.end(await readFile(join(dist, 'index.html')));
}
const http = PROD
  ? createServer((req, res) => void serveStatic(req, res))
  : createServer((await (await import('vite')).createServer({ root: root + 'client', server: { middlewareMode: true, hmr: { port: 24678 }, fs: { allow: [root] } }, appType: 'spa' })).middlewares); // vite нужен только в разработке
const wss = new WebSocketServer({ noServer: true, maxPayload: 16 * 1024 });
http.on('upgrade', (req, sock, head) => {
  if (req.url === '/ws') wss.handleUpgrade(req, sock, head, ws => wss.emit('connection', ws));
  else sock.destroy();
});
wss.on('connection', ws => { // ponytail: без rate-limit и аккаунтов; добавить, когда выйдем за пределы друзей
  ws.on('message', data => onMessage(ws, data.toString()));
  ws.on('close', () => leave(ws));
});
const port = Number(process.env.PORT ?? 5173);
http.listen(port, () => console.log(`waha: http://localhost:${port}`));
