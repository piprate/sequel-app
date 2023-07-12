<script lang="ts">
  import { onMount } from 'svelte'
  import { createPopper } from '@popperjs/core'
  import preventOverflow from '@popperjs/core/lib/modifiers/preventOverflow.js'
  import flip from '@popperjs/core/lib/modifiers/flip.js'
  import SvgIcon from './SvgIcon.svelte'
  import LoadingSpinner from './LoadingSpinner.svelte'
  import { createPlayerId } from '../_utils/createPlayerId'

  export let sound: string
  let id = createPlayerId()

  // These values are bound to properties of the video
  let time = 0
  let duration
  let audio: HTMLAudioElement

  $: loading = !sound || sound.startsWith('data:')
  $: paused = audio?.paused

  $: if (time === duration) {
    time = 0
    paused = true
  }

  function togglePlay() {
    if (paused) audio?.play()
    else audio?.pause()
    paused = !paused
  }

  function seek(event: Event & { currentTarget: EventTarget & HTMLInputElement }) {
    const timeline = event.currentTarget
    time = timeline.valueAsNumber
  }

  function changeVolume(event: Event & { target: EventTarget & HTMLInputElement }) {
    const control = event.target as HTMLInputElement
    audio.volume = control.valueAsNumber / 100
  }

  function togglePlaybackSpeedMenu(event: Event & { currentTarget: EventTarget & HTMLButtonElement }) {
    // TODO: implement playback speed later
  }

  function format(seconds) {
    if (isNaN(seconds)) return '...'

    const minutes = Math.floor(seconds / 60)
    seconds = Math.floor(seconds % 60)
    if (seconds < 10) seconds = '0' + seconds

    return `${minutes}:${seconds}`
  }

  function createVolumePopover(event: Event) {
    event.stopPropagation()

    const template = document.querySelector<HTMLTemplateElement>('#volume-template')
    const clone = template.content.cloneNode(true)

    document.body.appendChild(clone)

    const volume = document.querySelector<HTMLButtonElement>('#volume-popup')
    const button = document.querySelector<HTMLButtonElement>(`#volume-btn-${id}`)
    volume.addEventListener('change', changeVolume)

    const volumeInput = volume.querySelector('input')
    volumeInput.value = String(audio.volume * 100)

    createPopper(button, volume, {
      placement: 'top',
      modifiers: [
        preventOverflow,
        flip,
        {
          name: 'offset',
          options: {
            offset: [0, -30]
          }
        }
      ]
    })
  }

  onMount(() => {
    document.addEventListener('click', (event) => {
      const volume = document.querySelector<HTMLButtonElement>('#volume-popup')
      if (volume && !volume.contains(event.target as Node)) {
        document.body.removeChild(volume)
      }
    })
  })
</script>

<audio bind:this={audio} src={sound} bind:duration bind:currentTime={time}>
  Your browser does not support the audio element.
</audio>
<div class="audio-player">
  <div class="play">
    <div class="loading">
      {#if loading}
        <LoadingSpinner size={26} />
      {/if}
    </div>
    <button disabled={loading} class="icon-btn {paused ? 'play' : 'pause'}-btn" on:click={togglePlay}>
      <SvgIcon ariaLabel="play" className="{paused ? 'play' : 'pause'}-icon" href="#fa-{paused ? 'play' : 'pause'}" />
    </button>
  </div>
  <div class="duration">
    {format(time)} / {format(duration)}
  </div>
  <div class="progress-bar">
    <input disabled={loading} type="range" min="0" max={Math.round(duration)} bind:value={time} on:change={seek} />
  </div>

  <div class="volume">
    <template id="volume-template">
      <div id="volume-popup">
        <input type="range" name="volume" id="volume" class="volume-bar" />
      </div>
    </template>
    <button disabled={loading} id="volume-btn-{id}" class="icon-btn volume-btn" on:click={createVolumePopover}>
      <SvgIcon ariaLabel="change volume" className="volume-icon" href="#fa-volume-up" />
    </button>
  </div>
  <div class="playback-speed">
    <button
      disabled={loading}
      class="playback-btn"
      aria-label="change playback speed"
      on:click={togglePlaybackSpeedMenu}>1x</button
    >
  </div>
</div>

<style lang="scss">
  .audio-player {
    width: 100%;
    display: grid;
    box-sizing: border-box;
    grid-template-columns: auto auto 1fr auto auto;
    gap: 0.25rem;
    align-items: center;
    padding: 0.25rem;
    background-color: var(--audio-bg);
    position: relative;

    :global(svg) {
      width: 16px;
      height: 16px;
      fill: var(--body-text-color);
    }
  }

  .loading {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  #volume-popup {
    width: 30px;
    background-color: var(--toast-bg);
    padding: 12px 0;
    height: 100px;
    border-radius: 18px;

    input {
      width: inherit;
      height: inherit;
      padding: 0;
      margin: 0;
    }
  }

  input {
    width: 100%;
    padding: 0;
    cursor: pointer;

    &.volume-bar {
      appearance: slider-vertical;
    }
  }

  .play {
    position: relative;
  }

  button {
    border-radius: 50%;
    width: 32px;
    height: 32px;
    padding: 0;
    display: grid;
    place-items: center;
    transition: ease-out 100ms background-color;

    &:is(.play-btn, .pause-btn) {
      background-color: var(--main-theme-color);

      &:is(:hover, :focus-visible) {
        background-color: var(--action-button-fill-color-pressed);
      }

      &:active {
        background-color: var(--button-primary-bg-active);
      }
    }

    &.play-btn :global(svg) {
      transform: translateX(1px);
    }

    &:is(.playback-btn, .volume-btn) {
      background: none;
      border: none;

      &:is(:hover, :focus-visible) {
        background-color: var(--button-bg-hover);
      }

      &:active {
        background-color: var(--button-bg-active);
      }
    }

    &.playback-btn {
      font-size: 0.875rem;
    }
  }

  @media screen and (min-width: 480px) {
    .audio-player {
      padding: 0.5rem 1rem;
      gap: 0.5rem;
    }
  }

  @media screen and (min-width: 480px) {
    .audio-player {
      gap: 1rem;
    }
  }
</style>
