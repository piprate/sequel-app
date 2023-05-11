<script>
  import SettingsLayout from '../../_components/settings/SettingsLayout.svelte'
  import InfoAside from '../../_components/InfoAside.svelte'
  import UISettingsStyles from '../../_components/settings/UISettingsStyles.svelte'
  import {
    currentInstance,
    disableSubscriberCounts,
    disableTMMCounts,
    disableNotificationBadge,
    disableRelativeTimestamps,
    enableGrayscale,
    selectedTheme
  } from '../../_store/local';
  import { parseSettings, saveSettings } from '../../_actions/settings';
  import { switchToTheme } from '../../_utils/themeEngine';

  // suppress warnings
  export let params;
  params = undefined;
  const intl = {};

  let enableAll
  let hideSubscriberCount = $disableSubscriberCounts
  let hideTMMCount = $disableTMMCounts
  let hideUnread = $disableNotificationBadge
  let showAbsoluteTimestamps = $disableRelativeTimestamps
  let grayscaleMode = $enableGrayscale

  let metricsForm
  let immediacyForm
  let uiForm
  
  $: {
    if ($currentInstance) {
      enableAll = hideSubscriberCount && hideTMMCount && hideUnread && showAbsoluteTimestamps && grayscaleMode
      const settings = {
        metrics: {
          hideSubscriberCount,
          hideTMMCount
        },
        immediacy: {
          hideUnread,
          showAbsoluteTimestamps
        },
        ui: {
          enableGrayscale: grayscaleMode
        }
      }

      saveSettings(parseSettings(settings), 'wellness', undefined, true, true)
      switchToTheme($selectedTheme, grayscaleMode)
    }
  }

  function onCheckAllChange (e) {
    const { checked } = e.target;

    hideSubscriberCount = checked
    hideTMMCount = checked
    hideUnread = checked
    showAbsoluteTimestamps = checked
    grayscaleMode = checked
  }

  function onSave () {
    const metricsFormData = new FormData(metricsForm)
    const immediacyFormData = new FormData(immediacyForm)
    const uiFormData = new FormData(uiForm)

    const metrics = Object.fromEntries(metricsFormData)
    const immediacy = Object.fromEntries(immediacyFormData)
    const ui = Object.fromEntries(uiFormData)
    
    saveSettings(parseSettings({ metrics, immediacy, ui }), 'wellness')
  }
</script>

<SettingsLayout page='settings/wellness' label="{intl.wellness}">
  <h1 slot="header">{intl.wellnessSettings}</h1>
  <div class="wellness-header">
    <button class="primary" on:click={onSave}>{intl.saveSettings}</button>
  </div>

  <p>
    {intl.wellnessDescription}
  </p>

  <form class="ui-settings">
    <label class="setting-group">
      <input bind:checked={enableAll} type="checkbox" id="choice-check-all"
             on:change="{onCheckAllChange}">
      {intl.enableAll}
    </label>
  </form>

  <h2>{intl.metrics}</h2>

  <form bind:this={metricsForm} class="ui-settings">
    <label class="setting-group">
      <input bind:checked={hideSubscriberCount} name="hideSubscriberCount" type="checkbox" id="choice-disable-subscriber-counts">
      {intl.hideSubscriberCount}
    </label>
    <label class="setting-group">
      <input bind:checked={hideTMMCount} name="hideTMMCount" type="checkbox" id="choice-disable-tmm-counts">
      {intl.hideTMMCount}
    </label>
  </form>

  <h2>{intl.immediacy}</h2>

  <form bind:this={immediacyForm} class="ui-settings">
    <label class="setting-group">
      <input bind:checked={hideUnread} name="hideUnread" type="checkbox" id="choice-disable-unread-notification-counts">
      {intl.hideUnread}
    </label>
    <label class="settings-group">
      <input bind:checked={showAbsoluteTimestamps} name="showAbsoluteTimestamps" type="checkbox" id="choice-disable-relative-timestamps">
      {intl.showAbsoluteTimestamps}
    </label>
  </form>

  <InfoAside className="wellness-aside">
    {intl.filterNotificationsPre}
    <a data-sveltekit-preload-data href="/settings/instances{$currentInstance ? '/' + $currentInstance : ''}">{intl.filterNotificationsText}</a>.
    {intl.filterNotificationsPost}
  </InfoAside>

  <h2>{intl.ui}</h2>

  <form bind:this={uiForm} class="ui-settings">
    <label class="setting-group">
      <input bind:checked={grayscaleMode} name="enableGrayscale" type="checkbox" id="choice-grayscale">
      {intl.grayscaleMode}
    </label>
  </form>
  <p>
    {intl.wellnessFooter}
  </p>
  <button slot="footer" class='primary save-settings' on:click={onSave}>{intl.saveSettings}</button>
</SettingsLayout>
<UISettingsStyles />
<style>
  :global(.wellness-aside) {
    margin: 20px 10px 0px 10px;
  }

  .wellness-header {
    display: flex;
    justify-content: flex-end;
  }

  .save-settings {
    width: 100%;
  }

  .wellness-footer {
    margin-bottom: 2rem;
    display: flex;
    justify-content: center;
  }
</style>
