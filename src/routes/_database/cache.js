import { QuickLRU } from '../_thirdparty/quick-lru/quick-lru'

export const postsCache = {
  maxSize: 100,
  caches: {}
}
export const sparksCache = {
  maxSize: 50,
  caches: {}
}
export const relationshipsCache = {
  maxSize: 20,
  caches: {}
}
export const worldsCache = {
  maxSize: 50,
  caches: {}
}
export const worldRelationshipsCache = {
  maxSize: 20,
  caches: {}
}
export const bubblesCache = {
  maxSize: 50,
  caches: {}
}
export const bubbleRelationshipsCache = {
  maxSize: 20,
  caches: {}
}
export const listingsCache = {
  maxSize: 50,
  caches: {}
}
export const digitalArtsCache = {
  maxSize: 50,
  caches: {}
}
export const metaCache = {
  maxSize: 20,
  caches: {}
}
export const notificationsCache = {
  maxSize: 50,
  caches: {}
}

if (process.browser && process.env.NODE_ENV !== 'production') {
  (typeof self !== 'undefined' ? self : window).cacheStats = {
    posts: postsCache,
    sparks: sparksCache,
    relationships: relationshipsCache,
    meta: metaCache,
    notifications: notificationsCache
  }
}

function getOrCreateInstanceCache (cache, instanceName) {
  let cached = cache.caches[instanceName]
  if (!cached) {
    cached = cache.caches[instanceName] = new QuickLRU({ maxSize: cache.maxSize })
  }
  return cached
}

export function clearCache (cache, instanceName) {
  delete cache.caches[instanceName]
}

export function clearAllCaches (instanceName) {
  const allCaches = [postsCache, sparksCache, relationshipsCache, metaCache, notificationsCache]
  for (const cache of allCaches) {
    clearCache(cache, instanceName)
  }
}

export function setInCache (cache, instanceName, key, value) {
  const instanceCache = getOrCreateInstanceCache(cache, instanceName)
  return instanceCache.set(key, value)
}

export function getInCache (cache, instanceName, key) {
  const instanceCache = getOrCreateInstanceCache(cache, instanceName)
  return instanceCache.get(key)
}

export function hasInCache (cache, instanceName, key) {
  const instanceCache = getOrCreateInstanceCache(cache, instanceName)
  const res = instanceCache.has(key)
  if (process.env.NODE_ENV !== 'production') {
    if (res) {
      cache.hits = (cache.hits || 0) + 1
    } else {
      cache.misses = (cache.misses || 0) + 1
    }
  }
  return res
}

export function deleteFromCache (cache, instanceName, key) {
  const instanceCache = getOrCreateInstanceCache(cache, instanceName)
  instanceCache.delete(key)
}
