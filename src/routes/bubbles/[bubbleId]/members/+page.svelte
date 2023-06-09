<script>
  import Title from '../../../_components/Title.svelte'
  import LazyPage from '../../../_components/LazyPage.svelte'
  import pageComponent from '../../../_pages/bubbles/[bubbleId]/members.svelte'
  import { page } from '$app/stores'
</script>

<Title name={intl.bubbleMembers} />

<LazyPage {pageComponent} params={$page.params} />
