<script>
  import { scheduleIdleTask } from '../../_utils/scheduleIdleTask'
  import { onMount } from 'svelte'
  import { getComposeData, setComposeData } from '../../_store/local'

  export let realm
  export let media
  export let sensitive
  export let contentWarning
  export let contentWarningShown

  let rawChecked = false

  $: disabled = contentWarning && contentWarningShown

  function observeRawChecked(rawChecked) {
    scheduleIdleTask(() => {
      const sensitive = getComposeData(realm, 'sensitive')
      if (sensitive !== rawChecked) {
        setComposeData(realm, { sensitive: rawChecked })
      }
    })
  }

  $: observeRawChecked(rawChecked)

  function observeSensitive(sensitive) {
    rawChecked = sensitive
  }

  $: observeSensitive(sensitive)

  function setupSyncToStore() {
    // this.observe('rawChecked', () => {
    //   scheduleIdleTask(() => {
    //     const sensitive = getComposeData(realm, 'sensitive')
    //     if (sensitive !== rawChecked) {
    //       setComposeData(realm, { sensitive: rawChecked })
    //     }
    //   })
    // }, { init: false })
  }

  function setupSyncFromStore() {
    // this.observe('sensitive', sensitive => {
    //   this.set({ rawChecked: sensitive })
    // })
  }

  onMount(() => {
    setupSyncToStore()
    setupSyncFromStore()
  })
</script>

{#if media.length}
  <div class="compose-media-sensitive">
    <label>
      <input type="checkbox" bind:checked={rawChecked} {disabled} />
      <span class={disabled ? 'compose-sensitive-span-disabled' : ''}>
        {intl.markAsSensitive}
      </span>
    </label>
  </div>
{/if}

<style>
  .compose-media-sensitive {
    grid-area: sensitive;
    margin-top: 10px;
  }
  label {
    padding: 5px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }
  span {
    margin-left: 5px;
  }
  .compose-sensitive-span-disabled {
    color: var(--deemphasized-text-color);
  }

  @media (max-width: 767px) {
    .compose-media-sensitive {
      margin-top: 0;
    }
  }

  @media (max-width: 320px) {
    span {
      font-size: 0.9em;
    }
  }
</style>
