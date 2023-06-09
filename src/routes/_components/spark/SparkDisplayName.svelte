<script>
  import { emojifyText } from '../../_utils/emojifyText'
  import { autoplayGifs, omitEmojiInDisplayNames } from '../../_store/local'
  import escapeHtml from 'escape-html'
  import { removeEmoji } from '../../_utils/removeEmoji'

  export let spark

  $: emojis = spark.emojis || []
  $: sparkName = spark.name || spark.handle
  $: massagedSparkName = (() => {
    const sparkNameVal = escapeHtml(sparkName)

    if ($omitEmojiInDisplayNames) {
      // display name emoji are annoying to some screenreader users
      const emojiFreeDisplayName = removeEmoji(sparkNameVal, emojis)
      if (emojiFreeDisplayName) {
        return emojiFreeDisplayName
      }
    }

    return emojifyText(sparkNameVal, emojis, $autoplayGifs)
  })()
</script>

<span class="spark-display-name">{@html massagedSparkName}</span>

<style>
  .spark-display-name {
    pointer-events: none; /* allows focus to work correctly, focus on the parent only */
  }
</style>
