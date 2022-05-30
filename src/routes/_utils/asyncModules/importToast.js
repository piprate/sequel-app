export const importToast = () => import(
  '../../_components/toast/Toast.svelte'
).then(mod => mod.default)
