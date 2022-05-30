import { derived } from "svelte/store";
import { DEFAULT_THEME } from '../_utils/themeEngine'
import {
    composeData,
    currentInstance,
    customEmoji,
    instanceInfos,
    instanceLists,
    instanceThemes,
    loggedInInstances,
    pinnedPages,
    pushSubscriptions,
    statusModifications,
    verifyCredentials
} from "./local";

export const currentTheme = deriveForInstance('currentTheme', instanceThemes, DEFAULT_THEME)
export const currentVerifyCredentials = deriveForInstance('currentVerifyCredentials', verifyCredentials, null)
export const currentInstanceInfo = deriveForInstance('currentInstanceInfo', instanceInfos, null)
export const lists = deriveForInstance('lists', instanceLists, [])
export const pinnedPage = deriveForInstance('pinnedPage', pinnedPages, '/local')
export const currentStatusModifications = deriveForInstance('currentStatusModifications', statusModifications, null)
export const currentCustomEmoji = deriveForInstance('currentCustomEmoji', customEmoji, [])
// TODO move to compose/autosuggest
export const currentComposeData = deriveForInstance('currentComposeData', composeData, {})
export const currentPushSubscription = deriveForInstance('currentPushSubscription', pushSubscriptions, null)

export const currentInstanceData = derived(
  [currentInstance, loggedInInstances],
  ([$currentInstance, $loggedInInstances]) => {
      return Object.assign({
          name: $currentInstance
      }, $loggedInInstances[$currentInstance])
  }
);

export const accessToken = derived(
  currentInstanceData,
  $currentInstanceData => $currentInstanceData && $currentInstanceData.access_token
);

export const maxStatusChars = derived(
  currentInstanceInfo,
  $currentInstanceInfo => (
    // unofficial api used in glitch-soc and pleroma
    ($currentInstanceInfo && $currentInstanceInfo.max_toot_chars) || 500
  )
);

function deriveForInstance(computedKey, instanceStore, defaultValue) {
    return derived(
        [instanceStore, currentInstance],
        ([$instanceStore, $currentInstance]) => {
            return ($currentInstance && $instanceStore[$currentInstance]) || defaultValue
        }
    );
}
