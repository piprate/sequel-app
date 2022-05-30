<script>
  import TabSet from '../TabSet.svelte'

  export let account;
  export let filter;

  $: tabs = [
    {
      name: '',
      label: 'Toots',
      href: `/accounts/${account.id}`
    },
    {
      name: 'with_replies',
      label: 'Toots and replies',
      href: `/accounts/${account.id}/with_replies`
    },
    {
      name: 'media',
      label: 'Media',
      href: `/accounts/${account.id}/media`
    }
  ];
</script>

<TabSet
        label="{intl.filters}"
        currentTabName={filter}
        {tabs}
        className="account-profile-filters"
/>
<style>
    :global(.account-profile-filters) {
        background: var(--account-profile-bg);
    }
</style>