import { getSectionSettingsFromLocal, getSettings } from './_actions/settings'
import { currentInstance } from './_store/local'
import { switchToTheme } from './_utils/themeEngine'

function refreshTheme() {
  const _currentInstance = currentInstance.get()

  if (_currentInstance) {
    const instanceSettings = getSectionSettingsFromLocal('instance', _currentInstance)
    const uiSettings = getSectionSettingsFromLocal('wellness', 'ui')

    switchToTheme(instanceSettings?.theme, uiSettings?.enableGrayscale)
  }
}

export function load() {
  if (typeof window !== 'undefined') {
    refreshTheme()
    getSettings().then(refreshTheme)
  }
}
