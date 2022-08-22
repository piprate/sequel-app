<script>
  import LoadingPage from '../LoadingPage.svelte'
  import ListingCard from './ListingCard.svelte'
  import { onMount } from 'svelte'
  import { displayError } from '../../_actions/errors'

  export let listingsFetcher
  export let listingActions = undefined

  let loading = true
  let listings = []

  function onClickAction (event) {
    const { action, listingId } = event
    action.onclick(listingId)
  }

  async function refreshListings () {
    listings = await listingsFetcher()
    console.log('LISTINGS', listings)
  }

  // TODO: paginate

  onMount(async () => {
    try {
      await refreshListings()
    } catch (e) {
      displayError(e)
    } finally {
      loading = false
    }
  })
</script>

<div class="listings-page">
    {#if loading}
        <LoadingPage />
    {:else if listings && listings.length}
        <slot name="header"></slot>
        <ul class="listings-results token-grid">
            {#each listings as listing}
                <ListingCard
                        {listing}
                        actions={listingActions}
                        on:click="{onClickAction}"
                />
            {/each}
        </ul>
        <slot name="footer"></slot>
    {:else}
        <slot name="is-empty"></slot>
    {/if}
</div>
<style>
    .listings-page {
        padding: 20px 20px;
        position: relative;
    }
    .listings-results {
        list-style: none;
        box-sizing: border-box;
        border: 1px solid var(--main-border);
        border-radius: 2px;
    }
    .token-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
        justify-items: center;
        grid-gap: 5px;
        grid-row-gap: 0px;
    }
    @media (max-width: 767px) {
        .listings-page {
            padding: 20px 10px;
        }
        .token-grid {
            grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
        }
    }
</style>
