import { importShowComposeDialog } from '../_components/dialog/asyncDialogs/importShowComposeDialog.js'
import { setComposeData } from '../_store/local'

export async function composeNewStatusMentioning (account) {
  setComposeData('dialog', { text: `@${account.acct} ` })
  const showComposeDialog = await importShowComposeDialog()
  showComposeDialog()
}
