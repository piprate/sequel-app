<script>
  import { currentInstance, currentTimeline } from '../../_store/local'
  import { setForTimeline, rootRunningUpdate } from '../../_store/timeline'
  import { importTimeline } from '../../_utils/asyncModules/importTimeline'
  import { onMount } from "svelte";

  export let timeline;
  let timelineComponent = undefined;

  onMount(async () => {
    timelineComponent = await importTimeline();
    $currentTimeline = timeline;
    setForTimeline(rootRunningUpdate, $currentInstance, timeline, false);
  });
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
