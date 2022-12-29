import { inNode } from "../../_utils/browserOrNode"

export function pageVisibilityObservers (pageVisibilityHidden) {
  if (inNode()) {
    return
  }

  document.addEventListener('visibilitychange', () => {
    pageVisibilityHidden.set(document.hidden)
  })
}
