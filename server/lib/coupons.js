import { prisma } from './prisma.js'

// Server-side coupon resolution — never trusts a client-supplied discount
// amount, so the code, its real time window, and eligibility are always
// re-checked here, not just displayed from the client's clock.
export async function resolveCoupon({ code, email, itemsSubtotal, itemsQty }) {
  if (!code) return { couponCode: null, discountAmount: 0 }

  const coupon = await prisma.coupon.findUnique({ where: { code: code.trim().toUpperCase() } })
  if (!coupon || !coupon.active) {
    throw new Error('That coupon code is not valid.')
  }

  const now = new Date()
  if (coupon.startsAt && now < coupon.startsAt) {
    throw new Error('That offer hasn\'t started yet.')
  }
  if (coupon.endsAt && now > coupon.endsAt) {
    throw new Error('That offer has ended.')
  }

  if (coupon.firstOrderOnly) {
    const priorOrder = await prisma.order.findFirst({ where: { email } })
    if (priorOrder) {
      throw new Error('That code is only valid on your first order — remove it to continue.')
    }
  }

  let discountAmount = 0
  if (coupon.percentOff) {
    discountAmount = Math.round((itemsSubtotal * coupon.percentOff) / 100)
  } else if (coupon.flatOff) {
    const floor = coupon.minUnitPrice ? coupon.minUnitPrice * itemsQty : 0
    discountAmount = Math.max(0, Math.min(coupon.flatOff, itemsSubtotal - floor))
  }

  return { couponCode: coupon.code, discountAmount }
}
