import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { loadRazorpayScript } from '../lib/loadRazorpay'
import './Checkout.css'

const EMPTY_FORM = {
  customerName: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  pincode: '',
}

function Checkout() {
  const { items, subtotal, clear } = useCart()
  const navigate = useNavigate()
  const [form, setForm] = useState(EMPTY_FORM)
  const [paymentMethod, setPaymentMethod] = useState('manual')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleManualSubmit(orderPayload) {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderPayload),
    })
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      throw new Error(data.error || 'Could not place order')
    }
    const order = await res.json()
    clear()
    navigate(`/order/${order.id}`)
  }

  async function handleRazorpaySubmit(orderPayload) {
    const createRes = await fetch('/api/payments/razorpay/order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderPayload),
    })
    if (!createRes.ok) {
      const data = await createRes.json().catch(() => ({}))
      throw new Error(data.error || 'Could not start payment')
    }
    const { orderId, razorpayOrderId, amount, currency, keyId } = await createRes.json()

    await loadRazorpayScript()

    const rzp = new window.Razorpay({
      key: keyId,
      order_id: razorpayOrderId,
      amount,
      currency,
      name: 'Panel Day',
      description: 'Order payment',
      prefill: {
        name: orderPayload.customerName,
        email: orderPayload.email,
        contact: orderPayload.phone,
      },
      theme: { color: '#dc2626' },
      handler: async function (response) {
        try {
          const verifyRes = await fetch('/api/payments/razorpay/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderId, ...response }),
          })
          if (!verifyRes.ok) throw new Error('Payment verification failed')
          clear()
          navigate(`/order/${orderId}`)
        } catch (err) {
          setError(err.message)
          setSubmitting(false)
        }
      },
      modal: {
        ondismiss: () => setSubmitting(false),
      },
    })

    rzp.open()
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)

    const orderPayload = {
      ...form,
      items: items.map((item) => ({
        productId: item.productId,
        name: item.name,
        price: item.price,
        qty: item.qty,
      })),
    }

    try {
      if (paymentMethod === 'razorpay') {
        await handleRazorpaySubmit(orderPayload)
      } else {
        await handleManualSubmit(orderPayload)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      if (paymentMethod !== 'razorpay') setSubmitting(false)
    }
  }

  if (items.length === 0) {
    return (
      <section className="checkout-page">
        <div className="container checkout-empty">
          <h1 className="checkout-page__title">Nothing to check out</h1>
          <Link to="/shop" className="btn btn-primary">
            Browse the shop
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className="checkout-page">
      <div className="container checkout-layout">
        <form className="checkout-form" onSubmit={handleSubmit}>
          <h1 className="checkout-page__title">Checkout</h1>

          <div className="checkout-field">
            <label htmlFor="customerName">Full name</label>
            <input id="customerName" name="customerName" required value={form.customerName} onChange={handleChange} />
          </div>

          <div className="checkout-field-row">
            <div className="checkout-field">
              <label htmlFor="email">Email</label>
              <input id="email" type="email" name="email" required value={form.email} onChange={handleChange} />
            </div>
            <div className="checkout-field">
              <label htmlFor="phone">Phone</label>
              <input id="phone" name="phone" required value={form.phone} onChange={handleChange} />
            </div>
          </div>

          <div className="checkout-field">
            <label htmlFor="address">Address</label>
            <input id="address" name="address" required value={form.address} onChange={handleChange} />
          </div>

          <div className="checkout-field-row">
            <div className="checkout-field">
              <label htmlFor="city">City</label>
              <input id="city" name="city" required value={form.city} onChange={handleChange} />
            </div>
            <div className="checkout-field">
              <label htmlFor="state">State</label>
              <input id="state" name="state" required value={form.state} onChange={handleChange} />
            </div>
            <div className="checkout-field">
              <label htmlFor="pincode">Pincode</label>
              <input id="pincode" name="pincode" required value={form.pincode} onChange={handleChange} />
            </div>
          </div>

          <fieldset className="checkout-payment">
            <legend>Payment method</legend>
            <label className="checkout-payment__option">
              <input
                type="radio"
                name="paymentMethod"
                value="manual"
                checked={paymentMethod === 'manual'}
                onChange={() => setPaymentMethod('manual')}
              />
              Pay via UPI / Cash on Delivery (we'll confirm with you directly)
            </label>
            <label className="checkout-payment__option">
              <input
                type="radio"
                name="paymentMethod"
                value="razorpay"
                checked={paymentMethod === 'razorpay'}
                onChange={() => setPaymentMethod('razorpay')}
              />
              Pay online now (cards / UPI / netbanking)
            </label>
          </fieldset>

          {error && <p className="checkout-error">{error}</p>}

          <button type="submit" className="btn btn-primary checkout-submit" disabled={submitting}>
            {submitting ? 'Processing…' : `Place order — $${subtotal}`}
          </button>
        </form>

        <aside className="checkout-summary">
          <h2 className="checkout-summary__title">Order summary</h2>
          {items.map((item) => (
            <div key={item.productId} className="checkout-summary__row">
              <span>
                {item.name} × {item.qty}
              </span>
              <span>${item.price * item.qty}</span>
            </div>
          ))}
          <div className="checkout-summary__row checkout-summary__total">
            <span>Total</span>
            <span>${subtotal}</span>
          </div>
        </aside>
      </div>
    </section>
  )
}

export default Checkout
