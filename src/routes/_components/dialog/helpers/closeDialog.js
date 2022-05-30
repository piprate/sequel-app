import { emit } from '../../../_utils/eventBus'

export function close (id) {
  emit('closeDialog', id)
}
