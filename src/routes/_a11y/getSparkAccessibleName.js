import { removeEmoji } from '../_utils/removeEmoji'

export function getSparkAccessibleName(spark, omitEmojiInDisplayNames) {
  const emojis = spark.emojis
  let displayName = spark.name || spark.handle
  if (omitEmojiInDisplayNames) {
    displayName = removeEmoji(displayName, emojis) || displayName
  }
  return displayName
}
