<script>
  import DigitalArtEdit from '../../../_components/digitalart/DigitalArtEdit.svelte'
  import DynamicPageBanner from '../../../_components/DynamicPageBanner.svelte'
  import InfoAside from '../../../_components/InfoAside.svelte'
  import { currentSpark } from '../../../_store/instance'

  // suppress warnings
  export let params
  params = undefined
  const intl = {}
</script>

<DynamicPageBanner title={intl.newDigitalArt} />
{#if $currentSpark}
  <DigitalArtEdit realm="new_digital_art" />
{:else}
  <InfoAside>
    {intl.selectSparkBeforeCreatingDigitalArt}
  </InfoAside>
{/if}
