import { getUser } from '../_api/user'
import {
  composeData,
  currentInstance,
  customEmoji,
  enableGrayscale,
  instanceCurrentSparks,
  instanceInfos,
  instanceLists,
  instanceUsers,
  loggedInInstances,
  loggedInInstancesInOrder,
  pinnedPages,
  queryInSearch,
  searchResults,
  timelineInitialized,
  timelinePreinitialized,
  userSettings
} from '../_store/local'
import { clearAutosuggestDataForInstance } from '../_store/autosuggest'
import { clearTimelineDataForInstance } from '../_store/timeline'
import { DEFAULT_THEME, switchToTheme } from '../_utils/themeEngine'
import { toast } from '../_components/toast/toast'
import { goto } from '$app/navigation'
import { cacheFirstUpdateAfter } from '../_utils/sync'
import { getInstanceInfo } from '../_api/instance'
import { database } from '../_database/database'
import { importVirtualListStore } from '../_utils/asyncModules/importVirtualListStore.js'
import { formatIntl } from '../_utils/formatIntl'
import { configureFlow, disconnectFromFlow } from './flow'
import { get } from 'svelte/store'
import { deleteSettings } from './settings'

export function switchToInstance(instanceName) {
  const theme = userSettings.get()?.instance[instanceName].theme
  currentInstance.set(instanceName)
  searchResults.set(null)
  queryInSearch.set('')
  switchToTheme(theme, get(enableGrayscale))
  configureFlow(instanceName)
}

export async function logOutOfInstance(instanceName, message) {
  message = message || formatIntl('intl.loggedOutOfInstance', { instance: instanceName })
  const _currentInstance = currentInstance.get()
  const instancesInOrder = loggedInInstancesInOrder.get()
  instancesInOrder.splice(instancesInOrder.indexOf(instanceName), 1)
  const newInstance = instanceName === _currentInstance ? instancesInOrder[0] : _currentInstance
  const objectsToClear = [
    composeData,
    customEmoji,
    instanceInfos,
    instanceLists,
    loggedInInstances,
    instanceUsers,
    instanceCurrentSparks,
    pinnedPages
  ]
  for (const obj of objectsToClear) {
    const objVal = obj.get()
    delete objVal[instanceName]
    obj.set(objVal)
  }

  loggedInInstancesInOrder.set(instancesInOrder)
  currentInstance.set(newInstance)
  searchResults.set(null)
  queryInSearch.set('')
  timelineInitialized.set(false)
  timelinePreinitialized.set(false)

  clearTimelineDataForInstance(instanceName)
  clearAutosuggestDataForInstance(instanceName)

  const { virtualListStore } = await importVirtualListStore()
  virtualListStore.clearRealmByPrefix(_currentInstance + '/') // TODO: this is a hacky way to clear the vlist cache
  toast.say(message)
  deleteSettings()
  switchToTheme(DEFAULT_THEME, get(enableGrayscale))
  disconnectFromFlow()
  /* no await */
  database.clearDatabaseForInstance(instanceName)
  goto('/')
}

function setStoreUser(instanceName, user) {
  const _instanceUsers = instanceUsers.get()
  _instanceUsers[instanceName] = user
  instanceUsers.set(_instanceUsers)
}

export async function updateUserForInstance(instanceName) {
  const accessToken = loggedInInstances.get()[instanceName].access_token
  await cacheFirstUpdateAfter(
    () => getUser(instanceName, accessToken).catch(logOutOnUnauthorized(instanceName)),
    () => database.getUser(instanceName),
    (user) => database.setUser(instanceName, user),
    (user) => setStoreUser(instanceName, user)
  )
}

export async function updateInstanceInfo(instanceName) {
  await cacheFirstUpdateAfter(
    () => getInstanceInfo(instanceName),
    () => database.getInstanceInfo(instanceName),
    (info) => database.setInstanceInfo(instanceName, info),
    (info) => {
      const infos = instanceInfos.get()
      infos[instanceName] = info
      instanceInfos.set(infos)
    }
  )
}

export function logOutOnUnauthorized(instanceName) {
  return async (error) => {
    if (error.status && error.status === 401) {
      await logOutOfInstance(instanceName, formatIntl('intl.accessTokenRevoked', { instance: instanceName }))
    }

    throw error
  }
}
