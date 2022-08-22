<script>
  import LoadingPage from '../LoadingPage.svelte'
  import DigitalArtTokenCard from './DigitalArtTokenCard.svelte'
  import { onMount } from 'svelte'
  import { displayError } from '../../_actions/errors'

  export let fetcher
  export let actions = undefined

  let loading = true
  let tokens = []

  function onClickAction (event) {
    const { action, tokenId } = event
    action.onclick(tokenId)
  }

  async function refreshListings () {
    tokens = await fetcher()
    console.log('DIGITAL ART TOKENS', tokens)
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

<div class="tokens-page">
    {#if loading}
        <LoadingPage />
    {:else if tokens && tokens.length}
        <slot name="header"></slot>
        <ul class="tokens-results token-grid">
            {#each tokens as token}
                <DigitalArtTokenCard
                        {token}
                        {actions}
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
    .tokens-page {
        padding: 20px 20px;
        position: relative;
    }
    .tokens-results {
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
        .tokens-page {
            padding: 20px 10px;
        }
        .token-grid {
            grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
        }
    }
</style>
