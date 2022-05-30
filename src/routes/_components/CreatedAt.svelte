<script>
  import { classname } from '../_utils/classname';
  import SvgIcon from './SvgIcon.svelte';
  import { monthOnlyAbsoluteDateFormatter } from "../_utils/formatters";
  import { formatIntl } from "../_utils/formatIntl";

  export let createdAt;
  export let flavour = 'created';
  export let className = undefined;
  export let normalIconColor = false;
  // TODO
  //export let ariaLabel = '';

  $: createdAtDate = createdAt ? monthOnlyAbsoluteDateFormatter().format(new Date(createdAt).getTime()) : '';
  $: createdLabel = flavour === 'joined' ?
    formatIntl('intl.joinedIn', { date: createdAtDate }) :
    flavour === 'created' ?
      formatIntl('intl.createdIn', { date: createdAtDate }) :
      '';
  $: computedClass = (classname(
    'created-at',
    className,
    'created-at-with-icon',
    normalIconColor && 'normal-icon-color'
  ));
</script>

<div class={computedClass} >
    <SvgIcon className="created-at-svg" href="#fa-calendar-plus-o" />
    {createdLabel}
</div>

<style>
    .with-left-margin {
        margin-left: 10px;
    }
    .created-at-with-icon {
        display: inline-flex;
        align-items: center;
    }
    :global(.created-at-with-icon .created-at-svg) {
        margin-left: 0px;
        margin-right: 4px;
        width: 14px;
        height: 14px;
        fill: var(--deemphasized-text-color);
    }
    :global(.created-at-with-icon.normal-icon-color .created-at-svg) {
        fill: var(--body-text-color);
    }
</style>