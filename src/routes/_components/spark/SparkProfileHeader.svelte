<script>
  import Avatar from '../Avatar.svelte';
  import SparkDisplayName from './SparkDisplayName.svelte';
  import { removeEmoji } from '../../_utils/removeEmoji';
  import { currentInstance, isTinyMobileSize, isVeryTinyMobileSize, omitEmojiInDisplayNames } from '../../_store/local';
  import Label from '../Label.svelte';
  import Location from "../Location.svelte";
  import CreatedAt from "../CreatedAt.svelte";
  import { importShowMediaDialog } from '../dialog/asyncDialogs/importShowMediaDialog.js';
  import { getImageNativeDimensions } from '../../_utils/getImageNativeDimensions';
  import { formatIntl } from '../../_utils/formatIntl';
  import { fediverseHandle } from "../../_utils/mapper";

  export let spark;
  export let relationship;

  $: emojis = spark.emojis || [];
  $: displayName = spark.name;
  $: handle = fediverseHandle(spark, $currentInstance);
  $: accessibleName = (() => {
    return $omitEmojiInDisplayNames
            ? removeEmoji(displayName, emojis) || displayName
            : displayName;
  })();
  $: bot = !!spark.bot;
  $: label = bot ? 'bot' : '';
  $: avatarSize = $isVeryTinyMobileSize ? 'small' : $isTinyMobileSize ? 'medium' : 'big';
  $: externalLinkLabel = formatIntl('intl.opensInNewWindow', { label: accessibleName });

  async function onAvatarClick () {
    if (!spark.avatar) {
      return
    }
    const avatar = spark.avatar.url
    const avatarStatic = spark.avatar.staticUrl
    const [showMediaDialog, nativeDimensions] = await Promise.all([
      importShowMediaDialog(),
      getImageNativeDimensions(avatarStatic)
    ]);
    // pretend this is a media attachment so it will work in the media dialog
    const { width, height } = nativeDimensions;
    const mediaAttachments = [
      {
        description: formatIntl('intl.avatarForSpark', { spark: displayName }),
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
    ];
    showMediaDialog(mediaAttachments, /* index */ 0);
  }
</script>

<h2 class="sr-only">{intl.nameAndSubscriptions}</h2>
<div class="spark-profile-avatar">
  <button class="spark-profile-avatar-button"
          aria-label="{intl.clickToSeeAvatar}"
          on:click="{onAvatarClick}" >
    <Avatar entity={spark} size={avatarSize} showNFT="{true}" />
  </button>
</div>
<div class="spark-profile-name">
  <SparkDisplayName {spark} />
</div>
{#if label}
  <Label {label} className="spark-profile-label" />
{/if}
<div class="spark-profile-username">
  {handle}
</div>
<div class="spark-profile-properties">
  {#if spark.homeWorldRef }
    <Location world={spark.homeWorldRef} />
  {/if}
  <CreatedAt createdAt={spark.createdAt} className={ spark.homeWorldRef ? 'with-left-margin' : '' } flavour="joined" />
</div>
<div class="spark-profile-relationship">
  {#if relationship && relationship.managed}
    <span class="spark-profile-relationship-span">{intl.me}</span>
  {/if}
  {#if relationship && relationship.blocked}
    <span class="spark-profile-relationship-span">{intl.blocked}</span>
  {/if}
  {#if relationship && relationship.instanceBlocked}
    <span class="spark-profile-relationship-span">{intl.domainHidden}</span>
  {/if}
  {#if relationship && relationship.muted}
    <span class="spark-profile-relationship-span">{intl.muted}</span>
  {/if}
  {#if relationship && relationship.subscriber}
    <span class="spark-profile-relationship-span">{intl.isSubscriber}</span>
  {/if}
</div>
<style>
  .spark-profile-relationship {
    grid-area: relationship;
    align-self: center;
    text-transform: uppercase;
    color: var(--deemphasized-text-color);
    font-size: 0.8em;
    white-space: nowrap;
  }
  .spark-profile-relationship-span {
    background: rgba(30, 30, 30, 0.2);
    border-radius: 4px;
    padding: 3px 5px;
    white-space: nowrap;
  }
  .spark-profile-avatar {
    grid-area: avatar;
  }

  .spark-profile-username {
    grid-area: username;
    color: var(--deemphasized-text-color);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    align-self: center;
  }

  .spark-profile-properties {
    grid-area: properties;
    color: var(--deemphasized-text-color);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    align-self: center;
  }

  .spark-profile-name {
    grid-area: name;
    font-size: 1.5em;
    align-self: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    min-width: 0;
  }

  .spark-profile-avatar-button {
    border: none;
    background: none;
    margin: 0;
    padding: 0;
    display: flex;
  }

  .spark-profile-avatar-button:hover {
    opacity: 0.9;
  }

  .spark-profile-avatar-button:active {
    opacity: 0.8;
  }

  :global(a.spark-profile-name-link) {
    color: var(--body-text-color);
    text-decoration: none;
  }

  :global(a.spark-profile-name-link:hover) {
    color: var(--body-text-color);
    text-decoration: underline;
  }

  :global(.spark-profile-label) {
    grid-area: label;
    justify-content: left !important;
  }

  @media (max-width: 767px) {
    .spark-profile-name {
      font-size: 1.3em;
    }
    .spark-profile-username {
      font-size: 1.1em;
    }
    .spark-profile-name, .spark-profile-username {
      align-self: flex-start;
    }
  }
</style>