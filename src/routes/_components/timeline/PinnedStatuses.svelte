<script>
  import Status from '../status/Status.svelte'
  import { updatePinnedStatusesForAccount } from '../../_actions/pinnedStatuses'
  import { on } from '../../_utils/eventBus'
  import { currentInstance, pinnedStatuses } from '../../_store/local'
  import { onMount } from "svelte";

  export let accountId;

  $: pinnedStatusesList = (() => {
    return ($pinnedStatuses[$currentInstance] && $pinnedStatuses[$currentInstance][accountId]) || []
  })();

  async function updatePinnedStatuses() {
    await updatePinnedStatusesForAccount(accountId)
  }

  onMount(async () => {
    const removeListener = on('updatePinnedStatuses', updatePinnedStatuses)
    await updatePinnedStatuses();
    return removeListener;
  })
</script>

{#if pinnedStatusesList.length }
  <h1 class="sr-only">{intl.pinnedStatuses}</h1>
  <div role="feed" aria-label="{intl.pinnedStatuses}" class="pinned-statuses">
    {#each pinnedStatusesList as status, index (status.id)}
      <div class="pinned-status-wrapper">
        <!-- empty div used because we assume the parent of the <article> gets the focus outline -->
        <Status {status}
                timelineType="pinned"
                timelineValue={accountId}
                {index}
                length={pinnedStatusesList.length}
                enableShortcuts={true}
        />
      </div>
    {/each}
  </div>
{/if}
<style>
  .pinned-status-wrapper:first-child {
    margin: 2px 0; /* gives room for the focus outline */
  }
</style>
