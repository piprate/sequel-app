<script>
  import { autoplayGifs } from '../../_store/local'
  import { massageUserText } from '../../_utils/massageUserText'

  export let bubble

  let emojis = []

  $: massagedSummary = massageUserText(bubble.summaryHTML, emojis, $autoplayGifs)
</script>

<h2 class="sr-only">{intl.description}</h2>
<div class="bubble-profile-summary">
  {@html massagedSummary}
</div>

<style>
  .bubble-profile-summary {
    grid-area: summary;
    padding: 10px 0;
    font-size: 0.9em;
    word-wrap: break-word;
    overflow: hidden;
    white-space: pre-wrap;
  }

  :global(.bubble-profile-summary p) {
    margin: 0 0 20px;
  }

  :global(.bubble-profile-summary p:first-child) {
    margin: 0 0 20px;
  }

  :global(.bubble-profile-summary p:last-child) {
    margin: 0;
  }

  :global(.underline-links .bubble-profile-summary a) {
    text-decoration: underline;
  }

  @media (max-width: 767px) {
    .bubble-profile-summary {
      padding: 5px 0;
    }
  }
</style>
