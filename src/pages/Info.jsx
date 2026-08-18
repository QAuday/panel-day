import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  STORE_UPI_ID,
  STORE_WHATSAPP_NUMBER,
  STORE_SHIPPING_FEE,
  STORE_FREE_SHIPPING_THRESHOLD,
} from '../config/store'
import './Info.css'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
}

const FAQS = [
  {
    q: 'How long does shipping take?',
    a: 'Orders are handed over for shipping within 2-3 business days of payment confirmation, and typically arrive within 5-7 business days depending on your location.',
  },
  {
    q: 'Can I return or exchange a tee?',
    a: 'We accept size exchanges within 7 days of delivery, as long as the tee is unworn and unwashed with tags attached. Message us on WhatsApp with your order number to start an exchange. We don’t offer refunds on made-to-order prints, only exchanges.',
  },
  {
    q: 'What if my order arrives damaged?',
    a: 'Message us on WhatsApp within 48 hours of delivery with photos of the item and packaging, and we’ll sort out a replacement at no extra cost.',
  },
  {
    q: 'How do I track my order?',
    a: 'Since orders are currently confirmed manually, we’ll send tracking details directly over WhatsApp or email once your order ships.',
  },
]

function Info() {
  return (
    <>
      <section className="info-hero">
        <div className="container">
          <motion.span
            className="eyebrow"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            Good to Know
          </motion.span>
          <motion.h1
            className="info-hero__title"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            Shipping, Returns &amp; Contact
          </motion.h1>
        </div>
      </section>

      <section className="info-section">
        <div className="container info-grid">
          <motion.div
            className="info-block"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
          >
            <h2>Shipping</h2>
            <p>
              Free shipping on orders ₹{STORE_FREE_SHIPPING_THRESHOLD} and above. Orders
              below that have a flat ₹{STORE_SHIPPING_FEE} shipping fee. Orders are
              handed over for delivery within 2-3 business days of payment confirmation,
              and typically arrive within 5-7 business days depending on your location.
              We currently ship within India only.
            </p>
          </motion.div>

          <motion.div
            className="info-block"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
          >
            <h2>Returns &amp; Exchanges</h2>
            <p>
              Since every tee is printed to order, we don&rsquo;t accept returns for a
              refund. We do offer size exchanges within 7 days of delivery, provided the
              tee is unworn, unwashed, and still has its tags. Message us on WhatsApp
              with your order number to start an exchange.
            </p>
          </motion.div>

          <motion.div
            className="info-block"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
          >
            <h2>Contact</h2>
            <p>
              Questions about an order, a design, or anything else? Reach us directly:
            </p>
            <ul className="info-contact-list">
              <li>
                WhatsApp: <strong>{STORE_WHATSAPP_NUMBER}</strong>
              </li>
              <li>
                UPI (for manual payment): <strong>{STORE_UPI_ID}</strong>
              </li>
              <li>
                Instagram:{' '}
                <a href="https://instagram.com/panelday" target="_blank" rel="noreferrer">
                  @panelday
                </a>
              </li>
            </ul>
          </motion.div>
        </div>
      </section>

      <section className="info-section info-section--faq">
        <div className="container">
          <motion.h2
            className="info-section__title"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            FAQ
          </motion.h2>

          <div className="info-faq-list">
            {FAQS.map((item, i) => (
              <motion.div
                key={item.q}
                className="info-faq-item"
                custom={i}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.3 }}
                variants={fadeUp}
              >
                <h3>{item.q}</h3>
                <p>{item.a}</p>
              </motion.div>
            ))}
          </div>

          <Link to="/shop" className="btn btn-primary info-section__cta">
            Back to shop
          </Link>
        </div>
      </section>
    </>
  )
}

export default Info
