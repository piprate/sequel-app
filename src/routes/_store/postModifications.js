import { transientStore } from './base'
import { derived } from 'svelte/store'
import { get } from '../_utils/lodash-lite'
import { currentInstance } from './local'
import { currentSparkId } from './instance'

const postModifications = transientStore({})

export const currentPostModifications = derived(
  [postModifications, currentInstance, currentSparkId],
  ([$postModifications, $currentInstance, $currentSparkId]) => {
    return get($postModifications, [$currentInstance, $currentSparkId], null)
  }
)

function setPostModification(instanceName, postId, key, value, asSpark) {
  const _postModifications = postModifications.get()
  const instanceData = (_postModifications[instanceName] = _postModifications[instanceName] || {})
  const sparkData = (instanceData[asSpark] = instanceData[asSpark] || {
    tellMeMores: {},
    pins: {},
    bookmarks: {}
  })

  sparkData[key][postId] = value
  postModifications.set(_postModifications)
}

export function setPostTellMeMored(instanceName, postId, tellMeMored, asSpark) {
  setPostModification(instanceName, postId, 'tellMeMores', tellMeMored, asSpark)
}

export function setPostPinned(instanceName, postId, pinned, asSpark) {
  setPostModification(instanceName, postId, 'pins', pinned, asSpark)
}

export function setPostBookmarked(instanceName, postId, bookmarked, asSpark) {
  setPostModification(instanceName, postId, 'bookmarks', bookmarked, asSpark)
}
