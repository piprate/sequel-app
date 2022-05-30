// A store where you can divide data into "realms" that are backed with an LRU cache.
// Each realm has self-contained data that you can set with setForRealm() and compute
// with computeForRealm(). The maxSize determines how many realms to keep in the LRU cache.
import { QuickLRU } from '../_thirdparty/quick-lru/quick-lru'
import { mark, stop } from './marks'
import { requestPostAnimationFrame } from './requestPostAnimationFrame'
import { derived, writable } from 'svelte/store'

export function realmStore (maxSize) {
  let currentRealm = null
  const realms = new QuickLRU({ maxSize: maxSize })
  const _batches = {}

  const { subscribe, set, update } = writable({
    currentRealm,
    realms
  })

  return {
    subscribe,
    setCurrentRealm: (realm) => {
      currentRealm = realm
      set({
        currentRealm,
        realms
      })
    },
    setForRealm: (obj) => {
      if (!currentRealm) {
        i.dont.exist += 0
      }
      realms.set(currentRealm, Object.assign(realms.get(currentRealm) || {}, obj))
      set({
        currentRealm,
        realms
      })
    },
    get: () => {
      return {
        currentRealm,
        realms
      }
    },
    getForRealm: (key) => {
      const realmData = realms.get(currentRealm)
      return realmData && realmData[key]
    },
    /*
     * Update several values at once in a realm, assuming the key points
     * to a plain old javascript object.
     */
    batchUpdateForRealm: (key, subKey, value) => {
      let realmBatches = _batches[currentRealm]
      if (!realmBatches) {
        realmBatches = _batches[currentRealm] = {}
      }
      let batch = realmBatches[key]
      if (!batch) {
        batch = realmBatches[key] = {}
      }
      batch[subKey] = value

      requestPostAnimationFrame(() => {
        const batch = _batches[currentRealm] && _batches[currentRealm][key]
        if (!batch) {
          return
        }
        const updatedKeys = Object.keys(batch)
        if (!updatedKeys.length) {
          return
        }
        mark('batchUpdate')
        const realmData = realms.get(currentRealm)
        const obj = (realmData && realmData[key]) || {}
        for (const otherKey of updatedKeys) {
          obj[otherKey] = batch[otherKey]
        }
        delete _batches[currentRealm][key]
        realms.set(currentRealm, Object.assign(realms.get(currentRealm) || {}, { [key]: obj }))
        set({
          currentRealm,
          realms
        })
        stop('batchUpdate')
      })
    },
    clearRealmByPrefix: (prefix) => {
      for (const key of realms.getAllKeys()) {
        if (key.startsWith(prefix)) {
          console.log('deleted realm', key)
          realms.delete(key)
        }
      }
      set({
        currentRealm,
        realms
      })
    }
  }
}

export function deriveFromRealmStore (store, key, defaultValue) {
  return derived(
    store,
    $store => {
      const { currentRealm, realms } = $store
      const realmData = realms.get(currentRealm)
      return (realmData && realmData[key]) || defaultValue
    }
  )
}
