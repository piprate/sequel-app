import { DEFAULT_TIMEOUT, getWithHeaders, paramsString } from '../_utils/ajax'
import { base, sequelAuth } from './utils'
import { populateNotificationMediaURLs, populatePostMediaURLs } from './media'
import { unwrap } from '../_utils/mapper'

function getTimelineUrlPath (timeline) {
  switch (timeline) {
    case 'notifications':
    case 'notifications/mentions':
      return 'notification/timeline'
    case 'bookmarks':
      return 'spark'
    case 'subscriptions':
    case 'subscriptions/exclusive':
      return 'spark'
  }
  if (timeline.startsWith('tag/')) {
    return 'timelines/tag'
  } else if (timeline.startsWith('spark/')) {
    return 'spark'
  } else if (timeline.startsWith('world/')) {
    return 'world'
  } else if (timeline.startsWith('bubble/')) {
    return 'bubble'
  }
  throw new Error(`Invalid timeline type: ${timeline}`)
}

export async function getTimeline (instanceName, accessToken, asSpark, timeline, maxId, since, limit) {
  const timelineUrlName = getTimelineUrlPath(timeline)
  let url = `${base(instanceName, accessToken)}/${timelineUrlName}`

  const isNotification = timelineUrlName === 'notification/timeline'

  const params = {}

  if (timeline.startsWith('tag/')) {
    url += '/' + timeline.split('/')[1]
  } else if (timeline.startsWith('spark/')) {
    url += '/' + timeline.split('/')[1] + '/timeline'
  } else if (timeline.startsWith('world/')) {
    url += '/' + timeline.split('/')[1] + '/timeline'
  } else if (timeline.startsWith('bubble/')) {
    url += '/' + timeline.split('/')[1] + '/timeline'
  } else if (timeline === 'bookmarks') {
    if (!asSpark) {
      return { items: [], headers: [] }
    }
    url += '/' + unwrap(asSpark) + '/post-bookmarks'
  } else if (timeline.startsWith('subscriptions')) {
    if (!asSpark) {
      return { items: [], headers: [] }
    }
    url += '/' + unwrap(asSpark) + '/subscription-timeline'
    if (timeline === 'subscriptions/exclusive') {
      params.exclusive_only = true
    }
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

  if (timeline.startsWith('spark/') || timeline.startsWith('world/') || timeline.startsWith('bubble/')) {
    if (timeline.endsWith('media')) {
      params.only_media = true
    } else {
      params.include_comments = timeline.endsWith('/with_comments')
    }
  }

  if (timeline === 'notifications/mentions') {
    params.include_types = ['mention', 'comment']
  }

  url += '?' + paramsString(params)

  console.log('fetching url', url)
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
