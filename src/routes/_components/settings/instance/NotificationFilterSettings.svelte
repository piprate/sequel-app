<script>
  import GenericInstanceSettings from './GenericInstanceSettings.svelte'
  import {
    NOTIFICATION_BUBBLE_MEMBERSHIP,
    NOTIFICATION_MENTIONS,
    NOTIFICATION_SUBSCRIBERS,
    NOTIFICATION_TMMS,
    NOTIFICATION_WORLD_MEMBERSHIP
  } from '../../../_static/instanceSettings'

  export let instanceName

  const intl = {}

  const options = [
    {
      key: NOTIFICATION_TMMS,
      label: 'intl.tellMeMores',
      defaultValue: true
    },
    {
      key: NOTIFICATION_SUBSCRIBERS,
      label: 'intl.newSubscribers',
      defaultValue: true
    },
    {
      key: NOTIFICATION_BUBBLE_MEMBERSHIP,
      label: 'intl.bubbleNotices',
      defaultValue: true
    },
    {
      key: NOTIFICATION_WORLD_MEMBERSHIP,
      label: 'intl.worldNotices',
      defaultValue: true
    },
    {
      key: NOTIFICATION_MENTIONS,
      label: 'intl.mentions',
      defaultValue: true
    }
  ]
</script>
<GenericInstanceSettings
        {instanceName}
        {options}
        label="{intl.notificationFilterSettings}"
/>