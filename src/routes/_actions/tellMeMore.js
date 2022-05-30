import { toast } from '../_components/toast/toast'
import { tmmPost, unTmmPost } from '../_api/tmm'
import { database } from '../_database/database'
import { formatIntl } from '../_utils/formatIntl'
import { currentInstance, online } from '../_store/local'
import { get } from 'svelte/store'
import { accessToken, currentSparkId } from '../_store/instance'
import { store } from '../_store/store'

export async function setTMM (postId, tellMeMored) {
  if (!online.get()) {
    /* no await */
    toast.say(tellMeMored ? 'intl.cannotTMMOffline' : 'intl.cannotUnTMMOffline')
    return
  }
  const _currentInstance = currentInstance.get()
  const _accessToken = get(accessToken)
  const asSpark = get(currentSparkId)
  const networkPromise = tellMeMored
    ? tmmPost(_currentInstance, _accessToken, postId, asSpark)
    : unTmmPost(_currentInstance, _accessToken, postId, asSpark)
  store.setPostTellMeMored(_currentInstance, postId, tellMeMored, asSpark) // optimistic update
  try {
    await networkPromise
    await database.setPostTMMed(_currentInstance, postId, tellMeMored, asSpark)
  } catch (e) {
    console.error(e)
    /* no await */
    toast.say(tellMeMored
      ? formatIntl('intl.failedToTMM', { error: (e.message || '') })
      : formatIntl('intl.failedToUnTMM', { error: (e.message || '') })
    )
    store.setPostTellMeMored(_currentInstance, postId, !tellMeMored, asSpark) // undo optimistic update
  }
}
