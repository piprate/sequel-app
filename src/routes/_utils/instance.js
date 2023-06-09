export function getInstanceName(instance) {
  const instanceName = instance
    .replace(/^https?:\/\//, '')
    .replace(/\/+$/, '')
    .toLowerCase()
  return instanceName
}

export function processURI(uri) {
  if (uri.startsWith('https+insecure:')) {
    uri = uri.replace('https+insecure:', 'https:')
  }

  return uri
}
