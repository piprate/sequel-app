import { mark, stop } from '../../_utils/marks'
import { deriveFromRealmStore, realmStore } from '../../_utils/RealmStore'
import { reselect } from '../../_utils/reselect'
import { derived } from 'svelte/store'
import { inBrowser } from '../../_utils/browserOrNode'

const RENDER_BUFFER_FACTOR = 2.5

export const virtualListStore = realmStore(/* maxSize */ 10)

// TODO: this is hacky
export function clearRealmByPrefix (store, prefix) {
  const { currentRealm, realms } = store.get()
  if (!realms) {
    return
  }
  for (const key of realms.getAllKeys()) {
    if (key.startsWith(prefix)) {
      console.log('deleted realm', key)
      realms.delete(key)
    }
  }
  store.set({ currentRealm, realms })
}

export const items = deriveFromRealmStore(virtualListStore, 'items', null)
export const showFooter = deriveFromRealmStore(virtualListStore, 'showFooter', false)
export const footerHeight = deriveFromRealmStore(virtualListStore, 'footerHeight', 0)
export const showHeader = deriveFromRealmStore(virtualListStore, 'showHeader', false)
export const headerHeight = deriveFromRealmStore(virtualListStore, 'headerHeight', 0)
export const scrollTop = deriveFromRealmStore(virtualListStore, 'scrollTop', 0)
export const scrollHeight = deriveFromRealmStore(virtualListStore, 'scrollHeight', 0)
export const offsetHeight = deriveFromRealmStore(virtualListStore, 'offsetHeight', 0)
export const listOffset = deriveFromRealmStore(virtualListStore, 'listOffset', 0)
export const itemHeights = deriveFromRealmStore(virtualListStore, 'itemHeights', {})

export const rawVisibleItems = derived(
  [items, scrollTop, itemHeights, offsetHeight, showHeader, headerHeight, listOffset],
  ([$items, $scrollTop, $itemHeights, $offsetHeight, $showHeader, $headerHeight, $listOffset]) => {
    if (inBrowser() && !import.meta.env.PROD) {
      window.rawVisibleItemsComputed = (window.rawVisibleItemsComputed || 0) + 1
    }
    mark('compute visibleItems')
    if (!$items) {
      return null
    }
    const effectiveScrollTop = $scrollTop - $listOffset
    const renderBuffer = RENDER_BUFFER_FACTOR * $offsetHeight
    const visibleItems = []
    let totalOffset = $showHeader ? $headerHeight : 0
    const len = $items.length
    let i = -1
    while (++i < len) {
      const key = $items[i]
      const height = $itemHeights[key] || 0
      const currentOffset = totalOffset
      totalOffset += height
      const isAboveViewport = (currentOffset < effectiveScrollTop)
      if (isAboveViewport) {
        if ((effectiveScrollTop - height - renderBuffer) > currentOffset) {
          continue // above the area we want to render
        }
      } else {
        if (currentOffset > (effectiveScrollTop + $offsetHeight + renderBuffer)) {
          break // below the area we want to render
        }
      }
      visibleItems.push({
        offset: currentOffset,
        key: key,
        index: i
      })
    }
    stop('compute visibleItems')
    return visibleItems
  }
)

export const visibleItems = reselect(rawVisibleItems, 'rawVisibleItems')

export const heightWithoutFooter = derived(
  [items, itemHeights, showHeader, headerHeight],
  ([$items, $itemHeights, $showHeader, $headerHeight]) => {
    if (!$items) {
      return 0
    }
    let sum = $showHeader ? $headerHeight : 0
    let i = -1
    const len = $items.length
    while (++i < len) {
      sum += $itemHeights[$items[i]] || 0
    }
    return sum
  }
)

export const height = derived(
  [heightWithoutFooter, showFooter, footerHeight],
  ([$heightWithoutFooter, $showFooter, $footerHeight]) => {
    return $showFooter ? ($heightWithoutFooter + $footerHeight) : $heightWithoutFooter
  }
)

export const length = derived(
  items,
  $items => $items ? $items.length : 0
)

export const allVisibleItemsHaveHeight = derived(
  [visibleItems, itemHeights],
  ([$visibleItems, $itemHeights]) => {
    if (!$visibleItems) {
      return false
    }
    for (const visibleItem of $visibleItems) {
      if (!$itemHeights[visibleItem.key]) {
        return false
      }
    }
    return true
  }
)

// if (typeof window !== "undefined") {
//   window.__virtualListStore = virtualListStore // for debugging
//
//   if (!import.meta.env.PROD) { // for extra debugging
//     virtualListStore.on('state', ({ changed }) => {
//       if (changed.visibleItems) {
//         window.visibleItemsChangedCount = (window.visibleItemsChangedCount || 0) + 1
//       }
//       if (changed.rawVisibleItems) {
//         window.rawVisibleItemsChangedCount = (window.rawVisibleItemsChangedCount || 0) + 1
//       }
//     })
//   }
// }
