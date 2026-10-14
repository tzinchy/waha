// Превью капитана в редакторе: пиксельный атлас фракции (faction-asset-lab) лицом к зрителю; раз в 4 с делает замах.
import type { CaptainCfg } from '../shared/sim.ts';
import { PACK, type FactionId } from '../shared/factions.ts';

const SCALE = 3, W = 128 * SCALE;
export class CaptainPreview {
  private faction: FactionId = 'order';
  private sprite = document.createElement('div');
  private run?: Animation;
  setFaction(f: FactionId) { this.faction = f; this.play('idle'); }
  constructor(private el: HTMLElement) {
    Object.assign(this.sprite.style, { width: W + 'px', height: W + 'px', margin: '-90px auto -60px', backgroundSize: `${W * 8}px ${W * 8}px`, imageRendering: 'pixelated' });
    setInterval(() => { this.play('attack'); setTimeout(() => this.play('idle'), 700); }, 4000);
  }
  /** Строка 1 атласа — лицом к зрителю; восемь кадров перелистываются ступенчатой анимацией. */
  private play(anim: 'idle' | 'attack') {
    this.sprite.style.backgroundImage = `url(/models/factions/${PACK[this.faction]}/captain/sprites/${anim}.png)`;
    this.run?.cancel();
    this.run = this.sprite.animate([{ backgroundPosition: `0 ${-W}px` }, { backgroundPosition: `${-W * 8}px ${-W}px` }], { duration: anim === 'idle' ? 2000 : 700, iterations: Infinity, easing: 'steps(8)' });
  }
  set(_cfg: CaptainCfg) {
    if (!this.el.contains(this.sprite)) this.el.replaceChildren(this.sprite);
    this.play('idle');
  }
}
