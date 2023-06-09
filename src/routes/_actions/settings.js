import { get as getRequest, post } from '../_utils/ajax'
import { get as storeGet } from 'svelte/store'
import { auth, basename } from '../_api/utils'
import { currentInstance, userSettings } from '../_store/local'
import { accessToken } from '../_store/instance'
import { DEFAULT_THEME } from '../_utils/themeEngine'
import { inBrowser } from '../_utils/browserOrNode'
import { isKaiOS } from '../_utils/userAgent/isKaiOS'
import { get } from '../_utils/lodash-lite'
import { toast } from '../_components/toast/toast'

const defaultSettings = {
  general: {
    media: {},
    ui: {
      disableCustomScrollbars: inBrowser() && /iP(?:hone|ad|od)/.test(navigator.userAgent)
    },
    a11y: {
      reduceMotion: !inBrowser() || matchMedia('(prefers-reduced-motion: reduce)').matches
    },
    theme: DEFAULT_THEME
  },
  hotkeys: {
    leftRightChangesFocus: isKaiOS()
  },
  instance: {},
  wellness: {
    metrics: {},
    immediacy: {},
    ui: {}
  }
}

export function getSettingsFromLocal(section, group = undefined) {
  const _currentInstance = currentInstance.get()

  if (_currentInstance) {
    defaultSettings.instance[_currentInstance] = {
      theme: DEFAULT_THEME,
      notificationFilters: {},
      pushNotifications: {}
    }
  }

  const settings = { ...defaultSettings }

  for (const key of Object.keys(defaultSettings)) {
    const sectionSetting = localStorage.getItem(`${key}_settings`)
    const parsed = JSON.parse(sectionSetting)

    if (parsed) settings[key] = parsed
  }

  if (section || group) {
    return group ? settings[section][group] : settings[section]
  }

  userSettings.set(settings)
  return settings
}

export function getSectionSettingsFromLocal(section, group = undefined) {
  const savedSettings = localStorage.getItem(`${section}_settings`)
  const parsedSettings = saveSettings ? JSON.parse(savedSettings) : null

  if (parsedSettings) {
    return group ? parsedSettings[group] : parsedSettings
  }

  return null
}

export async function getSettingsFromRemote() {
  const _accessToken = storeGet(accessToken)
  const _currentInstance = currentInstance.get()

  if (_currentInstance) {
    try {
      const url = `${basename(_currentInstance)}/user/settings/sequelapp/client/web`
      const response = await getRequest(url, auth(_accessToken))
      if (response) saveSettingsToLocal(response)
      userSettings.set(response.settings)
      return response.settings
    } catch (error) {
      return defaultSettings
    }
  }
}

export async function getSettings(section, group) {
  try {
    const localSettings = getSettingsFromLocal()
    const settings = localSettings || (await getSettingsFromRemote())

    if (section) {
      const sectionSettings = getSectionSettingsFromLocal(section)
      return group ? sectionSettings?.[group] : sectionSettings
    }

    return { settings }
  } catch (error) {
    return { settings: defaultSettings }
  }
}

export function getStoreSettings(...keys) {
  return get(userSettings.get(), keys)
}

export async function saveSettingsToLocal(settings, section) {
  const { settings: _settings, ...settingsMeta } = settings
  const sectionSettings = _settings[section]

  if (settingsMeta?.client || settingsMeta?.clientType) {
    localStorage.setItem('settings_meta', JSON.stringify(settingsMeta))
  }

  if (sectionSettings) {
    localStorage.setItem(`${section}_settings`, JSON.stringify(sectionSettings))
  } else {
    for (const [key, value] of Object.entries(_settings)) {
      localStorage.setItem(`${key}_settings`, JSON.stringify(value))
    }
  }
}

export async function saveSettingsToRemote(settings) {
  const _accessToken = storeGet(accessToken)
  const _currentInstance = currentInstance.get()

  const url = `${basename(_currentInstance)}/user/settings/sequelapp/client/web`
  return post(url, settings, auth(_accessToken))
}

/**
 * Saves the new changes in the settings.
 * Changes will be saved to svelte store, indexedDB and to the backend
 *
 * @param {Record<string, unknown>} settings the new settings or changes to save
 * @param {string} section the page or the setting category where the action is being called
 * @param {string} group the group in the section which is being updated
 * @param {boolean} overwrite the group in the section which is being updated
 * @param {boolean} localOnly save settings only locally, no backend request
 *
 * @example
 * saveSettings({ darkBackground: 'sequel' }, 'instances', 'theme')
 */
export async function saveSettings(settings, section, group = undefined, overwrite = true, localOnly = false) {
  const _settings = userSettings.get()

  if (group) {
    _settings[section][group] = overwrite ? settings : { ..._settings[section][group], ...settings }
  } else {
    _settings[section] = overwrite ? settings : { ..._settings[section], ...settings }
  }

  userSettings.set(_settings)

  if (localOnly) {
    saveSettingsToLocal({ settings: _settings }, section)
  } else {
    const _currentInstance = currentInstance.get()
    const savedSettings = _currentInstance ? await saveSettingsToRemote(_settings) : { settings: _settings }
    saveSettingsToLocal(savedSettings, section)

    /* no await */
    toast.say('intl.savedSettings')
  }
}

export function parseSettings(settings) {
  return JSON.parse(JSON.stringify(settings).replaceAll('"on"', 'true'))
}

export function deleteSettings() {
  userSettings.set(null)
  localStorage.removeItem('settings_meta')

  for (const section of Object.keys(defaultSettings)) {
    localStorage.removeItem(`${section}_settings`)
  }
}
