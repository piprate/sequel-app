<script>
  import ModalDialog from './ModalDialog.svelte'
  import GenericDialogList from './GenericDialogList.svelte'
  import { close } from '../helpers/closeDialog'
  import { copyText } from '../../../_actions/copyText'
  import { formatIntl } from '../../../_utils/formatIntl'
  import { goto } from '@sapper/app'
  import { unwrap } from '../../../_utils/mapper'
  import { doDeleteWorld } from '../../../_actions/deleteWorld'

  export let id
  export let label
  export let title
  export let listing
  export let relationship
  export let ourSpark

  const gotoDelay = 100

  $: ourSparkId = ourSpark.id
  $: listingId = listing && listing.id
  $: listingName = (listing && listing.name) || 'unnamed'
  $: listingOwner = listing && listing.seller
  $: withdrawLabel = 'intl.withdrawListing'
  $: isOwner = relationship && listingOwner === ourSparkId  // refer to relationship to suppress warnings
  $: items = [
    isOwner && {
      key: 'edit',
      label: 'intl.editListing',
      icon: '#fa-edit'
    },
    {
      key: 'copy',
      label: 'intl.copyLinkToListing',
      icon: '#fa-link'
    },
    isOwner && {
      key: 'withdraw',
      label: withdrawLabel,
      icon: '#fa-trash'
    }
  ].filter(Boolean)

  function onClick (event) {
    switch (event.detail.key) {
      case 'withdraw':
        return onWithdrawClicked()
      case 'copy':
        return onCopyClicked()
      case 'edit':
        return onEdit()
    }
  }

  async function onWithdrawClicked () {
    close(id)
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
      goto(`/marketplace/${listingId}/edit`)
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
