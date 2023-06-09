<script>
  import GenericConfirmationDialog from './GenericConfirmationDialog.svelte'

  export let id
  export let label
  export let text = ''

  let title = undefined
  let positiveText = undefined
  let negativeText = undefined
</script>

<GenericConfirmationDialog {id} {label} {title} {positiveText} {negativeText} on:positive on:negative>
  <p>{text}</p>
</GenericConfirmationDialog>

<style>
  p {
    font-size: 1.3em;
    padding: 40px 20px;
  }
</style>
