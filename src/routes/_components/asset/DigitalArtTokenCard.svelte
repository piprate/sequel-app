<script>
  import TokenMedia from '../marketplace/TokenMedia.svelte'
  import SearchResult from '../search/SearchResult.svelte'
  import IconButton from '../IconButton.svelte'
  import EntityDisplayName from '../EntityDisplayName.svelte'
  import { createEventDispatcher } from 'svelte'

  export let token
  export let actions = undefined

  const dispatch = createEventDispatcher()

  $: id = token.id || 0

  function onButtonClick (event, action, tokenId) {
    event.preventDefault()
    event.stopPropagation()
    dispatch('click', {
      action,
      tokenId
    })
  }
</script>

<SearchResult href="/tokens/digital-art/{id}">
  <div class="token-card">
    <div class="token-card-image">
      <TokenMedia content={token.content} size="wide" isLink={true} />
    </div>
    <div class="token-card-name">
      <EntityDisplayName entity={token} /> (#{id})
    </div>
    {#if actions && actions.length}
      <div class="token-card-buttons">
        {#each actions as action}
          <IconButton
            label={action.label}
            on:click="{ (event) => onButtonClick(event, action, token.id) }"
            href={action.icon}
            big="true"
          />
        {/each}
      </div>
    {/if}
  </div>
</SearchResult>
<style>
  .token-card {
    display: grid;
    grid-template-areas:
      "image"
      "name"
      "buttons";
    grid-column-gap: 20px;
    grid-template-columns: 1fr;
    align-items: center;
  }
  :global(.token-card-image) {
    grid-area: image;
  }
  :global(.token-card-image img) {
    /*width: 100%;*/
  }
  .token-card-name {
    grid-area: name;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 1.1em;
    width: 250px;
    margin-top: 5px;
  }
  .token-card-buttons {
    grid-area: buttons;
    display: flex;
  }
  :global(.token-card-buttons .icon-button) {
    margin-right: 20px;
  }
  :global(.token-card-buttons .icon-button:last-child) {
    margin-right: 0;
  }
  @media (max-width: 767px) {
    .token-card {
      grid-column-gap: 10px;
    }
    .token-card-name {
      font-size: 1.2em;
      width: 300px;
    }
    :global(.token-card-buttons .icon-button) {
      margin-right: 10px;
    }
  }
</style>
