<script>
  import { searchResults } from '../../_store/local'
  import SparkSearchResult from './SparkSearchResult.svelte'
  import HashtagSearchResult from './HashtagSearchResult.svelte'
  import PostSearchResult from './PostSearchResult.svelte'
  import BubbleSearchResult from './BubbleSearchResult.svelte';
  import WorldSearchResult from './WorldSearchResult.svelte';
</script>

<ul class="search-results">
  {#each $searchResults.hashtags as hashtag}
    <HashtagSearchResult {hashtag} />
  {/each}
  {#each $searchResults.sparks as spark}
    <SparkSearchResult {spark} />
  {/each}
  {#each $searchResults.bubbles as bubble}
    <BubbleSearchResult {bubble} />
  {/each}
  {#each $searchResults.worlds as world}
    <WorldSearchResult {world} />
  {/each}
  {#each $searchResults.posts as post, index}
    <PostSearchResult {post} {index} length={$searchResults.posts.length}/>
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