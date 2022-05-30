<script>
  import { importComposeBox } from '../../_utils/asyncModules/importComposeBox'
  import { onMount } from "svelte";

  export let realm;
  export let hidden;

  let composeBox = undefined;

  onMount(async () => {
    composeBox = await importComposeBox();
  })
</script>

{#if composeBox}
  <svelte:component this={composeBox} {realm} {hidden} />
{/if}