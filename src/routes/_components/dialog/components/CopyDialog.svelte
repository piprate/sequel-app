<script>
  import ModalDialog from './ModalDialog.svelte'
  import { close } from '../helpers/closeDialog'
  import { toast } from '../../toast/toast'
  import { doubleRAF } from '../../../_utils/doubleRAF'

  function copyFromInput (input) {
    // workarounds for iOS, via https://stackoverflow.com/a/34046084
    const range = document.createRange()
    range.selectNodeContents(input)
    const selection = window.getSelection()
    selection.removeAllRanges()
    selection.addRange(range)
    input.setSelectionRange(0, 9999999)
    document.execCommand('copy')
  }

  export let id;
  export let label;
  export let title;

  let text = '';
  let input;

  function onClick () {
    copyFromInput(input);
    toast.say('intl.copiedToClipboard');
    close(id);
  }

  function onShow () {
    // double raf is to work around a11y-dialog trying to set the input
    doubleRAF(() => {
      input.focus()
      input.setSelectionRange(0, text.length)
    })
  }
</script>

<ModalDialog
        {id}
        {label}
        {title}
        shrinkWidthToFit={true}
        background="var(--main-bg)"
        on:show="{onShow}"
>
  <form class="copy-dialog-form">
    <input value={text}
           bind:this={input}
    >
    <button type="button" on:click="{onClick}">
      Copy
    </button>
  </form>
</ModalDialog>
<style>
  .copy-dialog-form {
    display: grid;
    grid-template-rows: min-content min-content;
    grid-template-columns: 1fr;
    grid-gap: 10px;
    padding: 10px 20px;
    width: 400px;
    max-width: calc(100% - 40px);
  }
</style>