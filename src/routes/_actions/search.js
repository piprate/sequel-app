import { toast } from '../_components/toast/toast'
import { search } from '../_api/search'
import { formatIntl } from '../_utils/formatIntl'
import { currentInstance, queryInSearch, searchLoading, searchResults, searchResultsForQuery } from "../_store/local";
import { get } from "svelte/store";
import { accessToken } from "../_store/instance";

export async function doSearch() {
  const _currentInstance = currentInstance.get();
  const _accessToken = get(accessToken);
  const _queryInSearch = queryInSearch.get();
  searchLoading.set(true);
  try {
    const results = await search(_currentInstance, _accessToken, _queryInSearch);
    const newQueryInSearch = queryInSearch.get(); // avoid race conditions
    if (newQueryInSearch === _queryInSearch) {
      searchResultsForQuery.set(_queryInSearch);
      searchResults.set(results);
    }
  } catch (e) {
    /* no await */
    toast.say(formatIntl('intl.searchError', { error: (e.message || '') }))
    console.error(e)
  } finally {
    searchLoading.set(false);
  }
}
