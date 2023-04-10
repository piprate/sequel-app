<script>
    import { formatIntl } from "../../_utils/formatIntl";

    export let uuid
    export let createdAtDate
    export let absoluteFormattedDate

    $: elementId = `post-date-time-${uuid}`
    $: createdAtLabel = (formatIntl('intl.clickToShowThread', { time: absoluteFormattedDate }))
</script>

<div id={elementId} class="post-date-time">
  <time datetime={createdAtDate} title={absoluteFormattedDate} aria-label={createdAtLabel}>
    {absoluteFormattedDate}
  </time>
</div>

<style>
    .post-date-time {
        margin-left: 4px;
        margin-bottom: 4px;
    }

    .post-date-time time {
      color: var(--deemphasized-text-color);
      font-size: 0.875rem;
    }
</style>