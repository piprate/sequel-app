export function fetchSpark (sparksStore, id, callback) {
  sparksStore.get(id).onsuccess = e => {
    callback(e.target.result)
  }
}
