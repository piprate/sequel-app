import { computeFilterContextsForPostOrNotification } from './computeFilterContextsForPostOrNotification'
import { unexpiredInstanceFilterRegexes } from '../_store/wordFilter'
import { get } from 'svelte/store'

class TimelineSummary {
  constructor (item, instanceName) {
    this.id = item.id
    this.timelineId = item.timelineID || item.id
    this.sparkId = item.attributedTo || (item.actor && item.actor.id)
    this.bubbleId = item.bubble
    this.replyId = (item.inReplyTo) || undefined
    this.createdAt = item.createdAt
    this.type = item.type || undefined

    // This is admittedly a weird place to do the filtering logic. But there are a few reasons to do it here:
    // 1. Avoid computing html-to-text (expensive) for users who don't have any filters (probably most users)
    // 2. Avoiding keeping the entire html-to-text in memory at all times for all summaries
    // 3. Filters probably change infrequently. When they do, we can just update the summaries
    const contextsToRegex = get(unexpiredInstanceFilterRegexes)[instanceName]
    this.filterContexts = computeFilterContextsForPostOrNotification(item, contextsToRegex)
  }
}

export function timelineItemToSummary (item, instanceName) {
  return new TimelineSummary(item, instanceName)
}
