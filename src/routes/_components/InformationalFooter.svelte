<script>
  import HiddenFromSSR from './HiddenFromSSR.svelte'
</script>

<HiddenFromSSR>
  <footer>
    {@html intl.footer}
  </footer>
</HiddenFromSSR>

