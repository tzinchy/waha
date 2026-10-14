# Пакет моделей, спрайтов и анимаций

Пакет предназначен для переноса в собственную игру. В нём используются процедурные 3D-модели с текущими простыми текстурами и запечённые из тех же моделей прозрачные PNG. Этот визуальный стиль согласован для данного этапа. Детальные изображения капитанов остаются отдельным художественным ориентиром; их качество не приписывается процедурным моделям.

Документ описывает контракт интеграции. Окончательный список физических файлов, результаты проверки и ссылка на архив будут внесены после завершения экспорта. Перечень ролей ниже — матрица экспорта, а не утверждение, что каждый файл уже присутствует.

## Состав и расположение

Корень переносимых ассетов — `client/public/models/factions/`. При размещении через существующий сервер он доступен как `/models/factions/`.

```text
models/factions/
  manifest.json
  <faction>/<role>/
    model.glb
    sprites/
      <motion>.png
      <motion>.json
```

GLB содержит геометрию, материалы и именованные анимационные клипы. PNG и соседний JSON относятся к одной конкретной анимации. Пути и реально доступные действия следует брать из опубликованного манифеста: не составляйте список файлов по догадке. Варианты уровней штабов могут иметь отдельные пути; точные пути должны браться из манифеста после экспорта.

| Группа | Идентификаторы |
| --- | --- |
| Фракции | `legion`, `heretics`, `scrap`, `necrons`, `drukhari`, `daemons` |
| Юниты | `captain`, `guard`, `builder`, `sniper`, `heavy`, `flamer`, `elite`, `medic`, `transport`, `tank`, `walker`, `artillery`, `titan`, `scout`, `flyer` |
| Здания | `hq`, `barracks`, `post`, `turret`, `generator`, `factory`, `armory`, `relic`, `wall`, `gate` |
| Точки | `capture_point`, `resource_point` |
| Общие эффекты | `common/nuclear_blast` — один общий эффект для всех фракций |

`scout` — разведчик. `flyer` — отдельный летающий юнит. Эти роли не заменяют друг друга. Фракционная внешность задаётся соответствующей моделью.

Исходный каталог формируется из `UNIT_ROLES`, `ROLE_MOTIONS` в `client/faction-models.ts`, `STRUCTURE_ROLES`, `STRUCTURE_ROLE_MOTIONS` в `client/structure-models.ts`, `EFFECT_ROLE_MOTIONS` в `client/effect-models.ts` и общего `scripts/asset-catalog.mjs`. Доступность анимаций зависит от роли: нельзя требовать `fly` от каждого здания или `work` от каждого бойца.

## GLB: загрузка и воспроизведение

Для Three.js достаточно стандартных `GLTFLoader` и `AnimationMixer`. Один экземпляр модели должен иметь собственную иерархию узлов и собственный mixer. Текущие модели используют анимацию жёстких узлов через translation/rotation/scale; при переходе на скелетные модели клонируйте их через `SkeletonUtils.clone`.

```ts
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const gltf = await new GLTFLoader().loadAsync(
  '/models/factions/legion/scout/model.glb',
);
const placement = new THREE.Group();
const model = gltf.scene.clone(true);
placement.add(model);
scene.add(placement);
const mixer = new THREE.AnimationMixer(model);
const clips = new Map(gltf.animations.map(clip => [clip.name, clip]));
let active: THREE.AnimationAction | undefined;

function play(name: string, loop: boolean, speed = 1) {
  const clip = clips.get(name);
  if (!clip) throw new Error(`Animation not exported: ${name}`);
  active?.stop();
  active = mixer.clipAction(clip).reset();
  active.setLoop(loop ? THREE.LoopRepeat : THREE.LoopOnce, loop ? Infinity : 1);
  active.clampWhenFinished = !loop;
  active.setEffectiveTimeScale(speed);
  active.play();
  return active;
}

// Брать loop из JSON выбранного действия или каталога, не из названия файла.
play('idle', true);
// В собственном render loop:
// mixer.update(deltaSeconds);
```

Внешний `placement` задаёт позицию и направление юнита в вашей игре. Анимация может двигать внутренние узлы модели; не сбрасывайте их transform каждый кадр. Направление модели вперёд — `+Z`; при другом соглашении движка поверните внешний контейнер. Возвращайтесь в `idle` или другую стойку только после окончания соответствующего действия. Для смерти оставляйте последний кадр: `LoopOnce` и `clampWhenFinished = true`.

Вертикальная ось — `+Y`; начало координат соответствует локальному размещению модели, обычно опорной точке на земле. Движение и повороты внутри `Rig` входят в клип. Ваша игра выбирает мировое перемещение и физику отдельно: локальный анимационный сдвиг не следует повторно прибавлять к мировой позиции.

Перед удалением экземпляра остановите mixer и вызовите `mixer.uncacheRoot(model)`. Общие материалы и геометрию освобождайте после удаления последнего использующего их экземпляра.

## PNG: восемь направлений и время из JSON

Не фиксируйте размер ячейки, число кадров или FPS в коде. Для каждого действия JSON задаёт `cellWidth`, `cellHeight`, `columns`, `rows`, `frames`, `duration`, `loop`, `directionsDegrees` и `anchor`. Разные размеры нужны пехоте, технике, титанам и зданиям. Матрица `frames[direction][frame]` содержит прямоугольники `{x,y,w,h,time}` в пикселях PNG и время в секундах от начала действия.

Готовые функции находятся в `client/sprite-atlas.ts`. Их можно перенести в TypeScript-проект: они не зависят от Three.js, сервера или DOM.

```ts
import * as THREE from 'three';
import { validateAtlas, atlasFrame, atlasUV } from './sprite-atlas.ts';

const base = '/models/factions/legion/scout/sprites/run';
const metadata = validateAtlas(await (await fetch(base + '.json')).json());
const texture = await new THREE.TextureLoader().loadAsync(base + '.png');
texture.colorSpace = THREE.SRGBColorSpace;
texture.magFilter = texture.minFilter = THREE.NearestFilter;
texture.generateMipmaps = false;
const material = new THREE.SpriteMaterial({ map: texture, transparent: true });
const sprite = new THREE.Sprite(material);
sprite.center.set(
  metadata.anchor.x / metadata.cellWidth,
  1 - metadata.anchor.y / metadata.cellHeight,
);

function sample(seconds: number, directionIndex: number) {
  const frame = atlasFrame(metadata, seconds, directionIndex);
  const uv = atlasUV(metadata, frame);
  texture.offset.set(uv.x, uv.y);
  texture.repeat.set(uv.w, uv.h);
}
```

`atlasFrame` замыкает циклические действия и удерживает последний кадр однократных. `atlasUV` использует отступ до центра текселя, чтобы соседние кадры не попадали в выборку. Направление выбирайте по ближайшему углу из `directionsDegrees`, учитывая собственную систему координат и положение камеры. Функция `atlasDirection` в том же модуле уже реализует соглашение WAHA: движение вперёд `+X`, модель `+Z`, азимут камеры берётся из JSON. В другом движке нужно адаптировать это соглашение, а не просто зеркалить картинку.

Мировой размер спрайта определяйте из масштаба вашего мира и `camera.orthographicHeight`, если поле присутствует. `anchor` — точка опоры внутри ячейки, а не центр силуэта; она удерживает ноги, гусеницы или основание здания на одном месте при смене кадров. Для нескольких юнитов с разными кадрами нужны отдельные texture transform либо собственный atlas shader с UV на экземпляр. Один общий `texture.offset` меняет кадр всех использующих эту текстуру спрайтов.

Для Canvas2D используйте те же `atlasFrame` и размеры кадра с `drawImage(image, frame.x, frame.y, frame.w, frame.h, ...)`, отключите `imageSmoothingEnabled` и учитывайте `anchor` при расчёте экранной позиции. PNG должен оставаться RGBA с прозрачностью.

## Реакции на взрыв, оглушение и падение

В каталоге для применимых юнитов предусмотрены `stunned`, `knockback`, `fall`, `death_blast`. `stunned` доступен пехоте; реакции `knockback`, `fall`, `death_blast` — лёгким ролям `guard`, `builder`, `sniper`, `medic`, `scout`, `flyer`. Проверяйте фактические клипы и файлы роли перед запуском. Обычная `death` остаётся отдельным действием.

При массовом взрыве ваш игровой код выбирает реакцию для каждого юнита отдельно. Направление обычно задаётся от центра взрыва к юниту с небольшим случайным разбросом; задержку запуска и скорость можно немного различать. Это не один общий таймер для всего отряда. Например, назначьте каждому экземпляру `startAt = now + random * 0.12` и скорость в диапазоне `0.92…1.08`, затем запускайте его GLB-клип или PNG-действие независимо.

`knockback`, `fall`, `death_blast`, `death`, атаки и попадания воспроизводите один раз. Для падения и смерти удерживайте финальную позу; для восстановления после отбрасывания переход выбирает ваша игра. Избегайте повторного запуска реакции при каждом обновлении позиции.

JSON хранит события в `events: [{ name, time }]`, время — в секундах относительно действия. Важные маркеры: `impulse`, `groundContact`, `debris`; у стрелковых и ближних атак — `shot`, `impact`, у гранаты — `release`, `impact`. События следует брать из JSON конкретного действия. Не выводите момент столкновения из номера кадра.

```ts
type Marker = { name: string; time: number };
let previousTime = -Number.EPSILON; // включает события в момент 0

function emitOneShotEvents(localTime: number, events: Marker[]) {
  for (const event of events) {
    if (previousTime < event.time && event.time <= localTime) {
      visualEvent(event.name); // пыль, звук контакта, обломки и т. п.
    }
  }
  previousTime = localTime;
}

// При новом действии previousTime снова = -Number.EPSILON.
// localTime = max(0, elapsedSeconds * playbackSpeed).
// Для циклических действий счётчик событий учитывает каждый пройденный цикл.
```

Маркер `impulse` позволяет согласовать ваш внешний визуальный эффект или игровую физику с анимацией. Проверяйте, движется ли внутренний узел GLB в выбранном клипе, прежде чем добавлять внешнее перемещение: двойной сдвиг даст чрезмерный отлёт. `groundContact` запускает пыль или звук падения, `debris` — ваши частицы. Их количество, время удаления тела и возвращение юнита в строй определяет ваша игра.

Пакет не меняет правила урона, владение точкой, добычу ресурсов или сетевой протокол. В исходном сервере такие механики не добавляются этим экспортом. Анимации — данные для вашей интеграции.

## Здания и точки

Для зданий и точек каталог содержит `idle`, `build`, `work`, `hit`, `death`; для `turret` дополнительно `shoot`, для `capture_point` — `capture`. `idle` и `work` циклические, остальные состояния однократные. Внутри моделей могут двигаться энергетические элементы, флаг, производственные узлы и ствол турели. Модель штаба может экспортироваться для уровней 1, 2 и 3; уровень выбирайте по точному пути модели в итоговом манифесте.

`capture` поднимает флаг визуально. `resource_point` показывает фракционный ресурсный узел. Эти клипы не присваивают собственника и не начисляют ресурсы. Маркеры зданий включают `foundation`, `ready`, `flagRaised`, `complete`, `shot`, `collapse`, `groundContact`; список зависит от действия и записывается в его JSON.

## Общий ядерный взрыв

Общий эффект размещается в `common/nuclear_blast/model.glb` и `common/nuclear_blast/sprites/explode.{png,json}`. Он воспроизводится один раз с удержанием последнего кадра; его таймлайн и длительность берутся из JSON. Маркеры `flash`, `shockwave`, `mushroom`, `dustSettles` позволяют согласовать ваши вспышку, звук, ударную волну и пыль. Фракционные копии этого общего эффекта не нужны. Урон и радиус поражения задаёт ваша игра.

## Перенос и проверка

Копируйте каталог `client/public/models/factions/` целиком, сохраняя вложенные пути PNG/JSON и GLB. Переносимый архив формируется как `artifacts/WAHA-model-pack.zip`, рядом находится `WAHA-model-pack.zip.sha256`. Распакованный корень — `WAHA-model-pack/`:

```text
WAHA-model-pack/
  factions/manifest.json
  factions/<faction>/<role>/model.glb
  factions/<faction>/<role>/sprites/<motion>.png
  factions/<faction>/<role>/sprites/<motion>.json
  INTEGRATION.md
  PACK_MANIFEST.json
  PROVENANCE.json
  SHA256SUMS
  runtime/sprite-atlas.ts
  validation/art-audit.json
  validation/glb-validation.json
```

Разместите `factions/` в выбранном asset root. Если браузерный URL этой папки — `/factions/`, измените префикс `/models/factions/` в примерах на `/factions/`. GLB включают свои текстуры и буферы. Для использования моделей и PNG/JSON не нужны Node.js или зависимости репозитория. `runtime/sprite-atlas.ts` — необязательный независимый помощник: скомпилируйте его своим TypeScript-инструментом либо считывайте прямоугольники кадров из JSON самостоятельно.

`PACK_MANIFEST.json` содержит фактические количества, размеры, пути и SHA-256 ассетов. `SHA256SUMS` проверяет каждый упакованный файл, кроме самого файла контрольных сумм; отдельный SHA-256 архива покрывает ZIP целиком. Контрольные суммы можно проверить командой `sha256sum -c SHA256SUMS` из распакованного корня. Ссылку на опубликованный архив и его SHA следует брать из итогового отчёта.

Для сборки из репозитория выполните `node --import tsx scripts/pack-models.mjs --check-only`, затем ту же команду без `--check-only`. Сборка требует полного физического аудита с нулём отсутствующих файлов и ошибок и актуального Khronos-отчёта с нулём ошибок и предупреждений. Скрипт не создаёт архив до прохождения этих проверок и заменяет итоговый ZIP только после успешной сборки.

После переноса проверьте загрузку GLB, список `gltf.animations`, все PNG/JSON выбранной роли, прозрачность, выбор восьми направлений, опорную точку, один полный цикл и последний кадр смерти. Сверяйте физические файлы с манифестом. Отчёт проверок должен отдельно подтверждать наличие, валидность glTF/PNG, воспроизведение в браузере и соответствие согласованному визуальному стилю.

Файлы `client/public/art-src/**/pose-studies/` и детальные одиночные изображения `client/public/art/factions/` относятся к художественным исходникам. Они не входят в контракт восьминаправленных атласов и не являются анимированными GLB.
