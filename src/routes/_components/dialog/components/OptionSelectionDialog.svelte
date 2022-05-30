<script>
  import ModalDialog from './ModalDialog.svelte';
  import GenericDialogList from './GenericDialogList.svelte';
  import { close } from '../helpers/closeDialog';
  import { createEventDispatcher } from 'svelte';

  export let id;
  export let label;
  export let title;
  export let items;

  const dispatch = createEventDispatcher();

  function onClick (event) {
    dispatch('select', event.detail.key);
    close(id);
  }
</script>

<ModalDialog
        {id}
        {label}
        {title}
        shrinkWidthToFit={true}
        background="var(--main-bg)"
>
  <GenericDialogList selectable={true} {items} on:click="{onClick}" />
</ModalDialog>