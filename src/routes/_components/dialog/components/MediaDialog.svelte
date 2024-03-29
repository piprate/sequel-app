<script>
  import ModalDialog from './ModalDialog.svelte'
  import MediaInDialog from './MediaInDialog.svelte'
  import IconButton from '../../IconButton.svelte'
  import Shortcut from '../../shortcut/Shortcut.svelte'
  import PinchZoomable from './PinchZoomable.svelte'
  import debounce from 'lodash-es/debounce'
  import times from 'lodash-es/times'
  import { smoothScroll, hasNativeSmoothScroll } from '../../../_utils/smoothScroll'
  import { leftRightChangesFocus } from '../../../_store/local'
  import { intrinsicScale } from '../../../_thirdparty/intrinsic-scale/intrinsicScale'
  import { get } from '../../../_utils/lodash-lite'
  import { formatIntl } from '../../../_utils/formatIntl'
  import { onMount } from 'svelte'

  // padding for .media-scroll-item-image-area
  const IMAGE_AREA_PADDING = {
    top: 15,
    left: 5,
    right: 5,
    bottom: 5
  }

  export let id
  export let label
  export let mediaItems
  export let scrolledItem

  let pinchZoomMode = false

  $: length = mediaItems.length
  $: dots = times(length, (i) => ({ i }))
  $: canPinchZoom = !mediaItems.some((media) => ['Video', 'Audio'].includes(media.type))
  $: mediaItem = mediaItems[scrolledItem]
  $: nativeWidth = get(mediaItem, ['meta', 'original', 'width'], 300) // TODO: Pleroma placeholder
  $: nativeHeight = get(mediaItem, ['meta', 'original', 'height'], 200) // TODO: Pleroma placeholder

  let scroller

  function createLabel(i, current) {
    return formatIntl('intl.showMedia', { index: i + 1, current })
  }

  function rawOnScroll() {
    if (!scroller) {
      return
    }
    const { scrollWidth, scrollLeft } = scroller
    scrolledItem = Math.round((scrollLeft / scrollWidth) * length)
  }

  let onScroll

  function setupScroll() {
    scroller.addEventListener('scroll', onScroll)
  }

  function teardownScroll() {
    scroller.removeEventListener('scroll', onScroll)
  }

  function onButtonClick(i) {
    if (scrolledItem !== i) {
      scrollToItem(i, true)
    }
  }

  function next() {
    if (scrolledItem < length - 1) {
      scrollToItem(scrolledItem + 1, true)
    }
  }

  function prev() {
    if (scrolledItem > 0) {
      scrollToItem(scrolledItem - 1, true)
    }
  }

  function onShow() {
    if (scrolledItem) {
      requestAnimationFrame(() => {
        scrollToItem(scrolledItem, false)
        setupScroll()
      })
    } else {
      setupScroll()
    }
  }

  function scrollToItem(_scrolledItem, smooth) {
    scrolledItem = _scrolledItem
    const { scrollWidth } = scroller
    const scrollLeft = Math.floor(scrollWidth * (_scrolledItem / length))
    if (smooth) {
      if (!hasNativeSmoothScroll && 'StyleMedia' in window) {
        // Edge has a weird bug where it changes the height if we try to
        // smooth scroll, so disable smooth scrolling
        scroller.scrollLeft = scrollLeft
      } else {
        smoothScroll(scroller, scrollLeft, /* horizontal */ true, /* preferFast */ false)
      }
    } else {
      console.log('setting scrollLeft', scrollLeft)
      scroller.scrollLeft = scrollLeft
    }
  }

  function togglePinchZoomMode() {
    pinchZoomMode = !pinchZoomMode
  }

  function onImageClick(e) {
    if (pinchZoomMode) {
      return
    }
    let rect = scroller.getBoundingClientRect()
    // apply padding
    rect = {
      width: rect.width - IMAGE_AREA_PADDING.left - IMAGE_AREA_PADDING.right,
      height: rect.height - IMAGE_AREA_PADDING.top - IMAGE_AREA_PADDING.bottom,
      left: rect.left + IMAGE_AREA_PADDING.left,
      top: rect.top + IMAGE_AREA_PADDING.top
    }
    const scale = intrinsicScale(rect.width, rect.height, nativeWidth, nativeHeight)
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const insideImage = x >= scale.x && x <= scale.x + scale.width && y >= scale.y && y <= scale.y + scale.height
    if (!insideImage) {
      // close dialog when clicking outside of image
      e.preventDefault()
      e.stopPropagation()
      close()
    }
  }

  function onMediaControlsClick(e) {
    if (pinchZoomMode) {
      return
    }
    const { target } = e
    if (target.tagName !== 'BUTTON' && !target.classList.contains('media-controls')) {
      e.preventDefault()
      e.stopPropagation()
      // close dialog when clicking on the controls but not on a button inside the controls,
      // or between the buttons
      close()
    }
  }

  onMount(() => {
    onScroll = debounce(rawOnScroll, 50, { leading: false, trailing: true })
    return () => {
      teardownScroll()
    }
  })
</script>

<ModalDialog
  {id}
  {label}
  background="var(--muted-modal-bg)"
  muted="true"
  clickHeaderToClose={true}
  className="media-modal-dialog"
  on:show={onShow}
>
  <div class="media-container">
    <ul class="media-scroll" bind:this={scroller} on:click={onImageClick}>
      {#each mediaItems as media}
        <li class="media-scroll-item">
          <div class="media-scroll-item-inner">
            <div class="media-scroll-item-image-area">
              {#if canPinchZoom && pinchZoomMode}
                <PinchZoomable className="media-pinch-zoom">
                  <MediaInDialog {media} />
                </PinchZoomable>
              {:else}
                <MediaInDialog {media} />
              {/if}
            </div>
          </div>
        </li>
      {/each}
    </ul>
    <div class="media-controls-outside" on:click={onMediaControlsClick}>
      {#if canPinchZoom}
        <IconButton
          className="media-control-button media-control-button-dummy-spacer"
          svgClassName="media-control-button-svg"
          href="#fa-search"
          label=""
          ariaHidden={true}
        />
      {/if}
      {#if dots.length > 1}
        <!-- Roughly based on https://www.w3.org/WAI/tutorials/carousels/functionality/
             Since this toolbar contains a mix of left/right/first/second/third/fourth buttons,
             just list them and explicitly label the current one as "current." -->
        <ul class="media-controls" aria-label={intl.navigateMedia}>
          <li class="media-control">
            <IconButton
              className="media-control-button"
              svgClassName="media-control-button-svg"
              disabled={scrolledItem === 0}
              label={intl.showPreviousMedia}
              href="#fa-angle-left"
              on:click={prev}
            />
          </li>
          {#each dots as dot, i (dot.i)}
            <li class="media-control">
              <IconButton
                className="media-control-button"
                svgClassName="media-control-button-svg"
                pressable={true}
                label={createLabel(i, false)}
                pressedLabel={createLabel(i, true)}
                pressed={i === scrolledItem}
                href={i === scrolledItem ? '#fa-circle' : '#fa-circle-o'}
                sameColorWhenPressed={true}
                on:click={() => {
                  onButtonClick(i)
                }}
              />
            </li>
          {/each}
          <li class="media-control">
            <IconButton
              className="media-control-button"
              svgClassName="media-control-button-svg"
              disabled={scrolledItem === length - 1}
              label={intl.showNextMedia}
              href="#fa-angle-right"
              on:click={next}
            />
          </li>
        </ul>
      {/if}
      {#if canPinchZoom}
        <IconButton
          className="media-control-button"
          svgClassName="media-control-button-svg"
          pressable={true}
          pressed={pinchZoomMode}
          label={intl.enterPinchZoom}
          pressedLabel={intl.exitPinchZoom}
          href="#fa-search"
          on:click={togglePinchZoomMode}
        />
      {/if}
    </div>
  </div>
</ModalDialog>

{#if !$leftRightChangesFocus}
  <Shortcut scope="modal-{id}" key="ArrowLeft" on:pressed={prev} />
  <Shortcut scope="modal-{id}" key="ArrowRight" on:pressed={next} />
{/if}

<style>
  :global(.media-modal-dialog) {
    max-width: 100%;
  }
  .media-container {
    height: calc(100% - 64px); /* 44px X button height + 20px padding */
    width: 100vw;
    display: flex;
    flex-direction: column;
  }
  .media-scroll {
    -webkit-overflow-scrolling: touch;
    display: flex;
    align-items: center;
    overflow-x: auto;
    width: 100%;
    flex: 1;
    scrollbar-width: none;
    -ms-overflow-style: none;
  }

  ul.media-scroll {
    padding: 0;
    margin: 0;
    list-style: none;
  }

  .media-scroll::-webkit-scrollbar {
    display: none;
  }

  .media-scroll-item {
    height: 100%;
  }
  .media-scroll-item-inner {
    width: 100vw;
    height: 100%;
    overflow: hidden;
  }
  .media-scroll-item-image-area {
    height: calc(100% - 20px); /* 15px padding top + 5px padding bottom */
    width: calc(100% - 10px); /* 5px padding left + 5px padding right */
    padding: 15px 5px 5px 5px;
  }

  .media-controls-outside {
    display: flex;
    justify-content: space-between;
    padding: 10px;
  }

  .media-controls {
    display: flex;
    justify-content: space-between;
  }
  ul.media-controls {
    margin: 0;
    padding: 0;
    list-style: none;
  }
  li.media-control {
    margin: 0;
    padding: 0;
    display: flex;
  }

  :global(.media-pinch-zoom) {
    width: 100%;
    height: 100%;
  }

  :global(.media-control-button-dummy-spacer) {
    visibility: hidden;
  }

  :global(.icon-button.media-control-button) {
    margin: 0 5px;
  }

  :global(.media-control-button-svg) {
    /* ensure that click events do not fall on these svgs */
    pointer-events: none;
  }

  @media (max-width: 767px) {
    :global(.icon-button.media-control-button) {
      margin: 0;
      padding-left: 5px;
      padding-right: 5px;
    }
  }

  @media (max-width: 320px) {
    :global(.icon-button.media-control-button) {
      padding-left: 2px;
      padding-right: 2px;
    }
  }

  @supports (scroll-snap-align: start) {
    /* modern scroll snap points */
    .media-scroll {
      scroll-snap-type: x mandatory;
    }
    .media-scroll-item {
      scroll-snap-align: center;
    }
  }
  @supports not (scroll-snap-align: start) {
    /* old scroll snap points spec */
    .media-scroll {
      -webkit-scroll-snap-type: mandatory;
      scroll-snap-type: mandatory;
      -webkit-scroll-snap-destination: 0% center;
      scroll-snap-destination: 0% center;
      -webkit-scroll-snap-points-x: repeat(100%);
      scroll-snap-points-x: repeat(100%);
    }

    .media-scroll-item {
      scroll-snap-coordinate: 0 0;
    }
  }

  @media (max-width: 767px) {
    .media-container {
      height: calc(100vh - 64px);
    }
  }
</style>
