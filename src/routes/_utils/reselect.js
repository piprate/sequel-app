// Avoid re-renders by caching the most recent value of an array
// or an object, using an approach similar to https://github.com/reactjs/reselect.
// This avoids the issue where Svelte may keep re-rendering because it doesn't
// know if an object/array has changed or not.

import isEqual from 'lodash-es/isEqual'
import { derived } from "svelte/store";

if (process.browser && process.env.NODE_ENV !== 'production') {
  window.reselectStats = {}
}

export function reselect(rawValue, reselectKey) {
  let prevValue;
  let nextValue;
  let count = 0;

  let reselectCount = derived(
    rawValue,
    $rawValue => {
      if (process.browser && process.env.NODE_ENV !== 'production') {
        window.reselectStats[reselectKey] = window.reselectStats[reselectKey] || { numInputChanges: 0, numOutputChanges: 0 }
        window.reselectStats[reselectKey].numInputChanges++
      }
      if (!isEqual(prevValue, $rawValue)) {
        nextValue = $rawValue
        count++
      }
      return count
    }
  );

  return derived(
    reselectCount,
    $reselectCount => {
      if (process.browser && process.env.NODE_ENV !== 'production') {
        window.reselectStats[reselectKey].numOutputChanges++
      }
      prevValue = nextValue
      nextValue = null
      return prevValue
    }
  )
}
