import { derived } from 'svelte/store'
import { get } from '../_utils/lodash-lite'
import { currentPage } from './navigation'
import { currentInstance, disableNotificationBadge, subscriptionRequestCounts } from './local'
import { filteredTimelineNotificationItemSummaries } from './timelineFilter'

export const numberOfNotifications = derived(
  [filteredTimelineNotificationItemSummaries, disableNotificationBadge],
  ([$filteredTimelineNotificationItemSummaries, $disableNotificationBadge]) => {
    return !$disableNotificationBadge && $filteredTimelineNotificationItemSummaries
      ? $filteredTimelineNotificationItemSummaries.length
      : 0
  }
)

export const hasNotifications = derived(
  [numberOfNotifications, currentPage],
  ([$numberOfNotifications, $currentPage]) => {
    return $currentPage !== 'notifications' && !!$numberOfNotifications
  }
)

export const numberOfSubscriptionRequests = derived(
  [currentInstance, subscriptionRequestCounts],
  ([$currentInstance, $subscriptionRequestCounts]) => {
    return get($subscriptionRequestCounts, [$currentInstance], 0)
  }
)

export const hasSubscriptionRequests = derived(numberOfSubscriptionRequests, ($val) => !!$val)

export const badgeNumber = derived(
  [numberOfSubscriptionRequests, numberOfNotifications],
  ([$numberOfSubscriptionRequests, $numberOfNotifications]) => $numberOfSubscriptionRequests + $numberOfNotifications
)
