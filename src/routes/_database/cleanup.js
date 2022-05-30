import { dbPromise, getDatabase } from './databaseLifecycle'
import {
  BUBBLE_RELATIONSHIPS_STORE,
  BUBBLES_STORE,
  NOTIFICATION_TIMELINES_STORE,
  NOTIFICATIONS_STORE,
  PINNED_POSTS_STORE,
  POST_TIMELINES_STORE,
  POSTS_STORE,
  RELATIONSHIPS_STORE,
  SPARKS_STORE,
  THREADS_STORE,
  TIMESTAMP,
  WORLD_RELATIONSHIPS_STORE,
  WORLDS_STORE,
  LISTINGS_STORE
} from './constants'
import debounce from 'lodash-es/debounce'
import { mark, stop } from '../_utils/marks'
import { deleteAll } from './utils'
import { createPinnedPostKeyRange, createThreadKeyRange } from './keys'
import { getKnownInstances } from './knownInstances'
import noop from 'lodash-es/noop'
import { CLEANUP_DELAY, CLEANUP_TIME_AGO } from '../_static/database'
import { scheduleIdleTask } from '../_utils/scheduleIdleTask'

const BATCH_SIZE = 20

function batchedGetAll (callGetAll, callback) {
  function nextBatch () {
    callGetAll().onsuccess = function (e) {
      const results = e.target.result
      callback(results)
      if (results.length) {
        nextBatch()
      }
    }
  }

  nextBatch()
}

function cleanupPosts (postsStore, postTimelinesStore, threadsStore, cutoff) {
  batchedGetAll(
    () => postsStore.index(TIMESTAMP).getAllKeys(IDBKeyRange.upperBound(cutoff), BATCH_SIZE),
    results => {
      results.forEach(postId => {
        postsStore.delete(postId)
        deleteAll(
          postTimelinesStore,
          postTimelinesStore.index('postId'),
          IDBKeyRange.only(postId)
        )
        deleteAll(
          threadsStore,
          threadsStore,
          createThreadKeyRange(postId)
        )
      })
    }
  )
}

function cleanupNotifications (notificationsStore, notificationTimelinesStore, cutoff) {
  batchedGetAll(
    () => notificationsStore.index(TIMESTAMP).getAllKeys(IDBKeyRange.upperBound(cutoff), BATCH_SIZE),
    results => {
      results.forEach(notificationId => {
        notificationsStore.delete(notificationId)
        deleteAll(
          notificationTimelinesStore,
          notificationTimelinesStore.index('notificationId'),
          IDBKeyRange.only(notificationId)
        )
      })
    }
  )
}

function cleanupSparks (sparksStore, pinnedPostsStore, cutoff) {
  batchedGetAll(
    () => sparksStore.index(TIMESTAMP).getAllKeys(IDBKeyRange.upperBound(cutoff), BATCH_SIZE),
    results => {
      results.forEach(sparkId => {
        sparksStore.delete(sparkId)
        deleteAll(
          pinnedPostsStore,
          pinnedPostsStore,
          createPinnedPostKeyRange(sparkId)
        )
      })
    }
  )
}

function cleanupSparkRelationships (sparkRelationshipsStore, cutoff) {
  batchedGetAll(
    () => sparkRelationshipsStore.index(TIMESTAMP).getAllKeys(IDBKeyRange.upperBound(cutoff), BATCH_SIZE),
    results => {
      results.forEach(relationshipId => {
        sparkRelationshipsStore.delete(relationshipId)
      })
    }
  )
}

function cleanupWorlds (worldsStore, cutoff) {
  batchedGetAll(
    () => worldsStore.index(TIMESTAMP).getAllKeys(IDBKeyRange.upperBound(cutoff), BATCH_SIZE),
    results => {
      results.forEach(worldId => {
        worldsStore.delete(worldId)
      })
    }
  )
}

function cleanupWorldRelationships (worldRelationshipsStore, cutoff) {
  batchedGetAll(
    () => worldRelationshipsStore.index(TIMESTAMP).getAllKeys(IDBKeyRange.upperBound(cutoff), BATCH_SIZE),
    results => {
      results.forEach(relationshipId => {
        worldRelationshipsStore.delete(relationshipId)
      })
    }
  )
}

function cleanupBubbles (bubblesStore, cutoff) {
  batchedGetAll(
    () => bubblesStore.index(TIMESTAMP).getAllKeys(IDBKeyRange.upperBound(cutoff), BATCH_SIZE),
    results => {
      results.forEach(bubbleId => {
        bubblesStore.delete(bubbleId)
      })
    }
  )
}

function cleanupBubbleRelationships (bubbleRelationshipsStore, cutoff) {
  batchedGetAll(
    () => bubbleRelationshipsStore.index(TIMESTAMP).getAllKeys(IDBKeyRange.upperBound(cutoff), BATCH_SIZE),
    results => {
      results.forEach(relationshipId => {
        bubbleRelationshipsStore.delete(relationshipId)
      })
    }
  )
}

function cleanupListings (listingsStore, cutoff) {
  batchedGetAll(
    () => listingsStore.index(TIMESTAMP).getAllKeys(IDBKeyRange.upperBound(cutoff), BATCH_SIZE),
    results => {
      results.forEach(index => {
        listingsStore.delete(index)
      })
    }
  )
}

export async function cleanup (instanceName) {
  console.log('cleanup', instanceName)
  mark(`cleanup:${instanceName}`)
  const db = await getDatabase(instanceName)
  const storeNames = [
    POSTS_STORE,
    POST_TIMELINES_STORE,
    NOTIFICATIONS_STORE,
    NOTIFICATION_TIMELINES_STORE,
    SPARKS_STORE,
    RELATIONSHIPS_STORE,
    WORLDS_STORE,
    WORLD_RELATIONSHIPS_STORE,
    BUBBLES_STORE,
    BUBBLE_RELATIONSHIPS_STORE,
    THREADS_STORE,
    PINNED_POSTS_STORE,
    LISTINGS_STORE
  ]
  await dbPromise(db, storeNames, 'readwrite', (stores) => {
    const [
      postsStore,
      postTimelinesStore,
      notificationsStore,
      notificationTimelinesStore,
      sparksStore,
      sparkRelationshipsStore,
      worldsStore,
      worldRelationshipsStore,
      bubblesStore,
      bubbleRelationshipsStore,
      threadsStore,
      pinnedPostsStore,
      listingsStore
    ] = stores

    const cutoff = Date.now() - CLEANUP_TIME_AGO

    cleanupPosts(postsStore, postTimelinesStore, threadsStore, cutoff)
    cleanupNotifications(notificationsStore, notificationTimelinesStore, cutoff)
    cleanupSparks(sparksStore, pinnedPostsStore, cutoff)
    cleanupSparkRelationships(sparkRelationshipsStore, cutoff)
    cleanupWorlds(worldsStore, cutoff)
    cleanupWorldRelationships(worldRelationshipsStore, cutoff)
    cleanupBubbles(bubblesStore, cutoff)
    cleanupBubbleRelationships(bubbleRelationshipsStore, cutoff)
    cleanupListings(listingsStore, cutoff)
  })
  stop(`cleanup:${instanceName}`)
}

function doCleanup (instanceName) {
  scheduleIdleTask(() => cleanup(instanceName))
}

async function scheduledCleanup () {
  console.log('scheduledCleanup')
  const knownInstances = await getKnownInstances()
  for (const instance of knownInstances) {
    doCleanup(instance)
  }
}

// we have unit tests that test indexedDB; we don't want this thing to run forever
export const scheduleCleanup = process.browser ? debounce(scheduledCleanup, CLEANUP_DELAY) : noop
