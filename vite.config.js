import { sveltekit } from '@sveltejs/kit/vite'
import { SvelteKitPWA } from '@vite-pwa/sveltekit'
import { version } from './package.json'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'
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
        globDirectory: 'dist'
      },
      kit: {
        outDir: 'dist'
      }
    })
  ]
}

export default config
