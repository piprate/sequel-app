<script>
  import LoadingSpinner from '../LoadingSpinner.svelte'
  import { currentInstance, currentTimeline, disableInfiniteScroll, timelineInitialized } from '../../_store/local'
  import { runningUpdate } from '../../_store/timeline'
  import { fetchMoreItemsAtBottomOfTimeline } from '../../_actions/timeline'

  $: shown = $timelineInitialized && ($disableInfiniteScroll || $runningUpdate)
  $: showLoading = $runningUpdate
  $: showLoadButton = !$runningUpdate && $disableInfiniteScroll

  function onClickLoadMore(e) {
    e.preventDefault()
    e.stopPropagation()
    /* no await */ fetchMoreItemsAtBottomOfTimeline($currentInstance, $currentTimeline)
    // focus the last item in the timeline; it makes the most sense to me since the button disappears
    try {
      // TODO: should probably expose this as an API on the virtual list instead of reaching into the DOM
      const virtualListItems = document.querySelector('.virtual-list').children
      const lastItem = virtualListItems[virtualListItems.length - 2] // -2 because the footer is last
      lastItem.querySelector('article').focus()
    } catch (e) {
      console.error(e)
    }
  }
</script>

<div class="loading-footer {shown ? '' : 'hidden'}">
  <div class="loading-wrapper {showLoading ? 'shown' : ''}" aria-hidden={!showLoading} role="alert">
    <!-- Sapper's mousemove event listener schedules style recalculations for the loading spinner in
         Chrome because it's always animating, even when hidden. So disable animations when not visible
         to avoid this. -->
    <LoadingSpinner size={48} animate={showLoading} />
    <span class="loading-footer-info">
      {intl.loadingMore}
    </span>
  </div>
  <div class="button-wrapper {showLoadButton ? 'shown' : ''}" aria-hidden={!showLoadButton}>
    <button type="button" class="primary" on:click={onClickLoadMore}>
      {intl.loadMore}
    </button>
  </div>
</div>

<style>
  .loading-footer {
    padding: 20px 0;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }
  .loading-wrapper {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.2s linear;
  }
  .loading-wrapper.shown {
    opacity: 1;
    pointer-events: auto;
  }
  .loading-footer-info {
    margin-left: 20px;
    font-size: 1.3em;
  }
  .button-wrapper {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    pointer-events: none;
    transition: none;
  }
  .button-wrapper.shown {
    opacity: 1;
    pointer-events: auto;
    transition: opacity 0.2s linear 0.2s;
  }
</style>
