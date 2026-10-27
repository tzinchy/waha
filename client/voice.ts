// Озвучка юнитов: реплики на выбор, приказ, атаку и найм — голосом браузера (Web Speech), у каждой фракции свой тембр.
import type { FactionId } from '../shared/factions.ts';
import type { Kind } from '../shared/sim.ts';

type Ev = 'select' | 'move' | 'attack' | 'ready' | 'hurt';
const LINES: Record<FactionId, Record<Ev, string[]>> = {
  inquisition: { select: ['Ордо Маллеус слушает.', 'Мы — щит человечества.', 'Император защищает.'], move: ['Выдвигаемся.', 'Во имя Святой Инквизиции.'], attack: ['Изгнать демона!', 'Очистить ересь!', 'Нет пощады нечистому!'], ready: ['Серые Рыцари прибыли.', 'Отряд готов.'], hurt: ['Нас теснят!'] },
  order: { select: ['Слушаю, брат-капитан.', 'Мы — молот Императора.', 'Во имя Императора.', 'Приказывайте.'], move: ['Выдвигаемся.', 'Будет исполнено.', 'Строем — вперёд.'], attack: ['Очистить ересь!', 'Огонь по врагу!', 'За Императора!'], ready: ['Отделение готово.', 'Прибыли по вашему зову.', 'Мы не знаем страха.'], hurt: ['Держать строй!', 'Нас теснят!'] },
  clockwork: { select: ['Механизм заведён.', 'Тик… так.', 'Династия внемлет.'], move: ['По графику.', 'Шестерни в ходу.', 'Время движется.'], attack: ['Ваше время вышло.', 'Остановить их.', 'Стереть.'], ready: ['Пробуждение завершено.', 'Заводка окончена.'], hurt: ['Повреждение корпуса!'] },
  orks: { select: ['Чё надо, босс?', 'Ну, мы тута!', 'Ваагх?'], move: ['Топаем!', 'Ща всё будет!', 'Пошли, пацаны!'], attack: ['Ваа-агх!', 'Мочи их!', 'Бей, круши!'], ready: ['Мы готовы драцца!', 'Кто тут главный? Мы!'], hurt: ['Ой, больно же!'] },
  eldar: { select: ['Говори, смертный.', 'Боль — наша пища.', 'Кабал слушает.'], move: ['Быстрее тени.', 'Уходим в набег.', 'Как пожелаешь.'], attack: ['Пусть кричат!', 'Свежие души!', 'Режьте их!'], ready: ['Налётчики готовы.', 'Клинки наточены.'], hurt: ['Они нас задели!'] },
  tyranids: { select: ['Разум улья слышит.', 'Рой голоден.', 'Синапс отвечает.'], move: ['Рой движется.', 'Ползём.', 'Улей направляет.'], attack: ['Поглотить!', 'Рвите добычу!', 'Биомасса!'], ready: ['Рой пробудился.', 'Улей растёт.'], hurt: ['Рой истекает кислотой!'] },
  ashen: { select: ['Пепел шепчет.', 'Говори, смертный.', 'Синклит здесь.'], move: ['Тени расступаются.', 'Мы скользим.', 'Как пожелаешь.'], attack: ['Сжечь дотла.', 'Их души — наши.', 'Порча!'], ready: ['Мы явились из Разлома.', 'Жар пробуждён.'], hurt: ['Пепел осыпается!'] },
};
const TONE: Record<FactionId, { pitch: number; rate: number }> = { order: { pitch: 0.9, rate: 1 }, inquisition: { pitch: 0.85, rate: 0.95 }, clockwork: { pitch: 0.7, rate: 0.85 }, orks: { pitch: 0.6, rate: 1.25 }, eldar: { pitch: 1.2, rate: 1.15 }, tyranids: { pitch: 0.4, rate: 0.85 }, ashen: { pitch: 0.75, rate: 0.9 } };
const BIG = new Set<Kind>(['titan', 'hveh', 'legend', 'elite', 'healer']);

let last = 0, enabled = true, ruVoice: SpeechSynthesisVoice | null = null;
const pickVoice = () => { ruVoice = speechSynthesis.getVoices().find(v => v.lang.startsWith('ru')) ?? null; };
if ('speechSynthesis' in window) { pickVoice(); speechSynthesis.onvoiceschanged = pickVoice; }

export const voice = {
  set enabled(v: boolean) { enabled = v; if (!v && 'speechSynthesis' in window) speechSynthesis.cancel(); },
  get enabled() { return enabled; },
  /** Реплика юнита. Не чаще раза в 1.2 с, новая перебивает старую. */
  say(f: FactionId, kind: Kind, ev: Ev) {
    if (!enabled || !('speechSynthesis' in window)) return;
    const now = performance.now();
    if (now - last < 1200) return;
    last = now;
    const lines = LINES[f][ev], t = TONE[f];
    this.speak(lines[Math.floor(Math.random() * lines.length)], t.pitch * (BIG.has(kind) ? 0.7 : kind === 'builder' ? 1.15 : 1), t.rate * (kind === 'titan' ? 0.7 : 1));
  },
  /** Объявление (титан на поле, база под атакой): всегда звучит. */
  announce(text: string) { if (enabled && 'speechSynthesis' in window) { last = performance.now(); this.speak(text, 0.6, 0.85); } },
  speak(text: string, pitch: number, rate: number) {
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'ru-RU'; if (ruVoice) u.voice = ruVoice;
    u.pitch = Math.max(0, Math.min(2, pitch)); u.rate = rate; u.volume = 0.9;
    speechSynthesis.speak(u);
  },
};
