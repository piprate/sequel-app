<script>
  export let label
  export let className = undefined
</script>

<div class="generic-label {className || ''}">
  <span class="generic-label-span">
    {label}
  </span>
</div>

<style>
  .generic-label {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .generic-label-span {
    text-transform: uppercase;
    padding: 3px 7px 2px;
    background: var(--nav-bg);
    color: var(--nav-text-color);
    font-size: 0.8em;
    border-radius: 4px;
  }
</style>
