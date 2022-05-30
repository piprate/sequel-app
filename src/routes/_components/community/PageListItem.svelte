<script>
  import { currentInstance, pinnedPages } from '../../_store/local'
  import { pinnedPage } from '../../_store/instance'
  import SvgIcon from '../SvgIcon.svelte'
  import RadioGroupButton from '../../_components/radio/RadioGroupButton.svelte'
  import { formatIntl } from '../../_utils/formatIntl'

  export let href;
  export let label;
  export let icon;
  export let pinnable = false;
  export let pinIndex = undefined;

  $: ariaLabel = (() => {
    return formatIntl('intl.pinLabel', {
      label,
      pinnable,
      pinned: $pinnedPage === href
    })
  })();
  $: pinLabel = formatIntl('intl.pinPage', { label });

  function onPinClick(e) {
    e.preventDefault();
    $pinnedPages[$currentInstance] = href;
  }
</script>

<li class="page-list-item">
  <a {href} rel="prefetch" id="page-list-item-{href}">
    <SvgIcon className="page-list-item-svg" href={icon} />
    <span aria-label={ariaLabel}>
      {label}
    </span>
    {#if pinnable}
      <RadioGroupButton
        id="pinnables"
        className="pinnable-button"
        checked={$pinnedPage === href}
        label={pinLabel}
        index={pinIndex}
        on:click="{onPinClick}"
      >
        <SvgIcon className="pinnable-svg" href="#fa-thumb-tack" />
    </RadioGroupButton>
    {/if}
  </a>
</li>
<style>
  .page-list-item {
    border: 1px solid var(--settings-list-item-border);
    font-size: 1.3em;
    display: flex;
    flex-direction: column;
  }
  .page-list-item a {
    padding: 20px 40px;
    background: var(--settings-list-item-bg);
    display: grid;
    grid-template-columns: min-content 1fr min-content;
    align-items: center;
  }
  .page-list-item a, .page-list-item a:visited {
    color: var(--body-text-color);
  }
  .page-list-item a:hover {
    text-decoration: none;
    background: var(--settings-list-item-bg-hover);
    color: var(--body-text-color);
  }
  .page-list-item a:active {
    background: var(--settings-list-item-bg-active);
  }
  :global(.page-list-item-svg) {
    width: 24px;
    height: 24px;
    display: inline-block;
    margin-right: 20px;
    fill: var(--body-text-color);
  }
  .page-list-item span {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* TODO: begin copypasta from IconButton.html */

  :global(.pinnable-button) {
    background: none;
    border: none;
    padding: 6px 10px;
  }

  :global(.pinnable-button .pinnable-svg) {
    fill: var(--action-button-fill-color);
    width: 24px;
    height: 24px;
  }

  :global(.pinnable-button:hover .pinnable-svg) {
    fill: var(--action-button-fill-color-hover);
  }

  :global(.pinnable-button:active .pinnable-svg) {
    fill: var(--action-button-fill-color-active);
  }

  :global(.pinnable-button.checked .pinnable-svg) {
    fill: var(--action-button-fill-color-pressed);
  }

  :global(.pinnable-button.checked:hover .pinnable-svg) {
    fill: var(--action-button-fill-color-pressed-hover);
  }

  :global(.pinnable-button.checked:active .pinnable-svg) {
    fill: var(--action-button-fill-color-pressed-active);
  }

  /* TODO: end copypasta */

  @media (max-width: 767px) {
    .page-list-item a {
      padding: 20px 10px;
    }
    :global(.page-list-item-svg) {
      margin-right: 10px;
    }
  }

  @media (max-width: 240px) {
    .page-list-item a {
      padding: 10px 5px;
      font-size: 0.9em;
    }
    :global(.page-list-item-svg) {
      margin-right: 5px;
    }
    :global(.page-list-item a button.icon-button) {
      padding: 6px 5px;
    }
  }

</style>
