// Тема интерфейса = тема фракции из дизайн-системы «Латунный Собор» (data-theme на <html>). Выбор запоминается.
const KEY = 'waha.theme';
export const THEMES = [
  { id: 'dark', name: 'Легион' }, { id: 'ashen', name: 'Культ' }, { id: 'light', name: 'Пергамент' },
];
export const theme = () => document.documentElement.dataset.theme ?? 'dark';
export function setTheme(id: string) {
  document.documentElement.dataset.theme = id;
  try { localStorage.setItem(KEY, id); } catch { /* приватный режим */ }
}
export const nextTheme = () => setTheme(THEMES[(THEMES.findIndex(t => t.id === theme()) + 1) % THEMES.length].id);
export const themeName = () => THEMES.find(t => t.id === theme())?.name ?? '';
let saved: string | null = null;
try { saved = localStorage.getItem(KEY); } catch { /* приватный режим */ }
setTheme(THEMES.some(t => t.id === saved) ? saved! : 'dark');
