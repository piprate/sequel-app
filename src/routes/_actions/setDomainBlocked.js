import { blockDomain, unblockDomain } from '../_api/blockDomain'
import { toast } from '../_components/toast/toast'
import { updateRelationship } from './sparks'
import { formatIntl } from '../_utils/formatIntl'
import { currentInstance } from '../_store/local'
import { get } from 'svelte/store'
import { accessToken } from '../_store/instance'

export async function setDomainBlocked(sparkId, domain, block, toastOnSuccess) {
  const _currentInstance = currentInstance.get()
  const _accessToken = get(accessToken)
  try {
    if (block) {
      await blockDomain(_currentInstance, _accessToken, domain)
    } else {
      await unblockDomain(_currentInstance, _accessToken, domain)
    }
    await updateRelationship(sparkId)
    if (toastOnSuccess) {
      /* no await */
      toast.say(block ? 'intl.hidDomain' : 'intl.unhidDomain')
    }
  } catch (e) {
    console.error(e)
    /* no await */
    toast.say(
      block
        ? formatIntl('intl.unableToHideDomain', { error: e.message || '' })
        : formatIntl('intl.unableToUnhideDomain', { error: e.message || '' })
    )
  }
}
