import {
  DB_VERSION_INITIAL,
  DB_VERSION_MARKETPLACE,
  DB_VERSION_NFT,
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
  NAME_LOWERCASE,
  WORLDS_STORE,
  LISTINGS_STORE,
  DIGITAL_ARTS_STORE,
  WORLD_RELATIONSHIPS_STORE,
  BUBBLES_STORE,
  BUBBLE_RELATIONSHIPS_STORE,
  DB_VERSION_ENTITY,
  ENTITY_STORE
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
    [NAME_LOWERCASE]: NAME_LOWERCASE
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

function migration3 (db, tx, done) {
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

  createObjectStore(DIGITAL_ARTS_STORE, { keyPath: 'id' }, {
    [TIMESTAMP]: TIMESTAMP
  })
  done()
}

function entityMigration (db, tx, done) {
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

  createObjectStore(ENTITY_STORE, { keyPath: 'id' }, {
    [TIMESTAMP]: TIMESTAMP,
    [NAME_LOWERCASE]: NAME_LOWERCASE
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
  },
  {
    version: DB_VERSION_NFT,
    migration: migration3
  },
  {
    version: DB_VERSION_ENTITY,
    migration: entityMigration
  }
]
