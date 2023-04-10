<script>
  import { mark, stop } from '../../_utils/marks'
  import { autoplayGifs, currentTimeline } from '../../_store/local'
  import { classname } from '../../_utils/classname'
  import { massageUserText } from '../../_utils/massageUserText'
  import { urlIsCrossOrigin } from '../../_utils/urlIsCrossOrigin'
  import { onMount } from 'svelte'
  import { isTimelineInReaderMode } from '../../_actions/timeline';

  export let post
  export let uuid
  export let isPostInOwnThread = false
  export let isPostInNotification = false
  export let postEmojis
  export let shown

  let node

  $: computedClass = (() => {
    return classname(
      'post-content',
      isPostInOwnThread && 'post-in-own-thread',
      isPostInNotification && 'post-in-notification',
      shown && 'shown',
      isTimelineInReaderMode($currentTimeline) && 'reader-mode'
    )
  })()

  $: content = (post.bodyHTML || '')
  $: massagedContent = (
    massageUserText(content, postEmojis, $autoplayGifs)
  )

  function hydrateContent () {
    mark('hydrateContent')
    const { mentions, tags } = post
    let count = 0
    const anchors = Array.from(node.getElementsByTagName('A'))

    for (const anchor of anchors) {
      // hydrate hashtag
      if (tags && anchor.classList.contains('hashtag')) {
        for (const tag of tags) {
          if (anchor.getAttribute('href').toLowerCase().endsWith(`/${tag.name.toLowerCase()}`)) {
            anchor.setAttribute('href', `/tags/${tag.name}`)
            anchor.setAttribute('id', `post-content-link-${uuid}-${++count}`)
            anchor.removeAttribute('target')
            anchor.removeAttribute('rel')
          }
        }
        // hydrate mention
      } else if (mentions && anchor.classList.contains('mention')) {
        for (const mention of mentions) {
          if (anchor.getAttribute('href') === mention.url) {
            anchor.setAttribute('href', `/sparks/${mention.id}`)
            anchor.setAttribute('title', `@${mention.acct}`)
            anchor.setAttribute('id', `post-content-link-${uuid}-${++count}`)
            anchor.removeAttribute('target')
            anchor.removeAttribute('rel')
          }
        }
      }
      // hydrate external links
      const href = anchor.getAttribute('href')
      if (urlIsCrossOrigin(href)) {
        anchor.setAttribute('title', href)
        anchor.setAttribute('target', '_blank')
        anchor.setAttribute('rel', 'nofollow noopener')
      }
    }
    stop('hydrateContent')
  }

  onMount(() => {
    hydrateContent()
  })
</script>

<div class={computedClass} bind:this={node}>
    {@html massagedContent}
</div>
<style>
  .post-content {
    margin: 10px 10px 10px 5px;
    grid-area: content;
    word-wrap: break-word;
    overflow: hidden;
    white-space: pre-wrap;
    font-size: 0.9em;
    display: none;
  }
  
  .post-content.reader-mode {
    margin: 4px 10px 4px 5px;
  }

  .post-content.post-in-own-thread {
    font-size: 1.3em;
    margin: 20px 10px 20px 5px;
  }

  .post-content.shown {
    display: block;
  }

  :global(.post-content li) {
    font-size: 1.3em;
  }

  :global(
      .post-content p,
      .post-content blockquote,
      .post-content ul,
      .post-content ol) {
    margin: 0 0 10px;
  }

  :global(
      .post-content ul,
      .post-content ol) {
      white-space: normal;
  }

  :global(
      .post-content p:first-child,
      .post-content blockquote:first-child,
      .post-content ul:first-child,
      .post-content ol:first-child) {
    margin: 0 0 10px;
  }

  :global(
      .post-content p:last-child,
      .post-content blockquote:last-child,
      .post-content ul:last-child,
      .post-content ol:last-child) {
    margin: 0;
  }

  :global(.post-content blockquote) {
    padding-left: 1.5rem;
    border-left: 5px solid var(--body-bg);
    color: var(--very-deemphasized-text-color);
    font-style: italic;
  }

  :global(.post-content ul, .post-content ol) {
    padding-left: 2rem;
  }

  .post-content.post-in-notification {
    color: var(--very-deemphasized-text-color);
  }
  :global(.post-content.post-in-notification a, .post-content.post-in-notification a:hover) {
    color: var(--very-deemphasized-link-color);
  }

  :global(.post-content .invisible) {
    /* copied from Mastodon */
    font-size: 0;
    line-height: 0;
    display: inline-block;
    width: 0;
    height: 0;
    position: absolute;
  }

  :global(.underline-links .post-content a) {
    text-decoration: underline;
  }

  @media (max-width: 240px) {
    :global(
      .post-content p:last-child,
      .post-content blockquote:last-child,
      .post-content ul:last-child,
      .post-content ol:last-child) {
      margin: 0 0 5px; /* looks better on KaiOS with some spacing here */
    }
  }

</style>
