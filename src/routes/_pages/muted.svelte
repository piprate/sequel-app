<script>
  import AccountsListPage from '../_components/AccountsListPage.svelte'
  import { currentInstance, isUserLoggedIn } from '../_store/local.js'
  import { accessToken } from '../_store/instance'
  import { getMutedAccounts } from '../_api/blockedAndMuted'
  import DynamicPageBanner from '../_components/DynamicPageBanner.svelte'
  import { setAccountMuted } from '../_actions/mute'

  // suppress warnings
  export let params;
  params = undefined;

  let accountActions = [
    {
      icon: '#fa-volume-up',
      label: 'intl.unmute',
      onclick: (accountId) => setAccountMuted(accountId,
              /* mute */ false,
              /* notifications */ false,
              /* toastOnSuccess */ true)
    }
  ];

  $: accountsFetcher = () => $isUserLoggedIn ? getMutedAccounts($currentInstance, $accessToken) : [];
</script>

<DynamicPageBanner title="{intl.mutedUsers}" icon="#fa-volume-off" />
{#if $isUserLoggedIn }
  <AccountsListPage {accountsFetcher} {accountActions} />
{/if}