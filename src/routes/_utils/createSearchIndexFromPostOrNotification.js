let domParser

// copy-pasta'd from
// https://github.com/tootsuite/mastodon/blob/2ff01f7/app/javascript/mastodon/actions/importer/normalizer.js#L58-L75
export const createSearchIndexFromPostOrNotification = (postOrNotification) => {
  const post = postOrNotification.subjectPost || postOrNotification // post on a notification
  domParser = domParser || new DOMParser()
  const spoilerText = post.spoiler_text || ''
  const searchContent = [spoilerText, post.body]
    .join('\n\n')
    .replace(/<br\s*\/?>/g, '\n')
    .replace(/<\/p><p>/g, '\n\n')
  return domParser.parseFromString(searchContent, 'text/html').documentElement.textContent
}
