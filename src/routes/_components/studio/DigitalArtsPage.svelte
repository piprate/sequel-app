<script>
  import LoadingPage from '../LoadingPage.svelte'
  import DigitalArtCard from './DigitalArtCard.svelte'
  import { onMount } from 'svelte'
  import { displayError } from '../../_actions/errors'

  export let fetcher
  export let actions = undefined

  let loading = true
  let artList = []

  function onClickAction (event) {
    const { action, artId } = event
    action.onclick(artId)
  }

  async function refreshListings () {
    artList = await fetcher()
    console.log('DIGITAL ART LIST', artList)
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

<div class="digital-art-page">
  <slot name="header"></slot>
    {#if loading}
        <LoadingPage />
    {:else if artList && artList.length}
        <ul class="digital-art-results art-grid">
            {#each artList as digitalArt}
                <DigitalArtCard
                        {digitalArt}
                        actions={actions}
                        on:click="{onClickAction}"
                />
            {/each}
        </ul>
    {:else}
        <slot name="is-empty"></slot>
    {/if}
    <slot name="footer"></slot>
</div>
<style>
    .digital-art-page {
        padding: 20px 20px;
        position: relative;
    }
    .digital-art-results {
        list-style: none;
        box-sizing: border-box;
        border: 1px solid var(--main-border);
        border-radius: 2px;
    }
    .art-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
        justify-items: center;
        grid-gap: 5px;
        grid-row-gap: 0px;
    }
    @media (max-width: 767px) {
        .digital-art-page {
            padding: 20px 10px;
        }
        .art-grid {
            grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
        }
    }
</style>
