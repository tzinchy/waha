// Превью капитана в лобби: живая 3D-модель фракции (как на поле боя); раз в 4 с делает замах.
import type { CaptainCfg } from '../shared/sim.ts';
import { PACK, type FactionId } from '../shared/factions.ts';
import { Live3D } from './snap3d.ts';

export class CaptainPreview {
  private faction: FactionId = 'order';
  private live: Live3D;
  constructor(el: HTMLElement) { this.live = new Live3D(el); }
  setFaction(f: FactionId) { this.faction = f; this.live.set(PACK[f]); }
  set(_cfg: CaptainCfg) { this.live.set(PACK[this.faction]); }
}
