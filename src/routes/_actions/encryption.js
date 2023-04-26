import nacl from 'tweetnacl'
import { binary_to_base58 as base58 } from 'base58-js'
import { Hash } from 'fast-sha256'
import { encodeBase64 } from 'tweetnacl-util'
import { sha512_256 } from 'js-sha512'
import { mnemonicToSeed } from 'web-bip39'

function doubleHasher (password) {
  const passwordBuffer = new TextEncoder().encode(password)
  let hasher = new Hash()
  hasher.update(passwordBuffer)
  const firstHash = hasher.digest()

  hasher = new Hash()
  hasher.update(firstHash)
  return hasher.digest()
}

export async function generateNewSeed (recoveryPhrase) {
  try {
    return (await mnemonicToSeed(recoveryPhrase, 'Piprate u5SPXFiNqfxYfZU2V23k4s9HsiN44UFhzPk5t9QLvNt')).slice(0, 32)
  } catch (error) {
    if (recoveryPhrase) {
      throw new Error('Invalid Recovery Phrase')
    }

    throw new Error(error)
  }
}

export function generateKey (seed) {
  return nacl.sign.keyPair.fromSeed(seed).secretKey
}

export function sign (privateKey, recoveryCode) {
  const recoveryCodeBuffer = new TextEncoder().encode(recoveryCode)
  const hasher = new Hash()
  hasher.update(recoveryCodeBuffer)

  return base58(nacl.sign.detached(hasher.digest(), privateKey))
}

export function encryptPassword (password) {
  return encodeBase64(doubleHasher(password))
}

export function generateManagedFromHostedKey (hostedKey) {
  return new Uint8Array(sha512_256.hmac.update('managed key', hostedKey).array())
}
