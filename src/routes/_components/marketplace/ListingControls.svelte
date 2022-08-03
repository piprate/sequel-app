<script>
  import { importShowBuyTokenDialog } from '../dialog/asyncDialogs/importShowBuyTokenDialog'

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
    }, async function (event) {
      console.log('NFT purchase cancelled')
    }, async function (event) {
      console.log('Error when purchasing an NFT', event.detail)
    }, 'intl.buyTokenTitle')
  }
</script>

<div class="listing-controls">
    {#if moreToBuy}
        <button class="button primary text-button" on:click="{onBuyClick}">{buttonLabel}</button>
    {/if}
</div>

<style>
    .listing-controls {
        grid-area: controls;
        display: grid;
        margin: 0 5px;
        align-items: center;
        grid-template-columns: 1fr 1fr 1fr min-content;
    }
    .text-button {
        margin: 10px 0;
        min-width: 140px;
        display: inline-block;
        text-align: center;
    }
</style>