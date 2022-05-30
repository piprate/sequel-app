import { postHtmlToPlainText } from '../_utils/postHtmlToPlainText'
import { importShowComposeDialog } from '../_components/dialog/asyncDialogs/importShowComposeDialog.js'
import { setComposeData } from '../_store/local'
import { unwrap } from '../_utils/mapper'

export async function editPost (post) {
  const dialogPromise = importShowComposeDialog()

  setComposeData('dialog', {
    text: postHtmlToPlainText(post.body, post.mentions),
    contentWarningShown: false,
    contentWarning: '',
    postPrivacy: post.visibility,
    media: post.media && post.media.map(_ => ({
      url: _.url,
      previewUrl: _.previewUrl,
      description: _.description || '',
      data: {
        id: _.id,
        type: _.type,
        mediaType: _.mediaType,
        blurhash: _.blurhash || '',
        meta: _.meta || {}
      }
    })),
    inReplyToId: post.inReplyTo,
    originalPostId: post.id,
    // // note that for polls there is no real way to preserve the original expiry
    // poll: post.poll && {
    //   multiple: !!post.poll.multiple,
    //   options: (post.poll.options || []).map(option => option.title)
    // },
    sensitive: false // !!post.sensitive
  })
  const showComposeDialog = await dialogPromise
  showComposeDialog(unwrap(post.bubble))
}
