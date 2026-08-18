import { Router } from 'express'
import { prisma } from '../lib/prisma.js'

const router = Router()

router.get('/', async (req, res) => {
  const { email } = req.query
  if (!email || typeof email !== 'string') {
    return res.status(400).json({ error: 'Email is required' })
  }

  const account = await prisma.storeCredit.findUnique({
    where: { email: email.trim().toLowerCase() },
  })

  res.json({ balance: account?.balance || 0 })
})

export default router
