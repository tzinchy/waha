export const factions=[
 {id:'legion',name:'Космодесант',subtitle:'Стальные легионы',glow:'#243f5b'},
 {id:'heretics',name:'Хаос',subtitle:'Пепельные культы',glow:'#4b2524'},
 {id:'scrap',name:'Орки',subtitle:'Железные кланы',glow:'#354025'},
 {id:'necrons',name:'Некроны',subtitle:'Пробуждённые династии',glow:'#193d2c'},
 {id:'drukhari',name:'Тёмные эльдар',subtitle:'Налётчики Паутины',glow:'#352343'},
 {id:'daemons',name:'Демоны',subtitle:'Варп-легионы',glow:'#4a2029'}
];
export const artworks=[
 {faction:'legion',role:'captain',title:'Капитан легиона',detail:'Кобальтовая броня, золотая гравировка, силовой клинок и щит.',type:'Полководец'},
 {faction:'heretics',role:'captain',title:'Воитель Хаоса',detail:'Повреждённое железо, багровые пластины и раскалённое лезвие.',type:'Полководец'},
 {faction:'scrap',role:'captain',title:'Варбосс',detail:'Грубые броневые пластины, огромная челюсть и клёпаный металлолом.',type:'Полководец'},
 {faction:'necrons',role:'captain',title:'Владыка династии',detail:'Древняя геометрия, сегментированный металл и зелёная энергия.',type:'Полководец'},
 {faction:'drukhari',role:'captain',title:'Архонт',detail:'Вытянутая броня, острые силуэты и бирюзовые клинки.',type:'Полководец'},
 {faction:'daemons',role:'captain',title:'Князь Варпа',detail:'Плоть, хитин, кость и пламя — органическая мощь демона.',type:'Полководец'},
 {faction:'legion',role:'elite',title:'Терминатор',detail:'Массивная броня ветерана, тяжёлый болтер и боевые печати.',type:'Элита'},
 {faction:'necrons',role:'hq',title:'Монолит',detail:'Светящиеся каналы, энергетические пилоны и центральный кристалл.',type:'Архитектура'}
].map(a=>({...a,image:`/art/factions/${a.faction}/${a.role}.png`}));
