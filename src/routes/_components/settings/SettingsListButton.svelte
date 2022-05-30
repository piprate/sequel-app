<script>
  import { createEventDispatcher } from 'svelte';

  export let id = '';
  export let href;
  export let label;
  export let ariaLabel = undefined;
  export let className = undefined;

  $: controlId = `settings-list-button-${id ? id : href}`;

  const dispatch = createEventDispatcher();
</script>

{#if href}
  <a {href}
     id="{controlId}"
     on:click="{() => dispatch('click')}"
     sapper:prefetch
     aria-label={ariaLabel || label}
     class="settings-list-button focus-fix {className ? className : ''}"
  >
    <span>
      {label}
    </span>
  </a>
{:else}
  <div
      id="{controlId}"
      on:click="{() => dispatch('click')}"
      aria-label={ariaLabel || label}
      class="settings-list-button focus-fix {className ? className : ''}">
    <span>
      {label}
    </span>
  </div>
{/if}
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
