<script>
  import {
    currentInstance,
    currentTimeline,
    disableInfiniteScroll,
    timelineInitialized,
    timelinePreinitialized
  } from '../../_store/local'
  import LoadingFooter from './LoadingFooter.svelte'
  import MoreHeaderVirtualWrapper from './MoreHeaderVirtualWrapper.svelte'
  import ScrollListShortcuts from '../shortcut/ScrollListShortcuts.svelte'
  import Shortcut from '../shortcut/Shortcut.svelte'
  import { importVirtualList } from '../../_utils/asyncModules/importVirtualList'
  import { importList } from '../../_utils/asyncModules/importList'
  import { importPostVirtualListItem } from '../../_utils/asyncModules/importPostVirtualListItem'
  import { importNotificationVirtualListItem } from '../../_utils/asyncModules/importNotificationVirtualListItem'
  import { timelines } from '../../_static/timelines'
  import {
    fetchMoreItemsAtBottomOfTimeline,
    setupTimeline,
    showMoreItemsForCurrentTimeline,
    showMoreItemsForThread,
    showMoreItemsForTimeline
  } from '../../_actions/timeline'
  import { scheduleIdleTask } from '../../_utils/scheduleIdleTask'
  import { mark, stop } from '../../_utils/marks'
  import isEqual from 'lodash-es/isEqual'
  import { doubleRAF } from '../../_utils/doubleRAF'
  import { createMakeProps } from '../../_actions/createMakeProps'
  import { showMoreAndScrollToTop } from '../../_actions/showMoreAndScrollToTop'
  import FocusRestoration from '../FocusRestoration.svelte'
  import { onMount } from 'svelte'
  import {
    currentTimelineType,
    currentTimelineValue,
    firstTimelineItemId,
    rootShouldShowHeader,
    rootShowHeader,
    runningUpdate,
    setForTimeline,
    shouldShowHeader,
    showHeader
  } from '../../_store/timeline'
  import { filteredTimelineItemSummaries, filteredTimelineItemSummariesToAdd } from '../../_store/timelineFilter'
  import { currentSparkId } from '../../_store/instance'

  export let timeline

  let scrollTop = 0
  let components = undefined

  $: makeProps = createMakeProps($currentInstance, timelineType, timelineValue, $currentSparkId)
  $: label = (() => {
    if (timelines[timeline]) {
      return `Posts: ${timelines[timeline].label} timeline on ${$currentInstance}`
    }

    switch (timelineType) {
      case 'tag':
        return `Posts: #${timelineValue} hashtag`
      case 'post':
        return 'Posts: thread'
      case 'bubble':
        return 'Posts: bubble timeline'
      case 'spark':
        return 'Posts: spark timeline'
      case 'world':
        return 'Posts: world timeline'
      case 'list':
        return 'Posts: list'
      case 'notifications':
        return `Notifications on ${$currentInstance}`
      default:
        return 'unknown timeline type'
    }
  })()
  $: timelineType = $currentTimelineType
  $: timelineValue = $currentTimelineValue
  // Scroll to the first item if this is a "post in own thread" timeline.
  // Don't scroll to the first item because it obscures the "back" button.
  $: scrollToItem =
    timelineType === 'post' && $firstTimelineItemId && timelineValue !== $firstTimelineItemId && timelineValue
  $: itemIds = $filteredTimelineItemSummaries && $filteredTimelineItemSummaries.map((_) => _.id)
  $: itemIdsToAdd = $filteredTimelineItemSummariesToAdd && $filteredTimelineItemSummariesToAdd.map((_) => _.id)
  $: headerProps = {
    count: itemIdsToAdd ? itemIdsToAdd.length : 0,
    onClick: showMoreItemsForCurrentTimeline
  }
  $: focusRealm = `${$currentInstance}-${timeline}`
  $: asSpark = $currentSparkId

  // For threads, it's simpler to just render all items as a pseudo-virtual list
  // due to need to scroll to the right item and thus calculate all item heights up-front.
  // Here we lazy-load both the virtual list component itself as well as the component
  // it renders.
  $: componentsPromise = Promise.all([
    timelineType === 'post' ? importList() : importVirtualList(),
    timelineType === 'notifications' ? importNotificationVirtualListItem() : importPostVirtualListItem()
  ]).then((results) => ({
    listComponent: results[0],
    listItemComponent: results[1]
  }))

  async function loadTimelineComponents(componentsPromise) {
    console.log('loading timeline components')
    const _components = await componentsPromise
    console.log('loaded timeline components')
    components = _components
  }

  let observeComponentsPromiseEnabled = false
  $: if (observeComponentsPromiseEnabled) {
    loadTimelineComponents(componentsPromise)
  }

  const handleItemIdsToAdd = () => {
    if (!itemIdsToAdd || !itemIdsToAdd.length) {
      return
    }
    mark('handleItemIdsToAdd')
    if (timelineType === 'post') {
      // this is a thread, just insert the posts already
      showMoreItemsForThread($currentInstance, timeline)
    } else if (!$disableInfiniteScroll && scrollTop === 0 && !$shouldShowHeader && !$showHeader) {
      // if the user is scrolled to the top and we're not showing the header, then
      // just insert the posts. this is "chat room mode"
      showMoreItemsForTimeline($currentInstance, timeline)
    } else {
      // user hasn't scrolled to the top, show a header instead
      setForTimeline(rootShouldShowHeader, $currentInstance, timeline, true, asSpark)
      // unless the user has disabled infinite scroll entirely
      if ($disableInfiniteScroll) {
        setForTimeline(rootShowHeader, $currentInstance, timeline, true, asSpark)
      }
    }
    stop('handleItemIdsToAdd')
  }

  let observeItemIdsToAddEnabled = false
  let oldItemIdsToAdd

  function observeItemIdsToAdd(itemIdsToAdd) {
    if (!itemIdsToAdd || !itemIdsToAdd.length || isEqual(itemIdsToAdd, oldItemIdsToAdd)) {
      return
    }
    oldItemIdsToAdd = itemIdsToAdd

    scheduleIdleTask(handleItemIdsToAdd)
  }

  $: if (observeItemIdsToAddEnabled) {
    observeItemIdsToAdd(itemIdsToAdd)
  }

  function setupStreaming() {
    observeItemIdsToAddEnabled = true
  }

  let initializeStarted = false

  function initialize() {
    if (initializeStarted) {
      return
    }
    initializeStarted = true
    mark('initializeTimeline')
    doubleRAF(() => {
      console.log('timeline initialized')
      $timelineInitialized = true
      stop('initializeTimeline')
    })
  }

  function onNoNeedToScroll() {
    // If the timeline doesn't need to scroll, then we can safely "preinitialize,"
    // i.e. render anything above the fold of the timeline. This avoids the affect
    // where the scrollable content appears to jump around if we need to scroll it.
    console.log('timeline preinitialized')
    $timelinePreinitialized = true
  }

  function onScrollToBottom() {
    if (!$timelineInitialized || $runningUpdate || $disableInfiniteScroll || timelineType === 'post') {
      // for post contexts, we've already fetched the whole thread
      return
    }
    /* no await */
    fetchMoreItemsAtBottomOfTimeline($currentInstance, timeline)
  }

  function onScrollToTop() {
    if ($shouldShowHeader) {
      setForTimeline(rootShowHeader, $currentInstance, $currentTimeline, true, asSpark)
      setForTimeline(rootShouldShowHeader, $currentInstance, $currentTimeline, false, asSpark)
    }
  }

  function onScrollTopChanged(e) {
    scrollTop = e.detail
  }

  let render = false

  onMount(() => {
    console.log('timeline oncreate()')
    setupTimeline()
    setupStreaming()
    observeComponentsPromiseEnabled = true
    console.log('timeline oncreate() finished')
  })
</script>

<h1 class="sr-only">{label}</h1>
<FocusRestoration realm={focusRealm}>
  <div class="timeline" role="feed">
    {#if components}
      <svelte:component
        this={components.listComponent}
        component={components.listItemComponent}
        realm={$currentInstance + '/' + asSpark + '/' + timeline}
        {makeProps}
        items={itemIds}
        showFooter={true}
        footerComponent={LoadingFooter}
        showHeader={$showHeader}
        headerComponent={MoreHeaderVirtualWrapper}
        {headerProps}
        {scrollToItem}
        on:scrollToBottom={onScrollToBottom}
        on:scrollToTop={onScrollToTop}
        on:scrollTopChanged={onScrollTopChanged}
        on:initialized={initialize}
        on:noNeedToScroll={onNoNeedToScroll}
      />
    {/if}
  </div>
</FocusRestoration>
<Shortcut scope="global" key="." on:pressed={showMoreAndScrollToTop} />
<ScrollListShortcuts />
