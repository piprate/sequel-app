import { database } from '../_database/database'
import { decode as decodeBlurhash, init as initBlurhash } from '../_utils/blurhash'
import { mark, stop } from '../_utils/marks'
import { get } from '../_utils/lodash-lite'
import { postBodyToPlainText } from '../_utils/postBodyToPlainText'
import { scheduleIdleTask } from '../_utils/scheduleIdleTask'

async function getNotification (instanceName, timelineType, timelineValue, itemId, asSpark) {
  return {
    timelineType,
    timelineValue,
    notification: await database.getNotification(instanceName, itemId, asSpark)
  }
}

async function getPost (instanceName, timelineType, timelineValue, itemId, asSpark) {
  return {
    timelineType,
    timelineValue,
    post: await database.getPost(instanceName, itemId, asSpark)
  }
}

function tryInitBlurhash () {
  try {
    initBlurhash()
  } catch (err) {
    console.error('could not start blurhash worker', err)
  }
}

function getActualPost (postOrNotification) {
  return get(postOrNotification, ['post']) ||
    get(postOrNotification, ['notification', 'post'])
}

async function decodeAllBlurhashes (postOrNotification) {
  const post = getActualPost(postOrNotification)
  if (!post) {
    return
  }
  const mediaWithBlurhashes = get(post, ['media'], [])
    .filter(_ => _.blurhash)
  if (mediaWithBlurhashes.length) {
    mark(`decodeBlurhash-${post.id}`)
    await Promise.all(mediaWithBlurhashes.map(async media => {
      try {
        media.decodedBlurhash = await decodeBlurhash(media.blurhash)
      } catch (err) {
        console.warn('Could not decode blurhash, ignoring', err)
      }
    }))
    stop(`decodeBlurhash-${post.id}`)
  }
}

async function calculatePlainTextContent (postOrNotification) {
  const post = getActualPost(postOrNotification)
  if (!post) {
    return
  }
  // Calculating the plaintext from the HTML is a non-trivial operation, so we might
  // as well do it in advance, while blurhash is being decoded on the worker thread.
  await new Promise(resolve => {
    scheduleIdleTask(() => {
      post.bodyText = postBodyToPlainText(post)
      resolve()
    })
  })
}

export function createMakeProps (instanceName, timelineType, timelineValue, asSpark) {
  let promiseChain = Promise.resolve()

  tryInitBlurhash() // start the blurhash worker a bit early to save time

  async function fetchFromIndexedDB (itemId) {
    mark(`fetchFromIndexedDB-${itemId}`)
    try {
      const res = await (timelineType === 'notifications'
        ? getNotification(instanceName, timelineType, timelineValue, itemId, asSpark)
        : getPost(instanceName, timelineType, timelineValue, itemId, asSpark))
      return res
    } finally {
      stop(`fetchFromIndexedDB-${itemId}`)
    }
  }

  async function getPostOrNotification (itemId) {
    const postOrNotification = await fetchFromIndexedDB(itemId)
    await Promise.all([
      decodeAllBlurhashes(postOrNotification),
      calculatePlainTextContent(postOrNotification)
    ])
    return postOrNotification
  }

  // The results from IndexedDB or the worker thread can return in random order,
  // so we ensure consistent ordering based on the order this function is called in.
  return itemId => {
    const getPostOrNotificationPromise = getPostOrNotification(itemId) // start the promise ASAP
    return new Promise((resolve, reject) => {
      promiseChain = promiseChain
        .then(() => getPostOrNotificationPromise)
        .then(resolve, reject)
    })
  }
}
