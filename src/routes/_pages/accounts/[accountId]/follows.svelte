<script>
  import { getFollows } from '../../../_api/followsAndFollowers'
  import AccountsListPage from '../../../_components/AccountsListPage.svelte'
  import { currentInstance } from '../../../_store/local'
  import { accessToken } from '../../../_store/instance'
  import DynamicPageBanner from '../../../_components/DynamicPageBanner.svelte'

  export let params;

  $: accountId = params.accountId;
  $: accountsFetcher = () => getFollows($currentInstance, $accessToken, accountId);
</script>

<DynamicPageBanner title="{intl.follows}" />
<AccountsListPage {accountsFetcher} />