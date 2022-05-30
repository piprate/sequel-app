import { getInstanceInfo } from '../_api/instance'
import { goto } from '@sapper/app'
import { DEFAULT_THEME, switchToTheme } from '../_utils/themeEngine'
import {
  currentInstance,
  enableGrayscale,
  instanceNameInSearch,
  instanceThemes,
  isAuthenticated,
  loggedInInstances,
  loggedInInstancesInOrder,
  logInToInstanceError,
  logInToInstanceErrorForText,
  logInToInstanceLoading,
  redirectToPage
} from '../_store/local'
import { logOutOfInstance, updateUserForInstance } from './instances'
import { updateCustomEmojiForInstance } from './emoji'
import { database } from '../_database/database'
import { authenticate, register } from '../_api/chainlocker'
import { enrollUser } from '../_api/user'
import { configureFlow } from './flow'
import { get } from 'svelte/store'

const GENERIC_ERROR = `
  Something wrong happened when connecting to a Sequel instance.
  Are you in private browsing mode?`

function createKnownError (message) {
  const err = new Error(message)
  err.knownError = true
  return err
}

export async function registerInInstance (email, password, registrationCode) {
  logInToInstanceLoading.set(true)
  logInToInstanceError.set(null)

  try {
    const instanceName = instanceNameInSearch.get().replace(/^https?:\/\//, '').replace(/\/+$/, '').toLowerCase()
    if (Object.keys(loggedInInstances.get()).includes(instanceName)) {
      const msg = `You've already logged in to ${instanceName}`
      console.error(msg)
      logInToInstanceError.set(msg)
      logInToInstanceErrorForText.set(instanceNameInSearch.get())
      return
    }

    const instanceInfo = await getInstanceInfo(instanceName)
    await database.setInstanceInfo(instanceName, instanceInfo) // cache for later

    const accountData = await register(instanceInfo.chainlockerURI, email, password, registrationCode)
    console.log('accountData =', accountData)
    const token = accountData.token

    const user = await enrollUser(instanceName, token, accountData.secondLevelRecoveryCode)
    console.log('enrolledUser =', user)

    await registerNewInstance(instanceName, token, instanceInfo)

    return accountData.recoveryPhrase
  } catch (err) {
    console.error(err)
    const error = (err.message || err.name) +
      (err.knownError ? '' : '. ' + (navigator.onLine ? GENERIC_ERROR : 'Are you offline?'))
    logInToInstanceError.set(error)
    logInToInstanceErrorForText.set(instanceNameInSearch.get())
  } finally {
    logInToInstanceLoading.set(false)
  }

  return ''
}

export async function logInToInstance (email, password) {
  logInToInstanceLoading.set(true)
  logInToInstanceError.set(null)

  const anonymousMode = !email

  try {
    const instanceName = instanceNameInSearch.get().replace(/^https?:\/\//, '').replace(/\/+$/, '').toLowerCase()
    if (Object.keys(loggedInInstances.get()).includes(instanceName)) {
      if (get(isAuthenticated)) {
        const msg = `You've already logged in to ${instanceName}`
        console.error(msg)
        logInToInstanceError.set(msg)
        logInToInstanceErrorForText.set(instanceNameInSearch.get())
        return
      } else {
        await logOutOfInstance(instanceName, 'intl.turnOffAnonymousMode')
      }
    }

    const instanceInfo = await getInstanceInfo(instanceName)
    await database.setInstanceInfo(instanceName, instanceInfo) // cache for later

    let token = ''
    if (!anonymousMode) {
      const accountData = await authenticate(instanceInfo.chainlockerURI, email, password)
      console.log('accountData =', accountData)
      token = accountData.token
    }

    await registerNewInstance(instanceName, token, instanceInfo)

    const _redirectToPage = redirectToPage.get()
    if (_redirectToPage) {
      redirectToPage.set('')
      goto(_redirectToPage)
    } else if (anonymousMode) {
      goto('/worlds')
    } else {
      goto('/')
    }
  } catch (err) {
    console.error(err)
    const error = `${err.message || err.name}. ` +
      (err.knownError ? '' : (navigator.onLine ? GENERIC_ERROR : 'Are you offline?'))
    logInToInstanceError.set(error)
    logInToInstanceErrorForText.set(instanceNameInSearch.get())
  } finally {
    logInToInstanceLoading.set(false)
  }
}

async function registerNewInstance (instanceName, token, instanceInfo) {
  const instanceData = {
    access_token: token,
    flowEnv: instanceInfo.flowEnv,
    flowAccessNodeURI: instanceInfo.flowAccessNodeURI,
    flowDiscoveryWalletURI: instanceInfo.flowDiscoveryWalletURI,
    flowAppTitle: instanceInfo.flowAppTitle,
    flowAppLogoURI: instanceInfo.flowAppLogoURI,
    flowAddresses: instanceInfo.flowAddresses
  }

  const themes = instanceThemes.get()
  themes[instanceName] = DEFAULT_THEME
  instanceThemes.set(themes)

  const instances = loggedInInstances.get()
  instances[instanceName] = instanceData
  loggedInInstances.set(instances)
  const instancesInOrder = loggedInInstancesInOrder.get()
  if (!instancesInOrder.includes(instanceName)) {
    instancesInOrder.push(instanceName)
    loggedInInstancesInOrder.set(instancesInOrder)
  }
  instanceNameInSearch.set('')
  currentInstance.set(instanceName)

  switchToTheme(DEFAULT_THEME, enableGrayscale.get())
  configureFlow(instanceName)

  if (token) {
    // fire off these requests so they're cached
    /* no await */
    updateUserForInstance(instanceName)
    /* no await */
    updateCustomEmojiForInstance(instanceName)
  }
}
