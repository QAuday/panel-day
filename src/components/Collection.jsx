import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import ProductCard from './ProductCard'
import { useProducts } from '../hooks/useProducts'
import './Collection.css'

function Collection() {
  const { products, loading } = useProducts()
  const preview = products.slice(0, 3)

  return (
    <section id="collection" className="collection">
      <div className="container">
        <motion.div
          className="collection__header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="eyebrow">The First Drop</span>
          <h2 className="collection__title">Panel 01 — 03</h2>
        </motion.div>

        {!loading && (
          <div className="collection__grid">
            {preview.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        )}

        <motion.div
          className="collection__footer"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Link to="/shop" className="btn btn-primary">
            View full shop
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

export default Collection
