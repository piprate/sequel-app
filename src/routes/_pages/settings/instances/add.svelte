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
  import { importShowRecoverPasswordDialog } from '../../../_components/dialog/asyncDialogs/importShowForgotPasswordDialog'

  let hasIndexedDB = true
  let hasLocalStorage = true

  $logInToInstanceLoading = false
  $logInToInstanceError = null
  $instanceNameInSearch = 'sequel.space'

  let email = ''
  let password = ''
  let registrationCode = ''

  let production = import.meta.env.PROD

  if (!production) {
    $instanceNameInSearch = 'localhost'
    email = 'test@sequel'
    password = 'pass'
  }

  // suppress warnings
  export let params
  params = undefined
  const intl = {}

  let showInstance = !production

  $: pageLabel = $isUserLoggedIn ? 'intl.addInstance' : 'intl.logIn'
  $: buttonDisabled = !$instanceNameInSearch || !email || !password || $logInToInstanceLoading

  function onChangeInstance() {
    showInstance = true
  }

  async function forgotPassword() {
    const showRecoverPasswordDialog = await importShowRecoverPasswordDialog()
    showRecoverPasswordDialog(email)
  }

  function onSubmitInstance(event) {
    event.preventDefault()
    event.stopPropagation()

    logInToInstance(email, password)
  }

  onMount(async () => {
    hasIndexedDB = testHasIndexedDB()
    hasLocalStorage = testHasLocalStorage()
  })
</script>

<SettingsLayout page="settings/instances/add" label={pageLabel}>
  <h1 id="add-an-instance-h1">{pageLabel}</h1>
  <div class="add-new-instance">
    <form on:submit={onSubmitInstance} aria-labelledby="add-an-instance-h1">
      {#if !hasIndexedDB || !hasLocalStorage}
        <div class="form-error form-error-user-error" role="alert">
          {intl.storageError}
        </div>
      {/if}

      {#if $logInToInstanceError && $logInToInstanceErrorForText === $instanceNameInSearch}
        <div class="form-error form-error-user-error" role="alert">
          {intl.errorShort}
          {@html $logInToInstanceError}
        </div>
      {/if}

      <noscript>
        <div class="form-error" role="alert">
          {intl.javaScriptError}
        </div>
      </noscript>

      <label for="email">{intl.emailColon}</label>
      <input
        type="text"
        inputmode="email"
        autocapitalize="none"
        spellcheck="false"
        id="email"
        bind:value={email}
        placeholder={intl.enterInstanceEmail}
        required
      />
      <label for="password">{intl.passwordColon}</label>
      <input
        type="password"
        inputmode="url"
        autocapitalize="none"
        spellcheck="false"
        id="password"
        bind:value={password}
        placeholder={intl.enterInstancePassword}
        required
      />
      {#if showInstance}
        <label for="instanceInput">{intl.instanceColon}</label>
        <input
          type="text"
          inputmode="url"
          autocapitalize="none"
          spellcheck="false"
          id="instanceInput"
          bind:value={$instanceNameInSearch}
          placeholder={intl.enterInstanceName}
          required
        />
      {:else}
        <div on:click={onChangeInstance} class="change-instance-link">{'intl.changeInstance'}</div>
      {/if}
      <button class="primary inline-button" type="submit" id="submitButton" disabled={buttonDisabled}>
        {intl.logIn}
      </button>
      <span class="register-option">or <a href="/settings/instances/register">{'intl.signUp'}</a></span>
    </form>
    <p class="forgot-password"><a href="#forgot-password" on:click={forgotPassword}>{intl.forgotPassword}</a></p>
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
  input[type='text'] {
    min-width: 70%;
    max-width: 100%;
    background-color: var(--input-bg);
  }

  label,
  input,
  button,
  :global(.add-new-instance-aside) {
    display: block;
    margin: 20px 5px;
  }

  .inline-button {
    display: inline;
  }

  .register-option {
    font-size: 1.1em;
  }

  .forgot-password {
    font-size: 0.875rem;
  }

  .change-instance-link {
    color: var(--anchor-text);
    text-decoration: underline;
    cursor: pointer;
    margin: 20px 5px;
  }

  @media (max-width: 767px) {
    input[type='text'] {
      min-width: 95%;
    }
  }
</style>
