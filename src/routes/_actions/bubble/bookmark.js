import { toast } from '../../_components/toast/toast'
import { formatIntl } from '../../_utils/formatIntl'
import { currentInstance, online } from '../../_store/local'
import { get } from 'svelte/store'
import { accessToken } from '../../_store/instance'
import { bookmarkBubble, unbookmarkBubble } from '../../_api/bookmarkBubble'
import { updateLocalBubbleRelationship } from '../bubbles'

export async function setBubbleBookmarked (bubbleId, bookmarked, asSpark, toastOnSuccess) {
  if (!online.get()) {
    /* no await */
    toast.say(bookmarked ? 'intl.cannotBookmarkOffline' : 'intl.cannotUnbookmarkOffline')
    return
  }
  const _currentInstance = currentInstance.get()
  const _accessToken = get(accessToken)
  try {
    let relationship
    if (bookmarked) {
      relationship = await bookmarkBubble(_currentInstance, _accessToken, bubbleId, asSpark)
    } else {
      relationship = await unbookmarkBubble(_currentInstance, _accessToken, bubbleId, asSpark)
    }
    await updateLocalBubbleRelationship(_currentInstance, bubbleId, relationship)
    if (toastOnSuccess) {
      if (bookmarked) {
        /* no await */
        toast.say('intl.bookmarkedBubble')
      } else {
        /* no await */
        toast.say('intl.unbookmarkedBubble')
      }
    }
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
