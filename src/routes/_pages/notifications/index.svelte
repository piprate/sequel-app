<script>
  import FreeTextLayout from '../../_components/FreeTextLayout.svelte'
  import { isUserLoggedIn } from '../../_store/local.js'
  import HiddenFromSSR from '../../_components/HiddenFromSSR.svelte'
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
<HiddenFromSSR>
  <FreeTextLayout>
    <h1>{intl.notifications}</h1>

    <p>{intl.notificationsNotLoggedIn}</p>
  </FreeTextLayout>
  <div style="display: none">
    <!-- TODO: this is just a hack so that `sapper export` knows to crawl these files -->
    <a href="/notifications/mentions">{intl.notificationMentions}</a>
  </div>
</HiddenFromSSR>
{/if}
