<script>
  import Avatar from '../Avatar.svelte'
  import BubbleDisplayName from './BubbleDisplayName.svelte'
  import Location from '../Location.svelte'
  import Timestamp from '../Timestamp.svelte'
  import { isTinyMobileSize, isVeryTinyMobileSize } from '../../_store/local'
  import { importShowMediaDialog } from '../dialog/asyncDialogs/importShowMediaDialog.js'
  import { getImageNativeDimensions } from '../../_utils/getImageNativeDimensions'
  import { formatIntl } from '../../_utils/formatIntl'

  export let bubble
  export let relationship

  let emojis = []

  $: avatarSize = $isVeryTinyMobileSize ? 'small' : $isTinyMobileSize ? 'medium' : 'big'
  $: joined = relationship && relationship.status === 'active'
  $: memberType = joined ? relationship.memberType : ''
  $: memberTypeLabel = (() => {
    switch (memberType) {
      case 'owner':
        return 'intl.memberTypeOwner'
      case 'moderator':
        return 'intl.memberTypeModerator'
      case 'writer':
        return 'intl.memberTypeMember'
      case 'observer':
        return 'intl.memberTypeReader'
    }
    return ''
  })()
  $: readOnlyLabel = bubble.writerMode === 'none' ? 'intl.readOnly' : ''
  $: inviteOnlyLabel = bubble.membershipMode === 'invite_only' ? 'intl.inviteOnly' : ''
  $: federationLabel =
    bubble.federationMode === 'enabled'
      ? 'intl.federationEnabled'
      : bubble.federationMode === 'continuous_mirror'
      ? 'intl.federationAlways'
      : ''

  async function onAvatarClick() {
    if (!bubble.avatar) {
      return
    }
    const avatar = bubble.avatar.url
    const avatarStatic = bubble.avatar.staticUrl
    const [showMediaDialog, nativeDimensions] = await Promise.all([
      importShowMediaDialog(),
      getImageNativeDimensions(avatarStatic)
    ])
    // pretend this is a media attachment so it will work in the media dialog
    const { width, height } = nativeDimensions
    const mediaAttachments = [
      {
        description: formatIntl('intl.avatarForBubble', { bubble: bubble.name }),
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
<div class="bubble-profile-avatar">
  <button class="bubble-profile-avatar-button" aria-label={intl.clickToSeeAvatar} on:click={onAvatarClick}>
    <Avatar entity={bubble} size={avatarSize} showNFT={true} />
  </button>
</div>
<div class="bubble-profile-name">
  <BubbleDisplayName {bubble} />
</div>
<div class="bubble-profile-properties">
  {#if bubble.worldRef}
    <Location world={bubble.worldRef} />
  {/if}
  <Timestamp value={bubble.createdAt} className={bubble.worldRef ? 'with-left-margin' : ''} flavour="created" />
</div>
<div class="bubble-profile-relationship">
  {#if relationship}
    {#if relationship.managed && memberType !== 'owner'}
      <span class="bubble-sticker">{intl.managed}</span>
    {/if}
    {#if memberTypeLabel}
      <span class="bubble-sticker">{memberTypeLabel}</span>
    {/if}
    {#if relationship.blocked}
      <span class="bubble-sticker">{intl.blocked}</span>
    {/if}
    {#if relationship.muted}
      <span class="bubble-sticker">{intl.muted}</span>
    {/if}
  {/if}
</div>
<div class="bubble-attributes">
  {#if readOnlyLabel}
    <span class="bubble-sticker">{readOnlyLabel}</span>
  {/if}
  {#if inviteOnlyLabel}
    <span class="bubble-sticker">{inviteOnlyLabel}</span>
  {/if}
  {#if federationLabel}
    <span class="bubble-sticker">{federationLabel}</span>
  {/if}
</div>

<style>
  .bubble-profile-relationship {
    grid-area: relationship;
    align-self: center;
    text-transform: uppercase;
    color: var(--body-text-color);
    font-size: 0.8em;
    white-space: nowrap;
  }
  .bubble-attributes {
    grid-area: attributes;
    align-self: center;
    text-transform: uppercase;
    color: var(--deemphasized-text-color);
    font-size: 0.8em;
    white-space: nowrap;
  }
  .bubble-sticker {
    background: rgba(30, 30, 30, 0.2);
    border-radius: 4px;
    padding: 3px 5px;
    white-space: nowrap;
  }
  .bubble-profile-avatar {
    grid-area: avatar;
  }

  /*.bubble-profile-username {*/
  /*  grid-area: username;*/
  /*  color: var(--deemphasized-text-color);*/
  /*  white-space: nowrap;*/
  /*  overflow: hidden;*/
  /*  text-overflow: ellipsis;*/
  /*  align-self: center;*/
  /*}*/

  .bubble-profile-properties {
    grid-area: properties;
    color: var(--deemphasized-text-color);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    align-self: center;
  }

  .bubble-profile-name {
    grid-area: name;
    font-size: 1.5em;
    align-self: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    min-width: 0;
  }

  .bubble-profile-avatar-button {
    border: none;
    background: none;
    margin: 0;
    padding: 0;
    display: flex;
  }

  .bubble-profile-avatar-button:hover {
    opacity: 0.9;
  }

  .bubble-profile-avatar-button:active {
    opacity: 0.8;
  }

  :global(a.bubble-profile-name-link) {
    color: var(--body-text-color);
    text-decoration: none;
  }

  :global(a.bubble-profile-name-link:hover) {
    color: var(--body-text-color);
    text-decoration: underline;
  }

  :global(.bubble-profile-label) {
    grid-area: label;
    justify-content: left !important;
  }

  @media (max-width: 767px) {
    .bubble-profile-name {
      font-size: 1.3em;
    }
    /*.bubble-profile-username {*/
    /*  font-size: 1.1em;*/
    /*}*/
    /*.bubble-profile-name, .bubble-profile-username {*/
    .bubble-profile-name {
      align-self: flex-start;
    }
  }
</style>
