<script>
  import { autoplayGifs } from '../../_store/local';
  import { massageUserText } from '../../_utils/massageUserText';

  export let spark;

  $: note = spark.summary;
  $: emojis = spark.emojis || [];
  $: massagedNote = massageUserText(note, emojis, $autoplayGifs);
</script>

<h2 class="sr-only">{intl.description}</h2>
<div class="spark-profile-note">
  {@html massagedNote}
</div>
<style>
  .spark-profile-note {
    grid-area: note;
    padding: 10px 0;
    font-size: 0.9em;
    word-wrap: break-word;
    overflow: hidden;
    white-space: pre-wrap;
  }

  :global(.spark-profile-note p) {
    margin: 0 0 20px;
  }

  :global(.spark-profile-note p:first-child) {
    margin: 0 0 20px;
  }

  :global(.spark-profile-note p:last-child) {
    margin: 0;
  }

  :global(.underline-links .spark-profile-note a) {
    text-decoration: underline;
  }

  @media (max-width: 767px) {
    .spark-profile-note {
      padding: 5px 0;
    }
  }
</style>
