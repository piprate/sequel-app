import { toast } from '../_components/toast/toast'
import { postBodyToPlainText } from '../_utils/postBodyToPlainText'
import { formatIntl } from '../_utils/formatIntl'
import { unwrap } from '../_utils/mapper'

export async function sharePost (post) {
  try {
    await navigator.share({
      title: post.summary || undefined,
      text: postBodyToPlainText(post),
      url: `${location.origin}/go?p=/posts/${unwrap(post.id)}`
    })
  } catch (e) {
    /* no await */
    toast.say(formatIntl('intl.unableToShare', { error: (e.message || '') }))
  }
}
