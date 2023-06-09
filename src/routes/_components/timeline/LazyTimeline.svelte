<script>
  import { currentInstance, currentTimeline } from '../../_store/local'
  import { setForTimeline, rootRunningUpdate } from '../../_store/timeline'
  import { importTimeline } from '../../_utils/asyncModules/importTimeline'
  import { onMount, onDestroy } from 'svelte'
  import { currentSparkId } from '../../_store/instance'

  export let timeline
  let timelineComponent = undefined

  onMount(async () => {
    timelineComponent = await importTimeline()
    $currentTimeline = timeline
    setForTimeline(rootRunningUpdate, $currentInstance, timeline, false, $currentSparkId)
  })
  onDestroy(() => {
    $currentTimeline = null
  })
</script>

<div class="lazy-timeline">
  {#if timelineComponent}
    <svelte:component this={timelineComponent} {timeline} />
  {/if}
</div>

<style>
  .lazy-timeline {
    width: 100%;
  }
</style>
