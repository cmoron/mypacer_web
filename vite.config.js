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
  build: {
    // Les ~270 drapeaux SVG de flag-icons, inlinés en data-URI, gonflaient le CSS
    // de la home à 430 Ko ; en fichiers séparés, seuls les drapeaux affichés sont chargés.
    assetsInlineLimit: (file) => (file.includes('flag-icons') ? false : undefined),
  },
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
