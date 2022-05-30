import { createSearchIndexFromPostOrNotification } from './createSearchIndexFromPostOrNotification'

export function computeFilterContextsForPostOrNotification (postOrNotification, contextsToRegex) {
  if (!contextsToRegex || !Object.keys(contextsToRegex).length) {
    // avoid computing the search index, just bail out
    return undefined
  }
  // the searchIndex is really just a string of text
  const searchIndex = createSearchIndexFromPostOrNotification(postOrNotification)
  const res = Object.entries(contextsToRegex)
    .filter(([context, regex]) => regex.test(searchIndex))
    .map(([context]) => context)

  // return undefined instead of a new array to reduce memory usage of TimelineSummary
  return res.length ? res : undefined
}
