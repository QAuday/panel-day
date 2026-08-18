import { useState } from 'react'
import OrderDetails from '../components/OrderDetails'
import './TrackOrder.css'

function TrackOrder() {
  const [form, setForm] = useState({ id: '', email: '' })
  const [order, setOrder] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setOrder(null)

    try {
      const params = new URLSearchParams({ id: form.id.trim(), email: form.email.trim() })
      const res = await fetch(`/api/orders/lookup?${params}`)
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Could not find that order')
      }
      setOrder(await res.json())
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="track-page">
      <div className="container track-page__inner">
        <span className="eyebrow">Track Order</span>
        <h1 className="track-page__title">Where&rsquo;s my order?</h1>
        <p className="track-page__subtitle">
          Enter your order ID (from your confirmation page or email) along with the
          email you used at checkout.
        </p>

        <form className="track-form" onSubmit={handleSubmit}>
          <div className="track-form__field">
            <label htmlFor="id">Order ID</label>
            <input id="id" name="id" required value={form.id} onChange={handleChange} />
          </div>
          <div className="track-form__field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={form.email}
              onChange={handleChange}
            />
          </div>
          <button type="submit" className="btn btn-primary track-form__submit" disabled={loading}>
            {loading ? 'Looking up…' : 'Track order'}
          </button>
        </form>

        {error && <p className="track-page__error">{error}</p>}

        {order && (
          <div className="track-result">
            <h2 className="track-result__title">Order #{order.id}</h2>
            <OrderDetails order={order} />
          </div>
        )}
      </div>
    </section>
  )
}

export default TrackOrder
