
// Превью капитана в редакторе: силуэт архетипа из дизайн-системы, окрашенный цветами игрока; иногда делает замах.
import type { CaptainCfg } from '../shared/sim.ts';
import { captainSvg, needsTint, ready2d } from './game2d.ts';
import { CAPTAIN_ART, ROSTER, archFor } from '../shared/factions.ts';
import type { FactionId } from '../shared/factions.ts';


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
      const f = this.faction ?? 'order', arch = archFor(f, cfg.arch), path = CAPTAIN_ART[f][arch];
      this.el.innerHTML = captainSvg(arch, f);
      this.el.style.filter = needsTint(path, f) ? ROSTER[f].tint : '';
      this.el.querySelector('svg')?.classList.add('lc-art', 'lc-anim-idle');
    });
  }
}
