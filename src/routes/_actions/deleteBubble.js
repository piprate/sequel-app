import { toast } from '../_components/toast/toast'
import { formatIntl } from '../_utils/formatIntl'
import { currentInstance } from '../_store/local'
import { get } from 'svelte/store'
import { accessToken } from '../_store/instance'
import { deleteBubble } from '../_api/bubbles'

export async function doDeleteBubble(bubbleId, asSpark) {
  const _currentInstance = currentInstance.get()
  const _accessToken = get(accessToken)
  try {
    await deleteBubble(_currentInstance, _accessToken, bubbleId, asSpark)
    // TODO: delete bubble locally
    // deletePostLocally(_currentInstance, postId);
    /* no await */
    toast.say('intl.bubbleArchived')
  } catch (e) {
    console.error(e)
    /* no await */
    toast.say(formatIntl('intl.unableToArchiveBubble', { error: e.message || '' }))
    throw e
  }
}
