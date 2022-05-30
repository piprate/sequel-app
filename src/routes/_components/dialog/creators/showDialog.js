import { createDialogElement } from '../helpers/createDialogElement'
import { createDialogId } from '../helpers/createDialogId'
import { destroyOnEvent } from '../helpers/onDestroyDialog'
import { show } from '../helpers/showDialog'

export function showDialog (Dialog, props, callbacks) {
  const id = createDialogId()
  const dialog = new Dialog({
    target: createDialogElement(),
    props: Object.assign({
      id
    }, props)
  })
  const callbackRemovers = []
  if (callbacks) {
    for (const event in callbacks) {
      dialog.$on(event, callbacks[event])
    }
  }

  destroyOnEvent(id, dialog, callbackRemovers)
  show(id)
  return dialog
}
