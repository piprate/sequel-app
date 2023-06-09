import { thunk } from './thunk'
import urlRegexSource from './urlRegexSource'

export const urlRegex = thunk(() => {
  // this is provided at build time to avoid having a lot of runtime code just to build
  // a static regex
  const urlRegex = urlRegexSource()

  return urlRegex.toString()
})
