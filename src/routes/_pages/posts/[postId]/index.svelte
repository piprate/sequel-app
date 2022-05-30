<script>
  import FreeTextLayout from '../../../_components/FreeTextLayout.svelte'
  import { isUserLoggedIn } from '../../../_store/local.js'
  import HiddenFromSSR from '../../../_components/HiddenFromSSR.svelte'
  import DynamicPageBanner from '../../../_components/DynamicPageBanner.svelte'
  import TimelinePage from '../../../_components/TimelinePage.svelte'
  import { unwrap } from "../../../_utils/mapper";

  export let params;
</script>

{#if $isUserLoggedIn}
  {#key params.postId}
    <TimelinePage timeline="post/{unwrap(params.postId)}">
      <DynamicPageBanner title="" ariaTitle="{intl.postThreadPage}" />
    </TimelinePage>
  {/key}
{:else}
  <HiddenFromSSR>
    <FreeTextLayout>
      <h1>{intl.post}</h1>

      <p>{intl.postNotLoggedIn}</p>
    </FreeTextLayout>
  </HiddenFromSSR>
{/if}