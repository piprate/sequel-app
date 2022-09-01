<script>
  import { classname } from '../_utils/classname'
  import SvgIcon from './SvgIcon.svelte'
  import {
    dayOnlyAbsoluteDateFormatter,
    monthOnlyAbsoluteDateFormatter,
    shortAbsoluteDateFormatter
  } from '../_utils/formatters'
  import { formatIntl } from '../_utils/formatIntl'

  export let value
  export let flavour = 'created'
  export let resolution = 'month'
  export let style = 'start'
  export let className = undefined
  export let normalIconColor = false
  // TODO
  //export let ariaLabel = '';

  $: formatter = resolution === 'month' ?
    monthOnlyAbsoluteDateFormatter() :
    resolution === 'day' ?
      dayOnlyAbsoluteDateFormatter() :
      shortAbsoluteDateFormatter()
  $: timestampDate = value ? formatter.format(new Date(value).getTime()) : ''
  $: label = flavour === 'joined' ?
    formatIntl('intl.joinedIn', { date: timestampDate }) :
    flavour === 'created' ?
      formatIntl('intl.createdIn', { date: timestampDate }) :
      flavour === 'sold' ?
        formatIntl('intl.soldIn', { date: timestampDate }) :
        flavour === 'starts' ?
          formatIntl('intl.startsAt', { date: timestampDate }) :
          flavour === 'ends' ?
            formatIntl('intl.endsAt', { date: timestampDate }) :
            timestampDate
  $: icon = style === 'start' ? '#fa-calendar-plus-o' : '#fa-calendar-minus-o'
  $: computedClass = (classname(
    'ts',
    className,
    'ts-with-icon',
    normalIconColor && 'normal-icon-color'
  ))
</script>

<div class={computedClass}>
    <SvgIcon className="ts-svg" href={icon} />
    {label}
</div>

<style>
    .with-left-margin {
        margin-left: 10px;
    }
    .ts-with-icon {
        display: inline-flex;
        align-items: center;
    }

    :global(.ts-with-icon .ts-svg) {
        margin-left: 0px;
        margin-right: 4px;
        width: 14px;
        height: 14px;
        fill: var(--deemphasized-text-color);
    }

    :global(.ts-with-icon.normal-icon-color .ts-svg) {
        fill: var(--body-text-color);
    }
</style>