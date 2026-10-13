import type { CaptainCfg, Cmd, Snap } from './sim.ts';

export type LobbyPlayer = { id: string; name: string; captain: CaptainCfg; ready: boolean; bot: boolean };

export type C2S =
  | { t: 'create'; name: string; captain: CaptainCfg }
  | { t: 'join'; code: string; name: string; captain: CaptainCfg }
  | { t: 'captain'; captain: CaptainCfg }
  | { t: 'ready'; ready: boolean }
  | { t: 'bot' }
  | { t: 'kick'; id: string }
  | { t: 'start' }
  | { t: 'cmd'; cmd: Cmd }
  | { t: 'leave' };

export type S2C =
  | { t: 'lobby'; code: string; you: string; host: string; players: LobbyPlayer[] }
  | { t: 'start'; slot: number; players: LobbyPlayer[] } // players в порядке слотов: индекс = owner в симуляции
  | { t: 'snap'; s: Snap }
  | { t: 'left' }
  | { t: 'error'; msg: string };
