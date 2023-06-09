<script>
  import DynamicPageBanner from '../../../../_components/DynamicPageBanner.svelte'
  import InfoAside from '../../../../_components/InfoAside.svelte'
  import ReleaseEdit from '../../../../_components/marketplace/ReleaseEdit.svelte'
  import { currentSpark } from '../../../../_store/instance'

  export let params

  // suppress warnings
  const intl = {}

  let realm = `spark/${params.id}`
</script>

<DynamicPageBanner title={intl.editRelease} />
{#if $currentSpark}
  <ReleaseEdit {realm} releaseId={params.id} />
{:else}
  <InfoAside>
    {intl.selectSparkBeforeCreatingRelease}
  </InfoAside>
{/if}
