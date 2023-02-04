import { currentInstance } from '../_store/local'
import { accessToken } from '../_store/instance'
import {
  rootAutosuggestSearchResults,
  rootAutosuggestSelected,
  rootAutosuggestType,
  setForCurrentAutosuggest
} from '../_store/autosuggest'
import { search } from '../_api/search'
import { SEARCH_RESULTS_LIMIT } from '../_static/autosuggest'
import { concat } from '../_utils/arrays'
import uniqBy from 'lodash-es/uniqBy'
import { scheduleIdleTask } from '../_utils/scheduleIdleTask'
import { RequestThrottler } from '../_utils/RequestThrottler'
import { get } from 'svelte/store'
import { dbPromise, getDatabase } from '../_database/databaseLifecycle'
import { ENTITY_STORE, NAME_LOWERCASE } from '../_database/constants'
import { createNamePrefixKeyRange } from '../_database/keys'
import { populateEntityMediaURLs } from '../_api/media'

const DATABASE_SEARCH_RESULTS_LIMIT = 30

function sortByName (a, b) {
  const nameA = a.name?.toLowerCase()
  const nameB = b.name?.toLowerCase()

  return nameA < nameB ? -1 : nameA === nameB ? 0 : 1
}

function sortById (a) {
  return a.id
}

export async function searchEntitiesByName (instanceName, namePrefix, limit) {
  limit = limit || 20
  const db = await getDatabase(instanceName)
  return dbPromise(db, ENTITY_STORE, 'readonly', (store, callback) => {
    const keyRange = createNamePrefixKeyRange(namePrefix.toLowerCase())
    store.index(NAME_LOWERCASE).getAll(keyRange, limit).onsuccess = e => {
      callback(e.target.result)
    }
  })
}

export function doEntitySearch (searchText) {
  let canceled = false
  let localResults
  let remoteResults
  const _currentInstance = currentInstance.get()
  const _accessToken = get(accessToken)
  const requestThrottler = new RequestThrottler(doSearchEntitiesRemotely)

  async function searchEntitiesLocally () {
    localResults = await searchEntitiesByName(
      _currentInstance, searchText.substring(1), DATABASE_SEARCH_RESULTS_LIMIT)
  }

  async function searchEntitiesRemotely () {
    remoteResults = await requestThrottler.request()
  }

  async function doSearchEntitiesRemotely (signal) {
    const results = (await search(
      _currentInstance, _accessToken, searchText, false, SEARCH_RESULTS_LIMIT, false, signal
    ))

    delete results.posts

    results.sparks?.forEach((entity) => populateEntityMediaURLs(entity, _currentInstance, 'spark'))
    results.bubbles?.forEach((entity) => populateEntityMediaURLs(entity, _currentInstance, 'bubble'))
    results.worlds?.forEach((entity) => populateEntityMediaURLs(entity, _currentInstance, 'world'))

    return Object.values(results).flat().filter(Boolean)
  }

  function mergeAndTruncateResults () {
    // Always include local results; they are more likely to be relevant
    // because the user has seen their content before. Otherwise, sort by username.
    let results = (localResults || [])
      .slice()
      .sort(sortByName)
      .slice(0, SEARCH_RESULTS_LIMIT)

    if (results.length < SEARCH_RESULTS_LIMIT) {
      const topRemoteResults = (remoteResults || [])
        .sort(sortByName)
        .slice(0, SEARCH_RESULTS_LIMIT - results.length)
      results = concat(results, topRemoteResults)
      results = uniqBy(results, sortById)
    }

    return results
  }

  function onNewResults () {
    if (canceled) {
      return
    }
    const results = mergeAndTruncateResults()
    setForCurrentAutosuggest(rootAutosuggestType, 'spark')
    setForCurrentAutosuggest(rootAutosuggestSelected, 0)
    setForCurrentAutosuggest(rootAutosuggestSearchResults, results)
  }

  function onError (err) {
    console.warn('ignored autosuggest error', err)
  }

  scheduleIdleTask(() => {
    if (canceled) {
      return
    }
    // run the two searches in parallel
    searchEntitiesLocally().then(onNewResults).catch(onError)
    searchEntitiesRemotely().then(onNewResults).catch(onError)
  })

  return {
    cancel: () => {
      canceled = true
      requestThrottler.cancel()
    }
  }
}
