<script>
  import { verifyCredentials as verifyCredentialsStore } from '../../../_store/local'
  import SettingsLayout from '../../../_components/settings/SettingsLayout.svelte'
  import InstanceUserProfile from '../../../_components/settings/instance/InstanceUserProfile.svelte'
  import HomeTimelineFilterSettings from '../../../_components/settings/instance/HomeTimelineFilterSettings.svelte'
  import NotificationFilterSettings from '../../../_components/settings/instance/NotificationFilterSettings.svelte'
  import PushNotificationSettings from '../../../_components/settings/instance/PushNotificationSettings.svelte'
  import ThemeSettings from '../../../_components/settings/instance/ThemeSettings.svelte'
  import InstanceActions from '../../../_components/settings/instance/InstanceActions.svelte'
  import WordFilterSettings from '../../../_components/settings/instance/WordFilterSettings.svelte'
  import { updateVerifyCredentialsForInstance } from '../../../_actions/instances'
  import { updateFiltersForInstance } from '../../../_actions/filters'
  import { onMount } from "svelte";

  export let params;

  const intl = {};

  let instanceName = params.instanceName;

  $: verifyCredentials = ((verifyCredentialsVal, instanceName) => {
    return verifyCredentialsVal && verifyCredentialsVal[instanceName];
  })($verifyCredentialsStore, instanceName)

  onMount(async () => {
    await Promise.all([
      updateVerifyCredentialsForInstance(instanceName),
      updateFiltersForInstance(instanceName)
    ])
  });
</script>

<SettingsLayout page='settings/instances/{params.instanceName}' label={params.instanceName}>
  <h1 class="instance-name-h1">{params.instanceName}</h1>

  {#if verifyCredentials}
    <h2>{intl.loggedInAs}</h2>
    <InstanceUserProfile {verifyCredentials} />
    <h2>{intl.theme}</h2>
    <ThemeSettings {instanceName} />
    <h2>{intl.homeTimelineFilters}</h2>
    <HomeTimelineFilterSettings {instanceName} />
    <h2>{intl.notificationFilters}</h2>
    <NotificationFilterSettings {instanceName} />
    <h2>{intl.wordFilters}</h2>
    <WordFilterSettings {instanceName} />
    <h2>{intl.pushNotifications}</h2>
    <PushNotificationSettings {instanceName} />
    <InstanceActions {instanceName} />
  {/if}
</SettingsLayout>
<style>
  .instance-name-h1 {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
