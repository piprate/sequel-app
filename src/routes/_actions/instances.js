import { getVerifyCredentials } from '../_api/user'
import {
  composeData,
  currentInstance,
  customEmoji,
  enableGrayscale,
  instanceInfos,
  instanceLists,
  instanceThemes,
  loggedInInstances,
  loggedInInstancesInOrder,
  queryInSearch,
  searchResults,
  timelineInitialized,
  timelinePreinitialized,
  verifyCredentials
} from '../_store/local'
import { clearAutosuggestDataForInstance } from '../_store/autosuggest'
import { clearTimelineDataForInstance } from '../_store/timeline'
import { switchToTheme } from '../_utils/themeEngine'
import { toast } from '../_components/toast/toast'
import { goto } from '@sapper/app';
import { cacheFirstUpdateAfter } from '../_utils/sync'
import { getInstanceInfo } from '../_api/instance'
import { database } from '../_database/database'
import { importVirtualListStore } from '../_utils/asyncModules/importVirtualListStore.js'
import { formatIntl } from '../_utils/formatIntl'

export function changeTheme (instanceName, newTheme) {
  const themes = instanceThemes.get();
  themes[instanceName] = newTheme;
  instanceThemes.set(themes);
  if (instanceName === currentInstance.get()) {
    switchToTheme(newTheme, enableGrayscale.get())
  }
}

export function switchToInstance (instanceName) {
  const themes = instanceThemes.get();
  currentInstance.set(instanceName);
  searchResults.set(null);
  queryInSearch.set('');
  switchToTheme(themes[instanceName], enableGrayscale.get())
}

export async function logOutOfInstance (instanceName, message) {
  message = message || formatIntl('intl.loggedOutOfInstance', { instance: instanceName })
  const current = currentInstance.get();
  const instancesInOrder = loggedInInstancesInOrder.get();
  instancesInOrder.splice(instancesInOrder.indexOf(instanceName), 1)
  const newInstance = instanceName === current ? instancesInOrder[0] : current
  const objectsToClear = [
    composeData,
    customEmoji,
    instanceInfos,
    instanceLists,
    instanceThemes,
    loggedInInstances,
    verifyCredentials
  ]
  for (const obj of objectsToClear) {
    const objVal = obj.get()
    delete objVal[instanceName]
    obj.set(objVal);
  }

  loggedInInstancesInOrder.set(instancesInOrder);
  currentInstance.set(newInstance);
  queryInSearch.set('');
  timelineInitialized.set(false);
  timelinePreinitialized.set(false);

  clearTimelineDataForInstance(instanceName);
  clearAutosuggestDataForInstance(instanceName);

  const { virtualListStore } = await importVirtualListStore()
  virtualListStore.clearRealmByPrefix(currentInstance + '/') // TODO: this is a hacky way to clear the vlist cache
  toast.say(message)
  switchToTheme(instanceThemes[newInstance], enableGrayscale.get())
  /* no await */ database.clearDatabaseForInstance(instanceName)
  goto('/settings/instances')
}

function setStoreVerifyCredentials (instanceName, thisVerifyCredentials) {
  const credentials = verifyCredentials.get();
  credentials[instanceName] = thisVerifyCredentials
  verifyCredentials.set(credentials);
}

export async function updateVerifyCredentialsForInstance (instanceName) {
  const instances = loggedInInstances.get();
  const accessToken = instances[instanceName].access_token
  await cacheFirstUpdateAfter(
    () => getVerifyCredentials(instanceName, accessToken).catch(logOutOnUnauthorized(instanceName)),
    () => database.getInstanceVerifyCredentials(instanceName),
    verifyCredentials => database.setInstanceVerifyCredentials(instanceName, verifyCredentials),
    verifyCredentials => setStoreVerifyCredentials(instanceName, verifyCredentials)
  )
}

export async function updateVerifyCredentialsForCurrentInstance () {
  await updateVerifyCredentialsForInstance(currentInstance.get())
}

export async function updateInstanceInfo (instanceName) {
  await cacheFirstUpdateAfter(
    () => getInstanceInfo(instanceName),
    () => database.getInstanceInfo(instanceName),
    info => database.setInstanceInfo(instanceName, info),
    info => {
      const infos = instanceInfos.get()
      infos[instanceName] = info
      instanceInfos.set(infos);
    }
  )
}

export function logOutOnUnauthorized (instanceName) {
  return async error => {
    if (error.message.startsWith('401:')) {
      await logOutOfInstance(instanceName, formatIntl('intl.accessTokenRevoked', { instance: instanceName }))
    }

    throw error
  }
}
