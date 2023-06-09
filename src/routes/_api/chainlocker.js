import { Hash } from 'fast-sha256'
import { post, WRITE_TIMEOUT } from '../_utils/ajax'

function arrayToBase64(array) {
  let binary = ''
  const bytes = [].slice.call(array)
  bytes.forEach((b) => (binary += String.fromCharCode(b)))
  return window.btoa(binary)
}

function doubleHashPassword(password) {
  const passwordBuffer = new TextEncoder().encode(password)
  let hasher = new Hash()
  hasher.update(passwordBuffer)
  const firstHash = hasher.digest()
  hasher = new Hash()
  hasher.update(firstHash)
  return arrayToBase64(hasher.digest())
}

export function register(chainLockerURI, email, password, registrationCode) {
  if (chainLockerURI.startsWith('https+insecure:')) {
    chainLockerURI = chainLockerURI.replace('https+insecure:', 'https:')
  }

  const passwordHash = doubleHashPassword(password)

  const url = `${chainLockerURI}/v1/register`
  return post(
    url,
    {
      account: {
        type: 'Account',
        level: 2,
        email: email,
        encryptedPassword: passwordHash,
        name: email
      },
      registrationCode: registrationCode
    },
    null,
    { timeout: WRITE_TIMEOUT }
  )
}

export function authenticate(chainLockerURI, email, password) {
  if (chainLockerURI.startsWith('https+insecure:')) {
    chainLockerURI = chainLockerURI.replace('https+insecure:', 'https:')
  }

  const passwordHash = doubleHashPassword(password)

  const url = `${chainLockerURI}/v1/authenticate`
  return post(
    url,
    {
      username: email,
      password: passwordHash
    },
    null,
    { timeout: WRITE_TIMEOUT }
  )
}
