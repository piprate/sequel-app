<script>
    import { page } from '$app/stores';
    import Title from '../../../../_components/Title.svelte'
    import LazyPage from '../../../../_components/LazyPage.svelte'
    import pageComponent from '../../../../_pages/studio/digital-art/[id]/edit.svelte'

    const params = $page.params
</script>
  
<Title name="{intl.newDigitalArt}" />
  
<LazyPage {pageComponent} params={params} />
  