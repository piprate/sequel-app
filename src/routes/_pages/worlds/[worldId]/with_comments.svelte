<script>
  import WorldHomePage from '../../../_components/world/WorldHomePage.svelte'

  export let params
</script>

<WorldHomePage worldId={params.worldId} filter="with_comments" />
