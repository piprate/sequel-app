<script>
  import SvgIcon from './SvgIcon.svelte'

  let className = undefined
</script>

<div class="play-video-icon {className || ''}">
  <SvgIcon className="play-video-icon-svg" href="#fa-play-circle" />
</div>

<style>
  .play-video-icon {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 40;
    pointer-events: none;
  }
  :global(.play-video-icon-svg) {
    width: 72px;
    height: 72px;
    fill: var(--mask-svg-fill);
    border-radius: 100%;
    background: var(--mask-opaque-bg);
  }
</style>
