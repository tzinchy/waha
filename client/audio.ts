// Весь звук синтезируется Web Audio, файлов нет. Контекст создаётся при первом жесте пользователя (политика автоплея).
// Музыка: тёмный дрон, редкие аккорды и колокола через реверберацию; в бою добавляются барабаны, темп растёт с интенсивностью.
const MUTE_KEY = 'waha.mute';
const rnd = (a: number, b: number) => a + Math.random() * (b - a);
const pick = <T,>(a: T[]) => a[Math.floor(Math.random() * a.length)];

type Env = { type?: OscillatorType; gain?: number; delay?: number; to?: number; pan?: number; wet?: number };

class Sound {
  muted = false;
  private ctx?: AudioContext;
  private sfx!: GainNode;
  private music!: GainNode;
  private wet!: GainNode;
  private noise!: AudioBuffer;
  private battleMode = false;
  private intensity = 0;
  private nextBeat = 0;
  private beat = 0;
  private nextBell = 0;
  private nextPad = 0;

  constructor() {
    try { this.muted = localStorage.getItem(MUTE_KEY) === '1'; } catch { /* приватный режим */ }
    const unlock = () => this.unlock();
    addEventListener('pointerdown', unlock);
    addEventListener('keydown', unlock);
  }

  unlock() {
    if (!this.ctx) this.init();
    else if (this.ctx.state === 'suspended') this.ctx.resume();
  }

  setMuted(m: boolean) {
    this.muted = m;
    try { localStorage.setItem(MUTE_KEY, m ? '1' : '0'); } catch { /* приватный режим */ }
    if (this.ctx) this.master.gain.setTargetAtTime(m ? 0 : 0.8, this.ctx.currentTime, 0.05);
  }

  /** Музыка боя (барабаны) или меню (только эмбиент). */
  setBattle(on: boolean) { this.battleMode = on; this.intensity = 0; }
  /** Сколько «жара» в бою: от 0 до 1, сам затухает. */
  heat(v: number) { this.intensity = Math.min(1, this.intensity + v); }

  private master!: GainNode;

  private init() {
    const ctx = (this.ctx = new AudioContext());
    const comp = ctx.createDynamicsCompressor();
    this.master = ctx.createGain();
    this.master.gain.value = this.muted ? 0 : 0.8;
    this.master.connect(comp).connect(ctx.destination);
    this.sfx = ctx.createGain(); this.sfx.gain.value = 0.9; this.sfx.connect(this.master);
    this.music = ctx.createGain(); this.music.gain.value = 0.5; this.music.connect(this.master);
    const rev = ctx.createConvolver(); // реверберация: затухающий шум 3 секунды
    const len = ctx.sampleRate * 3, ir = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let c = 0; c < 2; c++) { const d = ir.getChannelData(c); for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.6); }
    rev.buffer = ir;
    this.wet = ctx.createGain(); this.wet.gain.value = 0.7;
    this.wet.connect(rev).connect(this.master);
    this.noise = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
    const n = this.noise.getChannelData(0);
    for (let i = 0; i < n.length; i++) n[i] = Math.random() * 2 - 1;
    this.drone();
    this.nextBeat = this.nextBell = this.nextPad = ctx.currentTime + 1;
    setInterval(() => this.schedule(), 100);
  }

  // ---------- строительные блоки ----------
  private route(node: AudioNode, bus: GainNode, e: Env) {
    let out: AudioNode = node;
    if (e.pan) { const p = this.ctx!.createStereoPanner(); p.pan.value = e.pan; out.connect(p); out = p; }
    out.connect(bus);
    if (e.wet) { const w = this.ctx!.createGain(); w.gain.value = e.wet; out.connect(w).connect(this.wet); }
  }

  private tone(f: number, dur: number, e: Env = {}, bus: GainNode = this.sfx) {
    const ctx = this.ctx; if (!ctx) return;
    const t = ctx.currentTime + (e.delay ?? 0), o = ctx.createOscillator(), g = ctx.createGain();
    o.type = e.type ?? 'sine';
    o.frequency.setValueAtTime(f, t);
    if (e.to) o.frequency.exponentialRampToValueAtTime(e.to, t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(e.gain ?? 0.3, t + Math.min(0.01, dur / 4));
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); this.route(g, bus, e);
    o.start(t); o.stop(t + dur + 0.05);
  }

  private burst(dur: number, kind: BiquadFilterType, f: number, e: Env = {}, bus: GainNode = this.sfx) {
    const ctx = this.ctx; if (!ctx) return;
    const t = ctx.currentTime + (e.delay ?? 0), s = ctx.createBufferSource(), fl = ctx.createBiquadFilter(), g = ctx.createGain();
    s.buffer = this.noise; s.loop = true;
    fl.type = kind; fl.frequency.value = f; fl.Q.value = 1.2;
    g.gain.setValueAtTime(e.gain ?? 0.3, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    s.connect(fl).connect(g); this.route(g, bus, e);
    s.start(t, rnd(0, 0.5)); s.stop(t + dur + 0.05);
  }

  // ---------- эффекты ----------
  click() { this.tone(1500, 0.04, { type: 'triangle', gain: 0.12 }); }
  order() { this.tone(820, 0.05, { type: 'triangle', gain: 0.1 }); }
  error() { this.tone(130, 0.18, { type: 'square', gain: 0.12, to: 90 }); }
  shot(pan = 0) { this.burst(0.09, 'bandpass', rnd(1700, 2600), { gain: 0.16, pan }); this.tone(rnd(150, 200), 0.09, { gain: 0.14, to: 60, pan }); }
  hit(pan = 0) { this.burst(0.12, 'lowpass', 700, { gain: 0.22, pan }); this.tone(95, 0.14, { gain: 0.25, to: 40, pan }); }
  death(pan = 0) { this.tone(rnd(200, 260), 0.35, { type: 'sawtooth', gain: 0.12, to: 50, pan }); this.burst(0.2, 'lowpass', 500, { gain: 0.15, pan }); }
  grenadeThrow(pan = 0) {
    this.burst(0.12, 'bandpass', 1800, { gain: 0.17, pan });
    this.tone(560, 0.19, { type: 'triangle', gain: 0.12, to: 240, pan });
  }
  grenadeImpact(pan = 0) {
    this.burst(0.52, 'lowpass', 450, { gain: 0.46, pan, wet: 0.3 });
    this.tone(115, 0.42, { gain: 0.4, to: 35, pan });
  }
  boom(pan = 0) { this.burst(0.9, 'lowpass', 300, { gain: 0.5, pan, wet: 0.5 }); this.tone(70, 0.9, { gain: 0.5, to: 28, pan, wet: 0.4 }); }
  built() { this.tone(392, 0.9, { gain: 0.22, wet: 0.5 }); this.tone(523, 0.8, { type: 'triangle', gain: 0.16, delay: 0.12, wet: 0.5 }); }
  trained() { this.tone(330, 0.12, { type: 'triangle', gain: 0.18 }); this.tone(495, 0.18, { type: 'triangle', gain: 0.16, delay: 0.1 }); }
  captured() { for (const f of [110, 166, 247, 331]) this.tone(f, 1.8, { gain: 0.18, wet: 0.8 }); }
  lost() { for (const f of [110, 104, 73]) this.tone(f, 1.6, { type: 'triangle', gain: 0.2, to: f * 0.8, wet: 0.8 }); }
  alarm() { for (const d of [0, 0.22]) this.tone(340, 0.18, { type: 'square', gain: 0.1, delay: d, to: 230 }); }
  win() { [146.8, 220, 293.7, 369.99].forEach((f, i) => this.tone(f, 2.8, { type: 'sawtooth', gain: 0.12, delay: i * 0.18, wet: 0.7 })); }
  lose() { this.tone(110, 3.2, { type: 'sawtooth', gain: 0.2, to: 41, wet: 0.8 }); this.burst(1.5, 'lowpass', 220, { gain: 0.3, wet: 0.6 }); }

  // ---------- музыка ----------
  private drone() {
    const ctx = this.ctx!, lp = ctx.createBiquadFilter();
    lp.type = 'lowpass'; lp.frequency.value = 260;
    const lfo = ctx.createOscillator(), depth = ctx.createGain();
    lfo.frequency.value = 0.06; depth.gain.value = 110;
    lfo.connect(depth).connect(lp.frequency); lfo.start();
    for (const [f, type, g] of [[55, 'sawtooth', 0.09], [55.35, 'sawtooth', 0.09], [82.4, 'sine', 0.1], [27.5, 'sine', 0.14]] as const) {
      const o = ctx.createOscillator(), gn = ctx.createGain();
      o.type = type; o.frequency.value = f; gn.gain.value = g;
      o.connect(gn).connect(lp); o.start();
    }
    lp.connect(this.music);
    const w = ctx.createGain(); w.gain.value = 0.4; lp.connect(w).connect(this.wet);
  }

  private pad() {
    const root = pick([110, 98, 82.4, 87.3]), chord = [1, 1.2, 1.5, 2]; // минорные созвучия
    for (const m of chord) this.tone(root * m, 9, { type: 'triangle', gain: 0.05, wet: 1 }, this.music);
  }

  private schedule() {
    const ctx = this.ctx; if (!ctx || this.muted || ctx.state !== 'running') return;
    const now = ctx.currentTime;
    this.intensity = Math.max(0, this.intensity - 0.1 * 0.15);
    if (now > this.nextPad) { this.pad(); this.nextPad = now + rnd(11, 16); }
    if (now > this.nextBell) {
      this.tone(pick([440, 523.3, 659.3, 784, 392]), 3.5, { gain: 0.07, wet: 1 }, this.music);
      this.nextBell = now + rnd(4, 10);
    }
    if (this.battleMode) { // барабаны: пульс 66 -> 100 уд/мин по мере накала боя
      const step = 60 / (66 + this.intensity * 34);
      while (this.nextBeat < now + 0.2) {
        const t = this.nextBeat - now, accent = this.beat % 4 === 0, v = 0.18 + this.intensity * 0.3;
        this.tone(accent ? 95 : 80, 0.28, { gain: accent ? v * 1.6 : v, to: 38, delay: Math.max(0, t), wet: 0.3 }, this.music);
        if (this.intensity > 0.45) this.burst(0.07, 'bandpass', 900, { gain: 0.05 + this.intensity * 0.08, delay: Math.max(0, t + step / 2) }, this.music);
        this.beat++;
        this.nextBeat += step;
      }
    } else this.nextBeat = now;
  }
}

export const audio = new Sound();
