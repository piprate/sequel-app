<script>
  import RestrictedPageWarning from '../_components/RestrictedPageWarning.svelte'
  import LoadingPage from "../_components/LoadingPage.svelte";
  import { goto } from '$app/navigation'
  import { page } from '$app/stores'
  import { onMount } from 'svelte'
  import { isUserLoggedIn, redirectToPage } from '../_store/local'

  $: url = $page.url.searchParams.get('p')
  $: badUrl = !(url && url.startsWith('/'))

  let loading = true

  onMount(() => {
    loading = false
    if (url) {
      if ($isUserLoggedIn) {
        goto(url)
      } else {
        $redirectToPage = url
      }
    }
  })
</script>
{#if badUrl}
    <RestrictedPageWarning showLogo="true" message="{intl.invalidExternalRequest}" />
{:else if loading }
    <LoadingPage/>
{:else if !$isUserLoggedIn}
    <RestrictedPageWarning showLogo="true" message="{intl.loginToFollowLink}" />
{/if}