<script>
  import Title from '../../_components/Title.svelte'
  import LazyPage from '../../_components/LazyPage.svelte'
  import pageComponent from '../../_pages/worlds/new.svelte'

  $: titleName = 'intl.newWorld'
</script>

<Title name={titleName} />

<LazyPage {pageComponent} />
