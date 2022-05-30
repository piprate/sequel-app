<script>
  import { currentInstance, loggedInInstancesInOrder } from '../../../_store/local'
  import { importShowTextConfirmationDialog } from '../../dialog/asyncDialogs/importShowTextConfirmationDialog.js'
  import { switchToInstance, logOutOfInstance } from '../../../_actions/instances'
  import { formatIntl } from '../../../_utils/formatIntl'

  export let instanceName;

  const intl = {};

  function onSwitchToThisInstance (e) {
    e.preventDefault()
    switchToInstance(instanceName)
  }

  async function onLogOut (e) {
    e.preventDefault()

    const showTextConfirmationDialog = await importShowTextConfirmationDialog()
    showTextConfirmationDialog({
      text: formatIntl('intl.logOutOfInstanceConfirm', { instance: instanceName })
    }).$on('positive', () => {
      // TODO: dumb timing hack because the modal navigates back while we're trying to navigate forward
      setTimeout(() => {
        /* no await */logOutOfInstance(instanceName)
      }, 200)
    })
  }
</script>

<form class="instance-actions" aria-label="{intl.switchOrLogOut}">
  {#if $loggedInInstancesInOrder.length > 1 && $currentInstance !== instanceName}
    <button class="primary"
            on:click="{onSwitchToThisInstance}">
      {intl.switchTo}
    </button>
  {/if}
  <button on:click="{onLogOut}">{intl.logOut}</button>
</form>
<style>
  .instance-actions {
    width: 100%;
    display: flex;
    justify-content: right;
    margin: 20px 0;
  }
  .instance-actions button {
    margin: 0 5px;
    flex-basis: 100%;
  }
</style>
