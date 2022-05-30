<script>
  import { autoplayGifs } from '../../_store/local'
  import { massageUserText } from '../../_utils/massageUserText'

  export let listing

  let emojis = []

  $: summary = (listing.object && listing.object.description) || ""
  $: massagedSummary = massageUserText(summary, emojis, $autoplayGifs)
</script>

<h2 class="sr-only">{intl.description}</h2>
<div class="listing-summary">
  {@html massagedSummary}
</div>
<style>
  .listing-summary {
    grid-area: summary;
    padding: 10px 0;
    font-size: 0.9em;
    word-wrap: break-word;
    overflow: hidden;
    white-space: pre-wrap;
  }

  :global(.listing-summary p) {
    margin: 0 0 20px;
  }

  :global(.listing-summary p:first-child) {
    margin: 0 0 20px;
  }

  :global(.listing-summary p:last-child) {
    margin: 0;
  }

  :global(.underline-links .listing-summary a) {
    text-decoration: underline;
  }

  @media (max-width: 767px) {
    .listing-summary {
      padding: 5px 0;
    }
  }
</style>
