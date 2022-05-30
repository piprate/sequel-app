import { accessToken, currentSparkId } from '../_store/instance'
import {
  getForTimeline,
  lastTimelineItemId,
  rootRunningUpdate,
  rootShouldShowHeader,
  rootShowHeader,
  rootTimelineItemSummaries,
  rootTimelineItemSummariesAreStale,
  rootTimelineItemSummariesToAdd,
  rootTimelineNextPageId,
  setForTimeline,
  timelineItemSummaries,
  timelineItemSummariesAreStale,
  timelineNextPageId
} from '../_store/timeline'
import { currentInstance, currentTimeline, online } from '../_store/local'
import { getTimeline } from '../_api/timelines'
import { toast } from '../_components/toast/toast'
import { mark, stop } from '../_utils/marks'
import { concat, mergeArrays } from '../_utils/arrays'
import { compareTimelineItemSummaries } from '../_utils/timelineIdSorting'
import isEqual from 'lodash-es/isEqual'
import { database } from '../_database/database'
import { getPost, getPostContext } from '../_api/posts'
import { emit } from '../_utils/eventBus'
import { TIMELINE_BATCH_SIZE } from '../_static/timelines'
import { timelineItemToSummary } from '../_utils/timelineItemToSummary'
import uniqBy from 'lodash-es/uniqBy'
import { addPostsOrNotifications } from './addPostOrNotification'
import { scheduleIdleTask } from '../_utils/scheduleIdleTask'
import { sortItemSummariesForThread } from '../_utils/sortItemSummariesForThread'
import li from 'li'
import { get } from 'svelte/store'
import { wrap } from '../_utils/mapper'

const byId = _ => _.id

async function storeFreshTimelineItemsInDatabase (instanceName, timelineName, items, asSpark) {
  await database.insertTimelineItems(instanceName, timelineName, items, asSpark)
  if (timelineName.startsWith('post/')) {
    // For post threads, we want to be sure to update the favorite/reblog counts even if
    // this is a stale "view" of the post. See 119-post-counts-update.js for
    // an example of why we need this.
    items.forEach(item => {
      emit('postUpdated', item)
    })
  }
}

async function updatePost (instanceName, accessToken, postId, asSpark) {
  const post = await getPost(instanceName, accessToken, postId, asSpark)
  await database.insertPost(instanceName, post, asSpark)
  emit('postUpdated', post)
  return post
}

async function updatePostAndThread (instanceName, accessToken, timelineName, postId, asSpark) {
  const [post, context] = await Promise.all([
    updatePost(instanceName, accessToken, postId, asSpark),
    getPostContext(instanceName, accessToken, postId)
  ])
  await database.insertTimelineItems(
    instanceName,
    timelineName,
    concat(context.ancestors, post, context.descendants),
    asSpark
  )
  addPostsOrNotifications(instanceName, timelineName, concat(context.ancestors, context.descendants), asSpark)
}

async function fetchFreshThreadFromNetwork (instanceName, accessToken, postId, asSpark) {
  const [post, context] = await Promise.all([
    getPost(instanceName, accessToken, postId, asSpark),
    getPostContext(instanceName, accessToken, postId)
  ])
  return concat(context.ancestors, post, context.descendants)
}

async function fetchThreadFromNetwork (instanceName, accessToken, timelineName, asSpark) {
  const postId = timelineName.split('/').slice(-1)[0]

  // For threads, we do several optimizations to make it a bit faster to load.
  // The vast majority of posts have no replies and aren't in reply to anything,
  // so we want that to be as fast as possible.
  const post = await database.getPost(instanceName, postId, asSpark)
  if (!post) {
    // If for whatever reason the post is not cached, fetch everything from the network
    // and wait for the result. This happens in very unlikely cases (e.g. loading /posts/<id>
    // where <id> is not cached locally) but is worth covering.
    return fetchFreshThreadFromNetwork(instanceName, accessToken, postId, asSpark)
  }

  if (!post.inReplyTo) {
    // post is not a reply to another post (fast path)
    // Update the post and thread asynchronously, but return just the post for now
    // Any replies to the post will load asynchronously
    /* no await */
    updatePostAndThread(instanceName, accessToken, timelineName, postId, asSpark)
    return [post]
  }
  // post is a reply to some other post, meaning we don't want some
  // jerky behavior where it suddenly scrolls into place. Update the post asynchronously
  // but grab the thread now
  scheduleIdleTask(() => updatePost(instanceName, accessToken, postId, asSpark))
  const context = await getPostContext(instanceName, accessToken, postId)
  return concat(context.ancestors, post, context.descendants)
}

async function fetchTimelineItemsFromNetwork (instanceName, accessToken, asSpark, timelineName, lastTimelineItemId) {
  if (timelineName.startsWith('post/')) { // special case - this is a list of descendents and ancestors
    return fetchThreadFromNetwork(instanceName, accessToken, timelineName, asSpark)
  } else { // normal timeline
    const { items } = await getTimeline(instanceName, accessToken, asSpark, timelineName, lastTimelineItemId, null, TIMELINE_BATCH_SIZE)
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
    setForTimeline(rootTimelineItemSummaries, instanceName, timelineName, mergedSummaries)
  }
}

async function fetchPagedItems (instanceName, accessToken, asSpark, timelineName) {
  const _timelineNextPageId = get(timelineNextPageId)
  console.log('saved timelineNextPageId', _timelineNextPageId)
  const {
    items,
    headers
  } = await getTimeline(instanceName, accessToken, asSpark, timelineName, _timelineNextPageId, null, TIMELINE_BATCH_SIZE)
  const linkHeader = headers.get('Link')
  const parsedLinkHeader = li.parse(linkHeader)
  // FIXME
  const nextUrl = parsedLinkHeader && parsedLinkHeader.next
  const nextId = nextUrl && (new URL(nextUrl)).searchParams.get('max_id')
  console.log('new timelineNextPageId', nextId)
  setForTimeline(rootTimelineNextPageId, instanceName, timelineName, nextId, asSpark)
  await storeFreshTimelineItemsInDatabase(instanceName, timelineName, items, asSpark)
  await addPagedTimelineItems(instanceName, timelineName, items)
}

async function fetchTimelineItems (instanceName, accessToken, asSpark, timelineName, online) {
  mark('fetchTimelineItems')
  const _lastTimelineItemId = get(lastTimelineItemId)
  let items
  let stale = false
  if (!online) {
    items = await database.getTimeline(instanceName, timelineName, _lastTimelineItemId, TIMELINE_BATCH_SIZE, asSpark)
    stale = true
  } else {
    try {
      console.log('fetchTimelineItemsFromNetwork')
      items = await fetchTimelineItemsFromNetwork(instanceName, accessToken, asSpark, timelineName, _lastTimelineItemId)
      await storeFreshTimelineItemsInDatabase(instanceName, timelineName, items, asSpark)
    } catch (e) {
      console.error(e)
      if (e.knownError) {
        /* no await */
        toast.say(e.message)
      } else {
        /* no await */
        toast.say('intl.requestFailed')
      }
      items = await database.getTimeline(instanceName, timelineName, _lastTimelineItemId, TIMELINE_BATCH_SIZE, asSpark)
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
  const oldSummaries = getForTimeline(rootTimelineItemSummaries, instanceName, timelineName)
  const oldStale = getForTimeline(rootTimelineItemSummariesAreStale, instanceName, timelineName)

  const mergedSummaries = uniqBy(mergeArrays(oldSummaries || [], newSummaries, compareTimelineItemSummaries), byId)

  if (!isEqual(oldSummaries, mergedSummaries)) {
    setForTimeline(rootTimelineItemSummaries, instanceName, timelineName, mergedSummaries)
  }
  if (oldStale !== newStale) {
    setForTimeline(rootTimelineItemSummariesAreStale, instanceName, timelineName, newStale)
  }
}

async function fetchTimelineItemsAndPossiblyFallBack () {
  console.log('fetchTimelineItemsAndPossiblyFallBack')
  mark('fetchTimelineItemsAndPossiblyFallBack')

  const _currentTimeline = currentTimeline.get()
  const _currentInstance = currentInstance.get()
  const _accessToken = get(accessToken)
  const _currentSparkId = get(currentSparkId)
  const _online = online.get()

  if (_currentTimeline === 'favorites' || _currentTimeline === 'bookmarks') {
    // Always fetch favorites from the network, we currently don't have a good way of storing
    // these in IndexedDB because of "internal ID" system Mastodon uses to paginate these
    await fetchPagedItems(_currentInstance, _accessToken, _currentSparkId, _currentTimeline)
  } else {
    const {
      items,
      stale
    } = await fetchTimelineItems(_currentInstance, _accessToken, get(currentSparkId), _currentTimeline, _online)
    await addTimelineItems(_currentInstance, _currentTimeline, items, stale)
  }
  stop('fetchTimelineItemsAndPossiblyFallBack')
}

export async function setupTimeline () {
  console.log('setupTimeline')
  mark('setupTimeline')
  // If we don't have any item summaries, or if the current item summaries are stale
  // (i.e. via offline mode), then we need to re-fetch
  // Also do this if it's a thread, because threads change pretty frequently and
  // we don't have a good way to update them.
  const _timelineItemSummaries = get(timelineItemSummaries)
  const _timelineItemSummariesAreStale = get(timelineItemSummariesAreStale)
  const _currentTimeline = currentTimeline.get()
  console.log({ _timelineItemSummaries, _timelineItemSummariesAreStale, _currentTimeline })
  if (!_timelineItemSummaries ||
    _timelineItemSummariesAreStale ||
    _currentTimeline.startsWith('post/')) {
    await fetchTimelineItemsAndPossiblyFallBack()
  }
  stop('setupTimeline')
}

export async function fetchMoreItemsAtBottomOfTimeline (instanceName, timelineName) {
  console.log('setting runningUpdate: true')
  setForTimeline(rootRunningUpdate, instanceName, timelineName, true)
  await fetchTimelineItemsAndPossiblyFallBack()
  console.log('setting runningUpdate: false')
  setForTimeline(rootRunningUpdate, instanceName, timelineName, false)
}

export async function showMoreItemsForTimeline (instanceName, timelineName) {
  mark('showMoreItemsForTimeline')
  let itemSummariesToAdd = getForTimeline(rootTimelineItemSummariesToAdd, instanceName, timelineName) || []
  itemSummariesToAdd = itemSummariesToAdd.sort(compareTimelineItemSummaries).reverse()
  addTimelineItemSummaries(instanceName, timelineName, itemSummariesToAdd, false)
  setForTimeline(rootTimelineItemSummariesToAdd, instanceName, timelineName, [])
  setForTimeline(rootShouldShowHeader, instanceName, timelineName, false)
  setForTimeline(rootShowHeader, instanceName, timelineName, false)
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
  const itemSummariesToAdd = getForTimeline(rootTimelineItemSummariesToAdd, instanceName, timelineName) || []
  const timelineItemSummaries = getForTimeline(rootTimelineItemSummaries, instanceName, timelineName) || []
  const timelineItemIds = new Set(timelineItemSummaries.map(_ => _.id))
  // TODO: update database and do the thread merge correctly
  for (const itemSummaryToAdd of itemSummariesToAdd) {
    if (!timelineItemIds.has(itemSummaryToAdd.id)) {
      timelineItemSummaries.push(itemSummaryToAdd)
    }
  }
  const postId = wrap(timelineName.split('/').slice(-1)[0])
  const sortedTimelineItemSummaries = await sortItemSummariesForThread(timelineItemSummaries, postId)
  setForTimeline(rootTimelineItemSummariesToAdd, instanceName, timelineName, [])
  setForTimeline(rootTimelineItemSummaries, instanceName, timelineName, sortedTimelineItemSummaries)
  stop('showMoreItemsForThread')
}
