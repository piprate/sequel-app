import { inNode } from '../../_utils/browserOrNode'
import { transientStore } from '../base'

export const isUserTouching = transientStore(false)

export function touchObservers() {
  if (inNode()) {
    return
  }

  const onTouch = () => {
    isUserTouching.set(true)
    window.removeEventListener('touchstart', onTouch)
  }

  window.addEventListener('touchstart', onTouch, { passive: true })
}
