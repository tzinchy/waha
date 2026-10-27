// Четыре фракции (пресеты tools/faction-presets.mjs ветки faction-asset-lab): id прежние, образ — пиксельный пакет
// client/public/models/factions/<pack>/: inquisition → legion (космодесант), tyranids. Остальные расы удалены — играют только расы Ultimate Apocalypse.
export type FactionId = 'tyranids' | 'inquisition';
/** Каталог пиксельного пакета фракции (атласы капитана, стрелка и строителя). */
export const PACK: Record<FactionId, 'legion' | 'tyranids'> = { tyranids: 'tyranids', inquisition: 'legion' };
/** Каталог пиксельного атласа. Атласы тиранидов запечены из 3D-моделей: client/bake.ts + tools/bake-server.mjs. */
export const PX_PACK: Record<FactionId, string> = PACK;
/** У новых рас своих векторных зданий нет: берут силуэты старшей расы и перекрашиваются палитрой .pal-<фракция>. */
export const ART_BASE: Partial<Record<FactionId, string>> = { tyranids: 'ashen', inquisition: 'order' }; // папки векторных силуэтов в ds/assets
/** Путь «силуэта» для ролей с атласом: у новых рас — свой, чтобы иконки не путались со старшей расой (файла за ним нет). */
const px = (f: string, r: string) => `px/${f}/${r}`;
type Art = { captain: [string, string]; // устарело: см. CAPTAIN_ART
 builder: string; guard: string; hq: string; barracks: string; turret: [string, string] };
/** Ключевые здания тиров I–IV, Врата (тир V) и три легенды — по таблице FactionTiers. */
type Tiers = { keys: [string, string, string, string]; gate: string; legends: [string, string, string]; legendInfo: [string, string, string]; legendArt: [string, string, string] };
export const FACTIONS: Record<FactionId, { name: string; theme: string; art: Art; builder: string; guard: string; mech: string } & Tiers> = {
  inquisition: { name: 'Инквизиция', keys: ['Либрариум', 'Дозор Инквизиции', 'Телепортариум Орбиталис', 'Священный артефакт'], gate: 'Телепортариум', legends: ['Брат-капитан', 'Библиарий Серых Рыцарей', 'Капеллан Серых Рыцарей'], legendInfo: ['аура лечения 5%/с', 'рывок: скорость и урон ×1.5', 'пикирование: урон по площади'], legendArt: ['Units/legend-irena.svg', 'Units/legend-magister.svg', 'Units/legend-seraph.svg'], theme: 'dark', builder: 'Архитекторы', guard: 'Серые Рыцари', mech: 'Ордо Маллеус (Inquisition Daemonhunt): Серые Рыцари, Штурмовики, дредноуты и Немезида — баланс из мода', art: { captain: ['Units/captain-crown.svg', 'Units/captain-spire.svg'], builder: 'Units/mason.svg', guard: 'Units/guard.svg', hq: 'Buildings/cathedral.svg', barracks: 'Buildings/barracks.svg', turret: ['Turrets/order-t1.svg', 'Turrets/order-t2.svg'] } },
  tyranids: { name: 'Тираниды', keys: ['Выводковый шпиль тиранид', 'Капиллярная башня', 'Чрево ксенотипов', 'Улей генокрадов'], gate: 'Споровый шпиль', legends: ['Рой-лорд', 'Смертельный прыгун', 'Старый Одноглазый'], legendInfo: ['аура синапса: рой регенерирует вдвое', 'рывок: скорость и урон ×1.5', 'варп-взрыв по площади'], legendArt: ['Factions/lord-of-ash.svg', 'Factions/ashen-swarm.svg', 'Factions/ashen-prelate.svg'], theme: 'ashen', builder: 'Рипперы', guard: 'Хормагаунты', mech: 'Рой: пехота рубит в ближнем бою, все юниты регенерируют 1%/с. Синапс: в 20 м от капитана, зоантропа, легенды или штаба рой бьёт на 10% сильнее, вне синапса — на 15% слабее', art: { captain: [px('tyranids', 'captain'), px('tyranids', 'captain')], builder: px('tyranids', 'builder'), guard: px('tyranids', 'guard'), hq: 'Factions/ashen-hq.svg', barracks: 'Factions/rift.svg', turret: ['Turrets/ashen-idol.svg', 'Turrets/ashen-idol.svg'] } },
};
export const FACTION_IDS = Object.keys(FACTIONS) as FactionId[];
export const isFaction = (f: unknown): f is FactionId => typeof f === 'string' && f in FACTIONS;
/** Расы, доступные в лобби и у ботов: только расы из модов DoW (родные модели и баланс); вернуть остальных — FACTION_IDS. */
export const PLAYABLE: FactionId[] = ['tyranids', 'inquisition'];

/** Армия фракции по ролям (пресеты UnitRoles, Vehicles, Titans): имя, силуэт, у титана — рост в метрах.
 *  Где своего силуэта у фракции нет, берётся силуэт Ордена и перекрашивается фильтром tint. */
export type Roster = Record<'sniper' | 'heavy' | 'support' | 'elite' | 'healer' | 'lveh' | 'mveh' | 'hveh' | 'arty' | 'titan' | 'air' | 'jet', { name: string; art: string; tint?: boolean }> & { titanM: number; tint: string };
const O = { sniper: 'Units/sniper.svg', heavy: 'Units/gunner.svg', support: 'Units/censer.svg', elite: 'Units/cathguard.svg', healer: 'Units/archangel.svg', lveh: 'Units/herald.svg', mveh: 'Units/liturgic.svg', hveh: 'Units/spire.svg' };
/** Авиация (air) — атлас роли flyer, запечённый из 3D-моделей (client/bake.ts). */
export const ROSTER: Record<FactionId, Roster> = {
  inquisition: { tint: 'none', titanM: 34, sniper: { name: 'Сёстры-экзорцистки', art: O.sniper }, heavy: { name: 'Пургаторы', art: O.heavy }, support: { name: 'Штурмовики', art: O.support }, elite: { name: 'Терминаторы Серых Рыцарей', art: O.elite }, healer: { name: 'Апотекарий', art: O.healer }, lveh: { name: 'Рейзорбэк', art: O.lveh }, mveh: { name: 'Дредноут', art: O.mveh }, hveh: { name: 'Лэнд Рейдер', art: O.hveh }, arty: { name: 'Дредноут поддержки', art: 'Defenses/battery.svg' }, titan: { name: 'Рыцарь Немезиды', art: 'Units/colossus.svg' }, air: { name: 'Перехватчики', art: px('order', 'air') }, jet: { name: 'Штормовой ворон', art: px('order', 'jet') } },
  tyranids: { tint: 'hue-rotate(-70deg) saturate(1.4) brightness(.8)', titanM: 30, sniper: { name: 'Ликтор', art: px('tyranids', 'sniper') }, heavy: { name: 'Воины-тираниды', art: px('tyranids', 'heavy') }, support: { name: 'Термаганты', art: 'Factions/imp.svg' }, elite: { name: 'Генокрады', art: px('tyranids', 'elite') }, healer: { name: 'Зоантроп', art: px('tyranids', 'medic') }, lveh: { name: 'Равенеры', art: px('tyranids', 'transport') }, mveh: { name: 'Карнифекс', art: px('tyranids', 'walker') }, hveh: { name: 'Адский фекс', art: px('tyranids', 'tank') }, arty: { name: 'Биоворы', art: px('tyranids', 'artillery') }, titan: { name: 'Тригон', art: px('tyranids', 'titan') }, air: { name: 'Гаргульи', art: px('tyranids', 'air') }, jet: { name: 'Гарпия', art: px('tyranids', 'jet') } },
};

/** Силуэт капитана по сборке (пресет CaptainArchetypes). Силуэты Ордена у других фракций перекрашиваются (Units/* → tint). */
export const CAPTAIN_ART: Record<FactionId, Record<'assault' | 'commander' | 'mystic', string>> = {
  inquisition: { assault: 'Units/captain-spire.svg', commander: 'Units/captain-crown.svg', mystic: 'Units/captain-hood.svg' },
  tyranids: { assault: px('tyranids', 'captain'), commander: px('tyranids', 'captain'), mystic: px('tyranids', 'captain') },
};
/** Отдельные производственные здания: техцех (вся техника) и верфь титана. */
export const PROD_NAME: Record<FactionId, { motorpool: string; yard: string }> = {
  inquisition: { motorpool: 'Домус Астра Телепатика', yard: 'Домус Астра Навигацио' },
  tyranids: { motorpool: 'Камера карнифексов', yard: 'Нора тригона' },
};
/** Названия построек по фракциям, как в Dawn of War: казармы, пост на точке, генераторы, турель. */
export const BUILD_NAME: Record<FactionId, Record<'barracks' | 'post' | 'foundry' | 'pump' | 'turret', string>> = {
  inquisition: { barracks: 'Телепортер Серых Рыцарей', post: 'Имперская икона', foundry: 'Варп-генератор', pump: 'Варп-реактор', turret: 'Указ об очищении' },
  tyranids: { barracks: 'Выводковый улей гаунтов', post: 'Споровая труба', foundry: 'Пул переработки', pump: 'Магмовый выход', turret: 'Споровая мортира' },
};
/** Название штаба фракции (второй и третий строятся с тира II). */
/** Сверхоружие фракций (тир V): имя, суть, силуэт постройки. */
export const DOOM_OF: Record<FactionId, { name: string; info: string; art: string }> = {
  inquisition: { name: 'Экстерминатус', info: 'залп с ударного крейсера: 3500 урона в 12 м', art: 'Buildings/observatory.svg' },
  tyranids: { name: 'Споровый ливень', info: '800 урона в 18 м и облако кислотных спор на 20 с', art: 'Factions/ashen-doom.svg' },
};
export const HQ_NAME: Record<FactionId, string> = { tyranids: 'Шпиль улья', inquisition: 'Башня Инквизитора' };
/** Сборки капитана по фракциям (пресет CaptainArchetypes): у кого-то их две. Роль: assault — рукопашный штурм, commander — ауры, mystic — урон по площади и лечение. */
export const ARCH_OPTS: Record<FactionId, Partial<Record<'assault' | 'commander' | 'mystic', { name: string; info: string }>>> = {
  inquisition: { assault: { name: 'Лорд-инквизитор', info: 'Ордо Маллеус: урон +30%, скорость +15%, получает на 10% меньше.' }, commander: { name: 'Лорд-инквизитор', info: 'Свита и знамя: союзники в 12 м бьют на 10% сильнее и получают на 10% меньше.' }, mystic: { name: 'Лорд-инквизитор', info: 'Психосила бьёт на 9 м по площади, лечит союзников рядом.' } },
  tyranids: { assault: { name: 'Тиран улья', info: 'Костяные косы: урон +30%, скорость +15%, получает на 10% меньше.' }, commander: { name: 'Крылатый тиран', info: 'Синаптический узел: союзники в 12 м бьют на 10% сильнее и получают на 10% меньше.' }, mystic: { name: 'Нейротроп', info: 'Варп-разряд по площади на 9 м, синапс заживляет своих рядом.' } },
};
/** Сборка, доступная фракции (если выбранной нет — первая из её списка). */
export const archFor = (f: FactionId, a: 'assault' | 'commander' | 'mystic') => (ARCH_OPTS[f][a] ? a : (Object.keys(ARCH_OPTS[f])[0] as 'assault' | 'commander' | 'mystic'));
export const ARCH_INFO = ARCH_OPTS.inquisition as Record<'assault' | 'commander' | 'mystic', { name: string; info: string }>;
