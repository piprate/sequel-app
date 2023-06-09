<script>
  import { onMount, onDestroy } from 'svelte'
  import { PAGE_HISTORY_SIZE } from '../_static/pages'
  import { QuickLRU } from '../_thirdparty/quick-lru/quick-lru'
  import { tryToFocusElement } from '../_utils/tryToFocusElement'
  import { inBrowser } from '../_utils/browserOrNode'

  export let realm

  const cache = new QuickLRU({ maxSize: PAGE_HISTORY_SIZE })

  if (inBrowser()) {
    window.__focusRestorationCache = cache
  }

  function saveFocus(e) {
    const element = e.target
    if (element) {
      const elementId = element.getAttribute('id')
      if (elementId) {
        console.log('saveFocus', realm, elementId)
        setInCache({ elementId })
      }
    }
  }

  function clearFocus() {
    const { ignoreBlurEvents } = getInCache()
    if (!ignoreBlurEvents) {
      console.log('clearFocus', realm)
      deleteInCache('elementId')
    }
  }

  function setupPushState() {
    setInCache({ ignoreBlurEvents: false })
    if (inBrowser()) {
      window.addEventListener('pushState', onPushState)
    }
  }

  function teardownPushState() {
    if (inBrowser()) {
      window.removeEventListener('pushState', onPushState)
    }
  }

  function onPushState() {
    setInCache({ ignoreBlurEvents: true })
  }

  function setInCache(obj) {
    if (!cache.has(realm)) {
      cache.set(realm, {})
    }
    Object.assign(cache.get(realm), obj)
  }

  function deleteInCache(key) {
    if (cache.has(realm)) {
      delete cache.get(realm)[key]
    }
  }

  function getInCache() {
    return cache.get(realm) || {}
  }

  function restoreFocus() {
    const { elementId } = getInCache()
    if (!elementId) {
      return
    }
    console.log('restoreFocus', realm, elementId)
    tryToFocusElement(elementId)
  }

  onMount(() => {
    setupPushState()
    restoreFocus()
    if (!import.meta.env.PROD) {
      if (!realm) {
        throw new Error('FocusRestoration needs a realm')
      }
    }
  })

  onDestroy(() => {
    teardownPushState()
  })
</script>

<div on:focusin={saveFocus} on:focusout={clearFocus}>
  <slot />
</div>
