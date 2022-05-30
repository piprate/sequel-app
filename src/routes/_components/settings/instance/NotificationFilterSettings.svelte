<script>
  import GenericInstanceSettings from './GenericInstanceSettings.svelte'
  import {
    NOTIFICATION_REBLOGS,
    NOTIFICATION_FAVORITES,
    NOTIFICATION_FOLLOWS,
    NOTIFICATION_MENTIONS,
    NOTIFICATION_POLLS
  } from '../../../_static/instanceSettings'

  export let instanceName;

  const intl = {};

  const options = [
    {
      key: NOTIFICATION_FOLLOWS,
      label: 'intl.newFollowers',
      defaultValue: true
    },
    {
      key: NOTIFICATION_FAVORITES,
      label: 'intl.favorites',
      defaultValue: true
    },
    {
      key: NOTIFICATION_REBLOGS,
      label: 'intl.reblogs',
      defaultValue: true
    },
    {
      key: NOTIFICATION_MENTIONS,
      label: 'intl.mentions',
      defaultValue: true
    },
    {
      key: NOTIFICATION_POLLS,
      label: 'intl.pollResults',
      defaultValue: true
    }
  ];
</script>
<GenericInstanceSettings
        {instanceName}
        {options}
        label="{intl.notificationFilterSettings}"
/>