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
  DB_VERSION_NAME_INDEX,
  ENTITY_STORE,
  DB_VERSION_TIMELINES_KEY_UPDATE
} from './constants'
import { mergeKeyWithSparkId } from './keys'

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

function nameIndexMigration (db, tx, done) {
  tx.objectStore(BUBBLES_STORE).createIndex(NAME_LOWERCASE, NAME_LOWERCASE)
  tx.objectStore(WORLDS_STORE).createIndex(NAME_LOWERCASE, NAME_LOWERCASE)

  done()
}

function timelinesKeyMigration (db, tx, done) {
  tx.objectStore(POST_TIMELINES_STORE).createIndex(mergeKeyWithSparkId('postId'), '')
  tx.objectStore(POST_TIMELINES_STORE).deleteIndex('postId')
  tx.objectStore(THREADS_STORE).createIndex(mergeKeyWithSparkId('postId'), '')
  tx.objectStore(THREADS_STORE).deleteIndex('postId')
  tx.objectStore(NOTIFICATION_TIMELINES_STORE).createIndex(mergeKeyWithSparkId('notificationId'), '')
  tx.objectStore(NOTIFICATION_TIMELINES_STORE).deleteIndex('notificationId')

  db.deleteObjectStore(BUBBLE_RELATIONSHIPS_STORE)
  const bubbleRelationShipsStore = db.createObjectStore(BUBBLE_RELATIONSHIPS_STORE, null)
  bubbleRelationShipsStore.createIndex(TIMESTAMP, TIMESTAMP)

  db.deleteObjectStore(RELATIONSHIPS_STORE)
  const sparkRelationsStore = db.createObjectStore(RELATIONSHIPS_STORE, null)
  sparkRelationsStore.createIndex(TIMESTAMP, TIMESTAMP)

  db.deleteObjectStore(WORLD_RELATIONSHIPS_STORE)
  const worldRelationsStore = db.createObjectStore(WORLD_RELATIONSHIPS_STORE, null)
  worldRelationsStore.createIndex(TIMESTAMP, TIMESTAMP)

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
  },
  {
    version: DB_VERSION_NAME_INDEX,
    migration: nameIndexMigration
  },
  {
    version: DB_VERSION_TIMELINES_KEY_UPDATE,
    migration: timelinesKeyMigration
  }
]
