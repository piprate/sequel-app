import WordFilterDialog from '../components/WordFilterDialog.svelte'
import { showDialog } from './showDialog'

export default function showReportDialog ({ filter, instanceName }) {
  const label = filter ? 'intl.editFilter' : 'intl.addFilter'
  return showDialog(WordFilterDialog, {
    label,
    title: label,
    filter,
    instanceName
  })
}
