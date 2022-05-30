import { registerResizeListener } from '../../_utils/resize'
import { transientStore } from '../base'

export const isMobileSize = transientStore(false);
export const isSmallMobileSize = transientStore(false);
export const isTinyMobileSize = transientStore(false);
export const isVeryTinyMobileSize = transientStore(false);

export function resizeObservers() {
  if (!process.browser) {
    return
  }

  const recalculateIsMobileSize = () => {
    isMobileSize.set(matchMedia('(max-width: 767px)').matches); //  e.g. iPhone Plus
    isSmallMobileSize.set(matchMedia('(max-width: 479px)').matches); // e.g. Galaxy S5
    isTinyMobileSize.set(matchMedia('(max-width: 320px)').matches); // e.g. iPhone 4
    isVeryTinyMobileSize.set(matchMedia('(max-width: 240px)').matches); // e.g. Nokia 8110 (KaiOS)
  }

  registerResizeListener(recalculateIsMobileSize)
  recalculateIsMobileSize()
}
