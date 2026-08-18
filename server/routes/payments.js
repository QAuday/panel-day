import { Router } from 'express'
import crypto from 'crypto'
import { prisma } from '../lib/prisma.js'
import { razorpay, razorpayConfigured } from '../lib/razorpay.js'
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
  const amountInRupees = remainingAfterCoupon - creditUsed

  const orderData = {
    customerName,
    email,
    phone,
    address,
    city,
    state,
    pincode,
    paymentMethod: 'razorpay',
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
  }

  // Store credit alone can cover small orders entirely — Razorpay can't take
  // a zero-amount payment, so skip it and mark the order paid directly.
  if (amountInRupees <= 0) {
    const order = await prisma.$transaction(async (tx) => {
      const created = await tx.order.create({
        data: { ...orderData, status: 'paid' },
        include: { items: true },
      })
      await deductStoreCredit(tx, email, creditUsed)
      return created
    })

    sendOrderConfirmationEmail(order)

    return res.status(201).json({ orderId: order.id, fullyCoveredByCredit: true })
  }

  const order = await prisma.$transaction(async (tx) => {
    const created = await tx.order.create({
      data: { ...orderData, status: 'pending_payment' },
    })
    await deductStoreCredit(tx, email, creditUsed)
    return created
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

  sendOrderConfirmationEmail(order)

  res.json(order)
})

export default router
