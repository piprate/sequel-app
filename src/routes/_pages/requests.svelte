<script>
  import AccountsListPage from '../_components/AccountsListPage.svelte'
  import { currentInstance, isUserLoggedIn, followRequestCounts } from '../_store/local.js'
  import { accessToken } from '../_store/instance'
  import { getFollowRequests } from '../_api/followRequests'
  import DynamicPageBanner from '../_components/DynamicPageBanner.svelte'
  import { setFollowRequestApprovedOrRejected } from '../_actions/requests'
  import { database } from '../_database/database'

  // sneakily update the follow reqs count in the cache, since we just fetched it
  function updateFollowReqsCount ($currentInstance, followReqs) {
    /* no await */ database.setFollowRequestCount($currentInstance, followReqs.length)
    $followRequestCounts[$currentInstance] = followReqs.length
  }

  let accountActions = [
    {
      icon: '#fa-check',
      label: 'intl.approve',
      onclick: (accountId) => setFollowRequestApprovedOrRejected(accountId, true, true)
    },
    {
      icon: '#fa-times',
      label: 'intl.reject',
      onclick: (accountId) => setFollowRequestApprovedOrRejected(accountId, false, true)
    }
  ];

  $: accountsFetcher = (async () => {
    const followReqs = await getFollowRequests($currentInstance, $accessToken)
    updateFollowReqsCount($currentInstance, followReqs)
    return followReqs
  })();
</script>

<DynamicPageBanner title="{intl.followRequests}" icon="#fa-user-plus" />
{#if $isUserLoggedIn }
  <AccountsListPage {accountsFetcher} {accountActions} />
{/if}