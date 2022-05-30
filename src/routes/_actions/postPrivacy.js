import { setComposeData } from '../_store/local'

export function setPostPrivacy (realm, postPrivacyKey) {
  setComposeData(realm, { postPrivacy: postPrivacyKey })
}
