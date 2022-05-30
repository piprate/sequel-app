<script context="module">
  import Title from '../../_components/Title.svelte'
  import LazyPage from '../../_components/LazyPage.svelte'
  import pageComponent from '../../_pages/settings/instances/[instanceName].svelte'

  export async function preload(page, session) {
    return { params: page.params };
  }
</script>

<script>
  export let params;
</script>

<Title name="{params.instanceName}" settingsPage={true} />

<LazyPage {pageComponent} {params} />
