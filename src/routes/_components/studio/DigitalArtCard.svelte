<script>
  import TokenMedia from '../marketplace/TokenMedia.svelte'
  import SearchResult from '../search/SearchResult.svelte'
  import IconButton from '../IconButton.svelte'
  import EntityDisplayName from '../EntityDisplayName.svelte'
  import { createEventDispatcher } from 'svelte'
  import { unwrap } from '../../_utils/mapper'

  export let digitalArt
  export let actions = undefined

  const dispatch = createEventDispatcher()

  $: id = digitalArt.id
  $: summary = digitalArt.description
  $: croppedSummary = summary ?
          summary.length > 250 ? summary.substring(0, 250) + '...' : summary
          :
          ''

  function onButtonClick (event, action, id) {
    event.preventDefault()
    event.stopPropagation()
    dispatch('click', {
      action,
      id
    })
  }
</script>

<SearchResult href="/studio/digital-art/{unwrap(id)}">
  <div class="digital-art-card">
    <div class="digital-art-card-image">
      <TokenMedia content={digitalArt.content} size="wide" isLink=false secure=true />
    </div>
    <div class="digital-art-card-name">
      <EntityDisplayName entity={digitalArt} />
    </div>
    <div class="digital-art-card-summary">
      {croppedSummary}
    </div>
    {#if actions && actions.length}
      <div class="digital-art-card-buttons">
        {#each actions as action}
          <IconButton
            label={action.label}
            on:click="{ (event) => onButtonClick(event, action, id) }"
            href={action.icon}
            big="true"
          />
        {/each}
      </div>
    {/if}
  </div>
</SearchResult>
<style>
  .digital-art-card {
    display: grid;
    grid-template-areas:
      "image"
      "name"
      "summary"
      "buttons";
    grid-column-gap: 20px;
    grid-template-columns: 1fr;
    align-items: center;
  }
  :global(.digital-art-card-image) {
    grid-area: image;
  }
  :global(.digital-art-card-image img) {
    /*width: 100%;*/
  }
  .digital-art-card-name {
    grid-area: name;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 1.1em;
    width: 250px;
    margin-top: 5px;
  }
  .digital-art-card-summary {
    margin-top: 5px;
    grid-area: summary;
    color: var(--deemphasized-text-color);
    width: 250px;
  }
  .digital-art-card-buttons {
    grid-area: buttons;
    display: flex;
  }
  :global(.digital-art-card-buttons .icon-button) {
    margin-right: 20px;
  }
  :global(.digital-art-card-buttons .icon-button:last-child) {
    margin-right: 0;
  }
  @media (max-width: 767px) {
    .digital-art-card {
      grid-column-gap: 10px;
    }
    .digital-art-card-summary {
      width: 300px;
    }
    .digital-art-card-name {
      font-size: 1.2em;
    }
    :global(.digital-art-card-buttons .icon-button) {
      margin-right: 10px;
    }
  }
</style>
