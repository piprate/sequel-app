<script>
    import { close } from '../helpers/closeDialog'
    import { cancelRelease } from '../../../_actions/marketplace';
    import GenericConfirmationDialog from './GenericConfirmationDialog.svelte';
  
    export let id;
    export let label;
    export let releaseId;
    export let parentDialogId;
  
    let realm = 'dialog';
    let title = undefined
    let loading = false
    let error

    function closeDialog() {
        close(id)
        close(parentDialogId)
    }
  
    async function cancel () {
        loading = true
        try {
          await cancelRelease(releaseId)
          closeDialog()
        } catch (err) {
          error = err
        }
    }
  </script>

<GenericConfirmationDialog {id} {parentDialogId} {label} {title} isConfirming={loading} negativeText={intl.no} positiveText={intl.yes} confirmationButtonDisabled={loading} on:positive={cancel} on:negative={closeDialog}>
    <div class="body">
        <p>{intl.confirmCancel}</p>
    </div>
</GenericConfirmationDialog>

<style>
    .body {
        padding: 1rem;
    }
</style>
