<script>
  import IconButton from '../IconButton.svelte'
  import { importShowWorldProfileOptionsDialog } from '../dialog/asyncDialogs/importShowWorldProfileOptionsDialog.js'
  import { LOCALE } from '../../_static/intl'
  import { formatIntl } from '../../_utils/formatIntl'
  import { thunk } from '../../_utils/thunk'
  import { unwrap } from "../../_utils/mapper";

  const numberFormat = thunk(() => new Intl.NumberFormat(LOCALE))

  export let world;
  export let relationship;
  export let ourSpark;

  $: worldId = unwrap(world.id);
  $: numPosts = world.postCount || 0;
  $: numMembers = world.memberCount || 0;
  $: numBubbles = world.bubbleCount || 0;
  $: numPostsDisplay = numberFormat().format(numPosts);
  $: numMembersDisplay = numberFormat().format(numMembers);
  $: numBubblesDisplay = numberFormat().format(numBubbles);
  $: bubblesLabel = formatIntl('intl.bubblesLabel', { count: numBubbles });
  $: membersLabel = formatIntl('intl.membersLabel', { count: numMembers });
  $: sparkSelected = !!ourSpark;

  async function onMoreOptionsClick() {
    const showWorldProfileOptionsDialog = await importShowWorldProfileOptionsDialog();
    showWorldProfileOptionsDialog(world, relationship, ourSpark);
  }
</script>

<h2 class="sr-only">{intl.statisticsAndMoreOptions}</h2>
<div class="world-profile-details">
  <div class="world-profile-details-item">
    <span class="world-profile-details-item-title">
      {intl.posts}
    </span>
    <span class="world-profile-details-item-datum">
      {numPostsDisplay}
    </span>
  </div>
  <a class="world-profile-details-item"
     href='/worlds/{worldId}/members'
     aria-label={membersLabel}
     sapper:prefetch
  >
    <span class="world-profile-details-item-title">
      {intl.members}
    </span>
    <span class="world-profile-details-item-datum">
      {numMembersDisplay}
    </span>
  </a>
  <a class="world-profile-details-item"
     href='/worlds/{worldId}/bubbles'
     aria-label={bubblesLabel}
     sapper:prefetch
  >
    <span class="world-profile-details-item-title">
      {intl.bubbles}
    </span>
    <span class="world-profile-details-item-datum">
      {numBubblesDisplay}
    </span>
  </a>
  {#if sparkSelected }
  <div class="world-profile-more-options">
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
  .world-profile-details {
    grid-area: details;
    display: grid;
    margin: 0 5px;
    align-items: center;
    grid-template-columns: 1fr 1fr 1fr min-content;
  }

  .world-profile-details-item {
    display: flex;
    flex-direction: row;
    padding: 5px;
    justify-content: center;
    font-size: 1.1em;
  }

  .world-profile-details-item:hover {
    text-decoration: none;
    background: var(--button-bg-hover);
    cursor: pointer;
  }

  .world-profile-details-item:active {
    background: var(--button-bg-active);
  }

  .world-profile-details-item-title {
    text-transform: uppercase;
    color: var(--deemphasized-text-color);
    margin-right: 5px;
  }

  .world-profile-details-item-datum {
    color: var(--body-text-color);
    margin-left: 5px;
    font-weight: 600;
  }

  @media (max-width: 767px) {
    .world-profile-details-item {
      flex-direction: column;
      margin-left: 5px;
      margin-right: 5px;
    }

    .world-profile-details-item:last-child {
      margin-right: 0;
    }

    .world-profile-details-item:first-child {
      margin-left: 0;
    }

    .world-profile-details-item-title {
      margin-right: 0;
      text-align: center;
    }
    .world-profile-details-item-datum {
      margin-left: 0;
      text-align: center;
    }
    .world-profile-details-item {
      font-size: 1em;
    }
  }

  @media (max-width: 240px) {
    .world-profile-details {
      grid-template-columns: 1fr 1fr 1fr;
    }
    .world-profile-more-options {
      justify-self: flex-end;
      grid-column: 1 / 4;
    }
  }
</style>
