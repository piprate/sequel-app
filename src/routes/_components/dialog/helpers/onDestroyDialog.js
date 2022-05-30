import { on, removeListener } from '../../../_utils/eventBus'

function onDestroy (idFromEvent, params) {
  const { id, component, listener, callbackRemovers } = params
  if (id !== idFromEvent) {
    return
  }
  if (callbackRemovers) {
    for (const remover of callbackRemovers) {
      remover()
    }
  }
  removeListener('destroyDialog', listener)
  component.$destroy()
}

export function destroyOnEvent (id, component, callbackRemovers) {
  const params = {
    id, component, callbackRemovers
  }
  const listener = idFromEvent => onDestroy(idFromEvent, params)
  params.listener = listener
  on('destroyDialog', listener)
}
