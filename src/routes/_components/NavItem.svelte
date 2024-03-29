<script>
  import NavItemIcon from './NavItemIcon.svelte'
  import { onMount } from 'svelte'
  import { get } from 'svelte/store'
  import { on, removeListener, emit } from '../_utils/eventBus'
  import { mark, stop } from '../_utils/marks'
  import { doubleRAF } from '../_utils/doubleRAF'
  import { scrollToTop } from '../_utils/scrollToTop'
  import { normalizePageName } from '../_utils/normalizePageName'
  import { reduceMotion } from '../_store/local'
  import { navPages } from '../_store/navigation'
  import {
    numberOfNotifications,
    hasNotifications,
    numberOfSubscriptionRequests,
    hasSubscriptionRequests
  } from '../_store/badge'
  import { currentPage } from '../_store/navigation'
  import { formatIntl } from '../_utils/formatIntl'

  export let segment
  export let name
  export let href
  export let svg
  export let label

  $: selected = name === normalizePageName(segment)

  $: ariaLabel = ((name, label, selected) => {
    const count =
      name === 'notifications' ? $numberOfNotifications : name === 'community' ? $numberOfSubscriptionRequests : 0
    return formatIntl('intl.navItemLabel', {
      label,
      selected,
      name,
      count
    })
  })(name, label, selected)

  $: showBadge = (name === 'notifications' && $hasNotifications) || (name === 'community' && $hasSubscriptionRequests)

  $: badgeNumber =
    (name === 'notifications' && $numberOfNotifications) || (name === 'community' && $numberOfSubscriptionRequests) || 0

  export function onClick(e) {
    if (!selected) {
      return
    }
    if (scrollToTop(/* smooth */ true, $reduceMotion)) {
      e.preventDefault()
      e.stopPropagation()
    }
  }

  let indicator

  function animatePart1({ toPage }) {
    mark('animateNavPart1 gBCR')
    const fromRect = indicator.getBoundingClientRect()
    stop('animateNavPart1 gBCR')
    emit('animateNavPart2', { fromRect, toPage })
  }

  function animatePart2({ fromRect }) {
    mark('animateNavPart2 gBCR')
    const toRect = indicator.getBoundingClientRect()
    stop('animateNavPart2 gBCR')
    const translateX = fromRect.left - toRect.left
    const scaleX = fromRect.width / toRect.width
    indicator.style.transform = `translateX(${translateX}px) scaleX(${scaleX})`
    const onTransitionEnd = () => {
      indicator.removeEventListener('transitionend', onTransitionEnd)
      indicator.classList.remove('animate')
    }
    indicator.addEventListener('transitionend', onTransitionEnd)
    doubleRAF(() => {
      indicator.classList.add('animate')
      indicator.style.transform = ''
    })
  }

  let previousPage = get(currentPage)

  function pageIsInNav(page) {
    let val = $navPages.find((_) => _.name === page)
    return val
  }

  currentPage.subscribe((page) => {
    page = normalizePageName(page)

    if (page && previousPage && previousPage === name && pageIsInNav(page) && pageIsInNav(previousPage)) {
      emit('animateNavPart1', {
        fromPage: previousPage,
        toPage: page
      })
    }
    previousPage = page
  })

  const onAnimate1 = ({ fromPage, toPage }) => {
    if (fromPage === name && !$reduceMotion) {
      animatePart1({ toPage })
    }
  }

  const onAnimate2 = ({ toPage, fromRect }) => {
    if (toPage === name && !$reduceMotion) {
      animatePart2({ fromRect })
    }
  }

  onMount(() => {
    on('animateNavPart1', onAnimate1)
    on('animateNavPart2', onAnimate2)

    return () => {
      removeListener('animateNavPart1', onAnimate1)
      removeListener('animateNavPart2', onAnimate2)
    }
  })
</script>

<a
  class="main-nav-link focus-fix {selected ? 'selected' : ''}"
  aria-label={ariaLabel}
  aria-current={selected}
  on:click={onClick}
  data-sveltekit-preload-data
  {href}
>
  <div class="nav-icon-and-label">
    <NavItemIcon {showBadge} {badgeNumber} {svg} />
    <span class="nav-link-label">{label}</span>
  </div>
  <div class="nav-indicator-wrapper">
    <div class="nav-indicator" bind:this={indicator} />
  </div>
</a>

<style>
  .main-nav-link {
    text-decoration: none;
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 1;
    flex-direction: column;
  }

  .nav-icon-and-label {
    padding: var(--nav-icon-pad-v) var(--nav-icon-pad-h);
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 1;
  }

  .main-nav-link.selected {
    background: var(--nav-a-selected-bg);
  }

  .main-nav-link.selected:hover {
    background: var(--nav-a-selected-bg-hover);
  }

  .nav-indicator-wrapper {
    width: 100%;
    height: var(--nav-indicator-height);
    background: var(--nav-a-border);
    display: flex;
  }

  .nav-indicator {
    flex: 1;
    background: var(--nav-a-border);
    transform-origin: left;
  }

  /*https://github.com/sveltejs/svelte/issues/1594*/
  :global(.nav-indicator.animate) {
    transition: transform 333ms ease-in-out;
    will-change: transform;
  }

  .main-nav-link:hover .nav-indicator {
    background: var(--nav-a-border-hover);
  }

  .main-nav-link.selected .nav-indicator-wrapper {
    background: var(--nav-a-border-hover);
  }

  .main-nav-link.selected .nav-indicator {
    background: var(--nav-indicator-bg);
  }

  .main-nav-link.selected:hover .nav-indicator {
    background: var(--nav-indicator-bg-hover);
  }

  .main-nav-link:hover {
    background-color: var(--nav-a-bg-hover);
    text-decoration: none;
  }

  .main-nav-link:hover .nav-link-label {
    color: var(--nav-text-color-hover);
  }

  .main-nav-link:active {
    background-color: var(--nav-active-bg);
  }

  .main-nav-link.selected:active {
    background-color: var(--nav-a-selected-active-bg);
  }

  .nav-link-label {
    font-size: var(--nav-font-size);
    line-height: var(--nav-icon-size);
    color: var(--nav-text-color);
    padding-left: 10px;
    white-space: nowrap;
    overflow: visible;
    text-overflow: ellipsis;
  }

  @media (max-width: 991px) {
    .main-nav-link .nav-link-label {
      /* Copied from the sr-only styles in global.scss
       * the reason we explicitly leave this <span> in is because Voice Control on iOS does not
       * understand aria-labels very well, but it understands hidden text just fine
       */
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      border: 0;
    }
  }
</style>
