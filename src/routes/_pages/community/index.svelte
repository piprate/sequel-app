<script>
  import FreeTextLayout from '../../_components/FreeTextLayout.svelte'
  import { currentVerifyCredentials, lists } from '../../_store/instance.js'
  import { currentInstance, isUserLoggedIn } from '../../_store/local.js'
  import { hasFollowRequests, numberOfFollowRequests } from '../../_store/badge.js'
  import HiddenFromSSR from '../../_components/HiddenFromSSR.svelte'
  import PageList from '../../_components/community/PageList.svelte'
  import PageListItem from '../../_components/community/PageListItem.svelte'
  import RadioGroup from '../../_components/radio/RadioGroup.svelte'
  import { updateListsForInstance } from '../../_actions/lists'
  import { updateFollowRequestCountIfLockedAccount } from '../../_actions/followRequests'
  import FocusRestoration from '../../_components/FocusRestoration.svelte'
  import { formatIntl } from '../../_utils/formatIntl'
  import { onMount } from "svelte";

  // suppress warnings
  export let params;
  params = undefined;

  let staticPinnables = [
    {
      href: '/local',
      label: 'intl.localTimeline',
      icon: '#fa-users'
    },
    {
      href: '/federated',
      label: 'intl.federatedTimeline',
      icon: '#fa-globe'
    },
    {
      href: '/favorites',
      label: 'intl.favorites',
      icon: '#fa-star'
    },
    {
      href: '/direct',
      label: 'intl.directMessages',
      icon: '#fa-envelope'
    },
    {
      href: '/bookmarks',
      label: 'intl.bookmarks',
      icon: '#fa-bookmark'
    }
  ];

  $: isLockedAccount = $currentVerifyCredentials && $currentVerifyCredentials.locked;
  $: followRequestsLabel = (
          formatIntl('intl.followRequestsLabel', {
            hasFollowRequests: $hasFollowRequests,
            count: $numberOfFollowRequests
          })
  );
  $: listsLength = $lists ? $lists.length : 0;
  $: staticPinnablesLength = staticPinnables.length;
  $: numPinnable = listsLength + staticPinnablesLength;

  onMount(async () => {
    if ($currentInstance) {
      await Promise.all([
        updateListsForInstance($currentInstance),
        updateFollowRequestCountIfLockedAccount($currentInstance)
      ])
    }
  });
</script>

{#if $isUserLoggedIn}
<div class="community-page">

  <FocusRestoration realm="community">
    <RadioGroup
      id="pinnables"
      length={numPinnable}
      label="{intl.pinnableTimelines}">

      <h2 class="community-header">
        {intl.timelines}
      </h2>

      <PageList label="{intl.timelines}">
        {#each staticPinnables as staticPinnable, i}
          <PageListItem href={staticPinnable.href}
                        label={staticPinnable.label}
                        icon={staticPinnable.icon}
                        pinnable="true"
                        pinIndex={i}
          />
        {/each}
      </PageList>

      {#if listsLength}

        <h2 class="community-header">
          {intl.lists}
        </h2>

        <PageList label="{intl.lists}">
          {#each $lists as list, i}
            <PageListItem href="/lists/{list.id}"
                          label={list.title}
                          icon="#fa-bars"
                          pinnable="true"
                          pinIndex={staticPinnablesLength + i}
            />
          {/each}
        </PageList>

      {/if}

    </RadioGroup>

    <h2 class="community-header">
      Instance settings
    </h2>

    <PageList label="{intl.instanceSettings}">
      {#if isLockedAccount}
      <PageListItem href="/requests"
                    label={followRequestsLabel}
                    icon="#fa-user-plus"
       />
      {/if}
      <PageListItem href="/muted"
                    label="{intl.mutedUsers}"
                    icon="#fa-volume-off"
      />
      <PageListItem href="/blocked"
                    label="{intl.blockedUsers}"
                    icon="#fa-ban"
      />
      <PageListItem href="/pinned"
                    label="{intl.pinnedStatuses}"
                    icon="#fa-thumb-tack"
      />
    </PageList>

  </FocusRestoration>
</div>
{:else}
<HiddenFromSSR>
  <FreeTextLayout>
    <h1>{intl.community}</h1>

    <p>{intl.communityNotLoggedIn}</p>
  </FreeTextLayout>
</HiddenFromSSR>
<div style="display: none">
  <!-- TODO: this is just a hack so that `sapper export` knows to crawl these files -->
  <!-- Note that these links have to be spread out or else they result in ECONNRESET errors during crawling -->
  <!-- See also search.html -->
  <a href="/requests">{intl.followRequests}</a>
  <a href="/muted">{intl.mutedUsers}</a>
  <a href="/blocked">{intl.blockedUsers}</a>
  <a href="/pinned">{intl.pinnedStatuses}</a>
</div>
{/if}
<style>
  .community-page {
    margin: 20px;
  }
  @media (max-width: 767px) {
    .community-page {
      margin: 20px 10px;
    }
  }
</style>
