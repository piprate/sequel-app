import { derived } from "svelte/store";
import { get } from '../_utils/lodash-lite'
import { currentPage } from "./navigation";
import {currentInstance, disableNotificationBadge, followRequestCounts} from "./local";
import {filteredTimelineNotificationItemSummaries} from "./timelineFilter";

export const numberOfNotifications = derived(
    [filteredTimelineNotificationItemSummaries, disableNotificationBadge],
    ([$filteredTimelineNotificationItemSummaries, $disableNotificationBadge]) => {
        return (!$disableNotificationBadge && $filteredTimelineNotificationItemSummaries)
            ? $filteredTimelineNotificationItemSummaries.length
            : 0
    }
);

export const hasNotifications = derived(
    [numberOfNotifications, currentPage],
    ([$numberOfNotifications, $currentPage]) => {
        return $currentPage !== 'notifications' && !!$numberOfNotifications
    }
);

export const numberOfFollowRequests = derived(
    [currentInstance, followRequestCounts],
    ([$currentInstance, $followRequestCounts]) => {
        return get($followRequestCounts, [$currentInstance], 0)
    }
);

export const hasFollowRequests = derived(numberOfFollowRequests, $val => !!$val);

export const badgeNumber = derived(
  [numberOfFollowRequests, numberOfNotifications],
  ([$numberOfFollowRequests, $numberOfNotifications]) => ($numberOfFollowRequests + $numberOfNotifications)
);