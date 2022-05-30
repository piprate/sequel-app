<script>
  import { scrollTop, allVisibleItemsHaveHeight, virtualListStore } from './virtualListStore'
  import throttle from 'lodash-es/throttle'
  import { isFullscreen, attachFullscreenListener, detachFullscreenListener } from '../../_utils/fullscreen'
  import { mark, stop } from '../../_utils/marks'
  import { doubleRAF } from '../../_utils/doubleRAF'
  import {
    addScrollListener,
    removeScrollListener,
    getScrollContainer,
    getOffsetHeight
  } from '../../_utils/scrollContainer'
  import { registerResizeListener, unregisterResizeListener } from '../../_utils/resize'
  import { createEventDispatcher, onMount } from "svelte";

  const SCROLL_EVENT_DELAY = 300

  const dispatch = createEventDispatcher();

  export let realm;

  let fullscreen = false;
  const scrollListener = throttle(event => {
    if (fullscreen) {
      return
    }
    onScroll();
  }, SCROLL_EVENT_DELAY, {
    leading: true,
    trailing: true
  });

  function setupScroll () {
    addScrollListener(scrollListener);
  }

  function teardownScroll () {
    removeScrollListener(scrollListener);
  }

  function setupFullscreen () {
    attachFullscreenListener(onFullscreenChange);
  }

  function teardownFullscreen () {
    detachFullscreenListener(onFullscreenChange);
  }

  function onScroll () {
    const { scrollTop, scrollHeight } = getScrollContainer()

    doubleRAF(() => {
      mark('onScroll -> setForRealm()')
      virtualListStore.setForRealm({ scrollTop, scrollHeight })
      stop('onScroll -> setForRealm()')
    })
  }

  function onFullscreenChange() {
    mark('onFullscreenChange');
    fullscreen = isFullscreen();
    stop('onFullscreenChange');
  }

  function onResize() {
    virtualListStore.setForRealm({
      scrollHeight: getScrollContainer().scrollHeight,
      offsetHeight: getOffsetHeight()
    })
  }

  let allVisibleItemsHaveHeightObserver;
  let observerEnabled = false;
  $: if (observerEnabled) {
    allVisibleItemsHaveHeightObserver($allVisibleItemsHaveHeight);
  }

  let initializedScrollTop = false;

  onMount(() => {
    mark('onCreate VirtualListContainer')
    virtualListStore.setCurrentRealm(realm);
    setupScroll();
    setupFullscreen();
    const scrollContainer = getScrollContainer()
    if ($scrollTop > 0) {
      allVisibleItemsHaveHeightObserver = allVisibleItemsHaveHeight => {
        if (!initializedScrollTop && allVisibleItemsHaveHeight) {
          initializedScrollTop = true;
          requestAnimationFrame(() => {
            mark('set scrollTop')
            console.log('forcing scroll top to ', $scrollTop)
            scrollContainer.scrollTop = $scrollTop
            stop('set scrollTop')
            doubleRAF(() => {
              dispatch('initialized')
            })
          })
        }
      }
      observerEnabled = true;
    } else {
      dispatch('noNeedToScroll')
      allVisibleItemsHaveHeightObserver = allVisibleItemsHaveHeight => {
        if (allVisibleItemsHaveHeight) {
          dispatch('initialized')
        }
      }
      observerEnabled = true;
      onResize();
    }
    registerResizeListener(onResize);
    stop('onCreate VirtualListContainer');

    return () => {
      teardownScroll();
      teardownFullscreen();
      virtualListStore.setCurrentRealm(null);
      unregisterResizeListener(onResize);
    }
  });
</script>

<slot></slot>