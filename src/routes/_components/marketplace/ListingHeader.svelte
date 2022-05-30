<script>
  import EntityDisplayName from '../EntityDisplayName.svelte'
  import CreatedAt from '../CreatedAt.svelte'
  import TokenMedia from './TokenMedia.svelte'
  import { removeEmoji } from '../../_utils/removeEmoji'
  import { omitEmojiInDisplayNames } from '../../_store/local'
  import { importShowMediaDialog } from '../dialog/asyncDialogs/importShowMediaDialog.js'
  import { getImageNativeDimensions } from '../../_utils/getImageNativeDimensions'
  import { formatIntl } from '../../_utils/formatIntl'

  export let listing

  let emojis = []

  $: displayName = listing.object.name
  $: accessibleName = (() => {
    return $omitEmojiInDisplayNames
            ? removeEmoji(displayName, emojis) || displayName
            : displayName
  })()
  $: externalLinkLabel = formatIntl('intl.opensInNewWindow', { label: accessibleName })

  async function onAvatarClick () {
    if (!listing.object.content) {
      return
    }
    const imageUrl = listing.object.content.url
    const imageUrlStatic = listing.object.content.staticUrl
    const [showMediaDialog, nativeDimensions] = await Promise.all([
      importShowMediaDialog(),
      getImageNativeDimensions(imageUrlStatic)
    ])
    // pretend this is a media attachment, so it will work in the media dialog
    const { width, height } = nativeDimensions
    const mediaAttachments = [
      {
        description: formatIntl('intl.imageForToken', { token: displayName }),
        type: 'image',
        previewUrl: imageUrlStatic,
        url: imageUrl,
        meta: {
          width,
          height
        },
        thumbnails: {
          preview: {
            width: 100,
            height: 100
          }
        }
      }
    ]
    showMediaDialog(mediaAttachments, /* index */ 0)
  }
</script>

<h2 class="sr-only">{intl.nameAndSubscriptions}</h2>
<div class="listing-image">
  <button class="listing-image-button"
          aria-label="{intl.clickToSeeAvatar}"
          on:click="{onAvatarClick}" >
    <TokenMedia content={listing.object.content} size="big" />
  </button>
</div>
<div class="listing-name">
  <EntityDisplayName entity={listing.object} />
</div>
<div class="listing-created">
  <CreatedAt createdAt={listing.createdAt} flavour="created" />
</div>
<style>
  .listing-image {
    grid-area: image;
  }

  .listing-created {
    grid-area: created;
    color: var(--deemphasized-text-color);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    align-self: center;
  }

  .listing-name {
    grid-area: name;
    font-size: 1.5em;
    align-self: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    min-width: 0;
  }

  .listing-image-button {
    border: none;
    background: none;
    margin: 0;
    padding: 0;
    display: flex;
  }

  .listing-image-button:hover {
    opacity: 0.9;
  }

  .listing-image-button:active {
    opacity: 0.8;
  }

  :global(a.listing-name-link) {
    color: var(--body-text-color);
    text-decoration: none;
  }

  :global(a.listing-name-link:hover) {
    color: var(--body-text-color);
    text-decoration: underline;
  }

  :global(.listing-label) {
    grid-area: label;
    justify-content: left !important;
  }

  @media (max-width: 767px) {
    .listing-name {
      font-size: 1.3em;
    }
    .listing-created {
      font-size: 1.1em;
    }
    .listing-name, .listing-created {
      align-self: flex-start;
    }
  }
</style>