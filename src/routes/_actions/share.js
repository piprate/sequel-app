import { toast } from '../_components/toast/toast'
import { postHtmlToPlainText } from '../_utils/postHtmlToPlainText'
import { formatIntl } from '../_utils/formatIntl'
import { unwrap } from '../_utils/mapper'

export async function sharePost (post) {
  try {
    await navigator.share({
      title: post.summary || undefined,
      text: postHtmlToPlainText(post.body, post.mentions),
      url: `${location.origin}/go?p=/posts/${unwrap(post.id)}`
    })
  } catch (e) {
    /* no await */
    toast.say(formatIntl('intl.unableToShare', { error: (e.message || '') }))
  }
}
