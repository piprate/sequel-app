import { approveFollowRequest, rejectFollowRequest } from '../_api/requests'
import { emit } from '../_utils/eventBus'
import { toast } from '../_components/toast/toast'
import { formatIntl } from '../_utils/formatIntl'
import { currentInstance } from "../_store/local";
import { get } from "svelte/store";
import { accessToken } from "../_store/instance";

export async function setFollowRequestApprovedOrRejected(accountId, approved, toastOnSuccess) {
  const _currentInstance = currentInstance.get();
  const _accessToken = get(accessToken);
  try {
    if (approved) {
      await approveFollowRequest(_currentInstance, _accessToken, accountId)
    } else {
      await rejectFollowRequest(_currentInstance, _accessToken, accountId)
    }
    if (toastOnSuccess) {
      /* no await */
      toast.say(approved ? 'intl.approvedFollowRequest' : 'intl.rejectedFollowRequest')
    }
    emit('refreshAccountsList')
  } catch (e) {
    console.error(e)
    /* no await */
    toast.say(approved
      ? formatIntl('intl.unableToApproveFollowRequest', { error: (e.message || '') })
      : formatIntl('intl.unableToRejectFollowRequest', { error: (e.message || '') })
    )
  }
}
