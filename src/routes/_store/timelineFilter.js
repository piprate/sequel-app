import {
  HOME_COMMENTS,
  NOTIFICATION_BUBBLE_MEMBERSHIP,
  NOTIFICATION_MENTIONS,
  NOTIFICATION_SUBSCRIBERS,
  NOTIFICATION_TMMS,
  NOTIFICATION_WORLD_MEMBERSHIP
} from '../_static/instanceSettings'
import {
  WORD_FILTER_CONTEXT_HOME,
  WORD_FILTER_CONTEXT_NOTIFICATIONS,
  WORD_FILTER_CONTEXT_PUBLIC,
  WORD_FILTER_CONTEXT_SPARK,
  WORD_FILTER_CONTEXT_THREAD
} from '../_static/wordFilters'
import { createFilterFunction } from '../_utils/createFilterFunction'
import { get } from '../_utils/lodash-lite'
import { derived } from 'svelte/store'
import { currentInstance, currentTimeline, instanceSettings } from './local'
import { rootTimelineItemSummariesToAdd, timelineItemSummaries, timelineItemSummariesToAdd } from './timeline'
import { currentSparkId } from './instance'

// NOT IN USE. It's been left as an example of a timeline filter
const timelineShowComments = deriveTimelineFilter({ home: HOME_COMMENTS })

const timelineNotificationTMMs = deriveNotificationFilter(NOTIFICATION_TMMS)
const timelineNotificationShowSubscribers = deriveNotificationFilter(NOTIFICATION_SUBSCRIBERS)
const timelineNotificationShowBubbleNotices = deriveNotificationFilter(NOTIFICATION_BUBBLE_MEMBERSHIP)
const timelineNotificationShowWorldNotices = deriveNotificationFilter(NOTIFICATION_WORLD_MEMBERSHIP)
const timelineNotificationShowMentions = deriveNotificationFilter(NOTIFICATION_MENTIONS)

// Compute just the boolean, e.g. 'showPolls', so that we can use that boolean as
// the input to the timelineFilterFunction computations. This should reduce the need to
// re-compute the timelineFilterFunction over and over.
function deriveTimelineFilter(timelinesToSettingsKeys) {
  return derived(
    [currentInstance, instanceSettings, currentTimeline],
    ([$currentInstance, $instanceSettings, $currentTimeline]) => {
      const settingsKey = timelinesToSettingsKeys[$currentTimeline]
      return settingsKey ? get($instanceSettings, [$currentInstance, settingsKey], true) : true
    }
  )
}

// Ditto for notifications, which we always have to keep track of due to the notification count.
function deriveNotificationFilter(key) {
  return derived([currentInstance, instanceSettings], ([$currentInstance, $instanceSettings]) => {
    return get($instanceSettings, [$currentInstance, key], true)
  })
}

export const timelineWordFilterContext = derived(currentTimeline, ($currentTimeline) => {
  if (!$currentTimeline) {
    return
  }
  if ($currentTimeline === 'home' || $currentTimeline.startsWith('list/')) {
    return WORD_FILTER_CONTEXT_HOME
  }
  if ($currentTimeline === 'notifications' || $currentTimeline.startsWith('notifications/')) {
    return WORD_FILTER_CONTEXT_NOTIFICATIONS
  }
  if ($currentTimeline.startsWith('tag/')) {
    return WORD_FILTER_CONTEXT_PUBLIC
  }
  if ($currentTimeline.startsWith('spark/')) {
    return WORD_FILTER_CONTEXT_SPARK
  }
  if ($currentTimeline.startsWith('post/')) {
    return WORD_FILTER_CONTEXT_THREAD
  }
  // return undefined otherwise
})

// This one is based on whatever the current timeline is
export const timelineFilterFunction = derived(
  [
    timelineNotificationTMMs,
    timelineNotificationShowSubscribers,
    timelineNotificationShowBubbleNotices,
    timelineNotificationShowWorldNotices,
    timelineNotificationShowMentions,
    timelineWordFilterContext
  ],
  ([$showTMMs, $showSubscribers, $showBubbleNotices, $showWorldNotices, $showMentions, $wordFilterContext]) =>
    createFilterFunction(
      $showTMMs,
      $showSubscribers,
      $showBubbleNotices,
      $showWorldNotices,
      $showMentions,
      $wordFilterContext
    )
)

// The reason there is a completely separate flow just for notifications is that we need to
// know which notifications are filtered at all times so that the little number badge is correct.
export const timelineNotificationFilterFunction = derived(
  [
    timelineNotificationTMMs,
    timelineNotificationShowSubscribers,
    timelineNotificationShowBubbleNotices,
    timelineNotificationShowWorldNotices,
    timelineNotificationShowMentions
  ],
  ([$showTMMs, $showSubscribers, $showBubbleNotices, $showWorldNotices, $showMentions]) =>
    createFilterFunction(
      $showTMMs,
      $showSubscribers,
      $showBubbleNotices,
      $showWorldNotices,
      $showMentions,
      WORD_FILTER_CONTEXT_NOTIFICATIONS
    )
)

export const filteredTimelineItemSummaries = derived(
  [timelineItemSummaries, timelineFilterFunction],
  ([$timelineItemSummaries, $timelineFilterFunction]) => {
    return $timelineItemSummaries && $timelineItemSummaries.filter($timelineFilterFunction)
  }
)

export const filteredTimelineItemSummariesToAdd = derived(
  [timelineItemSummariesToAdd, timelineFilterFunction],
  ([$timelineItemSummariesToAdd, $timelineFilterFunction]) => {
    return $timelineItemSummariesToAdd && $timelineItemSummariesToAdd.filter($timelineFilterFunction)
  }
)

export const timelineNotificationItemSummaries = derived(
  [rootTimelineItemSummariesToAdd, currentInstance, currentSparkId],
  ([$root, $currentInstance, $currentSparkId]) => get($root, [$currentInstance, $currentSparkId, 'notifications'])
)

export const filteredTimelineNotificationItemSummaries = derived(
  [timelineNotificationItemSummaries, timelineNotificationFilterFunction],
  ([$timelineNotificationItemSummaries, $timelineNotificationFilterFunction]) =>
    $timelineNotificationItemSummaries && $timelineNotificationItemSummaries.filter($timelineNotificationFilterFunction)
)
