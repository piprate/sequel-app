<script>
  import TabSet from '../TabSet.svelte'
  import { unwrap } from '../../_utils/mapper'

  export let world
  export let filter

  $: id = unwrap(world.id)
  $: inReaderMode = location.pathname.endsWith('/reader_mode')
  $: tabs = [
    {
      name: inReaderMode ? 'reader_mode' : '',
      label: 'Posts',
      href: `/worlds/${id}${inReaderMode ? '/reader_mode' : ''}`
    },
    {
      name: inReaderMode ? 'with_comments/reader_mode' : 'with_comments',
      label: 'Posts and comments',
      href: `/worlds/${id}/with_comments${inReaderMode ? '/reader_mode' : ''}`
    }
    // {
    //   name: 'media',
    //   label: 'Media',
    //   href: `/worlds/${id}/media`
    // }
  ]
</script>

<TabSet label={intl.filters} currentTabName={filter} {tabs} className="world-profile-filters" />

<style>
  :global(.world-profile-filters) {
    background: var(--world-profile-bg);
  }
</style>
