import { toast } from '../_components/toast/toast'
import { pinPost, unpinPost } from '../_api/pin'
import { database } from '../_database/database'
import { emit } from '../_utils/eventBus'
import { formatIntl } from '../_utils/formatIntl'
import { currentInstance } from '../_store/local'
import { get } from 'svelte/store'
import { accessToken, currentSparkId } from '../_store/instance'
import { store } from '../_store/store'

export async function setPostPinnedOrUnpinned(postId, pinned, toastOnSuccess) {
  const _currentInstance = currentInstance.get()
  const _accessToken = get(accessToken)
  const asSpark = get(currentSparkId)
  try {
    if (pinned) {
      await pinPost(_currentInstance, _accessToken, postId)
    } else {
      await unpinPost(_currentInstance, _accessToken, postId)
    }
    if (toastOnSuccess) {
      /* no await */
      toast.say(pinned ? 'intl.pinnedPost' : 'intl.unpinnedPost')
    }
    store.setPostPinned(_currentInstance, postId, pinned, asSpark)
    await database.setPostPinned(_currentInstance, postId, pinned, asSpark)
    emit('updatePinnedPosts')
  } catch (e) {
    console.error(e)
    /* no await */
    toast.say(
      pinned
        ? formatIntl('intl.unableToPinPost', { error: e.message || '' })
        : formatIntl('intl.unableToUnpinPost', { error: e.message || '' })
    )
  }
}
