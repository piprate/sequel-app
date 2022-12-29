import { DEFAULT_TIMEOUT, getWithHeaders, paramsString } from '../_utils/ajax'
import { base, sequelAuth } from './utils'
import { populateNotificationMediaURLs, populatePostMediaURLs } from './media'
import { unwrap } from '../_utils/mapper'

export async function getTimeline (instanceName, accessToken, asSpark, timeline, maxId, since, limit) {
  let url = `${base(instanceName, accessToken)}/`

  const isNotification = timeline.startsWith('notifications')

  const params = {}

  if (timeline.startsWith('tag/')) {
    const parts = timeline.split('/')
    url += `${parts[0]}/${encodeURIComponent(parts[1])}/timeline`
  } else if (timeline.startsWith('spark/') || timeline.startsWith('world/') || timeline.startsWith('bubble/')) {
    const parts = timeline.split('/')
    url += `${parts[0]}/${parts[1]}/timeline`
    if (timeline.endsWith('media')) {
      params.only_media = true
    } else {
      params.include_comments = timeline.endsWith('/with_comments')
    }
  } else if (timeline === 'bookmarks') {
    if (!asSpark) {
      return { items: [], headers: [] }
    }
    url += 'spark/' + unwrap(asSpark) + '/post-bookmarks'
  } else if (timeline.startsWith('subscriptions')) {
    if (!asSpark) {
      return { items: [], headers: [] }
    }
    url += 'spark/' + unwrap(asSpark) + '/subscription-timeline'
    if (timeline === 'subscriptions/exclusive') {
      params.exclusive_only = true
    }
  } else if (isNotification) {
    url += 'notification/timeline'
    if (timeline === 'notifications/mentions') {
      params.include_types = ['mention', 'comment']
    }
  } else {
    throw new Error(`Invalid timeline type: ${timeline}`)
  }

  if (since) {
    params.since_id = since
  }

  if (maxId) {
    params.max_id = maxId
  }

  if (limit) {
    params.limit = limit
  }

  url += '?' + paramsString(params)

  console.log('Fetching url', url)
  const {
    json: items,
    headers
  } = await getWithHeaders(url, sequelAuth(accessToken, asSpark), { timeout: DEFAULT_TIMEOUT })

  if (isNotification) {
    for (const notification of items) {
      populateNotificationMediaURLs(notification, instanceName, accessToken)
    }
  } else {
    for (const post of items) {
      populatePostMediaURLs(post, instanceName, accessToken)
    }
  }

  // if (timeline === 'direct') {
  //   items = items.map(item => item.last_status);
  // }

  return { items, headers }
}
