import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Logo from './Logo'
import { useCart } from '../context/CartContext'
import './Navbar.css'

const LINKS = [
  { to: '/shop', label: 'Shop' },
  { to: '/#story', label: 'Story' },
  { to: '/#notify', label: 'Contact' },
]

// Only these routes open with a dark hero section behind the navbar —
// everywhere else defaults to the solid/light navbar style so text stays legible.
const DARK_HERO_ROUTES = ['/', '/shop']

function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const { count } = useCart()
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
          <Link to="/cart" className="navbar__cart" aria-label={`Cart, ${count} items`}>
            Cart
            {count > 0 && <span className="navbar__cart-count">{count}</span>}
          </Link>
        </nav>
      </div>
    </header>
  )
}

export default Navbar
