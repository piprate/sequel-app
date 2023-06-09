<script>
  import BubbleHomePage from '../../../_components/bubble/BubbleHomePage.svelte'

  export let params
</script>

{#key params.bubbleId}
  <BubbleHomePage bubbleId={params.bubbleId} newBubble={params.newBubble} filter="" />
{/key}
