<script>
  import ModalDialog from './ModalDialog.svelte'
  import GenericDialogList from './GenericDialogList.svelte'
  import { close } from '../helpers/closeDialog'
  import { setAccountBlocked } from '../../../_actions/block'
  import { setAccountFollowed } from '../../../_actions/follow'
  import { setShowReblogs } from '../../../_actions/setShowReblogs'
  import { setDomainBlocked } from '../../../_actions/setDomainBlocked'
  import { copyText } from '../../../_actions/copyText'
  import { composeNewStatusMentioning } from '../../../_actions/mention'
  import { toggleMute } from '../../../_actions/toggleMute'
  import { reportStatusOrAccount } from '../../../_actions/report'
  import { formatIntl } from '../../../_utils/formatIntl'

  export let id;
  export let label;
  export let title;
  export let account;
  export let relationship;
  export let verifyCredentials;

  //
  // begin copypasta (StatusOptionsDialog.html / AccountProfileOptionsDialog.html)
  //
  $: verifyCredentialsId = verifyCredentials.id;
  $: following = relationship && relationship.following;
  $: followRequested = relationship && relationship.requested;
  $: accountId = account && account.id;
  $: acct = account.acct;
  $: username = account.username;
  $: muting = relationship && relationship.muting;
  $: blocking = relationship && relationship.blocking;
  $: followLabel = (() => {
    if (typeof following === 'undefined' || !account) {
      return ''
    }
    return (following || followRequested)
            ? formatIntl('intl.unfollowAccount', { account: `@${username}` })
            : formatIntl('intl.followAccount', { account: `@${username}` })
  })();
  $: followIcon = following ? '#fa-user-times' : followRequested ? '#fa-hourglass' : '#fa-user-plus';
  $: blockLabel = (
          blocking
                  ? formatIntl('intl.unblockAccount', { account: `@${username}` })
                  : formatIntl('intl.blockAccount', { account: `@${username}` })
  )
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
  $: showingReblogs = relationship ? relationship.showing_reblogs : true;
  $: showReblogsLabel = (
          showingReblogs
                  ? formatIntl('intl.hideReblogsFromAccount', { account: `@${username}` })
                  : formatIntl('intl.showReblogsFromAccount', { account: `@${username}` })
  );
  $: domain = acct.split('@')[1];
  $: blockingDomain = relationship && relationship.domain_blocking;
  $: blockDomainLabel = (
          blockingDomain
                  ? formatIntl('intl.showDomain', { domain })
                  : formatIntl('intl.hideDomain', { domain })
  );
  $: reportLabel = formatIntl('intl.reportAccount', { account: `@${username}` });
  $: items = [
    !isUser && {
      key: 'mention',
      label: formatIntl('intl.mentionAccount', { account: `@${username}` }),
      icon: '#fa-comments'
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
    !isUser && following && {
      key: 'showReblogs',
      label: showReblogsLabel,
      icon: '#fa-retweet'
    },
    !isUser && domain && {
      key: 'blockDomain',
      label: blockDomainLabel,
      icon: '#fa-ban'
    },
    !isUser && {
      key: 'report',
      label: reportLabel,
      icon: '#fa-flag'
    },
    {
      key: 'copy',
      label: 'intl.copyLinkToAccount',
      icon: '#fa-link'
    }
  ].filter(Boolean);

  function onClick(event) {
    switch (event.detail.key) {
      case 'mention':
        return onMentionClicked();
      case 'follow':
        return onFollowClicked();
      case 'block':
        return onBlockClicked();
      case 'mute':
        return onMuteClicked();
      case 'showReblogs':
        return onShowReblogsClicked();
      case 'blockDomain':
        return onBlockDomainClicked();
      case 'copy':
        return onCopyClicked();
      case 'report':
        return onReport();
    }
  }

  async function onMentionClicked() {
    close(id);
    await composeNewStatusMentioning(account)
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

  async function onShowReblogsClicked() {
    close(id);
    await setShowReblogs(accountId, !showingReblogs, true)
  }

  async function onBlockDomainClicked() {
    close(id);
    await setDomainBlocked(accountId, domain, !blockingDomain, true)
  }

  async function onCopyClicked() {
    const { url } = account
    close(id);
    await copyText(url)
  }

  async function onReport() {
    close(id);
    await reportStatusOrAccount({ account })
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
