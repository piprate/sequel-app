<script>
  import { createEventDispatcher } from 'svelte';

  export let href;
  export let label;
  export let ariaLabel = undefined;
  export let className = undefined;

  const dispatch = createEventDispatcher();
</script>

<a {href}
   id="settings-list-button-{href}"
   on:click="{() => dispatch('click')}"
   rel="prefetch"
   aria-label={ariaLabel || label}
   class="settings-list-button focus-fix {className ? className : ''}"
>
  <span>
    {label}
  </span>
</a>
<style>
  .settings-list-button {
    display: flex;
    flex-grow: 1;
  }
  .settings-list-button span {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
