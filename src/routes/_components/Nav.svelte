<script>
  import NavItem from './NavItem.svelte'
  import { importNavShortcuts } from '../_utils/asyncModules/importNavShortcuts.js'
  import { navPages } from '../_store/navigation'
  import { onMount } from 'svelte'

  export let segment

  let navShortcuts = undefined

  onMount(async () => {
    navShortcuts = await importNavShortcuts()
  })
</script>

<nav id="main-nav" class="main-nav">
  <ul class="main-nav-ul">
    {#each $navPages as navPage (navPage.href)}
      <li class="main-nav-li">
        <NavItem {segment} name={navPage.name} href={navPage.href} svg={navPage.svg} label={navPage.label} />
      </li>
    {/each}
  </ul>
</nav>
{#if navShortcuts}
  <svelte:component this={navShortcuts} />
{/if}

<style>
  .main-nav {
    box-sizing: border-box;
    border-bottom: var(--nav-border-bottom) solid var(--nav-border);
    background: var(--nav-bg);
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    z-index: 100;
    contain: content; /* see https://www.w3.org/TR/2018/CR-css-contain-1-20181108/#valdef-contain-content */
  }

  .main-nav-ul {
    margin: 0;
    padding: 0;
    list-style: none;
    display: flex;
    align-items: stretch;
  }

  .main-nav-li {
    display: flex;
  }

  @media (max-width: 991px) {
    .main-nav-li {
      flex: 1;
    }
  }
</style>
