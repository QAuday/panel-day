import { Router } from 'express'
import { prisma } from '../lib/prisma.js'

const router = Router()

// Lightweight preview used by the checkout form's "Apply" button. First-order
// eligibility (and the exact discount amount, for flat coupons with a floor)
// is re-checked for real at order submission.
router.get('/validate', async (req, res) => {
  const { code } = req.query
  if (!code || typeof code !== 'string') {
    return res.status(400).json({ error: 'Coupon code is required' })
  }

  const coupon = await prisma.coupon.findUnique({ where: { code: code.trim().toUpperCase() } })
  if (!coupon || !coupon.active) {
    return res.status(404).json({ error: 'That coupon code is not valid.' })
  }

  const now = new Date()
  if (coupon.startsAt && now < coupon.startsAt) {
    return res.status(404).json({ error: 'That offer hasn\'t started yet.' })
  }
  if (coupon.endsAt && now > coupon.endsAt) {
    return res.status(404).json({ error: 'That offer has ended.' })
  }

  res.json({
    code: coupon.code,
    percentOff: coupon.percentOff,
    flatOff: coupon.flatOff,
    minUnitPrice: coupon.minUnitPrice,
  })
})

// Powers the sitewide festival banner — returns whichever time-boxed coupon
// is genuinely active right now (same answer for every visitor, no per-
// session reset), or null if nothing's running.
router.get('/active', async (req, res) => {
  const now = new Date()
  const coupon = await prisma.coupon.findFirst({
    where: {
      active: true,
      startsAt: { lte: now },
      endsAt: { gte: now },
    },
    orderBy: { endsAt: 'asc' },
  })

  if (!coupon) return res.json(null)

  res.json({
    code: coupon.code,
    label: coupon.label,
    percentOff: coupon.percentOff,
    flatOff: coupon.flatOff,
    endsAt: coupon.endsAt,
  })
})

export default router
