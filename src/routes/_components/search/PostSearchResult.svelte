<script>
  import SearchResult from './SearchResult.svelte'
  import Post from '../post/Post.svelte'
  import { unwrap } from '../../_utils/mapper'

  export let post
  export let index
  export let length
</script>

<SearchResult href="/posts/{unwrap(post.id)}">
  <Post {index} {length} timelineType="search" timelineValue="search" {post} />
</SearchResult>

<style>
</style>
