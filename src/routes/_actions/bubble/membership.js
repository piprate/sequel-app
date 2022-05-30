import { joinBubble, leaveBubble } from '../../_api/bubbles'
import { toast } from '../../_components/toast/toast'
import { updateLocalBubbleRelationship } from '../bubbles'
import { formatIntl } from '../../_utils/formatIntl'
import { currentInstance } from '../../_store/local'
import { get } from 'svelte/store'
import { accessToken } from '../../_store/instance'
import { unwrap } from '../../_utils/mapper'

export async function updateMembership (bubbleId, join, asSpark, toastOnSuccess) {
  bubbleId = unwrap(bubbleId)
  const _currentInstance = currentInstance.get()
  const _accessToken = get(accessToken)
  try {
    let relationship
    if (join) {
      relationship = await joinBubble(_currentInstance, _accessToken, bubbleId, asSpark)
    } else {
      relationship = await leaveBubble(_currentInstance, _accessToken, bubbleId, asSpark)
    }
    await updateLocalBubbleRelationship(_currentInstance, bubbleId, relationship)
    if (toastOnSuccess) {
      /* no await */
      toast.say(join ? 'intl.joinedBubble' : 'intl.leftBubble')
    }
  } catch (e) {
    console.error(e)
    /* no await */
    toast.say(join
      ? formatIntl('intl.unableToJoinBubble', { error: (e.message || '') })
      : formatIntl('intl.unableToLeaveBubble', { error: (e.message || '') })
    )
  }
}
