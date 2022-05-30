import {
  HOME_REBLOGS,
  HOME_REPLIES,
  NOTIFICATION_FAVORITES,
  NOTIFICATION_FOLLOWS, NOTIFICATION_MENTIONS, NOTIFICATION_POLLS,
  NOTIFICATION_REBLOGS
} from '../_static/instanceSettings'
import {
  WORD_FILTER_CONTEXT_ACCOUNT,
  WORD_FILTER_CONTEXT_HOME,
  WORD_FILTER_CONTEXT_NOTIFICATIONS,
  WORD_FILTER_CONTEXT_PUBLIC, WORD_FILTER_CONTEXT_THREAD
} from '../_static/wordFilters'
import { createFilterFunction } from '../_utils/createFilterFunction'
import { get } from '../_utils/lodash-lite'
import { derived } from "svelte/store";
import { currentInstance, instanceSettings, currentTimeline } from "./local";
import { rootTimelineItemSummariesToAdd, timelineItemSummaries, timelineItemSummariesToAdd } from './timeline';

export const timelineShowReblogs = deriveTimelineFilter({ home: HOME_REBLOGS, notifications: NOTIFICATION_REBLOGS });
export const timelineShowReplies = deriveTimelineFilter({ home: HOME_REPLIES });
export const timelineShowFollows = deriveTimelineFilter({ notifications: NOTIFICATION_FOLLOWS });
export const timelineShowFavs = deriveTimelineFilter({ notifications: NOTIFICATION_FAVORITES });
export const timelineShowMentions = deriveTimelineFilter({ notifications: NOTIFICATION_MENTIONS });
export const timelineShowPolls = deriveTimelineFilter({ notifications: NOTIFICATION_POLLS });

export const timelineNotificationShowReblogs = deriveNotificationFilter(NOTIFICATION_REBLOGS);
export const timelineNotificationShowFollows = deriveNotificationFilter(NOTIFICATION_FOLLOWS);
export const timelineNotificationShowFavs = deriveNotificationFilter(NOTIFICATION_FAVORITES);
export const timelineNotificationShowMentions = deriveNotificationFilter(NOTIFICATION_MENTIONS);
export const timelineNotificationShowPolls = deriveNotificationFilter(NOTIFICATION_POLLS);

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
  );
}

// Ditto for notifications, which we always have to keep track of due to the notification count.
function deriveNotificationFilter(key) {
  return derived(
    [currentInstance, instanceSettings],
    ([$currentInstance, $instanceSettings]) => {
      return get($instanceSettings, [$currentInstance, key], true)
    }
  );
}

export const timelineWordFilterContext = derived(
  currentTimeline,
  $currentTimeline => {
    if (!$currentTimeline) {
      return
    }
    if ($currentTimeline === 'home' || $currentTimeline.startsWith('list/')) {
      return WORD_FILTER_CONTEXT_HOME
    }
    if ($currentTimeline === 'notifications' || $currentTimeline.startsWith('notifications/')) {
      return WORD_FILTER_CONTEXT_NOTIFICATIONS
    }
    if ($currentTimeline === 'federated' || $currentTimeline === 'local' || $currentTimeline.startsWith('tag/')) {
      return WORD_FILTER_CONTEXT_PUBLIC
    }
    if ($currentTimeline.startsWith('account/')) {
      return WORD_FILTER_CONTEXT_ACCOUNT
    }
    if ($currentTimeline.startsWith('status/')) {
      return WORD_FILTER_CONTEXT_THREAD
    }
    // return undefined otherwise
  }
);

// This one is based on whatever the current timeline is
export const timelineFilterFunction = derived(
  [ timelineShowReblogs, timelineShowReplies, timelineShowFollows,
    timelineShowFavs, timelineShowMentions, timelineShowPolls,
    timelineWordFilterContext],
  ([$showReblogs, $showReplies, $showFollows, $showFavs, $showMentions, $showPolls, $wordFilterContext]) => (
    createFilterFunction($showReblogs, $showReplies, $showFollows, $showFavs, $showMentions, $showPolls, $wordFilterContext)
  )
);

// The reason there is a completely separate flow just for notifications is that we need to
// know which notifications are filtered at all times so that the little number badge is correct.
export const timelineNotificationFilterFunction = derived(
  [ timelineNotificationShowReblogs, timelineNotificationShowFollows,
    timelineNotificationShowFavs, timelineNotificationShowMentions,
    timelineNotificationShowPolls],
  ([$showReblogs, $showFollows, $showFavs, $showMentions, $showPolls]) => (
    createFilterFunction($showReblogs, true, $showFollows, $showFavs, $showMentions, $showPolls, WORD_FILTER_CONTEXT_NOTIFICATIONS)
  )
);

export const filteredTimelineItemSummaries = derived(
  [ timelineItemSummaries, timelineFilterFunction ],
  ([$timelineItemSummaries, $timelineFilterFunction]) => {
    return $timelineItemSummaries && $timelineItemSummaries.filter($timelineFilterFunction)
  }
);

export const filteredTimelineItemSummariesToAdd = derived(
  [ timelineItemSummariesToAdd, timelineFilterFunction ],
  ([$timelineItemSummariesToAdd, $timelineFilterFunction]) => {
    return $timelineItemSummariesToAdd && $timelineItemSummariesToAdd.filter($timelineFilterFunction)
  }
);

export const timelineNotificationItemSummaries = derived(
  [ rootTimelineItemSummariesToAdd, currentInstance],
  ([$root, $currentInstance]) => (
    get($root, [$currentInstance, 'notifications'])
  )
);

export const filteredTimelineNotificationItemSummaries = derived(
  [ timelineNotificationItemSummaries, timelineNotificationFilterFunction ],
  ([$timelineNotificationItemSummaries, $timelineNotificationFilterFunction]) => (
    $timelineNotificationItemSummaries && $timelineNotificationItemSummaries.filter($timelineNotificationFilterFunction)
  )
);
