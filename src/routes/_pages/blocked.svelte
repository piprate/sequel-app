<script>
  import AccountsListPage from '../_components/AccountsListPage.svelte'
  import { currentInstance, isUserLoggedIn } from '../_store/local'
  import { accessToken } from '../_store/instance'
  import { getBlockedAccounts } from '../_api/blockedAndMuted'
  import DynamicPageBanner from '../_components/DynamicPageBanner.svelte'
  import { setAccountBlocked } from '../_actions/block'

  // suppress warnings
  export let params;
  params = undefined;

  let accountActions = [
    {
      icon: '#fa-unlock',
      label: 'intl.unblock',
      onclick: (accountId) => setAccountBlocked(accountId, false, true)
    }
  ];

  $: accountsFetcher = () => getBlockedAccounts($currentInstance, $accessToken);
</script>

<DynamicPageBanner title="{intl.blockedUsers}" icon="#fa-ban" />
{#if $isUserLoggedIn }
  <AccountsListPage {accountsFetcher} {accountActions} />
{/if}