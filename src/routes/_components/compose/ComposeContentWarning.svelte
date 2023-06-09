<script>
  import { setComposeData } from '../../_store/local'
  import { scheduleIdleTask } from '../../_utils/scheduleIdleTask'
  import { throttleTimer } from '../../_utils/throttleTimer'
  import { onMount } from 'svelte'

  const updateContentWarningInStore = throttleTimer(scheduleIdleTask)

  export let realm
  export let contentWarning

  let rawText = ''

  // function setupSyncFromStore () {
  //   this.observe('contentWarning', contentWarning => {
  //     this.set({ rawText: contentWarning })
  //   })
  // }

  $: {
    rawText = contentWarning
  }

  // function setupSyncToStore () {
  //   this.observe('rawText', rawText => {
  //     updateContentWarningInStore(() => {
  //       setComposeData(realm, {
  //         sensitive: !!rawText, // toggling the content warning automatically toggles sensitive media
  //         contentWarning: rawText
  //       })
  //     })
  //   }, { init: false })
  // }

  $: {
    updateContentWarningInStore(() => {
      setComposeData(realm, {
        sensitive: !!rawText, // toggling the content warning automatically toggles sensitive media
        contentWarning: rawText
      })
    })
  }

  // onMount(() => {
  //   setupSyncFromStore();
  //   setupSyncToStore();
  // });
</script>

<input
  class="content-warning-input"
  type="text"
  placeholder={intl.contentWarning}
  aria-label={intl.contentWarning}
  bind:value={rawText}
/>

<style>
  .content-warning-input {
    font-size: 1.2em;
    margin: 10px 0 0 5px;
    padding: 10px;
    border: 1px solid var(--input-border);
    width: calc(100% - 5px);
  }
</style>
