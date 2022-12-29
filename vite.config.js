import { sveltekit } from '@sveltejs/kit/vite';
import intlLoader from './intl-plugin';
import { version } from './package.json';

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
  plugins: [intlLoader(), sveltekit()]
};

export default config;
