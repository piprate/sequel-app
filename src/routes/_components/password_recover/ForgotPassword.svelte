<script>
  import { getInstanceInfo } from '../../_api/instance'
  import { get } from '../../_utils/ajax'
  import { getInstanceName, processURI } from '../../_utils/instance'
  import ErrorMessage from '../ErrorMessage.svelte'
  import LoadingSpinner from '../LoadingSpinner.svelte'

  export let email
  export let setValues

  let instance = 'sequel.space'
  let error
  let loading = false

  let production = import.meta.env.PROD

  if (!production) {
    instance = 'localhost'
  }

  async function submitEmail () {
    try {
      error = null
      loading = true

      const instanceName = getInstanceName(instance)
      const instanceInfo = await getInstanceInfo(instanceName)

      const chainlockerURI = processURI(instanceInfo.chainlockerURI)

      const url = `${chainlockerURI}/v1/recovery-code?email=${email}`
      const res = await get(url)

      setValues({ recoveryCode: res.code, email, instance })
    } catch (err) {
      error = err
      console.log(error)
    } finally {
      loading = false
    }
  }
</script>

<ErrorMessage {error} />
<form on:submit|preventDefault={submitEmail}>
  <div class="field">
    <label for="email">{intl.emailColon}</label>
    <input
      disabled={loading}
      type="email"
      autocapitalize="none"
      spellcheck="false"
      id="email"
      bind:value={email}
      placeholder="{intl.enterInstanceEmail}"
      required
    />
  </div>
  <div class="field">
    <label for="instance">{intl.instanceColon}</label>
    <input
      disabled={loading}
      type="text"
      autocapitalize="none"
      spellcheck="false"
      id="instance"
      bind:value={instance}
      placeholder="{intl.enterInstanceName}"
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

  input {
    margin-top: 8px;
    width: 100%;
  }
</style>
