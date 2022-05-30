import {
  instanceFilters,
  loggedInInstances
} from '../_store/local'
import { createFilter, getFilters, updateFilter, deleteFilter as doDeleteFilter } from '../_api/filters'
import { cacheFirstUpdateAfter, cacheFirstUpdateOnlyIfNotInCache } from '../_utils/sync'
import { database } from '../_database/database'
import isEqual from 'lodash-es/isEqual'
import { toast } from '../_components/toast/toast'
import { formatIntl } from '../_utils/formatIntl'
import { emit } from '../_utils/eventBus'

async function syncFilters (instanceName, syncMethod) {
  const accessToken = loggedInInstances.get()[instanceName].access_token

  await syncMethod(
    () => getFilters(instanceName, accessToken),
    () => database.getFilters(instanceName),
    filters => database.setFilters(instanceName, filters),
    filters => {
      const instanceFiltersVal = instanceFilters.get();
      if (!isEqual(instanceFiltersVal[instanceName], filters)) { // avoid re-render if nothing changed
        instanceFiltersVal[instanceName] = filters
        instanceFilters.set(instanceFiltersVal)
      }
    }
  )
}

export async function updateFiltersForInstance (instanceName) {
  await syncFilters(instanceName, cacheFirstUpdateAfter)
}

export async function setupFiltersForInstance (instanceName) {
  await syncFilters(instanceName, cacheFirstUpdateOnlyIfNotInCache)
}

export async function createOrUpdateFilter (instanceName, filter) {
  const accessToken = loggedInInstances.get()[instanceName].access_token
  try {
    if (filter.id) {
      await updateFilter(instanceName, accessToken, filter)
      /* no await */ toast.say('intl.updatedFilter')
    } else {
      await createFilter(instanceName, accessToken, filter)
      /* no await */ toast.say('intl.createdFilter')
    }
    emit('wordFiltersChanged', instanceName)
  } catch (err) {
    /* no await */ toast.say(formatIntl('intl.failedToModifyFilter', err.message || ''))
  }
}

export async function deleteFilter (instanceName, id) {
  const accessToken = loggedInInstances.get()[instanceName].access_token
  try {
    await doDeleteFilter(instanceName, accessToken, id)
    /* no await */ toast.say('intl.deletedFilter')
    emit('wordFiltersChanged', instanceName)
  } catch (err) {
    /* no await */ toast.say(formatIntl('intl.failedToModifyFilter', err.message || ''))
  }
}
