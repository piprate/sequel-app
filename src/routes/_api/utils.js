function targetIsLocalhost (instanceName) {
  return instanceName && (instanceName.startsWith('localhost:') || instanceName.startsWith('127.0.0.1:'))
}

export function basename (instanceName) {
  if (targetIsLocalhost(instanceName)) {
    return `http://${instanceName}`
  }
  return `https://${instanceName}`
}

export function base (instanceName, accessToken) {
  if (accessToken) {
    return `https://${instanceName}`
  } else {
    return `https://${instanceName}/public`
  }
}

export function auth (accessToken) {
  if (accessToken) {
    return {
      Authorization: `Bearer ${accessToken}`
    }
  } else {
    return {}
  }
}

export function sequelAuth (accessToken, sparkID) {
  const header = {}

  if (accessToken) {
    header.Authorization = `Bearer ${accessToken}`
  }
  if (sparkID) {
    header['X-As-Spark'] = sparkID
  }

  return header
}
