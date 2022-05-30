<script>
  import LazyTimeline from './timeline/LazyTimeline.svelte'
  import { timelineInitialized, timelinePreinitialized } from '../_store/local.js'
  import LoadingPage from './LoadingPage.svelte'
  import { onMount } from "svelte";

  export let timeline;

  $: hidePage = !$timelineInitialized && !$timelinePreinitialized;
  $: hideTimeline = !$timelineInitialized

  onMount(() => {
    $timelineInitialized = false;
    $timelinePreinitialized = false;
  })
</script>

<div class="timeline-page" aria-busy={hideTimeline}>
  {#if hidePage}
    <LoadingPage />
  {/if}
  <div class="timeline-slot-reveal-container {hidePage ? 'hidden' : ''}">
    <slot></slot>
  </div>
  <div class="timeline-anchor-container">
    {#if !hidePage && hideTimeline}
      <LoadingPage />
    {/if}
    <div class="timeline-reveal-container {hideTimeline ? 'hidden' : ''}">
      <LazyTimeline {timeline} />
    </div>
  </div>
</div>
<style>
  .timeline-page, .timeline-anchor-container {
    position: relative;
  }
  .timeline-reveal-container, .timeline-slot-reveal-container {
    transition: opacity 0.2s linear; /* main page reveal */
  }
</style>