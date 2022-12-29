<script>
  import Title from '../../../_components/Title.svelte';
  import LazyPage from '../../../_components/LazyPage.svelte';
  import pageComponent from '../../../_pages/sparks/[sparkId]/bubbles.svelte';
  import { page } from '$app/stores';

 
</script>

<Title name="{intl.sparkBubbles}" />

<LazyPage {pageComponent} params={$page.params} />