<script>
  import LoadingPage from './LoadingPage.svelte'
  import WorldSearchResult from './search/WorldSearchResult.svelte'
  import { onMount } from 'svelte'
  import { displayError } from '../_actions/errors'

  export let worldsFetcher
  export let worldActions = undefined

  let loading = true
  let worlds = []

  function onClickAction (event) {
    const { action, worldId } = event
    action.onclick(worldId)
  }

  async function refreshWorlds () {
    worlds = await worldsFetcher()
    console.log('WORLDS', worlds)
  }

  // TODO: paginate

  onMount(async () => {
    try {
      await refreshWorlds()
    } catch (e) {
      displayError(e)
    } finally {
      loading = false
    }
  })
</script>

<div class="worlds-page">
  {#if loading}
    <LoadingPage />
  {:else if worlds && worlds.length}
    <slot name="header"></slot>
    <ul class="worlds-results">
      {#each worlds as world}
        <WorldSearchResult
          {world}
          actions={worldActions}
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
  .worlds-page {
    padding: 20px 20px;
    position: relative;
  }
  .worlds-results {
    list-style: none;
    box-sizing: border-box;
    border: 1px solid var(--main-border);
    border-radius: 2px;
  }
  @media (max-width: 767px) {
    .worlds-page {
      padding: 20px 10px;
    }
  }
</style>
