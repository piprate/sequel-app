<script>
  import GenericInstanceSettings from './GenericInstanceSettings.svelte'
  import { HOME_REBLOGS, HOME_REPLIES } from '../../../_static/instanceSettings'

  export let instanceName;

  const intl = {};

  const options = [
    {
      key: HOME_REBLOGS,
      label: 'intl.showReblogs',
      defaultValue: true
    },
    {
      key: HOME_REPLIES,
      label: 'intl.showReplies',
      defaultValue: true
    }
  ];
</script>

<GenericInstanceSettings
        {instanceName}
        {options}
        label="{intl.homeTimelineFilterSettings}"
/>
