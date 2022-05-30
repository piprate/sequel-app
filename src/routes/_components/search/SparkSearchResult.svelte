<script>
  import Avatar from '../Avatar.svelte';
  import SearchResult from './SearchResult.svelte';
  import IconButton from '../IconButton.svelte';
  import SparkDisplayName from '../spark/SparkDisplayName.svelte';
  import { createEventDispatcher } from "svelte";
  import { unwrap } from "../../_utils/mapper";

  export let spark;
  export let role = '';
  export let actions = undefined;

  const dispatch = createEventDispatcher();

  $: id = unwrap(spark.id);
  $: croppedSummary = spark.summary ?
          spark.summary.length > 250 ?
                  spark.summary.substring(0, 250) + "..." : spark.summary
          :
          '';
  $: postCount = spark.postCount || 0
  $: bubbleCount = spark.bubbleCount || 0
  $: subscriberCount = spark.subscriberCount || 0

  function onButtonClick (event, action, sparkId) {
    event.preventDefault();
    event.stopPropagation();
    dispatch('click', {
      action,
      sparkId
    });
  }
</script>

<SearchResult href="/sparks/{id}">
  <div class="search-result-spark">
    <div class="search-result-spark-avatar">
      <Avatar entity={spark} size="small" />
    </div>
    <div class="search-result-spark-name">
      <SparkDisplayName {spark} />{#if role}<span class="spark-relationship">{role}</span>{/if}
    </div>
    <div class="search-result-spark-stats">
      Posts: {postCount} Bubbles: {bubbleCount} Subscribers: {subscriberCount}
    </div>
    <div class="search-result-spark-summary">
      {croppedSummary}
    </div>
    {#if actions && actions.length}
      <div class="search-result-spark-buttons">
        {#each actions as action}
          <IconButton
            label={action.label}
            on:click="{ (event) => onButtonClick(event, action, spark.id) }"
            href={action.icon}
            big="true"
          />
        {/each}
      </div>
    {/if}
  </div>
</SearchResult>
<style>
  .search-result-spark {
    display: grid;
    grid-template-areas:
      "avatar    name     buttons"
      "avatar    stats    buttons"
      "summary   summary  buttons";
    grid-column-gap: 20px;
    grid-template-columns: max-content 1fr max-content;
    align-items: center;
  }
  :global(.search-result-spark-avatar) {
    grid-area: avatar;
  }
  .search-result-spark-name {
    grid-area: name;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 1.2em;
  }
  .search-result-spark-stats {
    grid-area: stats;
    color: var(--very-deemphasized-text-color);
  }
  .spark-relationship {
    background: rgba(30, 30, 30, 0.8);
    border-radius: 4px;
    padding: 3px 5px;
    align-self: center;
    text-transform: uppercase;
    color: var(--deemphasized-text-color);
    font-size: 0.8em;
    white-space: nowrap;
  }
  .search-result-spark-summary {
    margin-top: 5px;
    grid-area: summary;
    color: var(--deemphasized-text-color);
  }
  .search-result-spark-buttons {
    grid-area: buttons;
    display: flex;
  }
  :global(.search-result-spark-buttons .icon-button) {
    margin-right: 20px;
  }
  :global(.search-result-spark-buttons .icon-button:last-child) {
    margin-right: 0;
  }
  @media (max-width: 767px) {
    .search-result-spark {
      grid-column-gap: 10px;
    }
    :global(.search-result-spark-buttons .icon-button) {
      margin-right: 10px;
    }
  }
</style>
