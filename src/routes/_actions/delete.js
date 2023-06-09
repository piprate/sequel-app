import { deletePost } from '../_api/delete'
import { toast } from '../_components/toast/toast'
import { deletePost as deletePostLocally } from './deletePosts'
import { formatIntl } from '../_utils/formatIntl'
import { currentInstance } from '../_store/local'
import { get } from 'svelte/store'
import { accessToken } from '../_store/instance'

export async function doDeletePost(bubbleId, postId, asSpark) {
  const _currentInstance = currentInstance.get()
  const _accessToken = get(accessToken)
  try {
    const deletedPost = await deletePost(_currentInstance, _accessToken, bubbleId, postId, asSpark)
    deletePostLocally(_currentInstance, postId, asSpark)
    /* no await */
    toast.say('intl.postDeleted')
    return deletedPost
  } catch (e) {
    console.error(e)
    /* no await */
    toast.say(formatIntl('intl.unableToDelete', { error: e.message || '' }))
    throw e
  }
}
