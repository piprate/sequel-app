import { derived } from 'svelte/store'
import { isKaiOS } from '../_utils/userAgent/isKaiOS'
import { persistentStore, transientStore } from './base'
import { get } from '../_utils/lodash-lite'
import { setupObservers } from './observers/observers'
import { themes } from '../_static/themes'
import { inBrowser } from '../_utils/browserOrNode'

const themeColors = themes.map((_) => [_.name, _.color])

if (inBrowser()) {
  window.__themeColors = Object.fromEntries(themeColors)
}

// persisted state

export const composeData = persistentStore('composeData', {})
export const currentInstance = persistentStore('currentInstance', null)
// we disable scrollbars by default on iOS
export const instanceNameInSearch = persistentStore('instanceNameInSearch', '')
export const instanceSettings = persistentStore('instanceSettings', {})
export const loggedInInstances = persistentStore('loggedInInstances', {})
export const loggedInInstancesInOrder = persistentStore('loggedInInstancesInOrder', [])
export const pinnedPages = persistentStore('pinnedPages', {})
export const pushSubscriptions = persistentStore('pushSubscriptions', {})
export const instanceCurrentSparks = persistentStore('instanceCurrentSparks', {})
export const inductionLevel = persistentStore('inductionLevel', {})

export const isUserLoggedIn = derived(
  [currentInstance, loggedInInstances],
  ([$currentInstance, $loggedInInstances]) => {
    return !!($currentInstance && Object.keys($loggedInInstances).includes($currentInstance))
  }
)

export const isAuthenticated = derived(
  [currentInstance, loggedInInstances],
  ([$currentInstance, $loggedInInstances]) => {
    return !!(
      $currentInstance &&
      Object.keys($loggedInInstances).includes($currentInstance) &&
      $loggedInInstances[$currentInstance].access_token !== ''
    )
  }
)

export const loggedInInstancesAsList = derived(
  [currentInstance, loggedInInstances, loggedInInstancesInOrder],
  ([$currentInstance, $loggedInInstances, $loggedInInstancesInOrder]) => {
    return $loggedInInstancesInOrder.map((instanceName) => {
      return Object.assign(
        {
          current: $currentInstance === instanceName,
          name: instanceName
        },
        $loggedInInstances[instanceName]
      )
    })
  }
)

export function getInstanceSetting(instanceName, settingName, defaultValue) {
  return get(instanceSettings.get(), [instanceName, settingName], defaultValue)
}

export function setInstanceSetting(instanceName, settingName, value) {
  const settings = instanceSettings.get()
  if (!settings[instanceName]) {
    settings[instanceName] = {}
  }
  settings[instanceName][settingName] = value
  instanceSettings.set(settings)
}

export function setComposeData(realm, obj) {
  const currentInstanceVal = currentInstance.get()
  const composeDataVal = composeData.get()
  const instanceNameData = (composeDataVal[currentInstanceVal] = composeDataVal[currentInstanceVal] || {})
  instanceNameData[realm] = Object.assign(instanceNameData[realm] || {}, { ts: Date.now() }, obj)
  composeData.set(composeDataVal)
}

export function getComposeData(realm, key) {
  return get(composeData.get(), [currentInstance.get(), realm, key])
}

export function clearComposeData(realm, field) {
  const currentInstanceVal = currentInstance.get()
  const composeDataVal = composeData.get()
  if (composeDataVal && composeDataVal[currentInstanceVal]) {
    if (field) {
      if (composeDataVal[currentInstanceVal][realm]) {
        delete composeDataVal[currentInstanceVal][realm][field]
      }
    } else {
      delete composeDataVal[currentInstanceVal][realm]
    }
  }
  composeData.set(composeDataVal)
}

// non-persisted state

export const currentTimeline = transientStore('')
export const customEmoji = transientStore({})
export const subscriptionRequestCounts = transientStore({})
export const instanceInfos = transientStore({})
export const instanceFilters = transientStore({})
export const instanceLists = transientStore({})
export const logInToInstanceError = transientStore(null)
export const logInToInstanceErrorForText = transientStore('')
export const logInToInstanceLoading = transientStore(false)
export const online = transientStore(!inBrowser() || navigator.onLine)
export const pinnedPosts = transientStore({})
export const polls = transientStore({})
export const pushNotificationsSupport = transientStore(
  inBrowser() &&
    'serviceWorker' in navigator &&
    'PushManager' in window &&
    'getKey' in window.PushSubscription.prototype
)
export const queryInSearch = transientStore('')
export const repliesShown = transientStore({})
export const sensitivesShown = transientStore({})
export const spoilersShown = transientStore({})
export const unexpiredInstanceFilters = transientStore({})

export const instanceUsers = transientStore({})

// stream to watch for current timeline updates and notifications
export const currentInstanceStream = transientStore(null)

export const focusSearchInput = transientStore(false)
export const searchLoading = transientStore(false)
export const searchResultsForQuery = transientStore('')
export const searchResults = transientStore(null)
export const timelineInitialized = transientStore(false)
export const timelinePreinitialized = transientStore(false)
export const observedSpark = transientStore(null)
export const observedRelationship = transientStore(null)
export const observedWorld = transientStore(null)
export const observedWorldRelationship = transientStore(null)
export const observedBubble = transientStore(null)
export const observedBubbleRelationship = transientStore(null)
export const observedListing = transientStore(null)
export const observedRelease = transientStore(null)
export const observedDigitalArt = transientStore(null)
export const pageVisibilityHidden = transientStore(false)
export const redirectToPage = transientStore('')
export const flowLoggedInAccount = transientStore('')
export const userSettings = transientStore(null)

export const markMediaAsSensitive = derived([userSettings], ([$userSettings]) => {
  return $userSettings?.general.media?.allMediaSensitive
})

export const neverMarkMediaAsSensitive = derived([userSettings], ([$userSettings]) => {
  return $userSettings?.general.media?.showSensitiveMedia
})

export const ignoreBlurhash = derived([userSettings], ([$userSettings]) => {
  return $userSettings?.general.media?.ignoreBlurhash
})

export const largeInlineMedia = derived([userSettings], ([$userSettings]) => {
  return $userSettings?.general.media?.largeInlineMedia
})

export const autoplayGifs = derived([userSettings], ([$userSettings]) => {
  return $userSettings?.general.media?.autoplayGifs
})

export const disableCustomScrollbars = derived([userSettings], ([$userSettings]) => {
  return $userSettings?.general.ui?.disableCustomScrollbars
})

export const disableInfiniteScroll = derived([userSettings], ([$userSettings]) => {
  return $userSettings?.general.ui?.disableInfiniteScroll
})

export const hideCards = derived([userSettings], ([$userSettings]) => {
  return $userSettings?.general.ui?.hideCards
})

export const underlineLinks = derived([userSettings], ([$userSettings]) => {
  return $userSettings?.general.ui?.underlineLinks
})

export const centerNav = derived([userSettings], ([$userSettings]) => {
  return $userSettings?.general.ui?.centerNav
})

export const reduceMotion = derived([userSettings], ([$userSettings]) => {
  return $userSettings?.general.a11y?.reduceMotion
})

export const alwaysShowFocusRing = derived([userSettings], ([$userSettings]) => {
  return $userSettings?.general.a11y?.alwaysShowFocusRing
})

export const disableTapOnPost = derived([userSettings], ([$userSettings]) => {
  return $userSettings?.general.a11y?.disableTapOnPost
})

export const omitEmojiInDisplayNames = derived([userSettings], ([$userSettings]) => {
  return $userSettings?.general.a11y?.omitEmojiInDisplayNames
})

export const disableLongAriaLabels = derived([userSettings], ([$userSettings]) => {
  return $userSettings?.general.a11y?.disableLongAriaLabels
})

export const selectedTheme = derived([userSettings], ([$userSettings]) => {
  return $userSettings?.instance[currentInstance.get()]?.theme
})

export const disableSubscriberCounts = derived([userSettings], ([$userSettings]) => {
  return $userSettings?.wellness.metrics?.hideSubscriberCount
})

export const disableTMMCounts = derived([userSettings], ([$userSettings]) => {
  return $userSettings?.wellness.metrics?.hideTMMCount
})

export const disableNotificationBadge = derived([userSettings], ([$userSettings]) => {
  return $userSettings?.wellness.immediacy?.hideUnread
})

export const disableRelativeTimestamps = derived([userSettings], ([$userSettings]) => {
  return $userSettings?.wellness.immediacy?.showAbsoluteTimestamps
})

export const enableGrayscale = derived([userSettings], ([$userSettings]) => {
  return $userSettings?.wellness.ui?.enableGrayscale
})

export const disableHotkeys = derived([userSettings], ([$userSettings]) => {
  return $userSettings?.hotkeys.disableAll
})

export const leftRightChangesFocus = derived([userSettings], ([$userSettings]) => {
  return $userSettings?.hotkeys.leftRightChangesFocus
})

// observers

setupObservers(
  alwaysShowFocusRing,
  isUserLoggedIn,
  online,
  pageVisibilityHidden,
  enableGrayscale,
  leftRightChangesFocus
)

export { notificationPermission } from './observers/notificationPermissionObservers'
export { isMobileSize, isSmallMobileSize, isTinyMobileSize, isVeryTinyMobileSize } from './observers/resizeObservers'
export { isUserTouching } from './observers/touchObservers'
export { now } from './observers/nowObservers'
