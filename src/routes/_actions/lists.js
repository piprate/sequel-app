import { instanceLists, loggedInInstances } from '../_store/local'
import { getLists } from '../_api/lists'
import { cacheFirstUpdateAfter, cacheFirstUpdateOnlyIfNotInCache } from '../_utils/sync'
import { database } from '../_database/database'

async function syncLists(instanceName, syncMethod) {
  const accessToken = loggedInInstances.get()[instanceName].access_token

  await syncMethod(
    () => getLists(instanceName, accessToken),
    () => database.getLists(instanceName),
    (lists) => database.setLists(instanceName, lists),
    (lists) => {
      const _instanceLists = instanceLists.get()
      _instanceLists[instanceName] = lists
      instanceLists.set(_instanceLists)
    }
  )
}

export async function updateListsForInstance(instanceName) {
  await syncLists(instanceName, cacheFirstUpdateAfter)
}

export async function setupListsForInstance(instanceName) {
  await syncLists(instanceName, cacheFirstUpdateOnlyIfNotInCache)
}
