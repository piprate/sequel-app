<script>
  import Avatar from '../Avatar.svelte';
  import SearchResult from './SearchResult.svelte';
  import IconButton from '../IconButton.svelte';
  import WorldDisplayName from '../world/WorldDisplayName.svelte';
  import { createEventDispatcher } from "svelte";
  import { unwrap } from "../../_utils/mapper";

  export let world;
  export let actions = undefined;

  const dispatch = createEventDispatcher();

  $: id = unwrap(world.id);
  $: croppedSummary = world.summary ?
          world.summary.length > 250 ?
                  world.summary.substring(0, 250) + "..." : world.summary
          :
          '';
  $: postCount = world.postCount || 0
  $: bubbleCount = world.bubbleCount || 0
  $: memberCount = world.memberCount || 0

  function onButtonClick (event, action, worldId) {
    event.preventDefault();
    event.stopPropagation();
    dispatch('click', {
      action,
      worldId
    });
  }
</script>

<SearchResult href="/worlds/{id}">
  <div class="search-result-world">
    <div class="search-result-world-avatar">
      <Avatar entity={world} size="small" />
    </div>
    <div class="search-result-world-name">
      <WorldDisplayName {world} />
    </div>
    <div class="search-result-world-stats">
      Posts: {postCount} Bubbles: {bubbleCount} Members: {memberCount}
    </div>
    <div class="search-result-world-summary">
      {croppedSummary}
    </div>
    {#if actions && actions.length}
      <div class="search-result-world-buttons">
        {#each actions as action}
          <IconButton
            label={action.label}
            on:click="{ (event) => onButtonClick(event, action, world.id) }"
            href={action.icon}
            big="true"
          />
        {/each}
      </div>
    {/if}
  </div>
</SearchResult>
<style>
  .search-result-world {
    display: grid;
    grid-template-areas:
      "avatar    name     buttons"
      "avatar    stats    buttons"
      "summary   summary  buttons";
    grid-column-gap: 20px;
    grid-template-columns: max-content 1fr max-content;
    align-items: center;
  }
  :global(.search-result-world-avatar) {
    grid-area: avatar;
  }
  .search-result-world-name {
    grid-area: name;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 1.2em;
  }
  .search-result-world-stats {
    grid-area: stats;
    color: var(--very-deemphasized-text-color);
  }
  .search-result-world-summary {
    margin-top: 5px;
    grid-area: summary;
    color: var(--deemphasized-text-color);
  }
  .search-result-world-buttons {
    grid-area: buttons;
    display: flex;
  }
  :global(.search-result-world-buttons .icon-button) {
    margin-right: 20px;
  }
  :global(.search-result-world-buttons .icon-button:last-child) {
    margin-right: 0;
  }
  @media (max-width: 767px) {
    .search-result-world {
      grid-column-gap: 10px;
    }
    :global(.search-result-world-buttons .icon-button) {
      margin-right: 10px;
    }
  }
</style>
