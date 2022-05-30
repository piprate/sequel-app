<script>
  import Status from './Status.svelte'
  import StatusHeader from './StatusHeader.svelte'
  import Shortcut from '../shortcut/Shortcut.svelte'
  import { omitEmojiInDisplayNames, underlineLinks, currentInstance } from '../../_store/local'
  import { getAccountAccessibleName } from '../../_a11y/getAccountAccessibleName'
  import { goto } from '@sapper/app';
  import { composeNewStatusMentioning } from '../../_actions/mention'
  import { classname } from '../../_utils/classname'
  import { createStatusOrNotificationUuid } from '../../_utils/createStatusOrNotificationUuid'
  import { formatIntl } from '../../_utils/formatIntl'

  export let notification;
  export let timelineType;
  export let timelineValue;
  export let enableShortcuts = null;
  export let index;
  export let length;

  $: account = notification.account;
  $: accountId = account.id;
  $: notificationId = notification.id;
  $: status = notification.status;
  $: statusId = status && status.id;
  $: uuid = (
          createStatusOrNotificationUuid($currentInstance, timelineType, timelineValue, notificationId, statusId)
  );
  $: elementId = uuid;
  $: shortcutScope = elementId;
  $: ariaLabel = (
          !status && formatIntl('intl.accountFollowedYou', {
            name: getAccountAccessibleName(account, $omitEmojiInDisplayNames),
            account: `@${account.acct}`
          })
  );
  $: className = (classname(
          'notification-article',
          'shortcut-list-item',
          'focus-fix',
          $underlineLinks && 'underline-links'
  ));

  function openAuthorProfile() {
    goto(`/accounts/${accountId}`)
  }

  async function mentionAuthor() {
    await composeNewStatusMentioning(account)
  }
</script>

{#if status}
  <Status {index} {length} {timelineType} {timelineValue}
          {status} {notification} {enableShortcuts} on:recalculateHeight
  />
{:else}
  <article id={elementId}
           class={className}
           tabindex="0"
           aria-posinset={index + 1}
           aria-setsize={length}
           aria-label={ariaLabel}
  >
    <StatusHeader {notification} {notificationId} {status} {statusId} {timelineType}
                  {account} {accountId} {uuid} isStatusInNotification="true" />
    {#if enableShortcuts}
      <Shortcut scope={shortcutScope} key="p" on:pressed="{openAuthorProfile}" />
      <Shortcut scope={shortcutScope} key="m" on:pressed="{mentionAuthor}" />
    {/if}
  </article>
{/if}
<style>
  .notification-article {
    padding: var(--status-pad-v) var(--status-pad-h);
    width: 560px;
    max-width: calc(100vw - 40px);
    border-bottom: 1px solid var(--main-border);
  }
  @media (max-width: 767px) {
    .notification-article {
      max-width: calc(100vw - 20px);
      width: 580px;
    }
  }
</style>