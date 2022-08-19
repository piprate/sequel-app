<script>
  import SvgIcon from './SvgIcon.svelte';
  import NavAvatar from './NavAvatar.svelte';
  import { currentSpark } from "../_store/instance";

  export let svg;

  export let showBadge = false;
  export let badgeNumber = 0;

  $: badgeDigits = Math.min(3, badgeNumber.toString().length);
  $: badgeNumberToShow = (badgeNumber < 100 ? badgeNumber.toString() : '99+');
  $: showSparkAvatar = svg === '#sequel-logo' && $currentSpark;
</script>

{#if showBadge}
  <div class="nav-link-svg-wrapper">
    <SvgIcon className="nav-link-svg" href={svg} />
    <span class="nav-link-badge nav-link-badge-digits-{badgeDigits}" aria-hidden="true">
      {badgeNumberToShow}
    </span>
  </div>
{:else}
  {#if showSparkAvatar}
    <NavAvatar entity={$currentSpark} size="navigation" flatMode="true" />
  {:else}
    <SvgIcon className="nav-link-svg" href={svg} />
  {/if}
{/if}
<style>
  .nav-link-svg-wrapper {
    position: relative;
    display: inline-block;
  }

  :global(.nav-link-svg-wrapper, .nav-link-svg) {
    width: var(--nav-icon-size);
    height: var(--nav-icon-size);
  }

  .nav-link-badge {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    transform: translate(10px, 7px);
    z-index: 10;
    border: 1px solid var(--nav-bg);
    background: var(--nav-svg-fill);
    color: var(--nav-bg);
    border-radius: 100%;
    font-size: 0.8em;
    margin: 0 0 3px;
    font-weight: 600;
  }

  .nav-link-badge-digits-2 {
    font-size: 0.7em;
  }

  .nav-link-badge-digits-3 {
    font-size: 0.6em;
  }

  :global(.nav-link-svg) {
    display: inline-block;
    fill: var(--nav-svg-fill);
  }

  :global(.main-nav-link:hover .nav-link-svg) {
    fill: var(--nav-svg-fill-hover);
  }

  @media (max-width: 991px) {
    .nav-link-badge {
      transform: translate(15px, 7px);
      margin: 2px 1px 4px;
    }
  }
</style>
