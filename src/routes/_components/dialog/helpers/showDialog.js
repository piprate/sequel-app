import { emit } from '../../../_utils/eventBus'

export function show (id) {
  emit('showDialog', id)
}
