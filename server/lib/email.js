const RESEND_API_KEY = process.env.RESEND_API_KEY
const FROM_EMAIL = process.env.STORE_FROM_EMAIL || 'Panel Day <onboarding@resend.dev>'

export const emailConfigured = Boolean(RESEND_API_KEY)

// Best-effort order confirmation email. Never throws — a missing/invalid key
// or a Resend outage should never block an order from completing.
export async function sendOrderConfirmationEmail(order) {
  if (!emailConfigured) return

  const itemLines = order.items
    .map((item) => `- ${item.name} (${item.size}) x${item.qty} — ₹${item.price * item.qty}`)
    .join('\n')

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: order.email,
        subject: `Panel Day — Order confirmed (#${order.id})`,
        text: `Thanks, ${order.customerName}!\n\nYour order is confirmed:\n\n${itemLines}\n\nShipping: ${order.shippingFee === 0 ? 'Free' : `₹${order.shippingFee}`}\n\nWe'll be in touch with delivery updates.`,
      }),
    })
    if (!res.ok) {
      console.warn('Order confirmation email failed:', await res.text())
    }
  } catch (err) {
    console.warn('Order confirmation email failed:', err.message)
  }
}
