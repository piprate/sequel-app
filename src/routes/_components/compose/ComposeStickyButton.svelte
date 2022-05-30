<script>
  import ComposeButton from './ComposeButton.svelte'
  import { timelineInitialized } from '../../_store/local'
  import { importShowComposeDialog } from '../dialog/asyncDialogs/importShowComposeDialog.js'
  import { classname } from '../../_utils/classname'
  import { createEventDispatcher, onMount } from "svelte";

  const dispatch = createEventDispatcher();

  export let showSticky;
  export let overLimit;
  export let hideAndFadeIn;

  let sticky = false;
  let sentinel;

  $: computedClass = classname(
          'compose-box-button-wrapper',
          showSticky && 'compose-box-button-sticky',
          hideAndFadeIn
  );

  function onClickButton() {
    if (sticky) {
      // when the button is sticky, we're scrolled down the home timeline,
      // so we should launch a new compose dialog
      showDialog()
    } else {
      // else we're actually posting a new toot, let our parent know
      dispatch('postAction');
    }
  }

  async function showDialog() {
    (await importShowComposeDialog())()
  }

  let __stickyObserver;
  let __oneShotObserver;

  function onObserve(entries) {
    sticky = !entries[0].isIntersecting
  }

  let enableObserveTimelineInitialized = false;

  function observeTimelineInitialized(timelineInitialized) {
    if (timelineInitialized && !__oneShotObserver) {
      __oneShotObserver = new IntersectionObserver(entries => {
        onObserve(entries)
        __oneShotObserver.disconnect()
        __oneShotObserver = null
      })
      __oneShotObserver.observe(sentinel)
    }
  }
  $: if (enableObserveTimelineInitialized) {
    observeTimelineInitialized($timelineInitialized);
  }

  function setupIntersectionObservers() {
    if (!showSticky) {
      return // no need to set up observers if this button can never be sticky (e.g. dialogs)
    }

    __stickyObserver = new IntersectionObserver(entries => onObserve(entries))
    __stickyObserver.observe(sentinel)

    // also create a one-shot observer for the $timelineInitialized event,
    // due to a bug in Firefox where when the scrollTop is set
    // manually, the other observer doesn't necessarily fire
    enableObserveTimelineInitialized = true;
  }

  function teardownIntersectionObservers() {
    if (__stickyObserver) {
      __stickyObserver.disconnect()
      __stickyObserver = null
    }
    if (__oneShotObserver) {
      __oneShotObserver.disconnect()
      __oneShotObserver = null
    }
  }

  let wrapper;

  onMount(() => {
    setupIntersectionObservers();
    return () => {
      teardownIntersectionObservers();
    }
  });
</script>

<div class="compose-box-button-sentinel" bind:this={sentinel}></div>
<div class="{computedClass}" bind:this={wrapper} >
  <ComposeButton {overLimit} {sticky} on:click="{onClickButton}" />
</div>
<style>
  .compose-box-button-wrapper {
    /*
     * We want pointer-events only for the sticky button, so use fit-content so that
     * the element doesn't take up the full width, and then set its left margin to
     * auto so that it sticks to the right. fit-content doesn't work in Edge, but
     * that just means that content that is level with the button is not clickable.
     */
    width: -moz-fit-content;
    width: fit-content;
    margin-left: auto;
    display: flex;
    justify-content: flex-end;
  }

  .compose-box-button-sticky {
    position: -webkit-sticky;
    position: sticky;
  }

  :global(.compose-box-button-sticky, .compose-box-button-fixed) {
    z-index: 5000;
    top: calc(var(--nav-total-height));
  }
</style>