import { transientStore } from "../base";

export let notificationPermission;

export function notificationPermissionObservers() {
  if (!process.browser || !navigator.permissions || !navigator.permissions.query) {
    return
  }

  navigator.permissions.query({ name: 'notifications' }).then(permission => {

    notificationPermission = transientStore(permission.state);

    permission.onchange = event => {
      notificationPermission.set(event.target.state);
    }
  })
}
