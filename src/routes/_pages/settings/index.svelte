<script>
  import SettingsLayout from '../../_components/settings/SettingsLayout.svelte'
  import SettingsList from '../../_components/settings/SettingsList.svelte'
  import SettingsListRow from '../../_components/settings/SettingsListRow.svelte'
  import SettingsListButton from '../../_components/settings/SettingsListButton.svelte'
  import { currentInstance, isAuthenticated, isUserLoggedIn } from '../../_store/local'
  import { importShowTextConfirmationDialog } from '../../_components/dialog/asyncDialogs/importShowTextConfirmationDialog'
  import { formatIntl } from '../../_utils/formatIntl'
  import { logOutOfInstance } from '../../_actions/instances'

  // suppress warnings
  export let params
  params = undefined
  const intl = {}

  function reload(e) {
    e.preventDefault()
    document.location.reload(true)
  }

  async function logOut(e) {
    e.preventDefault()

    const instanceName = $currentInstance
    const showTextConfirmationDialog = await importShowTextConfirmationDialog()
    showTextConfirmationDialog({
      text: formatIntl('intl.logOutOfInstanceConfirm', { instance: instanceName })
    }).$on('positive', () => {
      // TODO: dumb timing hack because the modal navigates back while we're trying to navigate forward
      setTimeout(() => {
        /* no await */
        logOutOfInstance(instanceName)
      }, 200)
    })
  }
</script>

<SettingsLayout page="settings" label={intl.settings}>
  <h1>{intl.settings}</h1>

  <SettingsList>
    <SettingsListRow>
      <SettingsListButton href="/settings/general" label={intl.general} />
    </SettingsListRow>
    <SettingsListRow>
      <SettingsListButton href="/settings/instances" label={intl.instances} />
    </SettingsListRow>
    {#if $isAuthenticated}
      <SettingsListRow>
        <SettingsListButton href="/settings/flow" label={intl.flow} />
      </SettingsListRow>
    {/if}
    <SettingsListRow>
      <SettingsListButton href="/settings/wellness" label={intl.wellness} />
    </SettingsListRow>
    <SettingsListRow>
      <SettingsListButton href="/settings/hotkeys" label={intl.hotkeys} />
    </SettingsListRow>
    <SettingsListRow>
      <SettingsListButton href="#" on:click={reload} label={intl.reload} />
    </SettingsListRow>
    <SettingsListRow>
      <SettingsListButton href="/settings/about" label={intl.aboutApp} />
    </SettingsListRow>
    {#if $isUserLoggedIn}
      <SettingsListRow>
        <SettingsListButton href="" on:click={logOut} label={intl.logOut} />
      </SettingsListRow>
    {/if}
  </SettingsList>
</SettingsLayout>
