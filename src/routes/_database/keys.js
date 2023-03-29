import { get } from 'svelte/store'
import { currentSparkId } from '../_store/instance'
import { unwrap } from '../_utils/mapper'
import { reverseTimelineId, zeroPad } from '../_utils/timelineIdSorting'

//
// timelines
//

export function createTimelineId (timeline, id) {
  // reverse chronological order, prefixed by timeline
  return timeline + '\u0000' + reverseTimelineId(id)
}

export function createTimelineKeyRange (timeline, maxId) {
  const negBigInt = maxId && reverseTimelineId(maxId)
  const start = negBigInt ? (timeline + '\u0000' + negBigInt) : (timeline + '\u0000')
  const end = timeline + '\u0000\uffff'
  return IDBKeyRange.bound(start, end, true, true)
}

//
// threads
//

export function createThreadId (postId, i) {
  return postId + '\u0000' + zeroPad(i, 5)
}

export function createThreadKeyRange (postId) {
  return IDBKeyRange.bound(
    postId + '\u0000',
    postId + '\u0000\uffff'
  )
}

//
// pinned posts
//

export function createPinnedPostId (sparkId, i) {
  return sparkId + '\u0000' + zeroPad(i, 3)
}

export function createPinnedPostKeyRange (sparkId) {
  return IDBKeyRange.bound(
    sparkId + '\u0000',
    sparkId + '\u0000\uffff'
  )
}

//
// sparks
//

export function createSparkUsernamePrefixKeyRange (sparkUsernamePrefix) {
  return IDBKeyRange.bound(
    sparkUsernamePrefix,
    sparkUsernamePrefix + '\uffff'
  )
}

export function createNamePrefixKeyRange (namePrefix) {
  return IDBKeyRange.bound(
    namePrefix,
    namePrefix + '\uffff'
  )
}

export function mergeKeyWithSparkId (key) {
  return `${key}_${unwrap(get(currentSparkId))}`
}