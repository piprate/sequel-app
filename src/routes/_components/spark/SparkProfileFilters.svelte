<script>
  import TabSet from '../TabSet.svelte'
  import { unwrap } from '../../_utils/mapper'

  export let spark
  export let filter

  $: id = unwrap(spark.id)
  $: tabs = [
    {
      name: '',
      label: 'Posts',
      href: `/sparks/${id}`
    },
    {
      name: 'with_comments',
      label: 'Posts and comments',
      href: `/sparks/${id}/with_comments`
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