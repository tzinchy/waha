/** Drukhari special abilities. Server-side authority must enforce cooldown and detection. */
export type AbilityId = 'shadowfield' | 'night_veil' | 'webway_blink' | 'poison_blades' | 'soul_harvest';
export type AbilitySpec = { id: AbilityId; name: string; duration: number; cooldown: number; energy: number; description: string };
export const DRUKHARI_ABILITIES: Record<AbilityId, AbilitySpec> = {
  shadowfield: { id:'shadowfield',name:'Теневое поле',duration:9,cooldown:35,energy:50,description:'Маскировка героя. Атака раскрывает владельца.' },
  night_veil: { id:'night_veil',name:'Покров ночи',duration:7,cooldown:45,energy:70,description:'Краткая маскировка ближайшего отряда.' },
  webway_blink: { id:'webway_blink',name:'Прыжок через Паутину',duration:0,cooldown:22,energy:45,description:'Телепорт на небольшое расстояние.' },
  poison_blades: { id:'poison_blades',name:'Отравленные клинки',duration:12,cooldown:30,energy:35,description:'Ближние удары накладывают периодический урон.' },
  soul_harvest: { id:'soul_harvest',name:'Жатва душ',duration:10,cooldown:55,energy:75,description:'Усиление скорости атак после убийства.' },
};
export type StealthState = { until: number; revealedUntil: number };
export function isStealthed(state: StealthState, now: number, detectorDistance: number, detectionRadius = 6) {
  return now < state.until && now >= state.revealedUntil && detectorDistance > detectionRadius;
}
export function applyStealth(state: StealthState, now: number, ability: 'shadowfield' | 'night_veil') {
  return { ...state, until: now + DRUKHARI_ABILITIES[ability].duration };
}
export function revealOnAttack(state: StealthState, now: number) {
  return { ...state, revealedUntil: Math.max(state.revealedUntil, now + 3) };
}
