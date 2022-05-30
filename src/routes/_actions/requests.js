import { approveSubscriptionRequest, rejectSubscriptionRequest } from '../_api/subscriptionRequests'
import { emit } from '../_utils/eventBus'
import { toast } from '../_components/toast/toast'
import { formatIntl } from '../_utils/formatIntl'
import { currentInstance } from '../_store/local'
import { get } from 'svelte/store'
import { accessToken } from '../_store/instance'

export async function setSubRequestApprovedOrRejected (sparkId, approved, toastOnSuccess) {
  const _currentInstance = currentInstance.get()
  const _accessToken = get(accessToken)
  try {
    if (approved) {
      await approveSubscriptionRequest(_currentInstance, _accessToken, sparkId)
    } else {
      await rejectSubscriptionRequest(_currentInstance, _accessToken, sparkId)
    }
    if (toastOnSuccess) {
      /* no await */
      toast.say(approved ? 'intl.approvedSubscriptionRequest' : 'intl.rejectedSubscriptionRequest')
    }
    emit('refreshSparksList')
  } catch (e) {
    console.error(e)
    /* no await */
    toast.say(approved
      ? formatIntl('intl.unableToApproveSubscriptionRequest', { error: (e.message || '') })
      : formatIntl('intl.unableToRejectSubscriptionRequest', { error: (e.message || '') })
    )
  }
}
