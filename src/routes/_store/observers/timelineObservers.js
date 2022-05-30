import { updateInstanceInfo } from '../../_actions/instances'
import { createStream } from '../../_actions/stream/streaming'
import { currentInstance, currentTimeline } from "../local";
import { get } from "svelte/store";
import { accessToken, currentInstanceInfo } from "../instance";
import { getFirstTimelineItemId } from "../timeline";

export function timelineObservers () {
  // stream to watch for local/federated/etc. updates. home and notification
  // updates are handled in timelineObservers.js
  let currentTimelineStream

  function shutdownPreviousStream () {
    if (currentTimelineStream) {
      currentTimelineStream.close()
      currentTimelineStream = null
      if (process.env.NODE_ENV !== 'production') {
        window.currentTimelineStream = null
      }
    }
  }

  function shouldObserveTimeline (timeline) {
    return timeline &&
      !(
        timeline !== 'local' &&
        timeline !== 'federated' &&
        timeline !== 'direct' &&
        !timeline.startsWith('list/') &&
        !timeline.startsWith('tag/')
      )
  }

  currentTimeline.subscribe(async (_currentTimeline) => {
    if (!process.browser) {
      return
    }

    shutdownPreviousStream()

    if (!shouldObserveTimeline(_currentTimeline)) {
      return
    }

    const _currentInstance = currentInstance.get();
    const _accessToken = get(accessToken);
    await updateInstanceInfo(_currentInstance)

    const currentTimelineIsUnchanged = () => {
      const newCurrentInstance = currentInstance.get();
      const newCurrentTimeline = currentTimeline.get();
      return newCurrentInstance === _currentInstance &&
        newCurrentTimeline === _currentTimeline
    }

    if (!currentTimelineIsUnchanged()) {
      return
    }

    const firstStatusId = getFirstTimelineItemId(_currentInstance, _currentTimeline)
    const _currentInstanceInfo = get(currentInstanceInfo);
    const streamingApi = _currentInstanceInfo.urls.streaming_api

    currentTimelineStream = createStream(streamingApi, _currentInstance, _accessToken,
      _currentTimeline, firstStatusId)

    if (process.env.NODE_ENV !== 'production') {
      window.currentTimelineStream = currentTimelineStream
    }
  })
}
