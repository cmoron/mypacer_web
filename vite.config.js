import {sveltekit} from '@sveltejs/kit/vite';
import {defineConfig} from 'vite';
import {readFileSync} from 'fs';

const pkg = JSON.parse(readFileSync('./package.json', 'utf-8'));

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
  },
  plugins: [sveltekit()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});
