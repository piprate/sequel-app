<script>
  import TimelinePage from '../TimelinePage.svelte'
  import FreeTextLayout from '../FreeTextLayout.svelte'
  import { isUserLoggedIn, currentAccountProfile, currentAccountRelationship } from '../../_store/local.js'
  import { currentVerifyCredentials } from '../../_store/instance.js'
  import HiddenFromSSR from '../HiddenFromSSR.svelte'
  import DynamicPageBanner from '../DynamicPageBanner.svelte'
  import { updateProfileAndRelationship, clearProfileAndRelationship } from '../../_actions/accounts'
  import AccountProfile from './AccountProfile.svelte'
  import PinnedStatuses from '../timeline/PinnedStatuses.svelte'
  import { formatIntl } from '../../_utils/formatIntl'
  import { onMount } from "svelte";

  export let accountId;
  export let filter;

  $: profileName = ($currentAccountProfile && ('@' + $currentAccountProfile.acct)) || '';
  $: shortProfileName = ($currentAccountProfile && ('@' + $currentAccountProfile.username)) || '';
  $: accountName = ($currentAccountProfile && ($currentAccountProfile.display_name || $currentAccountProfile.username)) || '';
  $: timeline = `account/${accountId}` + (filter ? `/${filter}` : '');
  $: ariaTitle = formatIntl('intl.profilePageForAccount', { account: accountName });

  onMount(() => {
    clearProfileAndRelationship();
    updateProfileAndRelationship(accountId);
  })
</script>

{#if $isUserLoggedIn}
  <TimelinePage {timeline} >
    <DynamicPageBanner title="" {ariaTitle} />
    {#if $currentAccountProfile && $currentVerifyCredentials}
      <AccountProfile account={$currentAccountProfile}
                      relationship={$currentAccountRelationship}
                      verifyCredentials={$currentVerifyCredentials}
                      {filter}
      />
    {/if}
    {#if !filter}
      <PinnedStatuses {accountId} />
    {/if}
  </TimelinePage>
{:else}
  <HiddenFromSSR>
    <FreeTextLayout>
      <h1>{intl.profile}</h1>

      <p>{intl.profileNotLoggedIn}</p>
    </FreeTextLayout>
  </HiddenFromSSR>
{/if}