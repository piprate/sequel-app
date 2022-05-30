import { toast } from '../_components/toast/toast'
import { bookmarkStatus, unbookmarkStatus } from '../_api/bookmark'
import { database } from '../_database/database'
import { formatIntl } from '../_utils/formatIntl'
import { currentInstance, setStatusBookmarked } from "../_store/local";
import { get } from "svelte/store";
import { accessToken } from "../_store/instance";

export async function setStatusBookmarkedOrUnbookmarked (statusId, bookmarked) {
  const _currentInstance = currentInstance.get();
  const _accessToken = get(accessToken);
  try {
    if (bookmarked) {
      await bookmarkStatus(_currentInstance, _accessToken, statusId)
    } else {
      await unbookmarkStatus(_currentInstance, _accessToken, statusId)
    }
    if (bookmarked) {
      /* no await */ toast.say('intl.bookmarkedStatus')
    } else {
      /* no await */ toast.say('intl.unbookmarkedStatus')
    }
    setStatusBookmarked(_currentInstance, statusId, bookmarked)
    await database.setStatusBookmarked(_currentInstance, statusId, bookmarked)
  } catch (e) {
    console.error(e)
    /* no await */toast.say(
      bookmarked
        ? formatIntl('intl.unableToBookmark', { error: (e.message || '') })
        : formatIntl('intl.unableToUnbookmark', { error: (e.message || '') })
    )
  }
}
