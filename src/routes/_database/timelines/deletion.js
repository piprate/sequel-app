import { dbPromise, getDatabase } from '../databaseLifecycle'
import { deleteFromCache, notificationsCache, postsCache } from '../cache'
import {
  NOTIFICATION_TIMELINES_STORE,
  NOTIFICATIONS_STORE,
  PINNED_POSTS_STORE,
  POST_TIMELINES_STORE,
  POSTS_STORE,
  THREADS_STORE
} from '../constants'
import { createThreadKeyRange } from '../keys'
import { deleteAll } from '../utils'
import { sparkSpecificPostId } from './cachePost'

export async function deletePostsAndNotifications (instanceName, postIds, notificationIds, asSpark) {
  for (const postId of postIds) {
    deleteFromCache(postsCache, instanceName, sparkSpecificPostId(postId, asSpark))
  }
  for (const notificationId of notificationIds) {
    deleteFromCache(notificationsCache, instanceName, notificationId)
  }
  const db = await getDatabase(instanceName)
  const storeNames = [
    POSTS_STORE,
    POST_TIMELINES_STORE,
    NOTIFICATIONS_STORE,
    NOTIFICATION_TIMELINES_STORE,
    PINNED_POSTS_STORE,
    THREADS_STORE
  ]
  await dbPromise(db, storeNames, 'readwrite', (stores) => {
    const [
      postsStore,
      postTimelinesStore,
      notificationsStore,
      notificationTimelinesStore,
      pinnedPostsStore,
      threadsStore
    ] = stores

    function deletePost (postId) {
      deleteAll(
        postsStore,
        postsStore.index('did'),
        IDBKeyRange.only(postId)
      )
      deleteAll(
        pinnedPostsStore,
        pinnedPostsStore.index('postId'),
        IDBKeyRange.only(postId)
      )
      deleteAll(
        postTimelinesStore,
        postTimelinesStore.index('postId'),
        IDBKeyRange.only(postId)
      )
      deleteAll(
        threadsStore,
        threadsStore.index('postId'),
        IDBKeyRange.only(postId)
      )
      deleteAll(
        threadsStore,
        threadsStore,
        createThreadKeyRange(postId)
      )
    }

    function deleteNotification (notificationId) {
      notificationsStore.delete(notificationId)
      deleteAll(
        notificationTimelinesStore,
        notificationTimelinesStore.index('notificationId'),
        IDBKeyRange.only(notificationId)
      )
    }

    for (const postId of postIds) {
      deletePost(postId)
    }
    for (const notificationId of notificationIds) {
      deleteNotification(notificationId)
    }
  })
}
