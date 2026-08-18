import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import ProductCard from '../components/ProductCard'
import { useProducts } from '../hooks/useProducts'
import { useWishlist } from '../context/WishlistContext'
import './Wishlist.css'

function Wishlist() {
  const { products, loading, error } = useProducts()
  const { productIds } = useWishlist()

  const wishlistedProducts = useMemo(
    () => products.filter((product) => productIds.includes(product.id)),
    [products, productIds]
  )

  return (
    <section className="wishlist-page">
      <div className="container">
        <motion.span
          className="eyebrow"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          Saved for Later
        </motion.span>
        <motion.h1
          className="wishlist-page__title"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          Your Wishlist
        </motion.h1>

        {!error && loading && <p className="wishlist-page__status">Loading…</p>}
        {error && (
          <p className="wishlist-page__status">Couldn't load products — is the backend running?</p>
        )}

        {!loading && !error && wishlistedProducts.length === 0 && (
          <div className="wishlist-empty">
            <p className="wishlist-empty__text">
              Nothing saved yet — tap the heart on any tee to keep it here.
            </p>
            <Link to="/shop" className="btn btn-primary">
              Browse the shop
            </Link>
          </div>
        )}

        {wishlistedProducts.length > 0 && (
          <div className="wishlist-grid">
            {wishlistedProducts.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default Wishlist
