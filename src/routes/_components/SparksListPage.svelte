<script>
  import LoadingPage from './LoadingPage.svelte';
  import SparkSearchResult from './search/SparkSearchResult.svelte';
  import { toast } from './toast/toast';
  import { on } from '../_utils/eventBus';
  import { formatIntl } from '../_utils/formatIntl';
  import { onMount } from "svelte";

  export let sparksFetcher;
  export let sparkActions = undefined;

  let loading = true;
  let sparks = [];

  function onClickAction (event) {
    const { action, sparkId } = event;
    action.onclick(sparkId);
  }

  async function refreshSparks () {
    sparks = await sparksFetcher() || [];
    console.log("SPARKS", sparks);
  }

  // TODO: paginate

  onMount(async () => {
    try {
      await refreshSparks();
    } catch (e) {
      /* no await */
      toast.say(formatIntl('intl.error', { error: (e.message || '') }));
    } finally {
      loading = false;
    }
    return on('refreshSparksList', () => refreshSparks());
  });
</script>

<div class="sparks-page">
  {#if loading}
    <LoadingPage />
  {:else if sparks && sparks.length}
    <ul class="sparks-results">
      {#each sparks as spark}
        <SparkSearchResult
          {spark}
          actions={sparkActions}
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
  .sparks-page {
    padding: 20px 20px;
    position: relative;
  }
  .sparks-results {
    list-style: none;
    box-sizing: border-box;
    border: 1px solid var(--main-border);
    border-radius: 2px;
  }
  @media (max-width: 767px) {
    .sparks-page {
      padding: 20px 10px;
    }
  }
</style>
