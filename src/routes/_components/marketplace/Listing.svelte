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

  export let listing
  export let ourSpark

  $: listingName = (listing && listing.name) || ''
  $: className = classname(
          'listing',
          $underlineLinks && 'underline-links'
  )
  $: profileForListing = formatIntl('intl.listingPage', { listing: listingName })

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
    grid-template-areas: "image      name"
                         "image      label"
                         "image      created"
                         "details    details"
                         "summary    summary"
                         "controls   controls"
                         "evergreen  evergreen";
    grid-template-columns: min-content auto;
    grid-template-rows: min-content 1fr;
    grid-column-gap: 10px;
    grid-row-gap: 5px;
    padding: 20px;
    justify-content: center;
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
      grid-template-areas: "image      name"
                           "image      label"
                           "image      created"
                           "details    details"
                           "summary    summary"
                           "controls   controls"
                           "evergreen  evergreen";
      grid-template-columns: min-content minmax(auto, 1fr);
      grid-template-rows: min-content 1fr;
      padding: 10px;
    }
  }

  @media (max-width: 320px) {
  }

  @media (max-width: 240px) {
    .listing-grid {
      grid-template-areas: "image        name"
                           "image        label"
                           "created      created"
                           "membership   membership"
                           "summary      summary"
                           "evergreen    evergreen";
      grid-template-columns: min-content 1fr;
      grid-column-gap: 5px;
      grid-row-gap: 0;
    }
  }
</style>
