<script>
  import AccountProfileHeader from './AccountProfileHeader.svelte'
  import AccountProfileFollow from './AccountProfileFollow.svelte'
  import AccountProfileNote from './AccountProfileNote.svelte'
  import AccountProfileMeta from './AccountProfileMeta.svelte'
  import AccountProfileDetails from './AccountProfileDetails.svelte'
  import AccountProfileMovedBanner from './AccountProfileMovedBanner.svelte'
  import AccountProfileFilters from './AccountProfileFilters.svelte'
  import { autoplayGifs, underlineLinks, currentAccountProfile } from '../../_store/local'
  import { classname } from '../../_utils/classname'
  import { scheduleIdleTask } from '../../_utils/scheduleIdleTask'
  import { addEmojiTooltips } from '../../_utils/addEmojiTooltips'
  import { formatIntl } from '../../_utils/formatIntl'
  import { onMount } from "svelte";

  export let account;
  export let relationship;
  export let verifyCredentials;
  export let filter;

  $: headerImageIsMissing = account.header.endsWith('missing.png');
  $: headerImage = $autoplayGifs ? account.header : account.header_static;
  $: accountName = (account && (account.display_name || account.username)) || '';
  $: moved = account.moved;
  $: className = classname(
          'account-profile',
          moved && 'moved',
          headerImageIsMissing && 'header-image-is-missing',
          $underlineLinks && 'underline-links'
  );
  $: profileForAccount = formatIntl('intl.profileForAccount', { account: accountName });

  let accountProfile;

  onMount(() => {
    scheduleIdleTask(() => addEmojiTooltips(accountProfile));
  })
</script>

<h1 class="sr-only">{profileForAccount}</h1>
{#if moved}
  <AccountProfileMovedBanner {account} />
{/if}
<div class={className}
     style="background-image: url({headerImage});"
     bind:this={accountProfile}>
  <div class="account-profile-grid-wrapper">
    <div class="account-profile-grid">
      <AccountProfileHeader {account} {relationship} />
      <AccountProfileFollow {account} {relationship} {verifyCredentials} />
      <AccountProfileNote {account} />
      <AccountProfileMeta {account} />
      <AccountProfileDetails {account} {relationship} {verifyCredentials} />
    </div>
  </div>
  <AccountProfileFilters {account} {filter} />
</div>
<style>
  .account-profile {
    position: relative;
    background-size: cover;
    background-position: center;
    padding-top: 175px;
  }

  .account-profile.moved {
    filter: grayscale(0.8);
  }

  .account-profile.header-image-is-missing {
    padding-top: 0;
    background-color: #ccc;
  }

  .account-profile-grid {
    display: grid;
    grid-template-areas: "avatar     name        label     followed-by   follow"
                         "avatar     username    username  username      follow"
                         "avatar     note        note      note          follow"
                         "meta       meta        meta      meta          meta"
                         "details    details     details   details       details";
    grid-template-columns: min-content auto 1fr 1fr min-content;
    grid-column-gap: 10px;
    grid-row-gap: 5px;
    padding: 20px;
    justify-content: center;
  }

  @supports (-webkit-backdrop-filter: blur(1px) saturate(1%)) or (backdrop-filter: blur(1px) saturate(1%)) {
    :global(.account-profile-grid-wrapper) {
      -webkit-backdrop-filter: blur(7px) saturate(110%);
      backdrop-filter: blur(7px) saturate(110%);
      background-color: var(--account-profile-bg-backdrop-filter);
    }
  }

  @supports not ((-webkit-backdrop-filter: blur(1px) saturate(1%)) or (backdrop-filter: blur(1px) saturate(1%))) {
    :global(.account-profile-grid-wrapper) {
      background-color: var(--account-profile-bg);
    }
  }

  @media (max-width: 767px) {
    .account-profile {
      padding-top: 100px;
    }

    .account-profile-grid {
      display: grid;
      grid-template-areas: "avatar     name          follow"
                           "avatar     label         follow"
                           "avatar     username      follow"
                           "avatar     followed-by   follow"
                           "note       note          note"
                           "meta       meta          meta"
                           "details    details       details";
      grid-template-columns: min-content minmax(auto, 1fr) min-content;
      grid-template-rows: min-content min-content 1fr min-content;
      padding: 10px;
    }
  }

  @media (max-width: 320px) {
    .account-profile {
      padding-top: 50px;
    }
  }

  @media (max-width: 240px) {
    .account-profile {
      padding-top: 0;
    }
    .account-profile-grid {
      grid-template-areas: "avatar      name"
                           "avatar      label"
                           "username    username"
                           "followed-by followed-by"
                           "follow      follow"
                           "note        note"
                           "meta        meta"
                           "details     details";
      grid-template-columns: min-content 1fr;
      grid-column-gap: 5px;
      grid-row-gap: 0;
    }
  }
</style>
