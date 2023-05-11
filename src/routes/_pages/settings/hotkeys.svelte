<script>
  import SettingsLayout from '../../_components/settings/SettingsLayout.svelte'
  import ShortcutHelpInfo from '../../_components/ShortcutHelpInfo.svelte'
  import { disableHotkeys, leftRightChangesFocus } from '../../_store/local'
  import { isKaiOS } from '../../_utils/userAgent/isKaiOS'
  import UISettingsStyles from '../../_components/settings/UISettingsStyles.svelte'
  import { parseSettings, saveSettings } from '../../_actions/settings';

  // suppress warnings
  export let params;
  params = undefined;
  const intl = {};
  
  let hotkeysForm
  let allowChangeHotkeySetting = !isKaiOS() // In general KaiOS users cannot change this because they need the hotkeys
  let disableAll = $disableHotkeys
  
  $: allowChangeLeftRightSetting = !disableAll && !isKaiOS();
  
  function onSave () {
    const formData = new FormData(hotkeysForm)
    const settings = Object.fromEntries(formData.entries())

    saveSettings(parseSettings(settings), 'hotkeys')
  }

  
  function applyChanges() {
    const formData = new FormData(hotkeysForm)
    const settings = Object.fromEntries(formData.entries())

    saveSettings(parseSettings(settings), 'hotkeys', undefined, true, true)
  }
</script>

<SettingsLayout page='settings/hotkeys' label="{intl.hotkeys}">
  <svelte:fragment slot="header">
    <h1>{intl.hotkeys}</h1>
    <button class='primary' on:click={onSave}>{intl.saveSettings}</button>
  </svelte:fragment>

  <h2 class="sr-only">{intl.preferences}</h2>
  <form name="hotkeys" class="ui-settings" aria-label="{intl.hotkeySettings}" bind:this={hotkeysForm} on:change={applyChanges}>
    <label class="setting-group {allowChangeHotkeySetting ? '' : 'disabled-style'}">
      <input name="disableAll" type="checkbox" id="choice-disable-hotkeys" bind:checked='{disableAll}' disabled={!allowChangeHotkeySetting}>
      {intl.disableHotkeys}
    </label>
    <label class="setting-group {allowChangeLeftRightSetting ? '' : 'disabled-style'}">
      <input name="leftRightChangesFocus" type="checkbox" id="choice-left-right-focus" checked="{$leftRightChangesFocus}" disabled={!allowChangeLeftRightSetting}>
      {intl.leftRightArrows}
    </label>
  </form>

  <h2 class="sr-only">{intl.guide}</h2>

  <ShortcutHelpInfo />
  <svelte:fragment slot="footer">
    <button class='primary'>{intl.saveSettings}</button>
  </svelte:fragment>
</SettingsLayout>
<UISettingsStyles />
<style>
  .ui-settings {
    margin-bottom: 20px;
  }

  label.disabled-style {
    color: var(--deemphasized-text-color);
  }
</style>
