# UA: что ещё не как в Ultimate Apocalypse

Общий список для сессий Claude. Берёшь задачу — сразу ставь `[в работе: <имя сессии>]` и сохраняй файл, закончил — `[x]` и одна строка, что сделано.
Перед правкой перечитывай файл: другая сессия могла взять задачу. Одна задача — одна сессия.

Статусы: `[ ]` свободна · `[в работе: имя]` · `[x]` готово.

## Данные (tools/ua-race.mjs → shared/ua-*.ts)

- [x] 1. Требования из мода: `requirement_ext` зданий, `squad_requirement_ext` отрядов, требования исследований и аддонов — структурой `{ t: 'structure' | 'either' | 'addon' | 'local_addon' | 'research', ids }`.
- [x] 2. Аддоны зданий: `addon_ext` → `out.addons[id] = { name, info, icon, cost, power, time, requires, mods, building }`. Зависит от 1.
- [x] 3. (данные есть, в sim — в задаче 4) Исследования без модификаторов («схемы», гранаты, способности) тоже в данных: нужны как требования (схема открывает юнита). Зависит от 1.

## Симуляция (shared/sim.ts)

- [x] 4. (`UA_REQ`, `uaMissing`, `haveOf`; чит открывает всё) У рас UA доступ к постройкам, найму и исследованиям по дереву требований мода вместо тиров. Тир штаба = аддоны штаба (у тиранидов `hq_addon_1/2`, у Инквизиции `tower_addon`). Зависит от 1–3.
- [x] 5. (`UA_ADDONS`, команда `uaa`, `u.ad`/`p.ad`, снимок `ad`) Аддоны как команда: покупка у здания, хранение на юните (поле + снимок), модификаторы аддона через uaMods. Зависит от 2.
- [x] 6. (`addonWeapon`, ствол/перезарядка/площадь из мода; общий апгрейд у таких зданий убран) Турель Инквизиции в два шага: ракетная (`inquisition_turret_addon`) → улучшенная (`inquisition_turret_improved_addon`); тираниды: `bioacid`, `launcher`, `production`. Зависит от 5.
- [в работе: waha-main] 7. Модификаторы исследований: `sight_radius`, `keen_sight_radius`, `cost_*`, `squad_cap_player`/`support_cap_player`, `morale_*`, `ability_recharge`, `repair_rate`, `construction_speed`.
- [ ] 8. Размеры зданий и юнитов под масштаб DOW_M = 1.5 (радиусы, ROLES.meters, следы построек BCELL, WIDTH в клиенте).

## Клиент (client/)

- [x] 9. Кнопки аддонов в карточке здания, требования в подсказке (вместо «Нужен тир N»).
- [x] 10. Панель строителя одним окном, без вкладок (как в Soulstorm).
- [x] 11. Анимации выстрела и удара по дереву `.whe` (client/models3d/ua-models.ts): `parseWhe`/`wheClips` в client/whm.ts, клип по стволам юнита.
- [x] 12. Прокачка оружия побойцово, как в UA: `UA_ARM`, команда `uaw`, кнопки стволов в панели отряда (иконки мода), лимит `max_upgrades`, требования ствола (`armReq`), без похода к зданию; уровень 2 и гранаты игры у рас UA убраны (waha-97).

- [ ] 18. Земля карт DoW из .sgb, как в игре: рельеф (`HMAP`), типы почвы по клеткам (`TTYP`) с тайлами из `DSHD` (art/scenarios/textures/detail/…), цвет мира (`WCLR`), декали (`DECL`: `SMAP` + `ENTY`). Сейчас растягивается `<карта>.tga` 512×256 — это размытое ч/б превью загрузки, а не земля (waha-97, после 15).
- [ ] 19. Эффекты выстрелов из мода: события движений `.whe` (`effect_*` — вспышка у маркера ствола, `projectile_*` — снаряд к цели) → art/fx/*.lua (спрайты, частицы, .whm вроде Devourer_Muzzle). Сейчас выстрел — общая линия игры (waha-97, после 18).

## Удаление старых рас (order, clockwork, orks, ashen, eldar) и их моделей — просьба пользователя: удалить целиком, а не прятать

Порядок: 13 → (14, 15, 16 параллельно) → 17. После 13 tsc сам покажет все хвосты.

- [x] 13. shared/factions.ts: `FactionId = 'tyranids' | 'inquisition'`, удалить записи старых рас из FACTIONS, ROSTER, CAPTAIN_ART, ARCH_OPTS, BUILD_NAME и т.д.; `PACK`/`ART_BASE` без опоры на старые расы.
- [x] 14. (sim.ts и server/bot.ts чисты; FACTION_ONLY старых построек = null; команды ascend/drag/sacrifice удалены) shared/sim.ts + server/: механики старых рас (TURRET_FAC/UNIT_FAC старых, FACTION_ONLY-постройки aegis/rturret/fturret/battery/pylon/pyre/lighthouse/obelisk/megagun/warpgate/portal/spire, демоны khorne/nurgle/tzeentch/slaanesh, ярость/ВААГХ, перезавод, порча, жатва, DOOM_R старых). Виды в KINDS не удалять (индексы в снимках) — только код. Зависит от 13.
- [в работе: waha-97, после 13] 15. client/: SVG/пиксельные атласы и процедурные модели старых рас (models3d/faction-models.ts паки heretics/scrap/necrons/drukhari, vehicle/structure-models под них), ветки по старым фракциям в game2d.ts, units.ts, anims.ts, captain.ts. Зависит от 13.
- [x] 16. (тесты движка — за Инквизицию с читом `freeState`, статы `FSTATS.inquisition`, координаты Absolute Zero; 39/39), статы — `FSTATS.inquisition`; осталось починить 11 тестов движка под времена/цены мода) Тесты shared/*.test.ts: перевести с 'order' и др. на tyranids/inquisition, удалить тесты механик старых рас. Зависит от 13.
- [x] 20. (`MAPS = [MAP_ZERO]`, map-frostbite/illusion удалены, rift/gorge вырезаны) Удалить старые карты целиком (rift, gorge, frostbite, illusion и генерацию map-*.ts под них): в игре и тестах только Absolute Zero; тесты перевести на её точки.
- [ ] 17. Файлы: удалить из ds/, client/public/ неиспользуемые ассеты старых рас (проверка — grep путей по коду и сборка). Зависит от 15.

## Сделано


- [x] Расстояния: дальность, обзор и скорость ×DOW_M (как у карт).
- [x] Здоровье, урон и цены отрядов из мода без коэффициентов, пробитие = %/100, апгрейд оружия по цене мода × бойцов (waha-97).
- [x] Пополнение отрядов UA до `unit_max` мода по цене и времени бойца (`UA_SQ`, `squadCap`, `canReinforce`, снимок `sq`) (waha-97).
- [x] Цены, энергия и время зданий, отрядов и исследований из мода (`energyOf`).
- [x] Исследования бьют по турелям и их стволам; `max_range_weapon` множителем.
- [x] Оружие турелей из мода (`modWeapons`), апгрейд — лучший ствол.
- [x] ua-slim: `npx tsx tools/ua-slim.ts`, отдаётся по /ua/ и в проде.
