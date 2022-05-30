import { getIdsThatRebloggedThisStatus, getNotificationIdsForStatuses } from './statuses'
import isEqual from 'lodash-es/isEqual'
import { database } from '../_database/database'
import { scheduleIdleTask } from '../_utils/scheduleIdleTask'
import { rootTimelineItemSummaries, rootTimelineItemSummariesToAdd, setForTimeline } from "../_store/timeline";

function filterItemIdsFromTimelines (instanceName, timelineFilter, idFilter) {
  const stores = [rootTimelineItemSummaries, rootTimelineItemSummariesToAdd];
  const summaryFilter = _ => idFilter(_.id)

  stores.forEach(store => {
    const timelineData = store.get()[instanceName];
    Object.keys(timelineData).forEach(timelineName => {
      const summaries = timelineData[timelineName]
      if (!timelineFilter(timelineName)) {
        return
      }
      const filteredSummaries = summaries.filter(summaryFilter)
      if (!isEqual(summaries, filteredSummaries)) {
        console.log('deleting an item from timelineName', timelineName)
        setForTimeline(store, instanceName, timelineName, filteredSummaries);
      }
    })
  })
}

function deleteStatusIdsFromStore (instanceName, idsToDelete) {
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

async function deleteStatusesAndNotifications (instanceName, statusIdsToDelete, notificationIdsToDelete) {
  deleteStatusIdsFromStore(instanceName, statusIdsToDelete)
  deleteNotificationIdsFromStore(instanceName, notificationIdsToDelete)
  await database.deleteStatusesAndNotifications(instanceName, statusIdsToDelete, notificationIdsToDelete)
}

async function doDeleteStatus (instanceName, statusId) {
  console.log('deleting statusId', statusId)
  const rebloggedIds = await getIdsThatRebloggedThisStatus(instanceName, statusId)
  const statusIdsToDelete = Array.from(new Set([statusId].concat(rebloggedIds).filter(Boolean)))
  const notificationIdsToDelete = Array.from(new Set(await getNotificationIdsForStatuses(instanceName, statusIdsToDelete)))
  await deleteStatusesAndNotifications(instanceName, statusIdsToDelete, notificationIdsToDelete)
}

export function deleteStatus (instanceName, statusId) {
  scheduleIdleTask(() => {
    /* no await */ doDeleteStatus(instanceName, statusId)
  })
}
