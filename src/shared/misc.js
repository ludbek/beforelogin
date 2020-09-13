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
