<script>
  import {
    currentInstance,
    flowLoggedInAccount,
    instanceUsers,
    isUserLoggedIn
  } from '../../_store/local'
  import { onMount } from 'svelte'
  import * as fcl from '@onflow/fcl'
  import { updateUserForInstance } from '../../_actions/instances'
  import { saveUser, userOperationError, userOperationInProgress } from '../../_actions/users'

  export let className = ''

  // suppress warnings
  const intl = {}

  $: user = ($instanceUsers && $instanceUsers[$currentInstance]) || {}
  $: flowAddress = (user && user.flow && user.flow.addr) || ''
  $: flowAddressMismatch = $flowLoggedInAccount && flowAddress && $flowLoggedInAccount !== flowAddress

  async function signUpWithFlow () {
    let out = await fcl.authenticate()

    if (!user.flow) {
      user.flow = {}
    }

    user.flow.addr = out.addr
    user.flow.network = await fcl.config().get('env', 'unknown')

    await saveUser(user)
  }

  async function logInWithFlow () {
    await fcl.authenticate()
  }

  async function switchFlowAccount () {
    fcl.unauthenticate()
    await signUpWithFlow()
  }

  onMount(async () => {
    if ($isUserLoggedIn) {
      await updateUserForInstance($currentInstance)
      console.log('USER RECORD', user)
    }
  })
</script>

{#if $userOperationError}
    <div class="error-box error-box-user-error" role="alert">
        {intl.errorShort} {@html $userOperationError}
    </div>
{/if}

<div class="{className}">
    <p>
        {intl.flowDescription}
    </p>

    {#if flowAddressMismatch}
        <div class="error-box" role="alert">
            {intl.flowMismatchWarning}
        </div>
        <button class="primary flow-setup-button" type="button" on:click={switchFlowAccount}>
            {intl.flowSwitchButton}
        </button>
    {/if}

    {#if !flowAddress && !$userOperationInProgress }
        <button class="primary flow-setup-button" type="button" on:click={signUpWithFlow}>
            {intl.flowSignUpButton}
        </button>
    {/if}
    {#if flowAddress && !$flowLoggedInAccount }
        <button class="primary flow-setup-button" type="button" on:click={logInWithFlow}>
            {intl.flowLogInButton}
        </button>
    {/if}
</div>

<style>
    .error-box {
        border: 2px solid var(--warn-color);
        border-radius: 2px;
        padding: 10px;
        font-size: 1.3em;
        margin: 5px;
        background-color: var(--main-bg);
    }

    .flow-setup-button {
        margin: 20px 5px;
    }
</style>
