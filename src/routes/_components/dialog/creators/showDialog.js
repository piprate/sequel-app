import { createDialogElement } from '../helpers/createDialogElement'
import { createDialogId } from '../helpers/createDialogId'
import { destroyOnEvent } from '../helpers/onDestroyDialog'
import { show } from '../helpers/showDialog'

export function showDialog(Dialog, props) {
  const id = createDialogId();
  const dialog = new Dialog({
    target: createDialogElement(),
    props: Object.assign({
      id
    }, props)
  })
  destroyOnEvent(id, dialog);
  show(id);
  return dialog
}
