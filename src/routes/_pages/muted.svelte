<script>
  import SparksListPage from '../_components/SparksListPage.svelte'
  import { currentInstance, isUserLoggedIn } from '../_store/local.js'
  import { accessToken } from '../_store/instance'
  import { getMutedSparks } from '../_api/blockedAndMuted'
  import DynamicPageBanner from '../_components/DynamicPageBanner.svelte'
  import { setSparkMuted } from '../_actions/mute'

  // suppress warnings
  export let params
  params = undefined

  let sparkActions = [
    {
      icon: '#fa-volume-up',
      label: 'intl.unmute',
      onclick: (sparkId) =>
        setSparkMuted(sparkId, /* mute */ false, /* notifications */ false, /* toastOnSuccess */ true)
    }
  ]

  $: sparksFetcher = () => ($isUserLoggedIn ? getMutedSparks($currentInstance, $accessToken) : [])
</script>

<DynamicPageBanner title={intl.mutedSparks} icon="#fa-volume-off" />
{#if $isUserLoggedIn}
  <SparksListPage {sparksFetcher} {sparkActions} />
{/if}
