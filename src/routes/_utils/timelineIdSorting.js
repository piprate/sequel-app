import { padStart } from './lodash-lite'

const MAX_TIMELINE_ID = 99999999999999

export function zeroPad (str, toSize) {
  return padStart(str, toSize, '0')
}

export function reverseTimelineId (id) {
  return MAX_TIMELINE_ID - id
}

export function compareTimelineItemSummaries (left, right, order = 'descending') {
  const leftID = left.timelineId
  const rightID = right.timelineId

  if (order === 'descending') {
    return leftID < rightID ? -1 : leftID === rightID ? 0 : 1
  }

  return leftID > rightID ? -1 : leftID === rightID ? 0 : 1
}

export function reverseCompareTimelineItemSummaries (left, right) {
  return -compareTimelineItemSummaries(left, right)
}
