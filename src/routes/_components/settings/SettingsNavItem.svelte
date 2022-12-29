<script>
  import { formatIntl } from '../../_utils/formatIntl'

  export let page;
  export let name;
  export let href;
  export let label;

  $: className = (page === name ? 'selected' : '');

  $: ariaLabel = formatIntl('intl.navItemLabel', {
    label,
    selected: page === name,
    name
  })
</script>

<a class="settings-nav-item {className}"
   id="settings-nav-item-{href}"
   aria-label={ariaLabel}
   data-sveltekit-preload-data
   {href} >
  {label}
</a>
<style>
  a.settings-nav-item {
    font-size: 1.2em;
  }

  a.settings-nav-item.selected {
    font-weight: 600;
  }
</style>

