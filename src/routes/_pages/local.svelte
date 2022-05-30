<script>
  import TimelinePage from '../_components/TimelinePage.svelte'
  import FreeTextLayout from '../_components/FreeTextLayout.svelte'
  import { isUserLoggedIn } from '../_store/local.js'
  import { pinnedPage } from '../_store/instance.js'
  import HiddenFromSSR from '../_components/HiddenFromSSR.svelte'
  import DynamicPageBanner from '../_components/DynamicPageBanner.svelte'
</script>

{#if $isUserLoggedIn}
  <TimelinePage timeline="local">
    {#if $pinnedPage !== '/local'}
      <DynamicPageBanner title="{intl.localTimeline}" icon="#fa-users"/>
    {/if}
  </TimelinePage>
{:else}
  <HiddenFromSSR>
    <FreeTextLayout>
      <h1>{intl.local}</h1>

      <p>{intl.localTimelineNotLoggedIn}</p>
    </FreeTextLayout>
  </HiddenFromSSR>
{/if}

