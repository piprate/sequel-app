import {
  DB_VERSION_INITIAL,
  DB_VERSION_MARKETPLACE,
  META_STORE,
  NOTIFICATION_TIMELINES_STORE,
  NOTIFICATIONS_STORE,
  PINNED_POSTS_STORE,
  POST_ID,
  POST_TIMELINES_STORE,
  POSTS_STORE,
  RELATIONSHIPS_STORE,
  SPARKS_STORE,
  THREADS_STORE,
  TIMESTAMP,
  USERNAME_LOWERCASE,
  WORLDS_STORE,
  LISTINGS_STORE,
  WORLD_RELATIONSHIPS_STORE,
  BUBBLES_STORE,
  BUBBLE_RELATIONSHIPS_STORE
} from './constants'

function initialMigration (db, tx, done) {
  function createObjectStore (name, init, indexes) {
    const store = init
      ? db.createObjectStore(name, init)
      : db.createObjectStore(name)
    if (indexes) {
      Object.keys(indexes).forEach(indexKey => {
        store.createIndex(indexKey, indexes[indexKey])
      })
    }
  }

  createObjectStore(POSTS_STORE, null, {
    [TIMESTAMP]: TIMESTAMP,
    did: 'id'
  })
  createObjectStore(POST_TIMELINES_STORE, null, {
    postId: ''
  })
  createObjectStore(NOTIFICATIONS_STORE, { keyPath: 'id' }, {
    [TIMESTAMP]: TIMESTAMP,
    [POST_ID]: POST_ID
  })
  createObjectStore(NOTIFICATION_TIMELINES_STORE, null, {
    notificationId: ''
  })
  createObjectStore(SPARKS_STORE, { keyPath: 'id' }, {
    [TIMESTAMP]: TIMESTAMP,
    [USERNAME_LOWERCASE]: USERNAME_LOWERCASE
  })
  createObjectStore(RELATIONSHIPS_STORE, { keyPath: 'id' }, {
    [TIMESTAMP]: TIMESTAMP
  })
  createObjectStore(WORLDS_STORE, { keyPath: 'id' }, {
    [TIMESTAMP]: TIMESTAMP
  })
  createObjectStore(WORLD_RELATIONSHIPS_STORE, { keyPath: 'id' }, {
    [TIMESTAMP]: TIMESTAMP
  })
  createObjectStore(BUBBLES_STORE, { keyPath: 'id' }, {
    [TIMESTAMP]: TIMESTAMP
  })
  createObjectStore(BUBBLE_RELATIONSHIPS_STORE, { keyPath: 'id' }, {
    [TIMESTAMP]: TIMESTAMP
  })
  createObjectStore(THREADS_STORE, null, {
    postId: ''
  })
  createObjectStore(PINNED_POSTS_STORE, null, {
    postId: ''
  })
  createObjectStore(META_STORE)
  done()
}

function migration1_1 (db, tx, done) {
  function createObjectStore (name, init, indexes) {
    const store = init
      ? db.createObjectStore(name, init)
      : db.createObjectStore(name)
    if (indexes) {
      Object.keys(indexes).forEach(indexKey => {
        store.createIndex(indexKey, indexes[indexKey])
      })
    }
  }

  createObjectStore(LISTINGS_STORE, { keyPath: 'id' }, {
    [TIMESTAMP]: TIMESTAMP
  })
  done()
}

export const migrations = [
  {
    version: DB_VERSION_INITIAL,
    migration: initialMigration
  },
  {
    version: DB_VERSION_MARKETPLACE,
    migration: migration1_1
  }
]
