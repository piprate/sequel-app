import { createStream } from '../../_actions/stream/streaming'
import { currentInstance, currentInstanceStream, currentTimeline } from '../local'
import { get } from 'svelte/store'
import { accessToken, currentSpark, currentSparkId } from '../instance'
import { getFirstTimelineItemId } from '../timeline'
import { inBrowser, inNode } from '../../_utils/browserOrNode'

export function timelineObservers () {
  function shouldObserveTimeline (timeline) {
    return timeline &&
      (
        timeline.startsWith('world/') ||
        timeline.startsWith('spark/') ||
        timeline.startsWith('bubble/') ||
        timeline.startsWith('post/') ||
        timeline.startsWith('tag/')
      )
  }

  currentTimeline.subscribe(async (_currentTimeline) => {
    if (inNode()) {
      return
    }

    if (_currentTimeline && !shouldObserveTimeline(_currentTimeline)) {
      // unsubscribe if needed
      return
    }

    if (get(accessToken) === '') {
      // not authenticated
      return
    }

    const _currentInstance = currentInstance.get()
    const asSpark = get(currentSparkId)

    const currentTimelineIsUnchanged = () => {
      const newCurrentInstance = currentInstance.get()
      const newCurrentTimeline = currentTimeline.get()
      return newCurrentInstance === _currentInstance &&
        newCurrentTimeline === _currentTimeline
    }

    if (!currentTimelineIsUnchanged()) {
      return
    }

    let firstPostId

    if (_currentTimeline) {
      firstPostId = getFirstTimelineItemId(_currentInstance, _currentTimeline, asSpark)
    }

    let _currentInstanceStream = get(currentInstanceStream)

    if (!_currentInstanceStream) {
      if (_currentTimeline) {
        _currentInstanceStream = createStream(_currentInstance, _currentTimeline, firstPostId, asSpark)

        currentInstanceStream.set(_currentInstanceStream)

        if (!import.meta.env.PROD) {
          window.currentTimelineStream = _currentInstanceStream
        }
      }
    } else {
      _currentInstanceStream.switchTimeline(_currentTimeline, asSpark, firstPostId)
    }
  })

  currentSpark.subscribe(async (_currentSpark) => {
    if (inBrowser()) {
      return
    }

    if (!_currentSpark) {
      return
    }

    const _currentInstance = currentInstance.get()
    const asSpark = _currentSpark.id

    const currentSparkIsUnchanged = () => {
      const newCurrentInstance = currentInstance.get()
      const newCurrentSpark = get(currentSpark)
      return newCurrentInstance === _currentInstance &&
        newCurrentSpark && newCurrentSpark.id === _currentSpark.id
    }

    if (!currentSparkIsUnchanged()) {
      return
    }

    let _currentInstanceStream = get(currentInstanceStream)

    if (!_currentInstanceStream) {
      _currentInstanceStream = createStream(_currentInstance, '', '', asSpark)

      currentInstanceStream.set(_currentInstanceStream)

      if (!import.meta.env.PROD) {
        window.currentTimelineStream = _currentInstanceStream
      }
    } else {
      _currentInstanceStream.switchSpark(asSpark)
    }
  })
}
