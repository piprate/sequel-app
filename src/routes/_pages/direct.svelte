<script>
  import TimelinePage from '../_components/TimelinePage.svelte'
  import FreeTextLayout from '../_components/FreeTextLayout.svelte'
  import { isUserLoggedIn } from '../_store/local.js'
  import { pinnedPage } from '../_store/instance.js'
  import HiddenFromSSR from '../_components/HiddenFromSSR.svelte'
  import DynamicPageBanner from '../_components/DynamicPageBanner.svelte'
</script>

{#if $isUserLoggedIn}
  <TimelinePage timeline="direct">
    {#if $pinnedPage !== '/direct'}
      <DynamicPageBanner title="{intl.directMessages}" icon="#fa-envelope"/>
    {/if}
  </TimelinePage>
{:else}
  <HiddenFromSSR>
    <FreeTextLayout>
      <h1>{intl.directMessages}</h1>

      <p>{intl.directMessagesNotLoggedIn}</p>
    </FreeTextLayout>
  </HiddenFromSSR>
{/if}
