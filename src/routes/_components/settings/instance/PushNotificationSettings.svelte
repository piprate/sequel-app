<script>
  import GenericInstanceSettingsStyle from './GenericInstanceSettingsStyle.svelte'
  import {
    loggedInInstancesInOrder,
    notificationPermission,
    pushNotificationsSupport,
    pushSubscriptions
  } from '../../../_store/local'
  import { importShowTextConfirmationDialog } from '../../dialog/asyncDialogs/importShowTextConfirmationDialog.js'
  import { logOutOfInstance } from '../../../_actions/instances'
  import { updateAlerts, updatePushSubscriptionForInstance } from '../../../_actions/pushSubscription'
  import { toast } from '../../toast/toast'
  import { get } from '../../../_utils/lodash-lite'
  import { formatIntl } from '../../../_utils/formatIntl'
  import { onMount } from 'svelte'

  export let instanceName

  const intl = {}

  const options = [
    {
      key: 'tmm',
      label: 'intl.tellMeMores'
    },
    {
      key: 'subscription',
      label: 'intl.newSubscribers'
    },
    {
      key: 'bubble',
      label: 'intl.bubbleNotices'
    },
    {
      key: 'world',
      label: 'intl.worldNotices'
    },
    {
      key: 'mention',
      label: 'intl.mentions'
    }
  ]

  let form

  async function onPushSettingsChange (e) {
    const alerts = {}

    for (const { key } of options) {
      alerts[key] = form.elements[key].checked
    }

    try {
      await updateAlerts(instanceName, alerts)
    } catch (err) {
      e.target.checked = !e.target.checked

      // TODO: Better way to detect missing authorization scope
      if (err.message.startsWith('403:')) {
        const showTextConfirmationDialog = await importShowTextConfirmationDialog()
        showTextConfirmationDialog({
          text: formatIntl('intl.needToReauthenticate', { instance: instanceName })
        }).on('positive', () => {
          /* no await */
          logOutOfInstance(instanceName)
        })
      } else {
        toast.say(formatIntl('intl.failedToUpdatePush', {
          error: err.message || ''
        }))
      }
    }
  }

  onMount(async () => {
    await updatePushSubscriptionForInstance(instanceName)

    const pushSubscription = $pushSubscriptions[instanceName]

    for (const { key } of options) {
      form.elements[key].checked = get(pushSubscription, ['alerts', key])
    }
  })
</script>

<div class="generic-instance-settings">
  {#if $pushNotificationsSupport === false}
    <p>{intl.browserDoesNotSupportPush}</p>
  {:else if $notificationPermission === "denied"}
    <p role="alert">{intl.deniedPush}</p>
  {:else if $loggedInInstancesInOrder.length > 1}
    <p>{intl.pushNotificationsNote}</p>
  {/if}
  <form id="push-notification-settings"
        disabled="{!$pushNotificationsSupport}"
        bind:this={form}
        aria-label="{intl.pushSettings}">
    {#each options as option, i (option.key)}
      {#if i > 0}
        <br>
      {/if}
      <input type="checkbox"
             id="push-notifications-{option.key}"
             name="{option.key}"
             disabled="{!$pushNotificationsSupport}"
             on:change="{onPushSettingsChange}">
      <label for="push-notifications-{option.key}">{option.label}</label>
    {/each}
  </form>
</div>
<GenericInstanceSettingsStyle/>
<style>
  form[disabled="true"] {
    opacity: 0.5;
  }
  p {
    margin: 0 0 10px 0;
  }
</style>
