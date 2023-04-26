<script>
  import { getInstanceInfo } from '../../_api/instance'
  import { post } from '../../_utils/ajax'
  import { toast } from '../toast/toast'
  import { close } from '../dialog/helpers/closeDialog'
  import { goto } from '$app/navigation'
  import { encodeBase64 } from 'tweetnacl-util'
  import ErrorMessage from '../ErrorMessage.svelte'
  import LoadingSpinner from '../LoadingSpinner.svelte'
  import { getInstanceName, processURI } from '../../_utils/instance'
  import { encryptPassword, generateKey, generateNewSeed, sign, generateManagedFromHostedKey } from '../../_actions/encryption'

  export let dialogId
  export let email
  export let instance
  export let recoveryCode

  let recoveryPhrase
  let newPassword
  let confirmPassword
  let error
  let loading = false

  async function submitRecoveryCode () {
    try {
      error = null
      loading = true

      if (newPassword !== confirmPassword) {
        throw new Error('Passwords do not match')
      }

      const seed = await generateNewSeed(recoveryPhrase)
      const privateKey = generateKey(seed)
      const signature = sign(privateKey, recoveryCode)
      const encryptedPassword = encryptPassword(newPassword)
      const managedCryptoKey = encodeBase64(generateManagedFromHostedKey(seed))

      const payload = {
        userID: email,
        recoveryCode,
        signature,
        encryptedPassword,
        managedCryptoKey
      }

      const instanceName = getInstanceName(instance)
      const instanceInfo = await getInstanceInfo(instanceName)

      const chainlockerURI = processURI(instanceInfo.chainlockerURI)
      const url = `${chainlockerURI}/v1/recover-account`

      const response = await post(url, payload)

      if (response) {
        toast.say('Your password has been reset')
        close(dialogId)
        goto('/settings/instances/add')
      }
    } catch (err) {
      error = err
      console.log(error)
    } finally {
      loading = false
    }
  }
</script>

<ErrorMessage {error} />
<form on:submit|preventDefault={submitRecoveryCode}>
  <div class="field">
    <label for="recoveryPhrase">{intl.recoveryPhraseColon}</label>
    <textarea
      disabled={loading}
      autocapitalize="none"
      spellcheck="false"
      id="recoveryPhrase"
      name="recoveryPhrase"
      rows="4"
      bind:value={recoveryPhrase}
      placeholder="{intl.enterRecoveryPhrase}"
      required
    />
  </div>
  <div class="field">
    <label for="new-password">{intl.newPasswordColon}</label>
    <input
      disabled={loading}
      type="password"
      autocapitalize="none"
      spellcheck="false"
      id="new-password"
      name='newPassword'
      bind:value={newPassword}
      placeholder="{intl.enterNewPassword}"
      required
    />
  </div>
  <div class="field">
    <label for="confirm-password">{intl.confirmPasswordColon}</label>
    <input
      disabled={loading}
      type="password"
      autocapitalize="none"
      spellcheck="false"
      id="confirm-password"
      name="confirmPassword"
      bind:value={confirmPassword}
      placeholder="{intl.enterNewPassword}"
      required
    />
  </div>
  <button
    type="submit"
    class="primary"
    aria-labelledby="button-text"
    disabled={loading}
  >
    <span id="button-text">Submit</span>{' '}
    {#if loading}
      <LoadingSpinner size={20} maskStyle />
    {/if}
  </button>
</form>

<style>
  form {
    margin: 1rem 1.2rem;
  }

  .field {
    margin-bottom: 1rem;
  }

  button[type="submit"] {
    margin-top: 16px;
  }

  input,
  textarea {
    margin-top: 8px;
    width: 100%;
  }
</style>
