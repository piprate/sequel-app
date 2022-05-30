import { blockAccount, unblockAccount } from '../_api/block'
import { toast } from '../_components/toast/toast'
import { updateLocalRelationship } from './accounts'
import { emit } from '../_utils/eventBus'
import { formatIntl } from '../_utils/formatIntl'
import { currentInstance } from "../_store/local";
import { get } from "svelte/store";
import { accessToken } from "../_store/instance";

export async function setAccountBlocked (accountId, block, toastOnSuccess) {
  const _currentInstance = currentInstance.get();
  const _accessToken = get(accessToken);
  try {
    let relationship
    if (block) {
      relationship = await blockAccount(_currentInstance, _accessToken, accountId)
    } else {
      relationship = await unblockAccount(_currentInstance, _accessToken, accountId)
    }
    await updateLocalRelationship(_currentInstance, accountId, relationship)
    if (toastOnSuccess) {
      if (block) {
        /* no await */ toast.say('intl.blockedAccount')
      } else {
        /* no await */ toast.say('intl.unblockedAccount')
      }
    }
    emit('refreshAccountsList')
  } catch (e) {
    console.error(e)
    /* no await */ toast.say(block
      ? formatIntl('intl.unableToBlock', { block: !!block, error: (e.message || '') })
      : formatIntl('intl.unableToUnblock', { error: (e.message || '') })
    )
  }
}
