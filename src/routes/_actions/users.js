import { updateUser } from '../_api/user'
import { currentInstance, instanceUsers } from '../_store/local'
import { get, writable } from 'svelte/store'
import { accessToken } from '../_store/instance'
import { database } from '../_database/database'

export const userOperationInProgress = writable(false)
export const userOperationError = writable(null)

export async function saveUser(user) {
  userOperationInProgress.set(true)
  userOperationError.set(null)

  const instanceName = currentInstance.get()

  let updatedUser

  try {
    const template = {
      flow: user.flow
    }
    updatedUser = await updateUser(instanceName, get(accessToken), template)
    await database.setUser(instanceName, updatedUser)
    setStoreUser(instanceName, updatedUser)
  } catch (err) {
    console.error(err)
    userOperationError.set(err)
  } finally {
    userOperationInProgress.set(false)
  }

  return updatedUser
}

export function setStoreUser(instanceName, user) {
  const _instanceUsers = instanceUsers.get()
  _instanceUsers[instanceName] = user
  instanceUsers.set(_instanceUsers)
}
