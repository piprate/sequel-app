<script>
  import { hasNotifications, numberOfNotifications } from '../_store/badge'
  import { currentInstance, isUserLoggedIn } from "../_store/local";
  import { formatIntl } from '../_utils/formatIntl'

  export let name;
  export let settingsPage = false;

  $: showInstanceName =  !!($isUserLoggedIn && !settingsPage && $currentInstance);

  $: title = formatIntl('intl.pageTitle', {
    showInstanceName,
    instanceName: $currentInstance,
    hasNotifications: $hasNotifications,
    count: $numberOfNotifications,
    name
  })
</script>

<svelte:head>
  <title>{title}</title>
</svelte:head>

