<script>
  import WorldHomePage from '../../../_components/world/WorldHomePage.svelte'

  export let params
</script>

<WorldHomePage worldId={params.worldId} filter={params.withComments ? "with_comments/reader_mode" : "reader_mode"} />
