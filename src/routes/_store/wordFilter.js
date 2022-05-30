import { createRegexFromFilters } from '../_utils/createRegexFromFilters'
import { WORD_FILTER_CONTEXTS } from '../_static/wordFilters'
import { derived } from "svelte/store";
import { unexpiredInstanceFilters } from "./local";

export const unexpiredInstanceFilterRegexes = derived(
  unexpiredInstanceFilters,
  $unexpiredInstanceFilters => {
    return Object.fromEntries(Object.entries($unexpiredInstanceFilters).map(([instanceName, filters]) => {
      const contextsToRegex = Object.fromEntries(WORD_FILTER_CONTEXTS.map(context => {
        const filtersForThisContext = filters.filter(_ => _.context.includes(context))
        if (!filtersForThisContext.length) {
          return undefined // don't bother even adding it to the map
        }
        const regex = createRegexFromFilters(filtersForThisContext)
        return [context, regex]
      }).filter(Boolean))
      return [instanceName, contextsToRegex]
    }))
  }
);