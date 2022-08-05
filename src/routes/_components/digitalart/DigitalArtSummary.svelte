<script>
  import { autoplayGifs } from '../../_store/local'
  import { massageUserText } from '../../_utils/massageUserText'

  export let digitalArt

  let emojis = []

  $: summary = (digitalArt && digitalArt.description) || ""
  $: massagedSummary = massageUserText(summary, emojis, $autoplayGifs)
</script>

<h2 class="sr-only">{intl.description}</h2>
<div class="digital-art-summary">
  {@html massagedSummary}
</div>
<style>
  .digital-art-summary {
    grid-area: summary;
    padding: 10px 0;
    font-size: 1.0em;
    word-wrap: break-word;
    overflow: hidden;
    white-space: pre-wrap;
  }

  :global(.digital-art-summary p) {
    margin: 0 0 20px;
  }

  :global(.digital-art-summary p:first-child) {
    margin: 0 0 20px;
  }

  :global(.digital-art-summary p:last-child) {
    margin: 0;
  }

  :global(.underline-links .digital-art-summary a) {
    text-decoration: underline;
  }

  @media (max-width: 767px) {
    .digital-art-summary {
      padding: 5px 0;
    }
  }
</style>
