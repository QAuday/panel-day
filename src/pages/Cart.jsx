import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { getShippingFee, STORE_FREE_SHIPPING_THRESHOLD } from '../config/store'
import './Cart.css'

function Cart() {
  const { items, removeItem, updateQty, subtotal } = useCart()
  const shippingFee = getShippingFee(subtotal)
  const remainingForFreeShipping = STORE_FREE_SHIPPING_THRESHOLD - subtotal

  if (items.length === 0) {
    return (
      <section className="cart-page">
        <div className="container cart-empty">
          <h1 className="cart-page__title">Your cart is empty</h1>
          <p className="cart-empty__text">
            Nothing here yet — go find a panel worth wearing.
          </p>
          <Link to="/shop" className="btn btn-primary">
            Browse the shop
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className="cart-page">
      <div className="container">
        <h1 className="cart-page__title cart-page__title--repeats-header">Your Cart</h1>

        <div className="cart-list">
          {items.map((item) => (
            <div key={item.key} className="cart-item">
              <div className="cart-item__info">
                <span className="cart-item__name">{item.name}</span>
                <span className="cart-item__size">Size {item.size}</span>
                <span className="cart-item__price">₹{item.price}</span>
              </div>
              <div className="cart-item__actions">
                <div className="cart-item__qty">
                  <button
                    type="button"
                    onClick={() => updateQty(item.key, item.qty - 1)}
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <span>{item.qty}</span>
                  <button
                    type="button"
                    onClick={() => updateQty(item.key, item.qty + 1)}
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
                <button
                  type="button"
                  className="cart-item__remove"
                  onClick={() => removeItem(item.key)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          {remainingForFreeShipping > 0 && (
            <p className="cart-summary__free-shipping-note">
              Add ₹{remainingForFreeShipping} more to get free shipping.
            </p>
          )}
          <div className="cart-summary__row cart-summary__row--sub">
            <span>Subtotal</span>
            <span>₹{subtotal}</span>
          </div>
          <div className="cart-summary__row cart-summary__row--sub">
            <span>Shipping</span>
            <span>{shippingFee === 0 ? 'Free' : `₹${shippingFee}`}</span>
          </div>
          <div className="cart-summary__row">
            <span>Total</span>
            <span>₹{subtotal + shippingFee}</span>
          </div>
          <Link to="/checkout" className="btn btn-primary cart-summary__checkout">
            Proceed to checkout
          </Link>
        </div>
      </div>

      <div className="cart-page__mobile-cta">
        <div className="cart-page__mobile-total">
          <span>Total</span>
          <strong>₹{subtotal + shippingFee}</strong>
        </div>
        <Link to="/checkout" className="btn btn-primary">
          Checkout
        </Link>
      </div>
    </section>
  )
}

export default Cart
