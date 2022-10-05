<script>
  import LoadingPage from './LoadingPage.svelte'
  import ErrorMessage from './ErrorMessage.svelte'
  import BubbleSearchResult from './search/BubbleSearchResult.svelte'
  import { onMount } from 'svelte'
  import { displayError } from '../_actions/errors'

  export let bubblesFetcher
  export let bubbleActions = undefined

  let loading = true
  let bubbles = []

  function onClickAction (event) {
    const { action, bubbleId } = event
    action.onclick(bubbleId)
  }

  async function refreshBubbles () {
    bubbles = await bubblesFetcher()
    console.log('BUBBLES', bubbles)
  }

  // TODO: paginate

  let loadError

  onMount(async () => {
    try {
      await refreshBubbles()
    } catch (e) {
      console.error(e)
      displayError(e)
      loadError = 'intl.unableToLoad'
    } finally {
      loading = false
    }
  })
</script>

<div class="bubbles-page">
  {#if loading}
    <LoadingPage />
  {:else if bubbles && bubbles.length}
    <slot name="header"></slot>
    <ul class="bubbles-results">
      {#each bubbles as bubble}
        <BubbleSearchResult
          {bubble}
          actions={bubbleActions}
          on:click="{onClickAction}"
        />
      {/each}
    </ul>
    <slot name="footer"></slot>
  {:else if loadError}
    <slot name="header"></slot>
    <ErrorMessage error={loadError} />
  {:else}
    <slot name="is-empty"></slot>
  {/if}
</div>
<style>
  .bubbles-page {
    padding: 20px 20px;
    position: relative;
  }
  .bubbles-results {
    list-style: none;
    box-sizing: border-box;
    border: 1px solid var(--main-border);
    border-radius: 2px;
  }
  @media (max-width: 767px) {
    .bubbles-page {
      padding: 20px 10px;
    }
  }
</style>
