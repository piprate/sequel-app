<script>
  import SearchResult from './SearchResult.svelte'

  export let hashtag
</script>

<SearchResult href="/tags/{hashtag.name.toLowerCase()}">
  {'#' + hashtag.name}
</SearchResult>

<style>
</style>
