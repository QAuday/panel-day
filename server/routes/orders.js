import { Router } from 'express'
import { prisma } from '../lib/prisma.js'

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

// Manual (COD/UPI) order flow — created directly as pending_payment.
router.post('/', async (req, res) => {
  const error = validateOrderBody(req.body)
  if (error) return res.status(400).json({ error })

  const { customerName, email, phone, address, city, state, pincode, items } = req.body

  const order = await prisma.order.create({
    data: {
      customerName,
      email,
      phone,
      address,
      city,
      state,
      pincode,
      paymentMethod: 'manual',
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
    include: { items: true },
  })

  res.status(201).json(order)
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
