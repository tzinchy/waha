import { defineConfig } from 'vite';
// Игра, галерея и справочник живых 3D-моделей доступны в production-сборке.
export default defineConfig({ build: { rollupOptions: { input: { main: 'index.html' } } } });
