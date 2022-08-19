import DigitalArtTokenOptionsDialog from '../components/DigitalArtTokenOptionsDialog.svelte'
import { showDialog } from './showDialog'

export default function showDigitalArtTokenOptionsDialog (token, relationship, ourSpark) {
  return showDialog(DigitalArtTokenOptionsDialog, {
    label: 'intl.tokenOptions',
    title: '',
    token: token,
    relationship: relationship,
    ourSpark: ourSpark
  })
}
