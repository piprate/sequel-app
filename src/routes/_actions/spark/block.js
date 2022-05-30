import { blockSpark, unblockSpark } from '../../_api/block'
import { toast } from '../../_components/toast/toast'
import { updateLocalRelationship } from '../sparks'
import { emit } from '../../_utils/eventBus'
import { formatIntl } from '../../_utils/formatIntl'
import { currentInstance } from '../../_store/local'
import { get } from 'svelte/store'
import { accessToken } from '../../_store/instance'

export async function setSparkBlocked (sparkId, block, toastOnSuccess) {
  const _currentInstance = currentInstance.get()
  const _accessToken = get(accessToken)
  try {
    let relationship
    if (block) {
      relationship = await blockSpark(_currentInstance, _accessToken, sparkId)
    } else {
      relationship = await unblockSpark(_currentInstance, _accessToken, sparkId)
    }
    await updateLocalRelationship(_currentInstance, sparkId, relationship)
    if (toastOnSuccess) {
      if (block) {
        /* no await */
        toast.say('intl.blockedSpark')
      } else {
        /* no await */
        toast.say('intl.unblockedSpark')
      }
    }
    emit('refreshSparksList')
  } catch (e) {
    console.error(e)
    /* no await */
    toast.say(block
      ? formatIntl('intl.unableToBlock', { block: !!block, error: (e.message || '') })
      : formatIntl('intl.unableToUnblock', { error: (e.message || '') })
    )
  }
}
