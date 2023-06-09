<script>
  import TabSet from '../TabSet.svelte'
  import { unwrap } from '../../_utils/mapper'

  export let bubble
  export let filter

  $: id = unwrap(bubble.id)
  $: inReaderMode = location.pathname.endsWith('/reader_mode')
  $: tabs = [
    {
      name: inReaderMode ? 'reader_mode' : '',
      label: 'Posts',
      href: `/bubbles/${id}${inReaderMode ? '/reader_mode' : ''}`
    },
    {
      name: inReaderMode ? 'with_comments/reader_mode' : 'with_comments',
      label: 'Posts and comments',
      href: `/bubbles/${id}/with_comments${inReaderMode ? '/reader_mode' : ''}`
    }
    // {
    //   name: 'media',
    //   label: 'Media',
    //   href: `/bubbles/${id}/media`
    // }
  ]
</script>

<TabSet label={intl.filters} currentTabName={filter} {tabs} className="bubble-profile-filters" />

<style>
  :global(.bubble-profile-filters) {
    background: var(--bubble-profile-bg);
  }
</style>
