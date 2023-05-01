<script>
  import ModalDialog from './ModalDialog.svelte'
  import { observedRelationship, observedSpark } from '../../../_store/local'
  import { currentSpark } from '../../../_store/instance'
  import { currentPostModifications } from '../../../_store/store'
  import GenericDialogList from './GenericDialogList.svelte'
  import { setSparkSubscribed } from '../../../_actions/spark/subscribe'
  import { doDeletePost } from '../../../_actions/delete'
  import { close } from '../helpers/closeDialog'
  import { setSparkBlocked } from '../../../_actions/spark/block'
  import { setPostPinnedOrUnpinned } from '../../../_actions/pin'
  import { setConversationMuted } from '../../../_actions/muteConversation'
  import { copyText } from '../../../_actions/copyText'
  import { editPost } from '../../../_actions/editPost'
  import { sharePost } from '../../../_actions/share'
  import { toggleMute } from '../../../_actions/toggleMute'
  import { reportPostOrSpark } from '../../../_actions/report'
  import { formatIntl } from '../../../_utils/formatIntl'
  import { unwrap } from '../../../_utils/mapper'
  import { inBrowser } from '../../../_utils/browserOrNode';

  export let id
  export let label
  export let title
  export let post

  const supportsWebShare = inBrowser() && typeof navigator.share === 'function'

  $: relationship = $observedRelationship
  $: author = $observedSpark
  $: spark = $currentSpark
  $: postId = post.id
  $: pinned = (() => {
    if ($currentPostModifications && postId in $currentPostModifications.pins) {
      return $currentPostModifications.pins[postId]
    }
    return post.pinned
  })()
  //
  // begin copypasta (PostOptionsDialog.html / SparkProfileOptionsDialog.html)
  //
  $: sparkId = spark.id
  $: subscribed = relationship?.subscribed
  $: requestedSubscription = relationship?.requestedSubscription
  $: authorId = author?.id
  $: authorName = author?.name
  $: isManaged = relationship?.managed
  $: muting = relationship?.muted
  $: blocking = relationship?.blocked
  $: subscribeLabel = (() => {
    if (typeof subscribed === 'undefined' || !author) {
      return ''
    }
    return (subscribed || requestedSubscription)
            ? formatIntl('intl.unsubSpark', { spark: authorName })
            : formatIntl('intl.subSpark', { spark: authorName })
  })()
  $: subscribeIcon = (
          subscribed ? '#fa-user-times' : requestedSubscription ? '#fa-hourglass' : '#fa-user-plus'
  )
  $: blockLabel = (
          blocking
                  ? formatIntl('intl.unblockSpark', { spark: authorName })
                  : formatIntl('intl.blockSpark', { spark: authorName })
  )
  $: blockIcon = blocking ? '#fa-unlock' : '#fa-ban'
  $: muteLabel = (
          muting
                  ? formatIntl('intl.unmuteSpark', { spark: authorName })
                  : formatIntl('intl.muteSpark', { spark: authorName })
  )
  $: muteIcon = muting ? '#fa-volume-up' : '#fa-volume-off'
  $: isUser = authorId === sparkId
  //
  // end copypasta (PostOptionsDialog.html / SparkProfileOptionsDialog.html)
  //
  $: pinLabel = isUser ? (pinned ? 'intl.unpinFromProfile' : 'intl.pinToProfile') : ''
  $: visibility = post.visibility
  $: mentions = post.mentions || []
  $: mentionsUser = !!mentions.find(_ => _.id === sparkId)
  $: mutingConversation = !!post.muted
  $: muteConversationLabel = (
          mutingConversation
                  ? 'intl.unmuteConversation'
                  : 'intl.muteConversation'
  )
  $: muteConversationIcon = mutingConversation ? '#fa-volume-up' : '#fa-volume-off'
  $: isPublic = visibility === 'public'
  $: items = ([
    // isPublic && isUser && {
    //   key: 'pin',
    //   label: pinLabel,
    //   icon: '#fa-thumb-tack'
    // },
    !isUser && !blocking && {
      key: 'subscribe',
      label: subscribeLabel,
      icon: subscribeIcon
    },
    // !isUser && !isManaged && {
    //   key: 'block',
    //   label: blockLabel,
    //   icon: blockIcon
    // },
    // !isUser && !blocking && {
    //   key: 'mute',
    //   label: muteLabel,
    //   icon: muteIcon
    // },
    // (isUser || mentionsUser) && {
    //   key: 'muteConversation',
    //   label: muteConversationLabel,
    //   icon: muteConversationIcon
    // },
    isUser && {
      key: 'edit',
      label: 'intl.editPost',
      icon: '#fa-pencil'
    },
    isUser && {
      key: 'delete',
      label: 'intl.delete',
      icon: '#fa-trash'
    },
    !isUser && !isManaged && {
      key: 'report',
      label: 'intl.reportPost',
      icon: '#fa-flag'
    },
    isPublic && supportsWebShare && {
      key: 'share',
      label: 'intl.sharePost',
      icon: '#fa-share-square-o'
    },
    {
      key: 'copy',
      label: 'intl.copyLinkToPost',
      icon: '#fa-link'
    }
  ].filter(Boolean))

  function onClick (event) {
    switch (event.detail.key) {
      case 'delete':
        return onDeleteClicked()
      case 'pin':
        return onPinClicked()
      case 'subscribe':
        return onSubscribeClicked()
      case 'block':
        return onBlockClicked()
      case 'mute':
        return onMuteClicked()
      case 'copy':
        return onCopyClicked()
      case 'muteConversation':
        return onMuteConversationClicked()
      case 'edit':
        return onEdit()
      case 'share':
        return onShare()
      case 'report':
        return onReport()
    }
  }

  async function onDeleteClicked () {
    close(id)
    await doDeletePost(post.bubble, postId, sparkId)
  }

  async function onPinClicked () {
    close(id)
    await setPostPinnedOrUnpinned(postId, !pinned, true)
  }

  async function onSubscribeClicked () {
    close(id)
    await setSparkSubscribed(authorId, !subscribed, null, sparkId, true)
  }

  async function onBlockClicked () {
    close(id)
    await setSparkBlocked(authorId, !blocking, true)
  }

  async function onMuteClicked () {
    close(id)
    await toggleMute(author, !muting)
  }

  async function onMuteConversationClicked () {
    close(id)
    await setConversationMuted(postId, !mutingConversation, true)
  }

  async function onCopyClicked () {
    const url = `${location.origin}/posts/${unwrap(postId)}`
    close(id)
    await copyText(url)
  }

  async function onEdit () {
    close(id)
    await editPost(post)
  }

  async function onShare () {
    close(id)
    await sharePost(post)
  }

  async function onReport () {
    close(id)
    await reportPostOrSpark(({ post }))
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