<script>
  import FreeTextLayout from '../../../_components/FreeTextLayout.svelte'
  import { isUserLoggedIn } from '../../../_store/local.js'
  import HiddenFromSSR from '../../../_components/HiddenFromSSR.svelte'
  import DynamicPageBanner from '../../../_components/DynamicPageBanner.svelte'
  import TimelinePage from '../../../_components/TimelinePage.svelte'

  export let params;
</script>

{#if $isUserLoggedIn}
  <TimelinePage timeline="status/{params.statusId}">
    <DynamicPageBanner title="" ariaTitle="{intl.statusThreadPage}" />
  </TimelinePage>
{:else}
  <HiddenFromSSR>
    <FreeTextLayout>
      <h1>{intl.status}</h1>

      <p>{intl.statusNotLoggedIn}</p>
    </FreeTextLayout>
  </HiddenFromSSR>
{/if}