/** Derive export/audit coverage from the factories instead of a second, stale role list. */
import { access } from 'node:fs/promises';
import { tsImport } from 'tsx/esm/api';

const factory = await tsImport('../client/faction-models.ts', import.meta.url);
async function optionalFactory(path) {
  const url = new URL(path, import.meta.url);
  try { await access(url); }
  catch (error) { if (error.code !== 'ENOENT') throw error; return undefined; }
  return tsImport(url.href, import.meta.url);
}
const structures = await optionalFactory('../client/structure-models.ts');
const effects = await optionalFactory('../client/effect-models.ts');

export const FACTIONS = Object.keys(factory.FACTION_ART);
export const UNITS = [...factory.UNIT_ROLES];
export const BUILDINGS = [...(structures?.STRUCTURE_ROLES ?? factory.BUILDING_ROLES)];
export const COMMON_FACTION = 'common';
export const EFFECTS = [...(effects?.EFFECT_ROLES ?? [])];
export const ACTIONS = Object.fromEntries(UNITS.map(role => [role, [...new Set(factory.ROLE_MOTIONS[role])]]));
export const BUILDING_ACTIONS = Object.fromEntries(BUILDINGS.map(role => [role, [...new Set(structures?.STRUCTURE_ROLE_MOTIONS[role] ?? [])]]));
export const EFFECT_ACTIONS = Object.fromEntries(EFFECTS.map(role => [role, [...new Set(effects.EFFECT_ROLE_MOTIONS[role])]]));
export const motions = role => ACTIONS[role] ?? BUILDING_ACTIONS[role] ?? EFFECT_ACTIONS[role] ?? [];
export const modelSource = role => EFFECTS.includes(role) ? 'client/effect-models.ts' : UNITS.includes(role) ? 'client/faction-models.ts' : structures ? 'client/structure-models.ts' : 'client/faction-models.ts';
/** Global effects are single assets, not six faction copies. */
export const ASSET_TARGETS = [
  ...FACTIONS.flatMap(faction => [...UNITS, ...BUILDINGS].map(role => ({ faction, role }))),
  ...EFFECTS.map(role => ({ faction: COMMON_FACTION, role })),
];
