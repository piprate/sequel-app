import { currentPage } from '../_store/navigation'
import { focusSearchInput } from '../_store/local'
import { goto } from '@sapper/app'
import { emit } from '../_utils/eventBus'

// Go to the search page, and also focus the search input. For accessibility
// and usability reasons, this only happens on pressing these particular hotkeys.
export async function goToSearch () {
  if (currentPage.get() === 'search') {
    emit('focusSearchInput')
  } else {
    focusSearchInput.set(true)
    goto('/search')
  }
}
