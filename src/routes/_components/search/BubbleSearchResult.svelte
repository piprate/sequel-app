<script>
  import Avatar from '../Avatar.svelte'
  import SearchResult from './SearchResult.svelte'
  import IconButton from '../IconButton.svelte'
  import BubbleDisplayName from '../bubble/BubbleDisplayName.svelte'
  import { createEventDispatcher } from 'svelte'
  import { unwrap } from '../../_utils/mapper'

  export let bubble
  export let actions = undefined

  const dispatch = createEventDispatcher()

  $: id = unwrap(bubble.id)
  $: croppedSummary = bubble.summary
    ? bubble.summary.length > 250
      ? bubble.summary.substring(0, 250) + '...'
      : bubble.summary
    : ''
  $: postCount = bubble.postCount || 0
  $: memberCount = bubble.memberCount || 0

  function onButtonClick(event, action, bubbleId) {
    event.preventDefault()
    event.stopPropagation()
    dispatch('click', {
      action,
      bubbleId
    })
  }
</script>

<SearchResult href="/bubbles/{id}">
  <div class="search-result-bubble">
    <div class="search-result-bubble-avatar">
      <Avatar entity={bubble} size="small" />
    </div>
    <div class="search-result-bubble-name">
      <BubbleDisplayName {bubble} />
    </div>
    <div class="search-result-bubble-stats">
      Posts: {postCount} Members: {bubble.memberCount}
    </div>
    <div class="search-result-bubble-summary">
      {croppedSummary}
    </div>
    {#if actions && actions.length}
      <div class="search-result-bubble-buttons">
        {#each actions as action}
          <IconButton
            label={action.label}
            on:click={(event) => onButtonClick(event, action, bubble.id)}
            href={action.icon}
            big="true"
          />
        {/each}
      </div>
    {/if}
  </div>
</SearchResult>

<style>
  .search-result-bubble {
    display: grid;
    grid-template-areas:
      'avatar    name     buttons'
      'avatar    stats    buttons'
      'summary   summary  buttons';
    grid-column-gap: 20px;
    grid-template-columns: max-content 1fr max-content;
    align-items: center;
  }
  :global(.search-result-bubble-avatar) {
    grid-area: avatar;
  }
  .search-result-bubble-name {
    grid-area: name;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 1.2em;
  }
  .search-result-bubble-stats {
    grid-area: stats;
    color: var(--very-deemphasized-text-color);
  }
  .search-result-bubble-summary {
    margin-top: 5px;
    grid-area: summary;
    color: var(--deemphasized-text-color);
  }
  .search-result-bubble-buttons {
    grid-area: buttons;
    display: flex;
  }
  :global(.search-result-bubble-buttons .icon-button) {
    margin-right: 20px;
  }
  :global(.search-result-bubble-buttons .icon-button:last-child) {
    margin-right: 0;
  }
  @media (max-width: 767px) {
    .search-result-bubble {
      grid-column-gap: 10px;
    }
    :global(.search-result-bubble-buttons .icon-button) {
      margin-right: 10px;
    }
  }
</style>
