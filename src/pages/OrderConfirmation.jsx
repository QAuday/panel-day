import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import OrderDetails from '../components/OrderDetails'
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
        <p className="confirmation-page__track-note">
          Save this order ID — you can look up your order anytime at{' '}
          <Link to="/track">Track Order</Link> using it and your email.
        </p>

        <OrderDetails order={order} />

        <Link to="/shop" className="btn btn-primary">
          Continue shopping
        </Link>
      </div>
    </section>
  )
}

export default OrderConfirmation
