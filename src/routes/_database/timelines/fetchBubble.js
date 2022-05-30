export function fetchBubble (bubblesStore, id, callback) {
  bubblesStore.get(id).onsuccess = e => {
    callback(e.target.result)
  }
}
