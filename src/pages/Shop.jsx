import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import ProductCard from '../components/ProductCard'
import Newsletter from '../components/Newsletter'
import { useProducts } from '../hooks/useProducts'
import { CATEGORIES } from '../data/products'
import './Shop.css'

function Shop() {
  const [activeCategory, setActiveCategory] = useState('all')
  const { products, loading, error } = useProducts()

  const visibleProducts = useMemo(() => {
    if (activeCategory === 'all') return products
    return products.filter((product) => product.category === activeCategory)
  }, [products, activeCategory])

  return (
    <>
      <section className="shop-hero">
        <div className="container">
          <motion.span
            className="eyebrow"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            First Drop
          </motion.span>
          <motion.h1
            className="shop-hero__title"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            The Shop
          </motion.h1>
          <motion.p
            className="shop-hero__subtitle"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            Original graphic tees, printed — not licensed. Every panel below
            is part of our upcoming first drop.
          </motion.p>
        </div>
      </section>

      <section className="shop-grid-section">
        <div className="container">
          <div className="shop-filters">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                className={`shop-filter ${activeCategory === cat.id ? 'shop-filter--active' : ''}`}
                onClick={() => setActiveCategory(cat.id)}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {error && <p className="shop-status">Couldn't load products — is the backend running?</p>}
          {!error && loading && <p className="shop-status">Loading…</p>}

          <div className="shop-grid">
            {visibleProducts.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        </div>
      </section>

      <Newsletter />
    </>
  )
}

export default Shop
