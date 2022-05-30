import { muteConversation, unmuteConversation } from '../_api/muteConversation'
import { toast } from '../_components/toast/toast'
import { database } from '../_database/database'
import { formatIntl } from '../_utils/formatIntl'
import { currentInstance } from "../_store/local";
import { get } from "svelte/store";
import { accessToken } from "../_store/instance";

export async function setConversationMuted (statusId, mute, toastOnSuccess) {
  const _currentInstance = currentInstance.get();
  const _accessToken = get(accessToken);
  try {
    if (mute) {
      await muteConversation(_currentInstance, _accessToken, statusId)
    } else {
      await unmuteConversation(_currentInstance, _accessToken, statusId)
    }
    await database.setStatusMuted(_currentInstance, statusId, mute)
    if (toastOnSuccess) {
      /* no await */ toast.say(mute ? 'intl.mutedConversation' : 'intl.unmutedConversation')
    }
  } catch (e) {
    console.error(e)
    /* no await */ toast.say(mute
      ? formatIntl('intl.unableToMuteConversation', { error: (e.message || '') })
      : formatIntl('intl.unableToUnmuteConversation', { error: (e.message || '') })
    )
  }
}
