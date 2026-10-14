export const FACTIONS=['legion','heretics','scrap','necrons','drukhari','daemons'];
export const UNITS=['captain','guard','builder','sniper','heavy','flamer','elite','medic','transport','tank','walker','artillery','titan'];
export const BUILDINGS=['hq','barracks','post','turret','generator','factory','armory','relic','wall','gate'];
export const ACTIONS={captain:['idle','walk','run','attack','throw_grenade','death'],builder:['idle','walk','run','work','death'],elite:['idle','walk','run','shoot','attack_slash','throw_grenade','death']};
export const motions=role=>ACTIONS[role]??['idle','walk','run','shoot','death'];
