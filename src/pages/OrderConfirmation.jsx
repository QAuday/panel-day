import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { STORE_UPI_ID, STORE_WHATSAPP_NUMBER } from '../config/store'
import './OrderConfirmation.css'

function OrderConfirmation() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch(`/api/orders/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Order not found')
        return res.json()
      })
      .then(setOrder)
      .catch((err) => setError(err.message))
  }, [id])

  if (error) {
    return (
      <section className="confirmation-page">
        <div className="container confirmation-empty">
          <h1 className="confirmation-page__title">Order not found</h1>
          <Link to="/shop" className="btn btn-primary">
            Back to shop
          </Link>
        </div>
      </section>
    )
  }

  if (!order) return null

  const isPaid = order.status === 'paid'

  return (
    <section className="confirmation-page">
      <div className="container">
        <span className="eyebrow">
          {isPaid ? 'Payment received' : 'Order placed'}
        </span>
        <h1 className="confirmation-page__title">Thanks, {order.customerName.split(' ')[0]}.</h1>
        <p className="confirmation-page__order-id">Order #{order.id}</p>

        <div className="confirmation-items">
          {order.items.map((item) => (
            <div key={item.id} className="confirmation-items__row">
              <span>
                {item.name} × {item.qty}
              </span>
              <span>${item.price * item.qty}</span>
            </div>
          ))}
        </div>

        {!isPaid && order.paymentMethod === 'manual' && (
          <div className="confirmation-manual">
            <h2>Complete your payment</h2>
            <p>
              Pay via UPI to <strong>{STORE_UPI_ID}</strong>, or message us on WhatsApp
              at <strong>{STORE_WHATSAPP_NUMBER}</strong> to arrange Cash on Delivery.
              We'll confirm your order once payment is received.
            </p>
          </div>
        )}

        {isPaid && (
          <p className="confirmation-paid-note">
            Payment confirmed — we'll email you at {order.email} when your order ships.
          </p>
        )}

        <Link to="/shop" className="btn btn-primary">
          Continue shopping
        </Link>
      </div>
    </section>
  )
}

export default OrderConfirmation
