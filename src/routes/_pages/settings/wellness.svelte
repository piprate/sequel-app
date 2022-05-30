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
    enableGrayscale
  } from '../../_store/local';
  import {onMount} from "svelte";

  // suppress warnings
  export let params;
  params = undefined;
  const intl = {};

  function onCheckAllChange (e) {
    const { checked } = e.target
    $disableSubscriberCounts = checked;
    $disableTMMCounts = checked;
    $disableNotificationBadge = checked;
    $disableRelativeTimestamps = checked;
    $enableGrayscale = checked;
  }

  function onChange () {
    flushChangesToCheckAll()
  }

  function flushChangesToCheckAll () {
    document.querySelector('#choice-check-all').checked = $disableSubscriberCounts &&
            $disableTMMCounts &&
            $disableNotificationBadge &&
            $disableRelativeTimestamps &&
            $enableGrayscale
  }

  onMount(() => {
    flushChangesToCheckAll();
  });
</script>

<SettingsLayout page='settings/wellness' label="{intl.wellness}">
  <h1>{intl.wellnessSettings}</h1>

  <p>
    {intl.wellnessDescription}
  </p>

  <form class="ui-settings">
    <label class="setting-group">
      <input type="checkbox" id="choice-check-all"
             on:change="{onCheckAllChange}">
      {intl.enableAll}
    </label>
  </form>

  <h2>{intl.metrics}</h2>

  <form class="ui-settings">
    <label class="setting-group">
      <input type="checkbox" id="choice-disable-subscriber-counts"
             bind:checked="{$disableSubscriberCounts}" on:change="{onChange}">
      {intl.hideSubscriberCount}
    </label>
    <label class="setting-group">
      <input type="checkbox" id="choice-disable-tmm-counts"
             bind:checked="{$disableTMMCounts}" on:change="{onChange}">
      {intl.hideTMMCount}
    </label>
  </form>

  <h2>{intl.immediacy}</h2>

  <form class="ui-settings">
    <label class="setting-group">
      <input type="checkbox" id="choice-disable-unread-notification-counts"
             bind:checked="{$disableNotificationBadge}" on:change="{onChange}">
      {intl.hideUnread}
    </label>
    <label class="settings-group">
      <input type="checkbox" id="choice-disable-relative-timestamps"
             bind:checked="{$disableRelativeTimestamps}" on:change="{onChange}">
      {intl.showAbsoluteTimestamps}
    </label>
  </form>

  <InfoAside className="wellness-aside">
    {intl.filterNotificationsPre}
    <a sapper:prefetch href="/settings/instances{$currentInstance ? '/' + $currentInstance : ''}">{intl.filterNotificationsText}</a>.
    {intl.filterNotificationsPost}
  </InfoAside>

  <h2>{intl.ui}</h2>

  <form class="ui-settings">
    <label class="setting-group">
      <input type="checkbox" id="choice-grayscale"
             bind:checked="{$enableGrayscale}" on:change="{onChange}">
      {intl.grayscaleMode}
    </label>
  </form>
  <p>
    {intl.wellnessFooter}
  </p>
</SettingsLayout>
<UISettingsStyles />
<style>
  :global(.wellness-aside) {
    margin: 20px 10px 0px 10px;
  }
</style>
