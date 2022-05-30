<script>
  import WorldHomePage from '../../../_components/world/WorldHomePage.svelte'

  export let params;
</script>

{#key params.worldId}
    <WorldHomePage worldId={params.worldId} newWorld={params.newWorld} filter="" />
{/key}