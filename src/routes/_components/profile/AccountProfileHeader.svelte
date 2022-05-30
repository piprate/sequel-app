<script>
  import Avatar from '../Avatar.svelte'
  import ExternalLink from '../ExternalLink.svelte'
  import AccountDisplayName from './AccountDisplayName.svelte'
  import { removeEmoji } from '../../_utils/removeEmoji'
  import { isTinyMobileSize, isVeryTinyMobileSize, omitEmojiInDisplayNames } from '../../_store/local'
  import Label from '../Label.svelte'
  import { importShowMediaDialog } from '../dialog/asyncDialogs/importShowMediaDialog.js'
  import { getImageNativeDimensions } from '../../_utils/getImageNativeDimensions'
  import { formatIntl } from '../../_utils/formatIntl'

  export let account;
  export let relationship;

  $: emojis = account.emojis || [];
  $: displayName = account.display_name || account.username;
  $: accessibleName = (() => {
    return $omitEmojiInDisplayNames
            ? removeEmoji(displayName, emojis) || displayName
            : displayName
  })();
  $: bot = !!account.bot;
  $: label = bot ? 'bot' : '';
  $: avatarSize = $isVeryTinyMobileSize ? 'small' : $isTinyMobileSize ? 'medium' : 'big';
  $: externalLinkLabel = formatIntl('intl.opensInNewWindow', { label: accessibleName });

  async function onAvatarClick() {
    const { avatar, avatar_static: avatarStatic, display_name: displayName, username } = account
    const [showMediaDialog, nativeDimensions] = await Promise.all([
      importShowMediaDialog(),
      getImageNativeDimensions(avatarStatic)
    ])
    // pretend this is a media attachment so it will work in the media dialog
    const { width, height } = nativeDimensions
    const mediaAttachments = [
      {
        description: formatIntl('intl.avatarForAccount', { account: displayName || username }),
        type: 'image',
        preview_url: avatarStatic,
        url: avatar,
        meta: {
          original: {
            width,
            height
          },
          small: {
            width: 100,
            height: 100
          }
        }
      }
    ]
    showMediaDialog(mediaAttachments, /* index */ 0)
  }
</script>

<h2 class="sr-only">{intl.nameAndFollowing}</h2>
<div class="account-profile-avatar">
  <button class="account-profile-avatar-button"
          aria-label="{intl.clickToSeeAvatar}"
          on:click="{onAvatarClick}" >
    <Avatar {account} size={avatarSize} />
  </button>
</div>
<div class="account-profile-name">
  <ExternalLink
          className="account-profile-name-link focus-fix"
          href={account.url}
          showIcon="true"
          normalIconColor="true"
          ariaLabel={externalLinkLabel}>
    <AccountDisplayName {account} />
  </ExternalLink>
</div>
{#if label}
  <Label {label} className="account-profile-label" />
{/if}
<div class="account-profile-username">
  {'@' + account.acct}
</div>
<div class="account-profile-followed-by">
  {#if relationship && relationship.blocking}
    <span class="account-profile-followed-by-span">{intl.blocked}</span>
  {/if}
  {#if relationship && relationship.domain_blocking}
    <span class="account-profile-followed-by-span">{intl.domainHidden}</span>
  {/if}
  {#if relationship && relationship.muting}
    <span class="account-profile-followed-by-span">{intl.muted}</span>
  {/if}
  {#if relationship && relationship.followed_by}
    <span class="account-profile-followed-by-span">{intl.followsYou}</span>
  {/if}
</div>
<style>
  .account-profile-followed-by {
    grid-area: followed-by;
    align-self: center;
    text-transform: uppercase;
    color: var(--deemphasized-text-color);
    font-size: 0.8em;
    white-space: nowrap;
  }
  .account-profile-followed-by-span {
    background: rgba(30, 30, 30, 0.2);
    border-radius: 4px;
    padding: 3px 5px;
    white-space: nowrap;
  }
  .account-profile-avatar {
    grid-area: avatar;
  }

  .account-profile-username {
    grid-area: username;
    color: var(--deemphasized-text-color);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    align-self: center;
  }

  .account-profile-name {
    grid-area: name;
    font-size: 1.5em;
    align-self: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    min-width: 0;
  }

  .account-profile-avatar-button {
    border: none;
    background: none;
    margin: 0;
    padding: 0;
    display: flex;
  }

  .account-profile-avatar-button:hover {
    opacity: 0.9;
  }

  .account-profile-avatar-button:active {
    opacity: 0.8;
  }

  :global(a.account-profile-name-link) {
    color: var(--body-text-color);
    text-decoration: none;
  }

  :global(a.account-profile-name-link:hover) {
    color: var(--body-text-color);
    text-decoration: underline;
  }

  :global(.account-profile-label) {
    grid-area: label;
    justify-content: left !important;
  }

  @media (max-width: 767px) {
    .account-profile-name {
      font-size: 1.3em;
    }
    .account-profile-username {
      font-size: 1.1em;
    }
    .account-profile-name, .account-profile-username {
      align-self: flex-start;
    }
  }
</style>