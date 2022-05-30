<script>
  import { instanceCurrentSparks, instanceUsers, loggedInInstances } from '../../../_store/local';
  import SettingsLayout from '../../../_components/settings/SettingsLayout.svelte'
  import InstanceUserProfile from '../../../_components/settings/instance/InstanceUserProfile.svelte'
  import HomeTimelineFilterSettings from '../../../_components/settings/instance/HomeTimelineFilterSettings.svelte'
  import NotificationFilterSettings from '../../../_components/settings/instance/NotificationFilterSettings.svelte'
  import PushNotificationSettings from '../../../_components/settings/instance/PushNotificationSettings.svelte'
  import ThemeSettings from '../../../_components/settings/instance/ThemeSettings.svelte'
  import InstanceActions from '../../../_components/settings/instance/InstanceActions.svelte'
  import WordFilterSettings from '../../../_components/settings/instance/WordFilterSettings.svelte'
  import { updateUserForInstance } from '../../../_actions/instances'
  import { updateFiltersForInstance } from '../../../_actions/filters'
  import { onMount } from "svelte";

  export let params;

  const intl = {};

  let instanceName = params.instanceName;

  $: isAuthenticated = !!($loggedInInstances[instanceName] && $loggedInInstances[instanceName].access_token !== '');
  $: displayName = isAuthenticated ? instanceName : `${instanceName} (anonymous)`;
  $: user = $instanceUsers && $instanceUsers[instanceName];
  $: spark = $instanceCurrentSparks && $instanceCurrentSparks[instanceName];

  onMount(async () => {
    if (isAuthenticated) {
      await Promise.all([
        updateUserForInstance(instanceName),
        updateFiltersForInstance(instanceName)
      ])
    }
  });
</script>

<SettingsLayout page='settings/instances/{params.instanceName}' label={params.instanceName}>
  <h1 class="instance-name-h1">{displayName}</h1>

  {#if isAuthenticated && user}
    <h2>{intl.loggedInAs}</h2>
    <span class="generic-instance-settings user-id">{user.email}</span>
<!--    <InstanceUserProfile {user} {spark} />-->
  {/if}
  <h2>{intl.theme}</h2>
  <ThemeSettings {instanceName} />
  {#if isAuthenticated && user}
<!--    <h2>{intl.homeTimelineFilters}</h2>-->
<!--    <HomeTimelineFilterSettings {instanceName} />-->
    <h2>{intl.notificationFilters}</h2>
    <NotificationFilterSettings {instanceName} />
<!--    <h2>{intl.wordFilters}</h2>-->
<!--    <WordFilterSettings {instanceName} />-->
<!--    <h2>{intl.pushNotifications}</h2>-->
<!--    <PushNotificationSettings {instanceName} />-->
  {/if}
  <InstanceActions {instanceName} />
</SettingsLayout>
<style>
  .instance-name-h1 {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .user-id {
    font-size: 1.4em;
  }

  @media (max-width: 767px) {
    .user-id {
      font-size: 1.2em;
    }
  }

  @media (max-width: 430px) {
    .user-id {
      font-size: 1em;
    }
  }
</style>
