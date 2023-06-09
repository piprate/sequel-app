import { muteSpark, unmuteSpark } from '../_api/mute'
import { toast } from '../_components/toast/toast'
import { updateLocalRelationship } from './sparks'
import { emit } from '../_utils/eventBus'
import { formatIntl } from '../_utils/formatIntl'
import { currentInstance } from '../_store/local'
import { get } from 'svelte/store'
import { accessToken } from '../_store/instance'

export async function setSparkMuted(sparkId, mute, notifications, toastOnSuccess) {
  const _currentInstance = currentInstance.get()
  const _accessToken = get(accessToken)
  try {
    let relationship
    if (mute) {
      relationship = await muteSpark(_currentInstance, _accessToken, sparkId, notifications)
    } else {
      relationship = await unmuteSpark(_currentInstance, _accessToken, sparkId)
    }
    await updateLocalRelationship(_currentInstance, sparkId, relationship)
    if (toastOnSuccess) {
      /* no await */
      toast.say(mute ? 'intl.mutedSpark' : 'intl.unmutedSpark')
    }
    emit('refreshSparksList')
  } catch (e) {
    console.error(e)
    /* no await */
    toast.say(
      mute
        ? formatIntl('intl.unableToMute', { error: e.message || '' })
        : formatIntl('intl.unableToUnmute', { error: e.message || '' })
    )
  }
}
