import { auth, base, basename, sequelAuth } from './utils'
import { DEFAULT_TIMEOUT, del, get, paramsString, post, put, WRITE_TIMEOUT } from '../_utils/ajax'
import { unwrap } from '../_utils/mapper'
import { populateMediaURLsInEntityList, populateMediaURLsInSingleEntity } from './media'

export function newWorld(instanceName, accessToken, template, asSpark) {
  const url = `${basename(instanceName)}/world`
  return populateMediaURLsInSingleEntity(
    post(
      url,
      {
        template: template
      },
      sequelAuth(accessToken, asSpark),
      { timeout: WRITE_TIMEOUT }
    ),
    instanceName,
    'world'
  )
}

export function getWorld(instanceName, accessToken, worldId) {
  const url = `${base(instanceName, accessToken)}/world/${worldId}`
  return populateMediaURLsInSingleEntity(
    get(url, auth(accessToken), { timeout: DEFAULT_TIMEOUT }),
    instanceName,
    'world'
  )
}

export function updateWorld(instanceName, accessToken, worldId, template, asSpark) {
  const url = `${basename(instanceName)}/world/${worldId}`
  return populateMediaURLsInSingleEntity(
    put(url, template, sequelAuth(accessToken, asSpark), { timeout: WRITE_TIMEOUT }),
    instanceName,
    'world'
  )
}

export async function deleteWorld(instanceName, accessToken, worldId, asSpark) {
  const url = `${basename(instanceName)}/world/${unwrap(worldId)}`
  return del(url, sequelAuth(accessToken, asSpark), { timeout: WRITE_TIMEOUT })
}

export async function getWorldRelationship(instanceName, accessToken, worldId, asSpark) {
  const url = `${base(instanceName, accessToken)}/world/${worldId}/relationship?${paramsString({ as: asSpark })}`
  return await get(url, auth(accessToken), { timeout: DEFAULT_TIMEOUT })
}

export async function getWorldList(instanceName, accessToken, limit = 80) {
  let url = `${base(instanceName, accessToken)}/worlds`
  url += '?' + paramsString({ limit })
  return populateMediaURLsInEntityList(get(url, auth(accessToken), { timeout: DEFAULT_TIMEOUT }), instanceName, 'world')
}

export async function getWorldBubbleList(instanceName, accessToken, worldId, limit = 80) {
  let url = `${base(instanceName, accessToken)}/world/${worldId}/bubbles`
  url += '?' + paramsString({ limit })
  return populateMediaURLsInEntityList(
    get(url, auth(accessToken), { timeout: DEFAULT_TIMEOUT }),
    instanceName,
    'bubble'
  )
}

export async function getWorldMemberList(instanceName, accessToken, worldId, limit = 80) {
  let url = `${basename(instanceName)}/world/${worldId}/members`
  url += '?' + paramsString({ limit })
  return populateMediaURLsInEntityList(get(url, auth(accessToken), { timeout: DEFAULT_TIMEOUT }), instanceName, 'spark')
}

export async function blockWorld(instanceName, accessToken, worldId, asSpark) {
  const url = `${basename(instanceName)}/world/${worldId}/block`
  return post(url, null, sequelAuth(accessToken, asSpark), { timeout: WRITE_TIMEOUT })
}

export async function unblockWorld(instanceName, accessToken, worldId, asSpark) {
  const url = `${basename(instanceName)}/world/${worldId}/unblock`
  return post(url, null, sequelAuth(accessToken, asSpark), { timeout: WRITE_TIMEOUT })
}

export async function joinWorld(instanceName, accessToken, worldId, asSpark) {
  const url = `${basename(instanceName)}/world/${worldId}/join`
  return post(url, null, sequelAuth(accessToken, asSpark), { timeout: WRITE_TIMEOUT })
}

export async function leaveWorld(instanceName, accessToken, worldId, asSpark) {
  const url = `${basename(instanceName)}/world/${worldId}/leave`
  return post(url, null, sequelAuth(accessToken, asSpark), { timeout: WRITE_TIMEOUT })
}
