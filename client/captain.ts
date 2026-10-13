
// Превью капитана в редакторе: силуэт архетипа из дизайн-системы, окрашенный цветами игрока; иногда делает замах.
import type { CaptainCfg } from '../shared/sim.ts';
import { captainSvg, ready2d } from './game2d.ts';
import type { FactionId } from '../shared/factions.ts';

const hex = (c: number) => '#' + c.toString(16).padStart(6, '0');

export class CaptainPreview {
  private faction: FactionId = 'order';
  private cfg?: CaptainCfg;
  setFaction(f: FactionId) { this.faction = f; if (this.cfg) this.set(this.cfg); }
  constructor(private el: HTMLElement) {
    setInterval(() => { // раз в 4 секунды короткий удар, потом снова покой
      const svg = this.el.querySelector('svg');
      if (!svg) return;
      svg.classList.replace('lc-anim-idle', 'lc-anim-attack');
      setTimeout(() => svg.classList.replace('lc-anim-attack', 'lc-anim-idle'), 1300);
    }, 4000);
  }

  set(cfg: CaptainCfg) {
    this.cfg = cfg;
    ready2d.then(() => {
      this.el.innerHTML = captainSvg(cfg.weapon, this.faction);
      this.el.style.setProperty('--art-brass', hex(cfg.armor));
      this.el.style.setProperty('--art-brass-lit', hex(cfg.trim));
      this.el.querySelector('svg')?.classList.add('lc-art', 'lc-anim-idle');
    });
  }
}
