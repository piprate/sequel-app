<script context="module">
  import Title from '../_components/Title.svelte'
  import LazyPage from '../_components/LazyPage.svelte'
  import pageComponent from '../_pages/lists/[listId].svelte'

  export async function preload({ params }) {
    return { params };
  }
</script>

<script>
  export let params;
</script>

<Title name="{intl.list}" />

<LazyPage {pageComponent} {params} />