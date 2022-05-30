<script>
  import { getTMMs } from '../../../_api/tmmList'
  import SparksListPage from '../../../_components/SparksListPage.svelte'
  import { currentInstance } from '../../../_store/local'
  import { accessToken } from '../../../_store/instance'
  import DynamicPageBanner from '../../../_components/DynamicPageBanner.svelte'

  export let params;

  $: postId = params.postId;
  $: sparksFetcher = () => [] //getTMMs($currentInstance, $accessToken, postId);
</script>

<DynamicPageBanner title="{intl.tellMeMores}" icon="#fa-fire" />
<SparksListPage {sparksFetcher} />
