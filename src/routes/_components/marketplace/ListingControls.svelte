<script>
  import InfoAside from '../InfoAside.svelte'
  import { goto } from '$app/navigation'
  import { importShowBuyTokenDialog } from '../dialog/asyncDialogs/importShowBuyTokenDialog'
  import { isAuthenticated } from '../../_store/local'

  export let listing
  export let ourSpark

  $: id = listing.id
  $: sparkSelected = !!ourSpark
  $: moreToBuy = listing.availableEditions > 0
  $: buttonLabel = listing.price === 0.0 ? 'intl.claimButtonLabel' : 'intl.buyButtonLabel'

  async function onBuyClick () {
    const showDialog = await importShowBuyTokenDialog()
    showDialog(listing, async function (event) {
      console.log('NFT purchased', event.detail)
      setTimeout(() => {
        requestAnimationFrame(() => {
          goto('/assets')
        })
      })
    }, async function (event) {
      console.log('NFT purchase cancelled')
    }, async function (event) {
      console.log('Error when purchasing an NFT', event.detail)
    }, 'intl.buyTokenTitle')
  }
</script>

<div class="listing-controls">
    {#if $isAuthenticated}
        {#if sparkSelected}
            {#if moreToBuy}
                <button class="button primary text-button" on:click="{onBuyClick}">{buttonLabel}</button>
            {/if}
        {:else}
            <InfoAside className="buy-warning">
                {intl.modSparkNotSelected}
            </InfoAside>
        {/if}
    {:else}
        <InfoAside className="buy-warning">
            {intl.logInBeforeBuying}
        </InfoAside>
    {/if}
</div>

<style>
    .listing-controls {
        grid-area: controls;
        display: grid;
        margin: 0 5px;
        align-items: center;
        grid-template-columns: 1fr 1fr 1fr;
    }
    .text-button {
        margin: 10px 0;
        min-width: 140px;
        display: inline-block;
        text-align: center;
    }
    :global(.buy-warning) {
        margin: 20px 10px 0px 10px;
        grid-column-start: 1;
        grid-column-end: 4;
    }
</style>