import { getComposeData, setComposeData } from '../_store/local'

export function toggleContentWarningShown(realm) {
  const shown = getComposeData(realm, 'contentWarningShown')
  const contentWarning = getComposeData(realm, 'contentWarning')
  const newShown = !shown
  setComposeData(realm, {
    contentWarning: newShown ? contentWarning : '',
    contentWarningShown: newShown,
    sensitive: contentWarning && newShown // toggling content warning automatically toggles sensitive media
  })
}
