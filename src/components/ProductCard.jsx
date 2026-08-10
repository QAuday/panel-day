import { useRef, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import TeePlaceholder from './TeePlaceholder'
import { useCart } from '../context/CartContext'
import { STORE_LIVE } from '../config/store'
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
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)

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
    addItem(product)
    setAdded(true)
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
      <div className="product-card__info">
        <div className="product-card__row">
          <h3 className="product-card__name">{product.name}</h3>
          <span className="product-card__price">${product.price}</span>
        </div>
        <p className="product-card__desc">{product.desc}</p>
        {STORE_LIVE && (
          <button type="button" className="product-card__add" onClick={handleAddToCart}>
            {added ? 'Added ✓' : 'Add to Cart'}
          </button>
        )}
      </div>
    </motion.article>
  )
}

export default ProductCard
