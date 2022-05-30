import { muteConversation, unmuteConversation } from '../_api/muteConversation'
import { toast } from '../_components/toast/toast'
import { database } from '../_database/database'
import { formatIntl } from '../_utils/formatIntl'
import { currentInstance } from '../_store/local'
import { get } from 'svelte/store'
import { accessToken, currentSparkId } from '../_store/instance'

export async function setConversationMuted (postId, mute, toastOnSuccess) {
  const _currentInstance = currentInstance.get()
  const _accessToken = get(accessToken)
  const asSpark = get(currentSparkId)
  try {
    if (mute) {
      await muteConversation(_currentInstance, _accessToken, postId)
    } else {
      await unmuteConversation(_currentInstance, _accessToken, postId)
    }
    await database.setPostMuted(_currentInstance, postId, mute, asSpark)
    if (toastOnSuccess) {
      /* no await */
      toast.say(mute ? 'intl.mutedConversation' : 'intl.unmutedConversation')
    }
  } catch (e) {
    console.error(e)
    /* no await */
    toast.say(mute
      ? formatIntl('intl.unableToMuteConversation', { error: (e.message || '') })
      : formatIntl('intl.unableToUnmuteConversation', { error: (e.message || '') })
    )
  }
}
