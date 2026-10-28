// Расы из модов DoW: родные модели, анимации и иконки (.whm/.rsh/.tga из ua/, сервер разработки отдаёт их по /ua/).
// Какой вид каким отрядом мода закрыт — MOD_RACES в shared/sim.ts (оттуда же модель и иконка); здесь — только папки мода и слои оружия.
// Файлов нет (на сервере нет ua/ или ua-slim/) — ничего не грузится и остаются процедурные модели.
import * as THREE from 'three';
import { clone } from 'three/examples/jsm/utils/SkeletonUtils.js';
import { buildWhm, meshVisible, parseRsh, parseWhe, parseWhm, wheMotions, type Whe } from '../whm.ts';
import { DOW_M, isStruct, MOD_RACES, UA_WEAPONS, type Kind } from '../../shared/sim.ts';
import type { FactionId } from '../../shared/factions.ts';
import type { FactionId as Pack } from './faction-models.ts';

type Art = {
  base: string[]; // папки Data: сначала UA, потом модули, на которые он опирается (Tyranids_Art)
  layers?: Partial<Record<Kind, string[]>>; // vis-слои (оружие) под стволы, которые берёт баланс
  hero?: Record<string, string[]>; // слои героя по сборке
  tier?: Partial<Record<Kind, (level: number) => string[]>>; // слои построек по уровню
  extra?: Partial<Record<Kind, string>>; // постройки, которых нет в моде, — подходящая модель из набора
  legend?: string[][]; // слои легенд по номеру призыва
};
export const ART: Partial<Record<FactionId, Art>> = {
  tyranids: {
    base: ['/ua/UltimateApocalypse_THB/data/', '/ua/Tyranids_Art/Data/'],
    layers: { heavy: ['vis_devourer', 'vis_scythingtalons', 'vis_crest_1'], support: ['vis_vis_devourer'], elite: ['vis_rendingclaws'], mveh: ['vis_bs', 'vis_stfr'], hveh: ['vis_dvfr', 'vis_dvbk'], captain: ['vis_bw', 'vis_extcaparace'] },
    hero: { assault: ['vis_bw', 'vis_extcaparace'], commander: ['vis_wings', 'vis_sth'], mystic: ['vis_vc', 'vis_sth'] },
    tier: { hq: (l) => [`vis_vis_${l}`], post: (l) => [`vis_stage_${l}`, 'vis_claws'] },
    extra: { key4: 'races/tyranids/structures/stealerhive', gate: 'races/tyranids/structures/drop_building' },
  },
  inquisition: {
    base: ['/ua/UltimateApocalypse_THB/data/'],
    layers: {
      captain: ['vis_base', 'vis_fur', 'vis_trinkets', 'vis_boltpistol', 'vis_daemonhammer'], guard: ['vis_stormbolter', 'vis_force_sword', 'vis_shoulder_pad_1', 'vis_sceaux_1', 'vis_no_flag'],
      elite: ['vis_stormbolter', 'vis_hallebarde', 'vis_ref_shoulder_01', 'vis_torso_icon_01', 'vis_belt_detail_01'], support: ['vis_vis_default', 'vis_hellgun', 'vis_no_flag', 'vis_sceau_hellgun', 'vis_breath_1'],
      mveh: ['vis_psycannon', 'vis_melee_l', 'vis_sarcophigus_1', 'vis_top_decoration_1'], jet: ['vis'],
    },
    legend: [['vis_base', 'vis_sword_regular', 'vis_banner'], ['vis_main_body_fx', 'vis_gatling_right'], []],
  },
};
/** Масштаб моделей мода (метры DoW → метры игры), один на все: в масштабе DoW (×DOW_M) здания вдвое шире своих следов в сетке,
 *  поэтому все модели — 0.6 от него (медиана подгонки зданий под их ширину в игре); пропорции юнитов и зданий — как в DoW. */
export const UA_SCALE = DOW_M * 0.6;
/** Юниты мода — 1:1 с DoW (×DOW_M, как дальность, обзор и скорость): при 0.6 бойцы были мелкими на карте ×2. Здания — UA_SCALE, под следы в сетке. */
export const uaScale = (kind: Kind) => (isStruct(kind) ? UA_SCALE : DOW_M);
/** Пакет 3D-моделей → фракция мода (Инквизиция стоит на пакете космодесанта). */
const PACK_RACE: Partial<Record<Pack, FactionId>> = { tyranids: 'tyranids', legion: 'inquisition' };

/** Движение игры → клип мода: первый подходящий по имени, без служебных вариантов (под огнём, укрытие, синк-киллы…). */
const SKIP = /cover|under|sync|thrown|low|old|backup|placement|damage|dmg|block|aim|track|vis_|charge|beroc|blank|frontend|ref$/;
const WANT: Record<string, RegExp[]> = {
  idle: [/^idle/], walk: [/^(move|run|walk)/], run: [/^(move|run|walk)/], shoot: [/fire|firing|shoot/, /^idle/], attack: [/melee/, /fire|shoot/],
  death: [/^(die|death)/], build: [/^build/], work: [/^build/, /^idle/], capture: [/capture|flag/, /^idle/],
};

type Template = ReturnType<typeof buildWhm>;
const templates = new Map<string, Template>(); // ключ — база мода + путь модели
const whes = new Map<string, Whe>(); // дерево действий модели (.whe): какой клип DoW ставит на выстрел и удар
const textures = new Map<string, Promise<THREE.Texture | null>>();
const icons = new Map<string, string>(); // ключ — фракция/вид[/вариант]

/** Первый ответивший файл из папок мода. */
async function first(bases: string[], path: string) {
  for (const b of bases) { const res = await fetch(b + path); if (res.ok) return res; }
  return null;
}
function texture(base: string[], path: string) {
  const key = base.join('|') + path;
  if (!textures.has(key)) textures.set(key, first(base, path + '.rsh').then(async (res) => {
    if (!res) return null;
    const t = parseRsh(await res.arrayBuffer()), tex = new THREE.DataTexture(t.rgba, t.width, t.height);
    tex.colorSpace = THREE.SRGBColorSpace; tex.generateMipmaps = true; tex.minFilter = THREE.LinearMipmapLinearFilter; tex.magFilter = THREE.LinearFilter; tex.needsUpdate = true;
    return tex;
  }).catch(() => null));
  return textures.get(key)!;
}
async function load(base: string[], model: string) {
  const res = await first(base, 'art/ebps/' + model + '.whm');
  if (!res) return;
  const m = parseWhm(await res.arrayBuffer());
  const whe = await first(base, 'art/ebps/' + model + '.whe').catch(() => null);
  if (whe) try { whes.set(model, parseWhe(await whe.arrayBuffer())); } catch { /* без дерева — клипы по именам */ }
  const paths = [...new Set(m.meshes.flatMap((s) => s.groups.map((g) => g.texture.toLowerCase())))];
  const tex = new Map(await Promise.all(paths.map(async (p) => [p, await texture(base, p)] as const)));
  templates.set(model, buildWhm(m, (p) => tex.get(p) ?? null));
}

/** Несжатый TGA 24/32 бита (иконки модов такие) → data:-URL PNG. */
function tgaUrl(b: ArrayBuffer) {
  const v = new DataView(b), w = v.getUint16(12, true), h = v.getUint16(14, true), bpp = v.getUint8(16) / 8, top = v.getUint8(17) & 0x20, o = 18 + v.getUint8(0);
  if (v.getUint8(2) !== 2 || (bpp !== 3 && bpp !== 4)) return null;
  const img = new ImageData(w, h), src = new Uint8Array(b, o, w * h * bpp);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const s = ((top ? y : h - 1 - y) * w + x) * bpp, d = (y * w + x) * 4;
    img.data[d] = src[s + 2]; img.data[d + 1] = src[s + 1]; img.data[d + 2] = src[s]; img.data[d + 3] = bpp === 4 ? src[s + 3] : 255;
  }
  const c = document.createElement('canvas');
  c.width = w; c.height = h; c.getContext('2d')!.putImageData(img, 0, 0);
  return c.toDataURL();
}
async function loadIcon(key: string, base: string[], icon: string) {
  for (const ext of ['.tga', '.TGA']) {
    const res = await first(base, 'art/ui/ingame/' + icon.replace(/\\/g, '/').replace(/\.tga$/i, '') + ext);
    const url = res && tgaUrl(await res.arrayBuffer());
    if (url) { icons.set(key, url); return; }
  }
}

/** Модель и иконка вида у фракции мода (легенда — по номеру призыва). */
export function entry(f: FactionId, kind: Kind, variant = 0) {
  const race = MOD_RACES[f as keyof typeof MOD_RACES], art = ART[f];
  if (!race || !art) return null;
  const id = kind === 'legend' ? race.legends[variant] : (race.unit as Partial<Record<Kind, string>>)[kind], b = (race.build as Partial<Record<Kind, string>>)[kind];
  const u = id ? race.data.squads[id]?.unit : b ? race.data.buildings[b] : undefined;
  const model = (u as { model?: string } | undefined)?.model || art.extra?.[kind];
  return model ? { art, model, icon: (u as { icon?: string } | undefined)?.icon ?? '' } : null;
}

/** Иконка мода по пути из его данных (ствол в панели отряда): грузится при первом запросе, до того — null. */
const asked = new Set<string>();
export function uaArtIcon(f: FactionId, icon: string) {
  const key = `${f}/i/${icon}`, base = ART[f]?.base;
  if (!icons.has(key) && base && icon && !asked.has(key)) { asked.add(key); void loadIcon(key, base, icon).catch(() => {}); }
  return icons.get(key) ?? null;
}
/** Иконка мода для вида или null (мода нет / ещё грузится). */
export const uaIcon = (kind: Kind, variant = 0, f: FactionId = 'tyranids') => icons.get(`${f}/${kind}${kind === 'legend' ? '/' + variant : ''}`) ?? null;

/** Грузит модели и иконки всех рас из модов один раз; запускается при открытии страницы, до начала матча. */
export const uaReady = typeof fetch !== 'undefined' && typeof document !== 'undefined' ? Promise.all((Object.keys(ART) as FactionId[]).flatMap((f) => {
  const race = MOD_RACES[f as keyof typeof MOD_RACES], kinds = [...Object.keys(race.unit), ...Object.keys(race.build), ...Object.keys(ART[f]!.extra ?? {})] as Kind[];
  const all = [...kinds.map((k) => [k, 0] as const), ...race.legends.map((_, i) => ['legend', i] as const)];
  return all.flatMap(([k, v]) => {
    const e = entry(f, k as Kind, v);
    if (!e) return [];
    return [load(e.art.base, e.model).catch((err) => console.warn('UA', e.model, err)), e.icon ? loadIcon(`${f}/${k}${k === 'legend' ? '/' + v : ''}`, e.art.base, e.icon).catch(() => {}) : Promise.resolve()];
  });
})) : Promise.resolve([]);

/** Движения выстрела и удара из .whe под стволы юнита (DoW: действие default с огнём и melee_attack) — с клипом, без прицела и слоёв видимости. */
export function fireMotions(w: Whe, motion: string, weapons: string[]) {
  const act = motion === 'shoot' ? 'default' : motion === 'attack' ? 'melee_attack' : '';
  return act ? wheMotions(w, act, { moving: false, firing: motion === 'shoot' }, weapons).filter((m) => { const n = w.motions.get(m)!.anim!; return /fire|firing|shoot|melee|attack|strike/i.test(n) && !/aim|track|^vis|^ref/i.test(n); }) : [];
}

const BLEND_MS = 150;
export class UAActor {
  readonly root = new THREE.Group();
  private mixer: THREE.AnimationMixer;
  private meshes: THREE.Object3D[] = [];
  private clip: THREE.AnimationClip | null = null;
  private picks = new Map<string, THREE.AnimationClip | null>();
  constructor(private t: Template, private layers: string[], private buildTime = 1, private whe?: Whe, private weapons: string[] = []) {
    const model = clone(t.root);
    model.traverse((o) => { if ((o as THREE.SkinnedMesh).isSkinnedMesh) this.meshes.push(o); });
    this.root.add(model);
    this.mixer = new THREE.AnimationMixer(model);
    // поворот башни, как в DoW: клип aim_horiz — полный оборот кости прицела, доля клипа = угол (0 → +Z модели, растёт к +X)
    const aim = t.clips.find((c) => c.name === 'aim_horiz');
    if (aim) for (const tr of aim.tracks) if (tr.values.some((v, i) => v !== tr.values[i % 4])) { // только кости, которые клип вращает
      const bone = model.getObjectByName(tr.name.replace(/\.quaternion$/, ''));
      if (bone) this.aimers.push({ bone, at: (tr as unknown as { createInterpolant(): THREE.Interpolant }).createInterpolant(), d: aim.duration });
    }
    this.pose('idle', 0);
  }
  private aimers: { bone: THREE.Object3D; at: THREE.Interpolant; d: number }[] = [];
  private yaw: number | null = null;
  /** Угол башни в осях модели (как rotation.y у юнитов: 0 — +Z). Модели без aim_horiz не поворачиваются. */
  aim(yaw: number) { this.yaw = yaw; }
  private pick(motion: string) {
    if (!this.picks.has(motion)) {
      const clips = this.t.clips.filter((c) => !SKIP.test(c.name));
      // выстрел и удар — как в моде: клип из дерева действий .whe под стволы этого юнита; его события (вспышка, снаряд) — для world3d
      const ms = this.whe ? fireMotions(this.whe, motion, this.weapons) : [];
      const own = ms.map((m) => this.t.clips.find((c) => c.name.toLowerCase() === this.whe!.motions.get(m)!.anim!.toLowerCase())).find(Boolean);
      this.evs.set(motion, ms.flatMap((m) => this.whe!.motions.get(m)!.ev ?? []).flatMap(([n, t]) => { const e = this.whe!.events.get(n); return e?.fx ? [{ e, t: Math.max(0, t) }] : []; }));
      if (own) { this.picks.set(motion, own); return own; }
      this.picks.set(motion, (WANT[motion] ?? []).concat(WANT.idle).map((re) => clips.find((c) => re.test(c.name))).find(Boolean) ?? this.t.clips[0] ?? null);
    }
    return this.picks.get(motion)!;
  }
  /** Стройка Инквизиции в моде — цепочка клипов build1…buildN. Посадку и взлёт капсулы (над зданием на 90–130 м) не играем:
   *  в нашей косой проекции высота уходит вверх экрана — модель «летала по карте». */
  private seq?: THREE.AnimationClip[];
  private buildSeq() {
    return this.seq ??= this.t.clips.filter((c) => /^build\d/i.test(c.name) && !/^build0|landing|takeoff|descente/i.test(c.name))
      .sort((a, b) => parseInt(a.name.slice(5)) - parseInt(b.name.slice(5)));
  }
  private evs = new Map<string, { e: Record<string, string>; t: number }[]>();
  /** События эффектов движения: fx (у маркера) и fx_other (от маркера к цели), t — с от начала клипа. */
  fxEvents(motion: string) { this.pick(motion); return this.evs.get(motion) ?? []; }
  /** Маркер модели (кость marker_*), куда DoW ставит эффект. */
  marker(name: string) { return this.root.getObjectByName(name); }
  pose(motion: string, t: number) {
    const seq = motion === 'build' ? this.buildSeq() : [];
    let clip = this.pick(motion);
    if (seq.length) { // доля готовности → клип цепочки и время в нём
      let left = Math.min(t / this.buildTime, 1) * seq.reduce((a, c) => a + c.duration, 0);
      clip = seq.find((c) => (left -= c.duration) < 0) ?? seq[seq.length - 1];
      t = Math.max(0, clip.duration + Math.min(0, left)) * (this.buildTime / Math.max(1e-3, clip.duration)); // ниже снова делится на buildTime
    }
    if (!clip) return;
    const now = typeof performance !== 'undefined' ? performance.now() : 0;
    if (clip !== this.clip) { // смена клипа — короткое смешивание со старым, а не рывок позы (idle → выстрел → idle)
      this.mixer.stopAllAction();
      this.prev = this.clip && motion !== 'death' ? this.mixer.clipAction(this.clip) : null;
      if (this.prev) { this.prev.play(); this.prev.time = this.prevT; }
      this.clip = clip; this.since = now;
      this.mixer.clipAction(clip).play();
      for (const m of this.meshes) m.visible = meshVisible(this.t.vis, clip.name, this.layers, m.name);
    }
    const w = this.prev ? Math.min(1, (now - this.since) / BLEND_MS) : 1;
    this.mixer.clipAction(clip).setEffectiveWeight(w);
    if (this.prev) { if (w >= 1) { this.prev.stop(); this.prev = null; } else this.prev.setEffectiveWeight(1 - w); }
    const d = clip.duration || 1;
    // стройка приходит в секундах процедурной модели — переводим в долю
    // смерть и выстрел/удар не зацикливаются: выстрел играет клип один раз с момента выстрела (время отсчитывает world3d)
    this.mixer.clipAction(clip).time = motion === 'death' || ((motion === 'shoot' || motion === 'attack') && /fire|shoot|melee|attack|strike/i.test(clip.name)) ? Math.min(t, d - 1e-3) : motion === 'build' ? Math.min(t / this.buildTime, 1) * (d - 1e-3) : t % d;
    this.prevT = this.mixer.clipAction(clip).time;
    this.mixer.update(0);
    if (this.yaw !== null && motion !== 'build' && motion !== 'death') {
      const f = ((this.yaw / (2 * Math.PI)) % 1 + 1) % 1;
      for (const a of this.aimers) a.bone.quaternion.fromArray(a.at.evaluate(f * a.d));
    }
  }
  private prev: THREE.AnimationAction | null = null;
  private prevT = 0;
  private since = 0;
}

/** Слои по умолчанию, если не заданы руками: «база» (vis_base/main/master/default/body…) и части под стволы, которые взял баланс (lascannon → vis_…lascannon).
 *  Без этого модель показывает все варианты оружия разом — как наложенные друг на друга. ponytail: эвристика по именам; точнее — разбор движений .whe. */
const BASE_LAYER = /^vis_(vis_)?(base|main|master|default|body|main_body|setup|config)/;
function autoLayers(t: Template, f: FactionId, kind: Kind) {
  const vis = [...t.vis.keys()].filter((n) => n.startsWith('vis'));
  if (!vis.length) return [];
  const words = new Set((UA_WEAPONS[f]?.[kind] ?? []).flatMap((w) => w.toLowerCase().split(/[_\W]+/)).filter((w) => w.length > 3 && !/^(tyranids|inquisition|daemonhunt|space|marine|marines|guard|weapon|melee|ranged|heavy|grey|knight|knights|squad|dummy)$/.test(w)));
  const picked = vis.filter((n) => BASE_LAYER.test(n) || [...words].some((w) => n.includes(w)));
  return picked.length ? picked : [vis[0]]; // ничего не совпало — первый вариант, а не все сразу
}

/** Фабрика актёра мода для пакета и вида или null, если расы в модах нет (или модель ещё не загрузилась). */
export function uaActor(pack: Pack, kind: Kind, variant?: string, buildTime = 1, level = 1): (() => UAActor) | null {
  const f = PACK_RACE[pack], e = f && entry(f, kind, kind === 'legend' ? Number(variant?.slice(6)) || 0 : 0), t = e && templates.get(e.model);
  if (!e || !t) return null;
  const layers = (kind === 'legend' && e.art.legend?.[Number(variant?.slice(6)) || 0]) || (kind === 'captain' && variant && e.art.hero?.[variant]) || e.art.tier?.[kind]?.(Math.min(3, level)) || e.art.layers?.[kind] || autoLayers(t, f!, kind);
  return () => new UAActor(t, layers, buildTime, whes.get(e.model), UA_WEAPONS[f!]?.[kind]);
}
