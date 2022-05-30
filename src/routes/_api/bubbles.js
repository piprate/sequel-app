import { auth, base, basename, sequelAuth } from './utils'
import { DEFAULT_TIMEOUT, del, get, paramsString, post, put, WRITE_TIMEOUT } from '../_utils/ajax'
import { unwrap } from '../_utils/mapper'
import { populateEntityMediaURLs, populateMediaURLsInEntityList, populateMediaURLsInSingleEntity } from './media'

export function newBubble (instanceName, accessToken, template, asSpark) {
  const url = `${basename(instanceName)}/bubble`
  return populateMediaURLsInSingleEntity(
    post(url, {
      template: template
    }, sequelAuth(accessToken, asSpark), { timeout: WRITE_TIMEOUT }),
    instanceName,
    'bubble')
}

export function getBubble (instanceName, accessToken, bubbleId) {
  const url = `${base(instanceName, accessToken)}/bubble/${bubbleId}`
  return populateMediaURLsInSingleEntity(
    get(url, auth(accessToken), { timeout: DEFAULT_TIMEOUT }),
    instanceName,
    'bubble')
}

export function updateBubble (instanceName, accessToken, bubbleId, template, asSpark) {
  const url = `${basename(instanceName)}/bubble/${bubbleId}`
  return populateMediaURLsInSingleEntity(
    put(url, template, sequelAuth(accessToken, asSpark), { timeout: WRITE_TIMEOUT }),
    instanceName,
    'bubble')
}

export async function deleteBubble (instanceName, accessToken, bubbleId, asSpark) {
  const url = `${basename(instanceName)}/bubble/${unwrap(bubbleId)}`
  return del(url, sequelAuth(accessToken, asSpark), { timeout: WRITE_TIMEOUT })
}

export async function getBubbleRelationship (instanceName, accessToken, bubbleId, asSpark) {
  const url = `${base(instanceName, accessToken)}/bubble/${bubbleId}/relationship?${paramsString({ as: asSpark })}`
  return await get(url, auth(accessToken), { timeout: DEFAULT_TIMEOUT })
}

export async function getBubbleList (instanceName, accessToken, limit = 80) {
  let url = `${base(instanceName, accessToken)}/bubbles`
  url += '?' + paramsString({ limit })
  return populateMediaURLsInEntityList(
    get(url, auth(accessToken), { timeout: DEFAULT_TIMEOUT }),
    instanceName,
    'bubble')
}

export async function getBookmarkedBubbles (instanceName, accessToken, asSpark, limit = 80) {
  let url = `${base(instanceName, accessToken)}/spark/${unwrap(asSpark)}/bubble-bookmarks`
  url += '?' + paramsString({ limit })
  return populateMediaURLsInEntityList(
    get(url, auth(accessToken), { timeout: DEFAULT_TIMEOUT }),
    instanceName,
    'bubble')
}

export async function getBubbleMemberList (instanceName, accessToken, bubbleId, limit = 80) {
  let url = `${base(instanceName, accessToken)}/bubble/${bubbleId}/members`
  url += '?' + paramsString({ limit })
  return get(url, auth(accessToken), { timeout: DEFAULT_TIMEOUT }).then((memberList) => {
    for (const member of memberList) {
      if (member.sparkRef) {
        populateEntityMediaURLs(member.sparkRef, instanceName, 'spark')
      }
    }
    return memberList
  })
}

export async function blockBubble (instanceName, accessToken, bubbleId, asSpark) {
  const url = `${basename(instanceName)}/bubble/${bubbleId}/block`
  return post(url, null, sequelAuth(accessToken, asSpark), { timeout: WRITE_TIMEOUT })
}

export async function unblockBubble (instanceName, accessToken, bubbleId, asSpark) {
  const url = `${basename(instanceName)}/bubble/${bubbleId}/unblock`
  return post(url, null, sequelAuth(accessToken, asSpark), { timeout: WRITE_TIMEOUT })
}

export async function joinBubble (instanceName, accessToken, bubbleId, asSpark) {
  const url = `${basename(instanceName)}/bubble/${bubbleId}/join`
  return post(url, null, sequelAuth(accessToken, asSpark), { timeout: WRITE_TIMEOUT })
}

export async function leaveBubble (instanceName, accessToken, bubbleId, asSpark) {
  const url = `${basename(instanceName)}/bubble/${bubbleId}/leave`
  return post(url, null, sequelAuth(accessToken, asSpark), { timeout: WRITE_TIMEOUT })
}
