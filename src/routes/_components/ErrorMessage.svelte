<script>
  export let error

  function addPeriod (val) {
    val = val.trim()
    if (!val.endsWith('.')) {
      val += "."
    }
    return val
  }

  $: originalErrorMessage = error ? (error.message || error.name || error) : ''
  $: errorMessage = error ?
    (error.knownError || navigator.onLine) ?
      originalErrorMessage :
      `${addPeriod(originalErrorMessage)} ` + 'intl.offlineNotice'
    : ''
</script>
{#if error}
<div class="error-box" role="alert">
    {intl.errorShort} {@html errorMessage}
</div>
{/if}

<style>
    .error-box {
        border: 2px solid var(--warn-color);
        border-radius: 2px;
        padding: 10px;
        font-size: 1.3em;
        margin: 5px;
        background-color: var(--main-bg);
    }
</style>