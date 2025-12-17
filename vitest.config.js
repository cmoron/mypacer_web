import {defineConfig} from 'vitest/config';
import {svelte} from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
  plugins: [svelte({hot: !process.env.VITEST})],
  test: {
    globals: true,
    environment: 'happy-dom',
    include: ['src/**/*.{test,spec}.{js,ts}', 'tests/**/*.{test,spec}.{js,ts}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      include: ['src/**/*.{js,svelte}'],
      exclude: ['src/**/*.{test,spec}.{js,ts}', 'src/main.js', '**/*.config.{js,ts}', '**/node_modules/**'],
      thresholds: {
        lines: 42,
        functions: 77,
        branches: 36,
        statements: 45,
      },
    },
  },
});
