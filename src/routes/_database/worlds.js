import { WORLD_RELATIONSHIPS_STORE, WORLDS_STORE } from './constants'
import { worldRelationshipsCache, worldsCache } from './cache'
import { cloneForStorage, getGenericEntityWithId, setGenericEntityWithId } from './helpers'

export async function getWorld(instanceName, worldId) {
  return getGenericEntityWithId(WORLDS_STORE, worldsCache, instanceName, worldId)
}

export async function setWorld(instanceName, world) {
  return setGenericEntityWithId(WORLDS_STORE, worldsCache, instanceName, cloneForStorage(world))
}

export async function getWorldRelationship(instanceName, worldId) {
  return getGenericEntityWithId(WORLD_RELATIONSHIPS_STORE, worldRelationshipsCache, instanceName, worldId)
}

export async function setWorldRelationship(instanceName, relationship) {
  return setGenericEntityWithId(
    WORLD_RELATIONSHIPS_STORE,
    worldRelationshipsCache,
    instanceName,
    cloneForStorage(relationship)
  )
}
