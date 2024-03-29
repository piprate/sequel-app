export const DEFAULT_TIMEOUT = 20000
export const MEDIA_WRITE_TIMEOUT = 90000 // media uploads can take awhile
export const WRITE_TIMEOUT = 45000 // allow more time if the user did a write action

function fetchWithTimeout(url, fetchOptions, timeout) {
  return new Promise((resolve, reject) => {
    fetch(url, fetchOptions).then(resolve, reject)
    setTimeout(() => reject(new Error(`Timed out after ${timeout / 1000} seconds`)), timeout)
  })
}

function makeFetchOptions(method, headers, options) {
  const res = {
    method,
    headers: Object.assign(headers || {}, {
      Accept: 'application/json'
    })
  }
  if (options && options.signal) {
    res.signal = options.signal
  }
  return res
}

async function throwErrorIfInvalidResponse(response) {
  const payload = await response.text()
  let json
  if (payload) {
    try {
      json = JSON.parse(payload)
    } catch (err) {}
  }

  if (response.status >= 200 && response.status < 300) {
    return { json, headers: response.headers }
  }
  if (json && json.message) {
    const err = new Error(json.message)
    err.knownError = true
    err.status = response.status
    throw err
  }
  throw new Error('Request failed: ' + response.status)
}

async function _fetch(url, fetchOptions, options) {
  let response
  if (options && options.timeout) {
    response = await fetchWithTimeout(url, fetchOptions, options.timeout)
  } else {
    response = await fetch(url, fetchOptions)
  }
  return throwErrorIfInvalidResponse(response)
}

async function _putOrPostOrPatch(method, url, body, headers, options) {
  const fetchOptions = makeFetchOptions(method, headers, options)
  if (body) {
    if (body instanceof FormData) {
      fetchOptions.body = body
    } else {
      fetchOptions.body = JSON.stringify(body)
      fetchOptions.headers['Content-Type'] = 'application/json'
    }
  }
  return _fetch(url, fetchOptions, options)
}

export async function put(url, body, headers, options) {
  return (await _putOrPostOrPatch('PUT', url, body, headers, options)).json
}

export async function post(url, body, headers, options) {
  return (await _putOrPostOrPatch('POST', url, body, headers, options)).json
}

export async function postBinary(url, body, headers, options) {
  const fetchOptions = makeFetchOptions('POST', headers, options)
  if (body) {
    fetchOptions.body = body
  }
  return (await _fetch(url, fetchOptions, options)).json
}

export async function patch(url, body, headers, options) {
  return (await _putOrPostOrPatch('PATCH', url, body, headers, options)).json
}

export async function get(url, headers, options) {
  return (await _fetch(url, makeFetchOptions('GET', headers, options), options)).json
}

/** @returns {json, headers} */
export async function getWithHeaders(url, headers, options) {
  return _fetch(url, makeFetchOptions('GET', headers, options), options)
}

export async function del(url, headers, options) {
  return (await _fetch(url, makeFetchOptions('DELETE', headers, options), options)).json
}

export function paramsString(paramsObject) {
  let res = ''
  let count = -1
  Object.keys(paramsObject).forEach((key) => {
    const value = paramsObject[key]
    if (Array.isArray(value)) {
      res += (++count > 0 ? '&' : '') + encodeURIComponent(key) + '=' + value.map((v) => encodeURIComponent(v)).join()
    } else {
      res += (++count > 0 ? '&' : '') + encodeURIComponent(key) + '=' + encodeURIComponent(value)
    }
  })
  return res
}
