import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion, useDragControls } from 'framer-motion'
import { useCart } from '../context/CartContext'
import { getShippingFee } from '../config/store'
import './CartDrawer.css'

const MOBILE_QUERY = '(max-width: 720px)'
const DISMISS_DRAG_THRESHOLD = 120

function CartDrawer() {
  const { items, subtotal, removeItem, updateQty, drawerOpen, closeDrawer } = useCart()
  const shippingFee = getShippingFee(subtotal)
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(MOBILE_QUERY).matches,
  )
  const dragControls = useDragControls()

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_QUERY)
    const onChange = () => setIsMobile(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    if (!drawerOpen) return

    function handleKeyDown(e) {
      if (e.key === 'Escape') closeDrawer()
    }
    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [drawerOpen, closeDrawer])

  function handleSheetDragEnd(_, info) {
    if (isMobile && info.offset.y > DISMISS_DRAG_THRESHOLD) closeDrawer()
  }

  return (
    <AnimatePresence>
      {drawerOpen && (
        <>
          <motion.div
            className="cart-drawer__backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeDrawer}
          />
          <motion.div
            className={`cart-drawer ${isMobile ? 'cart-drawer--sheet' : ''}`}
            role="dialog"
            aria-modal="true"
            aria-label="Cart"
            initial={isMobile ? { y: '100%' } : { x: '100%' }}
            animate={isMobile ? { y: 0 } : { x: 0 }}
            exit={isMobile ? { y: '100%' } : { x: '100%' }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            drag={isMobile ? 'y' : false}
            dragListener={false}
            dragControls={dragControls}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.5 }}
            onDragEnd={handleSheetDragEnd}
          >
            {isMobile && (
              <div
                className="cart-drawer__handle-wrap"
                onPointerDown={(e) => dragControls.start(e)}
              >
                <div className="cart-drawer__handle" />
              </div>
            )}
            <div className="cart-drawer__header">
              <h2>Your Cart</h2>
              <button type="button" className="cart-drawer__close" onClick={closeDrawer} aria-label="Close cart">
                ×
              </button>
            </div>

            {items.length === 0 ? (
              <div className="cart-drawer__empty">
                <p>Nothing here yet — go find a panel worth wearing.</p>
                <Link to="/shop" className="btn btn-primary" onClick={closeDrawer}>
                  Browse the shop
                </Link>
              </div>
            ) : (
              <>
                <div className="cart-drawer__items">
                  {items.map((item) => (
                    <div key={item.key} className="cart-drawer__item">
                      <div className="cart-drawer__item-info">
                        <span className="cart-drawer__item-name">{item.name}</span>
                        <span className="cart-drawer__item-size">Size {item.size}</span>
                      </div>
                      <div className="cart-drawer__item-actions">
                        <div className="cart-drawer__qty">
                          <button type="button" onClick={() => updateQty(item.key, item.qty - 1)} aria-label="Decrease quantity">
                            −
                          </button>
                          <span>{item.qty}</span>
                          <button type="button" onClick={() => updateQty(item.key, item.qty + 1)} aria-label="Increase quantity">
                            +
                          </button>
                        </div>
                        <span className="cart-drawer__item-price">₹{item.price * item.qty}</span>
                        <button
                          type="button"
                          className="cart-drawer__remove"
                          onClick={() => removeItem(item.key)}
                          aria-label={`Remove ${item.name} (${item.size})`}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="cart-drawer__footer">
                  <div className="cart-drawer__row">
                    <span>Subtotal</span>
                    <span>₹{subtotal}</span>
                  </div>
                  <div className="cart-drawer__row cart-drawer__row--muted">
                    <span>Shipping</span>
                    <span>{shippingFee === 0 ? 'Free' : `₹${shippingFee}`}</span>
                  </div>
                  <Link to="/checkout" className="btn btn-primary cart-drawer__checkout" onClick={closeDrawer}>
                    Checkout — ₹{subtotal + shippingFee}
                  </Link>
                  <Link to="/cart" className="cart-drawer__view-cart" onClick={closeDrawer}>
                    View full cart
                  </Link>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default CartDrawer
