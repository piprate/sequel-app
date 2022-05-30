import { derived, writable } from 'svelte/store'
import { isKaiOS } from '../_utils/userAgent/isKaiOS'
import { persistentStore, transientStore } from './base'
import { get } from "../_utils/lodash-lite";
import { setupObservers } from "./observers/observers";

// persisted state

export const alwaysShowFocusRing = persistentStore('alwaysShowFocusRing', false);
export const autoplayGifs = persistentStore('autoplayGifs', false);
export const composeData = persistentStore('composeData', {});
export const currentInstance = persistentStore('currentInstance', null);
export const currentRegisteredInstance = persistentStore('currentRegisteredInstance', undefined);
export const currentRegisteredInstanceName = persistentStore('currentRegisteredInstanceName', undefined);
// we disable scrollbars by default on iOS
export const disableCustomScrollbars = persistentStore('disableCustomScrollbars',
    process.browser && /iP(?:hone|ad|od)/.test(navigator.userAgent));
export const disableFavCounts = persistentStore('disableFavCounts', false);
export const disableFollowerCounts = persistentStore('disableFollowerCounts', false);
export const disableHotkeys = persistentStore('disableHotkeys', false);
export const disableInfiniteScroll = persistentStore('disableInfiniteScroll', false);
export const disableLongAriaLabels = persistentStore('disableLongAriaLabels', false);
export const disableNotificationBadge = persistentStore('disableNotificationBadge', false);
export const disableReblogCounts = persistentStore('disableReblogCounts', false);
export const disableRelativeTimestamps = persistentStore('disableRelativeTimestamps', false);
export const disableTapOnStatus = persistentStore('disableTapOnStatus', false);
export const enableGrayscale = persistentStore('enableGrayscale', false);
export const hideCards = persistentStore('hideCards', false);
export const ignoreBlurhash = persistentStore('ignoreBlurhash', false);
export const instanceNameInSearch = persistentStore('instanceNameInSearch', '');
export const instanceSettings = persistentStore('instanceSettings', {});
export const instanceThemes = persistentStore('instanceThemes', {});
export const markMediaAsSensitive = persistentStore('markMediaAsSensitive', false);
export const largeInlineMedia = persistentStore('largeInlineMedia', false);
export const leftRightChangesFocus = persistentStore('leftRightChangesFocus', isKaiOS());
export const loggedInInstances = persistentStore('loggedInInstances', {});
export const loggedInInstancesInOrder = persistentStore('loggedInInstancesInOrder', []);
export const neverMarkMediaAsSensitive = persistentStore('neverMarkMediaAsSensitive', false);
export const omitEmojiInDisplayNames = persistentStore('omitEmojiInDisplayNames', undefined);
export const pinnedPages = persistentStore('pinnedPages', {});
export const pushSubscriptions = persistentStore('pushSubscriptions', {});
export const reduceMotion = persistentStore('reduceMotion', !process.browser ||
    matchMedia('(prefers-reduced-motion: reduce)').matches);
export const underlineLinks = persistentStore('underlineLinks', false);

export const isUserLoggedIn = derived(
    [currentInstance, loggedInInstances],
    ([$currentInstance, $loggedInInstances]) => {
        return !!($currentInstance && Object.keys($loggedInInstances).includes($currentInstance))
    }
);

export const loggedInInstancesAsList = derived(
  [currentInstance, loggedInInstances, loggedInInstancesInOrder],
  ([$currentInstance, $loggedInInstances, $loggedInInstancesInOrder]) => {
      return $loggedInInstancesInOrder.map(instanceName => {
          return Object.assign({
              current: $currentInstance === instanceName,
              name: instanceName
          }, $loggedInInstances[instanceName])
      })
  }
);

export function getInstanceSetting(instanceName, settingName, defaultValue) {
    return get(instanceSettings.get(), [instanceName, settingName], defaultValue)
}

export function setInstanceSetting(instanceName, settingName, value) {
    const settings = instanceSettings.get();
    if (!settings[instanceName]) {
        settings[instanceName] = {};
    }
    settings[instanceName][settingName] = value;
    instanceSettings.set(settings);
}

export function setComposeData(realm, obj) {
    const currentInstanceVal = currentInstance.get();
    const composeDataVal = composeData.get();
    const instanceNameData = composeDataVal[currentInstanceVal] = composeDataVal[currentInstanceVal] || {}
    instanceNameData[realm] = Object.assign(
      instanceNameData[realm] || {},
      { ts: Date.now() },
      obj
    );
    composeData.set(composeDataVal);
}

export function getComposeData(realm, key) {
    return get(composeData.get(), [currentInstance.get(), realm, key])
}

export function clearComposeData(realm) {
    const currentInstanceVal = currentInstance.get();
    const composeDataVal = composeData.get();
    if (composeDataVal && composeDataVal[currentInstanceVal]) {
        delete composeDataVal[currentInstanceVal][realm];
    }
    composeData.set(composeDataVal);
}

// non-persisted state

export const currentTimeline = transientStore('');
export const customEmoji = transientStore({});
export const followRequestCounts = transientStore({});
export const instanceInfos = transientStore({});
export const instanceFilters = transientStore({});
export const instanceLists = transientStore({});
export const logInToInstanceError = transientStore(null);
export const logInToInstanceErrorForText = transientStore('');
export const logInToInstanceLoading = transientStore(false);
export const online = transientStore(!process.browser || navigator.onLine);
export const pinnedStatuses = transientStore({});
export const polls = transientStore({});
export const pushNotificationsSupport = transientStore(process.browser &&
    ('serviceWorker' in navigator &&
      'PushManager' in window &&
      'getKey' in window.PushSubscription.prototype));
export const queryInSearch = transientStore('');
export const repliesShown = transientStore({});
export const sensitivesShown = transientStore({});
export const spoilersShown = transientStore({});
export const statusModifications = transientStore({});
export const unexpiredInstanceFilters = transientStore({});
export const verifyCredentials = transientStore({});

export const focusSearchInput = transientStore(false);
export const searchLoading = transientStore(false);
export const searchResultsForQuery = transientStore('');
export const searchResults = transientStore(null);
export const timelineInitialized = transientStore(false);
export const timelinePreinitialized = transientStore(false);
export const currentAccountProfile = transientStore(false);
export const currentAccountRelationship = transientStore(false);
export const pageVisibilityHidden = transientStore(false);

// observers

setupObservers(alwaysShowFocusRing, isUserLoggedIn, online, pageVisibilityHidden, enableGrayscale,
  instanceThemes, currentInstance, leftRightChangesFocus);

export { notificationPermission } from "./observers/notificationPermissionObservers";
export { isMobileSize, isSmallMobileSize, isTinyMobileSize, isVeryTinyMobileSize } from "./observers/resizeObservers";
export { isUserTouching } from "./observers/touchObservers";
export { now } from "./observers/nowObservers";

// TODO split into a separate file with statusModifications

function setStatusModification(instanceName, statusId, key, value) {
    const _statusModifications = statusModifications.get();
    _statusModifications[instanceName] = _statusModifications[instanceName] || {
        favorites: {},
        reblogs: {},
        pins: {},
        bookmarks: {}
    }

    _statusModifications[instanceName][key][statusId] = value
    statusModifications.set(_statusModifications);
}

export function setStatusFavorited(instanceName, statusId, favorited) {
    setStatusModification(instanceName, statusId, 'favorites', favorited);
}

export function setStatusReblogged(instanceName, statusId, reblogged) {
    setStatusModification(instanceName, statusId, 'reblogs', reblogged)
}

export function setStatusPinned(instanceName, statusId, pinned) {
    setStatusModification(instanceName, statusId, 'pins', pinned)
}

export function setStatusBookmarked(instanceName, statusId, bookmarked) {
    setStatusModification(instanceName, statusId, 'bookmarks', bookmarked)
}