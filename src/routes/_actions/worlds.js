import { getWorld, getWorldRelationship, newWorld, updateWorld } from '../_api/worlds'
import { database } from '../_database/database'
import {
  clearComposeData,
  currentInstance,
  getComposeData,
  observedWorld,
  observedWorldRelationship
} from '../_store/local'
import { accessToken, currentSparkId } from '../_store/instance'
import { prepareMediaItem } from './media'
import { get, writable } from 'svelte/store'
import { unwrap, wrap } from '../_utils/mapper'
import { displayError } from './errors'

async function _updateWorld (worldId, instanceName, accessToken) {
  const localPromise = database.getWorld(instanceName, wrap(worldId))
  const remotePromise = getWorld(instanceName, accessToken, worldId).then(world => {
    /* no await */
    database.setWorld(instanceName, world)
    return world
  })

  try {
    observedWorld.set((await localPromise))
  } catch (e) {
    console.error(e)
  }
  try {
    observedWorld.set((await remotePromise))
  } catch (e) {
    if (e.status === 404) {
      observedWorld.set(null)
      console.error(e)
    } else {
      throw e
    }
  }
}

async function _updateWorldRelationship (worldId, instanceName, accessToken, asSpark) {
  if (!asSpark) {
    // relationship can only be retrieved for a specific spark
    observedWorldRelationship.set(null)
    return
  }

  const localPromise = database.getWorldRelationship(instanceName, wrap(worldId))
  const remotePromise = getWorldRelationship(instanceName, accessToken, worldId, asSpark).then(relationship => {
    /* no await */
    database.setWorldRelationship(instanceName, relationship)
    return relationship
  })
  try {
    const rel = await localPromise
    if (rel && rel.referrer === asSpark) {
      observedWorldRelationship.set(rel)
    }
  } catch (e) {
    console.error(e)
  }
  try {
    observedWorldRelationship.set((await remotePromise))
  } catch (e) {
    if (e.status === 404) {
      observedWorldRelationship.set(null)
      console.error(e)
    } else {
      displayError(e)
    }
  }
}

export async function updateLocalWorldRelationship (instanceName, worldId, relationship) {
  await database.setWorldRelationship(instanceName, relationship)
  try {
    observedWorldRelationship.set(relationship)
  } catch (e) {
    console.error(e)
  }
}

export async function clearWorldProfileAndRelationship () {
  observedWorld.set(null)
  observedWorldRelationship.set(null)
}

export async function updateWorldProfileAndRelationship (worldId) {
  const _currentInstance = currentInstance.get()
  const token = get(accessToken)
  await Promise.all([
    _updateWorld(worldId, _currentInstance, token),
    _updateWorldRelationship(worldId, _currentInstance, token, get(currentSparkId))
  ])
}

export async function updateWorldRelationship (worldId) {
  await _updateWorldRelationship(worldId, currentInstance.get(), get(accessToken), get(currentSparkId))
}

export const worldOperationInProgress = writable(false)
export const worldOperationError = writable(null)

export async function saveWorld (realm, worldId, template) {
  worldOperationInProgress.set(true)
  worldOperationError.set(null)

  let world

  try {
    const submission = Object.assign({
      summaryFormat: 'txt'
    }, template)

    submission.name = submission.name.trim()

    const avatar = getComposeData(realm, 'avatar')
    const hadAvatar = getComposeData(realm, 'avatarPresent')
    if (avatar) {
      prepareMediaItem(avatar)
      submission.avatar = avatar.data
    } else if (hadAvatar) {
      submission.avatar = {}
    }

    const header = getComposeData(realm, 'header')
    const hadHeader = getComposeData(realm, 'headerPresent')
    if (header) {
      prepareMediaItem(header)
      submission.header = header.data
    } else if (hadHeader) {
      submission.header = {}
    }

    const asSpark = get(currentSparkId)

    if (!worldId) {
      world = await newWorld(currentInstance.get(), get(accessToken), submission, asSpark)
    } else {
      world = await updateWorld(currentInstance.get(), get(accessToken), unwrap(worldId), submission, asSpark)
    }

    clearComposeData(realm)
  } catch (err) {
    console.error(err)
    worldOperationError.set(err)
  } finally {
    worldOperationInProgress.set(false)
  }

  return world
}

export async function loadWorld (worldId) {
  return getWorld(currentInstance.get(), get(accessToken), worldId)
}
