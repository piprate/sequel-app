<script>
  import EntityDisplayName from '../EntityDisplayName.svelte'
  import { removeEmoji } from '../../_utils/removeEmoji'
  import { omitEmojiInDisplayNames } from '../../_store/local'
  import { formatIntl } from '../../_utils/formatIntl'
  import Media from '../digitalart/Media.svelte'

  export let listing

  let emojis = []

  const mediaList = [listing.object.content]
  const uuid = 'token'

  $: displayName = listing.object.name
  $: accessibleName = (() => {
    return $omitEmojiInDisplayNames
            ? removeEmoji(displayName, emojis) || displayName
            : displayName
  })()
  $: externalLinkLabel = formatIntl('intl.opensInNewWindow', { label: accessibleName })
</script>

<h2 class="sr-only">{intl.nameAndSubscriptions}</h2>
<div class="listing-media">
  <Media media={listing.object.content} {uuid} mediaAttachments={mediaList} index={0} showAsSensitive={false} />
</div>
<div class="listing-name">
  <EntityDisplayName entity={listing.object} />
</div>
<style>
  .listing-name {
    grid-area: name;
    font-size: 1.5em;
    align-self: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    min-width: 0;
  }

  .listing-media {
    grid-area: image;
    display: grid;
    align-items: center;
    justify-content: center;
    justify-items: center;
    grid-column-gap: 5px;
    grid-row-gap: 5px;
    grid-template-columns: repeat(1, 1fr);

    overflow: hidden;
    margin: 10px 10px 10px 5px;
  }

  @media (max-width: 767px) {
    .listing-name {
      font-size: 1.3em;
      align-self: flex-start;
    }
  }
</style>