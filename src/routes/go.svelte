<script>
  import RestrictedPageWarning from './_components/RestrictedPageWarning.svelte'
  import LoadingPage from "./_components/LoadingPage.svelte";
  import { goto, stores } from '@sapper/app'
  import { onMount } from 'svelte'
  import { isUserLoggedIn, redirectToPage } from './_store/local'

  const { page } = stores()

  $: url = $page.query.p
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