<script>
  import { formatIntl } from '../_utils/formatIntl'

  export let label
  export let currentTabName
  export let tabs
  export let className = ''

  function createAriaLabel(tabLabel, tabName, currentTabName) {
    return formatIntl('intl.tabLabel', {
      label: tabLabel,
      current: tabName === currentTabName
    })
  }
</script>

<nav aria-label={label} class={className}>
  <ul>
    {#each tabs as tab (tab.name)}
      <li class={currentTabName === tab.name ? 'current' : 'not-current'}>
        <a
          aria-label={createAriaLabel(tab.label, tab.name, currentTabName)}
          aria-current={tab.name === currentTabName}
          class="focus-fix"
          href={tab.href}
          data-sveltekit-preload-data
        >
          {tab.label}
        </a>
      </li>
    {/each}
  </ul>
</nav>

<style>
  li {
    flex: 1;
    text-align: center;
  }

  /* reset */
  ul,
  li {
    margin: 0;
    padding: 0;
  }

  ul {
    list-style: none;
    display: flex;
    margin: 0;
    box-sizing: border-box;
  }

  li {
    border: 1px solid var(--main-border);
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    align-items: center;
    border-top-left-radius: 7px;
    border-top-right-radius: 7px;
    background: var(--tab-bg);
    border-left: none;
  }

  li:last-child {
    border-right: none;
  }

  li:hover {
    background: var(--button-bg-hover);
  }

  li.not-current {
    background: var(--tab-bg-non-selected);
  }

  li.current {
    border-bottom: none;
  }

  li.current:hover {
    background: var(--tab-bg-hover);
  }

  li.not-current:hover {
    background: var(--tab-bg-hover-non-selected);
  }

  li:active {
    background: var(--tab-bg-active);
  }

  a {
    padding: 7px 10px;
    color: var(--body-text-color);
    font-size: 1.1em;
    flex: 1;
  }

  a:hover {
    text-decoration: none;
  }
</style>
