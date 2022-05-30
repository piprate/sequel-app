import { blockWorld, unblockWorld } from '../../_api/worlds'
import { toast } from '../../_components/toast/toast'
import { updateLocalWorldRelationship } from '../worlds'
import { emit } from '../../_utils/eventBus'
import { formatIntl } from '../../_utils/formatIntl'
import { currentInstance } from '../../_store/local'
import { get } from 'svelte/store'
import { accessToken } from '../../_store/instance'
import { unwrap } from '../../_utils/mapper'

export async function setWorldBlocked (worldId, block, asSpark, toastOnSuccess) {
  worldId = unwrap(worldId)
  const _currentInstance = currentInstance.get()
  const _accessToken = get(accessToken)
  try {
    let relationship
    if (block) {
      relationship = await blockWorld(_currentInstance, _accessToken, worldId, asSpark)
    } else {
      relationship = await unblockWorld(_currentInstance, _accessToken, worldId, asSpark)
    }
    await updateLocalWorldRelationship(_currentInstance, worldId, relationship)
    if (toastOnSuccess) {
      if (block) {
        /* no await */
        toast.say('intl.blockedWorld')
      } else {
        /* no await */
        toast.say('intl.unblockedWorld')
      }
    }
    emit('refreshWorldsList')
  } catch (e) {
    console.error(e)
    /* no await */
    toast.say(block
      ? formatIntl('intl.unableToBlockWorld', { block: !!block, error: (e.message || '') })
      : formatIntl('intl.unableToUnblockWorld', { error: (e.message || '') })
    )
  }
}
