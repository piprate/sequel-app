<script>
  import TimelinePage from '../_components/TimelinePage.svelte'
  import FreeTextLayout from '../_components/FreeTextLayout.svelte'
  import { isUserLoggedIn } from '../_store/local.js'
  import { pinnedPage } from '../_store/instance.js'
  import HiddenFromSSR from '../_components/HiddenFromSSR.svelte'
  import DynamicPageBanner from '../_components/DynamicPageBanner.svelte'
</script>

{#if $isUserLoggedIn}
  <TimelinePage timeline="federated">
    {#if $pinnedPage !== '/federated'}
      <DynamicPageBanner title="{intl.federatedTimeline}" icon="#fa-globe"/>
    {/if}
  </TimelinePage>
{:else}
  <HiddenFromSSR>
    <FreeTextLayout>
      <h1>{intl.federated}</h1>

      <p>{intl.federatedTimelineNotLoggedIn}</p>
    </FreeTextLayout>
  </HiddenFromSSR>
{/if}
