<script>
  import GenericConfirmationDialog from './GenericConfirmationDialog.svelte'
  import { close } from '../helpers/closeDialog'
  import { setSparkMuted } from '../../../_actions/mute'
  import { formatIntl } from '../../../_utils/formatIntl'

  export let id
  export let label
  export let spark

  let positiveText = 'intl.mute'
  let title = ''
  let muteNotifications = true

  $: confirmMuteText = formatIntl('intl.muteSparkConfirm', { spark: `@${spark.acct}` })

  async function doMute() {
    close(id)
    await setSparkMuted(spark.id, /* mute */ true, muteNotifications, /* toastOnSuccess */ true)
  }
</script>

<GenericConfirmationDialog {id} {label} {title} {positiveText} on:positive={doMute}>
  <div class="mute-dialog">
    <p>
      {confirmMuteText}
    </p>
    <div class="mute-dialog-form">
      <input type="checkbox" id="mute-notifications" name="mute-notifications" bind:checked={muteNotifications} />
      <label for="mute-notifications">{intl.muteNotifications}</label>
    </div>
  </div>
</GenericConfirmationDialog>

<style>
  .mute-dialog {
    padding: 20px;
  }
  .mute-dialog-form {
    margin-top: 20px;
  }
</style>
