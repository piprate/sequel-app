import difference from 'lodash-es/difference'
import times from 'lodash-es/times'
import { cloneForStorage } from '../helpers'
import { dbPromise, getDatabase } from '../databaseLifecycle'
import { notificationsCache, postsCache, setInCache, sparksCache } from '../cache'
import { scheduleCleanup } from '../cleanup'
import {
  BUBBLES_STORE,
  NOTIFICATION_TIMELINES_STORE,
  NOTIFICATIONS_STORE,
  POST_TIMELINES_STORE,
  POSTS_STORE,
  SPARKS_STORE,
  THREADS_STORE
} from '../constants'
import { createThreadId, createThreadKeyRange, createTimelineId, mergeKeyWithSparkId } from '../keys'
import { cachePost, sparkSpecificPostId } from './cachePost'

export function putPost (postsStore, post, asSpark) {
  postsStore.put(cloneForStorage(post), sparkSpecificPostId(post.id, asSpark))
}

export function putSpark (sparksStore, spark) {
  sparksStore.put(cloneForStorage(spark))
}

export function putBubble (bubblesStore, bubble) {
  bubblesStore.put(cloneForStorage(bubble))
}

export function putNotification (notificationsStore, notification) {
  notificationsStore.put(cloneForStorage(notification))
}

export function storePost (postsStore, sparksStore, bubblesStore, post, asSpark) {
  putPost(postsStore, post, asSpark)
  if (post.authorRef) {
    putSpark(sparksStore, post.authorRef)
  }
  if (post.bubbleRef) {
    putBubble(bubblesStore, post.bubbleRef)
  }
}

export function storeNotification (notificationsStore, postsStore, sparksStore, bubblesStore, notification, asSpark) {
  if (notification.subjectPost) {
    storePost(postsStore, sparksStore, bubblesStore, notification.subjectPost, asSpark)
  }
  if (notification.subjectBubble) {
    putBubble(bubblesStore, notification.subjectBubble)
  }
  if (notification.actor) {
    putSpark(sparksStore, notification.actor)
  }
  putNotification(notificationsStore, notification)
}

async function insertTimelineNotifications (instanceName, timeline, notifications, asSpark) {
  for (const notification of notifications) {
    setInCache(notificationsCache, instanceName, notification.id, notification)
    if (notification.actor) {
      setInCache(sparksCache, instanceName, notification.actor.id, notification.actor)
    }
    if (notification.subjectPost) {
      cachePost(notification.subjectPost, instanceName, asSpark)
    }
  }
  const db = await getDatabase(instanceName)
  const storeNames = [NOTIFICATION_TIMELINES_STORE, NOTIFICATIONS_STORE, SPARKS_STORE, POSTS_STORE, BUBBLES_STORE]
  await dbPromise(db, storeNames, 'readwrite', (stores) => {
    const [timelineStore, notificationsStore, sparksStore, postsStore, bubblesStore] = stores
    for (const notification of notifications) {
      storeNotification(notificationsStore, postsStore, sparksStore, bubblesStore, notification, asSpark)
      timelineStore.put(notification.id, mergeKeyWithSparkId(createTimelineId(timeline, notification.id)))
    }
  })
}

async function insertTimelinePosts (instanceName, timeline, posts, asSpark) {
  for (const post of posts) {
    cachePost(post, instanceName, asSpark)
  }
  const db = await getDatabase(instanceName)
  const storeNames = [POST_TIMELINES_STORE, POSTS_STORE, SPARKS_STORE, BUBBLES_STORE]
  await dbPromise(db, storeNames, 'readwrite', (stores) => {
    const [timelineStore, postsStore, sparksStore, bubblesStore] = stores
    for (const post of posts) {
      storePost(postsStore, sparksStore, bubblesStore, post, asSpark)
      timelineStore.put(post.id, mergeKeyWithSparkId(createTimelineId(timeline, post.timelineID)))
    }
  })
}

async function insertPostThread (instanceName, postId, posts, asSpark) {
  for (const post of posts) {
    cachePost(post, instanceName, asSpark)
  }
  const db = await getDatabase(instanceName)
  const storeNames = [THREADS_STORE, POSTS_STORE, SPARKS_STORE, BUBBLES_STORE]
  await dbPromise(db, storeNames, 'readwrite', (stores) => {
    const [threadsStore, postsStore, sparksStore, bubblesStore] = stores
    threadsStore.getAllKeys(createThreadKeyRange(postId)).onsuccess = e => {
      const existingKeys = e.target.result
      const newKeys = times(posts.length, i => createThreadId(postId, i))
      const keysToDelete = difference(existingKeys, newKeys)
      for (const key of keysToDelete) {
        threadsStore.delete(key)
      }
    }
    posts.forEach((otherPost, i) => {
      storePost(postsStore, sparksStore, bubblesStore, otherPost, asSpark)
      threadsStore.put(otherPost.id, mergeKeyWithSparkId(createThreadId(postId, i)))
    })
  })
}

export async function insertTimelineItems (instanceName, timeline, timelineItems, asSpark) {
  console.log('insertTimelineItems', instanceName, timeline, timelineItems, asSpark)
  /* no await */
  scheduleCleanup()
  if (timeline === 'notifications' || timeline === 'notifications/mentions') {
    return insertTimelineNotifications(instanceName, timeline, timelineItems, asSpark)
  } else if (timeline.startsWith('post/')) {
    const postId = timeline.split('/').slice(-1)[0]
    return insertPostThread(instanceName, postId, timelineItems, asSpark)
  } else {
    return insertTimelinePosts(instanceName, timeline, timelineItems, asSpark)
  }
}

export async function insertPost (instanceName, post, asSpark) {
  cachePost(post, instanceName, asSpark)
  const db = await getDatabase(instanceName)
  await dbPromise(db, [POSTS_STORE, SPARKS_STORE, BUBBLES_STORE], 'readwrite', ([postsStore, sparksStore, bubblesStore]) => {
    storePost(postsStore, sparksStore, bubblesStore, post, asSpark)
  })
}
