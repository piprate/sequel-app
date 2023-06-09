<script>
  import ModalDialog from './ModalDialog.svelte'
  import GenericDialogList from './GenericDialogList.svelte'
  import { close } from '../helpers/closeDialog'
  import { copyText } from '../../../_actions/copyText'

  export let id
  export let label
  export let title
  export const token = undefined
  export const relationship = undefined
  export const ourSpark = undefined

  $: items = [
    {
      key: 'copy',
      label: 'intl.copyLinkToToken',
      icon: '#fa-link'
    }
  ].filter(Boolean)

  function onClick(event) {
    switch (event.detail.key) {
      case 'copy':
        return onCopyClicked()
    }
  }

  async function onCopyClicked() {
    const url = `${location.origin}${location.pathname}`
    close(id)
    await copyText(url)
  }
</script>

<ModalDialog {id} {label} {title} shrinkWidthToFit={true} background="var(--main-bg)">
  <GenericDialogList selectable={false} {items} on:click={onClick} />
</ModalDialog>
