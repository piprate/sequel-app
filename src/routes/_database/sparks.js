import { SPARKS_STORE, USERNAME_LOWERCASE } from './constants'
import { sparksCache } from './cache'
import { cloneForStorage, getGenericEntityWithId, setGenericEntityWithId } from './helpers'
import { dbPromise, getDatabase } from './databaseLifecycle'
import { createSparkUsernamePrefixKeyRange } from './keys'

export async function getSpark (instanceName, sparkId) {
  return getGenericEntityWithId(SPARKS_STORE, sparksCache, instanceName, sparkId)
}

export async function setSpark (instanceName, spark) {
  return setGenericEntityWithId(SPARKS_STORE, sparksCache, instanceName, cloneForStorage(spark))
}

export async function searchSparksByUsername (instanceName, usernamePrefix, limit) {
  limit = limit || 20
  const db = await getDatabase(instanceName)
  return dbPromise(db, SPARKS_STORE, 'readonly', (sparksStore, callback) => {
    const keyRange = createSparkUsernamePrefixKeyRange(usernamePrefix.toLowerCase())
    sparksStore.index(USERNAME_LOWERCASE).getAll(keyRange, limit).onsuccess = e => {
      callback(e.target.result)
    }
  })
}
