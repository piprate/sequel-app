import DigitalArtOptionsDialog from '../components/DigitalArtOptionsDialog.svelte'
import { showDialog } from './showDialog'

export default function showDigitalArtOptionsDialog (digitalArt, ourSpark) {
  return showDialog(DigitalArtOptionsDialog, {
    label: 'intl.digitalArtOptions',
    title: '',
    digitalArt,
    ourSpark
  })
}
