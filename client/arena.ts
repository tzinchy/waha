// Показательный бой без сервера: /?arena=tyranids,inquisition — две армии полным составом сходятся в центре карты; &units=titan — только эти виды (через запятую).
// Симуляция идёт прямо в браузере (shared/sim.ts), клиент игры смотрит как зритель: видно все выстрелы, взрывы и пожары.
import { Game, ready2d } from './game2d.ts';
import { FACTIONS, isFaction, type FactionId } from '../shared/factions.ts';
import { DT, MAP, NO_BUILD, PRODUCERS, applyCmd, isStruct, newState, producible, setMap, snapshot, spawn, step, type Kind, type State } from '../shared/sim.ts';
import type { LobbyPlayer } from '../shared/protocol.ts';

const only = new URLSearchParams(location.search).get('units')?.split(',').filter(Boolean) as Kind[] | undefined;
const ARMY = (f: FactionId): Kind[] => only ?? ['captain', ...new Set([...PRODUCERS].filter(b => !NO_BUILD[f]?.includes(b as never)).flatMap(b => producible(b, f)).filter(k => k !== 'builder'))]; // весь состав фракции из её зданий (у рас UA — только из зданий UA)

/** Выставить обе армии строем друг напротив друга и дать приказ «атака с ходу» навстречу. */
function deploy(s: State) {
  for (const u of s.units) if (!isStruct(u.kind) && u.kind !== 'builder') u.hp = 0;
  const cx = MAP.w / 2, cy = MAP.h / 2;
  s.players.forEach((p, side) => {
    const dir = side ? 1 : -1, kinds = ARMY(p.faction), ids: number[] = [];
    kinds.forEach((k, i) => {
      const row = Math.floor(i / 7), col = i % 7, u = spawn(s, side, k, cx + dir * (45 + row * 10), cy + (col - 3) * 9);
      u.face = side ? Math.PI : 0; ids.push(u.id);
    });
    applyCmd(s, side, { c: 'amove', ids, x: cx - dir * 20, y: cy });
  });
}

export function runArena(param: string, root: HTMLElement) {
  const fs = param.split(',').filter(isFaction).slice(0, 2) as FactionId[];
  while (fs.length < 2) fs.push(fs.length ? 'inquisition' : 'tyranids');
  setMap(0);
  const s = newState(2, fs);
  s.players.forEach(p => Object.assign(p, { tier: 5, req: 1e6, energy: 1e6, relics: 1e3 }));
  deploy(s);
  const players: LobbyPlayer[] = fs.map((f, i) => ({ id: 'a' + i, name: FACTIONS[f].name, captain: { arch: 'commander' }, ready: true, bot: true, faction: f }));
  for (const id of ['home', 'menu', 'lobby', 'editor']) document.getElementById(id)?.classList.add('hidden');
  root.classList.remove('hidden');
  ready2d.then(() => {
    const game = new Game(document.getElementById('view')!, -1, players, () => undefined, () => undefined);
    setInterval(() => {
      step(s);
      const alive = [0, 1].map(o => s.units.some(u => u.owner === o && u.hp > 0 && !isStruct(u.kind) && u.kind !== 'builder'));
      if (!alive[0] || !alive[1]) deploy(s); // одна армия кончилась — новый раунд
      game.onSnap(snapshot(s));
    }, DT * 1000);
  });
}
