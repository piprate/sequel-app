<script>
  import BubbleMemberListPage from "../../../_components/BubbleMemberListPage.svelte";
  import RestrictedPageWarning from '../../../_components/RestrictedPageWarning.svelte'
  import { currentInstance, isAuthenticated, isUserLoggedIn } from '../../../_store/local.js';
  import { accessToken } from '../../../_store/instance';
  import DynamicPageBanner from '../../../_components/DynamicPageBanner.svelte';
  import { getBubbleMemberList } from "../../../_api/bubbles";

  export let params;

  $: memberFetcher = () => $isUserLoggedIn ? getBubbleMemberList($currentInstance, $accessToken, params.bubbleId) : [];
</script>

<DynamicPageBanner title="{intl.bubbleMembers}" icon="#fa-users" />
{#if $isAuthenticated }
    <BubbleMemberListPage {memberFetcher} />
{:else}
    <RestrictedPageWarning message="{intl.loginToAccess}" offerVisitorMode={true} />
{/if}
