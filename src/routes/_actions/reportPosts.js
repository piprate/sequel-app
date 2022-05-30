import { toast } from '../_components/toast/toast'
import { report } from '../_api/report'
import { formatIntl } from '../_utils/formatIntl'
import { currentInstance } from '../_store/local'
import { get } from 'svelte/store'
import { accessToken } from '../_store/instance'

export async function reportPosts (spark, postIds, comment, forward) {
  const _currentInstance = currentInstance.get()
  const _accessToken = get(accessToken)
  try {
    await report(_currentInstance, _accessToken, spark.id, postIds, comment, forward)
    /* no await */
    toast.say('intl.submittedReport')
  } catch (e) {
    /* no await */
    toast.say(formatIntl('intl.failedToReport', { error: (e.message || '') }))
  }
}
