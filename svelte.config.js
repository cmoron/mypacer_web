import adapter from '@sveltejs/adapter-static';
import {vitePreprocess} from '@sveltejs/vite-plugin-svelte';

export default {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter({
      pages: 'dist',
      assets: 'dist',
      precompress: false,
      // Coquille servie par nginx sur les URL inconnues (vrai code 404).
      fallback: '404.html',
      strict: true,
    }),
    alias: {
      $lib: 'src/lib',
      $components: 'src/lib/components',
      $stores: 'src/lib/stores',
      $utils: 'src/lib/utils',
    },
  },
};
