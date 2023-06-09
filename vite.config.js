import { sveltekit } from '@sveltejs/kit/vite'
import { SvelteKitPWA } from '@vite-pwa/sveltekit'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import { version } from './package.json'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'
import inject from '@rollup/plugin-inject'
import intlLoader from './intl-plugin'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

/** @type {import('vite').UserConfig} */
const config = {
  define: {
    'import.meta.env.SEQUEL_APP_VERSION': JSON.stringify(version)
  },
  test: {
    environment: 'jsdom',
    coverage: {
      provider: 'istanbul'
    },
    setupFiles: [resolve(__dirname, 'src/tests/setup.js')]
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
        globDirectory: 'dist'
      },
      kit: {
        outDir: 'dist'
      }
    })
    // Don't polyfill packages when in test mode because vitest requires node packages to run tests
  ].concat(process.env.NODE_ENV === 'test' ? [] : [nodePolyfills()]),
  resolve: {
    alias: {
      'node-fetch': './node_modules/node-fetch/browser.js'
    }
  },
  build: {
    rollupOptions: {
      plugins: [inject({ Buffer: ['buffer', 'Buffer'] })]
    }
  }
}

export default config
