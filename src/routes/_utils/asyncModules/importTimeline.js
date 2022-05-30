export const importTimeline = () => import(
  '../../_components/timeline/Timeline.svelte'
).then(mod => mod.default)
