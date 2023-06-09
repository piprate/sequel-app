<script>
  import TokenMedia from './TokenMedia.svelte'
  import SearchResult from '../search/SearchResult.svelte'
  import IconButton from '../IconButton.svelte'
  import EntityDisplayName from '../EntityDisplayName.svelte'
  import { createEventDispatcher } from 'svelte'

  export let listing
  export let actions = undefined

  const dispatch = createEventDispatcher()

  $: id = listing.id
  $: summary = listing.object.description
  $: croppedSummary = summary ? (summary.length > 250 ? summary.substring(0, 250) + '...' : summary) : ''
  $: price = listing.price || 0
  $: priceText = price === 0 ? 'intl.free' : `${price} ${listing.currency}`
  $: tokenIDText = listing.listingType === 'primary' ? '' : `(#${listing.tokenID || 0})`

  function onButtonClick(event, action, listingId) {
    event.preventDefault()
    event.stopPropagation()
    dispatch('click', {
      action,
      listingId
    })
  }
</script>

<SearchResult href="/marketplace/{id}">
  <div class="listing-card">
    <div class="listing-card-image">
      <TokenMedia content={listing.object.content} size="wide" isLink={true} />
    </div>
    <div class="listing-card-name">
      <EntityDisplayName entity={listing.object} />
      {tokenIDText}
    </div>
    <div class="listing-card-artist">
      by <EntityDisplayName entity={listing.artistRef} />
    </div>
    <div class="listing-card-stats">
      Price: {priceText}
    </div>
    <div class="listing-card-summary">
      {croppedSummary}
    </div>
    {#if actions && actions.length}
      <div class="listing-card-buttons">
        {#each actions as action}
          <IconButton
            label={action.label}
            on:click={(event) => onButtonClick(event, action, listing.id)}
            href={action.icon}
            big="true"
          />
        {/each}
      </div>
    {/if}
  </div>
</SearchResult>

<style>
  .listing-card {
    display: grid;
    grid-template-areas:
      'image'
      'name'
      'artist'
      'summary'
      'stats'
      'buttons';
    grid-column-gap: 20px;
    grid-template-columns: 1fr;
    align-items: center;
  }
  :global(.listing-card-image) {
    grid-area: image;
  }
  :global(.listing-card-image img) {
    /*width: 100%;*/
  }
  .listing-card-name {
    grid-area: name;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 1.1em;
    width: 250px;
    margin-top: 5px;
  }
  .listing-card-artist {
    grid-area: artist;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .listing-card-stats {
    grid-area: stats;
    color: var(--very-deemphasized-text-color);
    margin-top: 5px;
  }
  .listing-card-summary {
    margin-top: 5px;
    grid-area: summary;
    color: var(--deemphasized-text-color);
    width: 250px;
  }
  .listing-card-buttons {
    grid-area: buttons;
    display: flex;
  }
  :global(.listing-card-buttons .icon-button) {
    margin-right: 20px;
  }
  :global(.listing-card-buttons .icon-button:last-child) {
    margin-right: 0;
  }
  @media (max-width: 767px) {
    .listing-card {
      grid-column-gap: 10px;
    }
    .listing-card-summary {
      width: 300px;
    }
    .listing-card-name {
      font-size: 1.2em;
      width: 300px;
    }
    :global(.listing-card-buttons .icon-button) {
      margin-right: 10px;
    }
  }
</style>
