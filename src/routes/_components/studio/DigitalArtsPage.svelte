<script>
  import LoadingPage from '../LoadingPage.svelte'
  import DigitalArtCard from './DigitalArtCard.svelte'
  import { toast } from '../toast/toast'
  import { formatIntl } from '../../_utils/formatIntl'
  import { onMount } from 'svelte'

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
      /* no await */
      toast.say(formatIntl('intl.error', { error: (e.message || '') }))
    } finally {
      loading = false
    }
  })
</script>

<div class="digital-art-page">
    {#if loading}
        <LoadingPage />
    {:else if artList && artList.length}
        <slot name="header"></slot>
        <ul class="digital-art-results art-grid">
            {#each artList as digitalArt}
                <DigitalArtCard
                        {digitalArt}
                        actions={actions}
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
    }
</style>
