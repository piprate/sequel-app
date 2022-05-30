<script>
  import ModalDialog from './ModalDialog.svelte'
  import { currentAccountProfile, currentAccountRelationship } from '../../../_store/local'
  import { currentStatusModifications, currentVerifyCredentials } from '../../../_store/instance'
  import GenericDialogList from './GenericDialogList.svelte'
  import { setAccountFollowed } from '../../../_actions/follow'
  import { doDeleteStatus } from '../../../_actions/delete'
  import { close } from '../helpers/closeDialog'
  import { setAccountBlocked } from '../../../_actions/block'
  import { setStatusPinnedOrUnpinned } from '../../../_actions/pin'
  import { setStatusBookmarkedOrUnbookmarked } from '../../../_actions/bookmark'
  import { setConversationMuted } from '../../../_actions/muteConversation'
  import { copyText } from '../../../_actions/copyText'
  import { deleteAndRedraft } from '../../../_actions/deleteAndRedraft'
  import { shareStatus } from '../../../_actions/share'
  import { toggleMute } from '../../../_actions/toggleMute'
  import { reportStatusOrAccount } from '../../../_actions/report'
  import { formatIntl } from '../../../_utils/formatIntl'

  export let id;
  export let label;
  export let title;
  export let status;

  const supportsWebShare = process.browser && typeof navigator.share === 'function';

  $: relationship = $currentAccountRelationship;
  $: account = $currentAccountProfile;
  $: verifyCredentials = $currentVerifyCredentials;
  $: statusId = status.id;
  $: pinned = (() => {
    if ($currentStatusModifications && statusId in $currentStatusModifications.pins) {
      return $currentStatusModifications.pins[statusId]
    }
    return status.pinned
  })();
  //
  // begin copypasta (StatusOptionsDialog.html / AccountProfileOptionsDialog.html)
  //
  $: verifyCredentialsId = verifyCredentials.id;
  $: following = relationship && relationship.following;
  $: followRequested = relationship && relationship.requested;
  $: accountId = account && account.id;
  $: username = account.username;
  $: muting = relationship.muting;
  $: blocking = relationship.blocking;
  $: followLabel = (() => {
    if (typeof following === 'undefined' || !account) {
      return ''
    }
    return (following || followRequested)
            ? formatIntl('intl.unfollowAccount', { account: `@${username}` })
            : formatIntl('intl.followAccount', { account: `@${username}` })
  })();
  $: followIcon = (
          following ? '#fa-user-times' : followRequested ? '#fa-hourglass' : '#fa-user-plus'
  );
  $: blockLabel = (
          blocking
                  ? formatIntl('intl.unblockAccount', { account: `@${username}` })
                  : formatIntl('intl.blockAccount', { account: `@${username}` })
  );
  $: blockIcon = blocking ? '#fa-unlock' : '#fa-ban';
  $: muteLabel = (
          muting
                  ? formatIntl('intl.unmuteAccount', { account: `@${username}` })
                  : formatIntl('intl.muteAccount', { account: `@${username}` })
  );
  $: muteIcon = muting ? '#fa-volume-up' : '#fa-volume-off';
  $: isUser = accountId === verifyCredentialsId;
  //
  // end copypasta (StatusOptionsDialog.html / AccountProfileOptionsDialog.html)
  //
  $: pinLabel = isUser ? (pinned ? 'intl.unpinFromProfile' : 'intl.pinToProfile') : '';
  $: visibility = status.visibility;
  $: mentions = status.mentions || [];
  $: mentionsUser = !!mentions.find(_ => _.id === verifyCredentialsId);
  $: mutingConversation = !!status.muted;
  $: muteConversationLabel = (
          mutingConversation
                  ? 'intl.unmuteConversation'
                  : 'intl.muteConversation'
  );
  $: muteConversationIcon = mutingConversation ? '#fa-volume-up' : '#fa-volume-off';
  $: isPublicOrUnlisted = visibility === 'public' || visibility === 'unlisted';
  $: bookmarkLabel = status.bookmarked ? 'intl.unbookmarkStatus' : 'intl.bookmarkStatus';
  $: items = ([
    isUser && {
      key: 'delete',
      label: 'intl.delete',
      icon: '#fa-trash'
    },
    isPublicOrUnlisted && isUser && {
      key: 'pin',
      label: pinLabel,
      icon: '#fa-thumb-tack'
    },
    !isUser && !blocking && {
      key: 'follow',
      label: followLabel,
      icon: followIcon
    },
    !isUser && {
      key: 'block',
      label: blockLabel,
      icon: blockIcon
    },
    !isUser && !blocking && {
      key: 'mute',
      label: muteLabel,
      icon: muteIcon
    },
    (isUser || mentionsUser) && {
      key: 'muteConversation',
      label: muteConversationLabel,
      icon: muteConversationIcon
    },
    isUser && {
      key: 'redraft',
      label: 'intl.deleteAndRedraft',
      icon: '#fa-pencil'
    },
    !isUser && {
      key: 'report',
      label: 'intl.reportStatus',
      icon: '#fa-flag'
    },
    {
      key: 'bookmark',
      label: bookmarkLabel,
      icon: '#fa-bookmark'
    },
    isPublicOrUnlisted && supportsWebShare && {
      key: 'share',
      label: 'intl.shareStatus',
      icon: '#fa-share-square-o'
    },
    isPublicOrUnlisted && {
      key: 'copy',
      label: 'intl.copyLinkToStatus',
      icon: '#fa-link'
    }
  ].filter(Boolean));

  function onClick(event) {
    switch (event.detail.key) {
      case 'delete':
        return onDeleteClicked()
      case 'pin':
        return onPinClicked()
      case 'follow':
        return onFollowClicked()
      case 'block':
        return onBlockClicked()
      case 'mute':
        return onMuteClicked()
      case 'copy':
        return onCopyClicked()
      case 'muteConversation':
        return onMuteConversationClicked()
      case 'redraft':
        return onRedraft()
      case 'share':
        return onShare()
      case 'report':
        return onReport()
      case 'bookmark':
        return onBookmark()
    }
  }

  async function onDeleteClicked() {
    close(id);
    await doDeleteStatus(statusId)
  }

  async function onPinClicked() {
    close(id);
    await setStatusPinnedOrUnpinned(statusId, !pinned, true)
  }

  async function onFollowClicked() {
    close(id);
    await setAccountFollowed(accountId, !following, true)
  }

  async function onBlockClicked() {
    close(id);
    await setAccountBlocked(accountId, !blocking, true)
  }

  async function onMuteClicked() {
    close(id);
    await toggleMute(account, !muting)
  }

  async function onMuteConversationClicked() {
    close(id);
    await setConversationMuted(statusId, !mutingConversation, true)
  }

  async function onCopyClicked() {
    const { url } = status
    close(id);
    await copyText(url)
  }

  async function onRedraft() {
    close(id);
    await deleteAndRedraft(status)
  }

  async function onShare() {
    close(id);
    await shareStatus(status)
  }

  async function onReport() {
    close(id);
    await reportStatusOrAccount(({ status, account }))
  }

  async function onBookmark() {
    close(id);
    await setStatusBookmarkedOrUnbookmarked(status.id, !status.bookmarked)
  }
</script>

<ModalDialog
        {id}
        {label}
        {title}
        shrinkWidthToFit={true}
        background="var(--main-bg)"
>
  <GenericDialogList selectable={false} {items} on:click="{onClick}"/>
</ModalDialog>