import { clearCache, metaCache, postsCache, sparksCache } from './cache'
import { deleteDatabase } from './databaseLifecycle'

export async function clearDatabaseForInstance(instanceName) {
  clearCache(postsCache, instanceName)
  clearCache(sparksCache, instanceName)
  clearCache(metaCache, instanceName)
  await deleteDatabase(instanceName)
}
