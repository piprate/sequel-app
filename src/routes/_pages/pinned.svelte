<script>
  import { currentInstance, isUserLoggedIn } from '../_store/local.js'
  import { accessToken, currentVerifyCredentials } from '../_store/instance'
  import LoadingPage from '../_components/LoadingPage.svelte'
  import StatusSearchResult from '../_components/search/StatusSearchResult.svelte'
  import { toast } from '../_components/toast/toast'
  import DynamicPageBanner from '../_components/DynamicPageBanner.svelte'
  import { getPinnedStatuses } from '../_api/pinnedStatuses'
  import { updateVerifyCredentialsForInstance } from '../_actions/instances'
  import { formatIntl } from '../_utils/formatIntl'
  import { onMount } from "svelte";

  // suppress warnings
  export let params;
  params = undefined;

  let loading = true;
  let accounts = [];
  let statuses = undefined;

  onMount(async () => {
    try {
      await updateVerifyCredentialsForInstance($currentInstance);
      statuses = await getPinnedStatuses($currentInstance, $accessToken, $currentVerifyCredentials.id);
    } catch (e) {
      /* no await */ toast.say(formatIntl('intl.error', { error: (e.name || '') + ' ' + (e.message || '') }))
    } finally {
      loading = false;
    }
  });
</script>

<DynamicPageBanner title="{intl.pinnedStatuses}" icon="#fa-thumb-tack" />
{#if $isUserLoggedIn }
  <div class="pinned-toots-page">
    {#if loading}
      <LoadingPage />
      {:else if statuses && statuses.length}
      <ul class="pinned-toots-results">
        {#each statuses as status, index}
          <StatusSearchResult {status} {index} length={statuses.length} />
        {/each}
      </ul>
    {/if}
  </div>
{/if}
<style>
  .pinned-toots-page {
    padding: 20px 20px;
    position: relative;
  }
  .pinned-toots-results {
    list-style: none;
    box-sizing: border-box;
    border: 1px solid var(--main-border);
    border-radius: 2px;
  }
  @media (max-width: 767px) {
    .pinned-toots-page {
      padding: 20px 10px;
    }
  }
</style>