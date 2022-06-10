<script>
  import { autoplayGifs } from '../../_store/local';
  import { massageUserText } from '../../_utils/massageUserText';

  export let world;

  let emojis = [];
  
  $: massagedSummary = massageUserText(world.summaryHTML, emojis, $autoplayGifs);
</script>

<h2 class="sr-only">{intl.description}</h2>
<div class="world-profile-summary">
  {@html massagedSummary}
</div>
<style>
  .world-profile-summary {
    grid-area: summary;
    padding: 10px 0;
    font-size: 0.9em;
    word-wrap: break-word;
    overflow: hidden;
    white-space: pre-wrap;
  }

  :global(.world-profile-summary p) {
    margin: 0 0 20px;
  }

  :global(.world-profile-summary p:first-child) {
    margin: 0 0 20px;
  }

  :global(.world-profile-summary p:last-child) {
    margin: 0;
  }

  :global(.underline-links .world-profile-summary a) {
    text-decoration: underline;
  }

  @media (max-width: 767px) {
    .world-profile-summary {
      padding: 5px 0;
    }
  }
</style>
