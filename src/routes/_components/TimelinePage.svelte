<script>
  import LazyTimeline from './timeline/LazyTimeline.svelte'
  import { timelineInitialized, timelinePreinitialized } from '../_store/local.js'
  import LoadingPage from './LoadingPage.svelte'
  import LazyComposeBox from './compose/LazyComposeBox.svelte'
  import { onMount } from 'svelte'
  import { currentSparkId } from '../_store/instance'
  import { isTimelineInReaderMode } from '../_actions/timeline';

  export let timeline
  export let showCompose = false
  export let bubbleId = undefined

  $: hidePage = !$timelineInitialized && !$timelinePreinitialized
  $: hideTimeline = !$timelineInitialized

  onMount(() => {
    $timelineInitialized = false
    $timelinePreinitialized = false
  })
</script>

<div class="timeline-page" aria-busy={hideTimeline}>
  {#if hidePage}
    <LoadingPage />
  {/if}
  <div class="timeline-slot-reveal-container {hidePage ? 'hidden' : ''}">
    <slot></slot>
  </div>
  {#if showCompose && !isTimelineInReaderMode(timeline)}
    <LazyComposeBox realm={bubbleId} {bubbleId} asSpark={$currentSparkId} hidden={hidePage}/>
  {/if}
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