import SparkSelectionDialog from '../components/SparkSelectionDialog.svelte'
import { showDialog } from './showDialog'

export default function showSparkSelectionDialog (selectedWorld, onSelect, label, title, realm) {
  return showDialog(SparkSelectionDialog, {
    selectedWorld,
    label,
    title,
    realm
  }, {
    select: onSelect
  })
}
