<script>
  import LoadingPage from './LoadingPage.svelte';
  import SparkSearchResult from './search/SparkSearchResult.svelte';
  import { toast } from './toast/toast';
  import { on } from '../_utils/eventBus';
  import { formatIntl } from '../_utils/formatIntl';
  import { onMount } from "svelte";

  export let memberFetcher;
  export let memberActions = undefined;

  let loading = true;
  let members = [];

  function onClickAction (event) {
    const { action, sparkId } = event;
    action.onclick(sparkId);
  }

  async function refreshSparks () {
    members = await memberFetcher();
    console.log("MEMBERS", members);
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
  {:else if members && members.length}
    <ul class="sparks-results">
      {#each members as member}
        <SparkSearchResult
          spark={member.sparkRef}
          role={member.memberType === 'owner' ? 'owner' : ''}
          actions={memberActions}
          on:click="{onClickAction}"
        />
        {/each}
      </ul>
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
