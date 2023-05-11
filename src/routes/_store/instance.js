import { derived } from 'svelte/store'
import { DEFAULT_THEME } from '../_utils/themeEngine'
import {
  composeData,
  currentInstance,
  customEmoji,
  inductionLevel,
  instanceCurrentSparks,
  instanceInfos,
  instanceLists,
  instanceUsers,
  loggedInInstances,
  pinnedPages,
  pushSubscriptions
} from './local'

export const currentSpark = deriveForInstance('currentSpark', instanceCurrentSparks, null)
export const currentInductionLevel = deriveForInstance('currentInductionLevel', inductionLevel, 0)
export const currentInstanceInfo = deriveForInstance('currentInstanceInfo', instanceInfos, null)
export const lists = deriveForInstance('lists', instanceLists, [])
export const pinnedPage = deriveForInstance('pinnedPage', pinnedPages, '/worlds')
export const currentCustomEmoji = deriveForInstance('currentCustomEmoji', customEmoji, [])
// TODO move to compose/autosuggest
export const currentComposeData = deriveForInstance('currentComposeData', composeData, {})
export const currentPushSubscription = deriveForInstance('currentPushSubscription', pushSubscriptions, null)

export const currentUser = deriveForInstance('currentUser', instanceUsers, null)

export const currentSparkId = derived(
  currentSpark,
  $currentSpark => {
    return $currentSpark ? $currentSpark.id : ''
  }
)

export const currentInstanceData = derived(
  [currentInstance, loggedInInstances],
  ([$currentInstance, $loggedInInstances]) => {
    return Object.assign({
      name: $currentInstance
    }, $loggedInInstances[$currentInstance])
  }
)

export const accessToken = derived(
  currentInstanceData,
  $currentInstanceData => $currentInstanceData && $currentInstanceData.access_token
)

function deriveForInstance (computedKey, instanceStore, defaultValue) {
  return derived(
    [instanceStore, currentInstance],
    ([$instanceStore, $currentInstance]) => {
      return ($currentInstance && $instanceStore[$currentInstance]) || defaultValue
    }
  )
}

export function setInductionLevel (val) {
  const _currentInstance = currentInstance.get()
  const lvl = inductionLevel.get()
  lvl[_currentInstance] = val
  inductionLevel.set(lvl)
}
