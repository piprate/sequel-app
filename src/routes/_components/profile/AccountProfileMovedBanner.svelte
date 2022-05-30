<script>
  import { removeEmoji } from '../../_utils/removeEmoji'
  import Avatar from '../Avatar.svelte'
  import SvgIcon from '../SvgIcon.svelte'
  import { formatIntl } from '../../_utils/formatIntl'
  import { omitEmojiInDisplayNames } from '../../_store/local'

  export let account;

  $: emojis = account.emojis || [];
  $: displayName = account.display_name || account.username;
  $: accessibleName = $omitEmojiInDisplayNames
          ? removeEmoji(displayName, emojis) || displayName
          : displayName;
  $: moved = account.moved;
  $: movedEmojis = moved.emojis || [];
  $: movedDisplayName = moved.display_name || moved.username;
  $: movedAccessibleName = $omitEmojiInDisplayNames
          ? removeEmoji(movedDisplayName, movedEmojis) || movedDisplayName
          : movedDisplayName;
  $: hasMovedLabel = formatIntl('intl.accountHasMoved', { account: accessibleName });
</script>

<div class="account-profile-moved-banner">
  <Avatar className="from-avatar" size="extra-small" {account} />
  <div class="moved-label">
    <SvgIcon className="moved-svg" href="#fa-suitcase" />
    {hasMovedLabel}
  </div>
  <a class="moved-avatar" href="/accounts/{moved.id}">
    <Avatar account={moved} />
  </a>
  <a class="moved-to-name" href="/accounts/{moved.id}" title="@{moved.acct}">{movedAccessibleName}</a>
  <a class="moved-to-acct" href="/accounts/{moved.id}">@{moved.acct}</a>
</div>
<style>
  .account-profile-moved-banner {
    display: grid;
    grid-template-areas: "from-avatar label"
                         "avatar name"
                         "avatar acct";
    grid-template-columns: max-content 1fr;
    margin: 10px 20px;
    grid-row-gap: 10px;
    grid-column-gap: 20px;
  }
  :global(.from-avatar) {
    grid-area: from-avatar;
    justify-self: flex-end;
  }
  :global(.moved-svg) {
    width: 18px;
    height: 18px;
    fill: var(--deemphasized-text-color);
    margin-right: 5px;
  }
  .moved-label, .moved-to-acct, .moved-to-name {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .moved-avatar {
    grid-area: avatar;
  }
  .moved-label {
    grid-area: label;
  }
  .moved-to-acct {
    grid-area: acct;
    font-size: 1.2em;
  }
  .moved-to-name {
    grid-area: name;
    font-weight: 600;
    font-size: 1.1em;
    text-decoration: none;
    color: var(--body-text-color);
  }
  .moved-to-name:hover {
    text-decoration: underline;
  }


</style>