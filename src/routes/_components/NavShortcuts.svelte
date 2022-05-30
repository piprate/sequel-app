<script>
  import Shortcut from './shortcut/Shortcut.svelte'
  import { goto } from '@sapper/app';
  import { importShowShortcutHelpDialog } from './dialog/asyncDialogs/importShowShortcutHelpDialog'
  import { importShowComposeDialog } from './dialog/asyncDialogs/importShowComposeDialog'
  import { leftRightChangesFocus } from '../_store/local'
  import { currentPage, navPages } from '../_store/navigation'
  import { normalizePageName } from '../_utils/normalizePageName'
  import { goToSearch } from '../_actions/goToSearch'
  import { onMount } from "svelte";

  async function showShortcutHelpDialog() {
    const showShortcutHelpDialog = await importShowShortcutHelpDialog()
    showShortcutHelpDialog();
  }

  async function showComposeDialog() {
    const showComposeDialog = await importShowComposeDialog()
    showComposeDialog();
  }

  function goLeftOrRight(left) {
    const _currentPage = normalizePageName($currentPage)
    const idx = $navPages.findIndex(_ => _.name === _currentPage)
    if (idx === -1) {
      return
    }
    if (left && idx > 0) {
      goto($navPages[idx - 1].href)
    } else if (!left && idx < $navPages.length - 1) {
      goto($navPages[idx + 1].href)
    }
  }

  onMount(() => {
    console.log('nav shortcuts')
  });
</script>

<Shortcut key="g t" on:pressed="{ () => goto('/federated') }"/>
<Shortcut key="g f" on:pressed="{ () => goto('/favorites') }"/>
<Shortcut key="g l" on:pressed="{ () => goto('/local') }"/>
<Shortcut key="g h" on:pressed="{ () => goto('/') }"/>
<Shortcut key="g n" on:pressed="{ () => goto('/notifications') }"/>
<Shortcut key="g c" on:pressed="{ () => goto('/community') }"/>
<Shortcut key="g d" on:pressed="{ () => goto('/direct') }"/>
<Shortcut key="s|/" on:pressed="{ () => goToSearch() }"/>
<Shortcut key="h|?" on:pressed="{ () => showShortcutHelpDialog() }"/>
<Shortcut key="c|7" on:pressed="{ () => showComposeDialog() }"/>
{#if !$leftRightChangesFocus}
  <Shortcut key="ArrowLeft" on:pressed="{ () => goLeftOrRight(true) }" />
  <Shortcut key="ArrowRight" on:pressed="{ () => goLeftOrRight(false) }" />
{/if}
{#each $navPages as navPage, i}
  <Shortcut key={(i + 1).toString()} on:pressed="{ () => goto(navPage.href) }" />
{/each}

