<script>
  import { emojifyText } from '../../_utils/emojifyText'
  import { autoplayGifs, omitEmojiInDisplayNames } from '../../_store/local'
  import escapeHtml from 'escape-html'
  import { removeEmoji } from '../../_utils/removeEmoji'

  export let bubble

  let emojis = []

  $: bubbleName = bubble.name
  $: massagedBubbleName = (() => {
    const bubbleNameVal = escapeHtml(bubbleName)

    if ($omitEmojiInDisplayNames) {
      // display name emoji are annoying to some screenreader users
      const emojiFreeDisplayName = removeEmoji(bubbleNameVal, [])
      if (emojiFreeDisplayName) {
        return emojiFreeDisplayName
      }
    }

    return emojifyText(bubbleNameVal, emojis, $autoplayGifs)
  })()
</script>

<span class="bubble-display-name">{@html massagedBubbleName}</span>

<style>
  .bubble-display-name {
    pointer-events: none; /* allows focus to work correctly, focus on the parent only */
  }
</style>
