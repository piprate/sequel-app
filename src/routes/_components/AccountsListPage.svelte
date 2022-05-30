<script>
  import LoadingPage from './LoadingPage.svelte'
  import AccountSearchResult from './search/AccountSearchResult.svelte'
  import { toast } from './toast/toast'
  import { on } from '../_utils/eventBus'
  import { formatIntl } from '../_utils/formatIntl'
  import { onMount } from "svelte";

  export let accountsFetcher;
  export let accountActions = undefined;

  let loading = true;
  let accounts = [];

  function onClickAction(event) {
    const { action, accountId } = event;
    action.onclick(accountId);
  }

  async function refreshAccounts() {
    accounts = await accountsFetcher();
  }

  // TODO: paginate

  onMount(async () => {
    try {
      await refreshAccounts();
    } catch (e) {
      /* no await */
      toast.say(formatIntl('intl.error', { error: (e.message || '') }))
    } finally {
      loading = false;
    }
    return on('refreshAccountsList', () => refreshAccounts())
  });
</script>

<div class="accounts-page">
  {#if loading}
    <LoadingPage />
  {:else if accounts && accounts.length}
    <ul class="accounts-results">
      {#each accounts as account}
        <AccountSearchResult
          {account}
          actions={accountActions}
          on:click="{onClickAction}"
        />
      {/each}
    </ul>
  {/if}
</div>
<style>
  .accounts-page {
    padding: 20px 20px;
    position: relative;
  }
  .accounts-results {
    list-style: none;
    box-sizing: border-box;
    border: 1px solid var(--main-border);
    border-radius: 2px;
  }
  @media (max-width: 767px) {
    .accounts-page {
      padding: 20px 10px;
    }
  }
</style>
