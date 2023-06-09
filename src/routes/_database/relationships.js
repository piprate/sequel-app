import { cloneForStorage, getGenericEntityWithId, setGenericEntityWithId } from './helpers'
import { RELATIONSHIPS_STORE } from './constants'
import { relationshipsCache } from './cache'

export async function getRelationship(instanceName, sparkId) {
  return getGenericEntityWithId(RELATIONSHIPS_STORE, relationshipsCache, instanceName, sparkId)
}

export async function setRelationship(instanceName, relationship) {
  return setGenericEntityWithId(RELATIONSHIPS_STORE, relationshipsCache, instanceName, cloneForStorage(relationship))
}
