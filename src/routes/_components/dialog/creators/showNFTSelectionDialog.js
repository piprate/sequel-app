import NFTSelectionDialog from '../components/NFTSelectionDialog.svelte'
import { showDialog } from './showDialog'

export default function showNFTSelectionDialog(currentSource, currentToken, onSelect, label) {
  return showDialog(
    NFTSelectionDialog,
    {
      currentSource,
      currentToken,
      label
    },
    {
      select: onSelect
    }
  )
}
