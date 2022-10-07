<script>
  import ModalDialog from './ModalDialog.svelte'
  import GenericDialogList from './GenericDialogList.svelte'
  import { close } from '../helpers/closeDialog'
  import { setSparkBlocked } from '../../../_actions/spark/block'
  import { setSparkSubscribed } from '../../../_actions/spark/subscribe'
  import { setDomainBlocked } from '../../../_actions/setDomainBlocked'
  import { copyText } from '../../../_actions/copyText'
  import { composeNewPostMentioning } from '../../../_actions/mention'
  import { toggleMute } from '../../../_actions/toggleMute'
  import { reportPostOrSpark } from '../../../_actions/report'
  import { formatIntl } from '../../../_utils/formatIntl'
  import { goto } from '@sapper/app'
  import { unwrap } from '../../../_utils/mapper'
  import { doDeleteSpark } from '../../../_actions/deleteSpark'
  import { setSparkBookmarked } from '../../../_actions/spark/bookmark'
  import { setCurrentSpark } from '../../../_actions/sparks'
  import { currentInstance } from '../../../_store/local'
  import { toast } from '../../toast/toast'

  export let id
  export let label
  export let title
  export let spark
  export let relationship
  export let ourSpark

  const gotoDelay = 100

  $: activeSpark = !!ourSpark
  $: ourSparkId = activeSpark ? ourSpark.id : ''
  $: subscribed = relationship && relationship.subscribed
  $: requestedSubscription = relationship && relationship.requestedSubscription
  $: sparkId = spark && spark.id
  $: sparkName = spark && spark.name
  $: isManaged = relationship && relationship.managed
  $: muting = relationship && relationship.muted
  $: bookmarked = relationship && relationship.bookmarked
  $: blocking = relationship && relationship.blocked
  $: subscribeLabel = (() => {
    if (typeof subscribed === 'undefined' || !spark) {
      return ''
    }
    return (subscribed || requestedSubscription)
            ? formatIntl('intl.unsubSpark', { spark: sparkName })
            : formatIntl('intl.subSpark', { spark: sparkName })
  })()
  $: subscribeIcon = subscribed ? '#fa-user-times' : requestedSubscription ? '#fa-hourglass' : '#fa-user-plus'
  $: bookmarkLabel = bookmarked
          ? 'intl.removeBookmark'
          : formatIntl('intl.addSparkBookmark', { spark: sparkName })
  $: bookmarkIcon = bookmarked ? '#fa-bookmark-o' : '#fa-bookmark'
  $: blockLabel = (
          blocking
                  ? formatIntl('intl.unblockSpark', { spark: sparkName })
                  : formatIntl('intl.blockSpark', { spark: sparkName })
  )
  $: blockIcon = blocking ? '#fa-unlock' : '#fa-ban'
  $: muteLabel = (
          muting
                  ? formatIntl('intl.unmuteSpark', { spark: sparkName })
                  : formatIntl('intl.muteSpark', { spark: sparkName })
  )
  $: muteIcon = muting ? '#fa-volume-up' : '#fa-volume-off'
  $: isUser = sparkId === ourSparkId
  //
  // end copypasta (PostOptionsDialog.html / SparkProfileOptionsDialog.html)
  //
  $: domain = '' //acct.split('@')[1];
  $: instanceBlocked = relationship && relationship.instanceBlocked
  $: blockDomainLabel = (
          instanceBlocked
                  ? formatIntl('intl.showDomain', { domain })
                  : formatIntl('intl.hideDomain', { domain })
  )
  $: reportLabel = formatIntl('intl.reportSpark', { spark: sparkName })
  $: archiveLabel = formatIntl('intl.archiveSpark', { spark: sparkName })
  $: items = [
    // activeSpark && !isUser && {
    //   key: 'mention',
    //   label: formatIntl('intl.mentionSpark', { spark: sparkName }),
    //   icon: '#fa-comments'
    // },
    activeSpark && isUser && isManaged && {
      key: 'edit',
      label: 'intl.editSpark',
      icon: '#fa-edit'
    },
    activeSpark && !isUser && isManaged && {
      key: 'switchAndEdit',
      label: 'intl.switchAndEditSpark',
      icon: '#fa-edit'
    },
    activeSpark && !isUser && !blocking && {
      key: 'subscribe',
      label: subscribeLabel,
      icon: subscribeIcon
    },
    !isUser && {
      key: 'bookmark',
      label: bookmarkLabel,
      icon: bookmarkIcon
    },
    // activeSpark && !isUser && !isManaged && {
    //   key: 'block',
    //   label: blockLabel,
    //   icon: blockIcon
    // },
    // activeSpark && !isUser && !blocking && {
    //   key: 'mute',
    //   label: muteLabel,
    //   icon: muteIcon
    // },
    // activeSpark && !isUser && !isManaged && domain && {
    //   key: 'blockDomain',
    //   label: blockDomainLabel,
    //   icon: '#fa-ban'
    // },
    activeSpark && !isUser && !isManaged && {
      key: 'report',
      label: reportLabel,
      icon: '#fa-flag'
    },
    {
      key: 'copy',
      label: 'intl.copyLinkToSpark',
      icon: '#fa-link'
    },
    isManaged && {
      key: 'archive',
      label: archiveLabel,
      icon: '#fa-archive'
    }
  ].filter(Boolean)

  function onClick (event) {
    switch (event.detail.key) {
      case 'mention':
        return onMentionClicked()
      case 'subscribe':
        return onSubscribeClicked()
      case 'bookmark':
        return onBookmarkClicked()
      case 'block':
        return onBlockClicked()
      case 'archive':
        return onArchiveClicked()
      case 'mute':
        return onMuteClicked()
      case 'blockDomain':
        return onBlockDomainClicked()
      case 'copy':
        return onCopyClicked()
      case 'report':
        return onReport()
      case 'edit':
        return onEdit()
      case 'switchAndEdit':
        return onSwitchAndEdit()
    }
  }

  async function onMentionClicked () {
    close(id)
    await composeNewPostMentioning(spark)
  }

  async function onSubscribeClicked () {
    close(id)
    await setSparkSubscribed(sparkId, !subscribed, null, ourSparkId, true)
  }

  async function onBookmarkClicked () {
    close(id)
    await setSparkBookmarked(sparkId, !bookmarked, ourSparkId, true)
  }

  async function onBlockClicked () {
    close(id)
    await setSparkBlocked(sparkId, !blocking, true)
  }

  async function onMuteClicked () {
    close(id)
    await toggleMute(spark, !muting)
  }

  async function onBlockDomainClicked () {
    close(id)
    await setDomainBlocked(sparkId, domain, !instanceBlocked, true)
  }

  async function onArchiveClicked () {
    close(id)
    await doDeleteSpark(sparkId)
    goto('/')
  }

  async function onCopyClicked () {
    const url = `${location.origin}${location.pathname}`
    close(id)
    await copyText(url)
  }

  async function onReport () {
    close(id)
    await reportPostOrSpark({ spark })
  }

  function onEdit () {
    close(id)
    setTimeout(() => {
      goto(`/sparks/${unwrap(sparkId)}/edit`)
    }, gotoDelay)
  }

  function onSwitchAndEdit () {
    close(id)
    setCurrentSpark($currentInstance, spark)
    /* no await */
    toast.say(formatIntl('intl.sparkSelected', { spark: spark.name }))
    setTimeout(() => {
      goto(`/sparks/${unwrap(sparkId)}/edit`)
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
