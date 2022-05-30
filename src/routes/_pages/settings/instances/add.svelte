<script>
  import SettingsLayout from '../../../_components/settings/SettingsLayout.svelte'
  import { logInToInstance, handleOauthCode } from '../../../_actions/addInstance'
  import { testHasIndexedDB, testHasLocalStorage } from '../../../_utils/testStorage'
  import Tooltip from '../../../_components/Tooltip.svelte'
  import {
    isUserLoggedIn,
    instanceNameInSearch,
    logInToInstanceError,
    logInToInstanceErrorForText,
    logInToInstanceLoading
  } from '../../../_store/local'
  import {onMount} from "svelte";

  let hasIndexedDB = true;
  let hasLocalStorage = true;

  // suppress warnings
  const intl = {};

  $: pageLabel = $isUserLoggedIn ? 'intl.addInstance' : 'intl.logIn'

  function onSubmitInstance (event) {
    event.preventDefault()
    event.stopPropagation()
    logInToInstance()
  }

  onMount(async () => {
    const codeMatch = location.search.match(/code=([^&]+)/)
    if (codeMatch && !logInToInstanceLoading.get()) {  // TODO
      await handleOauthCode(codeMatch[1])
    }
    hasIndexedDB = testHasIndexedDB();
    hasLocalStorage = testHasLocalStorage();
  });
</script>

<SettingsLayout page='settings/instances/add' label={pageLabel}>
  <h1 id="add-an-instance-h1">{pageLabel}</h1>

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

      <label for="instanceInput">{intl.instanceColon}</label>
      <input type="text" inputmode="url" autocapitalize="none" spellcheck="false" id="instanceInput"
             bind:value='{$instanceNameInSearch}' placeholder="{intl.enterInstanceName}" required
      >
      <button class="primary" type="submit" id="submitButton"
              disabled={!$instanceNameInSearch || $logInToInstanceLoading}>
        {intl.logIn}
      </button>
    </form>
  </div>

  {#if !$isUserLoggedIn}
    <p>
      {intl.getAnInstancePre}
      <Tooltip
        text="{intl.getAnInstanceText}"
        tooltipText="{intl.getAnInstanceDescription}"
      />
      {intl.getAnInstancePost}
      <a rel="noopener" target="_blank" href="https://joinmastodon.org">{intl.joinMastodon}</a>
    </p>
  {/if}
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
  input {
    min-width: 70%;
    max-width: 100%;
    background-color: var(--input-bg);
  }

  label, input, button, :global(.add-new-instance-aside) {
    display: block;
    margin: 20px 5px;
  }

  @media (max-width: 767px) {
    input {
      min-width: 95%;
    }
  }

</style>
