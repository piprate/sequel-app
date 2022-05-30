<script>
  import SettingsLayout from '../../../_components/settings/SettingsLayout.svelte'
  import { logInToInstance } from '../../../_actions/addInstance'
  import { testHasIndexedDB, testHasLocalStorage } from '../../../_utils/testStorage'
  import {
    instanceNameInSearch,
    isUserLoggedIn,
    logInToInstanceError,
    logInToInstanceErrorForText,
    logInToInstanceLoading
  } from '../../../_store/local'
  import { onMount } from 'svelte'

  let hasIndexedDB = true
  let hasLocalStorage = true

  $logInToInstanceLoading = false
  $logInToInstanceError = null
  $instanceNameInSearch = 'sequel.space'

  let production = process.env.NODE_ENV === 'production'

  if (!production) {
    $instanceNameInSearch = 'localhost'
  }

  // suppress warnings
  export let params
  params = undefined
  const intl = {}

  $: showInstance = $isUserLoggedIn || !production

  function onSubmitInstance (event) {
    event.preventDefault()
    event.stopPropagation()

    logInToInstance('', '')
  }

  onMount(async () => {
    hasIndexedDB = testHasIndexedDB()
    hasLocalStorage = testHasLocalStorage()
  })
</script>

<SettingsLayout page='settings/instances/visit' label={'intl.visitorBreadcrumb'}>
  <h1 id="add-an-instance-h1">{'intl.visitorTitle'}</h1>
  <div class="add-new-instance">
    <form on:submit='{onSubmitInstance}' aria-labelledby="add-an-instance-h1">

      {#if !hasIndexedDB || !hasLocalStorage}
        <div class="form-error form-error-user-error" role="alert">
          {intl.storageError}
        </div>
      {/if}

      {#if $logInToInstanceError && $logInToInstanceErrorForText === $instanceNameInSearch}
        <div class="form-error form-error-user-error" role="alert">
          {intl.errorShort} {@html $logInToInstanceError}
        </div>
      {/if}

      <noscript>
        <div class="form-error" role="alert">
          {intl.javaScriptError}
        </div>
      </noscript>

      <div class="notice">
        {intl.visitorNotice}
      </div>

      {#if showInstance}
        <label for="instanceInput">{intl.instanceColon}</label>
        <input type="text" inputmode="url" autocapitalize="none" spellcheck="false" id="instanceInput"
               bind:value='{$instanceNameInSearch}' placeholder="{intl.enterInstanceName}" required
        >
      {/if}

      <br/>

      <div class="notice">
        {intl.visitorLegalNotice}
      </div>

      <button class="primary inline-button" type="submit" id="submitButton">
        {intl.continueAsVisitor}
      </button>
      <span class="register-option">or <a href="/settings/instances/register">{'intl.signUp'}</a></span>
    </form>
  </div>
</SettingsLayout>
<style>
  .add-new-instance {
    background: var(--form-bg);
    padding: 5px 10px 15px;
    margin: 20px auto;
    border: 1px solid var(--form-border);
    border-radius: 4px;
  }

  .form-error {
    border: 2px solid var(--warn-color);
    border-radius: 2px;
    padding: 10px;
    font-size: 1.3em;
    margin: 5px;
    background-color: var(--main-bg);
  }

  input[type="text"] {
    min-width: 70%;
    max-width: 100%;
    background-color: var(--input-bg);
  }

  label, input, button, :global(.add-new-instance-aside) {
    display: block;
    margin: 20px 5px;
  }

  .inline-button {
    display: inline;
  }

  .register-option {
    font-size: 1.1em;
  }

  .notice {
    margin: 5px;
    font-size: 1.2em;
    color: var(--deemphasized-text-color);
    align-items: center;
  }

  @media (max-width: 767px) {
    input[type="text"] {
      min-width: 95%;
    }
  }

</style>
