<script>
  import LoadingPage from '../LoadingPage.svelte'
  import ReleaseCard from './ReleaseCard.svelte'
  import { onMount } from 'svelte'
  import { displayError } from '../../_actions/errors'

  export let releasesFetcher
  export let releaseActions = undefined

  let loading = true
  let releases = []

  function onClickAction(event) {
    const { action, releaseId } = event
    action.onclick(releaseId)
  }

  async function refreshReleases() {
    releases = await releasesFetcher()
    console.log('releases', releases)
  }

  // TODO: paginate

  onMount(async () => {
    try {
      await refreshReleases()
    } catch (e) {
      displayError(e)
    } finally {
      loading = false
    }
  })
</script>

<div class="releases-page">
  <slot name="header" />
  {#if loading}
    <LoadingPage />
  {:else if releases && releases.length}
    <ul class="releases-results release-grid">
      {#each releases as release}
        <ReleaseCard {release} actions={releaseActions} on:click={onClickAction} />
      {/each}
    </ul>
    <slot name="footer" />
  {:else}
    <slot name="is-empty" />
  {/if}
</div>

<style>
  .releases-page {
    padding: 20px 20px;
    position: relative;
  }
  .releases-results {
    list-style: none;
    box-sizing: border-box;
    border: 1px solid var(--main-border);
    border-radius: 2px;
  }
  .release-grid {
    justify-items: center;
    grid-gap: 5px;
    grid-row-gap: 0px;
  }
  @media (max-width: 767px) {
    .releases-page {
      padding: 20px 10px;
    }
  }
</style>
