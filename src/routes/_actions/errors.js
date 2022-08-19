import { toast } from '../_components/toast/toast'
import { formatIntl } from '../_utils/formatIntl'
import { logOutOfInstance } from './instances'
import { currentInstance } from '../_store/local'

export function displayError (e) {
  if (e.knownError && e.status === 401 && e.message === 'Token is expired') {
    const _currentInstance = currentInstance.get()
    setTimeout(() => {
      /* no await */
      logOutOfInstance(_currentInstance, formatIntl('intl.tokenExpired', { instance: _currentInstance }))
    }, 200)
  } else {
    /* no await */
    toast.say(formatIntl('intl.error', { error: (e.message || '') }))
  }
}