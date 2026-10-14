import { defineConfig } from 'vite';
// две страницы: игра и галерея анимаций/юнитов
export default defineConfig({ build: { rollupOptions: { input: { main: 'index.html', anims: 'anims.html' } } } });
