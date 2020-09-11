export function filterByOrigin ({origin, visits}) {
  return visits.filter(({url}) => {
    return RegExp(`^${origin}`).test(url)
  })
}

