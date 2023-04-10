<script>
  import Title from '../../../../_components/Title.svelte'
  import LazyPage from '../../../../_components/LazyPage.svelte'
  import pageComponent from '../../../../_pages/worlds/[worldId]/reader_mode.svelte'
  import { page } from '$app/stores';

  $: params = {
    ...$page.params,
    withComments: true
  }
</script>

<Title name="{intl.postsInReaderMode}" />

<LazyPage {pageComponent} {params} />