import { toast } from '../../_components/toast/toast'
import { formatIntl } from '../../_utils/formatIntl'
import { currentInstance, online } from '../../_store/local'
import { get } from 'svelte/store'
import { accessToken } from '../../_store/instance'
import { bookmarkSpark, unbookmarkSpark } from '../../_api/bookmarkSpark'
import { updateLocalRelationship } from '../sparks'

export async function setSparkBookmarked(sparkId, bookmarked, asSpark, toastOnSuccess) {
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
      relationship = await bookmarkSpark(_currentInstance, _accessToken, sparkId, asSpark)
    } else {
      relationship = await unbookmarkSpark(_currentInstance, _accessToken, sparkId, asSpark)
    }
    await updateLocalRelationship(_currentInstance, sparkId, relationship)
    if (toastOnSuccess) {
      if (bookmarked) {
        /* no await */
        toast.say('intl.bookmarkedSpark')
      } else {
        /* no await */
        toast.say('intl.unbookmarkedSpark')
      }
    }
  } catch (e) {
    console.error(e)
    /* no await */
    toast.say(
      bookmarked
        ? formatIntl('intl.unableToBookmark', { error: e.message || '' })
        : formatIntl('intl.unableToUnbookmark', { error: e.message || '' })
    )
  }
}
