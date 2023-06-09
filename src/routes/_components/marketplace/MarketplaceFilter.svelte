<script>
  import TabSet from '../TabSet.svelte'

  export let filter

  $: tabs = [
    {
      name: 'active',
      label: 'intl.activeListings',
      href: `/marketplace`
    },
    {
      name: 'releases',
      label: 'intl.releases',
      href: `/marketplace/releases`
    },
    {
      name: 'history',
      label: 'intl.listingHistory',
      href: `/marketplace/history`
    }
  ]
</script>

<TabSet label={intl.filters} currentTabName={filter} {tabs} className="marketplace-browser-filters" />

<style>
  :global(.marketplace-browser-filters) {
    background: var(--spark-profile-bg);
  }
</style>
