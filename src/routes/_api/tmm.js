import { post } from '../_utils/ajax'
import { basename, sequelAuth } from './utils'
import { unwrap } from '../_utils/mapper'

export async function tmmPost (instanceName, accessToken, postId, asSpark) {
  const url = `${basename(instanceName)}/post/${unwrap(postId)}/tmm`
  return post(url, null, sequelAuth(accessToken, asSpark))
}

export async function unTmmPost (instanceName, accessToken, postId, asSpark) {
  const url = `${basename(instanceName)}/post/${unwrap(postId)}/untmm`
  return post(url, null, sequelAuth(accessToken, asSpark))
}
