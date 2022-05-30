<script>
  export let href = undefined;
</script>

<li class="search-result">
  {#if href}
    <a {href} class="search-result-anchor" sapper:prefetch>
      <slot></slot>
    </a>
  {:else}
    <div class="search-result-anchor">
      <slot></slot>
    </div>
  {/if}
</li>
<style>
  .search-result {
    box-sizing: border-box;
    border-bottom: 1px solid var(--main-border);
    display: flex;
  }
  .search-result:last-child {
    border-bottom: none;
  }
  .search-result-anchor {
    padding: 20px;
    flex: 1;
    background: var(--settings-list-item-bg);
  }
  .search-result-anchor, .search-result-anchor:visited {
    color: var(--body-text-color);
  }
  .search-result-anchor:hover {
    background: var(--settings-list-item-bg-hover);
    text-decoration: none;
  }
  .search-result-anchor:active {
    background: var(--settings-list-item-bg-active);
  }

  @media (max-width: 767px) {
    .search-result-anchor {
      padding: 15px 10px;
    }
  }
</style>
