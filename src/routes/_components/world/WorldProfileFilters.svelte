<script>
  import TabSet from '../TabSet.svelte'
  import { unwrap } from '../../_utils/mapper'

  export let world
  export let filter

  $: id = unwrap(world.id)
  $: tabs = [
    {
      name: '',
      label: 'Posts',
      href: `/worlds/${id}`
    },
    {
      name: 'with_comments',
      label: 'Posts and comments',
      href: `/worlds/${id}/with_comments`
    }
    // {
    //   name: 'media',
    //   label: 'Media',
    //   href: `/worlds/${id}/media`
    // }
  ]
</script>

<TabSet
        label="{intl.filters}"
        currentTabName={filter}
        {tabs}
        className="world-profile-filters"
/>
<style>
    :global(.world-profile-filters) {
        background: var(--world-profile-bg);
    }
</style>