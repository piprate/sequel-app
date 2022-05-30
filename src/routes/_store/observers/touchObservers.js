import { transientStore } from "../base";

export const isUserTouching = transientStore(false);

export function touchObservers() {
  if (!process.browser) {
    return
  }

  const onTouch = () => {
    isUserTouching.set(true);
    window.removeEventListener('touchstart', onTouch)
  }

  window.addEventListener('touchstart', onTouch, { passive: true })
}
