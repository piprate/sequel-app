<script>
  import Payments from './Payments.svelte'
  import SparkRole from '../SparkRole.svelte'
  import { createEventDispatcher } from 'svelte'
  import { formatIntl } from '../../_utils/formatIntl'
  import { currentSpark } from '../../_store/instance'

  export let listing

  const dispatch = createEventDispatcher()

  let numEditions = 1
  const editionsList = [...new Array(listing.availableEditions)].map((_, i) => i + 1)

  $: primarySale = listing.listingType === 'primary'
  $: selectEditions = listing.availableEditions > 1
  $: secondarySale = listing.listingType === 'secondary'

  function onConfirmClick(e) {
    dispatch('confirm', numEditions)
  }

  function onCancelClick(e) {
    dispatch('cancel')
  }
</script>

{#if primarySale}
  <div class="buyer-panel">
    <SparkRole spark={$currentSpark} roleLabel="Buyer" />
  </div>
  <div class="notice">
    <div class="invitation">
      {@html formatIntl('intl.confirmationNotice', { token: listing.object.name })}
    </div>
    {#if selectEditions}
      <select bind:value={numEditions}>
        {#each editionsList as edition}
          <option value={edition}>
            {edition}
          </option>
        {/each}
      </select> edition(s)
    {/if}
    <Payments {listing} {numEditions} />
    <button class="button primary text-button" on:click={onConfirmClick}>{intl.confirmButton}</button>
    <button class="button primary text-button" on:click={onCancelClick}>{intl.cancel}</button>
  </div>
{:else if secondarySale}
  <p>Secondary sales not supported.</p>
  <Payments {listing} />
  <button class="button primary text-button" on:click={onCancelClick}>{intl.cancel}</button>
{/if}

<style>
  .buyer-panel {
    margin: 10px;
  }

  .notice {
    margin: 10px 10px 10px 5px;
    grid-area: content;
    word-wrap: break-word;
    overflow: hidden;
    white-space: pre-wrap;
    font-size: 0.9em;
  }

  .invitation {
    margin: 5px 0 10px 0;
    font-size: 1em;
  }

  .text-button {
    margin: 10px 0;
    min-width: 140px;
    display: inline-block;
    text-align: center;
  }
</style>
