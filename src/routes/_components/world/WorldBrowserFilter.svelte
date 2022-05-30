<script>
  import TabSet from '../TabSet.svelte'

  export let filter;

  $: tabs = [
    {
      name: 'my_stuff',
      label: 'intl.yourWorldsTitle',
      href: `/worlds`
    },
    {
      name: 'explore',
      label: 'intl.worldExploreTitle',
      href: `/worlds/explore`
    }
  ];
</script>

<TabSet
        label="{intl.filters}"
        currentTabName={filter}
        {tabs}
        className="world-browser-filters"
/>
<style>
    :global(.world-browser-filters) {
        background: var(--spark-profile-bg);
    }
</style>