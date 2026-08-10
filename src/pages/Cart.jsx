import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import './Cart.css'

function Cart() {
  const { items, removeItem, updateQty, subtotal } = useCart()

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
        <h1 className="cart-page__title">Your Cart</h1>

        <div className="cart-list">
          {items.map((item) => (
            <div key={item.productId} className="cart-item">
              <div className="cart-item__info">
                <span className="cart-item__name">{item.name}</span>
                <span className="cart-item__price">${item.price}</span>
              </div>
              <div className="cart-item__actions">
                <div className="cart-item__qty">
                  <button
                    type="button"
                    onClick={() => updateQty(item.productId, item.qty - 1)}
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <span>{item.qty}</span>
                  <button
                    type="button"
                    onClick={() => updateQty(item.productId, item.qty + 1)}
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
                <button
                  type="button"
                  className="cart-item__remove"
                  onClick={() => removeItem(item.productId)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <div className="cart-summary__row">
            <span>Subtotal</span>
            <span>${subtotal}</span>
          </div>
          <Link to="/checkout" className="btn btn-primary cart-summary__checkout">
            Proceed to checkout
          </Link>
        </div>
      </div>
    </section>
  )
}

export default Cart
