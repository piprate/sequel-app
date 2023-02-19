import SparkSelectionDialog from '../components/SparkSelectionDialog.svelte'
import { showDialog } from './showDialog'

export default function showSparkSelectionDialog (selectedSpark, onSelect, label, title, realm) {
  return showDialog(SparkSelectionDialog, {
    selectedSpark,
    label,
    title,
    realm
  }, {
    select: onSelect
  })
}
