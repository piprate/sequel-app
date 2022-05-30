<script>
  import SearchResult from './SearchResult.svelte'
  import Status from '../status/Status.svelte'

  export let status;
  export let index;
  export let length;

</script>

<SearchResult href="/statuses/{status.id}">
  <Status {index} {length}
          timelineType="search" timelineValue="search"
          {status} />
</SearchResult>
<style>
</style>
