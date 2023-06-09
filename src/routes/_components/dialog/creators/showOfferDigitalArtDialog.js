import OfferDigitalArtDialog from '../components/OfferDigitalArtDialog.svelte'
import { showDialog } from './showDialog'

export default function showOfferDigitalArtDialog(digitalArt) {
  return showDialog(OfferDigitalArtDialog, { label: 'intl.offerDigitalArt', digitalArt })
}
