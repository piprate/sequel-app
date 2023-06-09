import { describe, it, assert } from 'vitest'
import { render } from '@testing-library/svelte'
import { encryptPassword, generateKey, generateNewSeed, sign } from '../../_actions/encryption'
import { binary_to_base58 as base58, base58_to_binary as binary } from 'base58-js'
import RecoverPhrase from '../password_recover/RecoveryPhrase.svelte'

describe('RecoverPhrase.svelte', () => {
  it('renders the RecoverPhrase Component', async () => {
    const result = render(RecoverPhrase, {
      dialogId: 1,
      email: 'test@example.com',
      instance: 'sequeltest.piprate.com',
      recoveryCode: '53QPUKdVDjLEbxZA3BZWT7oLpsD1VjqGA7XnN3T21vcV'
    })

    assert.isDefined(await result.findAllByText('Recovery Phrase:'))
  })

  it('Generates a private key', async () => {
    const seed = binary('446ZHDoHFsXFfAPWe3YbAecm4D3B1xty9TNFnhd4U7L8')
    const privateKey = generateKey(seed)
    const privateKeyInBase58 = base58(privateKey)
    assert.strictEqual(
      privateKeyInBase58,
      'ucHoMKY1EVgGrEMg3aQejMDQvq6hrLcxSZ27eEvK3V3iPv4nxukQ7eLyMK4jGmjkRZpueFmChXNsEV3eawvYbHc'
    )
  })

  it('Generates signature', async () => {
    const privateKeyInBase58 = 'ucHoMKY1EVgGrEMg3aQejMDQvq6hrLcxSZ27eEvK3V3iPv4nxukQ7eLyMK4jGmjkRZpueFmChXNsEV3eawvYbHc'
    const privateKey = binary(privateKeyInBase58)
    const recoveryCode = '53QPUKdVDjLEbxZA3BZWT7oLpsD1VjqGA7XnN3T21vcV'

    const signature = sign(privateKey, recoveryCode)
    assert.strictEqual(
      signature,
      'D872hDxdZaxqnfinC54V1ngr99avEbDu13vCAFgMhYL5VkUumFXc5NiVxtfFPQujAbsKXrmQ38jJ57qu9nQFbLn'
    )
  })

  it('Encrypts password', async () => {
    const newPassword = 'new_password'
    const encryptedPassword = encryptPassword(newPassword)
    assert.strictEqual(encryptedPassword, 'lx0jHs83Jhp/KAeZ7O1Quziebie9rUeMyPUfrwkusfI=')
  })
})
