import isEqual from 'lodash-es/isEqual'
import { database } from '../_database/database'
import { scheduleIdleTask } from '../_utils/scheduleIdleTask'
import { rootTimelineItemSummaries, rootTimelineItemSummariesToAdd, setForTimeline } from '../_store/timeline'
import { get } from '../_utils/lodash-lite'
import { get as storeGet } from 'svelte/store'
import { currentSparkId } from '../_store/instance'

function filterItemIdsFromTimelines (instanceName, timelineFilter, idFilter) {
  const stores = [rootTimelineItemSummaries, rootTimelineItemSummariesToAdd]
  const summaryFilter = _ => idFilter(_.id)
  const asSpark = storeGet(currentSparkId)

  stores.forEach(store => {
    const timelineData = get(store.get(), [instanceName, asSpark])
    if (timelineData) {
      Object.keys(timelineData).forEach(timelineName => {
        const summaries = timelineData[timelineName]
        if (!timelineFilter(timelineName)) {
          return
        }
        const filteredSummaries = summaries.filter(summaryFilter)
        if (!isEqual(summaries, filteredSummaries)) {
          console.log('deleting an item from timeline', timelineName)
          setForTimeline(store, instanceName, timelineName, filteredSummaries, asSpark)
        }
      })
    }
  })
}

function deletePostIdsFromStore (instanceName, idsToDelete) {
  const idsToDeleteSet = new Set(idsToDelete)
  const idWasNotDeleted = id => !idsToDeleteSet.has(id)
  const notNotificationTimeline = timelineName => timelineName !== 'notifications'

  filterItemIdsFromTimelines(instanceName, notNotificationTimeline, idWasNotDeleted)
}

function deleteNotificationIdsFromStore (instanceName, idsToDelete) {
  const idsToDeleteSet = new Set(idsToDelete)
  const idWasNotDeleted = id => !idsToDeleteSet.has(id)
  const isNotificationTimeline = timelineName => timelineName === 'notifications'

  filterItemIdsFromTimelines(instanceName, isNotificationTimeline, idWasNotDeleted)
}

async function deletePostsAndNotifications (instanceName, postIdsToDelete, notificationIdsToDelete, asSpark) {
  deletePostIdsFromStore(instanceName, postIdsToDelete)
  deleteNotificationIdsFromStore(instanceName, notificationIdsToDelete)
  await database.deletePostsAndNotifications(instanceName, postIdsToDelete, notificationIdsToDelete, asSpark)
}

async function doDeletePost (instanceName, postId, asSpark) {
  console.log('deleting postId', postId)
  const postIdsToDelete = Array.from(new Set([postId].filter(Boolean)))
  const notificationIdsToDelete = Array.from(new Set(await database.getNotificationIdsForPosts(instanceName, postIdsToDelete)))
  await deletePostsAndNotifications(instanceName, postIdsToDelete, notificationIdsToDelete, asSpark)
}

export function deletePost (instanceName, postId, asSpark) {
  scheduleIdleTask(() => {
    /* no await */
    doDeletePost(instanceName, postId, asSpark)
  })
}
