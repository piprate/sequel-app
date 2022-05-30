export const importSnackbar = () => import(
  '../../_components/snackbar/Snackbar.svelte'
).then(mod => mod.default)
