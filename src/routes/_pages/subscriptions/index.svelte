<script>
  import TimelinePage from '../../_components/TimelinePage.svelte'
  import RestrictedPageWarning from '../../_components/RestrictedPageWarning.svelte'
  import SubscriptionBrowserFilter from '../../_components/subscription/SubscriptionBrowserFilter.svelte'
  import { isAuthenticated } from '../../_store/local'

  // suppress warnings
  export let params
  params = undefined
</script>

{#if $isAuthenticated}
  <TimelinePage timeline="subscriptions">
    <SubscriptionBrowserFilter filter="timeline" />
  </TimelinePage>
{:else}
  <RestrictedPageWarning />
{/if}
