<script>
  import WorldEdit from "../../_components/world/WorldEdit.svelte";
  import DynamicPageBanner from "../../_components/DynamicPageBanner.svelte";

  // suppress warnings
  export let params;
  params = undefined;
  const intl = {};
</script>
<DynamicPageBanner title="{intl.newWorld}" />
<WorldEdit realm="new_world" newWorld={true} />
