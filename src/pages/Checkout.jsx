import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { loadRazorpayScript } from '../lib/loadRazorpay'
import { getShippingFee } from '../config/store'
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

  const [couponInput, setCouponInput] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState(null)
  const [couponError, setCouponError] = useState(null)
  const [couponLoading, setCouponLoading] = useState(false)

  const [storeCreditBalance, setStoreCreditBalance] = useState(null)
  const [useStoreCredit, setUseStoreCredit] = useState(false)

  const shippingFee = getShippingFee(subtotal)
  const itemsQty = items.reduce((sum, item) => sum + item.qty, 0)
  const discountAmount = appliedCoupon
    ? appliedCoupon.percentOff
      ? Math.round((subtotal * appliedCoupon.percentOff) / 100)
      : Math.max(0, Math.min(appliedCoupon.flatOff, subtotal - (appliedCoupon.minUnitPrice || 0) * itemsQty))
    : 0
  const remainingAfterCoupon = subtotal + shippingFee - discountAmount
  const creditApplied =
    useStoreCredit && storeCreditBalance
      ? Math.min(storeCreditBalance, remainingAfterCoupon)
      : 0
  const total = remainingAfterCoupon - creditApplied

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleEmailBlur() {
    if (!form.email.trim()) return
    try {
      const res = await fetch(`/api/store-credit?email=${encodeURIComponent(form.email.trim())}`)
      const data = await res.json()
      setStoreCreditBalance(data.balance || null)
    } catch {
      setStoreCreditBalance(null)
    }
  }

  async function handleApplyCoupon() {
    if (!couponInput.trim()) return
    setCouponLoading(true)
    setCouponError(null)
    try {
      const res = await fetch(`/api/coupons/validate?code=${encodeURIComponent(couponInput.trim())}`)
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'That coupon code is not valid.')
      }
      setAppliedCoupon(await res.json())
    } catch (err) {
      setAppliedCoupon(null)
      setCouponError(err.message)
    } finally {
      setCouponLoading(false)
    }
  }

  function handleRemoveCoupon() {
    setAppliedCoupon(null)
    setCouponInput('')
    setCouponError(null)
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
    const data = await createRes.json()

    if (data.fullyCoveredByCredit) {
      clear()
      navigate(`/order/${data.orderId}`)
      return
    }

    const { orderId, razorpayOrderId, amount, currency, keyId } = data

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
      couponCode: appliedCoupon?.code,
      useStoreCredit,
      items: items.map((item) => ({
        productId: item.productId,
        name: item.name,
        price: item.price,
        size: item.size,
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
          <h1 className="checkout-page__title checkout-page__title--repeats-header">Checkout</h1>

          <div className="checkout-field">
            <label htmlFor="customerName">Full name</label>
            <input id="customerName" name="customerName" required value={form.customerName} onChange={handleChange} />
          </div>

          <div className="checkout-field-row">
            <div className="checkout-field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                name="email"
                required
                value={form.email}
                onChange={handleChange}
                onBlur={handleEmailBlur}
              />
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

          <div className="checkout-coupon">
            <label htmlFor="coupon">Discount code</label>
            {appliedCoupon ? (
              <div className="checkout-coupon__applied">
                <span>
                  <strong>{appliedCoupon.code}</strong> applied —{' '}
                  {appliedCoupon.percentOff ? `${appliedCoupon.percentOff}% off` : `₹${appliedCoupon.flatOff} off`}
                </span>
                <button type="button" onClick={handleRemoveCoupon}>
                  Remove
                </button>
              </div>
            ) : (
              <div className="checkout-coupon__row">
                <input
                  id="coupon"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  placeholder="e.g. WELCOME10"
                />
                <button
                  type="button"
                  className="btn"
                  onClick={handleApplyCoupon}
                  disabled={couponLoading || !couponInput.trim()}
                >
                  {couponLoading ? 'Checking…' : 'Apply'}
                </button>
              </div>
            )}
            {couponError && <p className="checkout-coupon__error">{couponError}</p>}
          </div>

          {storeCreditBalance > 0 && (
            <label className="checkout-credit">
              <input
                type="checkbox"
                checked={useStoreCredit}
                onChange={(e) => setUseStoreCredit(e.target.checked)}
              />
              Use your ₹{storeCreditBalance} store credit on this order
            </label>
          )}

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
            {submitting ? 'Processing…' : `Place order — ₹${total}`}
          </button>
        </form>

        <aside className="checkout-summary">
          <h2 className="checkout-summary__title">Order summary</h2>
          {items.map((item) => (
            <div key={item.key} className="checkout-summary__row">
              <span>
                {item.name} ({item.size}) × {item.qty}
              </span>
              <span>₹{item.price * item.qty}</span>
            </div>
          ))}
          <div className="checkout-summary__row">
            <span>Shipping</span>
            <span>{shippingFee === 0 ? 'Free' : `₹${shippingFee}`}</span>
          </div>
          {appliedCoupon && (
            <div className="checkout-summary__row">
              <span>Coupon ({appliedCoupon.code})</span>
              <span>-₹{discountAmount}</span>
            </div>
          )}
          {creditApplied > 0 && (
            <div className="checkout-summary__row">
              <span>Store credit used</span>
              <span>-₹{creditApplied}</span>
            </div>
          )}
          <div className="checkout-summary__row checkout-summary__total">
            <span>Total</span>
            <span>₹{total}</span>
          </div>
        </aside>
      </div>
    </section>
  )
}

export default Checkout
