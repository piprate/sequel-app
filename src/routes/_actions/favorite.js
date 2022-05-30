import { favoriteStatus, unfavoriteStatus } from '../_api/favorite'
import { toast } from '../_components/toast/toast'
import { database } from '../_database/database'
import { formatIntl } from '../_utils/formatIntl'
import { currentInstance, online, setStatusFavorited } from "../_store/local";
import { get } from "svelte/store";
import { accessToken } from "../_store/instance";

export async function setFavorited (statusId, favorited) {
  if (!online.get()) {
    /* no await */ toast.say(favorited ? 'intl.cannotFavoriteOffline' : 'intl.cannotUnfavoriteOffline')
    return
  }
  const _currentInstance = currentInstance.get();
  const _accessToken = get(accessToken);
  const networkPromise = favorited
    ? favoriteStatus(_currentInstance, _accessToken, statusId)
    : unfavoriteStatus(_currentInstance, _accessToken, statusId)
  setStatusFavorited(_currentInstance, statusId, favorited) // optimistic update
  try {
    await networkPromise
    await database.setStatusFavorited(_currentInstance, statusId, favorited)
  } catch (e) {
    console.error(e)
    /* no await */ toast.say(favorited
      ? formatIntl('intl.unableToFavorite', { error: (e.message || '') })
      : formatIntl('intl.unableToUnfavorite', { error: (e.message || '') })
    )
    setStatusFavorited(_currentInstance, statusId, !favorited) // undo optimistic update
  }
}
