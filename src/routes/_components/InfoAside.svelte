<script>
  import SvgIcon from './SvgIcon.svelte'

  export let className = ''

  $: selectedClass = className || 'default-style'
</script>

<aside class="info-aside {selectedClass}">
  <SvgIcon href="#fa-info-circle" className="aside-icon" />
  <span>
    <slot />
  </span>
</aside>

<style>
  .info-aside {
    font-size: 1.2em;
    color: var(--deemphasized-text-color);
    display: flex;
    align-items: center;
  }
  :global(.info-aside a) {
    text-decoration: underline;
    color: var(--deemphasized-text-color);
  }
  :global(.info-aside span) {
    flex: 1;
  }
  :global(.aside-icon) {
    fill: var(--deemphasized-text-color);
    width: 18px;
    height: 18px;
    margin: 0 10px 0 5px;
    min-width: 18px;
  }
  .default-style {
    margin: 10px 10px 10px 10px;
  }
</style>
