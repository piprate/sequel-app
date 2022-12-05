import { toast } from '../_components/toast/toast'
import { bookmarkPost, unbookmarkPost } from '../_api/bookmark'
import { database } from '../_database/database'
import { formatIntl } from '../_utils/formatIntl'
import { currentInstance, online } from '../_store/local'
import { get } from 'svelte/store'
import { accessToken } from '../_store/instance'
import { store } from '../_store/store'
import { storeFreshTimelineItemsInDatabase } from './timeline'
import { rootTimelineItemSummaries, setForTimeline } from '../_store/timeline'
import { getTimeline } from '../_api/timelines'

export async function setPostBookmarked (postId, bookmarked, asSpark) {
  if (!online.get()) {
    /* no await */
    toast.say(bookmarked ? 'intl.cannotBookmarkOffline' : 'intl.cannotUnbookmarkOffline')
    return
  }
  const _currentInstance = currentInstance.get()
  const _accessToken = get(accessToken)
  try {
    if (bookmarked) {
      await bookmarkPost(_currentInstance, _accessToken, postId, asSpark)
    } else {
      await unbookmarkPost(_currentInstance, _accessToken, postId, asSpark)
    }

    // refresh bookmarks
    const { items } = await getTimeline(_currentInstance, _accessToken, asSpark, 'bookmarks', null, null, 5)
    setForTimeline(rootTimelineItemSummaries, _currentInstance, 'bookmarks', items)
    storeFreshTimelineItemsInDatabase(_currentInstance, 'bookmarks', items, asSpark)

    if (bookmarked) {
      /* no await */
      toast.say('intl.bookmarkedPost')
    } else {
      /* no await */
      toast.say('intl.unbookmarkedPost')
    }
    store.setPostBookmarked(_currentInstance, postId, bookmarked, asSpark)
    await database.setPostBookmarked(_currentInstance, postId, bookmarked, asSpark)
  } catch (e) {
    console.error(e)
    /* no await */
    toast.say(
      bookmarked
        ? formatIntl('intl.unableToBookmark', { error: (e.message || '') })
        : formatIntl('intl.unableToUnbookmark', { error: (e.message || '') })
    )
  }
}
