<script>
  import SettingsNav from './SettingsNav.svelte'
  import FreeTextLayout from '../FreeTextLayout.svelte'
  import FocusRestoration from '../FocusRestoration.svelte'

  export let page
  export let label
</script>

<FocusRestoration realm={page}>
  <SettingsNav {page} {label} />

  <div class="settings">
    <FreeTextLayout>
      <div class="settings-header">
        <slot name="header" />
      </div>
      <slot />
      <div class="settings-footer">
        <slot name="footer" />
      </div>
    </FreeTextLayout>
  </div>
</FocusRestoration>

<style>
  .settings {
    margin: 20px;
  }

  :global(.settings .free-text h2) {
    margin: 20px 0 10px;
  }

  .settings-header {
    margin-bottom: 1.5rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .settings-footer {
    margin: 1.5rem 0 2rem;
  }

  @media (max-width: 767px) {
    .settings {
      margin: 20px 10px;
    }
  }
</style>
