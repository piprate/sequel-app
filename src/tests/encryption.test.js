import { describe, it } from 'vitest'
import assert from 'assert'
import { decodeBase64, encodeBase64 } from 'tweetnacl-util'
import { generateManagedFromHostedKey } from '../routes/_actions/encryption.js'

describe('encryption tests', () => {
  it.concurrent('test generateManagedFromHostedKey', async () => {
    const cryptoKey = decodeBase64('SHMnfCxVCakBhsLkCBV6d6zNeYD9InP2b9KHs7tyZPw=')
    assert.deepStrictEqual(
      encodeBase64(generateManagedFromHostedKey(cryptoKey)),
      'kqIszHP4WwGJ8aoO8Dq+V8R8ECMTJyCcivNygJvFpCo='
    )
  })
})
