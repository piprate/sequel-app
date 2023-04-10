<script>
  import Title from '../../../../_components/Title.svelte'
  import LazyPage from '../../../../_components/LazyPage.svelte'
  import pageComponent from '../../../../_pages/bubbles/[bubbleId]/reader_mode.svelte'
  import { page } from '$app/stores';

  $: params = {
    ...$page.params,
    withComments: true
  }

</script>

<Title name="{intl.postsInWithCommentsReaderMode}" />

<LazyPage {pageComponent} {params} />