/** Authored symmetrical skirmish map presets for the asset lab and future match selection. */
export type MapBiome = 'ash' | 'desert' | 'tomb' | 'ruins' | 'warp' | 'webway';
export type SiteType = 'strategic' | 'relic' | 'critical';
export type MapSite = { x: number; z: number; type: SiteType };
export type BattleMap = { id: string; name: string; biome: MapBiome; size: [number, number]; starts: [number, number][]; sites: MapSite[]; description: string };
const mirror = (sites: MapSite[]): MapSite[] => sites.flatMap(s => [s, { ...s, x: -s.x, z: -s.z }]);
export const BATTLE_MAPS: BattleMap[] = [
  { id:'ash-wastes',name:'Пепельные пустоши',biome:'ash',size:[60,45],starts:[[-24,-17],[24,17]],description:'Обожжённая равнина с открытым центром и фланговыми ресурсами.',sites:[{x:0,z:0,type:'critical'},...mirror([{x:13,z:8,type:'strategic'},{x:0,z:14,type:'relic'}])] },
  { id:'tomb-world',name:'Мир-гробница',biome:'tomb',size:[64,48],starts:[[-25,0],[25,0]],description:'Некронские обелиски и древние энергетические узлы.',sites:[{x:0,z:0,type:'relic'},...mirror([{x:14,z:11,type:'strategic'},{x:13,z:-11,type:'critical'}])] },
  { id:'broken-cathedral',name:'Разрушенный собор',biome:'ruins',size:[60,50],starts:[[-23,-18],[23,18]],description:'Развалины храмового комплекса, узкие проходы и реликвия в центре.',sites:[{x:0,z:0,type:'relic'},...mirror([{x:15,z:4,type:'strategic'},{x:4,z:15,type:'critical'}])] },
  { id:'red-dunes',name:'Красные дюны',biome:'desert',size:[70,48],starts:[[-28,0],[28,0]],description:'Простор для техники, обходов и артиллерии.',sites:[{x:0,z:0,type:'critical'},...mirror([{x:16,z:13,type:'strategic'},{x:16,z:-13,type:'strategic'},{x:5,z:0,type:'relic'}])] },
  { id:'warp-rift',name:'Разлом Варпа',biome:'warp',size:[58,48],starts:[[-22,-18],[22,18]],description:'Осквернённые алтари, нестабильные порталы и огненные трещины.',sites:[{x:0,z:0,type:'critical'},...mirror([{x:12,z:12,type:'relic'},{x:17,z:-4,type:'strategic'}])] },
  { id:'webway',name:'Врата Паутины',biome:'webway',size:[62,46],starts:[[-24,0],[24,0]],description:'Осколки эльдарских арок и опасные открытые коридоры.',sites:[{x:0,z:0,type:'relic'},...mirror([{x:13,z:12,type:'strategic'},{x:13,z:-12,type:'critical'}])] },
];
export function getBattleMap(id: string): BattleMap { return BATTLE_MAPS.find(m => m.id === id) ?? BATTLE_MAPS[0]; }
