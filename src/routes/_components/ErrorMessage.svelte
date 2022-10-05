<script>
  export let error

  $: errorMessage = error && error.message ? error.message : error
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