import { joinWorld, leaveWorld } from '../../_api/worlds'
import { toast } from '../../_components/toast/toast'
import { updateLocalWorldRelationship } from '../worlds'
import { formatIntl } from '../../_utils/formatIntl'
import { currentInstance } from '../../_store/local'
import { get } from 'svelte/store'
import { accessToken } from '../../_store/instance'
import { unwrap } from '../../_utils/mapper'

export async function updateMembership (worldId, join, asSpark, toastOnSuccess) {
  worldId = unwrap(worldId)
  const _currentInstance = currentInstance.get()
  const _accessToken = get(accessToken)
  try {
    let relationship
    if (join) {
      relationship = await joinWorld(_currentInstance, _accessToken, worldId, asSpark)
    } else {
      relationship = await leaveWorld(_currentInstance, _accessToken, worldId, asSpark)
    }
    await updateLocalWorldRelationship(_currentInstance, worldId, relationship)
    if (toastOnSuccess) {
      /* no await */
      toast.say(join ? 'intl.joinedWorld' : 'intl.leftWorld')
    }
  } catch (e) {
    console.error(e)
    /* no await */
    toast.say(join
      ? formatIntl('intl.unableToJoinWorld', { error: (e.message || '') })
      : formatIntl('intl.unableToLeaveWorld', { error: (e.message || '') })
    )
  }
}
