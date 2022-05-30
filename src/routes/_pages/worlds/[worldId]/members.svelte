<script>
  import SparksListPage from "../../../_components/SparksListPage.svelte";
  import RestrictedPageWarning from '../../../_components/RestrictedPageWarning.svelte'
  import { currentInstance, isAuthenticated, isUserLoggedIn } from '../../../_store/local.js';
  import { accessToken } from '../../../_store/instance';
  import DynamicPageBanner from '../../../_components/DynamicPageBanner.svelte';
  import { getWorldMemberList } from "../../../_api/worlds";

  export let params;

  $: sparksFetcher = () => $isUserLoggedIn ? getWorldMemberList($currentInstance, $accessToken, params.worldId) : [];
</script>

<DynamicPageBanner title="{intl.worldMembers}" icon="#fa-users" />
{#if $isAuthenticated }
    <SparksListPage {sparksFetcher} />
{:else}
    <RestrictedPageWarning message="{intl.worldMembersNotLoggedIn}" />
{/if}