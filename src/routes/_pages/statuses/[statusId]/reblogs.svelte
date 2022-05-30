<script>
  import { getReblogs } from '../../../_api/reblogsAndFavs'
  import AccountsListPage from '../../../_components/AccountsListPage.svelte'
  import { currentInstance } from '../../../_store/local'
  import { accessToken } from '../../../_store/instance'
  import DynamicPageBanner from '../../../_components/DynamicPageBanner.svelte'

  export let params;

  $: statusId = params.statusId;
  $: accountsFetcher = () => getReblogs($currentInstance, $accessToken, statusId);
</script>

<DynamicPageBanner title="{intl.reblogs}" icon="#fa-retweet" />
<AccountsListPage {accountsFetcher} />