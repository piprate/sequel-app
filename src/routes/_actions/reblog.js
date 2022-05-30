import { toast } from '../_components/toast/toast'
import { reblogStatus, unreblogStatus } from '../_api/reblog'
import { database } from '../_database/database'
import { formatIntl } from '../_utils/formatIntl'
import { currentInstance, online, setStatusReblogged } from "../_store/local";
import { get } from "svelte/store";
import { accessToken } from "../_store/instance";

export async function setReblogged (statusId, reblogged) {
  if (!online.get()) {
    /* no await */ toast.say(reblogged ? 'intl.cannotReblogOffline' : 'intl.cannotUnreblogOffline')
    return
  }
  const _currentInstance = currentInstance.get();
  const _accessToken = get(accessToken);
  const networkPromise = reblogged
    ? reblogStatus(_currentInstance, _accessToken, statusId)
    : unreblogStatus(_currentInstance, _accessToken, statusId)
  setStatusReblogged(_currentInstance, statusId, reblogged) // optimistic update
  try {
    await networkPromise
    await database.setStatusReblogged(_currentInstance, statusId, reblogged)
  } catch (e) {
    console.error(e)
    /* no await */ toast.say(reblogged
      ? formatIntl('intl.failedToReblog', { error: (e.message || '') })
      : formatIntl('intl.failedToUnreblog', { error: (e.message || '') })
    )
    setStatusReblogged(_currentInstance, statusId, !reblogged) // undo optimistic update
  }
}
