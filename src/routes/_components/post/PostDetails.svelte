<script>
  import ExternalLink from '../ExternalLink.svelte'
  import SvgIcon from '../SvgIcon.svelte'
  import { disableTMMCounts, isMobileSize } from '../../_store/local'
  import { absoluteDateFormatter, shortAbsoluteDateFormatter } from '../../_utils/formatters'
  import { on } from '../../_utils/eventBus'
  import { formatIntl } from '../../_utils/formatIntl'
  import { onMount } from 'svelte'
  import { unwrap } from '../../_utils/mapper'

  export let post
  export let createdAtDate
  export let createdAtDateTS
  export let absoluteFormattedDate

  let overrideNumTMMs = undefined

  $: postId = post.id
  $: bubble = post.bubbleRef
  $: locationUrl = `/bubbles/${unwrap(bubble.id)}`
  $: bubbleName = (bubble && bubble.name) || ''
  $: locationAriaLabel = formatIntl('intl.postedIn', { bubble: bubbleName })
  $: application = post.application // FIXME
  $: applicationName = (application && application.name)
  $: applicationWebsite = (application && application.website)
  $: numTMM = (() => {
    if ($disableTMMCounts) {
      return 0
    }
    if (typeof overrideNumTMMs === 'number') {
      return overrideNumTMMs
    }
    return post.tmmCount || 0
  })()
  $: displayAbsoluteFormattedDate = (
          ($isMobileSize ? shortAbsoluteDateFormatter : absoluteDateFormatter)().format(createdAtDateTS)
  )
  $: tmmsLabel = (() => {
    if ($disableTMMCounts) {
      return 'intl.tmmCountsHidden'
    }
    return formatIntl('intl.tellMeMoredTimes', { count: numTMM })
  })()
  $: applicationLinkLabel = (
          formatIntl('intl.opensInNewWindow', { label: applicationName })
  )

  onMount(() => {
    return on('postUpdated', post => {
      overrideNumTMMs = post.tmmCount || 0
    })
  })
</script>

<div class="post-details">
  <time class="post-absolute-date" datetime={createdAtDate} title={absoluteFormattedDate}>
    {displayAbsoluteFormattedDate}
  </time>
  <a href={locationUrl} aria-label={locationAriaLabel} class="post-location">
    <SvgIcon className="location-svg" href="#fa-map-marker" />
    <span class="post-location post-location-span">{bubbleName}</span>
  </a>
  {#if applicationName}
    {#if applicationWebsite}
      <ExternalLink className="post-application"
                    href={applicationWebsite}
                    showIcon={false}
                    ariaLabel={applicationLinkLabel}>
        <span class="post-application-span">
          {applicationName}
        </span>
      </ExternalLink>
    {:else}
      <span class="post-application post-application-span">
        {applicationName}
      </span>
    {/if}
  {/if}
  <a class="post-tmms post-tmms"
     data-sveltekit-preload-data
     href="/posts/{unwrap(postId)}/tmm"
     aria-label={tmmsLabel}>
    <SvgIcon className="post-tmms-svg" href="#fa-fire" />
    <span>{numTMM}</span>
  </a>
</div>
<style>
  .post-details {
    grid-area: details;
    display: grid;
    grid-template-columns: minmax(0, max-content) repeat(3, max-content);
    grid-gap: 20px;
    align-items: center;
    justify-content: left;
    margin: 0 5px 10px;
  }

  .post-location {
    word-wrap: break-word;
    overflow: hidden;
    white-space: pre-wrap;
    font-size: 1.1em;
  }

  :global(.post-location .location-svg) {
    margin-left: 0px;
    margin-right: 4px;
    width: 14px;
    height: 14px;
    fill: var(--deemphasized-text-color);
  }

  :global(.post-location, a.post-location, a.post-location:hover) {
    color: var(--deemphasized-text-color);
  }

  :global(a.post-location) {
    display: inline-flex;
    align-items: center;
  }

  .post-location-span {
    word-wrap: break-word;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  :global(.post-absolute-date) {
    font-size: 1.1em;
    color: var(--deemphasized-text-color);
    min-width: 0;
    word-wrap: break-word;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  :global(.post-application) {
    word-wrap: break-word;
    overflow: hidden;
    white-space: pre-wrap;
    font-size: 1.1em;
  }

  :global(.post-application, a.post-application, a.post-application:hover) {
    color: var(--deemphasized-text-color);
  }

  :global(a.post-application) {
    display: inline-flex;
    align-items: center;
  }

  .post-application-span {
    word-wrap: break-word;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .post-tmms {
    font-size: 1.1em;
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .post-tmms span {
    margin-left: 5px;
  }

  .post-tmms,
  .post-tmms:hover,
  .post-tmms:visited {
    color: var(--deemphasized-text-color);
  }

  :global(.post-tmms-svg) {
    fill: var(--deemphasized-text-color);
    width: 18px;
    height: 18px;
  }

  :global(.post-absolute-date, .post-absolute-date:hover, .post-absolute-date:visited) {
    color: var(--deemphasized-text-color);
  }

  @media (max-width: 479px) {
    :global(.post-absolute-date) {
      font-size: 1em;
    }
    .post-tmms {
      font-size: 1em;
    }
    :global(.post-location) {
      font-size: 1em;
    }
    :global(.post-application) {
      font-size: 1em;
    }
    .post-details {
      grid-gap: 5px;
      justify-content: space-between;
    }

  }

</style>
