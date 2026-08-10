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
}

main()
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
