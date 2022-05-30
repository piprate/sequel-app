<script>
  import BubbleEdit from "../../_components/bubble/BubbleEdit.svelte";
  import DynamicPageBanner from "../../_components/DynamicPageBanner.svelte";

  // suppress warnings
  export let params;
  params = undefined;
  const intl = {};
</script>
<DynamicPageBanner title="{intl.newBubble}" />
<BubbleEdit realm="new_bubble" newBubble={true} />
