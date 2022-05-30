import { getAccessTokenFromAuthCode, registerApplication, generateAuthLink } from '../_api/oauth'
import { getInstanceInfo } from '../_api/instance'
import { goto } from '@sapper/app';
import { DEFAULT_THEME, switchToTheme } from '../_utils/themeEngine'
import {
  currentInstance,
  currentRegisteredInstance,
  currentRegisteredInstanceName,
  enableGrayscale,
  instanceNameInSearch,
  instanceThemes,
  loggedInInstances,
  loggedInInstancesInOrder,
  logInToInstanceError,
  logInToInstanceErrorForText,
  logInToInstanceLoading
} from '../_store/local'
import { updateVerifyCredentialsForInstance } from './instances'
import { updateCustomEmojiForInstance } from './emoji'
import { database } from '../_database/database'

const GENERIC_ERROR = `
  Is this a valid Mastodon instance? Is a browser extension
  blocking the request? Are you in private browsing mode?
  If you believe this is a problem with your instance, please send
  <a href="https://github.com/nolanlawson/pinafore/blob/master/docs/Admin-Guide.md"
    target="_blank" rel="noopener">this link</a> to the administrator of your instance.`

function createKnownError (message) {
  const err = new Error(message)
  err.knownError = true
  return err
}

function getRedirectUri () {
  return `${location.origin}/settings/instances/add`
}

async function redirectToOauth () {
  let instanceName = instanceNameInSearch.get().replace(/^https?:\/\//, '').replace(/\/+$/, '').toLowerCase()
  if (Object.keys(loggedInInstances.get()).includes(instanceName)) {
    throw createKnownError(`You've already logged in to ${instanceName}`)
  }
  const redirectUri = getRedirectUri()
  const registrationPromise = registerApplication(instanceName, redirectUri)
  const instanceInfo = await getInstanceInfo(instanceName)
  await database.setInstanceInfo(instanceName, instanceInfo) // cache for later
  const instanceData = await registrationPromise
  currentRegisteredInstanceName.set(instanceName);
  currentRegisteredInstance.set(instanceData);
  const oauthUrl = generateAuthLink(
      instanceName,
    instanceData.client_id,
    redirectUri
  )
  // setTimeout to allow the browser to *actually* save the localStorage data (fixes Safari bug apparently)
  setTimeout(() => {
    document.location.href = oauthUrl
  }, 200)
}

export async function logInToInstance () {
  logInToInstanceLoading.set(true);
  logInToInstanceError.set(null);
  try {
    await redirectToOauth()
  } catch (err) {
    console.error(err)
    const error = `${err.message || err.name}. ` +
      (err.knownError ? '' : (navigator.onLine ? GENERIC_ERROR : 'Are you offline?'))
    logInToInstanceError.set(error);
    logInToInstanceErrorForText.set(instanceNameInSearch.get());
  } finally {
    logInToInstanceLoading.set(false);
  }
}

async function registerNewInstance (code) {
  let instanceName = currentRegisteredInstanceName.get();
  let currentRegisteredInstanceVal = currentRegisteredInstance.get();
  const redirectUri = getRedirectUri()
  const instanceData = await getAccessTokenFromAuthCode(
    instanceName,
    currentRegisteredInstanceVal.client_id,
    currentRegisteredInstanceVal.client_secret,
    code,
    redirectUri
  )

  let themes = instanceThemes.get();
  themes[instanceName] = DEFAULT_THEME;
  instanceThemes.set(themes);

  let instances = loggedInInstances.get();
  instances[instanceName] = instanceData;
  loggedInInstances.set(instances);
  let instancesInOrder = loggedInInstancesInOrder.get();
  if (!instancesInOrder.includes(instanceName)) {
    instancesInOrder.push(instanceName)
    loggedInInstancesInOrder.set(instancesInOrder);
  }
  instanceNameInSearch.set('');
  currentRegisteredInstanceName.set(null);
  currentRegisteredInstance.set(null);
  currentInstance.set(instanceName);

  switchToTheme(DEFAULT_THEME, enableGrayscale.get());
  // fire off these requests so they're cached
  /* no await */ updateVerifyCredentialsForInstance(instanceName);
  /* no await */ updateCustomEmojiForInstance(instanceName);
  goto('/');
}

export async function handleOauthCode (code) {
  try {
    logInToInstanceLoading.set(true);
    await registerNewInstance(code)
  } catch (err) {
    logInToInstanceError.set(`${err.message || err.name}. Failed to connect to instance.`);
  } finally {
    logInToInstanceLoading.set(false);
  }
}
