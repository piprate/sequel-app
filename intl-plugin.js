import svelteIntlLoader from './svelte-intl-loader'

const fileRegex = /\.(js|html|svelte)$/

/** @type {() => import('vite').PluginOption} */
export default function intlLoader() {
  return {
    name: 'intl-loader',
    enforce: 'pre',
    transform(src, id) {
      if (fileRegex.test(id)) {
        return {
          code: svelteIntlLoader(src),
          map: null // provide source map if available
        }
      }
    }
  }
}
