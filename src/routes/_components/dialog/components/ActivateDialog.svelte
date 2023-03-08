<script>
    import { close } from '../helpers/closeDialog'
    import { activateRelease } from '../../../_api/releases';
    import { currentInstance } from '../../../_store/local';
    import { accessToken, currentSparkId } from '../../../_store/instance';
    import { updateRelease } from '../../../_actions/marketplace';
    import GenericConfirmationDialog from './GenericConfirmationDialog.svelte';
  
    export let id;
    export let label;
    export let releaseId;
    export let parentDialogId;
  
    let title = undefined
    let realm = 'dialog';
    let loading = false
    let error

    function closeDialog() {
        close(id)
        close(parentDialogId)
    }
  
    async function activate () {
        try {
            loading = true
            const res = await activateRelease($currentInstance, $accessToken, releaseId, $currentSparkId)
            await updateRelease(res.id)
            closeDialog()
        } catch (err) {
            error = err
        } finally {
            loading = false
        }
    }
</script>

<GenericConfirmationDialog {id} {parentDialogId} {label} {title} isConfirming={loading} negativeText={intl.no} positiveText={intl.yes} confirmationButtonDisabled={loading} on:positive={activate} on:negative={closeDialog}>
    <div class="body">
        <p>{intl.activateContent}</p>
    </div>
</GenericConfirmationDialog>

<style>
    .body {
        padding: 1rem;
    }
</style>
