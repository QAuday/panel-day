import { Router } from 'express'
import { prisma } from '../lib/prisma.js'
import { sendOrderConfirmationEmail } from '../lib/email.js'
import { resolveCoupon } from '../lib/coupons.js'
import { resolveStoreCredit, deductStoreCredit } from '../lib/storeCredit.js'
import { calculateShippingFee } from '../lib/shipping.js'

const router = Router()

const REQUIRED_FIELDS = [
  'customerName',
  'email',
  'phone',
  'address',
  'city',
  'state',
  'pincode',
]

function validateOrderBody(body) {
  for (const field of REQUIRED_FIELDS) {
    if (!body[field] || typeof body[field] !== 'string') {
      return `Missing required field: ${field}`
    }
  }
  if (!Array.isArray(body.items) || body.items.length === 0) {
    return 'Order must include at least one item'
  }
  for (const item of body.items) {
    if (!item.productId || !item.name || typeof item.price !== 'number' || !item.qty || !item.size) {
      return 'Each item must include productId, name, price, size, and qty'
    }
  }
  return null
}

// Manual (COD/UPI) order flow — created directly as pending_payment.
router.post('/', async (req, res) => {
  const error = validateOrderBody(req.body)
  if (error) return res.status(400).json({ error })

  const { customerName, email, phone, address, city, state, pincode, items } = req.body
  const itemsSubtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0)
  const itemsQty = items.reduce((sum, item) => sum + item.qty, 0)
  const shippingFee = calculateShippingFee(itemsSubtotal)

  let coupon
  try {
    coupon = await resolveCoupon({ code: req.body.couponCode, email, itemsSubtotal, itemsQty })
  } catch (err) {
    return res.status(400).json({ error: err.message })
  }

  const remainingAfterCoupon = itemsSubtotal + shippingFee - coupon.discountAmount
  const { creditUsed } = await resolveStoreCredit({
    email,
    useCredit: Boolean(req.body.useStoreCredit),
    remainingTotal: remainingAfterCoupon,
  })

  // Store credit can cover a manual order entirely — nothing left to collect.
  const status = remainingAfterCoupon - creditUsed <= 0 ? 'paid' : 'pending_payment'

  const order = await prisma.$transaction(async (tx) => {
    const created = await tx.order.create({
      data: {
        customerName,
        email,
        phone,
        address,
        city,
        state,
        pincode,
        paymentMethod: 'manual',
        status,
        shippingFee,
        couponCode: coupon.couponCode,
        discountAmount: coupon.discountAmount,
        storeCreditUsed: creditUsed,
        items: {
          create: items.map((item) => ({
            productId: item.productId,
            name: item.name,
            price: item.price,
            size: item.size,
            qty: item.qty,
          })),
        },
      },
      include: { items: true },
    })
    await deductStoreCredit(tx, email, creditUsed)
    return created
  })

  sendOrderConfirmationEmail(order)

  res.status(201).json(order)
})

// Customer-facing order tracking — requires the order id AND the email it was
// placed under, so an order id alone (even if guessed) isn't enough to view it.
router.get('/lookup', async (req, res) => {
  const { id, email } = req.query
  if (!id || !email || typeof id !== 'string' || typeof email !== 'string') {
    return res.status(400).json({ error: 'Order ID and email are required' })
  }

  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  })

  if (!order || order.email.toLowerCase() !== email.trim().toLowerCase()) {
    return res.status(404).json({ error: 'No order found with that ID and email' })
  }

  res.json(order)
})

router.get('/:id', async (req, res) => {
  const order = await prisma.order.findUnique({
    where: { id: req.params.id },
    include: { items: true },
  })
  if (!order) return res.status(404).json({ error: 'Order not found' })
  res.json(order)
})

export default router
