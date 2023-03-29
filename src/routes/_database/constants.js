export const POSTS_STORE = 'posts'
export const POST_TIMELINES_STORE = 'post_timelines'
export const META_STORE = 'meta-v4'
export const SPARKS_STORE = 'sparks'
export const RELATIONSHIPS_STORE = 'relationships-v4'
export const WORLDS_STORE = 'worlds'
export const WORLD_RELATIONSHIPS_STORE = 'world_relationships'
export const BUBBLES_STORE = 'bubbles'
export const BUBBLE_RELATIONSHIPS_STORE = 'bubble_relationships'
export const LISTINGS_STORE = 'listings'
export const DIGITAL_ARTS_STORE = 'digital_arts'
export const NOTIFICATIONS_STORE = 'notifications-v4'
export const NOTIFICATION_TIMELINES_STORE = 'notification_timelines-v4'
export const PINNED_POSTS_STORE = 'pinned_posts'
export const THREADS_STORE = 'threads-v4'
export const ENTITY_STORE = 'entities'

export const TIMESTAMP = '__sequel_ts'
export const SPARK_ID = '__sequel_spark_id'
export const BUBBLE_ID = '__sequel_bubble_id'
export const WORLD_ID = '__sequel_world_id'
export const POST_ID = '__sequel_post_id'
export const ACTOR_ID = '__sequel_actor_id'
export const NAME_LOWERCASE = '__sequel_name_lc'

export const DB_VERSION_INITIAL = 1
export const DB_VERSION_MARKETPLACE = 2
export const DB_VERSION_NFT = 3
export const DB_VERSION_ENTITY = 4
export const DB_VERSION_NAME_INDEX = 5
export const DB_VERSION_TIMELINES_KEY_UPDATE = 6

// Using an object for these so that unit tests can change them
export const DB_VERSION_CURRENT = { version: 6 }
export const CURRENT_TIME = { now: () => Date.now() }
