import { mark, stop } from './marks'

const domParser = process.browser && new DOMParser()

// paragraphs should be separated by double newlines
// single <br/>s should become single newlines
function innerTextRetainingNewlines (doc) {
  let res = ''
  const paragraphs = doc.querySelectorAll('p')
  for (let i = 0; i < paragraphs.length; i++) {
    const paragraph = paragraphs[i]
    const brs = paragraph.querySelectorAll('br')
    for (let j = 0; j < brs.length; j++) {
      const br = brs[j]
      br.parentNode.replaceChild(doc.createTextNode('\n'), br)
    }
    res += (i > 0 ? '\n\n' : '') + paragraph.textContent
  }
  return res
}

export function postBodyToPlainText (post) {
  const body = post.body || ''
  if (post.bodyFormat === 'txt') {
    return body
  }
  let html = post.bodyHTML
  if (!html) {
    return ''
  }
  mark('postBodyToPlainText')
  const doc = domParser.parseFromString(html, 'text/html')
  const res = innerTextRetainingNewlines(doc)
  stop('postBodyToPlainText')
  return res
}
