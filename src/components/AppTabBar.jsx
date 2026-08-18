import { NavLink, useLocation } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { getRouteMeta } from '../config/appShell'
import './AppTabBar.css'

function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 11.5 12 4l9 7.5" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M5.5 10v9a1 1 0 0 0 1 1H9a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h2.5a1 1 0 0 0 1-1v-9" />
    </svg>
  )
}

function ShopIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3.5" y="3.5" width="7.5" height="7.5" rx="1.2" />
      <rect x="13" y="3.5" width="7.5" height="7.5" rx="1.2" />
      <rect x="3.5" y="13" width="7.5" height="7.5" rx="1.2" />
      <rect x="13" y="13" width="7.5" height="7.5" rx="1.2" />
    </svg>
  )
}

function HeartIcon({ filled }) {
  return (
    <svg viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 20s-7-4.35-9.5-8.5C.5 8 2 4.5 5.5 4c2-.3 3.7.7 4.5 2.2C10.8 4.7 12.5 3.7 14.5 4c3.5.5 5 4 3 7.5C19 15.65 12 20 12 20z"
      />
    </svg>
  )
}

function BagIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 8h12l-1 12.5a1 1 0 0 1-1 .9H8a1 1 0 0 1-1-.9L6 8Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 8V6.5a3 3 0 0 1 6 0V8" />
    </svg>
  )
}

function AppTabBar() {
  const { pathname } = useLocation()
  const { count: cartCount, openDrawer } = useCart()
  const { count: wishlistCount } = useWishlist()

  if (getRouteMeta(pathname).mode !== 'brand') return null

  return (
    <nav className="app-tab-bar" aria-label="Primary">
      <NavLink to="/" end className={({ isActive }) => `app-tab-bar__item ${isActive ? 'app-tab-bar__item--active' : ''}`}>
        <HomeIcon />
        <span>Home</span>
      </NavLink>
      <NavLink to="/shop" className={({ isActive }) => `app-tab-bar__item ${isActive ? 'app-tab-bar__item--active' : ''}`}>
        <ShopIcon />
        <span>Shop</span>
      </NavLink>
      <NavLink to="/wishlist" className={({ isActive }) => `app-tab-bar__item ${isActive ? 'app-tab-bar__item--active' : ''}`}>
        <span className="app-tab-bar__icon-wrap">
          <HeartIcon filled={pathname === '/wishlist'} />
          {wishlistCount > 0 && <span className="app-tab-bar__badge">{wishlistCount}</span>}
        </span>
        <span>Wishlist</span>
      </NavLink>
      <button type="button" className="app-tab-bar__item" onClick={openDrawer} aria-label={`Cart, ${cartCount} items`}>
        <span className="app-tab-bar__icon-wrap">
          <BagIcon />
          {cartCount > 0 && <span className="app-tab-bar__badge">{cartCount}</span>}
        </span>
        <span>Cart</span>
      </button>
    </nav>
  )
}

export default AppTabBar
