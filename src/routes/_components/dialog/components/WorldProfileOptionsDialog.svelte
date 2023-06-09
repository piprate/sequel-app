<script>
  import ModalDialog from './ModalDialog.svelte'
  import GenericDialogList from './GenericDialogList.svelte'
  import { close } from '../helpers/closeDialog'
  import { setWorldBlocked } from '../../../_actions/world/block'
  import { updateMembership } from '../../../_actions/world/membership'
  import { copyText } from '../../../_actions/copyText'
  import { formatIntl } from '../../../_utils/formatIntl'
  import { goto } from '$app/navigation'
  import { unwrap } from '../../../_utils/mapper'
  import { doDeleteWorld } from '../../../_actions/deleteWorld'
  import { isTimelineInReaderMode } from '../../../_actions/timeline'

  export let id
  export let label
  export let title
  export let world
  export let relationship
  export let ourSpark

  const gotoDelay = 100

  $: ourSparkId = ourSpark.id
  $: joined = relationship && relationship.joined
  $: requestedMembership = relationship && relationship.requestedMembership
  $: worldId = world && world.id
  $: worldName = (world && world.name) || 'unnamed'
  $: worldOwner = world && world.attributedTo
  $: muting = relationship && relationship.muted
  $: blocked = relationship && relationship.blocked
  $: joinLabel = (() => {
    if (typeof joined === 'undefined' || !world) {
      return ''
    }
    return joined || requestedMembership
      ? formatIntl('intl.leaveWorld', { world: worldName })
      : formatIntl('intl.joinWorld', { world: worldName })
  })()
  $: joinIcon = joined ? '#fa-sign-out' : requestedMembership ? '#fa-hourglass' : '#fa-sign-in'
  $: blockLabel = blocked
    ? formatIntl('intl.unblockWorld', { world: worldName })
    : formatIntl('intl.blockWorld', { world: worldName })
  $: blockIcon = blocked ? '#fa-unlock' : '#fa-ban'
  $: archiveLabel = formatIntl('intl.archiveWorld', { world: worldName })
  $: isOwner = worldOwner === ourSparkId
  $: isInReaderMode = isTimelineInReaderMode()
  $: readerModeIcon = isInReaderMode ? '#fa-hand-pointer-o' : '#fa-book-open-reader'
  $: readerModeLabel = isInReaderMode ? 'intl.interactiveMode' : 'intl.readerMode'
  $: items = [
    isOwner && {
      key: 'edit',
      label: 'intl.editWorld',
      icon: '#fa-edit'
    },
    !isOwner &&
      !blocked && {
        key: 'join',
        label: joinLabel,
        icon: joinIcon
      },
    {
      key: 'readerMode',
      label: readerModeLabel,
      icon: readerModeIcon
    },
    // !isOwner && {
    //   key: 'block',
    //   label: blockLabel,
    //   icon: blockIcon
    // },
    {
      key: 'copy',
      label: 'intl.copyLinkToWorld',
      icon: '#fa-link'
    },
    isOwner && {
      key: 'archive',
      label: archiveLabel,
      icon: '#fa-archive'
    }
  ].filter(Boolean)

  function onClick(event) {
    switch (event.detail.key) {
      case 'join':
        return onJoinClicked()
      case 'block':
        return onBlockClicked()
      case 'archive':
        return onArchiveClicked()
      case 'copy':
        return onCopyClicked()
      case 'edit':
        return onEdit()
      case 'readerMode':
        return onToggleReaderMode()
    }
  }

  async function onJoinClicked() {
    close(id)
    await updateMembership(worldId, !joined, ourSparkId, true)
  }

  async function onBlockClicked() {
    close(id)
    await setWorldBlocked(worldId, !blocked, ourSparkId, true)
  }

  async function onArchiveClicked() {
    close(id)
    await doDeleteWorld(worldId, ourSparkId)
    goto('/')
  }

  async function onCopyClicked() {
    const url = `${location.origin}${location.pathname}`
    close(id)
    await copyText(url)
  }

  function onEdit() {
    close(id)
    setTimeout(() => {
      goto(`/worlds/${unwrap(worldId)}/edit`)
    }, gotoDelay)
  }

  async function onToggleReaderMode() {
    const readerModeUrl = `${location.pathname}/reader_mode`
    goto(isTimelineInReaderMode() ? location.pathname.replace('/reader_mode', '') : readerModeUrl)

    close(id)
  }
</script>

<ModalDialog {id} {label} {title} shrinkWidthToFit={true} background="var(--main-bg)">
  <GenericDialogList selectable={false} {items} on:click={onClick} />
</ModalDialog>
