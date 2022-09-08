<script>
  import RestrictedPageWarning from '../../_components/RestrictedPageWarning.svelte'
  import { currentUser, lists } from '../../_store/instance.js';
  import { currentInstance, isAuthenticated, isUserLoggedIn } from '../../_store/local.js';
  import { hasSubscriptionRequests, numberOfSubscriptionRequests } from '../../_store/badge.js'
  import PageList from '../../_components/community/PageList.svelte'
  import PageListItem from '../../_components/community/PageListItem.svelte'
  import RadioGroup from '../../_components/radio/RadioGroup.svelte'
  import { updateListsForInstance } from '../../_actions/lists'
  import { updateSubRequestCountIfLockedUser } from '../../_actions/subscriptionRequests';
  import FocusRestoration from '../../_components/FocusRestoration.svelte'
  import { formatIntl } from '../../_utils/formatIntl'
  import { onMount } from "svelte";

  // suppress warnings
  export let params;
  params = undefined;

  $: staticPinnables = [
    {
      href: '/worlds',
      label: 'intl.worlds',
      icon: '#fa-globe'
    },
    {
      href: '/bubbles',
      label: 'intl.bubbles',
      icon: '#fa-comments'
    },
    $isAuthenticated && {
      href: '/sparks',
      label: 'intl.sparks',
      icon: '#fa-star'
    },
    {
      href: '/marketplace',
      label: 'intl.marketplace',
      icon: '#nft-diamond'
    },
  ].filter(Boolean);

  $: mySequelPinnables = [
    $isAuthenticated && {
      href: '/assets',
      label: 'intl.assets',
      icon: '#fa-bicycle'
    },
    $isAuthenticated && {
      href: '/subscriptions',
      label: 'intl.subscriptions',
      icon: '#fa-newspaper-o'
    },
    $isAuthenticated && {
      href: '/studio',
      label: 'intl.studio',
      icon: '#fa-paint-brush'
    },
    $isAuthenticated && {
      href: '/bookmarks',
      label: 'intl.bookmarkedPosts',
      icon: '#fa-bookmark'
    }
  ].filter(Boolean);

  $: showMySequel = mySequelPinnables.length > 0;
  $: isLockedUser = $currentUser && $currentUser.locked;
  $: subRequestsLabel = (
          formatIntl('intl.subRequestsLabel', {
            hasSubRequests: $hasSubscriptionRequests,
            count: $numberOfSubscriptionRequests
          })
  );
  $: listsLength = $lists ? $lists.length : 0;
  $: staticPinnablesLength = staticPinnables.length;
  $: mySequelPinnablesLength = mySequelPinnables.length;
  $: numPinnable = listsLength + staticPinnablesLength + mySequelPinnablesLength;

  onMount(async () => {
    console.log("staticPinnables", staticPinnables);
    if ($isAuthenticated) {
      await Promise.all([
        updateListsForInstance($currentInstance),
        updateSubRequestCountIfLockedUser($currentInstance)
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
        {intl.explore}
      </h2>

      <PageList label="{intl.explore}">
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

      {#if showMySequel}
        <h2 class="community-header">
          {intl.mySequel}
        </h2>

        <PageList label="{intl.mySequel}">
          {#each mySequelPinnables as pinnable, i}
            <PageListItem href={pinnable.href}
                          label={pinnable.label}
                          icon={pinnable.icon}
                          pinnable="true"
                          pinIndex={i}
            />
          {/each}
        </PageList>
      {/if}
    </RadioGroup>

<!--    <h2 class="community-header">-->
<!--      Instance settings-->
<!--    </h2>-->

<!--    <PageList label="{intl.instanceSettings}">-->
<!--      {#if isLockedUser}-->
<!--      <PageListItem href="/requests"-->
<!--                    label={subRequestsLabel}-->
<!--                    icon="#fa-user-plus"-->
<!--       />-->
<!--      {/if}-->
<!--      <PageListItem href="/muted"-->
<!--                    label="{intl.mutedSparks}"-->
<!--                    icon="#fa-volume-off"-->
<!--      />-->
<!--      <PageListItem href="/blocked"-->
<!--                    label="{intl.blockedSparks}"-->
<!--                    icon="#fa-ban"-->
<!--      />-->
<!--      <PageListItem href="/pinned"-->
<!--                    label="{intl.pinnedPosts}"-->
<!--                    icon="#fa-thumb-tack"-->
<!--      />-->
<!--    </PageList>-->

  </FocusRestoration>
</div>
{:else}
  <RestrictedPageWarning message="{intl.loginToAccess}" offerVisitorMode={true} />
<div style="display: none">
  <!-- TODO: this is just a hack so that `sapper export` knows to crawl these files -->
  <!-- Note that these links have to be spread out or else they result in ECONNRESET errors during crawling -->
  <!-- See also search.html -->
  <a href="/requests">{intl.subRequests}</a>
  <a href="/muted">{intl.mutedSparks}</a>
  <a href="/blocked">{intl.blockedSparks}</a>
  <a href="/pinned">{intl.pinnedPosts}</a>
  <a href="/go">forward</a>
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
