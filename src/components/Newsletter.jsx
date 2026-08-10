import { useState } from 'react'
import { motion } from 'framer-motion'
import './Newsletter.css'

function Newsletter() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!email) return
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch('/api/subscribers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (!res.ok) throw new Error('Something went wrong — try again.')
      setSubmitted(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section id="notify" className="newsletter">
      <div className="container newsletter__inner">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="eyebrow">Launching Soon</span>
          <h2 className="newsletter__title">Be first to the drop</h2>
          <p className="newsletter__subtitle">
            Join the list for early access, restock alerts, and behind-the-scenes art.
          </p>
        </motion.div>

        {submitted ? (
          <p className="newsletter__success">
            You&rsquo;re in. We&rsquo;ll email you the moment Panel 01 drops.
          </p>
        ) : (
          <form className="newsletter__form" onSubmit={handleSubmit}>
            <input
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-label="Email address"
            />
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Joining…' : 'Notify me'}
            </button>
          </form>
        )}
        {error && <p className="newsletter__error">{error}</p>}
      </div>
    </section>
  )
}

export default Newsletter
