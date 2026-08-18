import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import ProductGallery from '../components/ProductGallery'
import PriceTag from '../components/PriceTag'
import ProductCard from '../components/ProductCard'
import { useProduct } from '../hooks/useProduct'
import { useProducts } from '../hooks/useProducts'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { STORE_LIVE } from '../config/store'
import { SIZES, CATEGORIES } from '../data/products'
import './ProductDetail.css'

function ProductDetail() {
  const { id } = useParams()
  const { product, loading, error } = useProduct(id)
  const { products } = useProducts()
  const { addItem, openDrawer } = useCart()
  const { isWishlisted, toggleWishlist } = useWishlist()

  const [size, setSize] = useState(null)
  const [added, setAdded] = useState(false)

  const related = useMemo(() => {
    if (!product) return []
    return products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 3)
  }, [products, product])

  function handleAddToCart() {
    if (!size || !product) return
    addItem(product, size)
    setAdded(true)
    openDrawer()
    setTimeout(() => setAdded(false), 1500)
  }

  if (loading) return null

  if (error || !product) {
    return (
      <section className="product-detail-page">
        <div className="container product-detail-empty">
          <h1 className="product-detail-empty__title">Panel not found</h1>
          <p className="product-detail-empty__text">
            This one may have sold out or moved. Take a look at the rest of the drop.
          </p>
          <Link to="/shop" className="btn btn-primary">
            Back to shop
          </Link>
        </div>
      </section>
    )
  }

  const wishlisted = isWishlisted(product.id)
  const categoryLabel = CATEGORIES.find((c) => c.id === product.category)?.label || product.category

  return (
    <section className="product-detail-page">
      <div className="container">
        <Link to="/shop" className="product-detail__back">
          ← Back to shop
        </Link>

        <div className="product-detail__layout">
          <motion.div
            className="product-detail__art-wrap"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <ProductGallery images={product.images} label={product.name} />
            {!STORE_LIVE && <span className="product-detail__badge">Coming Soon</span>}
          </motion.div>

          <motion.div
            className="product-detail__info"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="eyebrow">{categoryLabel}</span>
            <h1 className="product-detail__name">{product.name}</h1>
            <PriceTag mrp={product.mrp} price={product.price} size="lg" />
            <p className="product-detail__desc">{product.desc}</p>

            {STORE_LIVE && (
              <>
                <div className="product-detail__sizes" role="group" aria-label="Select size">
                  {SIZES.map((s) => (
                    <button
                      key={s}
                      type="button"
                      className={`product-detail__size ${size === s ? 'product-detail__size--active' : ''}`}
                      onClick={() => setSize(s)}
                      aria-pressed={size === s}
                    >
                      {s}
                    </button>
                  ))}
                </div>

                <div className="product-detail__actions">
                  <button
                    type="button"
                    className="btn btn-primary product-detail__add"
                    onClick={handleAddToCart}
                    disabled={!size}
                  >
                    {added ? 'Added ✓' : size ? 'Add to Cart' : 'Select a size'}
                  </button>
                  <button
                    type="button"
                    className={`product-detail__wishlist ${wishlisted ? 'product-detail__wishlist--active' : ''}`}
                    onClick={() => toggleWishlist(product.id)}
                    aria-pressed={wishlisted}
                    aria-label={
                      wishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`
                    }
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill={wishlisted ? 'currentColor' : 'none'}
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 20s-7-4.35-9.5-8.5C.5 8 2 4.5 5.5 4c2-.3 3.7.7 4.5 2.2C10.8 4.7 12.5 3.7 14.5 4c3.5.5 5 4 3 7.5C19 15.65 12 20 12 20z"
                      />
                    </svg>
                    Save
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </div>

        {related.length > 0 && (
          <div className="product-detail__related">
            <motion.h2
              className="product-detail__related-title"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              You might also like
            </motion.h2>
            <div className="product-detail__related-grid">
              {related.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </div>
        )}
      </div>

      {STORE_LIVE && (
        <div className="product-detail__mobile-cta">
          <button
            type="button"
            className={`product-detail__mobile-wishlist ${wishlisted ? 'product-detail__mobile-wishlist--active' : ''}`}
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
          <PriceTag mrp={product.mrp} price={product.price} />
          <button
            type="button"
            className="btn btn-primary product-detail__mobile-cta-btn"
            onClick={handleAddToCart}
            disabled={!size}
          >
            {added ? 'Added ✓' : size ? 'Add to Cart' : 'Select a size'}
          </button>
        </div>
      )}
    </section>
  )
}

export default ProductDetail
