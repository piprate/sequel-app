<script>
  import SettingsLayout from '../../../_components/settings/SettingsLayout.svelte'
  import FreeTextLayout from '../../../_components/FreeTextLayout.svelte'
  import { goto } from '@sapper/app'
  import { registerInInstance } from '../../../_actions/addInstance'
  import { testHasIndexedDB, testHasLocalStorage } from '../../../_utils/testStorage'
  import { validate } from 'email-validator'
  import {
    instanceNameInSearch,
    logInToInstanceError,
    logInToInstanceErrorForText,
    logInToInstanceLoading
  } from '../../../_store/local'
  import { onMount } from 'svelte'
  import { copyText } from '../../../_actions/copyText'

  // suppress warnings
  export let params
  params = undefined
  const intl = {}

  let hasIndexedDB = true
  let hasLocalStorage = true

  $logInToInstanceLoading = false
  $logInToInstanceError = null
  $instanceNameInSearch = 'sequel.space'

  let email = ''
  let password = ''
  let registrationCode = ''

  let production = process.env.NODE_ENV === 'production'
  let askForRegistrationCode = production && false

  let page = 'sign_up'
  let pageLabel = 'intl.signUp'

  let recoveryPhrase = ''

  let showInstance = !production

  if (!production) {
    $instanceNameInSearch = 'localhost'
    email = 'test@sequel'
    password = 'pass'
  }

  let password2 = password

  $: buttonDisabled = !$instanceNameInSearch || (!email || !password) || $logInToInstanceLoading

  async function onSubmitForm (event) {
    event.preventDefault()
    event.stopPropagation()

    if (production && !validate(email)) {
      $logInToInstanceError = new Error('intl.invalidEmail')
      $logInToInstanceErrorForText = $instanceNameInSearch
      return
    }

    if (password !== password2) {
      $logInToInstanceError = new Error('intl.passwordMismatch')
      $logInToInstanceErrorForText = $instanceNameInSearch
      return
    }

    recoveryPhrase = await registerInInstance(email, password, registrationCode)
    if (recoveryPhrase) {
      page = 'recovery_phrase'
    }
  }

  async function onCopyRecoveryPhrase () {
    await copyText(recoveryPhrase)
  }

  function onContinue () {
    // go to Flow setup page
    goto('/settings/flow?new')
  }

  function onChangeInstance () {
    showInstance = true
  }

  onMount(async () => {
    hasIndexedDB = testHasIndexedDB()
    hasLocalStorage = testHasLocalStorage()
  })
</script>

{#if page === 'sign_up'}
  <SettingsLayout page='settings/instances/register' label={pageLabel}>
    <h1 id="sign-up-h1">{pageLabel}</h1>
    <div class="sign-up">
      <form on:submit='{onSubmitForm}' aria-labelledby="sign-up-h1">

        {#if !hasIndexedDB || !hasLocalStorage}
          <div class="form-error form-error-user-error" role="alert">
            {intl.storageError}
          </div>
        {/if}

        {#if $logInToInstanceError && $logInToInstanceErrorForText === $instanceNameInSearch}
          <div class="form-error form-error-user-error" role="alert">
            {@html $logInToInstanceError}
          </div>
        {/if}

        <noscript>
          <div class="form-error" role="alert">
            {intl.javaScriptError}
          </div>
        </noscript>

        <label for="email">{intl.emailColon}</label>
        <input type="text" inputmode="email" autocapitalize="none" spellcheck="false" id="email"
               bind:value='{email}' placeholder="{intl.enterInstanceEmail}" required
        >
        <label for="password">{intl.passwordColon}</label>
        <input type="password" inputmode="text" autocapitalize="none" spellcheck="false" id="password"
               bind:value='{password}' placeholder="{intl.enterInstancePassword}" required
        >
        <label for="password2">{intl.confirmPasswordColon}</label>
        <input type="password" inputmode="text" autocapitalize="none" spellcheck="false" id="password2"
               bind:value='{password2}' placeholder="{intl.confirmInstancePassword}" required
        >
        {#if showInstance}
          <label for="instanceInput">{intl.instanceColon}</label>
          <input type="text" inputmode="url" autocapitalize="none" spellcheck="false" id="instanceInput"
                 bind:value='{$instanceNameInSearch}' placeholder="{intl.enterInstanceName}" required
          >
        {:else}
          <div on:click={onChangeInstance} class="change-instance-link">{'intl.changeInstance'}</div>
        {/if}
        {#if askForRegistrationCode}
          <label for="code">{intl.registrationCodeColon}</label>
          <div class="legal-notice">
            {intl.betaNotice}
          </div>
          <input type="text" inputmode="text" autocapitalize="characters" spellcheck="false" id="code"
                 bind:value='{registrationCode}' placeholder="{intl.enterRegistrationCode}"
          >
        {:else}
          <div class="legal-notice">
            {intl.betaNoticeNoCode}
          </div>
        {/if}
        <button class="primary inline-button" type="submit" id="submitButton" disabled={buttonDisabled}>
          {intl.signUp}
        </button>
        <span class="register-option">or <a sapper:prefetch href="/settings/instances/visit">{'intl.continueAsVisitorLink'}</a></span>

        <div class="legal-notice">
          {intl.signUpLegalNotice}
        </div>
      </form>
    </div>
  </SettingsLayout>
{:else if page === 'recovery_phrase' }
  <FreeTextLayout>
    <h1>{intl.recoveryPhraseWarning}</h1>

    <p>{intl.saveRecoveryPhrase}</p>

    <div class="recovery-phrase" role="alert">
      {recoveryPhrase}
    </div>
    <div class="button-panel">
      <button class="primary" on:click="{onCopyRecoveryPhrase}">
        {intl.copy}
      </button>
      <button class="primary" on:click="{onContinue}">
        {intl.continue}
      </button>
    </div>
  </FreeTextLayout>
{/if}
<style>
  .sign-up {
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

  label, input, button, :global(.sign-up-aside) {
    display: block;
    margin: 20px 5px;
  }

  .legal-notice {
    margin: 5px;
    font-size: 1.2em;
    color: var(--deemphasized-text-color);
    align-items: center;
  }

  .inline-button {
    display: inline;
  }

  .register-option {
    font-size: 1.1em;
  }

  .recovery-phrase {
    color: var(--warning-color);
    border: 2px solid var(--toast-border);
    border-radius: 2px;
    padding: 10px;
    font-size: 1.3em;
    background-color: var(--main-bg);
  }

  .button-panel {
    display: flex;
  }

  .change-instance-link {
    color: var(--anchor-text);
    text-decoration: underline;
    cursor: pointer;
    margin: 20px 5px;
  }

  @media (max-width: 767px) {
    input[type="text"] {
      min-width: 95%;
    }
  }

</style>
