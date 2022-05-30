<script>
  import SparksListPage from '../_components/SparksListPage.svelte'
  import { currentInstance, isUserLoggedIn, subscriptionRequestCounts } from '../_store/local.js'
  import { accessToken } from '../_store/instance'
  import { getSubRequests } from '../_api/subscriptionRequests'
  import DynamicPageBanner from '../_components/DynamicPageBanner.svelte'
  import { setSubRequestApprovedOrRejected } from '../_actions/requests'
  import { database } from '../_database/database'

  // sneakily update the subscription reqs count in the cache, since we just fetched it
  function updateSubReqsCount ($currentInstance, subscriptionReqs) {
    /* no await */ database.setSubscriptionRequestCount($currentInstance, subscriptionReqs.length)
    $subscriptionRequestCounts[$currentInstance] = subscriptionReqs.length
  }

  let sparkActions = [
    {
      icon: '#fa-check',
      label: 'intl.approve',
      onclick: (sparkId) => setSubRequestApprovedOrRejected(sparkId, true, true)
    },
    {
      icon: '#fa-times',
      label: 'intl.reject',
      onclick: (sparkId) => setSubRequestApprovedOrRejected(sparkId, false, true)
    }
  ];

  $: sparksFetcher = (async () => {
    if ($isUserLoggedIn) {
      const subscriptionReqs = await getSubRequests($currentInstance, $accessToken)
      updateSubReqsCount($currentInstance, subscriptionReqs)
      return subscriptionReqs
    } else {
      return [];
    }
  })();
</script>

<DynamicPageBanner title="{intl.subRequests}" icon="#fa-user-plus" />
{#if $isUserLoggedIn }
  <SparksListPage {sparksFetcher} {sparkActions} />
{/if}