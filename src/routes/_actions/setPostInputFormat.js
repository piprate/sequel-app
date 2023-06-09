import { setComposeData } from '../_store/local'

export function setPostInputFormat(realm, postInputFormatKey) {
  setComposeData(realm, { postInputFormat: postInputFormatKey })
}
