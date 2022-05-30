import { dbPromise, getDatabase } from '../databaseLifecycle'
import { NOTIFICATIONS_STORE, POST_ID } from '../constants'

export async function getNotificationIdsForPosts (instanceName, postIds) {
  const db = await getDatabase(instanceName)
  return dbPromise(db, NOTIFICATIONS_STORE, 'readonly', (notificationsStore, callback) => {
    const res = []
    callback(res)
    postIds.forEach(postId => {
      const req = notificationsStore.index(POST_ID).getAllKeys(IDBKeyRange.only(postId))
      req.onsuccess = e => {
        for (const id of e.target.result) {
          res.push(id)
        }
      }
    })
  })
}
