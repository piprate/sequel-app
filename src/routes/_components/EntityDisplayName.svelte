<script>
  import { emojifyText } from '../_utils/emojifyText';
  import { autoplayGifs, omitEmojiInDisplayNames } from '../_store/local';
  import escapeHtml from 'escape-html';
  import { removeEmoji } from '../_utils/removeEmoji';

  export let entity;

  let emojis = [];

  $: entityName = entity.name;
  $: massagedEntityName = (() => {
    const entityNameVal = escapeHtml(entityName);

    if ($omitEmojiInDisplayNames) { // display name emoji are annoying to some screenreader users
      const emojiFreeDisplayName = removeEmoji(entityNameVal, []);
      if (emojiFreeDisplayName) {
        return emojiFreeDisplayName;
      }
    }

    return emojifyText(entityNameVal, emojis, $autoplayGifs);
  })();
</script>

<span class="entity-display-name">{@html massagedEntityName }</span>
<style>
  .entity-display-name {
    pointer-events: none; /* allows focus to work correctly, focus on the parent only */
  }
</style>
