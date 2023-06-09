import { mark, stop } from '../_utils/marks'
import uniqBy from 'lodash-es/uniqBy'
import isEqual from 'lodash-es/isEqual'
import { database } from '../_database/database'
import { concat } from '../_utils/arrays'
import { scheduleIdleTask } from '../_utils/scheduleIdleTask'
import { timelineItemToSummary } from '../_utils/timelineItemToSummary'
import {
  getForTimeline,
  getThreads,
  rootFreshUpdates,
  rootPostFromSocket,
  rootTimelineItemSummaries,
  rootTimelineItemSummariesToAdd,
  setForTimeline
} from '../_store/timeline'
import { addTimelineItemSummaries, isTimelineInReaderMode, showMoreItemsForCurrentTimeline } from './timeline'

function getExistingItemIdsSet(instanceName, timelineName) {
  const timelineItemSummaries = getForTimeline(rootTimelineItemSummaries, instanceName, timelineName) || []
  return new Set(timelineItemSummaries.map((_) => _.id))
}

function removeDuplicates(instanceName, timelineName, updates) {
  // remove duplicates, including duplicates due to reblogs
  const existingItemIds = getExistingItemIdsSet(instanceName, timelineName)
  return updates.filter((update) => !existingItemIds.has(update.id))
}

async function insertUpdatesIntoTimeline(instanceName, timelineName, updates, asSpark) {
  updates = removeDuplicates(instanceName, timelineName, updates)

  if (!timelineName.endsWith('/with_comments') && !timelineName.startsWith('post/')) {
    // TODO: if you remove the 'post/' check above, it will cause an error.
    // Check what can be done. It doesn't feel right to treat posts differently.
    updates = updates.filter((update) => !update.inReplyTo)
  }

  if (!updates.length) {
    return
  }

  await database.insertTimelineItems(instanceName, timelineName, updates, asSpark)

  const itemSummariesToAdd = getForTimeline(rootTimelineItemSummariesToAdd, instanceName, timelineName, asSpark) || []
  console.log('itemSummariesToAdd', JSON.parse(JSON.stringify(itemSummariesToAdd)))
  console.log('updates.map(timelineItemToSummary)', JSON.parse(JSON.stringify(updates.map(timelineItemToSummary))))
  console.log(
    'concat(itemSummariesToAdd, updates.map(timelineItemToSummary))',
    JSON.parse(
      JSON.stringify(
        concat(
          itemSummariesToAdd,
          updates.map((item) => timelineItemToSummary(item, instanceName))
        )
      )
    )
  )
  const newItemSummariesToAdd = uniqBy(
    concat(
      itemSummariesToAdd,
      updates.map((item) => timelineItemToSummary(item, instanceName))
    ),
    (_) => _.id
  )
  if (!isEqual(itemSummariesToAdd, newItemSummariesToAdd)) {
    console.log(
      'adding ',
      newItemSummariesToAdd.length - itemSummariesToAdd.length,
      'items to timelineItemSummariesToAdd for timeline',
      timelineName
    )
    setForTimeline(rootTimelineItemSummariesToAdd, instanceName, timelineName, newItemSummariesToAdd, asSpark)

    if (
      newItemSummariesToAdd.filter((summary) => summary.sparkId === asSpark).length ||
      isTimelineInReaderMode(timelineName)
    ) {
      showMoreItemsForCurrentTimeline()
    }
  }
}

function isValidPostForThread(thread, timelineName, itemSummariesToAdd) {
  const itemSummariesToAddIdSet = new Set(itemSummariesToAdd.map((_) => _.id))
  const threadIdSet = new Set(thread.map((_) => _.id))
  const focusedPostId = timelineName.split('/')[1] // e.g. "post/123456"
  const focusedPostIdx = thread.findIndex((_) => _.id === focusedPostId)
  return (post) => {
    const repliedToPostIdx = thread.findIndex((_) => _.id === post.inReplyTo)
    return (
      // A reply to an ancestor post is not valid for this thread, but for the focused post
      // itself or any of its descendents, it is valid.
      repliedToPostIdx >= focusedPostIdx &&
      // Not a duplicate
      !threadIdSet.has(post.id) &&
      // Not already about to be added
      !itemSummariesToAddIdSet.has(post.id)
    )
  }
}

async function insertUpdatesIntoThreads(instanceName, updates, asSpark) {
  if (!updates.length) {
    return
  }

  const threads = getThreads(instanceName, asSpark)
  const timelineNames = Object.keys(threads)
  for (const timelineName of timelineNames) {
    const thread = threads[timelineName]

    const itemSummariesToAdd = getForTimeline(rootTimelineItemSummariesToAdd, instanceName, timelineName, asSpark) || []
    const validUpdates = updates.filter(isValidPostForThread(thread, timelineName, itemSummariesToAdd))
    if (!validUpdates.length) {
      continue
    }
    const newItemSummariesToAdd = uniqBy(
      concat(
        itemSummariesToAdd,
        validUpdates.map((item) => timelineItemToSummary(item, instanceName))
      ),
      (_) => _.id
    )
    if (!isEqual(itemSummariesToAdd, newItemSummariesToAdd)) {
      console.log(
        'adding ',
        newItemSummariesToAdd.length - itemSummariesToAdd.length,
        'items to timelineItemSummariesToAdd for thread',
        timelineName
      )
      setForTimeline(rootTimelineItemSummariesToAdd, instanceName, timelineName, newItemSummariesToAdd, asSpark)
    }
  }
}

async function processFreshUpdates(instanceName, timelineName, asSpark) {
  mark('processFreshUpdates')
  const _freshUpdates = getForTimeline(rootFreshUpdates, instanceName, timelineName, asSpark)
  if (_freshUpdates && _freshUpdates.length) {
    const updates = _freshUpdates.slice()
    setForTimeline(rootFreshUpdates, instanceName, timelineName, [], asSpark)

    await Promise.all([
      insertUpdatesIntoTimeline(instanceName, timelineName, updates, asSpark),
      insertUpdatesIntoThreads(
        instanceName,
        updates.filter((post) => post.inReplyTo),
        asSpark
      )
    ])
  }
  stop('processFreshUpdates')
}

function lazilyProcessFreshUpdates(instanceName, timelineName, asSpark) {
  scheduleIdleTask(() => {
    /* no await */
    processFreshUpdates(instanceName, timelineName, asSpark)
  })
}

export function addPostOrNotification(instanceName, timelineName, newPostOrNotification, asSpark, isPostFromSocket) {
  if (isPostFromSocket) {
    setForTimeline(rootPostFromSocket, instanceName, timelineName, newPostOrNotification, asSpark)
  }
  addPostsOrNotifications(instanceName, timelineName, [newPostOrNotification], asSpark)
}

export function addPostsOrNotifications(instanceName, timelineName, newPostsOrNotifications, asSpark) {
  console.log('addPostsOrNotifications', Date.now())
  let _freshUpdates = getForTimeline(rootFreshUpdates, instanceName, timelineName, asSpark) || []
  _freshUpdates = concat(_freshUpdates, newPostsOrNotifications)
  _freshUpdates = uniqBy(_freshUpdates, (_) => _.id)
  setForTimeline(rootFreshUpdates, instanceName, timelineName, _freshUpdates, asSpark)
  lazilyProcessFreshUpdates(instanceName, timelineName, asSpark)
}
