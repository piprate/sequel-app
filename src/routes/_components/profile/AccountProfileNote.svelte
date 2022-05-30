<script>
  import { autoplayGifs } from '../../_store/local'
  import { massageUserText } from '../../_utils/massageUserText'

  export let account;

  $: note = account.note;
  $: emojis = account.emojis || [];
  $: massagedNote = massageUserText(note, emojis, $autoplayGifs);
</script>

<h2 class="sr-only">{intl.description}</h2>
<div class="account-profile-note">
  {@html massagedNote}
</div>
<style>
  .account-profile-note {
    grid-area: note;
    padding: 10px 0;
    font-size: 0.9em;
    word-wrap: break-word;
    overflow: hidden;
    white-space: pre-wrap;
  }

  :global(.account-profile-note p) {
    margin: 0 0 20px;
  }

  :global(.account-profile-note p:first-child) {
    margin: 0 0 20px;
  }

  :global(.account-profile-note p:last-child) {
    margin: 0;
  }

  :global(.underline-links .account-profile-note a) {
    text-decoration: underline;
  }

  @media (max-width: 767px) {
    .account-profile-note {
      padding: 5px 0;
    }
  }
</style>
