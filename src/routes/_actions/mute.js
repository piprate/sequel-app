import { muteAccount, unmuteAccount } from '../_api/mute'
import { toast } from '../_components/toast/toast'
import { updateLocalRelationship } from './accounts'
import { emit } from '../_utils/eventBus'
import { formatIntl } from '../_utils/formatIntl'
import { currentInstance } from "../_store/local";
import { get } from "svelte/store";
import { accessToken } from "../_store/instance";

export async function setAccountMuted (accountId, mute, notifications, toastOnSuccess) {
  const _currentInstance = currentInstance.get();
  const _accessToken = get(accessToken);
  try {
    let relationship
    if (mute) {
      relationship = await muteAccount(_currentInstance, _accessToken, accountId, notifications)
    } else {
      relationship = await unmuteAccount(_currentInstance, _accessToken, accountId)
    }
    await updateLocalRelationship(_currentInstance, accountId, relationship)
    if (toastOnSuccess) {
      /* no await */ toast.say(mute ? 'intl.mutedAccount' : 'intl.unmutedAccount')
    }
    emit('refreshAccountsList')
  } catch (e) {
    console.error(e)
    /* no await */ toast.say(mute
      ? formatIntl('intl.unableToMute', { error: (e.message || '') })
      : formatIntl('intl.unableToUnmute', { error: (e.message || '') })
    )
  }
}
