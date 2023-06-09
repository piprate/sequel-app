<script>
  import TabSet from '../TabSet.svelte'

  export let filter

  $: tabs = [
    {
      name: 'my_stuff',
      label: 'intl.yourSparksTitle',
      href: `/sparks`
    },
    {
      name: 'bookmarks',
      label: 'intl.sparkBookmarksTitle',
      href: `/sparks/bookmarks`
    }
    // {
    //   name: 'explore',
    //   label: 'intl.sparkExploreTitle',
    //   href: `/sparks/explore`
    // }
  ]
</script>

<TabSet label={intl.filters} currentTabName={filter} {tabs} className="spark-browser-filters" />

<style>
  :global(.spark-browser-filters) {
    background: var(--spark-profile-bg);
  }
</style>
