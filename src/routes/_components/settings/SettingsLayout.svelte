<script>
  import SettingsNav from './SettingsNav.svelte'
  import FreeTextLayout from '../FreeTextLayout.svelte'
  import FocusRestoration from '../FocusRestoration.svelte'

  export let page;
  export let label;
</script>

<FocusRestoration realm={page}>
  <SettingsNav {page} {label}/>

  <div class="settings">
    <FreeTextLayout>
      <slot></slot>
    </FreeTextLayout>
  </div>
</FocusRestoration>
<style>
  .settings {
    margin: 20px;
  }
  :global(.settings .free-text h1) {
    margin-bottom: 30px;
  }
  :global(.settings .free-text h2) {
    margin: 20px 0 10px;
  }
  @media (max-width: 767px) {
    .settings {
      margin: 20px 10px;
    }
  }
</style>
