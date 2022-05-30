<script>
  import VirtualListContainer from './VirtualListContainer.svelte'
  import VirtualListLazyItem from './VirtualListLazyItem.svelte'
  import VirtualListFooter from './VirtualListFooter.svelte'
  import VirtualListHeader from './VirtualListHeader.svelte'
  import {
    allVisibleItemsHaveHeight,
    height,
    offsetHeight,
    scrollHeight,
    scrollTop,
    visibleItems,
    virtualListStore
  } from './virtualListStore'
  import throttle from 'lodash-es/throttle'
  import { mark, stop } from '../../_utils/marks'
  import isEqual from 'lodash-es/isEqual'
  import { createEventDispatcher, onMount } from "svelte";

  const dispatch = createEventDispatcher();

  const DISTANCE_FROM_BOTTOM_TO_FIRE = 800
  const SCROLL_EVENT_THROTTLE = 1000

  export let component = null;
  export let items;
  export let realm;
  export let makeProps;
  export let showFooter;
  export let footerComponent;
  export let showHeader;
  export let headerComponent;
  export let headerProps;

  // stop warnings
  export let scrollToItem;
  scrollToItem = undefined;

  $: distanceFromBottom = $scrollHeight - $scrollTop - $offsetHeight;
  $: visibleItemKeys = ($visibleItems || []).map(_ => _.key);

  let node;

  function calculateListOffset () {
    // TODO: better way to get the offset top?
    if (!node) {
      return
    }
    mark('calculateListOffset')
    const { offsetParent } = node
    // TODO: offsetParent is null sometimes in testcafe tests
    const listOffset = offsetParent ? offsetParent.offsetTop : 0
    virtualListStore.setForRealm({ listOffset })
    stop('calculateListOffset')
  }

  const fireScrollToBottom = throttle(() => {
    dispatch('scrollToBottom')
  }, SCROLL_EVENT_THROTTLE)

  const fireScrollToTop = throttle(() => {
    dispatch('scrollToTop')
  }, SCROLL_EVENT_THROTTLE)

  // FIXME the following reactives were enable onMount in Pinafore. Review later.

  $: {
    mark('set showFooter')
    virtualListStore.setForRealm({ showFooter: showFooter })
    mark('set showFooter')
  }
  $: {
    mark('set showHeader')
    virtualListStore.setForRealm({ showHeader: showHeader })
    stop('set showHeader')
  }

  let oldItems;
  function observeItems(items) {
    if (!items || isEqual(items, oldItems)) {
      return
    }
    mark('set items');
    oldItems = items;
    virtualListStore.setForRealm({ items: items });
    stop('set items');
  }
  $: observeItems(items);

  $: (allVisibleItemsHaveHeight => {
      calculateListOffset()
      if (allVisibleItemsHaveHeight) {
        dispatch('initializedVisibleItems')
      }
    })($allVisibleItemsHaveHeight);

  $: (distanceFromBottom => {
    if (distanceFromBottom >= 0 &&
            distanceFromBottom <= DISTANCE_FROM_BOTTOM_TO_FIRE) {
      fireScrollToBottom();
    }
  })(distanceFromBottom);

  $: (scrollTop => {
    dispatch('scrollTopChanged', scrollTop)
    if (scrollTop === 0) {
      fireScrollToTop();
    }
    calculateListOffset();
  })($scrollTop);

  onMount(() => {

    // this.observe('showFooter', showFooter => {
    //   mark('set showFooter')
    //   virtualListStore.setForRealm({ showFooter: showFooter })
    //   mark('set showFooter')
    // })
    // this.observe('showHeader', showHeader => {
    //   mark('set showHeader')
    //   virtualListStore.setForRealm({ showHeader: showHeader })
    //   stop('set showHeader')
    // })
    // this.observe('items', (newItems, oldItems) => {
    //   if (!newItems || isEqual(newItems, oldItems)) {
    //     return
    //   }
    //   mark('set items')
    //   virtualListStore.setForRealm({ items: newItems })
    //   stop('set items')
    // })
    // We observe on the component rather than the store to avoid a leak in store listeners
    // (Svelte automatically removes component listeners, but not store listeners)
    // this.observe('$allVisibleItemsHaveHeight', _allVisibleItemsHaveHeight => {
    //   this.calculateListOffset()
    //   if ($allVisibleItemsHaveHeight) {
    //     dispatch('initializedVisibleItems')
    //   }
    // })

    // this.observe('distanceFromBottom', (distanceFromBottom) => {
    //   if (distanceFromBottom >= 0 &&
    //           distanceFromBottom <= DISTANCE_FROM_BOTTOM_TO_FIRE) {
    //     this.fireScrollToBottom()
    //   }
    // }, { init: false })

    // this.observe('$scrollTop', (scrollTop) => {
    //   dispatch('scrollTopChanged', scrollTop)
    //   if (scrollTop === 0) {
    //     this.fireScrollToTop()
    //   }
    //   calculateListOffset();
    // })
  });
</script>

<VirtualListContainer {realm} on:initialized on:noNeedToScroll >
  <div class="virtual-list"
       style="height: {$height}px;"
       bind:this={node} >
    <VirtualListHeader component={headerComponent} virtualProps={headerProps} shown={showHeader}/>
    {#if $visibleItems}
      {#each $visibleItems as visibleItem (visibleItem.key)}
        <VirtualListLazyItem {component}
                             offset={visibleItem.offset}
                             {makeProps}
                             key={visibleItem.key}
                             index={visibleItem.index}
        />
      {/each}
      {#if !$visibleItems.length}
        <div class="nothing-to-show">
          {intl.nothingToShow}
        </div>
      {/if}
    {/if}
    {#if showFooter}
      <VirtualListFooter component={footerComponent} />
    {/if}
  </div>
</VirtualListContainer>
<style>
  .virtual-list {
    position: relative;
    width: 100%;
  }
  .nothing-to-show {
    font-size: 1.1em;
    width: 100%;
    padding: 20px 0;
    text-align: center;
  }
</style>