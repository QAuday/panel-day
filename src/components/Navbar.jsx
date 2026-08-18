import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Logo from './Logo'
import FestivalBanner from './FestivalBanner'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import './Navbar.css'

const LINKS = [
  { to: '/shop', label: 'Shop' },
  { to: '/#story', label: 'Story' },
  { to: '/info', label: 'Info' },
]

// Only these routes open with a dark hero section behind the navbar —
// everywhere else defaults to the solid/light navbar style so text stays legible.
const DARK_HERO_ROUTES = ['/', '/shop']

function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const { count, openDrawer } = useCart()
  const { count: wishlistCount } = useWishlist()
  const { pathname } = useLocation()
  const hasDarkHero = DARK_HERO_ROUTES.includes(pathname)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const showLightStyle = scrolled || !hasDarkHero

  return (
    <header className={`navbar ${showLightStyle ? 'navbar--scrolled' : ''}`}>
      <FestivalBanner />
      <div className="container navbar__inner">
        <Link to="/" className="navbar__logo">
          <Logo size={30} />
        </Link>
        <nav className="navbar__links">
          {LINKS.map((link) => (
            <Link key={link.to} to={link.to}>
              {link.label}
            </Link>
          ))}
          <Link
            to="/wishlist"
            className="navbar__cart"
            aria-label={`Wishlist, ${wishlistCount} items`}
          >
            Wishlist
            {wishlistCount > 0 && <span className="navbar__cart-count">{wishlistCount}</span>}
          </Link>
          <button
            type="button"
            className="navbar__cart"
            onClick={openDrawer}
            aria-label={`Cart, ${count} items`}
          >
            Cart
            {count > 0 && <span className="navbar__cart-count">{count}</span>}
          </button>
        </nav>
      </div>
    </header>
  )
}

export default Navbar
