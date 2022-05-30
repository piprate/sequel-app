import { accessToken } from '../_store/instance'
import {
  getForTimeline,
  rootTimelineItemSummaries,
  rootTimelineItemSummariesAreStale,
  rootTimelineItemSummariesToAdd,
  rootTimelineNextPageId,
  timelineNextPageId,
  lastTimelineItemId,
  rootRunningUpdate,
  rootShouldShowHeader,
  rootShowHeader,
  setForTimeline,
  timelineItemSummaries,
  timelineItemSummariesAreStale
} from '../_store/timeline'
import { currentInstance, currentTimeline, online } from '../_store/local'
import { getTimeline } from '../_api/timelines'
import { toast } from '../_components/toast/toast'
import { mark, stop } from '../_utils/marks'
import { concat, mergeArrays } from '../_utils/arrays'
import { compareTimelineItemSummaries } from '../_utils/statusIdSorting'
import isEqual from 'lodash-es/isEqual'
import { database } from '../_database/database'
import { getStatus, getStatusContext } from '../_api/statuses'
import { emit } from '../_utils/eventBus'
import { TIMELINE_BATCH_SIZE } from '../_static/timelines'
import { timelineItemToSummary } from '../_utils/timelineItemToSummary'
import uniqBy from 'lodash-es/uniqBy'
import { addStatusesOrNotifications } from './addStatusOrNotification'
import { scheduleIdleTask } from '../_utils/scheduleIdleTask'
import { sortItemSummariesForThread } from '../_utils/sortItemSummariesForThread'
import li from 'li'
import { get } from 'svelte/store';

const byId = _ => _.id

async function storeFreshTimelineItemsInDatabase (instanceName, timelineName, items) {
  await database.insertTimelineItems(instanceName, timelineName, items)
  if (timelineName.startsWith('status/')) {
    // For status threads, we want to be sure to update the favorite/reblog counts even if
    // this is a stale "view" of the status. See 119-status-counts-update.js for
    // an example of why we need this.
    items.forEach(item => {
      emit('statusUpdated', item)
    })
  }
}

async function updateStatus (instanceName, accessToken, statusId) {
  const status = await getStatus(instanceName, accessToken, statusId)
  await database.insertStatus(instanceName, status)
  emit('statusUpdated', status)
  return status
}

async function updateStatusAndThread (instanceName, accessToken, timelineName, statusId) {
  const [status, context] = await Promise.all([
    updateStatus(instanceName, accessToken, statusId),
    getStatusContext(instanceName, accessToken, statusId)
  ])
  await database.insertTimelineItems(
    instanceName,
    timelineName,
    concat(context.ancestors, status, context.descendants)
  )
  addStatusesOrNotifications(instanceName, timelineName, concat(context.ancestors, context.descendants))
}

async function fetchFreshThreadFromNetwork (instanceName, accessToken, statusId) {
  const [status, context] = await Promise.all([
    getStatus(instanceName, accessToken, statusId),
    getStatusContext(instanceName, accessToken, statusId)
  ])
  return concat(context.ancestors, status, context.descendants)
}

async function fetchThreadFromNetwork (instanceName, accessToken, timelineName) {
  const statusId = timelineName.split('/').slice(-1)[0]

  // For threads, we do several optimizations to make it a bit faster to load.
  // The vast majority of statuses have no replies and aren't in reply to anything,
  // so we want that to be as fast as possible.
  const status = await database.getStatus(instanceName, statusId)
  if (!status) {
    // If for whatever reason the status is not cached, fetch everything from the network
    // and wait for the result. This happens in very unlikely cases (e.g. loading /statuses/<id>
    // where <id> is not cached locally) but is worth covering.
    return fetchFreshThreadFromNetwork(instanceName, accessToken, statusId)
  }

  if (!status.in_reply_to_id) {
    // status is not a reply to another status (fast path)
    // Update the status and thread asynchronously, but return just the status for now
    // Any replies to the status will load asynchronously
    /* no await */ updateStatusAndThread(instanceName, accessToken, timelineName, statusId)
    return [status]
  }
  // status is a reply to some other status, meaning we don't want some
  // jerky behavior where it suddenly scrolls into place. Update the status asynchronously
  // but grab the thread now
  scheduleIdleTask(() => updateStatus(instanceName, accessToken, statusId))
  const context = await getStatusContext(instanceName, accessToken, statusId)
  return concat(context.ancestors, status, context.descendants)
}

async function fetchTimelineItemsFromNetwork (instanceName, accessToken, timelineName, lastTimelineItemId) {
  if (timelineName.startsWith('status/')) { // special case - this is a list of descendents and ancestors
    return fetchThreadFromNetwork(instanceName, accessToken, timelineName)
  } else { // normal timeline
    const { items } = await getTimeline(instanceName, accessToken, timelineName, lastTimelineItemId, null, TIMELINE_BATCH_SIZE)
    return items
  }
}
async function addPagedTimelineItems (instanceName, timelineName, items) {
  console.log('addPagedTimelineItems, length:', items.length)
  mark('addPagedTimelineItemSummaries')
  const newSummaries = items.map(item => timelineItemToSummary(item, instanceName))
  await addPagedTimelineItemSummaries(instanceName, timelineName, newSummaries)
  stop('addPagedTimelineItemSummaries')
}

export async function addPagedTimelineItemSummaries (instanceName, timelineName, newSummaries) {
  const oldSummaries = getForTimeline(rootTimelineItemSummaries, instanceName, timelineName)

  const mergedSummaries = uniqBy(concat(oldSummaries || [], newSummaries), byId)

  if (!isEqual(oldSummaries, mergedSummaries)) {
    setForTimeline(rootTimelineItemSummaries, instanceName, timelineName, mergedSummaries);
  }
}

async function fetchPagedItems (instanceName, accessToken, timelineName) {
  const _timelineNextPageId = get(timelineNextPageId);
  console.log('saved timelineNextPageId', _timelineNextPageId)
  const { items, headers } = await getTimeline(instanceName, accessToken, timelineName, _timelineNextPageId, null, TIMELINE_BATCH_SIZE)
  const linkHeader = headers.get('Link')
  const parsedLinkHeader = li.parse(linkHeader)
  const nextUrl = parsedLinkHeader && parsedLinkHeader.next
  const nextId = nextUrl && (new URL(nextUrl)).searchParams.get('max_id')
  console.log('new timelineNextPageId', nextId)
  setForTimeline(rootTimelineNextPageId, instanceName, timelineName, nextId)
  await storeFreshTimelineItemsInDatabase(instanceName, timelineName, items)
  await addPagedTimelineItems(instanceName, timelineName, items)
}

async function fetchTimelineItems (instanceName, accessToken, timelineName, online) {
  mark('fetchTimelineItems')
  const _lastTimelineItemId = get(lastTimelineItemId);
  let items
  let stale = false
  if (!online) {
    items = await database.getTimeline(instanceName, timelineName, _lastTimelineItemId, TIMELINE_BATCH_SIZE)
    stale = true
  } else {
    try {
      console.log('fetchTimelineItemsFromNetwork')
      items = await fetchTimelineItemsFromNetwork(instanceName, accessToken, timelineName, _lastTimelineItemId)
      await storeFreshTimelineItemsInDatabase(instanceName, timelineName, items)
    } catch (e) {
      console.error(e)
      /* no await */ toast.say('intl.showingOfflineContent')
      items = await database.getTimeline(instanceName, timelineName, _lastTimelineItemId, TIMELINE_BATCH_SIZE)
      stale = true
    }
  }
  stop('fetchTimelineItems')
  return { items, stale }
}

async function addTimelineItems (instanceName, timelineName, items, stale) {
  console.log('addTimelineItems, length:', items.length)
  mark('addTimelineItemSummaries')
  const newSummaries = items.map(item => timelineItemToSummary(item, instanceName))
  await addTimelineItemSummaries(instanceName, timelineName, newSummaries, stale)
  stop('addTimelineItemSummaries')
}

export async function addTimelineItemSummaries (instanceName, timelineName, newSummaries, newStale) {
  const oldSummaries = getForTimeline(rootTimelineItemSummaries, instanceName, timelineName);
  const oldStale = getForTimeline(rootTimelineItemSummariesAreStale, instanceName, timelineName);

  const mergedSummaries = uniqBy(mergeArrays(oldSummaries || [], newSummaries, compareTimelineItemSummaries), byId)

  if (!isEqual(oldSummaries, mergedSummaries)) {
    setForTimeline(rootTimelineItemSummaries, instanceName, timelineName, mergedSummaries);
  }
  if (oldStale !== newStale) {
    setForTimeline(rootTimelineItemSummariesAreStale, instanceName, timelineName, newStale);
  }
}

async function fetchTimelineItemsAndPossiblyFallBack () {
  console.log('fetchTimelineItemsAndPossiblyFallBack')
  mark('fetchTimelineItemsAndPossiblyFallBack')

  const _currentTimeline = currentTimeline.get();
  const _currentInstance = currentInstance.get();
  const _accessToken = get(accessToken);
  const _online = online.get();

  if (_currentTimeline === 'favorites' || _currentTimeline === 'bookmarks') {
    // Always fetch favorites from the network, we currently don't have a good way of storing
    // these in IndexedDB because of "internal ID" system Mastodon uses to paginate these
    await fetchPagedItems(_currentInstance, _accessToken, _currentTimeline)
  } else {
    const { items, stale } = await fetchTimelineItems(_currentInstance, _accessToken, _currentTimeline, _online)
    await addTimelineItems(_currentInstance, _currentTimeline, items, stale)
  }
  stop('fetchTimelineItemsAndPossiblyFallBack')
}

export async function setupTimeline() {
  console.log('setupTimeline')
  mark('setupTimeline')
  // If we don't have any item summaries, or if the current item summaries are stale
  // (i.e. via offline mode), then we need to re-fetch
  // Also do this if it's a thread, because threads change pretty frequently and
  // we don't have a good way to update them.
  const _timelineItemSummaries = get(timelineItemSummaries);
  const _timelineItemSummariesAreStale = get(timelineItemSummariesAreStale);
  const _currentTimeline = currentTimeline.get();
  console.log({ _timelineItemSummaries, _timelineItemSummariesAreStale, _currentTimeline })
  if (!_timelineItemSummaries ||
      _timelineItemSummariesAreStale ||
      _currentTimeline.startsWith('status/')) {
    await fetchTimelineItemsAndPossiblyFallBack()
  }
  stop('setupTimeline')
}

export async function fetchMoreItemsAtBottomOfTimeline(instanceName, timelineName) {
  console.log('setting runningUpdate: true')
  setForTimeline(rootRunningUpdate, instanceName, timelineName, true);
  await fetchTimelineItemsAndPossiblyFallBack()
  console.log('setting runningUpdate: false')
  setForTimeline(rootRunningUpdate, instanceName, timelineName, false);
}

export async function showMoreItemsForTimeline(instanceName, timelineName) {
  mark('showMoreItemsForTimeline')
  let itemSummariesToAdd = getForTimeline(rootTimelineItemSummariesToAdd, instanceName, timelineName) || []
  itemSummariesToAdd = itemSummariesToAdd.sort(compareTimelineItemSummaries).reverse()
  addTimelineItemSummaries(instanceName, timelineName, itemSummariesToAdd, false)
  setForTimeline(rootTimelineItemSummariesToAdd, instanceName, timelineName, []);
  setForTimeline(rootShouldShowHeader, instanceName, timelineName, false);
  setForTimeline(rootShowHeader, instanceName, timelineName, false);
  stop('showMoreItemsForTimeline')
}

export function showMoreItemsForCurrentTimeline () {
  return showMoreItemsForTimeline(
    currentInstance.get(),
    currentTimeline.get()
  )
}

export async function showMoreItemsForThread (instanceName, timelineName) {
  mark('showMoreItemsForThread')
  const itemSummariesToAdd = getForTimeline(rootTimelineItemSummariesToAdd, instanceName, timelineName);
  const timelineItemSummaries = getForTimeline(rootTimelineItemSummaries, instanceName, timelineName);
  const timelineItemIds = new Set(timelineItemSummaries.map(_ => _.id))
  // TODO: update database and do the thread merge correctly
  for (const itemSummaryToAdd of itemSummariesToAdd) {
    if (!timelineItemIds.has(itemSummaryToAdd.id)) {
      timelineItemSummaries.push(itemSummaryToAdd)
    }
  }
  const statusId = timelineName.split('/').slice(-1)[0]
  const sortedTimelineItemSummaries = await sortItemSummariesForThread(timelineItemSummaries, statusId)
  setForTimeline(rootTimelineItemSummariesToAdd, instanceName, timelineName, []);
  setForTimeline(rootTimelineItemSummaries, instanceName, timelineName, sortedTimelineItemSummaries);
  stop('showMoreItemsForThread')
}
