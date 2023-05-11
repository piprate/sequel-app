import { updateAlerts } from '../../../../_actions/pushSubscription'
import { parseSettings, saveSettings } from '../../../../_actions/settings'
import { switchToTheme } from '../../../../_utils/themeEngine'

export function saveInstanceSettings (instanceName) {
  const themeForm = document.getElementById('theme-settings')
  const pushNotificationForm = document.getElementById('push-notification-settings')
  const notificationFilterForm = document.getElementById('notification-filter-settings')

  const themeFormData = new FormData(themeForm)
  const pushNotificationFormData = new FormData(pushNotificationForm)
  const notificationFilterFormData = new FormData(notificationFilterForm)

  const pushNotifications = Object.fromEntries(pushNotificationFormData.entries())
  const notificationFilters = Object.fromEntries(notificationFilterFormData.entries())
  const theme = themeFormData.get('theme')

  const settings = {
    theme,
    notificationFilters,
    pushNotifications
  }

  saveSettings(parseSettings(settings), 'instance', instanceName)

  const alerts = {}
  for (const key of Object.keys(pushNotifications)) {
    alerts[key] = true
  }

  updateAlerts(instanceName, alerts)
  switchToTheme(theme)
}
