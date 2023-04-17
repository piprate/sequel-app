// create a function for filtering timeline item summaries

export const createFilterFunction = (
  showTMMs, showSubscribers, showBubbleNotices, showWorldNotices, showMentions, wordFilterContext
) => {
  return item => {
    if (item.filterContexts && item.filterContexts.includes(wordFilterContext)) {
      return false
    }

    switch (item.type) {
      case 'tmm':
        return showTMMs
      case 'join_bubble':
      case 'leave_bubble':
        return showBubbleNotices
      case 'join_world':
      case 'leave_world':
        return showWorldNotices
      case 'mention':
        return showMentions
      case 'subscription':
        return showSubscribers
    }

    return true
  }
}
