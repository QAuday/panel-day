import { Router } from 'express'
import crypto from 'crypto'
import { prisma } from '../lib/prisma.js'
import { razorpay, razorpayConfigured } from '../lib/razorpay.js'

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
    if (!item.productId || !item.name || typeof item.price !== 'number' || !item.qty) {
      return 'Each item must include productId, name, price, and qty'
    }
  }
  return null
}

router.post('/razorpay/order', async (req, res) => {
  if (!razorpayConfigured) {
    return res.status(503).json({
      error:
        'Razorpay is not configured yet. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to server/.env.',
    })
  }

  const error = validateOrderBody(req.body)
  if (error) return res.status(400).json({ error })

  const { customerName, email, phone, address, city, state, pincode, items } = req.body
  const amountInRupees = items.reduce((sum, item) => sum + item.price * item.qty, 0)

  const order = await prisma.order.create({
    data: {
      customerName,
      email,
      phone,
      address,
      city,
      state,
      pincode,
      paymentMethod: 'razorpay',
      status: 'pending_payment',
      items: {
        create: items.map((item) => ({
          productId: item.productId,
          name: item.name,
          price: item.price,
          qty: item.qty,
        })),
      },
    },
  })

  const razorpayOrder = await razorpay.orders.create({
    amount: amountInRupees * 100, // paise
    currency: 'INR',
    receipt: order.id,
  })

  await prisma.order.update({
    where: { id: order.id },
    data: { razorpayOrderId: razorpayOrder.id },
  })

  res.status(201).json({
    orderId: order.id,
    razorpayOrderId: razorpayOrder.id,
    amount: razorpayOrder.amount,
    currency: razorpayOrder.currency,
    keyId: process.env.RAZORPAY_KEY_ID,
  })
})

router.post('/razorpay/verify', async (req, res) => {
  if (!razorpayConfigured) {
    return res.status(503).json({ error: 'Razorpay is not configured yet.' })
  }

  const { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body
  if (!orderId || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({ error: 'Missing verification fields' })
  }

  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex')

  if (expectedSignature !== razorpay_signature) {
    return res.status(400).json({ error: 'Payment signature verification failed' })
  }

  const order = await prisma.order.update({
    where: { id: orderId },
    data: { status: 'paid', razorpayPaymentId: razorpay_payment_id },
    include: { items: true },
  })

  res.json(order)
})

export default router
