<script>
  import BubbleHomePage from '../../../_components/bubble/BubbleHomePage.svelte'

  export let params
</script>

<BubbleHomePage bubbleId={params.bubbleId} filter={params.withComments ? 'with_comments/reader_mode' : 'reader_mode'} />
