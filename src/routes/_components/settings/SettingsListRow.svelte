<script>
</script>

<li class="settings-list-item">
  <slot />
</li>

<style>
  .settings-list-item {
    display: flex;
    flex-direction: row;
  }

  .settings-list-item > :global(*) {
    font-size: 1.3em;
    display: flex;
    padding: 20px 40px;
    border: 1px solid var(--settings-list-item-border);
    background: var(--settings-list-item-bg);
    color: var(--settings-list-item-text);
    text-decoration: none;
  }
  .settings-list-item > :global(*:hover) {
    text-decoration: none;
    background: var(--settings-list-item-bg-hover);
    color: var(--settings-list-item-text-hover);
  }
  .settings-list-item > :global(*:active) {
    background: var(--settings-list-item-bg-active);
  }
  .settings-list-item > :global(*:not(:last-child)) {
    border-right: none;
  }

  @media (max-width: 767px) {
    .settings-list-item > :global(*) {
      padding: 20px 10px;
    }
  }

  @media (max-width: 240px) {
    .settings-list-item > :global(*) {
      padding: 10px 10px;
    }
  }
</style>
