<script>
  import { close } from '../helpers/closeDialog'
  import { announceRelease } from '../../../_api/releases'
  import { currentInstance } from '../../../_store/local'
  import { accessToken, currentSparkId } from '../../../_store/instance'
  import { updateRelease } from '../../../_actions/marketplace'
  import GenericConfirmationDialog from './GenericConfirmationDialog.svelte'

  export let id
  export let parentDialogId
  export let label
  export let releaseId

  let title = undefined
  let loading = false
  let error

  function closeDialog() {
    close(id)
    close(parentDialogId)
  }

  async function announce() {
    try {
      loading = true
      const res = await announceRelease($currentInstance, $accessToken, releaseId, $currentSparkId)
      await updateRelease(res.id)
      closeDialog()
    } catch (err) {
      error = err
    } finally {
      loading = false
    }
  }
</script>

<GenericConfirmationDialog
  {id}
  {parentDialogId}
  {label}
  {title}
  isConfirming={loading}
  negativeText={intl.no}
  positiveText={intl.yes}
  confirmationButtonDisabled={loading}
  on:positive={announce}
  on:negative={closeDialog}
>
  <div class="body">
    <p>{intl.announceContent}</p>
  </div>
</GenericConfirmationDialog>

<style>
  .body {
    padding: 1rem;
  }
</style>
