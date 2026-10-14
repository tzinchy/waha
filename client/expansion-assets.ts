/**
 * RTS expansion asset definitions. Visual prototypes for the asset laboratory;
 * these are not wired into the authoritative multiplayer simulation yet.
 *
 * Original procedural assets inspired by grimdark sci-fi, not copied from mods.
 */
import * as THREE from 'three';
import type { FactionId } from './faction-models.ts';

export type CaptureKind = 'strategic' | 'relic' | 'critical';
export const CAPTURE_SITES: Record<CaptureKind, { name: string; color: number; radius: number; seconds: number }> = {
  strategic: { name: 'Стратегическая точка', color: 0x70a9a0, radius: 3, seconds: 12 },
  relic: { name: 'Реликтовая точка', color: 0xe2bd69, radius: 4, seconds: 18 },
  critical: { name: 'Ключевая точка', color: 0xe7684b, radius: 5, seconds: 24 },
};

export type EquipmentSlot = 'weapon' | 'armor' | 'relic' | 'mobility';
export type EquipmentUpgrade = { id: string; name: string; slot: EquipmentSlot; level: number; cost: number; effect: string };
export const EQUIPMENT_UPGRADES: EquipmentUpgrade[] = [
  { id: 'weapon_1', name: 'Усиленный боекомплект', slot: 'weapon', level: 1, cost: 100, effect: '+10% урона' },
  { id: 'weapon_2', name: 'Реликтовое оружие', slot: 'weapon', level: 2, cost: 250, effect: '+20% урона' },
  { id: 'armor_1', name: 'Укреплённые пластины', slot: 'armor', level: 1, cost: 100, effect: '+15% здоровья' },
  { id: 'armor_2', name: 'Адамантиевый панцирь', slot: 'armor', level: 2, cost: 250, effect: '+30% здоровья' },
  { id: 'relic_1', name: 'Энергетический фокус', slot: 'relic', level: 1, cost: 125, effect: '-10% перезарядки' },
  { id: 'relic_2', name: 'Древний артефакт', slot: 'relic', level: 2, cost: 300, effect: '-20% перезарядки' },
  { id: 'mobility_1', name: 'Сервоприводы', slot: 'mobility', level: 1, cost: 110, effect: '+10% скорости' },
  { id: 'mobility_2', name: 'Фазовые ускорители', slot: 'mobility', level: 2, cost: 280, effect: '+20% скорости' },
];
export function upgradeMultiplier(slot: EquipmentSlot, level: number) {
  const l = Math.max(0, Math.min(2, Math.floor(level)));
  return slot === 'weapon' ? 1 + l * 0.1 : slot === 'armor' ? 1 + l * 0.15 : slot === 'mobility' ? 1 + l * 0.1 : 1 - l * 0.1;
}

export const EXPANSION_ROSTER: Partial<Record<FactionId, { infantry: string[]; heroes: string[]; vehicles: string[]; buildings: string[] }>> = {
  necrons: {
    infantry: ['Воин', 'Бессмертный', 'Личгвардеец', 'Смертоносец', 'Криптек', 'Скарабеи'],
    heroes: ['Повелитель', 'Оверлорд', 'Ктан'],
    vehicles: ['Призрачный ковчег', 'Аннигиляционная баржа', 'Монолит'],
    buildings: ['Монолит-штаб', 'Гробница', 'Гаусс-пилон', 'Портал пробуждения', 'Реактор'],
  },
  drukhari: {
    infantry: ['Кабалит', 'Ведьма', 'Инкуб', 'Мандрагора', 'Бич', 'Геллион'],
    heroes: ['Архонт', 'Суккуб', 'Гомункул'],
    vehicles: ['Рейдер', 'Опустошитель', 'Ривер'],
    buildings: ['Цитадель кабала', 'Арена ведьм', 'Тёмная кузня', 'Портал паутины', 'Башня мучений'],
  },
  daemons: {
    infantry: ['Кровопускатель', 'Ужас', 'Чумоносец', 'Демонетка', 'Фурия', 'Пламенник'],
    heroes: ['Кровожад', 'Повелитель перемен', 'Великий Нечистый', 'Хранитель секретов'],
    vehicles: ['Колесница варпа', 'Демонический шагоход', 'Адская машина'],
    buildings: ['Разлом варпа', 'Алтарь призыва', 'Обелиск порчи', 'Кузня душ', 'Врата апокалипсиса'],
  },
};

export type EffectKind = 'explosion' | 'splash' | 'fire' | 'nuclear';
export type EffectPreset = { radius: number; duration: number; particles: number; color: number; secondary: number };
export const EFFECTS: Record<EffectKind, EffectPreset> = {
  explosion: { radius: 3, duration: 0.9, particles: 36, color: 0xffaa32, secondary: 0x44444c },
  splash: { radius: 5, duration: 0.65, particles: 24, color: 0xf2d88a, secondary: 0xe04e38 },
  fire: { radius: 1.6, duration: 5, particles: 48, color: 0xff7327, secondary: 0xffdd5e },
  nuclear: { radius: 28, duration: 8, particles: 220, color: 0xffe9b0, secondary: 0x5e5551 },
};

/** Visual-only particle effect. Caller updates the effect every frame and disposes it. */
export class BattleEffect {
  readonly root = new THREE.Group();
  private readonly dots: { mesh: THREE.Mesh; direction: THREE.Vector3; speed: number; phase: number }[] = [];
  private readonly geometry = new THREE.IcosahedronGeometry(0.12, 0);
  private readonly materials: THREE.MeshBasicMaterial[];
  private time = 0;
  private readonly preset: EffectPreset;
  constructor(readonly kind: EffectKind, position = new THREE.Vector3()) {
    this.preset = EFFECTS[kind];
    this.root.position.copy(position);
    this.materials = [this.preset.color, this.preset.secondary].map(color => new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.9, depthWrite: false }));
    for (let i = 0; i < this.preset.particles; i++) {
      const a = i * 2.399963229728653, u = (i + 0.5) / this.preset.particles;
      const direction = new THREE.Vector3(Math.cos(a) * Math.sqrt(1 - u * u), u, Math.sin(a) * Math.sqrt(1 - u * u));
      const mesh = new THREE.Mesh(this.geometry, this.materials[i % 2]);
      const phase = (i * 0.61803398875) % 1;
      mesh.scale.setScalar(kind === 'nuclear' ? 2.5 : 1);
      this.root.add(mesh);
      this.dots.push({ mesh, direction, speed: 0.35 + phase * 0.65, phase });
    }
  }
  update(dt: number) {
    this.time += Math.max(0, dt);
    const t = Math.min(1, this.time / this.preset.duration);
    for (const dot of this.dots) {
      const rise = this.kind === 'fire' ? (this.time * 1.8 + dot.phase * 2) % 3 : t * this.preset.radius * dot.speed;
      const radius = this.kind === 'fire' ? this.preset.radius * (0.25 + dot.phase * 0.65) : rise;
      dot.mesh.position.set(dot.direction.x * radius, this.kind === 'nuclear' ? Math.sin(t * Math.PI) * 12 + dot.direction.y * radius : this.kind === 'fire' ? rise : dot.direction.y * radius, dot.direction.z * radius);
      const fade = this.kind === 'fire' ? 1 - (rise / 3) : 1 - t;
      dot.mesh.scale.setScalar(Math.max(0.01, fade * (this.kind === 'nuclear' ? 4 : 1.5)));
      dot.mesh.visible = fade > 0.02;
    }
    return this.time < this.preset.duration;
  }
  dispose() {
    this.root.removeFromParent();
    this.geometry.dispose();
    this.materials.forEach(m => m.dispose());
  }
}
