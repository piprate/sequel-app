<script>
  import FreeTextLayout from '../../_components/FreeTextLayout.svelte'
  import { isUserLoggedIn } from '../../_store/local.js'
  import HiddenFromSSR from '../../_components/HiddenFromSSR.svelte'
  import TimelinePage from '../../_components/TimelinePage.svelte'
  import NotificationFilters from '../../_components/NotificationFilters.svelte'
</script>

{#if $isUserLoggedIn}
  <NotificationFilters filter="mentions" />
  <TimelinePage timeline="notifications/mentions" />
{:else}
<HiddenFromSSR>
  <FreeTextLayout>
    <h1>{intl.notificationMentions}</h1>

    <p>{intl.notificationMentionsNotLoggedIn}</p>
  </FreeTextLayout>
</HiddenFromSSR>
{/if}
