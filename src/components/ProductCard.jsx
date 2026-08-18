import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import TeePlaceholder from './TeePlaceholder'
import PriceTag from './PriceTag'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { STORE_LIVE } from '../config/store'
import { SIZES } from '../data/products'
import './ProductCard.css'

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] },
  }),
}

const TILT_DEGREES = 9

function ProductCard({ product, index = 0 }) {
  const containerRef = useRef(null)
  const rotateX = useMotionValue(0)
  const rotateY = useMotionValue(0)
  const springX = useSpring(rotateX, { stiffness: 180, damping: 18, mass: 0.6 })
  const springY = useSpring(rotateY, { stiffness: 180, damping: 18, mass: 0.6 })
  const { addItem, openDrawer } = useCart()
  const { isWishlisted, toggleWishlist } = useWishlist()
  const [added, setAdded] = useState(false)
  const [size, setSize] = useState(null)
  const wishlisted = isWishlisted(product.id)

  function handleMouseMove(e) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const el = containerRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width
    const py = (e.clientY - rect.top) / rect.height
    rotateY.set((px - 0.5) * TILT_DEGREES * 2)
    rotateX.set((0.5 - py) * TILT_DEGREES * 2)
    el.style.setProperty('--sheen-x', `${px * 100}%`)
    el.style.setProperty('--sheen-y', `${py * 100}%`)
  }

  function handleMouseLeave() {
    rotateX.set(0)
    rotateY.set(0)
  }

  function handleAddToCart() {
    if (!size) return
    addItem(product, size)
    setAdded(true)
    openDrawer()
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <motion.article
      className="product-card"
      custom={index}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
      variants={fadeUp}
    >
      <Link to={`/shop/${product.id}`} className="product-card__art-link">
        <div
          ref={containerRef}
          className="product-card__art"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <motion.div
            className="product-card__tilt"
            style={{ rotateX: springX, rotateY: springY }}
          >
            <div className="product-card__sheen" />
            <TeePlaceholder label={product.name} />
          </motion.div>
          {!STORE_LIVE && <span className="product-card__badge">Coming Soon</span>}
        </div>
      </Link>
      <button
        type="button"
        className={`product-card__wishlist ${wishlisted ? 'product-card__wishlist--active' : ''}`}
        onClick={() => toggleWishlist(product.id)}
        aria-pressed={wishlisted}
        aria-label={wishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
      >
        <svg viewBox="0 0 24 24" fill={wishlisted ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 20s-7-4.35-9.5-8.5C.5 8 2 4.5 5.5 4c2-.3 3.7.7 4.5 2.2C10.8 4.7 12.5 3.7 14.5 4c3.5.5 5 4 3 7.5C19 15.65 12 20 12 20z"
          />
        </svg>
      </button>
      <div className="product-card__info">
        <div className="product-card__row">
          <Link to={`/shop/${product.id}`} className="product-card__name-link">
            <h3 className="product-card__name">{product.name}</h3>
          </Link>
          <PriceTag mrp={product.mrp} price={product.price} />
        </div>
        <p className="product-card__desc">{product.desc}</p>
        {STORE_LIVE && (
          <>
            <div className="product-card__sizes" role="group" aria-label="Select size">
              {SIZES.map((s) => (
                <button
                  key={s}
                  type="button"
                  className={`product-card__size ${size === s ? 'product-card__size--active' : ''}`}
                  onClick={() => setSize(s)}
                  aria-pressed={size === s}
                >
                  {s}
                </button>
              ))}
            </div>
            <button
              type="button"
              className="product-card__add"
              onClick={handleAddToCart}
              disabled={!size}
            >
              {added ? 'Added ✓' : size ? 'Add to Cart' : 'Select a size'}
            </button>
          </>
        )}
      </div>
    </motion.article>
  )
}

export default ProductCard
