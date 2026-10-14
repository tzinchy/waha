// Два стиля интерфейса: 'deco' (Art Deco) и 'ascii' (тёмное фэнтези в псевдографике). Выбор запоминается.
const KEY = 'waha.theme';
export const isAscii = () => document.documentElement.classList.contains('ascii');

export function setTheme(t: 'deco' | 'ascii') {
  document.documentElement.classList.toggle('ascii', t === 'ascii');
  try { localStorage.setItem(KEY, t); } catch { /* приватный режим */ }
}

let saved: string | null = null;
try { saved = localStorage.getItem(KEY); } catch { /* приватный режим */ }
setTheme(saved === 'ascii' ? 'ascii' : 'deco'); // Новый посетитель видит художественное оформление.
