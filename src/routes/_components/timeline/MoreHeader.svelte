<script>
  import { formatIntl } from '../../_utils/formatIntl'

  export let count;
  export let onClick;

  function onClickForward(event) {
    if (onClick) {
      onClick(event)
    }
  }

  $: showMoreLabel = formatIntl('intl.showCountMore', { count })
</script>

<div class="more-items-header">
  <button class="primary" type="button" on:click="{onClickForward}">
    {showMoreLabel}
  </button>
</div>
<style>
  .more-items-header {
    display: flex;
    padding: 5px;
    align-items: center;
    justify-content:center;
  }
</style>
