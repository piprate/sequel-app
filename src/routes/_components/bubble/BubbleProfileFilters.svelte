<script>
  import TabSet from '../TabSet.svelte'
  import { unwrap } from '../../_utils/mapper'

  export let bubble
  export let filter

  $: id = unwrap(bubble.id)
  $: tabs = [
    {
      name: '',
      label: 'Posts',
      href: `/bubbles/${id}`
    },
    {
      name: 'with_comments',
      label: 'Posts and comments',
      href: `/bubbles/${id}/with_comments`
    }
    // {
    //   name: 'media',
    //   label: 'Media',
    //   href: `/bubbles/${id}/media`
    // }
  ]
</script>

<TabSet
        label="{intl.filters}"
        currentTabName={filter}
        {tabs}
        className="bubble-profile-filters"
/>
<style>
    :global(.bubble-profile-filters) {
        background: var(--bubble-profile-bg);
    }
</style>