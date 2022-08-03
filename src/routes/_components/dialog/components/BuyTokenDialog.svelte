<script>
  import ModalDialog from './ModalDialog.svelte'
  import FlowConnect from '../../flow/FlowConnect.svelte'
  import { close } from '../helpers/closeDialog'
  import { createEventDispatcher } from 'svelte'
  import { currentInstance, flowLoggedInAccount, instanceUsers } from '../../../_store/local'
  import { currentSparkId } from '../../../_store/instance'
  import LoadingSpinner from '../../LoadingSpinner.svelte'
  import ConfirmTokenPurchase from '../../marketplace/ConfirmTokenPurchase.svelte'
  import { mintOnDemand } from '../../../_actions/flow'

  export let id
  export let listing
  export let label

  const dispatch = createEventDispatcher()

  let saleInProgress = false

  let title = label

  let screen = 'confirmation'

  $: user = ($instanceUsers && $instanceUsers[$currentInstance]) || {}
  $: flowAddress = (user && user.flow && user.flow.addr) || ''
  $: flowNetwork = (user && user.flow && user.flow.network) || ''
  $: flowAddressMismatch = $flowLoggedInAccount && flowAddress && $flowLoggedInAccount !== flowAddress
  $: notConnectedToFlow = !flowAddress || flowAddressMismatch || $flowLoggedInAccount !== flowAddress
  $: primarySale = listing.listingType === 'primary'
  $: secondarySale = listing.listingType === 'secondary'

  let errorMessage = ''

  const stageTitles = {
    'init_mod': 'intl.initModStatus',
    'open_wallet': 'intl.openWalletStatus',
    'tx_signing': 'intl.txSigningStatus',
    'wait_seal': 'intl.waitSealStatus',
    'tx_executed': 'intl.txExecutedStatus',
    'tx_sealed': 'intl.txSealedStatus',
    'confirm_sale': 'intl.confirmSaleStatus',
  }

  async function onConfirmClick (e) {
    const numEditions = e.detail

    if ($currentSparkId === "") {
      screen = 'error'
      title = 'intl.saleError'
      errorMessage = 'intl.modSparkNotSelected'
      return
    }

    saleInProgress = true
    title = 'intl.saleInProgress'

    let mod
    try {
      mod = await mintOnDemand(listing.id, numEditions, flowAddress, (stage) => {
        title = stageTitles[stage] || title
      })
    } finally {
      saleInProgress = false
    }

    if (mod.result === 'cancelled') {
      dispatch('cancel')
      close(id)
    } else if (mod.result === 'failed') {
      console.log("Transaction failed", mod.error)
      errorMessage = mod.error
      title = 'intl.saleError'
      screen = 'error'
    } else {
      title = 'intl.congratulations'
      screen = 'success'
    }
  }

  function onCancelClick (e) {
    dispatch('cancel')
    close(id)
  }

  function onOkClick (e) {
    dispatch('success', listing)
    close(id)
  }

  function onOkErrorClick (e) {
    dispatch('error', errorMessage)
    close(id)
  }
</script>

<ModalDialog
        {id}
        {label}
        {title}
        shrinkWidthToFit={false}
        background="var(--main-bg)"
>
  {#if notConnectedToFlow }
    <FlowConnect className="flow-sign-in-dialog" />
  {:else if saleInProgress }
    <div class="sale-in-progress">
      <LoadingSpinner />
    </div>
  {:else if screen === 'confirmation' }
    <ConfirmTokenPurchase {listing} on:confirm={onConfirmClick} on:cancel={onCancelClick} />
  {:else if screen === 'success' }
    <div class="purchase-successful">
      {intl.purchaseSuccessful}
    </div>
    <button class="button primary text-button" on:click="{onOkClick}">{intl.okay}</button>
  {:else if screen === 'error' }
    <div class="error-box" role="alert">
      {errorMessage}
    </div>
    <button class="button primary text-button" on:click="{onOkErrorClick}">{intl.okay}</button>
  {/if}
</ModalDialog>

<style>
  :global(.flow-sign-in-dialog) {
    margin: 20px;
  }

  .error-box {
    border: 2px solid var(--warn-color);
    border-radius: 2px;
    padding: 10px;
    font-size: 1.3em;
    margin: 5px;
    background-color: var(--main-bg);
  }

  .text-button {
    margin: 10px auto;
    min-width: 140px;
    display:block;
    text-align: center;
  }

  .sale-in-progress {
    height: 150px;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 50;
    transition: opacity 0.25s linear;
  }

  .purchase-successful {
    font-size: 1.2em;
    text-align: center;
    margin: 20px;
  }
</style>