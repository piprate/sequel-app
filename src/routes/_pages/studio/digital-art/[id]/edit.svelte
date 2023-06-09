<script>
  import DigitalArtEdit from '../../../../_components/digitalart/DigitalArtEdit.svelte'
  import DynamicPageBanner from '../../../../_components/DynamicPageBanner.svelte'
  import InfoAside from '../../../../_components/InfoAside.svelte'
  import { currentSpark } from '../../../../_store/instance'

  // suppress warnings
  export let params
  const intl = {}
</script>

<DynamicPageBanner title={intl.editDigitalArt} />
{#if $currentSpark}
  <DigitalArtEdit realm="edit_digital_art" digitalArtId={params.id} />
{:else}
  <InfoAside>
    {intl.selectSparkBeforeCreatingDigitalArt}
  </InfoAside>
{/if}
