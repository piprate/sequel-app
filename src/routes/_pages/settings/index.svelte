<script>
  import SettingsLayout from '../../_components/settings/SettingsLayout.svelte'
  import SettingsList from '../../_components/settings/SettingsList.svelte'
  import SettingsListRow from '../../_components/settings/SettingsListRow.svelte'
  import SettingsListButton from '../../_components/settings/SettingsListButton.svelte'

  // suppress warnings
  export let params;
  params = undefined;
  const intl = {};

  function reload (event) {
    event.preventDefault()
    document.location.reload(true)
  }
</script>

<SettingsLayout page='settings' label="{intl.settings}">
  <h1>{intl.settings}</h1>

  <SettingsList>
    <SettingsListRow>
      <SettingsListButton href="/settings/general" label="{intl.general}"/>
    </SettingsListRow>
    <SettingsListRow>
      <SettingsListButton href="/settings/instances" label="{intl.instances}"/>
    </SettingsListRow>
    <SettingsListRow>
      <SettingsListButton href="/settings/wellness" label="{intl.wellness}"/>
    </SettingsListRow>
    <SettingsListRow>
      <SettingsListButton href="/settings/hotkeys" label="{intl.hotkeys}"/>
    </SettingsListRow>
    <SettingsListRow>
      <SettingsListButton href="#" on:click="{reload}" label="{intl.reload}"/>
    </SettingsListRow>
    <SettingsListRow>
      <SettingsListButton href="/settings/about" label="{intl.aboutApp}"/>
    </SettingsListRow>
  </SettingsList>

</SettingsLayout>

