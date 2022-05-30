import { pickBy, get } from '../_utils/lodash-lite'
import { getFirstIdFromItemSummaries, getLastIdFromItemSummaries } from '../_utils/getIdFromItemSummaries'
import { derived } from "svelte/store";
import { currentInstance, currentTimeline } from "./local";
import { transientStore } from "./base";

export const rootTimelineItemSummaries = transientStore({});
export const rootTimelineItemSummariesToAdd = transientStore({});
export const rootRunningUpdate = transientStore({});
export const rootLastFocusedElementId = transientStore({});
export const rootIgnoreBlurEvents = transientStore({});
export const rootShowHeader = transientStore({});
export const rootShouldShowHeader = transientStore({});
export const rootTimelineItemSummariesAreStale = transientStore({});
export const rootTimelineNextPageId = transientStore({});
export const rootFreshUpdates = transientStore({});

export const timelineItemSummaries =
  deriveForCurrentTimeline(rootTimelineItemSummaries, null);
export const timelineItemSummariesToAdd =
  deriveForCurrentTimeline(rootTimelineItemSummariesToAdd, null);
export const runningUpdate =
  deriveForCurrentTimeline(rootRunningUpdate, false);
export const lastFocusedElementId =
  deriveForCurrentTimeline(rootLastFocusedElementId, null);
export const ignoreBlurEvents =
  deriveForCurrentTimeline(rootIgnoreBlurEvents, false);
export const showHeader =
  deriveForCurrentTimeline(rootShowHeader, false);
export const shouldShowHeader =
  deriveForCurrentTimeline(rootShouldShowHeader, false);
export const timelineItemSummariesAreStale =
  deriveForCurrentTimeline(rootTimelineItemSummariesAreStale, false);
export const timelineNextPageId =
  deriveForCurrentTimeline(rootTimelineNextPageId, null);
export const freshUpdates =
  deriveForCurrentTimeline(rootFreshUpdates, null);

function deriveForCurrentTimeline(timelineStore, defaultValue) {
  return derived(
    [currentInstance, currentTimeline, timelineStore],
    ([$currentInstance, $currentTimeline, $timelineStore]) => (
      get($timelineStore, [$currentInstance, $currentTimeline], defaultValue)
    )
  );
}

export const currentTimelineType = derived(
  currentTimeline,
  $currentTimeline => (
    $currentTimeline && $currentTimeline.split('/')[0]
  )
);

export const currentTimelineValue = derived(
  currentTimeline,
  $currentTimeline => {
    if (!$currentTimeline) {
      return undefined
    }
    const split = $currentTimeline.split('/')
    const len = split.length
    if (split[len - 1] === 'with_replies' || split[len - 1] === 'media') {
      return split[len - 2]
    }
    return split[len - 1]
  }
);

export const firstTimelineItemId = derived(
  timelineItemSummaries,
  $timelineItemSummaries => (
    getFirstIdFromItemSummaries($timelineItemSummaries)
  )
);

export const lastTimelineItemId = derived(
  timelineItemSummaries,
  $timelineItemSummaries => (
    getLastIdFromItemSummaries($timelineItemSummaries)
  )
);

export function getForTimeline(timelineStore, instanceName, timelineName) {
  return get(timelineStore.get(), [instanceName, timelineName])
}

export function setForTimeline(timelineStore, instanceName, timelineName, val) {
  const root = timelineStore.get();
  const instanceData = root[instanceName] = root[instanceName] || {};
  instanceData[timelineName] = val;
  timelineStore.set(root);
}

export function getFirstTimelineItemId(instanceName, timelineName) {
  const summaries = getForTimeline(rootTimelineItemSummaries, instanceName, timelineName);
  return getFirstIdFromItemSummaries(summaries);
}

export function clearTimelineDataForInstance(instanceName) {
  [
    rootTimelineItemSummaries,
    rootTimelineItemSummariesToAdd,
    rootRunningUpdate,
    rootLastFocusedElementId,
    rootIgnoreBlurEvents,
    rootShowHeader,
    rootShouldShowHeader,
    rootTimelineItemSummariesAreStale,
    rootTimelineNextPageId
  ].forEach(store => {
    store.delKey(instanceName);
  })
}

export function getThreads(instanceName) {
  const instanceData = rootTimelineItemSummaries.get()[instanceName]

  return pickBy(instanceData, (value, key) => {
    return key.startsWith('status/')
  })
}