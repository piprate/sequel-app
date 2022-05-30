<script>
  import { importComposeBox } from '../../_utils/asyncModules/importComposeBox'
  import { onMount } from "svelte";

  export let realm;
  export let bubbleId;
  export let asSpark;
  export let hidden;

  let composeBox = undefined;

  onMount(async () => {
    composeBox = await importComposeBox();
  })
</script>

{#if composeBox && !hidden }
  <svelte:component this={composeBox} {realm} {bubbleId} {asSpark} {hidden} />
{/if}