<script>
  import SettingsLayout from '../../_components/settings/SettingsLayout.svelte'
  import ShortcutHelpInfo from '../../_components/ShortcutHelpInfo.svelte'
  import { disableHotkeys, leftRightChangesFocus } from '../../_store/local'
  import { isKaiOS } from '../../_utils/userAgent/isKaiOS'
  import UISettingsStyles from '../../_components/settings/UISettingsStyles.svelte'

  // suppress warnings
  export let params;
  params = undefined;
  const intl = {};

  let allowChangeHotkeySetting = !isKaiOS() // In general KaiOS users cannot change this because they need the hotkeys

  $: allowChangeLeftRightSetting = !$disableHotkeys && !isKaiOS();
</script>

<SettingsLayout page='settings/hotkeys' label="{intl.hotkeys}">
  <h1>{intl.hotkeys}</h1>

  <h2 class="sr-only">{intl.preferences}</h2>
  <form class="ui-settings" aria-label="{intl.hotkeySettings}">
    <label class="setting-group {allowChangeHotkeySetting ? '' : 'disabled-style'}">
      <input type="checkbox" id="choice-disable-hotkeys"
             bind:checked="{$disableHotkeys}"
             disabled={!allowChangeHotkeySetting}
      >
      {intl.disableHotkeys}
    </label>
    <label class="setting-group  {allowChangeLeftRightSetting ? '' : 'disabled-style'}">
      <input type="checkbox" id="choice-left-right-focus"
             bind:checked="{$leftRightChangesFocus}"
             disabled={!allowChangeLeftRightSetting}
      >
      {intl.leftRightArrows}
    </label>
  </form>

  <h2 class="sr-only">{intl.guide}</h2>

  <ShortcutHelpInfo />
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
