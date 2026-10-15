import type { CaptainCfg, Cmd, Snap } from './sim.ts';
import type { FactionId } from './factions.ts';

export type LobbyPlayer = { id: string; name: string; captain: CaptainCfg; ready: boolean; bot: boolean; faction: FactionId; spec?: boolean }; // spec — зритель

export type C2S =
  | { t: 'create'; name: string; captain: CaptainCfg }
  | { t: 'join'; code: string; name: string; captain: CaptainCfg }
  | { t: 'captain'; captain: CaptainCfg }
  | { t: 'ready'; ready: boolean }
  | { t: 'faction'; f: FactionId }
  | { t: 'spec'; on: boolean }
  | { t: 'map'; m: number }
  | { t: 'bot' }
  | { t: 'kick'; id: string }
  | { t: 'start' }
  | { t: 'cmd'; cmd: Cmd }
  | { t: 'leave' }
  | { t: 'list' } // открытые лобби для меню
  | { t: 'ping'; at: number }; // замер задержки: сервер сразу отвечает pong с той же меткой

export type S2C =
  | { t: 'lobby'; code: string; you: string; host: string; players: LobbyPlayer[]; map: number }
  | { t: 'start'; slot: number; players: LobbyPlayer[]; map: number } // players в порядке слотов: индекс = owner в симуляции
  | { t: 'snap'; s: Snap }
  | { t: 'left' }
  | { t: 'error'; msg: string }
  | { t: 'lobbies'; list: LobbyInfo[] }
  | { t: 'pong'; at: number };

/** Строка списка лобби в меню: идущий матч — вход зрителем. */
export type LobbyInfo = { code: string; host: string; players: number; max: number; map: number; live: boolean };
