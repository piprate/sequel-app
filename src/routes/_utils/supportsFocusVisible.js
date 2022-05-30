import { thunk } from './thunk'
import { supportsSelector } from './supportsSelector'
import { isFirefoxPre90 } from './userAgent/isFirefoxPre90'

// Disabling in Firefox <90 due to bugs:
// https://bugzilla.mozilla.org/show_bug.cgi?id=1699154
// https://bugzilla.mozilla.org/show_bug.cgi?id=1711057
export const supportsFocusVisible = thunk(() => (!isFirefoxPre90() && supportsSelector(':focus-visible')))
