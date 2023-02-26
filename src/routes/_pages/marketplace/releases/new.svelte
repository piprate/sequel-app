<script>
    import DynamicPageBanner from '../../../_components/DynamicPageBanner.svelte'
    import InfoAside from '../../../_components/InfoAside.svelte'
    import ReleaseEdit from '../../../_components/marketplace/ReleaseEdit.svelte';
    import { currentSpark } from '../../../_store/instance'
    
      // suppress warnings
      const intl = {}
    </script>
    <DynamicPageBanner title="{intl.newRelease}" />
    {#if $currentSpark}
        <ReleaseEdit realm="new_release"  />
    {:else}
        <InfoAside>
            {intl.selectSparkBeforeCreatingRelease}
        </InfoAside>
    {/if}
    