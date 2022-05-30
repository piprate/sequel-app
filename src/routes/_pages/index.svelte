<script>
  import TimelineHomePage from '../_components/TimelineHomePage.svelte'
  import NotLoggedInHome from '../_components/NotLoggedInHome.svelte'
  import { isUserLoggedIn } from '../_store/local'

  // suppress warnings
  export let params;
  params = undefined;
</script>
{#if $isUserLoggedIn}
  <TimelineHomePage/>
{:else}
  <NotLoggedInHome/>
{/if}
