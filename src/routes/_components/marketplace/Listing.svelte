<script>
  import ListingHeader from './ListingHeader.svelte'
  import ListingDetails from './ListingDetails.svelte'
  import ListingSummary from './ListingSummary.svelte'
  import { underlineLinks } from '../../_store/local'
  import { classname } from '../../_utils/classname'
  import { scheduleIdleTask } from '../../_utils/scheduleIdleTask'
  import { addEmojiTooltips } from '../../_utils/addEmojiTooltips'
  import { formatIntl } from '../../_utils/formatIntl'
  import { onMount } from 'svelte'
  import ListingControls from './ListingControls.svelte'
  import Payments from './Payments.svelte'
  import SparkRole from '../SparkRole.svelte'
  import Timestamp from '../Timestamp.svelte'
  import EvergreenProfile from './EvergreenProfile.svelte'
  import DigitalArtTokenDetails from '../digitalart/DigitalArtTokenDetails.svelte'
  import ListingPriceBanner from './ListingPriceBanner.svelte'
  import InfoAside from '../InfoAside.svelte'

  export let listing
  export let ourSpark

  $: listingName = (listing && listing.name) || ''
  $: className = classname(
          'listing',
          $underlineLinks && 'underline-links'
  )
  $: profileForListing = formatIntl('intl.listingPage', { listing: listingName })
  $: displaySeller = !(listing.artistRef && listing.sellerRef && listing.artistRef.id === listing.sellerRef.id)
  $: displayBuyer = !!listing.buyerRef
  $: scheduledForSale = listing.status === 'scheduled' || listing.status === 'draft'
  $: availableForSale = listing.status === 'active'
  $: sold = listing.status === 'sold' || listing.status === 'sale_announced'

  const tokenForDisplay = {
    id: listing.tokenID,
    edition: listing.edition,
    object: listing.object
  }

  let listingProfile

  onMount(() => {
    scheduleIdleTask(() => addEmojiTooltips(listingProfile))
  })
</script>

<h1 class="sr-only">{profileForListing}</h1>
<div class={className}
     bind:this={listingProfile}>
  <div class="listing-grid-wrapper">
    <div class="listing-grid">
      <ListingHeader {listing} />
      <ListingSummary {listing} />
      <div class="listing-date listing-created">
        <Timestamp value={listing.createdAt} flavour="created" />
      </div>
      {#if sold }
        <div class="listing-date listing-sold">
          <Timestamp value={listing.lastUpdatedAt} flavour="sold" />
        </div>
      {/if}
      <div class="artist-panel">
        <SparkRole spark={listing.artistRef} roleLabel="Creator" />
      </div>
      {#if displaySeller }
      <div class="seller-panel">
        <SparkRole spark={listing.sellerRef} roleLabel="Seller" />
      </div>
      {/if}
      {#if displayBuyer }
        <div class="buyer-panel">
          <SparkRole spark={listing.buyerRef} roleLabel="Buyer" />
        </div>
      {/if}
      {#if availableForSale }
        <ListingDetails {listing} {ourSpark} />
        <ListingControls {listing} {ourSpark} />
        <Payments {listing} />
      {:else if scheduledForSale}
        <ListingDetails {listing} {ourSpark} />
        <InfoAside className="sale-warning">
          {intl.listingNotActive}
        </InfoAside>
        <Payments {listing} />
      {:else}
        <DigitalArtTokenDetails token={tokenForDisplay} {ourSpark} />
        <ListingPriceBanner {listing} />
      {/if}
      <EvergreenProfile profile={listing.object.evergreenProfile} />
    </div>
  </div>
</div>
<style>
  .listing {
    position: relative;
    background-size: cover;
    background-position: center;
  }

  .listing-grid {
    display: grid;
    grid-template-areas:
            "image     image"
            "name      name"
            "label     label"
            "summary   summary"
            "created   sold"
            "artist    seller"
            "buyer     buyer"
            "details   details"
            "controls  controls"
            "payments  payments"
            "evergreen evergreen";
    grid-template-rows: repeat(11, min-content);
    grid-column-gap: 10px;
    grid-row-gap: 5px;
    padding: 20px;
    justify-content: center;
  }

  .listing-date {
    font-size: 1.1em;
    color: var(--deemphasized-text-color);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    align-self: center;
  }

  .listing-created {
    grid-area: created;
  }

  .listing-sold {
    grid-area: sold;
  }

  .artist-panel {
    grid-area: artist;
    margin: 5px 5px 5px 0;
  }

  .seller-panel {
    grid-area: seller;
    margin: 5px 5px 5px 0;
  }

  .buyer-panel {
    grid-area: buyer;
    margin: 5px 5px 5px 0;
  }

  :global(.sale-warning) {
    grid-area: controls;
    margin: 20px 10px 0px 10px;
    grid-column-start: 1;
    grid-column-end: 4;
  }

  @supports (-webkit-backdrop-filter: blur(1px) saturate(1%)) or (backdrop-filter: blur(1px) saturate(1%)) {
    :global(.listing-grid-wrapper) {
      -webkit-backdrop-filter: blur(7px) saturate(110%);
      backdrop-filter: blur(7px) saturate(110%);
      background-color: var(--listing-bg-backdrop-filter);
    }
  }

  @supports not ((-webkit-backdrop-filter: blur(1px) saturate(1%)) or (backdrop-filter: blur(1px) saturate(1%))) {
    :global(.listing-grid-wrapper) {
      background-color: var(--listing-bg);
    }
  }

  @media (max-width: 767px) {
    .listing-grid {
      display: grid;
      grid-template-areas:
            "image     image"
            "name      name"
            "label     label"
            "summary   summary"
            "created   sold"
            "artist    seller"
            "buyer     buyer"
            "details   details"
            "controls  controls"
            "payments  payments"
            "evergreen evergreen";
      grid-template-rows: repeat(11, min-content);
      padding: 10px;
    }
    .listing-date {
      font-size: 1.0em;
      align-self: flex-start;
    }
  }

  @media (max-width: 400px) {
    .listing-grid {
      grid-template-areas:
              "image"
              "name"
              "label"
              "summary"
              "created"
              "sold"
              "artist"
              "seller"
              "buyer"
              "details"
              "controls"
              "payments"
              "evergreen";
      grid-template-rows: repeat(13, min-content);
      grid-column-gap: 5px;
      grid-row-gap: 0;
    }
  }
</style>
