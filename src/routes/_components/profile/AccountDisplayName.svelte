<script>
  import { emojifyText } from '../../_utils/emojifyText'
  import { autoplayGifs, omitEmojiInDisplayNames } from '../../_store/local'
  import escapeHtml from 'escape-html'
  import { removeEmoji } from '../../_utils/removeEmoji'

  export let account;

  $: emojis = account.emojis || [];
  $: accountName = account.display_name || account.username;
  $: massagedAccountName = (() => {
    const accountNameVal = escapeHtml(accountName)

    if ($omitEmojiInDisplayNames) { // display name emoji are annoying to some screenreader users
      const emojiFreeDisplayName = removeEmoji(accountNameVal, emojis)
      if (emojiFreeDisplayName) {
        return emojiFreeDisplayName
      }
    }

    return emojifyText(accountNameVal, emojis, $autoplayGifs)
  })();
</script>

<span class="account-display-name">{@html massagedAccountName }</span>
<style>
  .account-display-name {
    pointer-events: none; /* allows focus to work correctly, focus on the parent only */
  }
</style>
