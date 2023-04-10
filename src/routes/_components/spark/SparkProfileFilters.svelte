<script>
  import TabSet from '../TabSet.svelte'
  import { unwrap } from '../../_utils/mapper'

  export let spark
  export let filter

  $: id = unwrap(spark.id)
  $: inReaderMode = location.pathname.endsWith('/reader_mode')
  $: tabs = [
    {
      name: inReaderMode ? 'reader_mode' : '',
      label: 'Posts',
      href: `/sparks/${id}${inReaderMode ? '/reader_mode' : ''}`
    },
    {
      name: inReaderMode ? 'with_comments/reader_mode' : 'with_comments',
      label: 'Posts and comments',
      href: `/sparks/${id}/with_comments${inReaderMode ? '/reader_mode' : ''}`
    }
    // {
    //   name: 'media',
    //   label: 'Media',
    //   href: `/sparks/${id}/media`
    // }
  ]
</script>

<TabSet
        label="{intl.filters}"
        currentTabName={filter}
        {tabs}
        className="spark-profile-filters"
/>
<style>
    :global(.spark-profile-filters) {
        background: var(--spark-profile-bg);
    }
</style>