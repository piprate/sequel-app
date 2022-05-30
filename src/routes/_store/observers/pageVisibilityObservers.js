export function pageVisibilityObservers (pageVisibilityHidden) {
  if (!process.browser) {
    return
  }

  document.addEventListener('visibilitychange', () => {
    pageVisibilityHidden.set(document.hidden)
  })
}
