<script>
  import {
    focusSearchInput,
    searchLoading,
    searchResults,
    searchResultsForQuery,
    queryInSearch
  } from '../../_store/local'
  import LoadingPage from '../LoadingPage.svelte'
  import { doSearch } from '../../_actions/search'
  import SearchResults from './SearchResults.svelte'
  import SvgIcon from '../SvgIcon.svelte'
  import { on } from '../../_utils/eventBus'
  import { tryToFocusElement } from '../../_utils/tryToFocusElement'
  import { onMount } from 'svelte'

  function onSubmit(e) {
    e.preventDefault()
    e.stopPropagation()
    /* no await */
    doSearch()
  }

  function doFocusSearchInput() {
    tryToFocusElement('the-search-input')
  }

  onMount(() => {
    on('focusSearchInput', () => doFocusSearchInput()) // user typed hotkey on this page itself
    if ($focusSearchInput) {
      // we arrived here from a goto via the search hotkey
      $focusSearchInput = false // reset
      doFocusSearchInput()
    }
  })
</script>

<form class="search-input-form" on:submit={onSubmit}>
  <label class="sr-only" for="the-search-input">{intl.search}</label>
  <div class="search-input-wrapper">
    <input
      id="the-search-input"
      type="search"
      class="search-input"
      placeholder={intl.search}
      required
      bind:value={$queryInSearch}
    />
  </div>
  <button type="submit" class="primary search-button" aria-label={intl.search} disabled={$searchLoading}>
    <SvgIcon className="search-button-svg" href="#fa-search" />
  </button>
</form>
{#if $searchLoading}
  <div class="search-results-container">
    <LoadingPage />
  </div>
{:else if $searchResults && $searchResultsForQuery === $queryInSearch}
  <div class="search-results-container">
    <SearchResults />
  </div>
{/if}

<style>
  .search-input-form {
    display: grid;
    grid-template-columns: 1fr min-content;
    grid-gap: 10px;
  }
  .search-input-wrapper {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .search-input {
    padding: 10px 15px;
    border-radius: 10px;
    flex: 1;
    width: 0;
    min-width: 0;
  }
  :global(.search-button-svg) {
    fill: var(--button-primary-text);
    width: 18px;
    height: 18px;
    flex: 1;
  }
  .search-results-container {
    position: relative;
    margin-top: 20px;
  }
  @media (min-width: 768px) {
    .search-button {
      min-width: 100px;
    }
  }
</style>
