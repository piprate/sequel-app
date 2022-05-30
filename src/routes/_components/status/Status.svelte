<script>
  import StatusSidebar from './StatusSidebar.svelte'
  import StatusHeader from './StatusHeader.svelte'
  import StatusAuthorName from './StatusAuthorName.svelte'
  import StatusAuthorHandle from './StatusAuthorHandle.svelte'
  import StatusRelativeDate from './StatusRelativeDate.svelte'
  import StatusDetails from './StatusDetails.svelte'
  import StatusCard from './StatusCard.svelte'
  import StatusToolbar from './StatusToolbar.svelte'
  import StatusMediaAttachments from './StatusMediaAttachments.svelte'
  import StatusContent from './StatusContent.svelte'
  import StatusSpoiler from './StatusSpoiler.svelte'
  import StatusComposeBox from './StatusComposeBox.svelte'
  import StatusMentions from './StatusMentions.svelte'
  import StatusPoll from './StatusPoll.svelte'
  import Shortcut from '../shortcut/Shortcut.svelte'
  import {
    currentInstance,
    omitEmojiInDisplayNames,
    disableLongAriaLabels,
    disableRelativeTimestamps,
    disableTapOnStatus,
    hideCards,
    now,
    repliesShown,
    spoilersShown,
    underlineLinks
  } from '../../_store/local'
  import { goto } from '@sapper/app';
  import { registerClickDelegate } from '../../_utils/delegate'
  import { classname } from '../../_utils/classname'
  import { checkDomAncestors } from '../../_utils/checkDomAncestors'
  import { scheduleIdleTask } from '../../_utils/scheduleIdleTask'
  import { getAccountAccessibleName } from '../../_a11y/getAccountAccessibleName'
  import { getAccessibleLabelForStatus } from '../../_a11y/getAccessibleLabelForStatus'
  import { formatTimeagoDate } from '../../_intl/formatTimeagoDate'
  import { measureText } from '../../_utils/measureText'
  import { LONG_POST_LENGTH, LONG_POST_TEXT } from '../../_static/statuses'
  import { absoluteDateFormatter, dayOnlyAbsoluteDateFormatter } from '../../_utils/formatters'
  import { composeNewStatusMentioning } from '../../_actions/mention'
  import { createStatusOrNotificationUuid } from '../../_utils/createStatusOrNotificationUuid'
  import { addEmojiTooltips } from '../../_utils/addEmojiTooltips'
  import {onMount} from "svelte";

  const INPUT_TAGS = new Set(['a', 'button', 'input', 'textarea', 'label'])
  const isUserInputElement = node => INPUT_TAGS.has(node.localName)
  const isToolbar = node => node.classList.contains('status-toolbar')
  const isStatusArticle = node => node.classList.contains('status-article')

  export let status;
  export let timelineType;
  export let timelineValue;
  export let index;
  export let length;
  export let notification = undefined;
  export let enableShortcuts = null;

  let replyVisibility = undefined;
  let preloadHiddenContent = false;

  $: originalStatus = status.reblog ? status.reblog : status;
  $: originalStatusId = originalStatus.id;
  $: statusId = status.id;
  $: notificationId = notification && notification.id;
  $: account = (notification && notification.account) || status.account;
  $: accountId = account.id;
  $: originalAccount = originalStatus.account;
  $: originalAccountId = originalAccount.id;
  $: accountForShortcut = notification ? notification.account : originalAccount;
  $: visibility = originalStatus.visibility;
  $: plainTextContent = originalStatus.plainTextContent || '';
  $: plainTextContentOverLength = (
          // measureText() is expensive, so avoid doing it when possible.
          // Also measureText() typically only makes text shorter, not longer, so we can measure the raw length
          // as a shortcut. (The only case where it makes text longer is with short URLs which get expanded to a longer
          // placeholder.) This isn't 100% accurate, but we don't need perfect accuracy here because this is just
          // to show a "long post" content warning.
          plainTextContent.length > LONG_POST_LENGTH && measureText(plainTextContent) > LONG_POST_LENGTH
  );
  $: spoilerText = originalStatus.spoiler_text || (plainTextContentOverLength && LONG_POST_TEXT);
  $: inReplyToId = originalStatus.in_reply_to_id;
  $: uuid = createStatusOrNotificationUuid($currentInstance, timelineType, timelineValue, notificationId, statusId);
  $: elementId = uuid;
  $: shortcutScope = elementId;
  $: isStatusInOwnThread = (
          (timelineType === 'status' || timelineType === 'reply') && timelineValue === originalStatusId
  );
  $: isStatusInNotification = (
          notification && notification.status &&
          notification.type !== 'mention' && notification.status.id === originalStatusId
  );
  $: spoilerShown = !!$spoilersShown[uuid];
  $: replyShown = !!$repliesShown[uuid];
  $: showCard = (
          !$hideCards &&
          !isStatusInNotification &&
          !showMedia &&
          originalStatus.card &&
          originalStatus.card.title
  );
  $: showPoll = (
          originalStatus.poll
  );
  $: showMedia = (
          !isStatusInNotification &&
          originalStatus.media_attachments &&
          originalStatus.media_attachments.length
  );
  $: originalAccountEmojis = (originalAccount.emojis || []);
  $: originalStatusEmojis = (originalStatus.emojis || []);
  $: originalAccountDisplayName = (originalAccount.display_name || originalAccount.username);
  $: originalAccountAccessibleName = (() => {
    return getAccountAccessibleName(originalAccount, $omitEmojiInDisplayNames)
  })();
  $: createdAtDate = originalStatus.created_at;
  $: createdAtDateTS = new Date(createdAtDate).getTime();
  $: absoluteFormattedDate = absoluteDateFormatter().format(createdAtDateTS);
  $: shortInlineFormattedDate = (
          $disableRelativeTimestamps
                  ? dayOnlyAbsoluteDateFormatter().format(createdAtDateTS)
                  : formatTimeagoDate(createdAtDateTS, $now)
  );
  $: reblog = status.reblog;
  $: ariaLabel = (
          getAccessibleLabelForStatus(originalAccount, account, plainTextContent,
                  shortInlineFormattedDate, spoilerText, showContent,
                  reblog, notification, visibility, $omitEmojiInDisplayNames, $disableLongAriaLabels,
                  showMedia, showPoll
          )
  );
  $: showHeader = (
          (notification && ['reblog', 'favourite', 'poll'].includes(notification.type)) ||
          status.reblog ||
          timelineType === 'pinned'
  );
  $: className = classname(
          'status-article',
          'shortcut-list-item',
          'focus-fix',
          timelineType !== 'direct' && visibility === 'direct' && 'status-direct',
          timelineType !== 'search' && 'status-in-timeline',
          isStatusInOwnThread && 'status-in-own-thread',
          $underlineLinks && 'underline-links',
          !$disableTapOnStatus && !isStatusInOwnThread && 'tap-on-status'
  );
  $: content = originalStatus.content || '';
  $: showContent = !spoilerText || spoilerShown;

  function onClickOrKeydown(e) {
    const { type, keyCode, target } = e

    const isClick = type === 'click'
    const isEnter = type === 'keydown' && keyCode === 13
    if (!isClick && !isEnter) {
      return false
    }
    if (checkDomAncestors(target, isUserInputElement, isStatusArticle)) {
      // this element or any ancestors up to the status-article element is
      // a user input element
      return false
    }
    if (checkDomAncestors(target, isToolbar, isStatusArticle)) {
      // this element or any of its ancestors is the toolbar
      return false
    }

    open();
    return true
  }

  function open() {
    goto(`/statuses/${originalStatusId}`);
  }

  function openAuthorProfile() {
    goto(`/accounts/${accountForShortcut.id}`);
  }

  async function mentionAuthor() {
    await composeNewStatusMentioning(accountForShortcut)
  }

  let article;

  onMount(() => {
    let removeClickDelegate;
    if (!isStatusInOwnThread && !$disableTapOnStatus) {
      // the whole <article> is clickable in this case
      removeClickDelegate = registerClickDelegate(elementId, (e) => onClickOrKeydown(e))
    }
    if (!showContent) {
      scheduleIdleTask(() => {
        // Perf optimization: lazily load the StatusContent when the user is idle so that
        // it's fast when they click the "show more" button
        preloadHiddenContent = true;
      })
    }
    scheduleIdleTask(() => addEmojiTooltips(article));

    return () => {
      if (removeClickDelegate) {
        removeClickDelegate();
      }
    }
  });
</script>

<article id={elementId}
         class={className}
         tabindex="0"
         aria-posinset={index + 1}
         aria-setsize={length}
         aria-label={ariaLabel}
         on:recalculateHeight
         bind:this={article}
>
  {#if showHeader}
    <StatusHeader {account} {accountId} {uuid} {isStatusInNotification} {notification} {timelineType} />
  {/if}
  <StatusAuthorName {uuid} {isStatusInNotification} {isStatusInOwnThread} {originalAccount} {originalAccountId}/>
  <StatusAuthorHandle {originalAccount} {isStatusInNotification} />
  {#if !isStatusInOwnThread}
    <StatusRelativeDate {uuid} {originalStatusId} {isStatusInNotification} {createdAtDate} {shortInlineFormattedDate} {absoluteFormattedDate} />
  {/if}
  <StatusSidebar {uuid} {isStatusInOwnThread} {originalAccount} {originalAccountId} />
  {#if spoilerText}
    <StatusSpoiler {uuid} {isStatusInNotification} {isStatusInOwnThread} {spoilerShown} {enableShortcuts} {shortcutScope} {spoilerText} {originalStatusEmojis} on:recalculateHeight />
  {/if}
  {#if !showContent}
    <StatusMentions {uuid} {originalStatus} {isStatusInOwnThread} />
  {/if}
  {#if content && (showContent || preloadHiddenContent)}
    <StatusContent {uuid} {originalStatus} {isStatusInOwnThread} {isStatusInNotification} {originalStatusEmojis} shown={showContent}/>
  {/if}
  {#if showCard }
    <StatusCard {originalStatus} {enableShortcuts} {shortcutScope} />
  {/if}
  {#if showMedia }
    <StatusMediaAttachments {uuid} {enableShortcuts} {shortcutScope} {originalStatus} on:recalculateHeight />
  {/if}
  {#if showPoll && (showContent || preloadHiddenContent)}
    <StatusPoll {notification} {uuid} {isStatusInNotification} {isStatusInOwnThread} {originalStatus} {originalStatusEmojis} shown={showContent} />
  {/if}
  {#if isStatusInOwnThread}
    <StatusDetails {originalStatus} {createdAtDate} {createdAtDateTS} {absoluteFormattedDate} />
  {/if}
  <StatusToolbar {uuid} {isStatusInOwnThread} {enableShortcuts} {shortcutScope} {inReplyToId}
                 {visibility} {originalStatusId} {originalStatus} {originalAccountId}
                 {replyShown} on:recalculateHeight />
  {#if replyShown}
    <StatusComposeBox {uuid} {visibility} {originalStatusId} {spoilerText} on:recalculateHeight />
  {/if}
</article>
{#if enableShortcuts}
  <Shortcut scope={shortcutScope} key="o" on:pressed="{open}" />
  <Shortcut scope={shortcutScope} key="p" on:pressed="{openAuthorProfile}" />
  <Shortcut scope={shortcutScope} key="m" on:pressed="{mentionAuthor}" />
{/if}

<style>
  .status-article {
    padding: var(--status-pad-v) var(--status-pad-h);
    display: grid;
    grid-template-areas:
        "header  header       header        header"
        "sidebar author-name  author-handle relative-date"
        "sidebar spoiler      spoiler       spoiler"
        "sidebar spoiler-btn  spoiler-btn   spoiler-btn"
        "sidebar mentions     mentions      mentions"
        "sidebar content      content       content"
        "sidebar card         card          card"
        "sidebar media-grp    media-grp     media-grp"
        "sidebar poll         poll          poll"
        "media   media        media         media"
        "....... toolbar      toolbar       toolbar"
        "compose compose      compose       compose";
    grid-template-columns: min-content minmax(0, max-content) 1fr min-content;
    grid-template-rows: repeat(8, max-content);
  }

  .status-article.tap-on-status {
    cursor: pointer;
  }

  .status-article.status-in-timeline {
    border-bottom: 1px solid var(--main-border);
  }

  .status-article.status-direct {
    background-color: var(--status-direct-background);
  }

  .status-article.status-in-own-thread {
    grid-template-areas:
      "sidebar     author-name"
      "sidebar     author-handle"
      "spoiler     spoiler"
      "spoiler-btn spoiler-btn"
      "mentions    mentions"
      "content     content"
      "card        card"
      "media-grp   media-grp"
      "media       media"
      "poll        poll"
      "details     details"
      "toolbar     toolbar"
      "compose     compose";
    grid-template-columns: min-content 1fr;
    grid-template-rows: repeat(7, max-content);
  }
</style>

