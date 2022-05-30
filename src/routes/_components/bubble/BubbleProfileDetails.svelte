<script>
  import IconButton from '../IconButton.svelte';
  import { importShowBubbleProfileOptionsDialog } from '../dialog/asyncDialogs/importShowBubbleProfileOptionsDialog.js';
  import { LOCALE } from '../../_static/intl';
  import { formatIntl } from '../../_utils/formatIntl';
  import { thunk } from '../../_utils/thunk';
  import { unwrap } from "../../_utils/mapper";

  const numberFormat = thunk(() => new Intl.NumberFormat(LOCALE));

  export let bubble;
  export let relationship;
  export let ourSpark;

  $: bubbleId = unwrap(bubble.id);
  $: numPosts = bubble.postCount || 0;
  $: numMembers = bubble.memberCount || 0;
  $: numAssets = bubble.assetCount || 0;
  $: numPostsDisplay = numberFormat().format(numPosts);
  $: numMembersDisplay = numberFormat().format(numMembers);
  $: numAssetsDisplay = numberFormat().format(numAssets);
  $: membersLabel = formatIntl('intl.bubbleMembersLabel', { count: numMembers });
  $: sparkSelected = !!ourSpark;

  async function onMoreOptionsClick () {
    const showBubbleProfileOptionsDialog = await importShowBubbleProfileOptionsDialog();
    showBubbleProfileOptionsDialog(bubble, relationship, ourSpark);
  }
</script>

<h2 class="sr-only">{intl.statisticsAndMoreOptions}</h2>
<div class="bubble-profile-details">
  <div class="bubble-profile-details-item">
    <span class="bubble-profile-details-item-title">
      {intl.posts}
    </span>
    <span class="bubble-profile-details-item-datum">
      {numPostsDisplay}
    </span>
  </div>
  <a class="bubble-profile-details-item"
     href='/bubbles/{bubbleId}/members'
     aria-label={membersLabel}
     sapper:prefetch
  >
    <span class="bubble-profile-details-item-title">
      {intl.members}
    </span>
    <span class="bubble-profile-details-item-datum">
      {numMembersDisplay}
    </span>
  </a>
  <div class="bubble-profile-details-item">
    <span class="bubble-profile-details-item-title">
      {intl.assets}
    </span>
    <span class="bubble-profile-details-item-datum">
      {numAssetsDisplay}
    </span>
  </div>
  {#if sparkSelected }
  <div class="bubble-profile-more-options">
    <IconButton
      label="{intl.moreOptions}"
      href="#fa-bars"
      muted="true"
      on:click="{onMoreOptionsClick}"
    />
  </div>
  {/if}
</div>
<style>
  .bubble-profile-details {
    grid-area: details;
    display: grid;
    margin: 0 5px;
    align-items: center;
    grid-template-columns: 1fr 1fr 1fr min-content;
  }

  .bubble-profile-details-item {
    display: flex;
    flex-direction: row;
    padding: 5px;
    justify-content: center;
    font-size: 1.1em;
  }

  .bubble-profile-details-item:hover {
    text-decoration: none;
    background: var(--button-bg-hover);
    cursor: pointer;
  }

  .bubble-profile-details-item:active {
    background: var(--button-bg-active);
  }

  .bubble-profile-details-item-title {
    text-transform: uppercase;
    color: var(--deemphasized-text-color);
    margin-right: 5px;
  }

  .bubble-profile-details-item-datum {
    color: var(--body-text-color);
    margin-left: 5px;
    font-weight: 600;
  }

  @media (max-width: 767px) {
    .bubble-profile-details-item {
      flex-direction: column;
      margin-left: 5px;
      margin-right: 5px;
    }

    .bubble-profile-details-item:last-child {
      margin-right: 0;
    }

    .bubble-profile-details-item:first-child {
      margin-left: 0;
    }

    .bubble-profile-details-item-title {
      margin-right: 0;
      text-align: center;
    }
    .bubble-profile-details-item-datum {
      margin-left: 0;
      text-align: center;
    }
    .bubble-profile-details-item {
      font-size: 1em;
    }
  }

  @media (max-width: 240px) {
    .bubble-profile-details {
      grid-template-columns: 1fr 1fr 1fr;
    }
    .bubble-profile-more-options {
      justify-self: flex-end;
      grid-column: 1 / 4;
    }
  }
</style>
