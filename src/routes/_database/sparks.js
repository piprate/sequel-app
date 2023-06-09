import { SPARKS_STORE, NAME_LOWERCASE } from './constants'
import { sparksCache } from './cache'
import { cloneForStorage, getGenericEntityWithId, setGenericEntityWithId } from './helpers'

export async function getSpark(instanceName, sparkId) {
  return getGenericEntityWithId(SPARKS_STORE, sparksCache, instanceName, sparkId)
}

export async function setSpark(instanceName, spark) {
  return setGenericEntityWithId(SPARKS_STORE, sparksCache, instanceName, cloneForStorage(spark))
}
