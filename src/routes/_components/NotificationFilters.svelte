<script>
  import TabSet from './TabSet.svelte'

  export let filter

  let tabs = [
    {
      name: '',
      label: 'intl.all',
      href: '/notifications'
    },
    {
      name: 'mentions',
      label: 'intl.mentions',
      href: '/notifications/mentions'
    }
  ]
</script>

<TabSet label={intl.filters} currentTabName={filter} {tabs} className="notification-filters" />
