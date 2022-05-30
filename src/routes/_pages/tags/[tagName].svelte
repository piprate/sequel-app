<script>
  import TimelinePage from '../../_components/TimelinePage.svelte'
  import FreeTextLayout from '../../_components/FreeTextLayout.svelte'
  import { isUserLoggedIn } from '../../_store/local.js'
  import HiddenFromSSR from '../../_components/HiddenFromSSR.svelte'
  import DynamicPageBanner from '../../_components/DynamicPageBanner.svelte'

  export let params;
</script>

{#if $isUserLoggedIn}
  <TimelinePage timeline="tag/{params.tagName}">
    <DynamicPageBanner title="{'#' + params.tagName}"/>
  </TimelinePage>
{:else}
  <HiddenFromSSR>
    <FreeTextLayout>
      <h1>#{params.tagName}</h1>

      <p>{intl.tagNotLoggedIn}</p>
    </FreeTextLayout>
  </HiddenFromSSR>
{/if}
