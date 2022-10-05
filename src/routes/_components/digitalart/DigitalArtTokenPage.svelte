<script>
  import FreeTextLayout from '../FreeTextLayout.svelte'
  import LoadingPage from '../LoadingPage.svelte'
  import { currentInstance } from '../../_store/local.js'
  import { currentSpark, currentSparkId } from '../../_store/instance.js'
  import ErrorMessage from '../ErrorMessage.svelte'
  import DigitalArtToken from './DigitalArtToken.svelte'
  import { onMount } from 'svelte'
  import { getDigitalArtToken } from '../../_api/nft'
  import { accessToken } from '../../_store/instance'

  export let id

  let token

  $: name = (token && token.name) || ''
  $: ariaTitle = name

  let notFound = false
  let loadError

  let instanceName = $currentInstance || 'sequel.space'
  let production = process.env.NODE_ENV === 'production'
  if (!production) {
    instanceName = 'localhost'
  }

  onMount(async () => {
    try {
        token = await getDigitalArtToken(instanceName, $accessToken, id, $currentSparkId)
    } catch (e) {
      if (e.status === 404) {
        notFound = true
      } else {
        loadError = e
      }
      console.error(e)
    }
    console.log("LOADED TOKEN", token)
  })
</script>

{#if token}
    <!--        <DynamicPageBanner title="" {ariaTitle} />-->
    <DigitalArtToken {token} ourSpark={$currentSpark} />
{:else if notFound}
    <FreeTextLayout>
        <h2>{intl.tokenNotFound}</h2>
    </FreeTextLayout>
{:else if loadError}
    <ErrorMessage error={loadError} />
{:else}
    <LoadingPage />
{/if}
