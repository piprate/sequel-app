import { on } from '../../_utils/eventBus'
import { updateFiltersForInstance } from '../../_actions/filters'
import { instanceFilters, now, unexpiredInstanceFilters } from '../local'
import { unexpiredInstanceFilterRegexes } from '../wordFilter'
import {
  rootTimelineItemSummaries,
  rootTimelineItemSummariesToAdd,
  timelineItemSummaries,
  timelineItemSummariesToAdd
} from '../timeline'
import { isEqual } from 'lodash-es'
import { computeFilterContextsForPostOrNotification } from '../../_utils/computeFilterContextsForPostOrNotification'
import { database } from '../../_database/database'
import { mark, stop } from '../../_utils/marks'
import { get } from 'svelte/store'
import { currentSparkId } from '../instance'
import { inNode } from '../../_utils/browserOrNode'

export function wordFilterObservers () {
  if (inNode()) {
    return
  }
  on('wordFiltersChanged', instanceName => {
    /* no await */
    updateFiltersForInstance(instanceName)
  })

  // compute `unexpiredInstanceFilters` based on `now` and `instanceFilters`. `now` updates every 10 seconds.
  function updateUnexpiredInstanceFiltersIfUnchanged (now, instanceFilters) {
    const _unexpiredInstanceFilters = Object.fromEntries(Object.entries(instanceFilters).map(([instanceName, filters]) => {
      const unexpiredFilters = filters.filter(filter => (
        !filter.expires_at || new Date(filter.expires_at).getTime() >= now
      ))
      return [instanceName, unexpiredFilters]
    }))

    // don't force an update/recalc if nothing changed
    if (!isEqual(unexpiredInstanceFilters.get(), _unexpiredInstanceFilters)) {
      console.log('updated unexpiredInstanceFilters', _unexpiredInstanceFilters)
      unexpiredInstanceFilters.set(_unexpiredInstanceFilters)
    }
  }

  now.subscribe(now => {
    updateUnexpiredInstanceFiltersIfUnchanged(now, instanceFilters.get())
  })

  instanceFilters.subscribe(_instanceFilters => {
    updateUnexpiredInstanceFiltersIfUnchanged(now.get(), _instanceFilters)
  })

  unexpiredInstanceFilterRegexes.subscribe(async _unexpiredInstanceFilterRegexes => {
    console.log('unexpiredInstanceFilterRegexes changed, recomputing filterContexts')
    mark('update timeline item summary filter contexts')
    // Whenever the filters change, we need to re-compute the filterContexts on the TimelineSummaries.
    // This is a bit of an odd design, but we do it for perf. See timelineItemToSummary.js for details.
    // let {
    //   timelineData_timelineItemSummaries: timelineItemSummaries,
    //   timelineData_timelineItemSummariesToAdd: timelineItemSummariesToAdd
    // } = store.get()

    const _timelineItemSummaries = get(timelineItemSummaries) || {}
    const _timelineItemSummariesToAdd = get(timelineItemSummariesToAdd) || {}
    const asSpark = get(currentSparkId)

    let somethingChanged = false

    await Promise.all(Object.entries(_unexpiredInstanceFilterRegexes).map(async ([instanceName, contextsToRegex]) => {
      const timelinesToSummaries = _timelineItemSummaries[instanceName] || {}
      const timelinesToSummariesToAdd = _timelineItemSummariesToAdd[instanceName] || {}
      const summariesToUpdate = [
        ...(Object.values(timelinesToSummaries).flat()),
        ...(Object.values(timelinesToSummariesToAdd).flat())
      ]
      console.log(`Attempting to update filters for ${summariesToUpdate.length} item summaries`)
      await Promise.all(summariesToUpdate.map(async summary => {
        try {
          const isNotification = summary.type
          const item = await (isNotification
            ? database.getNotification(instanceName, summary.id)
            : database.getPost(instanceName, summary.id, asSpark)
          )
          const newFilterContexts = computeFilterContextsForPostOrNotification(item, contextsToRegex)
          if (!isEqual(summary.filterContexts, newFilterContexts)) {
            somethingChanged = true
            summary.filterContexts = newFilterContexts
          }
        } catch (err) {
          console.error(err)
          // not stored in the database anymore, just ignore
        }
      }))
    }))

    // The previous was an async operation, so the timelinesItemSummaries or timelineItemSummariesToAdd
    // may have changed. But we need to make sure that the filterContexts are updated in the store
    // So just force an update here.
    if (somethingChanged) {
      console.log('Word filters changed, forcing an update')
      // eslint-disable-next-line camelcase
      const _rootTimelineItemSummaries = get(rootTimelineItemSummaries) || {}
      const _rootTimelineItemSummariesToAdd = get(rootTimelineItemSummariesToAdd) || {}
      rootTimelineItemSummaries.set(_rootTimelineItemSummaries)
      rootTimelineItemSummariesToAdd.set(_rootTimelineItemSummariesToAdd)
    }
    stop('update timeline item summary filter contexts')
  })
}
