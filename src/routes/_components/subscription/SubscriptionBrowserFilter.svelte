<script>
  import TabSet from '../TabSet.svelte'

  export let filter;

  $: tabs = [
    {
      name: 'timeline',
      label: 'intl.subscriptionsTimeline',
      href: `/subscriptions`
    },
    {
      name: 'exclusive',
      label: 'intl.exclusiveTimeline',
      href: `/subscriptions/exclusive`
    },
    {
      name: 'manage',
      label: 'intl.manageSubscriptions',
      href: `/subscriptions/manage`
    }
  ];
</script>

<TabSet
        label="{intl.filters}"
        currentTabName={filter}
        {tabs}
        className="subscription-browser-filters"
/>
<style>
    :global(.subscription-browser-filters) {
        background: var(--spark-profile-bg);
    }
</style>