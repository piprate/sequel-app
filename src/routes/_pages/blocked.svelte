<script>
  import SparksListPage from '../_components/SparksListPage.svelte'
  import { currentInstance, isUserLoggedIn } from '../_store/local'
  import { accessToken } from '../_store/instance'
  import { getBlockedSparks } from '../_api/blockedAndMuted'
  import DynamicPageBanner from '../_components/DynamicPageBanner.svelte'
  import { setSparkBlocked } from '../_actions/spark/block'

  // suppress warnings
  export let params
  params = undefined

  let sparkActions = [
    {
      icon: '#fa-unlock',
      label: 'intl.unblock',
      onclick: (sparkId) => setSparkBlocked(sparkId, false, true)
    }
  ]

  $: sparksFetcher = () => getBlockedSparks($currentInstance, $accessToken)
</script>

<DynamicPageBanner title={intl.blockedSparks} icon="#fa-ban" />
{#if $isUserLoggedIn}
  <SparksListPage {sparksFetcher} {sparkActions} />
{/if}
