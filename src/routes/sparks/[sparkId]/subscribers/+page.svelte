<script>
  import Title from '../../../_components/Title.svelte'
  import LazyPage from '../../../_components/LazyPage.svelte'
  import pageComponent from '../../../_pages/sparks/[sparkId]/subscribers.svelte'
  import { page } from '$app/stores';

 
</script>

<Title name="{intl.subscribers}" />

<LazyPage {pageComponent} params={$page.params} />