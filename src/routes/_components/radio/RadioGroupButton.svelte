<script>
  export let id
  export let className = ''
  export let label
  export let checked
  export let index
</script>

<button
  id="radio-group-button-{id}-{index}"
  class="radio-group-button {checked ? 'checked' : 'not-checked'} {className}"
  role="radio"
  aria-label={label}
  title={label}
  aria-checked={checked}
  on:click
>
  <slot />
</button>

<style>
  .radio-group-button {
    display: flex;
    align-items: center;
    justify-content: center;
    border: 0;
    background: none;
  }
  .radio-group-button:hover {
    background: none;
  }
  .radio-group-button:active {
    background: none;
  }
</style>
