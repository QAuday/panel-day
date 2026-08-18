import { STORE_UPI_ID, STORE_WHATSAPP_NUMBER } from '../config/store'
import './OrderDetails.css'

const FULFILLMENT_LABELS = {
  processing: 'Processing',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
}

function OrderDetails({ order }) {
  const isPaid = order.status === 'paid'
  const itemsTotal = order.items.reduce((sum, item) => sum + item.price * item.qty, 0)

  return (
    <div className="order-details">
      <div className="order-details__items">
        {order.items.map((item) => (
          <div key={item.id} className="order-details__row">
            <span>
              {item.name} {item.size && `(${item.size})`} × {item.qty}
            </span>
            <span>₹{item.price * item.qty}</span>
          </div>
        ))}
        <div className="order-details__row">
          <span>Shipping</span>
          <span>{order.shippingFee === 0 ? 'Free' : `₹${order.shippingFee}`}</span>
        </div>
        {order.discountAmount > 0 && (
          <div className="order-details__row">
            <span>Coupon ({order.couponCode})</span>
            <span>-₹{order.discountAmount}</span>
          </div>
        )}
        {order.storeCreditUsed > 0 && (
          <div className="order-details__row">
            <span>Store credit used</span>
            <span>-₹{order.storeCreditUsed}</span>
          </div>
        )}
        <div className="order-details__row order-details__row--total">
          <span>Total</span>
          <span>
            ₹{itemsTotal + order.shippingFee - order.discountAmount - order.storeCreditUsed}
          </span>
        </div>
      </div>

      <div className="order-details__status">
        <span className="order-details__status-label">Fulfillment status</span>
        <span
          className={`order-details__badge order-details__badge--${order.fulfillmentStatus}`}
        >
          {FULFILLMENT_LABELS[order.fulfillmentStatus] || order.fulfillmentStatus}
        </span>
      </div>

      {order.trackingNumber && (
        <p className="order-details__tracking">
          {order.carrierName ? `${order.carrierName} — ` : ''}Tracking number:{' '}
          <strong>{order.trackingNumber}</strong>
        </p>
      )}

      {!isPaid && order.paymentMethod === 'manual' && (
        <div className="order-details__manual">
          <h2>Complete your payment</h2>
          <p>
            Pay via UPI to <strong>{STORE_UPI_ID}</strong>, or message us on WhatsApp at{' '}
            <strong>{STORE_WHATSAPP_NUMBER}</strong> to arrange Cash on Delivery. We'll
            confirm your order once payment is received.
          </p>
        </div>
      )}

      {isPaid && (
        <p className="order-details__paid-note">
          Payment confirmed — we'll email you at {order.email} when your order ships.
        </p>
      )}
    </div>
  )
}

export default OrderDetails
