import { importShowMuteDialog } from '../_components/dialog/asyncDialogs/importShowMuteDialog.js'
import { setSparkMuted } from './mute'

export async function toggleMute(spark, mute) {
  if (mute) {
    ;(await importShowMuteDialog())(spark)
  } else {
    await setSparkMuted(spark.id, mute, /* notifications */ false, /* toastOnSuccess */ true)
  }
}
