import EventsLight from 'events-light'
import { WebSocketClient } from '../../_thirdparty/websocket/websocket'
import { lifecycle } from '../../_utils/lifecycle'
import { eventBus } from '../../_utils/eventBus'
import { safeParse } from '../../_utils/safeParse'

export class TimelineStream extends EventsLight.EventEmitter {
  constructor (streamingApi, accessToken, timeline, asSpark) {
    super()
    this._streamingApi = streamingApi
    this._accessToken = accessToken
    this._timeline = timeline
    this._asSpark = asSpark
    this._onStateChange = this._onStateChange.bind(this)
    this._onOnline = this._onOnline.bind(this)
    this._onOffline = this._onOffline.bind(this)
    this._onForcedOnlineStateChange = this._onForcedOnlineStateChange.bind(this)
    this._setupWebSocket()
    this._setupEvents()
  }

  switchTimeline (timeline, asSpark, firstItemId) {
    this._timeline = timeline
    this._asSpark = asSpark
    if (timeline) {
      this._sendSubscribeMessage()
    } else {
      this._sendUnsubscribeMessage()
    }

    this.emit('switchTimeline', timeline, asSpark, firstItemId)
  }

  switchSpark (asSpark) {
    this._timeline = ''
    this._asSpark = asSpark
    this._sendSwitchSparkMessage()
    this.emit('switchSpark', asSpark)
  }

  close () {
    this._closed = true
    this._closeWebSocket()
    this._teardownEvents()
    // events-light currently does not support removeAllListeners()
    // https://github.com/patrick-steele-idem/events-light/issues/2
    for (const event of ['open', 'close', 'reconnect', 'message', 'switchTimeline', 'switchSpark']) {
      this.removeAllListeners(event)
    }
  }

  isClosed () {
    return this._closed
  }

  _sendSubscribeMessage () {
    if (!this._opened) {
      console.log("websocket isn't open yet. Ignoring subscribe message")
      return
    }
    this._ws.send(JSON.stringify({
      type: 'subscribe',
      timeline: this._timeline,
      asSpark: this._asSpark
    }))
  }

  _sendUnsubscribeMessage () {
    if (!this._opened) {
      console.log("websocket isn't open yet. Ignoring unsubscribe message")
      return
    }
    this._ws.send(JSON.stringify({
      type: 'unsubscribe'
    }))
  }

  _sendSwitchSparkMessage () {
    if (!this._opened) {
      console.log("websocket isn't open yet. Ignoring switchSpark message")
      return
    }
    this._ws.send(JSON.stringify({
      type: 'switchSpark',
      asSpark: this._asSpark
    }))
  }

  _closeWebSocket () {
    if (this._ws) {
      this.emit('close')
      this._ws.onopen = null
      this._ws.onmessage = null
      this._ws.onclose = null
      this._ws.close()
      this._ws = null
    }
  }

  _setupWebSocket () {
    const url = this._streamingApi // getStreamUrl(this._streamingApi, this._accessToken, this._timeline)
    const ws = new WebSocketClient(url, 'sequel')

    ws.onopen = () => {
      if (!this._opened) {
        this.emit('open')
        this._opened = true
      } else {
        // we may close or reopen websockets due to freeze/unfreeze events
        // and we want to fire "reconnect" rather than "open" in that case
        this.emit('reconnect', this._timeline, this._asSpark)
      }
      this._ws.send(JSON.stringify({
        type: 'authenticate',
        token: this._accessToken,
        asSpark: this._asSpark
      }))
      if (this._timeline) {
        this._sendSubscribeMessage()
      }
    }
    ws.onmessage = (e) => this.emit('message', safeParse(e.data))
    ws.onclose = () => this.emit('close')
    // The ws "onreconnect" event seems unreliable. When the server goes down and comes back up,
    // it doesn't fire (but "open" does). When we freeze and unfreeze, it fires along with the
    // "open" event. The above is my attempt to normalize it.

    this._ws = ws
  }

  _setupEvents () {
    lifecycle.addEventListener('statechange', this._onStateChange)
    eventBus.on('forcedOnline', this._onForcedOnlineStateChange) // only happens in tests
    window.addEventListener('online', this._onOnline)
    window.addEventListener('offline', this._onOffline)
  }

  _teardownEvents () {
    lifecycle.removeEventListener('statechange', this._onStateChange)
    eventBus.removeListener('forcedOnline', this._onForcedOnlineStateChange) // only happens in tests
    window.removeEventListener('online', this._onOnline)
    window.removeEventListener('offline', this._onOffline)
  }

  _pause () {
    if (this._closed) {
      return
    }
    this._closeWebSocket()
  }

  _unpause () {
    if (this._closed) {
      return
    }
    this._closeWebSocket()
    this._setupWebSocket()
  }

  _onStateChange (event) {
    // when the page enters or exits a frozen state, pause or resume websocket polling
    if (event.newState === 'frozen') { // page is frozen
      console.log('frozen')
      this._pause()
    } else if (event.oldState === 'frozen') { // page is unfrozen
      console.log('unfrozen')
      this._unpause()
    }
    if (event.newState === 'active') { // page is reopened from a background tab
      console.log('active')
      this._tryToReconnect()
    }
  }

  _onOnline () {
    console.log('online')
    this._unpause() // if we're not paused, then this is a no-op
    this._tryToReconnect() // to be safe, try to reset and reconnect
  }

  _onOffline () {
    console.log('offline')
    this._pause() // in testing, it seems to work better to stop polling when we get this event
  }

  _onForcedOnlineStateChange (online) {
    if (online) {
      console.log('online forced')
      this._unpause()
    } else {
      console.log('offline forced')
      this._pause()
    }
  }

  _tryToReconnect () {
    console.log('websocket readyState', this._ws && this._ws.readyState)
    if (this._ws && this._ws.readyState !== WebSocketClient.OPEN) {
      // if a websocket connection is not currently open, then reset the
      // backoff counter to ensure that fresh notifications come in faster
      this._ws.reset()
      this._ws.reconnect()
    }
  }
}
