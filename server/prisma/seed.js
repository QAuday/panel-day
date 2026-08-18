import { PrismaClient } from '@prisma/client'
import { PRODUCTS } from '../../src/data/products.js'

const prisma = new PrismaClient()

async function main() {
  for (const product of PRODUCTS) {
    await prisma.product.upsert({
      where: { id: product.id },
      update: product,
      create: product,
    })
  }
  console.log(`Seeded ${PRODUCTS.length} products.`)

  await prisma.coupon.upsert({
    where: { code: 'WELCOME10' },
    update: {},
    create: { code: 'WELCOME10', percentOff: 10, active: true, firstOrderOnly: true },
  })
  console.log('Seeded WELCOME10 coupon.')

  // Festival sale calendar — flat ₹50 off, each running from 2 weeks before
  // its festival through the festival itself. minUnitPrice: 349 means the
  // ₹50 never drags any order below an average ₹349-per-item price.
  const FESTIVAL_COUPONS = [
    { code: 'RAKHI50', label: 'Raksha Bandhan Sale', startsAt: '2026-08-14T00:00:00', endsAt: '2026-08-28T23:59:59' },
    { code: 'GANESH50', label: 'Ganesh Chaturthi Sale', startsAt: '2026-08-31T00:00:00', endsAt: '2026-09-25T23:59:59' },
    { code: 'NAVRATRI50', label: 'Navratri & Dussehra Sale', startsAt: '2026-09-27T00:00:00', endsAt: '2026-10-20T23:59:59' },
    { code: 'DIWALI50', label: 'Diwali Sale', startsAt: '2026-10-23T00:00:00', endsAt: '2026-11-08T23:59:59' },
    { code: 'HOLIDAY50', label: 'Holiday Season Sale', startsAt: '2026-12-11T00:00:00', endsAt: '2027-01-01T23:59:59' },
    { code: 'REPUBLIC50', label: 'Republic Day Sale', startsAt: '2027-01-12T00:00:00', endsAt: '2027-01-26T23:59:59' },
    { code: 'HOLI50', label: 'Holi Sale', startsAt: '2027-03-09T00:00:00', endsAt: '2027-03-23T23:59:59' },
    { code: 'INDEPENDENCE50', label: 'Independence Day Sale', startsAt: '2027-08-01T00:00:00', endsAt: '2027-08-15T23:59:59' },
  ]

  for (const festival of FESTIVAL_COUPONS) {
    const data = {
      code: festival.code,
      label: festival.label,
      flatOff: 50,
      minUnitPrice: 349,
      active: true,
      firstOrderOnly: false,
      startsAt: new Date(festival.startsAt),
      endsAt: new Date(festival.endsAt),
    }
    await prisma.coupon.upsert({
      where: { code: festival.code },
      update: data,
      create: data,
    })
  }
  console.log(`Seeded ${FESTIVAL_COUPONS.length} festival coupons.`)
}

main()
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
