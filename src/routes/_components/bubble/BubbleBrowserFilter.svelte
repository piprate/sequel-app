<script>
  import TabSet from '../TabSet.svelte'

  export let filter

  $: tabs = [
    {
      name: 'my_stuff',
      label: 'intl.yourBubblesTitle',
      href: `/bubbles`
    },
    {
      name: 'bookmarks',
      label: 'intl.bubbleBookmarksTitle',
      href: `/bubbles/bookmarks`
    },
    {
      name: 'explore',
      label: 'intl.bubbleExploreTitle',
      href: `/bubbles/explore`
    }
  ]
</script>

<TabSet label={intl.filters} currentTabName={filter} {tabs} className="bubble-browser-filters" />

<style>
  :global(.bubble-browser-filters) {
    background: var(--spark-profile-bg);
  }
</style>
