<!-- NOT IN USE. This page is left as an example of timeline filter configuration,
     and as a placeholder in case if we need it.
-->
<script>
  import GenericInstanceSettings from './GenericInstanceSettings.svelte'
  import { HOME_COMMENTS } from '../../../_static/instanceSettings'

  export let instanceName

  const intl = {}

  const options = [
    {
      key: HOME_COMMENTS,
      label: 'intl.showComments',
      defaultValue: true
    }
  ]
</script>

<GenericInstanceSettings
        {instanceName}
        {options}
        label="{intl.homeTimelineFilterSettings}"
/>
