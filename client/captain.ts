// Превью капитана в лобби: атлас фракции (faction-asset-lab) лицом к зрителю; раз в 4 с делает замах.
import type { CaptainCfg } from '../shared/sim.ts';
import type { FactionId } from '../shared/factions.ts';
import { pxMeta, pxUrl, ready2d } from './game2d.ts';

const H = 300; // высота превью, px: фигура вписывается по своей рамке из idle.json
export class CaptainPreview {
  private faction: FactionId = 'order';
  private sprite = document.createElement('div');
  private run?: Animation;
  setFaction(f: FactionId) { this.faction = f; ready2d.then(() => this.play('idle')); }
  constructor(private el: HTMLElement) {
    setInterval(() => { this.play('attack'); setTimeout(() => this.play('idle'), 700); }, 4000);
  }
  /** Строка 1 атласа — лицом к зрителю; восемь кадров перелистываются ступенчатой анимацией. */
  private play(anim: 'idle' | 'attack') {
    const m = pxMeta(this.faction, 'captain'), sc = (H * 0.85) / m.bh, w = m.cell * sc;
    // кадр шире окна превью: ставим абсолютно — центр по рамке фигуры, ноги у нижнего края
    Object.assign(this.sprite.style, { position: 'absolute', width: w + 'px', height: w + 'px', left: `calc(50% - ${(m.bx + m.bw / 2) * sc}px)`, top: `calc(100% - ${(m.by + m.bh) * sc + 18}px)`, backgroundSize: `${w * 8}px ${w * 8}px`, backgroundImage: `url(${pxUrl(this.faction, 'captain', anim)})` });
    this.run?.cancel();
    this.run = this.sprite.animate([{ backgroundPosition: `0 ${-w}px` }, { backgroundPosition: `${-w * 8}px ${-w}px` }], { duration: anim === 'idle' ? 2000 : 700, iterations: Infinity, easing: 'steps(8)' });
  }
  set(_cfg: CaptainCfg) {
    if (!this.el.contains(this.sprite)) this.el.replaceChildren(this.sprite);
    ready2d.then(() => this.play('idle'));
  }
}
