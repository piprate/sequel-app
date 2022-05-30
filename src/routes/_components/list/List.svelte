<script>
  import ListLazyItem from './ListLazyItem.svelte'
  import { listStore } from './listStore'
  import { getScrollContainer } from '../../_utils/scrollContainer'
  import { mark, stop } from '../../_utils/marks'
  import { onMount, createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  function getScrollTopOffset() {
    return document.getElementById('main-nav').getBoundingClientRect().height
  }

  export let component;
  export let realm;
  export let makeProps;
  export let items;
  export let scrollToItem;

  // stop warnings
  export let showFooter;
  export let footerComponent;
  export let showHeader;
  export let headerComponent;
  export let headerProps;
  showFooter = footerComponent = showHeader = headerComponent = headerProps = undefined;

  $: safeItems = items || [];
  $: length = safeItems.length;

  let initializedCount = 0;

  function itemInitialized() {
    initializedCount++;
    if (initializedCount === length) {
      initialize()
    }
  }

  function initialize() {
    if (scrollToItem) {
      const element = document.getElementById(`list-item-${scrollToItem}`)
      requestAnimationFrame(() => {
        console.log('scrolling element into view')
        mark('scrollToElement')
        const scrollTopOffset = getScrollTopOffset()
        element.scrollIntoView(true)
        console.log('scrollTopOffset', scrollTopOffset)
        getScrollContainer().scrollTop -= scrollTopOffset
        stop('scrollToElement')
        dispatch('initialized')
      })
    } else {
      dispatch('initialized')
    }
  }

  onMount(() => {
    listStore.setCurrentRealm(realm);

    // if (process.env.NODE_ENV !== 'production') {
    //   this.observe('safeItems', safeItems => {
    //     if (new Set(safeItems).size !== safeItems.length) {
    //       console.error('list of items is not unique:', safeItems)
    //     }
    //   })
    // }

    return () => {
      listStore.setCurrentRealm(null);
    }
  });
</script>

<div class="the-list" on:initialized>
  {#each safeItems as item, i (item)}
    <ListLazyItem
            {component}
            index={i}
            {length}
            {makeProps}
            key={item}
            on:initialized="{itemInitialized}"
    />
  {/each}
</div>
<style>
  .the-list {
    position: relative;
  }
</style>