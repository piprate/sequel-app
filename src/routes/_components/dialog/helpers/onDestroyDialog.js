import { on, removeListener } from '../../../_utils/eventBus'

function onDestroy(idFromEvent, params) {
  const { id, component, listener } = params;
  if (id !== idFromEvent) {
    return
  }
  removeListener('destroyDialog', listener);
  component.$destroy();
}

export function destroyOnEvent(id, component) {
  const params = {
    id, component
  };
  const listener = idFromEvent => onDestroy(idFromEvent, params);
  params.listener = listener;
  on('destroyDialog', listener);
}