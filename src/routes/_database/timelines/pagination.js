import { dbPromise, getDatabase } from '../databaseLifecycle'
import {
  BUBBLES_STORE,
  NOTIFICATION_TIMELINES_STORE,
  NOTIFICATIONS_STORE,
  POST_TIMELINES_STORE,
  POSTS_STORE,
  SPARKS_STORE,
  THREADS_STORE
} from '../constants'
import { createThreadKeyRange, createTimelineKeyRange } from '../keys'
import { fetchPost } from './fetchPost'
import { fetchNotification } from './fetchNotification'
import { TIMELINE_BATCH_SIZE } from '../../_static/timelines'

async function getNotificationTimeline (instanceName, timeline, maxId, limit, asSpark) {
  const storeNames = [NOTIFICATION_TIMELINES_STORE, NOTIFICATIONS_STORE, POSTS_STORE, SPARKS_STORE, BUBBLES_STORE]
  const db = await getDatabase(instanceName)
  return dbPromise(db, storeNames, 'readonly', (stores, callback) => {
    const [timelineStore, notificationsStore, postsStore, sparksStore, bubbleStore] = stores
    const keyRange = createTimelineKeyRange(timeline, maxId)

    timelineStore.getAll(keyRange, limit).onsuccess = e => {
      const timelineResults = e.target.result
      const res = new Array(timelineResults.length)
      timelineResults.forEach((notificationId, i) => {
        fetchNotification(notificationsStore, postsStore, sparksStore, bubbleStore, notificationId, notification => {
          res[i] = notification
        }, asSpark)
      })
      callback(res)
    }
  })
}

async function getPostTimeline (instanceName, timeline, maxId, limit, asSpark) {
  const storeNames = [POST_TIMELINES_STORE, POSTS_STORE, SPARKS_STORE, BUBBLES_STORE]
  const db = await getDatabase(instanceName)
  return dbPromise(db, storeNames, 'readonly', (stores, callback) => {
    const [timelineStore, postsStore, sparksStore, bubbleStore] = stores
    const getReq = timelineStore.getAll(createTimelineKeyRange(timeline, maxId), limit)
    getReq.onsuccess = e => {
      const timelineResults = e.target.result
      const res = new Array(timelineResults.length)
      timelineResults.forEach((postId, i) => {
        fetchPost(postsStore, sparksStore, bubbleStore, postId, post => {
          res[i] = post
        }, asSpark)
      })
      callback(res)
    }
  })
}

async function getPostThread (instanceName, postId, asSpark) {
  const storeNames = [THREADS_STORE, POSTS_STORE, SPARKS_STORE, BUBBLES_STORE]
  const db = await getDatabase(instanceName)
  return dbPromise(db, storeNames, 'readonly', (stores, callback) => {
    const [threadsStore, postsStore, sparksStore, bubbleStore] = stores
    const keyRange = createThreadKeyRange(postId)
    threadsStore.getAll(keyRange).onsuccess = e => {
      const thread = e.target.result
      if (thread.length) {
        const res = new Array(thread.length)
        callback(res)
        thread.forEach((otherPostId, i) => {
          fetchPost(postsStore, sparksStore, bubbleStore, otherPostId, post => {
            res[i] = post
          }, asSpark)
        })
      } else {
        // thread not cached; just make a "fake" thread with only one post in it
        fetchPost(postsStore, sparksStore, bubbleStore, postId, post => {
          if (post) {
            const res = [post]
            callback(res)
          } else {
            callback([])
          }
        }, asSpark)
      }
    }
  })
}

export async function getTimeline (instanceName, timeline, maxId, limit, asSpark) {
  maxId = maxId || null
  limit = limit || TIMELINE_BATCH_SIZE
  if (timeline === 'notifications' || timeline === 'notifications/mentions') {
    return getNotificationTimeline(instanceName, timeline, maxId, limit, asSpark)
  } else if (timeline.startsWith('post/')) {
    const postId = timeline.split('/').slice(-1)[0]
    return getPostThread(instanceName, postId, asSpark)
  } else {
    return getPostTimeline(instanceName, timeline, maxId, limit, asSpark)
  }
}
