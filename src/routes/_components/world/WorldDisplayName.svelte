<script>
  import { emojifyText } from '../../_utils/emojifyText'
  import { autoplayGifs, omitEmojiInDisplayNames } from '../../_store/local'
  import escapeHtml from 'escape-html'
  import { removeEmoji } from '../../_utils/removeEmoji'

  export let world;

  let emojis = [];

  $: worldName = world.name;
  $: massagedworldName = (() => {
    const worldNameVal = escapeHtml(worldName)

    if ($omitEmojiInDisplayNames) { // display name emoji are annoying to some screenreader users
      const emojiFreeDisplayName = removeEmoji(worldNameVal, [])
      if (emojiFreeDisplayName) {
        return emojiFreeDisplayName
      }
    }

    return emojifyText(worldNameVal, emojis, $autoplayGifs)
  })();
</script>

<span class="world-display-name">{@html massagedworldName }</span>
<style>
  .world-display-name {
    pointer-events: none; /* allows focus to work correctly, focus on the parent only */
  }
</style>
