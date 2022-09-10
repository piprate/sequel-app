<script>
  import BubbleEdit from '../../_components/bubble/BubbleEdit.svelte'
  import DynamicPageBanner from '../../_components/DynamicPageBanner.svelte'
  import InfoAside from '../../_components/InfoAside.svelte'
  import { currentSpark } from '../../_store/instance'

  // suppress warnings
  export let params
  params = undefined
  const intl = {}
</script>
<DynamicPageBanner title="{intl.newBubble}" />
{#if $currentSpark}
    <BubbleEdit realm="new_bubble" newBubble={true} />
{:else}
    <InfoAside>
        {intl.selectSparkBeforeCreatingBubble}
    </InfoAside>
{/if}
