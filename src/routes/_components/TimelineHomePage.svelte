<!--
     Same as TimelinePage.svelte, but needs to manage visibility of ComposeBox itself
     without a div wrapper due to sticky-positioned compose button.
     TODO: this is a bit hacky due to code duplication
 -->
<script>
  import LazyTimeline from './timeline/LazyTimeline.svelte'
  import { timelineInitialized, timelinePreinitialized } from '../_store/local'
  import LoadingPage from './LoadingPage.svelte'
  import LazyComposeBox from './compose/LazyComposeBox.svelte'
  import { onMount } from "svelte";

  $: hidePage = !$timelineInitialized && !$timelinePreinitialized;
  $: hideTimeline = !$timelineInitialized;

  onMount(() => {
    $timelineInitialized = false;
    $timelinePreinitialized = false;
  });
</script>

<div class="timeline-home-page" aria-busy={hideTimeline}>
  {#if hidePage}
    <LoadingPage />
  {/if}
  <LazyComposeBox realm="home" hidden={hidePage}/>
  <div class="timeline-home-anchor-container">
    {#if !hidePage && hideTimeline}
      <LoadingPage />
    {/if}
    <div class="timeline-home-reveal-container {hideTimeline ? 'hidden' : ''}">
      <LazyTimeline timeline="home" />
    </div>
  </div>
</div>
<style>
  .timeline-home-page, .timeline-home-anchor-container {
    position: relative;
  }
  .timeline-home-reveal-container {
    transition: opacity 0.2s linear; /* main page reveal */
  }
</style>