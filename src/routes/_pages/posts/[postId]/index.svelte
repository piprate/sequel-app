<script>
  import RestrictedPageWarning from '../../../_components/RestrictedPageWarning.svelte'
  import { isUserLoggedIn } from '../../../_store/local.js'
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
  <RestrictedPageWarning message="{intl.loginToAccess}" offerVisitorMode={true} />
{/if}