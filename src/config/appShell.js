// Shared route classification for the mobile app shell — the bottom tab bar,
// the mobile header, and the page-transition direction logic all need to
// agree on which screens are "tab roots" vs. pushed "detail" screens.

export const TAB_ROOT_PATHS = ['/', '/shop', '/wishlist']

const BACK_ROUTES = [
  { test: /^\/shop\/[^/]+$/, title: null },
  { test: /^\/cart$/, title: 'Your Cart' },
  { test: /^\/checkout$/, title: 'Checkout' },
  { test: /^\/order\/[^/]+$/, title: 'Order Confirmed', backTo: '/' },
  { test: /^\/info$/, title: 'Info' },
  { test: /^\/track$/, title: 'Track Order' },
]

export function getRouteMeta(pathname) {
  if (TAB_ROOT_PATHS.includes(pathname)) {
    return { mode: 'brand' }
  }

  const match = BACK_ROUTES.find((route) => route.test.test(pathname))
  if (match) {
    return { mode: 'back', title: match.title, backTo: match.backTo ?? null }
  }

  return { mode: 'back', title: null, backTo: '/' }
}
