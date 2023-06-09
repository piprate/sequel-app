const entityPrefix = 'did:sequel:'
const blobPrefix = 'did:piprate:'

export function unwrap(id) {
  if (id.startsWith(entityPrefix)) {
    return id.slice(entityPrefix.length)
  } else {
    return id
  }
}

export function wrap(id) {
  return entityPrefix + id
}

export function unwrapBlob(id) {
  if (id.startsWith(blobPrefix)) {
    return id.slice(blobPrefix.length)
  } else {
    return id
  }
}

export function wrapBlob(id) {
  return blobPrefix + id
}

export function fediverseHandle(spark, instanceName) {
  const username = spark.handle || unwrap(spark.id)
  return `@${username}@${instanceName}`
}
