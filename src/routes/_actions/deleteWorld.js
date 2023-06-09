import { toast } from '../_components/toast/toast'
import { formatIntl } from '../_utils/formatIntl'
import { currentInstance } from '../_store/local'
import { get } from 'svelte/store'
import { accessToken } from '../_store/instance'
import { deleteWorld } from '../_api/worlds'

export async function doDeleteWorld(worldId, asSpark) {
  const _currentInstance = currentInstance.get()
  const _accessToken = get(accessToken)
  try {
    await deleteWorld(_currentInstance, _accessToken, worldId, asSpark)
    // TODO: delete world locally
    // deletePostLocally(_currentInstance, postId);
    /* no await */
    toast.say('intl.worldArchived')
  } catch (e) {
    console.error(e)
    /* no await */
    toast.say(formatIntl('intl.unableToArchiveWorld', { error: e.message || '' }))
    throw e
  }
}
