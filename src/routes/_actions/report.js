import { importShowReportDialog } from '../_components/dialog/asyncDialogs/importShowReportDialog.js'

export async function reportPostOrSpark({ post = undefined, spark = undefined }) {
  const showReportDialog = await importShowReportDialog()
  showReportDialog({ post, spark })
}
