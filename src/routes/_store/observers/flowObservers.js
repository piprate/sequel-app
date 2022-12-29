import { currentInstance, flowLoggedInAccount, isUserLoggedIn } from '../local'
import { get } from 'svelte/store'
import * as fcl from '@onflow/fcl'
import { configureFlow } from '../../_actions/flow'
import { inNode } from '../../_utils/browserOrNode'

export async function flowObservers () {
  if (inNode()) {
    return
  }

  if (get(isUserLoggedIn)) {
    configureFlow(currentInstance.get())
  }

  const currentUser = await fcl.currentUser().snapshot()

  if (currentUser.loggedIn) {
    flowLoggedInAccount.set(currentUser.addr)
  } else {
    flowLoggedInAccount.set('')
  }

  fcl.currentUser().subscribe(user => {
    console.log('USER event received', user)
    if (user.loggedIn) {
      flowLoggedInAccount.set(user.addr)
    } else {
      flowLoggedInAccount.set('')
    }
  })
}
