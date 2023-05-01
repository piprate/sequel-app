import { toast } from '../_components/toast/toast'
import { report } from '../_api/report'
import { formatIntl } from '../_utils/formatIntl'

export async function reportPosts (postIds, sparkId, comment) {
  try {
    await report(postIds, sparkId, comment)
    /* no await */
    toast.say('intl.submittedReport')
  } catch (e) {
    /* no await */
    toast.say(formatIntl('intl.failedToReport', { error: (e.message || '') }))
  }
}
