import ShortcutHelpDialog from '../components/ShortcutHelpDialog.svelte'
import { showDialog } from './showDialog'

export default function showShortcutHelpDialog (options) {
  return showDialog(ShortcutHelpDialog, Object.assign({
    label: 'intl.shortcutHelp'
  }, options))
}
