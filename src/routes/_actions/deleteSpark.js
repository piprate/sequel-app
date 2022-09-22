import { toast } from '../_components/toast/toast'
import { formatIntl } from '../_utils/formatIntl'
import { currentInstance } from '../_store/local'
import { get } from 'svelte/store'
import { accessToken, currentSparkId } from '../_store/instance'
import { deleteSpark } from '../_api/sparks'
import { setCurrentSpark } from './sparks'

export async function doDeleteSpark (sparkId) {
  const _currentInstance = currentInstance.get()
  const _currentSparkId = get(currentSparkId)
  const _accessToken = get(accessToken)
  try {
    if (_currentSparkId === sparkId) {
      setCurrentSpark(_currentInstance, null)
    }

    await deleteSpark(_currentInstance, _accessToken, sparkId)
    // TODO: delete spark locally
    // deletePostLocally(_currentInstance, postId);
    /* no await */
    toast.say('intl.sparkArchived')
  } catch (e) {
    console.error(e)
    /* no await */
    toast.say(formatIntl('intl.unableToArchiveSpark', { error: (e.message || '') }))
    throw e
  }
}
