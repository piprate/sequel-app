<script>
  import RestrictedPageWarning from '../../_components/RestrictedPageWarning.svelte'
  import { isUserLoggedIn } from '../../_store/local.js'
  import TimelinePage from '../../_components/TimelinePage.svelte'
  import NotificationFilters from '../../_components/NotificationFilters.svelte'

  // suppress warnings
  export let params
  params = undefined
</script>

{#if $isUserLoggedIn}
  <NotificationFilters filter="mentions" />
  <TimelinePage timeline="notifications/mentions" />
{:else}
  <RestrictedPageWarning message={intl.loginToAccess} offerVisitorMode={true} />
{/if}
