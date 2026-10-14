// Shared production presets. Prompts describe one isolated asset, not a roster image.
export const ART_DIRECTION = {
  version: 1,
  format: 'glTF 2.0 binary (.glb), meters, Y-up, forward +Z',
  aesthetic: 'detailed grimdark science-fiction RTS, gothic military architecture, worn hard-surface materials, original faction insignia',
  pixelPresentation: {
    method: 'Render actual 3D geometry at low resolution with nearest-neighbor upscale; keep the geometry and animation continuous.',
    targetCharacterHeightPx: [48, 80],
    screenPixelSize: [2, 3],
    textureFilter: 'nearest',
    note: 'Art target only: the current ASCII pass is not a pixel renderer.',
  },
  production: {
    characterTextureResolution: '1k',
    buildingTextureResolution: '2k',
    lodTriangleRatios: [1, 0.5, 0.2],
    materials: ['team_primary', 'team_trim', 'metal', 'cloth', 'emissive'],
    maxMaterialsPerAsset: 5,
    rootMotion: false,
    animationFps: 30,
    referenceCamera: { elevationDegrees: 35, azimuthDegrees: 45, light: 'upper left' },
    note: 'Budgets, semantic materials and LODs must be checked after generation; a text prompt cannot guarantee them.',
  },
};

export const ANIMATION_PRESETS = {
  idle: { duration: 2, loop: true, intent: 'subtle breathing and weight shifts; weapon remains held; no root displacement' },
  walk: { duration: 1, loop: true, intent: 'in-place full stride; foot contacts and arm motion match the faction silhouette' },
  run: { duration: 0.65, loop: true, intent: 'in-place locomotion; stable held weapon and no foot sliding' },
  attack: { duration: 0.7, loop: false, impactTime: 0.35, intent: 'readable weapon windup, melee strike, recovery; keep both hands attached to held props' },
  shoot: { duration: 0.45, loop: false, impactTime: 0.1, intent: 'two-handed aim and recoil; use a separate muzzle-flash effect' },
  work: { duration: 1.1, loop: true, impactTime: 0.55, intent: 'tool action towards a building at chest height; no weapon attack motion' },
  death: { duration: 1.1, loop: false, holdLastFrame: true, intent: 'collapse to ground; final pose remains still; use a separate disintegration effect if required' },
};

const CHARACTER_STYLE = 'Single full-body game character, isolated, complete feet and head, neutral A-pose, hands visible and fingers separated, both feet on ground, no pedestal, no environment, no text, no extra characters. Clear large armor plates and legible silhouette at 48 to 80 screen pixels, adult proportions, stylized realism, detailed hard-surface design, restrained surface wear, PBR. No tiny illegible inscriptions. Original insignia. Do not bake shadows or bloom into textures. No extra limbs.';
const BUILDING_STYLE = 'Single isolated real-time strategy building, complete structure and base footprint, no terrain, no background scenery, no ground plane, no floating pieces, no text. Readable at an elevated 35 degree RTS camera, layered silhouette and strong roof details, believable scale, detailed hard-surface architecture, PBR, restrained weathering, original insignia. Keep primary color panels large. Do not bake lighting, smoke or bloom into textures.';

const ROLES = {
  captain: { rig: true, targetPolycount: 12000, animations: ['idle', 'walk', 'run', 'attack', 'death'] },
  guard: { rig: true, targetPolycount: 8000, animations: ['idle', 'walk', 'run', 'shoot', 'death'] },
  builder: { rig: true, targetPolycount: 6000, animations: ['idle', 'walk', 'run', 'work', 'death'] },
  hq: { rig: false, targetPolycount: 20000, animations: [] },
  barracks: { rig: false, targetPolycount: 14000, animations: [] },
  post: { rig: false, targetPolycount: 6000, animations: [] },
  turret: { rig: false, targetPolycount: 6000, animations: [] },
};

export const FACTIONS = {
  legion: {
    label: 'Космодесант — Синий легион',
    palette: { team_primary: '#244A91', team_trim: '#B79A52', metal: '#343C49', cloth: '#733938', emissive: '#F2634F' },
    identity: 'disciplined heavy powered infantry, cobalt-blue armor and weathered brass trim, dark gunmetal joints, scarlet eye lenses, rectangular backpacks, gothic military details, original angular sun insignia',
    silhouette: 'broad symmetrical shoulders, squat helmet, compact rectangular backpack; orderly architecture with buttresses',
    units: {
      captain: { label: 'Капитан легиона', height: 2.2, prompt: 'Veteran captain in massive powered armor, broad symmetrical armored shoulders, enclosed squared helmet, short burgundy cape clear of the legs, prominent raised brass crest. Empty visible hands for separately attached sword and shield; preserve space around the arms for a melee rig.', equipment: ['sword', 'shield'], weaponMode: 'separate' },
      guard: { label: 'Стрелок легиона', height: 1.9, prompt: 'Heavy armored line infantry rifleman, cobalt-blue chest and shoulder plates, blocky helmet, two-handed compact boxy rifle held low across the chest. The rifle is a separate rigid mesh, hands visible and correctly gripping it.', equipment: ['rifle'], weaponMode: 'held-rigid' },
      builder: { label: 'Техник легиона', height: 1.7, prompt: 'Field combat engineer, compact armor under burgundy work robes above the ankles, small mechanical backpack, visible humanoid arms and legs, short handheld welding tool with brass details. No extra robot arms obstructing the humanoid rig.', equipment: ['welder'], weaponMode: 'held-rigid' },
      hq: { label: 'Командная цитадель', footprintMeters: [9, 9], prompt: 'Blue armored command bastion, low massive octagonal base, large visible entrance, two gothic buttress towers, central short cathedral tower, brass roof ribs and banners, layered gunmetal defense walls.' },
      barracks: { label: 'Казармы легиона', footprintMeters: [6.4, 6.4], prompt: 'Fortified rectangular troop barracks, cobalt-blue armor panels, broad deployment door, short gothic roof vault, brass buttress ribs, squat communications tower. Clearly smaller than a headquarters.' },
      post: { label: 'Ретранслятор легиона', footprintMeters: [2.8, 2.8], prompt: 'Small fortified communications relay on a compact square plinth, brass antenna, cobalt-blue panels, small beacon housing, very slender tower silhouette.' },
      turret: { label: 'Турель легиона', footprintMeters: [2.6, 2.6], prompt: 'Compact twin-barrel ballistic sentry turret, cobalt-blue angular gun housing, brass trim, separate rigid rotating turret head and separate elevated barrel assembly, circular low armored plinth. No muzzle flash.' },
    },
  },
  heretics: {
    label: 'Хаос — Пепельный культ',
    palette: { team_primary: '#79272D', team_trim: '#AE8551', metal: '#242129', cloth: '#482131', emissive: '#F07835' },
    identity: 'corrupted gothic military cult, black iron and deep crimson power armor, tarnished brass trim, restrained spikes and horn motifs, ember-orange lenses and vents, original fractured halo insignia',
    silhouette: 'jagged asymmetry, horned helmets, triangular shoulder spikes; tilted spires and furnace openings',
    units: {
      captain: { label: 'Чемпион культа', height: 2.25, prompt: 'Towering armored war champion, asymmetrical spiked shoulders, horned enclosed helmet, black iron ribs over deep crimson armor, short torn cape. Empty visible hands for separately attached heavy axe; no horns crossing the elbows or shoulders.', equipment: ['axe'], weaponMode: 'separate' },
      guard: { label: 'Стрелок культа', height: 1.9, prompt: 'Corrupted powered infantry rifleman, black iron helmet with short horns, deep crimson shoulder plates, restrained brass spikes, compact heavy rifle gripped in both hands low across chest. Rifle is a separate rigid mesh.', equipment: ['rifle'], weaponMode: 'held-rigid' },
      builder: { label: 'Кузнец культа', height: 1.75, prompt: 'Masked ritual forge engineer, deep crimson tabard above knees, soot-black armor, ember-orange single-lens respirator, furnace backpack, compact smithing hammer in right hand. Visible humanoid limbs, no tentacles or extra limbs.', equipment: ['forge-hammer'], weaponMode: 'held-rigid' },
      hq: { label: 'Пепельная цитадель', footprintMeters: [9, 9], prompt: 'Jagged black-iron military citadel, deep crimson roof armor, horned buttresses, furnace-orange entrance cavities, large central triangular spire, brutal symmetrical fortified base. No emitted smoke or flame meshes.' },
      barracks: { label: 'Казармы культа', footprintMeters: [6.4, 6.4], prompt: 'Spiked black-iron troop forge barracks, crimson armored gate, two short jagged towers, furnace vents and tarnished brass ribs, broad low footprint distinct from a tall headquarters.' },
      post: { label: 'Обелиск культа', footprintMeters: [2.8, 2.8], prompt: 'Compact crimson and black-iron capture-point obelisk, broken-halo shaped antenna, ember beacon enclosed in metal, jagged narrow tower on a square fortified base.' },
      turret: { label: 'Турель культа', footprintMeters: [2.6, 2.6], prompt: 'Low black-iron gun emplacement, crimson angular head with restrained horns, twin long gun barrels, separate rotating head and elevated barrel group, tarnished brass mounts. No projectiles or flashes.' },
    },
  },
  scrap: {
    label: 'Орки — Железные кланы',
    palette: { team_primary: '#935045', team_trim: '#AC9764', metal: '#4C504E', skin: '#657D43', emissive: '#D5A455' },
    identity: 'brutal olive-green alien scrap clans, massive square jaws, hunched shoulders, rusty riveted gunmetal armor, muted red cloth and painted metal panels, bone teeth trophies, asymmetrical industrial salvage, original three-bolt insignia',
    silhouette: 'massive jaw and forearms, hunched torso, oversized blocky weapons; irregular patched metal buildings',
    units: {
      captain: { label: 'Вожак клана', height: 2.5, prompt: 'Huge muscular green-skinned alien warboss, broad square tusked jaw, oversized forearms, hunched shoulders, salvaged riveted armor with red metal plates, compact exhaust backpack, empty visible hands for a separately attached industrial cleaver. Two arms and two legs with humanoid joint placement.', equipment: ['cleaver'], weaponMode: 'separate' },
      guard: { label: 'Стрелок клана', height: 2.05, prompt: 'Muscular olive-green alien scrap gunner, broad square jaw, red riveted shoulder plates, rough metal helmet, big blocky homemade machine gun held low in two visible hands. Gun is a separate rigid mesh. Humanoid two-arm two-leg anatomy.', equipment: ['scrap-rifle'], weaponMode: 'held-rigid' },
      builder: { label: 'Механик клана', height: 1.6, prompt: 'Compact wiry green-skinned alien mechanic with a square jaw, oversized work goggles, patched red vest, riveted tool backpack, heavy short wrench. Clearly a standing biped with separated arms and legs; no crawling pose.', equipment: ['wrench'], weaponMode: 'held-rigid' },
      hq: { label: 'Крепость из металлолома', footprintMeters: [9, 9], prompt: 'Ramshackle alien scrap stronghold, stacked armored shipping boxes and riveted corrugated steel, large patched red armor panels, broad toothed gate, short asymmetrical exhaust towers, massive low irregular fortress silhouette.' },
      barracks: { label: 'Сборочный лагерь', footprintMeters: [6.4, 6.4], prompt: 'Alien scrap clan troop workshop barracks, dented corrugated roof, riveted red armor panels, wide rolling metal gate, gear-shaped sign with no lettering, bulky irregular low hangar silhouette.' },
      post: { label: 'Сигнальная вышка', footprintMeters: [2.8, 2.8], prompt: 'Small improvised scrap communications tower, patched red tin plates, salvaged dish antenna, exposed cables secured against frame, riveted square iron platform.' },
      turret: { label: 'Пулемётная башня', footprintMeters: [2.6, 2.6], prompt: 'Improvised heavy scrap machine-gun turret, red patched gun shield, oversized box magazine and asymmetric paired barrels, low bolted plinth, distinct rotating head and elevated barrel group. No firing effects.' },
    },
  },
  necrons: {
    label: 'Некроны — Пробуждённые династии',
    palette: { team_primary: '#394844', team_trim: '#A18B54', metal: '#606B68', cloth: '#27362C', emissive: '#78EE51' },
    identity: 'ancient skeletal robotic dynasties, dark gunmetal segmented limbs, tarnished bronze ceremonial armor, curved metallic rib cages, toxic-green eyes and energy chambers, stepped monolithic architecture, original segmented-sun insignia',
    silhouette: 'skeletal segmented limbs, visible ribs, angular skull and narrow waist; stepped monoliths with green portals',
    units: {
      captain: { label: 'Владыка династии', height: 2.2, prompt: 'Tall skeletal robotic overlord, angular metallic skull with green eyes, dark gunmetal curved rib cage, broad tarnished bronze ceremonial shoulders, segmented crown, narrow mechanical waist, empty visible hands for a separately attached long green-bladed warscythe. Two humanoid arms and legs with separated joints.', equipment: ['warscythe'], weaponMode: 'separate' },
      guard: { label: 'Гаусс-воин', height: 1.9, prompt: 'Skeletal robotic infantry warrior, angular dark metallic skull, toxic-green eyes, visible curved rib cage, thin segmented gunmetal limbs, long heavy gauss rifle held low in two visible hands, bright green energy chambers inside rigid gun housing. Rifle is a separate rigid mesh.', equipment: ['gauss-rifle'], weaponMode: 'held-rigid' },
      builder: { label: 'Криптек-ремонтник', height: 1.85, prompt: 'Slender skeletal robotic repair artisan, dark bronze and gunmetal armor, green energy tool in right hand, compact mechanical tool harness, segmented skull crown, visible curved ribs. Humanoid biped with two separated arms and legs for rigging; no insect limbs.', equipment: ['repair-tool'], weaponMode: 'held-rigid' },
      hq: { label: 'Монолит династии', footprintMeters: [9, 9], prompt: 'Ancient stepped black-gunmetal command monolith, heavy square pyramid base, bronze geometric ribs, central luminous green portal, floating effect implied only by architecture with all geometry connected, tall energy chamber inset at peak. No particles or emitted beams.' },
      barracks: { label: 'Пробуждающая гробница', footprintMeters: [6.4, 6.4], prompt: 'Low stepped black-metal awakening crypt, wide geometric troop portal with enclosed green energy panel, bronze angular ribs, symmetrical dark gunmetal slab roof with small energy pylons. Clearly lower and smaller than a command monolith.' },
      post: { label: 'Пилон династии', footprintMeters: [2.8, 2.8], prompt: 'Slender ancient black-metal capture-point pylon, angular bronze geometric sides, enclosed toxic-green energy crystal near top, compact square stepped plinth, no floating particles.' },
      turret: { label: 'Гаусс-турель', footprintMeters: [2.6, 2.6], prompt: 'Ancient dark-gunmetal twin-gauss sentry, angular bronze housing and enclosed green energy chambers, separate rotating head and elevated barrel group, low square stepped base. No firing beams or bloom.' },
    },
  },
};


for (const faction of Object.values(FACTIONS)) {
  for (const role of ['sniper','heavy','flamer','elite','medic','transport','tank','walker','artillery','titan']) {
    const vehicle = ['transport','tank','walker','artillery','titan'].includes(role);
    ROLES[role] = { ...ROLES.guard, rig: !vehicle, vehicle, targetPolycount: vehicle ? 16000 : 8000, animations: ['idle','walk','run','shoot','death'] };
    faction.units[role] = { label: role, prompt: `${role}: distinctive equipment and silhouette, articulated weapon recoil, faction-specific armor.` };
  }
  for (const role of ['generator','factory','armory','relic','wall','gate']) {
    ROLES[role] = { ...ROLES.barracks, animations: [] };
    faction.units[role] = { label: role, prompt: `${role}: functional military architecture with faction-specific materials and silhouette.` };
  }
}

export function getFactionUnits(factionId) {
  const faction = FACTIONS[factionId];
  if (!faction) throw new Error(`Unknown faction ${factionId}; choose ${Object.keys(FACTIONS).join(', ')}`);
  return Object.fromEntries(Object.entries(faction.units).map(([kind, unit]) => [kind, {
    ...ROLES[kind],
    ...unit,
    textureResolution: ROLES[kind].rig ? ART_DIRECTION.production.characterTextureResolution : ART_DIRECTION.production.buildingTextureResolution,
    prompt: `${unit.prompt} Faction identity: ${faction.identity}. ${ROLES[kind].vehicle ? 'Isolated RTS military vehicle; separate articulated turret, gun, wheels or legs; no human auto-rig, no baked firing effects.' : ROLES[kind].rig ? CHARACTER_STYLE : BUILDING_STYLE}`,
    outputDirectory: `client/public/models/factions/${factionId}/${kind}/`,
    qualityGate: ROLES[kind].vehicle ? ['Separate turret and recoil nodes', 'No humanoid autorig', 'Articulated rigid-part animation', 'Feet or tracks rest on y=0'] : ROLES[kind].rig
      ? ['Humanoid joints rig correctly', 'Weapon and hands do not drift during clips', 'Animation track targets exist on the model rig', 'No root-motion translation', 'Feet rest on y=0', 'Team-color material regions remain identifiable']
      : ['Base rests on y=0', 'Footprint matches role', 'For turret: rotating head and barrel nodes are separate', 'Roof silhouette remains readable from RTS camera'],
  }]));
}

export function getProductionPlan(factionId) {
  const ids = factionId === 'all' ? Object.keys(FACTIONS) : [factionId];
  const factions = Object.fromEntries(ids.map(id => [id, { label: FACTIONS[id]?.label, palette: FACTIONS[id]?.palette, units: getFactionUnits(id) }]));
  const units = Object.values(factions).flatMap(f => Object.values(f.units));
  return {
    artDirection: ART_DIRECTION,
    animationPresets: ANIMATION_PRESETS,
    totals: { factions: ids.length, models: units.length, riggedCharacters: units.filter(u => u.rig).length, animationClips: units.reduce((n, u) => n + u.animations.length, 0) },
    factions,
  };
}
