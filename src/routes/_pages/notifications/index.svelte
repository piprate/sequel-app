<script>
  import { isUserLoggedIn } from '../../_store/local.js'
  import RestrictedPageWarning from '../../_components/RestrictedPageWarning.svelte'
  import TimelinePage from '../../_components/TimelinePage.svelte'
  import NotificationFilters from '../../_components/NotificationFilters.svelte'

  // suppress warnings
  export let params
  params = undefined
</script>

{#if $isUserLoggedIn}
  <NotificationFilters filter="" />
  <TimelinePage timeline="notifications" />
{:else}
  <RestrictedPageWarning />
  <div style="display: none">
    <!-- TODO: this is just a hack so that `sapper export` knows to crawl these files -->
    <a href="/notifications/mentions">{intl.notificationMentions}</a>
  </div>
{/if}
