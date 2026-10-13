// Фракции из дизайн-системы «Латунный Собор»: имя, тема интерфейса и силуэты (пути в ds/assets).
// Пока фракции отличаются видом; характеристики общие (особые механики — следующий шаг).
export type FactionId = 'order' | 'undead' | 'prism' | 'clockwork' | 'orks' | 'ashen';
type Art = { captain: [string, string]; builder: string; guard: string; hq: string; barracks: string; turret: [string, string] };
export const FACTIONS: Record<FactionId, { name: string; theme: string; art: Art }> = {
  order: { name: 'Орден Вечной Лампы', theme: 'dark', art: { captain: ['Units/captain-spire.svg', 'Units/captain-crown.svg'], builder: 'Units/mason.svg', guard: 'Units/guard.svg', hq: 'Buildings/cathedral.svg', barracks: 'Buildings/barracks.svg', turret: ['Turrets/order-t1.svg', 'Turrets/order-t2.svg'] } },
  undead: { name: 'Безмолвный Двор', theme: 'undead', art: { captain: ['Factions/wailer.svg', 'Factions/wailer.svg'], builder: 'Factions/digger.svg', guard: 'Factions/boneknight.svg', hq: 'Factions/undead-hq.svg', barracks: 'Factions/ossuary.svg', turret: ['Turrets/undead-t1.svg', 'Turrets/undead-t2.svg'] } },
  prism: { name: 'Призменный Консенсус', theme: 'prism', art: { captain: ['Factions/strider.svg', 'Factions/strider.svg'], builder: 'Factions/tender.svg', guard: 'Factions/lensman.svg', hq: 'Factions/prism-hq.svg', barracks: 'Factions/prismark.svg', turret: ['Turrets/prism-t1.svg', 'Turrets/prism-t2.svg'] } },
  clockwork: { name: 'Часовые Династии', theme: 'clockwork', art: { captain: ['Factions/chronarch.svg', 'Factions/chronarch.svg'], builder: 'Factions/warden.svg', guard: 'Factions/legionary.svg', hq: 'Factions/clockwork-hq.svg', barracks: 'Factions/pendulum.svg', turret: ['Turrets/clockwork-t1.svg', 'Turrets/clockwork-t2.svg'] } },
  orks: { name: 'Ржавая Орда', theme: 'orks', art: { captain: ['Factions/warboss.svg', 'Factions/warboss.svg'], builder: 'Factions/tinker.svg', guard: 'Factions/choppa.svg', hq: 'Factions/orks-hq.svg', barracks: 'Factions/idol.svg', turret: ['Turrets/orks-t1.svg', 'Turrets/orks-t2.svg'] } },
  ashen: { name: 'Пепельный Синклит', theme: 'ashen', art: { captain: ['Factions/ashen-chancellor.svg', 'Factions/ashen-chancellor.svg'], builder: 'Factions/servant.svg', guard: 'Factions/possessed.svg', hq: 'Factions/ashen-hq.svg', barracks: 'Factions/ashen-rift.svg', turret: ['Turrets/ashen-t1.svg', 'Turrets/ashen-t2.svg'] } },
};
export const FACTION_IDS = Object.keys(FACTIONS) as FactionId[];
export const isFaction = (f: unknown): f is FactionId => typeof f === 'string' && f in FACTIONS;
