import { setComposeData } from '../_store/local'

export function enablePoll(realm) {
  setComposeData(realm, {
    poll: {
      options: ['', '']
    }
  })
}

export function disablePoll(realm) {
  setComposeData(realm, {
    poll: null
  })
}
