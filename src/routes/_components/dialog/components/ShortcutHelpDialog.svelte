<script>
  import ModalDialog from './ModalDialog.svelte'
  import ShortcutHelpInfo from '../../ShortcutHelpInfo.svelte'
  import Shortcut from '../../shortcut/Shortcut.svelte'
  import { close } from '../helpers/closeDialog'

  export let id
  export let label
</script>

<ModalDialog {id} {label} background="var(--muted-modal-bg)" muted="true" className="shortcut-help-modal-dialog">
  <h1>{intl.hotkeys}</h1>

  <ShortcutHelpInfo inDialog={true} />

  <Shortcut
    scope="modal-{id}"
    key="h|?"
    on:pressed={() => {
      close(id)
    }}
  />
</ModalDialog>

<style>
  h1 {
    color: var(--muted-modal-text);
  }
</style>
