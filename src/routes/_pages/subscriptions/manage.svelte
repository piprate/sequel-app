<script>
  import RestrictedPageWarning from '../../_components/RestrictedPageWarning.svelte'
  import SubscriptionBrowserFilter from '../../_components/subscription/SubscriptionBrowserFilter.svelte'
  import FreeTextLayout from '../../_components/FreeTextLayout.svelte'
  import InfoAside from '../../_components/InfoAside.svelte'
  import { currentInstance, isAuthenticated } from '../../_store/local'
  import { accessToken, currentSparkId } from '../../_store/instance'
  import { getBookmarkedSparks } from '../../_api/sparks'

  // suppress warnings
  export let params
  params = undefined
  const intl = {}

  $: sparksFetcher = () => getBookmarkedSparks($currentInstance, $accessToken, $currentSparkId)
</script>

{#if $isAuthenticated}
  <SubscriptionBrowserFilter filter="manage" />
  <FreeTextLayout>
    <InfoAside className="new-entity-notice-aside">
      {intl.featureNotImplemented}
    </InfoAside>
  </FreeTextLayout>
  <!--    <SparksListPage {sparksFetcher} >-->
  <!--        <span slot="is-empty">-->
  <!--            <InfoAside>-->
  <!--                {intl.noSubscriptionsYet}-->
  <!--            </InfoAside>-->
  <!--        </span>-->
  <!--    </SparksListPage>-->
{:else}
  <RestrictedPageWarning />
{/if}
