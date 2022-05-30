<script>
  import ModalDialog from './ModalDialog.svelte'
  import ComposeBox from '../../compose/ComposeBox.svelte'
  import { on, emit } from '../../../_utils/eventBus'
  import { close } from '../helpers/closeDialog'
  import { onMount } from "svelte";

  export let id;
  export let label;

  let title = undefined;
  let realm = 'dialog';

  function onPostedStatus (_realm) {
    if (_realm !== realm) {
      return
    }
    close(id);
  }

  function onShow () {
    emit('resizeComposeInput', realm)
  }

  onMount(() => {
    return on('postedStatus', onPostedStatus);
  });
</script>

<ModalDialog
        {id}
        {label}
        {title}
        background="var(--main-bg)"
        on:show="{onShow}"
>
  <ComposeBox {realm} autoFocus={true} dialogId={id} />
</ModalDialog>