<script>
  import ModalDialog from './ModalDialog.svelte'
  import { close } from '../helpers/closeDialog'
  import { createEventDispatcher } from "svelte";
  import LoadingSpinner from '../../LoadingSpinner.svelte';

  export let id;
  export let parentDialogId = undefined;
  export let label;
  export let title;
  export let positiveText = undefined;
  export let negativeText = undefined;
  export let confirmationButtonDisabled;
  export let isConfirming = false
  let className = '';
  let positiveResult;

  const dispatch = createEventDispatcher();

  function closeDialog () {
    close(id)
    if (parentDialogId) close(parentDialogId)
  }

  function onPositive() {
    dispatch('positive')
    positiveResult = true;
  }

  function onNegative() {
    dispatch('negative')
    closeDialog();
  }

  $: if (positiveResult && !isConfirming) {
    closeDialog()
  }
</script>

<ModalDialog
        {id}
        {label}
        {title}
        {className}
        shrinkWidthToFit={true}
        background="var(--main-bg)"
>
  <form class="confirmation-dialog-form">
    <slot></slot>
    <div class="confirmation-dialog-form-flex">
      <button type="button" disabled={confirmationButtonDisabled} on:click="{onPositive}">
        {#if isConfirming}
          <LoadingSpinner size={20} />
        {:else} 
          {positiveText || 'OK'}
        {/if}
      </button>
      <button type="button" on:click="{onNegative}">
        {negativeText || 'Cancel'}
      </button>
    </div>
  </form>
</ModalDialog>
<style>
  .confirmation-dialog-form {
    max-width: 75ch;
  }

  .confirmation-dialog-form-flex {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 10px;
    padding: 10px 20px;
  }
  .confirmation-dialog-form-flex button {
    min-width: 125px;
  }
</style>