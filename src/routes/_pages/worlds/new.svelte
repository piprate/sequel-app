<script>
  import WorldEdit from '../../_components/world/WorldEdit.svelte'
  import DynamicPageBanner from '../../_components/DynamicPageBanner.svelte'
  import InfoAside from '../../_components/InfoAside.svelte'
  import { currentSpark } from '../../_store/instance'

  // suppress warnings
  export let params
  params = undefined
  const intl = {}
</script>
<DynamicPageBanner title="{intl.newWorld}" />

{#if $currentSpark}
    <WorldEdit realm="new_world" newWorld={true} />
{:else}
    <InfoAside>
        {intl.selectSparkBeforeCreatingWorld}
    </InfoAside>
{/if}