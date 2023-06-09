import { dbPromise, getDatabase } from '../databaseLifecycle'
import { getInCache, hasInCache, notificationsCache, postsCache, setInCache } from '../cache'
import { BUBBLES_STORE, NOTIFICATIONS_STORE, POSTS_STORE, SPARKS_STORE } from '../constants'
import { fetchPost } from './fetchPost'
import { fetchNotification } from './fetchNotification'
import { sparkSpecificPostId } from './cachePost'

export async function getPost(instanceName, id, asSpark) {
  const cacheId = sparkSpecificPostId(id, asSpark)
  if (hasInCache(postsCache, instanceName, cacheId)) {
    return getInCache(postsCache, instanceName, cacheId)
  }
  const db = await getDatabase(instanceName)
  const storeNames = [POSTS_STORE, SPARKS_STORE, BUBBLES_STORE]
  const result = await dbPromise(db, storeNames, 'readonly', (stores, callback) => {
    const [postsStore, sparksStore, bubblesStore] = stores
    fetchPost(postsStore, sparksStore, bubblesStore, id, callback, asSpark)
  })
  setInCache(postsCache, instanceName, id, result)
  return result
}

export async function getNotification(instanceName, id, asSpark) {
  if (hasInCache(notificationsCache, instanceName, id)) {
    return getInCache(notificationsCache, instanceName, id)
  }
  const db = await getDatabase(instanceName)
  const storeNames = [NOTIFICATIONS_STORE, POSTS_STORE, SPARKS_STORE, BUBBLES_STORE]
  const result = await dbPromise(db, storeNames, 'readonly', (stores, callback) => {
    const [notificationsStore, postsStore, sparksStore, bubblesStore] = stores
    fetchNotification(notificationsStore, postsStore, sparksStore, bubblesStore, id, callback, asSpark)
  })
  setInCache(notificationsCache, instanceName, id, result)
  return result
}
