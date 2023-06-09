<script>
  import Avatar from '../Avatar.svelte'
  import WorldDisplayName from './WorldDisplayName.svelte'
  import Timestamp from '../Timestamp.svelte'
  import { isTinyMobileSize, isVeryTinyMobileSize } from '../../_store/local'
  import { importShowMediaDialog } from '../dialog/asyncDialogs/importShowMediaDialog.js'
  import { getImageNativeDimensions } from '../../_utils/getImageNativeDimensions'
  import { formatIntl } from '../../_utils/formatIntl'

  export let world
  export let relationship

  let emojis = []

  $: displayName = world.name
  $: avatarSize = $isVeryTinyMobileSize ? 'small' : $isTinyMobileSize ? 'medium' : 'big'

  async function onAvatarClick() {
    if (!world.avatar) {
      return
    }
    const avatar = world.avatar.url
    const avatarStatic = world.avatar.staticUrl
    const [showMediaDialog, nativeDimensions] = await Promise.all([
      importShowMediaDialog(),
      getImageNativeDimensions(avatarStatic)
    ])
    // pretend this is a media attachment so it will work in the media dialog
    const { width, height } = nativeDimensions
    const mediaAttachments = [
      {
        description: formatIntl('intl.avatarForWorld', { world: displayName }),
        type: 'image',
        previewUrl: avatarStatic,
        url: avatar,
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

<h2 class="sr-only">{intl.nameAndProperties}</h2>
<div class="world-profile-avatar">
  <button class="world-profile-avatar-button" aria-label={intl.clickToSeeAvatar} on:click={onAvatarClick}>
    <Avatar entity={world} size={avatarSize} showNFT={true} />
  </button>
</div>
<div class="world-profile-name">
  <WorldDisplayName {world} />
</div>
<div class="world-profile-created">
  <Timestamp value={world.createdAt} flavour="created" />
</div>
<div class="world-profile-relationship">
  {#if relationship}
    {#if relationship.managed && !relationship.owned}
      <span class="world-profile-relationship-span">{intl.managed}</span>
    {/if}
    {#if relationship.owned}
      <span class="world-profile-relationship-span">{intl.memberTypeOwner}</span>
    {/if}
    {#if relationship && relationship.blocked}
      <span class="world-profile-relationship-span">{intl.blocked}</span>
    {/if}
    {#if relationship && relationship.instanceBlocked}
      <span class="world-profile-relationship-span">{intl.domainHidden}</span>
    {/if}
    {#if relationship && relationship.muted}
      <span class="world-profile-relationship-span">{intl.muted}</span>
    {/if}
  {/if}
</div>

<style>
  .world-profile-relationship {
    grid-area: relationship;
    align-self: center;
    text-transform: uppercase;
    color: var(--deemphasized-text-color);
    font-size: 0.8em;
    white-space: nowrap;
  }
  .world-profile-relationship-span {
    background: rgba(30, 30, 30, 0.2);
    border-radius: 4px;
    padding: 3px 5px;
    white-space: nowrap;
  }
  .world-profile-avatar {
    grid-area: avatar;
  }

  .world-profile-created {
    grid-area: username;
    color: var(--deemphasized-text-color);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    align-self: center;
  }

  .world-profile-name {
    grid-area: name;
    font-size: 1.5em;
    align-self: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    min-width: 0;
  }

  .world-profile-avatar-button {
    border: none;
    background: none;
    margin: 0;
    padding: 0;
    display: flex;
  }

  .world-profile-avatar-button:hover {
    opacity: 0.9;
  }

  .world-profile-avatar-button:active {
    opacity: 0.8;
  }

  :global(a.world-profile-name-link) {
    color: var(--body-text-color);
    text-decoration: none;
  }

  :global(a.world-profile-name-link:hover) {
    color: var(--body-text-color);
    text-decoration: underline;
  }

  :global(.world-profile-label) {
    grid-area: label;
    justify-content: left !important;
  }

  @media (max-width: 767px) {
    .world-profile-name {
      font-size: 1.3em;
    }
    .world-profile-created {
      font-size: 1.1em;
    }
    .world-profile-name,
    .world-profile-created {
      align-self: flex-start;
    }
  }
</style>
