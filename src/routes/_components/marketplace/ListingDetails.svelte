<script>
  import IconButton from '../IconButton.svelte'
  import { importShowMarketplaceListingOptionsDialog } from '../dialog/asyncDialogs/importShowMarketplaceListingOptionsDialog'
  import { LOCALE } from '../../_static/intl'
  import { formatIntl } from '../../_utils/formatIntl'
  import { thunk } from '../../_utils/thunk'

  const numberFormat = thunk(() => new Intl.NumberFormat(LOCALE))

  export let listing
  export let ourSpark

  $: id = listing.id
  $: price = listing.price || 0
  $: currency = listing.currency || ''
  $: priceDisplay = listing.price === 0.0 ? 'intl.free' : `${numberFormat().format(price)} ${currency}`
  $: editionsDisplay = formatIntl('intl.editionsAvailable', {
    available: numberFormat().format(listing.availableEditions),
    total: numberFormat().format(listing.object.maxEdition)
  })
  $: soldDisplay = numberFormat().format(listing.totalEditions - listing.availableEditions)
  $: sparkSelected = !!ourSpark

  async function onMoreOptionsClick () {
    const showOptionsDialog = await importShowMarketplaceListingOptionsDialog()
    showOptionsDialog(listing, null, ourSpark)
  }
</script>

<h2 class="sr-only">{intl.statisticsAndMoreOptions}</h2>
<div class="listing-details">
  <div class="listing-details-item">
    <span class="listing-details-item-title">
      {intl.price}
    </span>
    <span class="listing-details-item-datum">
      {priceDisplay}
    </span>
  </div>
  <div class="listing-details-item">
    <span class="listing-details-item-title">
      {intl.editions}
    </span>
    <span class="listing-details-item-datum">
      {editionsDisplay}
    </span>
  </div>
  <div class="listing-details-item">
    <span class="listing-details-item-title">
      {intl.sold}
    </span>
    <span class="listing-details-item-datum">
      {soldDisplay}
    </span>
  </div>
  {#if sparkSelected }
  <div class="listing-more-options">
    <IconButton
      label="{intl.moreOptions}"
      href="#fa-bars"
      muted="true"
      on:click="{onMoreOptionsClick}"
    />
  </div>
  {/if}
</div>
<style>
  .listing-details {
    grid-area: details;
    display: grid;
    margin: 0 5px;
    align-items: center;
    grid-template-columns: 1fr 1fr 1fr min-content;
  }

  .listing-details-item {
    display: flex;
    flex-direction: row;
    padding: 5px;
    justify-content: center;
    font-size: 1.1em;
  }

  .listing-details-item:hover {
    text-decoration: none;
    background: var(--button-bg-hover);
    cursor: pointer;
  }

  .listing-details-item:active {
    background: var(--button-bg-active);
  }

  .listing-details-item-title {
    text-transform: uppercase;
    color: var(--deemphasized-text-color);
    margin-right: 5px;
  }

  .listing-details-item-datum {
    color: var(--body-text-color);
    margin-left: 5px;
    font-weight: 600;
    white-space: nowrap;
  }

  @media (max-width: 767px) {
    .listing-details-item {
      flex-direction: column;
      margin-left: 5px;
      margin-right: 5px;
    }

    .listing-details-item:last-child {
      margin-right: 0;
    }

    .listing-details-item:first-child {
      margin-left: 0;
    }

    .listing-details-item-title {
      margin-right: 0;
      text-align: center;
    }
    .listing-details-item-datum {
      margin-left: 0;
      text-align: center;
    }
    .listing-details-item {
      font-size: 1em;
    }
  }

  @media (max-width: 240px) {
    .listing-details {
      grid-template-columns: 1fr 1fr 1fr;
    }
    .listing-more-options {
      justify-self: flex-end;
      grid-column: 1 / 4;
    }
  }
</style>
