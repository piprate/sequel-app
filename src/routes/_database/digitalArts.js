import { DIGITAL_ARTS_STORE } from './constants'
import { digitalArtsCache } from './cache'
import { cloneForStorage, getGenericEntityWithId, setGenericEntityWithId } from './helpers'

export async function getDigitalArt (instanceName, id) {
  return getGenericEntityWithId(DIGITAL_ARTS_STORE, digitalArtsCache, instanceName, id)
}

export async function setDigitalArt (instanceName, value) {
  return setGenericEntityWithId(DIGITAL_ARTS_STORE, digitalArtsCache, instanceName, cloneForStorage(value))
}
