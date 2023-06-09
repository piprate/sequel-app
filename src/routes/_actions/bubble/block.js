import { blockBubble, unblockBubble } from '../../_api/bubbles'
import { toast } from '../../_components/toast/toast'
import { updateLocalBubbleRelationship } from '../bubbles'
import { formatIntl } from '../../_utils/formatIntl'
import { currentInstance } from '../../_store/local'
import { get } from 'svelte/store'
import { accessToken } from '../../_store/instance'
import { unwrap } from '../../_utils/mapper'

export async function setBubbleBlocked(bubbleId, block, asSpark, toastOnSuccess) {
  bubbleId = unwrap(bubbleId)
  const _currentInstance = currentInstance.get()
  const _accessToken = get(accessToken)
  try {
    let relationship
    if (block) {
      relationship = await blockBubble(_currentInstance, _accessToken, bubbleId, asSpark)
    } else {
      relationship = await unblockBubble(_currentInstance, _accessToken, bubbleId, asSpark)
    }
    await updateLocalBubbleRelationship(_currentInstance, bubbleId, relationship)
    if (toastOnSuccess) {
      if (block) {
        /* no await */
        toast.say('intl.blockedBubble')
      } else {
        /* no await */
        toast.say('intl.unblockedBubble')
      }
    }
    // emit('refreshBubblesList');
  } catch (e) {
    console.error(e)
    /* no await */
    toast.say(
      block
        ? formatIntl('intl.unableToBlockBubble', { block: !!block, error: e.message || '' })
        : formatIntl('intl.unableToUnblockBubble', { error: e.message || '' })
    )
  }
}
