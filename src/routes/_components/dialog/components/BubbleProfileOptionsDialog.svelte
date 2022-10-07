<script>
  import ModalDialog from './ModalDialog.svelte'
  import GenericDialogList from './GenericDialogList.svelte'
  import { close } from '../helpers/closeDialog'
  import { setBubbleBlocked } from '../../../_actions/bubble/block'
  import { updateMembership } from '../../../_actions/bubble/membership'
  import { copyText } from '../../../_actions/copyText'
  import { formatIntl } from '../../../_utils/formatIntl'
  import { goto } from '@sapper/app'
  import { unwrap } from '../../../_utils/mapper'
  import { doDeleteBubble } from '../../../_actions/deleteBubble'
  import { setBubbleBookmarked } from '../../../_actions/bubble/bookmark'
  import { loadSpark, setCurrentSpark } from '../../../_actions/sparks'
  import { currentInstance } from '../../../_store/local'
  import { toast } from '../../toast/toast'

  export let id
  export let label
  export let title
  export let bubble
  export let relationship
  export let ourSpark

  const gotoDelay = 100

  $: ourSparkId = ourSpark.id
  $: joined = relationship && (relationship.status === 'active')
  $: requestedMembership = relationship && (relationship.status === 'pending')
  $: bubbleId = bubble && bubble.id
  $: bubbleName = (bubble && bubble.name) || 'unnamed'
  $: isOwner = relationship && (relationship.memberType === 'owner')
  $: isManaged = relationship && relationship.managed
  $: owner = isManaged && relationship.owner
  $: muting = relationship && relationship.muted
  $: bookmarked = relationship && relationship.bookmarked
  $: blocked = relationship && relationship.blocked
  $: enableJoin = !isOwner && !blocked && (joined || requestedMembership || bubble.membershipMode !== 'invite_only')
  $: joinLabel = (() => {
    if (typeof joined === 'undefined' || !bubble) {
      return ''
    }
    return (joined || requestedMembership)
            ? formatIntl('intl.leaveBubble', { bubble: bubbleName })
            : formatIntl('intl.joinBubble', { bubble: bubbleName })
  })()
  $: joinIcon = joined ? '#fa-sign-out' : requestedMembership ? '#fa-hourglass' : '#fa-sign-in'
  $: bookmarkLabel = bookmarked
          ? 'intl.removeBookmark'
          : formatIntl('intl.addBubbleBookmark', { bubble: bubbleName })
  $: bookmarkIcon = bookmarked ? '#fa-bookmark-o' : '#fa-bookmark'
  $: blockLabel = (
          blocked
                  ? formatIntl('intl.unblockBubble', { bubble: bubbleName })
                  : formatIntl('intl.blockBubble', { bubble: bubbleName })
  )
  $: blockIcon = blocked ? '#fa-unlock' : '#fa-ban'
  $: archiveLabel = formatIntl('intl.archiveBubble', { bubble: bubbleName })
  $: items = [
    isOwner && {
      key: 'edit',
      label: 'intl.editBubble',
      icon: '#fa-edit'
    },
    !isOwner && isManaged && {
      key: 'switchAndEdit',
      label: 'intl.switchAndEditBubble',
      icon: '#fa-edit'
    },
    enableJoin && {
      key: 'join',
      label: joinLabel,
      icon: joinIcon
    },
    !isOwner && {
      key: 'bookmark',
      label: bookmarkLabel,
      icon: bookmarkIcon
    },
    // !isOwner && {
    //   key: 'block',
    //   label: blockLabel,
    //   icon: blockIcon
    // },
    {
      key: 'copy',
      label: 'intl.copyLinkToBubble',
      icon: '#fa-link'
    },
    isOwner && {
      key: 'archive',
      label: archiveLabel,
      icon: '#fa-archive'
    }
  ].filter(Boolean)

  function onClick (event) {
    switch (event.detail.key) {
      case 'join':
        return onJoinClicked()
      case 'bookmark':
        return onBookmarkClicked()
      case 'block':
        return onBlockClicked()
      case 'archive':
        return onArchiveClicked()
      case 'copy':
        return onCopyClicked()
      case 'edit':
        return onEdit()
      case 'switchAndEdit':
        return onSwitchAndEdit()
    }
  }

  async function onJoinClicked () {
    close(id)
    await updateMembership(bubbleId, !joined, ourSparkId, true)
  }

  async function onBookmarkClicked () {
    close(id)
    await setBubbleBookmarked(bubbleId, !bookmarked, ourSparkId, true)
  }

  async function onBlockClicked () {
    close(id)
    await setBubbleBlocked(bubbleId, !blocked, ourSparkId, true)
  }

  async function onArchiveClicked () {
    close(id)
    await doDeleteBubble(bubbleId, ourSparkId)
    goto('/')
  }

  async function onCopyClicked () {
    const url = `${location.origin}${location.pathname}`
    close(id)
    await copyText(url)
  }

  function onEdit () {
    close(id)
    setTimeout(() => {
      goto(`/bubbles/${unwrap(bubbleId)}/edit`)
    }, gotoDelay)
  }

  async function onSwitchAndEdit () {
    close(id)
    const spark = await loadSpark(unwrap(owner))
    setCurrentSpark($currentInstance, spark)
    /* no await */
    toast.say(formatIntl('intl.sparkSelected', { spark: spark.name }))
    setTimeout(() => {
      goto(`/bubbles/${unwrap(bubbleId)}/edit`)
    }, gotoDelay)
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
