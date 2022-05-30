<script>
  import ModalDialog from './ModalDialog.svelte'
  import { close } from '../helpers/closeDialog'
  import { on } from '../../../_utils/eventBus'
  import { createEventDispatcher, onMount } from "svelte";

  export let id;
  export let label;
  export let title;
  export let positiveText = undefined;
  export let negativeText = undefined;
  export let confirmationButtonDisabled;
  let className = '';
  let positiveResult;

  const dispatch = createEventDispatcher();

  function onPositive() {
    positiveResult = true;
    close(id);
  }

  function onNegative() {
    close(id);
  }

  function onDestroyDialog(thisId) {
    if (thisId !== id) {
      return
    }
    if (positiveResult) {
      dispatch('positive')
    } else {
      dispatch('negative')
    }
  }

  onMount(() => {
    return on('destroyDialog', onDestroyDialog);
  });
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
        {positiveText || 'OK'}
      </button>
      <button type="button" on:click="{onNegative}">
        {negativeText || 'Cancel'}
      </button>
    </div>
  </form>
</ModalDialog>
<style>
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