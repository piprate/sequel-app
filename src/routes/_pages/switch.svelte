<script>
  import RestrictedPageWarning from '../_components/RestrictedPageWarning.svelte';
  import { isAuthenticated, isUserLoggedIn } from '../_store/local';
  import SparkSelectionPage from "../_components/SparkSelectionPage.svelte";

  // suppress warnings
  export let params;
  params = undefined;
</script>
{#if $isUserLoggedIn}
  {#if $isAuthenticated}
    <SparkSelectionPage/>
  {/if}
{:else}
  <RestrictedPageWarning/>
{/if}
