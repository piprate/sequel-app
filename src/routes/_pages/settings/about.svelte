<script>
  import SettingsLayout from '../../_components/settings/SettingsLayout.svelte'

  export const params = undefined

  const version = import.meta.env.SEQUEL_APP_VERSION
</script>

<SettingsLayout page="settings/about" label={intl.aboutApp}>
  <div>
    <h1>{intl.aboutApp}</h1>

    <h2>Version {version}</h2>

    {@html intl.aboutAppDescription}
  </div>
</SettingsLayout>
