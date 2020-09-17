export function getOrigin(url) {
  return url.split('/')[2]
}

export function filterByOrigin ({origin, visits}) {
  return visits.filter(({url}) => {
    return RegExp(`^${origin}`).test(url)
  })
}

export function mapOrigins(bookmarks) {
  return bookmarks.map(bookmark => bookmark.origin)
}

export function tickIcon(tabId) {
  chrome.browserAction.setIcon({
    path: '/images/tick-16.png',
    tabId
  })
}

export function setDefaultIcon(tabId) {
  chrome.browserAction.setIcon({
    path: '/images/Icon-16.png',
    tabId
  })
}
