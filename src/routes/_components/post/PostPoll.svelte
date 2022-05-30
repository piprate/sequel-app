<script>
  import SvgIcon from '../SvgIcon.svelte'
  import { autoplayGifs, isMobileSize, now, polls } from '../../_store/local'
  import { formatTimeagoDate, formatTimeagoFutureDate } from '../../_intl/formatTimeagoDate'
  import { absoluteDateFormatter } from '../../_utils/formatters'
  import { registerClickDelegate } from '../../_utils/delegate'
  import { classname } from '../../_utils/classname'
  import { getPoll, voteOnPoll } from '../../_actions/polls'
  import escapeHtml from 'escape-html'
  import { emojifyText } from '../../_utils/emojifyText'
  import { formatIntl } from '../../_utils/formatIntl'
  import { onMount } from 'svelte'

  const REFRESH_MIN_DELAY = 1000

  export let notification
  export let uuid
  export let isPostInNotification
  export let isPostInOwnThread
  export let post
  export let postEmojis
  export let shown

  async function doAsyncActionWithDelay (func) {
    const start = Date.now()
    const res = await func()
    const timeElapsed = Date.now() - start
    if (timeElapsed < REFRESH_MIN_DELAY) {
      // If less than five seconds, then continue to show the loading animation
      // so it's clear that something happened.
      await new Promise(resolve => setTimeout(resolve, REFRESH_MIN_DELAY - timeElapsed))
    }
    return res
  }

  function getChoices (form, options) {
    const res = []
    for (let i = 0; i < options.length; i++) {
      if (form.elements[i].checked) {
        res.push(i)
      }
    }
    return res
  }

  let loading = false
  let choices = []

  $: pollId = post.poll.id
  $: poll = $polls[pollId] || post.poll
  $: options = (
          poll.options.map(({ title, votes_count: votesCount }) => ({
            title: emojifyText(escapeHtml(title), postEmojis, $autoplayGifs),
            share: poll.votes_count ? Math.round(votesCount / poll.votes_count * 100) : 0
          }))
  )
  $: votesCount = poll.votes_count
  $: voted = poll.voted
  $: multiple = poll.multiple
  $: expired = poll.expired
  $: expiresAt = poll.expires_at
  $: expiresAtTS = new Date(expiresAt).getTime()
  $: expiresAtTimeagoFormatted = (
          expired ? formatTimeagoDate(expiresAtTS, $now) : formatTimeagoFutureDate(expiresAtTS, $now)
  )
  $: expiresAtAbsoluteFormatted = absoluteDateFormatter().format(expiresAtTS)
  $: expiryText = expired ? 'intl.expired' : 'intl.expires'
  $: refreshElementId = `poll-refresh-${uuid}`
  $: useNarrowSize = (
          !isPostInOwnThread && $isMobileSize && !expired
  )
  $: formDisabled = !choices.length
  $: votesText = (
          formatIntl('intl.voteCount', { count: votesCount })
  )
  $: computedClass = (
          classname(
                  'poll',
                  isPostInNotification && 'post-in-notification',
                  isPostInOwnThread && 'post-in-own-thread',
                  loading && 'poll-loading',
                  shown && 'shown'
          )
  )

  function onRefreshClick () {
    (async () => {
      loading = true
      try {
        const poll = await doAsyncActionWithDelay(() => getPoll(pollId))
        if (poll) {
          $polls[pollId] = poll
        }
      } finally {
        loading = false
      }
    })()
    return true
  }

  let form

  async function onSubmit (e) {
    e.preventDefault()
    e.stopPropagation()
    if (formDisabled) {
      return
    }
    const choices = getChoices(form, options)
    loading = true
    try {
      const poll = await doAsyncActionWithDelay(() => voteOnPoll(pollId, choices))
      if (poll) {
        $polls[pollId] = poll
      }
    } finally {
      loading = false
    }
  }

  function onChange () {
    choices = getChoices(form, options)
  }

  function cleanTitle (title) {
    // Remove newlines and tabs.
    // Mastodon UI doesn't care because in CSS it's formatted to be single-line, but we care
    // if people somehow insert newlines, because it can really mess up the formatting.
    return (title && title.replace(/[\n\t]+/g, ' ')) || ''
  }

  onMount(() => {
    return registerClickDelegate(refreshElementId, onRefreshClick)
  })
</script>

<div class={computedClass} aria-busy={loading} >
  {#if voted || expired }
    <ul class="poll-choices" aria-label="{intl.pollResults}">
      {#each options as option}
        <li class="poll-choice option">
          <div class="option-text">
            <strong>{option.share}%</strong> <span>{@html cleanTitle(option.title)}</span>
          </div>
          <svg aria-hidden="true">
            <line x1="0" y1="0" x2="{option.share}%" y2="0" />
          </svg>
        </li>
      {/each}
    </ul>
  {:else}
    <form class="poll-form" aria-label="{intl.voteOnPoll}" on:submit="{onSubmit}" bind:this={form}>
      <ul class="poll-choices" aria-label="{intl.pollChoices}">
        {#each options as option, i}
          <li class="poll-choice poll-form-option">
            <label>
              <input type="{multiple ? 'checkbox' : 'radio'}"
                     name="poll-choice-{uuid}"
                     value="{i}"
                     on:change="{onChange}"
              >
              <span>{@html cleanTitle(option.title)}</span>
            </label>
          </li>
        {/each}
      </ul>
      <button disabled={formDisabled} type="submit">{intl.vote}</button>
    </form>
  {/if}
  <ul class="poll-details" aria-label="{intl.pollDetails}">
    <li class="poll-stat {notification ? 'is-notification' : ''}">
      <SvgIcon className="poll-icon" href="#fa-bar-chart" />
      <span class="poll-stat-text">{votesText}</span>
    </li>
    <li class="poll-stat {notification ? 'is-notification' : ''}">
      <SvgIcon className="poll-icon" href="#fa-clock" />
      <span class="poll-stat-text poll-stat-expiry">
        <span class="{useNarrowSize ? 'sr-only' : ''}">{expiryText}</span>
        <time datetime={expiresAt} title={expiresAtAbsoluteFormatted}>
          {expiresAtTimeagoFormatted}
        </time>
      </span>
    </li>
    <li class="poll-stat {notification ? 'is-notification' : ''} {expired ? 'poll-expired' : ''}">
      <button id={refreshElementId}
              class="focus-fix"
              aria-label="{intl.refresh}">
        <SvgIcon className="poll-icon" href="#fa-refresh" />
        <span class="poll-stat-text poll-stat-text-refresh" aria-hidden="true">
          {intl.refresh}
        </span>
      </button>
    </li>
  </ul>
</div>
<style>
  .poll {
    grid-area: poll;
    margin: 10px 10px 10px 5px;
    padding: 20px;
    border: 1px solid var(--main-border);
    border-radius: 2px;
    transition: opacity 0.2s linear;
    display: none;
  }

  .poll.shown {
    display: block;
  }

  .poll.post-in-own-thread {
    padding: 20px;
  }

  .poll.poll-loading {
    opacity: 0.5;
    pointer-events: none;
  }

  ul.poll-choices {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  li.poll-choice {
    margin: 10px 0;
    padding: 0;
  }

  li.poll-choice:first-child {
    margin-top: 0;
  }

  .option {
    margin: 0 0 10px 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    stroke: var(--svg-fill);
    stroke-width: 10px;
  }

  .option-text {
    word-wrap: break-word;
    white-space: pre-wrap;
    font-size: 1.1em;
  }

  svg {
    height: 10px;
    width: 100%;
    margin-top: 5px;
  }

  .post-in-notification .option-text {
    color: var(--very-deemphasized-text-color);
  }

  .post-in-notification svg {
    opacity: 0.5;
  }

  .post-in-own-thread .option-text {
    font-size: 1.2em;
  }

  ul.poll-details {
    display: grid;
    grid-template-columns: max-content minmax(0, max-content) max-content;
    grid-gap: 20px;
    align-items: center;
    justify-content: left;
    margin: 10px 0 0 0;
    padding: 0;
    list-style: none;
    overflow-x: hidden;
  }

  .poll-stat button {
    /* reset button styles */
    background: none;
    box-shadow: none;
    border: none;
    border-spacing: 0;
    margin: 0;
    padding: 0;
    font-size: inherit;
    font-weight: normal;
    text-align: left;
    text-decoration: none;
    text-indent: 0;
    display: flex;
    align-items: center;
  }

  .poll-stat button:hover {
    text-decoration: underline;
  }

  li.poll-stat {
    display: flex;
    flex-direction: row;
    align-items: center;
    color: var(--deemphasized-text-color);
    padding: 0;
    margin: 0;
  }

  .poll-stat.is-notification, .poll-stat.is-notification .poll-stat-text {
    color: var(--very-deemphasized-text-color);
  }

  :global(.poll-stat.is-notification .poll-icon) {
    fill: var(--very-deemphasized-text-color);
  }

  .poll-stat.poll-expired {
    display: none;
  }

  .poll-stat-text {
    margin-left: 5px;
    color: var(--deemphasized-text-color);
  }

  .poll-stat-expiry {
    word-wrap: break-word;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  :global(.poll-icon) {
    fill: var(--deemphasized-text-color);
    width: 18px;
    height: 18px;
    min-width: 18px;
  }

  .poll-form-option {
    padding-bottom: 10px;
  }

  .poll-form label span {
    text-overflow: ellipsis;
    overflow: hidden;
    word-break: break-word;
    white-space: pre-wrap;
    padding-left: 5px;
  }

  @media (max-width: 479px) {
    .poll {
      padding: 10px 5px;
    }
    .poll.post-in-own-thread {
      padding: 10px;
    }
    ul.poll-details {
      grid-gap: 5px;
      justify-content: space-between;
    }
  }

  @media (max-width: 320px) {
    .poll-stat-text-refresh {
      display: none; /* takes up too much space on small devices */
    }
    ul.poll-details {
      grid-gap: 2px;
    }
    .poll-stat-text {
      margin-left: 2px;
    }
    li.poll-choice {
      margin: 5px 0;
    }
  }
</style>
