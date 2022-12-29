import { auth, base, basename, sequelAuth } from './utils'
import { DEFAULT_TIMEOUT, get, post, put, WRITE_TIMEOUT } from '../_utils/ajax'
import { unwrap } from '../_utils/mapper'
import { populatePostMediaURLs } from './media'

export async function sendPost (instanceName, accessToken, bubbleId, asSpark, text, originalPostId, inReplyToId, media, visibility, textFormatKey) {
  let url = `${basename(instanceName)}/bubble/${bubbleId}/post`
  let method = post

  if (originalPostId) {
    url += '/' + unwrap(originalPostId)
    method = put
  }

  let federated = false
  if (visibility === 'fediverse') {
    visibility = 'public'
    federated = true
  }
  const body = {
    body: text,
    bodyFormat: textFormatKey,
    inReplyTo: inReplyToId,
    visibility: visibility,
    federated: federated,
    media: media
  }

  for (const key of Object.keys(body)) {
    const value = body[key]
    // remove any unnecessary fields, except 'status' which must at least be an empty string
    if (key !== 'status' && (!value || (Array.isArray(value) && !value.length))) {
      delete body[key]
    }
  }

  return method(url, body, sequelAuth(accessToken, asSpark), { timeout: WRITE_TIMEOUT }).then((post) => {
    populatePostMediaURLs(post, instanceName, accessToken)
    return post
  })
}

export async function getPostContext (instanceName, accessToken, postId) {
  const url = `${base(instanceName, accessToken)}/post/${postId}/context`
  return get(url, auth(accessToken), { timeout: DEFAULT_TIMEOUT }).then((ctx) => {
    for (const post of ctx.ancestors) {
      populatePostMediaURLs(post, instanceName, accessToken)
    }
    for (const post of ctx.descendants) {
      populatePostMediaURLs(post, instanceName, accessToken)
    }
    return ctx
  })
}

export async function getPost (instanceName, accessToken, postId, asSpark) {
  const url = `${base(instanceName, accessToken)}/post/${postId}`
  return get(url, sequelAuth(accessToken, asSpark), { timeout: DEFAULT_TIMEOUT }).then((post) => {
    populatePostMediaURLs(post, instanceName, accessToken)
    return post
  })
}
