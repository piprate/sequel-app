import { mark, stop } from '../_utils/marks'
import uniqBy from 'lodash-es/uniqBy'
import isEqual from 'lodash-es/isEqual'
import { database } from '../_database/database'
import { concat } from '../_utils/arrays'
import { scheduleIdleTask } from '../_utils/scheduleIdleTask'
import { timelineItemToSummary } from '../_utils/timelineItemToSummary'
import {
  getForTimeline,
  rootTimelineItemSummaries,
  rootTimelineItemSummariesToAdd,
  rootFreshUpdates,
  setForTimeline, getThreads
} from "../_store/timeline";

function getExistingItemIdsSet (instanceName, timelineName) {
  const timelineItemSummaries = getForTimeline(rootTimelineItemSummaries, instanceName, timelineName) || []
  return new Set(timelineItemSummaries.map(_ => _.id))
}

function removeDuplicates (instanceName, timelineName, updates) {
  // remove duplicates, including duplicates due to reblogs
  const existingItemIds = getExistingItemIdsSet(instanceName, timelineName)
  return updates.filter(update => !existingItemIds.has(update.id))
}

async function insertUpdatesIntoTimeline (instanceName, timelineName, updates) {
  updates = removeDuplicates(instanceName, timelineName, updates)

  if (!updates.length) {
    return
  }

  await database.insertTimelineItems(instanceName, timelineName, updates)

  const itemSummariesToAdd = getForTimeline(rootTimelineItemSummariesToAdd, instanceName, timelineName) || []
  console.log('itemSummariesToAdd', JSON.parse(JSON.stringify(itemSummariesToAdd)))
  console.log('updates.map(timelineItemToSummary)', JSON.parse(JSON.stringify(updates.map(timelineItemToSummary))))
  console.log('concat(itemSummariesToAdd, updates.map(timelineItemToSummary))',
    JSON.parse(JSON.stringify(concat(itemSummariesToAdd, updates.map(item => timelineItemToSummary(item, instanceName))))))
  const newItemSummariesToAdd = uniqBy(
    concat(itemSummariesToAdd, updates.map(item => timelineItemToSummary(item, instanceName))),
    _ => _.id
  )
  if (!isEqual(itemSummariesToAdd, newItemSummariesToAdd)) {
    console.log('adding ', (newItemSummariesToAdd.length - itemSummariesToAdd.length),
      'items to timelineItemSummariesToAdd for timeline', timelineName)
    setForTimeline(rootTimelineItemSummariesToAdd, instanceName, timelineName, newItemSummariesToAdd);
  }
}

function isValidStatusForThread (thread, timelineName, itemSummariesToAdd) {
  const itemSummariesToAddIdSet = new Set(itemSummariesToAdd.map(_ => _.id))
  const threadIdSet = new Set(thread.map(_ => _.id))
  const focusedStatusId = timelineName.split('/')[1] // e.g. "status/123456"
  const focusedStatusIdx = thread.findIndex(_ => _.id === focusedStatusId)
  return status => {
    const repliedToStatusIdx = thread.findIndex(_ => _.id === status.in_reply_to_id)
    return (
      // A reply to an ancestor status is not valid for this thread, but for the focused status
      // itself or any of its descendents, it is valid.
      repliedToStatusIdx >= focusedStatusIdx &&
      // Not a duplicate
      !threadIdSet.has(status.id) &&
      // Not already about to be added
      !itemSummariesToAddIdSet.has(status.id)
    )
  }
}

async function insertUpdatesIntoThreads (instanceName, updates) {
  if (!updates.length) {
    return
  }

  const threads = getThreads(instanceName);
  const timelineNames = Object.keys(threads)
  for (const timelineName of timelineNames) {
    const thread = threads[timelineName]

    const itemSummariesToAdd = getForTimeline(rootTimelineItemSummariesToAdd, instanceName, timelineName) || []
    const validUpdates = updates.filter(isValidStatusForThread(thread, timelineName, itemSummariesToAdd))
    if (!validUpdates.length) {
      continue
    }
    const newItemSummariesToAdd = uniqBy(
      concat(itemSummariesToAdd, validUpdates.map(item => timelineItemToSummary(item, instanceName))),
      _ => _.id
    )
    if (!isEqual(itemSummariesToAdd, newItemSummariesToAdd)) {
      console.log('adding ', (newItemSummariesToAdd.length - itemSummariesToAdd.length),
        'items to timelineItemSummariesToAdd for thread', timelineName)
      setForTimeline(rootTimelineItemSummariesToAdd, instanceName, timelineName, newItemSummariesToAdd);
    }
  }
}

async function processFreshUpdates (instanceName, timelineName) {
  mark('processFreshUpdates')
  const _freshUpdates = getForTimeline(rootFreshUpdates, instanceName, timelineName);
  if (_freshUpdates && _freshUpdates.length) {
    const updates = _freshUpdates.slice()
    setForTimeline(rootFreshUpdates, instanceName, timelineName, []);

    await Promise.all([
      insertUpdatesIntoTimeline(instanceName, timelineName, updates),
      insertUpdatesIntoThreads(instanceName, updates.filter(status => status.in_reply_to_id))
    ])
  }
  stop('processFreshUpdates')
}

function lazilyProcessFreshUpdates (instanceName, timelineName) {
  scheduleIdleTask(() => {
    /* no await */ processFreshUpdates(instanceName, timelineName)
  })
}

export function addStatusOrNotification (instanceName, timelineName, newStatusOrNotification) {
  addStatusesOrNotifications(instanceName, timelineName, [newStatusOrNotification])
}

export function addStatusesOrNotifications (instanceName, timelineName, newStatusesOrNotifications) {
  console.log('addStatusesOrNotifications', Date.now())
  let _freshUpdates = getForTimeline(rootFreshUpdates, instanceName, timelineName) || [];
  _freshUpdates = concat(_freshUpdates, newStatusesOrNotifications)
  _freshUpdates = uniqBy(_freshUpdates, _ => _.id)
  setForTimeline(rootFreshUpdates, instanceName, timelineName, _freshUpdates);
  lazilyProcessFreshUpdates(instanceName, timelineName)
}
