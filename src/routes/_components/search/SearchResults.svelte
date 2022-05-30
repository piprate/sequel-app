<script>
  import { searchResults } from '../../_store/local'
  import AccountSearchResult from './AccountSearchResult.svelte'
  import HashtagSearchResult from './HashtagSearchResult.svelte'
  import StatusSearchResult from './StatusSearchResult.svelte'
</script>

<ul class="search-results">
  {#each $searchResults.hashtags as hashtag}
    <HashtagSearchResult {hashtag} />
  {/each}
  {#each $searchResults.accounts as account}
    <AccountSearchResult {account} />
  {/each}
  {#each $searchResults.statuses as status, index}
    <StatusSearchResult {status} {index} length={$searchResults.statuses.length}/>
  {/each}
</ul>
<style>
  .search-results {
    list-style: none;
    box-sizing: border-box;
    border: 1px solid var(--main-border);
    border-radius: 2px;
  }
</style>