import { derived, get as storeGet } from 'svelte/store'
import { currentInstance } from './local'
import { currentComposeData } from './instance'
import { transientStore } from './base'
import { get } from '../_utils/lodash-lite'

const MIN_PREFIX_LENGTH = 2
// Technically mastodon accounts allow dots, but it would be weird to do an autosuggest search if it ends with a dot.
// Also this is rare. https://github.com/tootsuite/mastodon/pull/6844
// However for emoji search we allow some extra things (e.g. :+1:, :white_heart:)
const VALID_CHARS = '[\\w\\+_\\-:]'
const PREFIXES = '(?:@|:|#)'
const REGEX = new RegExp(`(?:\\s|^)(${PREFIXES}${VALID_CHARS}{${MIN_PREFIX_LENGTH},})$`)

export const currentComposeRealm = transientStore('')

export const rootComposeFocused = transientStore({})
export const rootComposeSelectionStart = transientStore({})
export const rootAutosuggestSelected = transientStore({})
export const rootAutosuggestSearchResults = transientStore({})
export const rootAutosuggestType = transientStore({})

export const composeFocused = deriveForAutosuggest(rootComposeFocused, false)
export const composeSelectionStart = deriveForAutosuggest(rootComposeSelectionStart, 0)
export const autosuggestSelected = deriveForAutosuggest(rootAutosuggestSelected, 0)
export const autosuggestSearchResults = deriveForAutosuggest(rootAutosuggestSearchResults, [])
export const autosuggestType = deriveForAutosuggest(rootAutosuggestType, null)

export const rootAutosuggestSelecting = transientStore({})
export const autosuggestSelecting = deriveForAutosuggest(rootAutosuggestSelecting, false)

function deriveForAutosuggest(rootStore, defaultValue) {
  return derived(
    [currentInstance, currentComposeRealm, rootStore],
    ([$currentInstance, $currentComposeRealm, $rootStore]) =>
      get($rootStore, [$currentInstance, $currentComposeRealm], defaultValue)
  )
}

export const currentComposeText = derived(
  [currentComposeData, currentComposeRealm],
  ([$currentComposeData, $currentComposeRealm]) => get($currentComposeData, [$currentComposeRealm, 'text'], '')
)

export const autosuggestSearchText = derived(
  [currentComposeText, composeSelectionStart],
  ([$currentComposeText, $composeSelectionStart]) => {
    const selectionStart = $composeSelectionStart
    if (!$currentComposeText || selectionStart < MIN_PREFIX_LENGTH) {
      return ''
    }

    const textUpToCursor = $currentComposeText.substring(0, selectionStart)
    const match = textUpToCursor.match(REGEX)
    return (match && match[1]) || ''
  }
)

export const autosuggestShown = derived(
  [composeFocused, autosuggestSearchText, autosuggestSearchResults],
  ([$composeFocused, $autosuggestSearchText, $autosuggestNumSearchResults]) =>
    !!($composeFocused && $autosuggestSearchText && $autosuggestNumSearchResults.length)
)

export const setForAutosuggest = function (store, instanceName, realm, val) {
  const storeVal = storeGet(store)
  const instanceData = (storeVal[instanceName] = storeVal[instanceName] || {})
  instanceData[realm] = val
  store.set(storeVal)
}

export const setForCurrentAutosuggest = function (store, val) {
  const storeVal = storeGet(store)
  const instanceName = currentInstance.get()
  const instanceData = (storeVal[instanceName] = storeVal[instanceName] || {})
  instanceData[currentComposeRealm.get()] = val
  store.set(storeVal)
}

export const getForCurrentAutosuggest = function (store) {
  const storeVal = storeGet(store)
  return get(storeVal, [currentInstance.get(), currentComposeRealm.get()])
}

export function clearAutosuggestDataForInstance(instanceName) {
  ;[
    rootComposeFocused,
    rootComposeSelectionStart,
    rootAutosuggestSelected,
    rootAutosuggestSearchResults,
    rootAutosuggestType,
    rootAutosuggestSelecting
  ].forEach((store) => {
    store.delKey(instanceName)
  })
}
