<script>
  import { coordsToPercent } from '../_utils/coordsToPercent'
  import { largeInlineMedia } from '../_store/local'

  export let ariaLabel
  export let poster
  export let src
  export let width
  export let height
  export let focus = undefined

  $: focusStyle = () => {
    // Here we do a pure css version instead of using
    // https://github.com/jonom/jquery-focuspoint#1-calculate-your-images-focus-point

    if (!focus) return 'background-position: center;'
    return `object-position: ${coordsToPercent(focus.x)}% ${100 - coordsToPercent(focus.y)}%;`
  }
</script>

<div
  class="autoplay-wrapper {$largeInlineMedia ? '' : 'autoplay-video-fixed-size'}"
  style="width: {width}px; height: {height}px;"
>
  <video
    class="autoplay-video {$largeInlineMedia ? '' : 'autoplay-video-fixed-size'}"
    aria-label={ariaLabel || ''}
    style="{focusStyle} background-image: url({poster}); "
    {poster}
    {width}
    {height}
    {src}
    autoplay
    muted
    loop
    webkit-playsinline
    playsinline
  />
</div>

<style>
  .autoplay-wrapper {
    position: relative;
    margin: 0;
    padding: 0;
  }

  .autoplay-video {
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    display: flex;
  }

  .autoplay-video-fixed-size {
    position: absolute;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
</style>
