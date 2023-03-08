import ReleaseOptionsDialog from '../components/ReleaseOptionsDialog.svelte'
import { showDialog } from './showDialog'

export default function showReleaseOptionsDialog (release, listing) {
  return showDialog(ReleaseOptionsDialog, {
    label: 'intl.marketplaceReleaseOptions',
    release,
    listing
  })
}
