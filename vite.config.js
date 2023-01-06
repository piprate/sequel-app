import { sveltekit } from '@sveltejs/kit/vite';
import { SvelteKitPWA } from '@vite-pwa/sveltekit';
import { version } from './package.json';
import intlLoader from './intl-plugin';

/** @type {import('vite').UserConfig} */
const config = {
  define: {
    'import.meta.env.SEQUEL_APP_VERSION': JSON.stringify(version)
  },
  resolve: {
    alias: {
      stream: 'stream-browserify'
    }
  },
  plugins: [
    intlLoader(),
    sveltekit(),
    SvelteKitPWA({
      outDir: 'dist',
      srcDir: './src',
      scope: '/',
      base: '/',
      filename: 'service-worker.js',
      workbox: {
        sourcemap: true,
        globDirectory: 'dist',
      },
      kit: {
        outDir: 'dist'
      }
    })
  ]
};

export default config;
