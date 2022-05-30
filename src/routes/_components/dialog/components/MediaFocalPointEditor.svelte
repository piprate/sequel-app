<script>
  import { setComposeData } from '../../../_store/local';
  import { get } from '../../../_utils/lodash-lite';
  import { scheduleIdleTask } from '../../../_utils/scheduleIdleTask';
  import { coordsToPercent, percentToCoords } from '../../../_utils/coordsToPercent';
  import SvgIcon from '../../SvgIcon.svelte';
  import { intrinsicScale } from '../../../_thirdparty/intrinsic-scale/intrinsicScale';
  import { resize } from '../../../_utils/events';
  import Draggable from '../../Draggable.svelte';
  import { loadSecureMedia } from "../../../_api/media";
  import { accessToken } from "../../../_store/instance";
  import { onMount } from "svelte";
  import { ONE_TRANSPARENT_PIXEL } from "../../../_static/media";

  export let className = '';
  export let realm;
  export let mediaItem;
  export let field = '';
  //export let index = 0;
  export let media = undefined;

  const parseAndValidateFloat = rawText => {
    let float = parseFloat(rawText);
    if (Number.isNaN(float)) {
      float = 0;
    }
    float = Math.min(1, float);
    float = Math.max(-1, float);
    float = Math.round(float * 100) / 100;
    return float;
  };

  let dragging = false;
  let rawFocusX = '0';
  let rawFocusY = '0';
  let containerWidth = 0;
  let containerHeight = 0;
  let imageLoaded = false;

  $: focusX = get(mediaItem, ['focusX'], 0);
  $: focusY = get(mediaItem, ['focusY'], 0);
  $: nativeWidth = (
          get(mediaItem, ['data', 'meta', 'width'], 300)
  );
  $: nativeHeight = (
          get(mediaItem, ['data', 'meta', 'height'], 200)
  );
  $: shortName = (
          // sometimes we no longer have the file, e.g. in a delete and redraft situation,
          // so fall back to the description if it was provided
          get(mediaItem, ['file', 'name']) || get(mediaItem, ['description']) || 'media'
  );
  // intrinsic width/height to avoid layout shifting https://chromestatus.com/feature/5695266130755584
  // note pleroma does not give us intrinsic width/height
  $: intrinsicWidth = get(mediaItem, ['data', 'meta', 'width']);
  $: intrinsicHeight = get(mediaItem, ['data', 'meta', 'height']);
  $: scale = intrinsicScale(containerWidth, containerHeight, nativeWidth, nativeHeight);
  $: scaleWidth = scale.width;
  $: scaleHeight = scale.height;
  $: scaleX = scale.x;
  $: scaleY = scale.y;
  $: indicatorX = (coordsToPercent(focusX) / 100);
  $: indicatorY = ((100 - coordsToPercent(focusY)) / 100);
  $: draggableAreaStyle = (
          `top: ${scaleY}px; left: ${scaleX}px; width: ${scaleWidth}px; height: ${scaleHeight}px;`
  );

  function updateMediaItem () {
    if (field) {
      setComposeData(realm, { [field]: mediaItem });
    } else {
      setComposeData(realm, { media });
    }
  }

  let container;

  $: {
    // FIXME: rawFocusX and rawFocusY may not be updated

    const focusX = get(mediaItem, ['focusX'], 0) || 0;
    const focusXAsString = focusX.toString();
    if (focusXAsString !== rawFocusX) {
      rawFocusX = focusXAsString;
    }

    const focusY = get(mediaItem, ['focusY'], 0) || 0;
    const focusYAsString = focusY.toString();
    if (focusYAsString !== rawFocusY) {
      rawFocusY = focusYAsString;
    }
  }

  function observeAndSync (rawFocus, key) {
    const rawFocusDecimal = parseAndValidateFloat(rawFocus);
    if (mediaItem[key] !== rawFocusDecimal) {
      mediaItem[key] = rawFocusDecimal;
      updateMediaItem();
    }
  }

  $: observeAndSync(rawFocusX, 'focusX');
  $: observeAndSync(rawFocusY, 'focusY');

  function onDraggableChange (e) {
    const { x, y } = e.detail;
    scheduleIdleTask(() => {
      const focusX = parseAndValidateFloat(percentToCoords(x * 100));
      const focusY = parseAndValidateFloat(percentToCoords(100 - (y * 100)));
      if (mediaItem.focusX !== focusX || mediaItem.focusY !== focusY) {
        mediaItem.focusX = focusX;
        mediaItem.focusY = focusY;
        updateMediaItem();
      }
    });
  }

  function onDragStart () {
    dragging = true;
  }

  function onDragEnd () {
    dragging = false;
  }

  export function measure () {
    requestAnimationFrame(() => {
      if (!container) {
        return;
      }
      const rect = container.getBoundingClientRect();
      containerWidth = rect.width;
      containerHeight = rect.height;
    });
  }

  let preview = ONE_TRANSPARENT_PIXEL;

  onMount(async () => {
    try {
      preview = await loadSecureMedia($accessToken, mediaItem.previewUrl);
      measure();
      imageLoaded = true;
    } catch (e) {
      console.error('Image loading error', mediaItem.previewUrl, e);
    }
  });
</script>

<form class="media-focal-point-container {className}"
      aria-label="{intl.enterFocalPoint}"
      use:resize={measure}
>
  <div class="media-focal-point-image-container" bind:this={container}>
    <img
            width={intrinsicWidth}
            height={intrinsicHeight}
            class="media-focal-point-image"
            src={preview}
            alt={shortName}
    />
    <div class="media-focal-point-backdrop"></div>
    <div class="media-draggable-area"
         style={draggableAreaStyle}
    >
      <!-- 52px == 32px icon width + 10px padding -->
      <Draggable
              draggableClass="media-draggable-area-inner"
              indicatorClass="media-focal-point-indicator {imageLoaded ? '': 'hidden'} {dragging ? 'dragging' : ''}"
              indicatorWidth={52}
              indicatorHeight={52}
              x={indicatorX}
              y={indicatorY}
              on:dragStart={onDragStart}
              on:dragEnd={onDragEnd}
              on:change={onDraggableChange}
      >
        <SvgIcon
                className="media-focal-point-indicator-svg"
                href="#fa-crosshairs"
        />
      </Draggable>
    </div>
  </div>
  <div class="media-focal-point-inputs">
    <div class="media-focal-point-input-pair">
      <label for="media-focal-point-x-input-{realm}">
        X
      </label>
      <input type="number"
             step="0.01"
             min="-1"
             max="1"
             inputmode="decimal"
             placeholder="0"
             id="media-focal-point-x-input-{realm}"
             bind:value="{rawFocusX}"
      />
    </div>
    <div class="media-focal-point-input-pair">
      <label for="media-focal-point-y-input-{realm}">
        Y
      </label>
      <input type="number"
             step="0.01"
             min="-1"
             max="1"
             inputmode="decimal"
             placeholder="0"
             id="media-focal-point-y-input-{realm}"
             bind:value="{rawFocusY}"
      />
    </div>
  </div>
</form>
<style>
  .media-focal-point-container {
    display: flex;
    flex-direction: column;
  }
  .media-focal-point-image-container {
    flex: 1;
    width: 100%;
    position: relative;
    min-height: 0;
  }
  .media-focal-point-image {
    object-fit: contain;
    width: 100%;
    height: 100%;
  }

  .media-focal-point-backdrop {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
  }

  @supports (-webkit-backdrop-filter: blur(1px) saturate(1%)) or (backdrop-filter: blur(1px) saturate(1%)) {
    .media-focal-point-backdrop {
      -webkit-backdrop-filter: blur(1px) saturate(105%);
      backdrop-filter: blur(1px) saturate(105%);
      background-color: var(--focal-img-backdrop-filter);
    }
  }

  @supports not ((-webkit-backdrop-filter: blur(1px) saturate(1%)) or (backdrop-filter: blur(1px) saturate(1%))) {
    .media-focal-point-backdrop {
      background-color: var(--focal-img-bg);
    }
  }

  .media-focal-point-inputs {
    display: flex;
    padding: 10px;
    justify-content: space-around;
    width: auto;
  }

  .media-focal-point-input-pair {
    display: flex;
    align-items: center;
  }

  .media-focal-point-input-pair:first-child {
    margin-right: 10px;
  }

  .media-focal-point-input-pair input {
    margin-left: 10px;
  }

  .media-draggable-area {
    position: absolute;
  }

  :global(.media-focal-point-indicator) {
    background: var(--focal-bg);
    border-radius: 100%;
    display: flex;
  }

  :global(.media-focal-point-indicator:hover) {
    background: var(--focal-bg-hover);
  }

  :global(.media-focal-point-indicator.dragging) {
    background: var(--focal-bg-drag);
  }

  :global(.media-draggable-area-inner) {
    width: 100%;
    height: 100%;
  }

  :global(.media-focal-point-indicator-svg) {
    width: 32px;
    height: 32px;
    padding: 15px;
    fill: var(--focal-color);
  }

  @media (max-width: 767px) {
    .media-focal-point-inputs {
      padding: 5px 20px;
      justify-content: space-around;
    }
    :global(.media-focal-point-indicator-svg) {
      width: 32px;
      height: 32px;
      padding: 12px;
      fill: var(--focal-color);
    }
    .media-focal-point-input-pair label {
      font-size: 1.1em;
    }
    .media-focal-point-input-pair input {
      font-size: 1.1em;
    }
  }
</style>