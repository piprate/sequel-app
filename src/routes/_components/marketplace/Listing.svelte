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
  import CreatedAt from '../CreatedAt.svelte'

  export let listing
  export let ourSpark

  $: listingName = (listing && listing.name) || ''
  $: className = classname(
          'listing',
          $underlineLinks && 'underline-links'
  )
  $: profileForListing = formatIntl('intl.listingPage', { listing: listingName })
  $: displaySeller = !(listing.artistRef && listing.sellerRef && listing.artistRef.id === listing.sellerRef.id)

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
      <div class="listing-created">
        <CreatedAt createdAt={listing.createdAt} flavour="created" />
      </div>
      <div class="artist-panel">
        <SparkRole spark={listing.artistRef} roleLabel="Creator" />
      </div>
      {#if displaySeller }
      <div class="seller-panel">
        <SparkRole spark={listing.sellerRef} roleLabel="Seller" />
      </div>
      {/if}
      <ListingDetails {listing} {ourSpark} />
      <ListingControls {listing} {ourSpark} />
      <Payments {listing} />
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
            "created   created"
            "artist    seller"
            "details   details"
            "controls  controls"
            "evergreen evergreen";
    grid-template-rows: repeat(9, min-content);
    grid-column-gap: 10px;
    grid-row-gap: 5px;
    padding: 20px;
    justify-content: center;
  }

  .listing-created {
    grid-area: created;
    font-size: 1.1em;
    color: var(--deemphasized-text-color);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    align-self: center;
  }

  .artist-panel {
    grid-area: artist;
    margin: 5px 5px 0 0;
  }

  .seller-panel {
    grid-area: seller;
    margin: 5px 5px 0 0;
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
            "created   created"
            "artist    seller"
            "details   details"
            "controls  controls"
            "evergreen evergreen";
      grid-template-rows: repeat(9, min-content);
      padding: 10px;
    }
    .listing-created {
      font-size: 1.0em;
      align-self: flex-start;
    }
  }

  @media (max-width: 320px) {
  }

  @media (max-width: 240px) {
    .listing-grid {
      grid-template-areas:
              "image"
              "name"
              "label"
              "created"
              "summary"
              "artist"
              "seller"
              "details"
              "controls"
              "evergreen";
      grid-template-rows: repeat(10, min-content);
      grid-column-gap: 5px;
      grid-row-gap: 0;
    }
  }
</style>
