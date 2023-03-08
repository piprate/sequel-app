<script>
    import { withdrawListing } from '../../../_actions/marketplace';
  import ErrorMessage from '../../ErrorMessage.svelte';
    import { close } from '../helpers/closeDialog';
    import ModalDialog from './ModalDialog.svelte';
  
    export let id;
    export let label;
    export let listingId
    export let parentDialogId
  
    function closeDialog () {
        close(id)
        close(parentDialogId)
    }

    let loading = false
    let error

    async function withdraw () {
        try {
            loading = true
            await withdrawListing(listingId)
            closeDialog()
        } catch (err) {
            error = err
        } finally {
            loading = false
        }
    }
  </script>
  
<ModalDialog
  {id}
  {label}
  shrinkWidthToFit={true}
  background="var(--main-bg)"
>
    <ErrorMessage error={error} />
    <div class="content">
        <p>{intl.confirmWithdraw}</p>
    </div>
    <div class="footer">
        <button class="primary" on:click={withdraw} disabled={loading}>{intl.yes}</button>
        <button on:click={closeDialog}>{intl.no}</button>
    </div>
</ModalDialog>

<style>
    .content {
        padding: 1rem
    }

    .footer {
        padding: 0 1rem 1rem;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 0.5rem
    }
</style>