<script>
  import { formatIntl } from '../../_utils/formatIntl'
  import { disableTapOnPost } from '../../_store/local'
  import { unwrap } from '../../_utils/mapper'

  export let uuid
  export let isPostInNotification
  export let postId
  export let createdAtDate
  export let shortInlineFormattedDate
  export let absoluteFormattedDate

  $: elementId = `post-relative-date-${uuid}`
  $: tabindex = (
          // If you can't tap on the entire post, then you need some way to click on it. Otherwise it's
          // just a duplicate link in the focus order.
          $disableTapOnPost ? '0' : '-1'
  )
  $: createdAtLabel = (
          formatIntl('intl.clickToShowThread', { time: shortInlineFormattedDate })
  )
</script>

<a id={elementId}
   class="post-relative-date {isPostInNotification ? 'post-in-notification' : '' }"
   href="/posts/{unwrap(postId)}"
   sapper:prefetch
   {tabindex}
>
  <time datetime={createdAtDate} title={absoluteFormattedDate}
        aria-label={createdAtLabel}>
    {shortInlineFormattedDate}
  </time>
</a>
<style>
  .post-relative-date {
    grid-area: relative-date;
    align-self: center;
    margin-left: 5px;
    margin-right: 10px;
    font-size: 1.1em;
    text-align: right;
    white-space: nowrap;
  }
  .post-relative-date, .post-relative-date:hover, .post-relative-date:visited {
    color: var(--deemphasized-text-color);
  }

  .post-relative-date.post-in-notification,
  .post-relative-date.post-in-notification:hover,
  .post-relative-date.post-in-notification:visited {
    color: var(--very-deemphasized-text-color);
  }

</style>
