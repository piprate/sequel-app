<script>
  import ModalDialog from './ModalDialog.svelte'
  import GenericDialogList from './GenericDialogList.svelte'
  import { close } from '../helpers/closeDialog'
  import { unwrap } from '../../../_utils/mapper'
  import { onMount } from 'svelte'
  import { updateRelationship } from '../../../_actions/sparks'
  import { observedRelationship } from '../../../_store/local'
  import { importShowAnnounceDialog } from '../asyncDialogs/importshowConfirmAnnounceDialog'
  import { currentSpark } from '../../../_store/instance'
  import { importShowActivateDialog } from '../asyncDialogs/importShowActivateDialog'
  import { goto } from '$app/navigation'
  import { importShowCancelDialog } from '../asyncDialogs/importShowCancelDialog'

  export let id
  export let label
  export let release
  export let listing

  const spark = $currentSpark

  onMount(async () => {
    await updateRelationship(unwrap(spark.id))
  })

  $: isTokenCreator = $observedRelationship?.tokenCreator

  $: releaseId = release.id
  $: isOwner = release.seller === spark.id // refer to relationship to suppress warnings
  $: isAuthorised = isTokenCreator && isOwner
  $: items = [
    isAuthorised &&
      release.status === 'draft' && {
        key: 'announce',
        label: 'intl.announce',
        icon: '#fa-bullhorn'
      },
    isAuthorised &&
      listing.length &&
      ['draft', 'announced'].includes(release.status) && {
        key: 'activate',
        label: 'intl.activate',
        icon: '#fa-power-off'
      },
    isAuthorised && {
      key: 'edit',
      label: 'intl.edit',
      icon: '#fa-edit'
    },
    isAuthorised &&
      ['draft', 'announced'].includes(release.status) && {
        key: 'cancel',
        label: 'intl.cancel',
        icon: '#fa-ban'
      }
  ].filter(Boolean)

  async function announce() {
    const showAnnounceDialog = await importShowAnnounceDialog()
    showAnnounceDialog(releaseId, id)
  }

  async function activate() {
    const showActivateDialog = await importShowActivateDialog()
    showActivateDialog(releaseId, id)
  }

  async function edit() {
    goto(`/marketplace/releases/${unwrap(release.id)}/edit`)
    close(id)
  }

  async function cancel() {
    const showCancelDialog = await importShowCancelDialog()
    showCancelDialog(releaseId, id)
  }

  function onClick(event) {
    switch (event.detail.key) {
      case 'announce':
        return announce()
      case 'activate':
        return activate()
      case 'edit':
        return edit()
      case 'cancel':
        return cancel()
    }
  }
</script>

<ModalDialog {id} {label} shrinkWidthToFit={true} background="var(--main-bg)">
  <GenericDialogList selectable={false} {items} on:click={onClick} />
</ModalDialog>
