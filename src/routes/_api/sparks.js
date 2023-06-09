import { DEFAULT_TIMEOUT, del, get, paramsString, post, put, WRITE_TIMEOUT } from '../_utils/ajax'
import { auth, base, basename } from './utils'
import { unwrap } from '../_utils/mapper'
import { populateMediaURLsInSingleEntity, populateMediaURLsInEntityList } from './media'

export function newSpark(instanceName, accessToken, template) {
  const url = `${basename(instanceName)}/spark`
  return populateMediaURLsInSingleEntity(
    post(
      url,
      {
        template: template
      },
      auth(accessToken),
      { timeout: WRITE_TIMEOUT }
    ),
    instanceName,
    'spark'
  )
}

export function getSpark(instanceName, accessToken, sparkId) {
  const url = `${base(instanceName, accessToken)}/spark/${sparkId}`
  return populateMediaURLsInSingleEntity(
    get(url, auth(accessToken), { timeout: DEFAULT_TIMEOUT }),
    instanceName,
    'spark'
  )
}

export function updateSpark(instanceName, accessToken, sparkId, template) {
  const url = `${basename(instanceName)}/spark/${sparkId}`
  return populateMediaURLsInSingleEntity(
    put(url, template, auth(accessToken), { timeout: WRITE_TIMEOUT }),
    instanceName,
    'spark'
  )
}

export async function deleteSpark(instanceName, accessToken, sparkId) {
  const url = `${basename(instanceName)}/spark/${unwrap(sparkId)}`
  return del(url, auth(accessToken), { timeout: WRITE_TIMEOUT })
}

export async function getSparkList(instanceName, accessToken, limit = 80) {
  let url = `${basename(instanceName)}/sparks`
  url += '?' + paramsString({ limit })
  return populateMediaURLsInEntityList(get(url, auth(accessToken), { timeout: DEFAULT_TIMEOUT }), instanceName, 'spark')
}

export async function getBookmarkedSparks(instanceName, accessToken, asSpark, limit = 80) {
  let url = `${base(instanceName, accessToken)}/spark/${unwrap(asSpark)}/spark-bookmarks`
  url += '?' + paramsString({ limit })
  return populateMediaURLsInEntityList(get(url, auth(accessToken), { timeout: DEFAULT_TIMEOUT }), instanceName, 'spark')
}

export async function getSparkBubbleList(instanceName, accessToken, sparkId, includeMembers, limit = 80) {
  let url = `${base(instanceName, accessToken)}/spark/${sparkId}/bubbles`
  url += '?' + paramsString({ limit })
  if (includeMembers) {
    url += '&members=true'
  }
  return populateMediaURLsInEntityList(
    get(url, auth(accessToken), { timeout: DEFAULT_TIMEOUT }),
    instanceName,
    'bubble'
  )
}

export async function getSparkWorldList(instanceName, accessToken, sparkId, includeMembers, limit = 80) {
  let url = `${base(instanceName, accessToken)}/spark/${sparkId}/worlds`
  url += '?' + paramsString({ limit })
  if (includeMembers) {
    url += '&members=true'
  }
  return populateMediaURLsInEntityList(get(url, auth(accessToken), { timeout: DEFAULT_TIMEOUT }), instanceName, 'world')
}
