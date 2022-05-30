import { importShowComposeDialog } from '../_components/dialog/asyncDialogs/importShowComposeDialog.js'
import { setComposeData } from '../_store/local'

export async function composeNewPostMentioning (spark) {
  setComposeData('dialog', { text: `@${spark.name} ` })
  const showComposeDialog = await importShowComposeDialog()
  showComposeDialog()
}
