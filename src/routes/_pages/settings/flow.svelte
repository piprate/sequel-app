<script>
  import SettingsLayout from '../../_components/settings/SettingsLayout.svelte'
  import {
    currentInstance,
    flowLoggedInAccount,
    instanceUsers,
    isUserLoggedIn,
    redirectToPage
  } from '../../_store/local'
  import { onMount } from 'svelte'
  import * as fcl from '@onflow/fcl'
  import { updateUserForInstance } from '../../_actions/instances'
  import { saveUser, userOperationError, userOperationInProgress } from '../../_actions/users'
  import {
    disconnectFromFlow,
    getFlowBalance,
    getFUSDBalance,
    getRoyaltyVaultTypes,
    setupRoyaltyReceiver
  } from '../../_actions/flow'
  import { goto } from '@sapper/app'
  import { toast } from '../../_components/toast/toast'
  import { formatIntl } from '../../_utils/formatIntl'

  // suppress warnings
  const intl = {}

  export let params

  let flowBalance = -1
  let fusdBalance = -1
  let royaltyReceiverVaults = []

  $: newUser = params.newUser
  $: user = ($instanceUsers && $instanceUsers[$currentInstance]) || {}
  $: flowAddress = (user && user.flow && user.flow.addr) || ''
  $: flowNetwork = (user && user.flow && user.flow.network) || ''
  $: displayFlowBalance = flowBalance < 0 ? '' : `₣${flowBalance}`
  $: displayFUSDBalance = fusdBalance < 0 ? '' : `$${fusdBalance}`
  $: royaltyReceivers = royaltyReceiverVaults ? royaltyReceiverVaults.join(', ') : ''
  $: flowAddressMismatch = $flowLoggedInAccount && flowAddress && $flowLoggedInAccount !== flowAddress
  $: nextStepLabel = $flowLoggedInAccount ? 'intl.flowFinish' : 'intl.flowSkipStep'

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

  async function loadAccountInfo (addr) {
    if (!addr) {
      return
    }

    flowBalance = await getFlowBalance(addr)
    fusdBalance = await getFUSDBalance(addr)
    const vaultTypes = await getRoyaltyVaultTypes(addr)
    royaltyReceiverVaults = []
    vaultTypes.forEach((vaultType) => {
      if (vaultType.typeID.includes('FlowToken')) {
        royaltyReceiverVaults.push("Flow")
      }
      if (vaultType.typeID.includes('FUSD')) {
        royaltyReceiverVaults.push("FUSD")
      }
    })
  }

  async function executeSetupRoyaltyReceiver() {
    royaltyReceiverVaults = ['...waiting...']
    const res = await setupRoyaltyReceiver(flowAddress)
    if (res.result === 'completed') {
      await loadAccountInfo(flowAddress)
      /* no await */
      toast.say('intl.flowTransactionCompleted')
    } else if (res.result === 'failed') {
      /* no await */
      toast.say('intl.flowTransactionFailed')
      royaltyReceiverVaults = []
    }
  }

  function nextStep () {
    const _redirectToPage = $redirectToPage
    if (_redirectToPage) {
      $redirectToPage = ''
      goto(_redirectToPage)
    } else {
      goto('/')
    }
  }

  $: loadAccountInfo(flowAddress)

  onMount(async () => {
    if ($isUserLoggedIn) {
      await updateUserForInstance($currentInstance)
      console.log('USER RECORD', user)
    }
  })
</script>

<SettingsLayout page='settings/flow' label="{intl.flow}">
  <h1 id="sign-up-h1">{intl.flowSettings}</h1>

  {#if $userOperationError}
    <div class="error-box error-box-user-error" role="alert">
      {intl.errorShort} {@html $userOperationError}
    </div>
  {/if}

  {#if flowAddress }
    <div class="flow-account">
      <div class="flow-account-border"></div>
      <div class="acct-field-cell acct-field-name">
        {intl.flowAddress}
      </div>
      <div class="acct-field-cell acct-field-value">
        {flowAddress}
      </div>
      <div class="acct-field-cell acct-field-name">
        {intl.flowNetwork}
      </div>
      <div class="acct-field-cell acct-field-value">
        {flowNetwork}
      </div>
      <div class="acct-field-cell acct-field-name">
        {intl.flowBalance}
      </div>
      <div class="acct-field-cell acct-field-value">
        {displayFlowBalance}
      </div>
      <div class="acct-field-cell acct-field-name">
        {intl.fusdBalance}
      </div>
      <div class="acct-field-cell acct-field-value">
        {displayFUSDBalance}
      </div>
      <div class="acct-field-cell acct-field-name">
        {intl.royaltyReceivers}
      </div>
      <div class="acct-field-cell acct-field-value">
        {royaltyReceivers}
      </div>
      <div class="flow-account-border"></div>
    </div>
  {:else}
    <p>
      {intl.flowDescription}
    </p>
  {/if}
  {#if flowAddressMismatch}
    <div class="error-box" role="alert">
      {intl.flowMismatchWarning}
    </div>
    <button class="primary flow-setup-button" type="button" on:click={switchFlowAccount}>
      {intl.flowSwitchButton}
    </button>
  {/if}

  {#if $flowLoggedInAccount && royaltyReceiverVaults.length === 0 }
    <button class="primary flow-setup-button" type="button" on:click={executeSetupRoyaltyReceiver}>
      {intl.flowSetupRoyaltyReceiver}
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
  {#if $flowLoggedInAccount }
    <button class="primary flow-setup-button" type="button" on:click={disconnectFromFlow}>
      {intl.flowDisconnectButton}
    </button>
  {/if}
  {#if newUser }
    <button class="primary flow-setup-button" type="button" on:click={nextStep}>
      {nextStepLabel}
    </button>
  {/if}
</SettingsLayout>
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

  .flow-account {
    grid-area: meta;
    display: grid;
    grid-template-columns: auto 1fr;
    grid-row-gap: 5px;
    align-items: center;
    padding: 5px 5px;
  }

  .flow-account-border {
    height: 1px;
    width: 100%;
    grid-column: 1 / 3;
    background: var(--main-border);
    justify-self: center;
  }

  .acct-field-cell {
    word-wrap: break-word;
    overflow: hidden;
    white-space: pre-wrap;
    text-overflow: ellipsis;
    font-size: 1.1em;
  }

  .acct-field-name {
    padding: 10px 20px 10px 0;
    text-transform: uppercase;
    color: var(--deemphasized-text-color);
    position: relative;
    max-width: 300px;
  }

  .acct-field-value {
    padding: 10px 10px 10px 20px;
  }

  @media (max-width: 767px) {
    .flow-account {
      padding: 5px 5px;
    }
    .acct-field-cell {
      font-size: 1em;
    }
    .acct-field-name {
      padding: 5px 10px 5px 0;
      max-width: 40vw;
    }
    .acct-field-value {
      padding: 5px 10px 5px 10px;
    }
  }

</style>
