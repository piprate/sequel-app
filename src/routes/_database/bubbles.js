import { BUBBLE_RELATIONSHIPS_STORE, BUBBLES_STORE } from './constants'
import { bubbleRelationshipsCache, bubblesCache } from './cache'
import { cloneForStorage, getGenericEntityWithId, setGenericEntityWithId } from './helpers'

export async function getBubble (instanceName, bubbleId) {
  return getGenericEntityWithId(BUBBLES_STORE, bubblesCache, instanceName, bubbleId)
}

export async function setBubble (instanceName, bubble) {
  return setGenericEntityWithId(BUBBLES_STORE, bubblesCache, instanceName, cloneForStorage(bubble))
}

export async function getBubbleRelationship (instanceName, bubbleId) {
  return getGenericEntityWithId(BUBBLE_RELATIONSHIPS_STORE, bubbleRelationshipsCache, instanceName, bubbleId)
}

export async function setBubbleRelationship (instanceName, relationship) {
  return setGenericEntityWithId(BUBBLE_RELATIONSHIPS_STORE, bubbleRelationshipsCache, instanceName, cloneForStorage(relationship))
}
