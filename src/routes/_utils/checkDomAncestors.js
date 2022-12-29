// Check if some condition applies for a node or any of its ancestors,
// stopping at an element that returns true for the given stopFunc. Returns
// false if none match
export function checkDomAncestors (node, checkFunc, stopFunc) {
  let thinNode = node
  while (thinNode) {
    if (stopFunc(thinNode)) {
      break
    }
    if (checkFunc(thinNode)) {
      return true
    }
    thinNode = thinNode.parentElement
  }
  return false
}
