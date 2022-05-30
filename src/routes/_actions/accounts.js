import { getAccount } from '../_api/user'
import { getRelationship } from '../_api/relationships'
import { database } from '../_database/database'
import { currentAccountProfile, currentAccountRelationship, currentInstance } from '../_store/local'
import { accessToken } from '../_store/instance'
import { get } from 'svelte/store';

async function _updateAccount (accountId, instanceName, accessToken) {
  const localPromise = database.getAccount(instanceName, accountId)
  const remotePromise = getAccount(instanceName, accessToken, accountId).then(account => {
    /* no await */ database.setAccount(instanceName, account)
    return account
  })

  try {
    currentAccountProfile.set((await localPromise));
  } catch (e) {
    console.error(e)
  }
  try {
    currentAccountProfile.set((await remotePromise));
  } catch (e) {
    console.error(e)
  }
}

async function _updateRelationship (accountId, instanceName, accessToken) {
  const localPromise = database.getRelationship(instanceName, accountId)
  const remotePromise = getRelationship(instanceName, accessToken, accountId).then(relationship => {
    /* no await */ database.setRelationship(instanceName, relationship)
    return relationship
  })
  try {
    currentAccountRelationship.set((await localPromise));
  } catch (e) {
    console.error(e)
  }
  try {
    currentAccountRelationship.set((await remotePromise));
  } catch (e) {
    console.error(e)
  }
}

export async function updateLocalRelationship (instanceName, accountId, relationship) {
  await database.setRelationship(instanceName, relationship)
  try {
    currentAccountRelationship.set(relationship);
  } catch (e) {
    console.error(e)
  }
}

export async function clearProfileAndRelationship () {
  currentAccountProfile.set(null);
  currentAccountRelationship.set(null);
}

export async function updateProfileAndRelationship (accountId) {
  const currentInstanceVal = currentInstance.get();
  const token = get(accessToken);
  await Promise.all([
    _updateAccount(accountId, currentInstanceVal, token),
    _updateRelationship(accountId, currentInstanceVal, token)
  ])
}

export async function updateRelationship (accountId) {
  await _updateRelationship(accountId, currentInstance.get(), get(accessToken));
}
