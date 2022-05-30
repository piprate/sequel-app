import { get, pickBy } from '../_utils/lodash-lite'
import { getFirstIdFromItemSummaries, getLastIdFromItemSummaries } from '../_utils/getIdFromItemSummaries'
import { derived, get as svelteGet } from 'svelte/store'
import { currentInstance, currentTimeline } from './local'
import { transientStore } from './base'
import { currentSparkId } from './instance'

export const rootTimelineItemSummaries = transientStore({})
export const rootTimelineItemSummariesToAdd = transientStore({})
export const rootRunningUpdate = transientStore({})
export const rootLastFocusedElementId = transientStore({})
export const rootIgnoreBlurEvents = transientStore({})
export const rootShowHeader = transientStore({})
export const rootShouldShowHeader = transientStore({})
export const rootTimelineItemSummariesAreStale = transientStore({})
export const rootTimelineNextPageId = transientStore({})
export const rootFreshUpdates = transientStore({})

export const timelineItemSummaries =
  deriveForCurrentTimeline(rootTimelineItemSummaries, null)
export const timelineItemSummariesToAdd =
  deriveForCurrentTimeline(rootTimelineItemSummariesToAdd, null)
export const runningUpdate =
  deriveForCurrentTimeline(rootRunningUpdate, false)
export const lastFocusedElementId =
  deriveForCurrentTimeline(rootLastFocusedElementId, null)
export const ignoreBlurEvents =
  deriveForCurrentTimeline(rootIgnoreBlurEvents, false)
export const showHeader =
  deriveForCurrentTimeline(rootShowHeader, false)
export const shouldShowHeader =
  deriveForCurrentTimeline(rootShouldShowHeader, false)
export const timelineItemSummariesAreStale =
  deriveForCurrentTimeline(rootTimelineItemSummariesAreStale, false)
export const timelineNextPageId =
  deriveForCurrentTimeline(rootTimelineNextPageId, null)
export const freshUpdates =
  deriveForCurrentTimeline(rootFreshUpdates, null)

function deriveForCurrentTimeline (timelineStore, defaultValue) {
  return derived(
    [currentInstance, currentSparkId, currentTimeline, timelineStore],
    ([$currentInstance, $currentSparkId, $currentTimeline, $timelineStore]) => (
      get($timelineStore, [$currentInstance, $currentSparkId, $currentTimeline], defaultValue)
    )
  )
}

export const currentTimelineType = derived(
  currentTimeline,
  $currentTimeline => (
    $currentTimeline && $currentTimeline.split('/')[0]
  )
)

export const currentTimelineValue = derived(
  currentTimeline,
  $currentTimeline => {
    if (!$currentTimeline) {
      return undefined
    }
    const split = $currentTimeline.split('/')
    const len = split.length
    if (split[len - 1] === 'with_comments' || split[len - 1] === 'media') {
      return split[len - 2]
    }
    return split[len - 1]
  }
)

export const firstTimelineItemId = derived(
  timelineItemSummaries,
  $timelineItemSummaries => (
    getFirstIdFromItemSummaries($timelineItemSummaries)
  )
)

export const lastTimelineItemId = derived(
  timelineItemSummaries,
  $timelineItemSummaries => (
    getLastIdFromItemSummaries($timelineItemSummaries)
  )
)

export function getForTimeline (timelineStore, instanceName, timelineName, asSpark) {
  if (!asSpark) {
    asSpark = svelteGet(currentSparkId)
  }
  return get(svelteGet(timelineStore), [instanceName, asSpark, timelineName])
}

export function setForTimeline (timelineStore, instanceName, timelineName, val, asSpark) {
  if (!asSpark) {
    asSpark = svelteGet(currentSparkId)
  }
  const root = svelteGet(timelineStore)
  const instanceData = root[instanceName] = root[instanceName] || {}
  const sparkData = instanceData[asSpark] = instanceData[asSpark] || {}
  sparkData[timelineName] = val
  timelineStore.set(root)
}

export function getFirstTimelineItemId (instanceName, timelineName, asSpark) {
  const summaries = getForTimeline(rootTimelineItemSummaries, instanceName, timelineName, asSpark)
  return getFirstIdFromItemSummaries(summaries)
}

export function clearTimelineDataForInstance (instanceName) {
  [
    rootTimelineItemSummaries,
    rootTimelineItemSummariesToAdd,
    rootRunningUpdate,
    rootLastFocusedElementId,
    rootIgnoreBlurEvents,
    rootShowHeader,
    rootShouldShowHeader,
    rootTimelineItemSummariesAreStale,
    rootTimelineNextPageId,
    rootFreshUpdates
  ].forEach(store => {
    store.delKey(instanceName)
  })
}

export function getThreads (instanceName, asSpark) {
  if (!asSpark) {
    asSpark = svelteGet(currentSparkId)
  }
  const instanceData = get(rootTimelineItemSummaries.get(), [instanceName, asSpark])

  return pickBy(instanceData, (value, key) => {
    return key.startsWith('post/')
  })
}
