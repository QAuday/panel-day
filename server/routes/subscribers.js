import { Router } from 'express'
import { prisma } from '../lib/prisma.js'

const router = Router()

router.post('/', async (req, res) => {
  const { email } = req.body
  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return res.status(400).json({ error: 'A valid email is required' })
  }

  try {
    await prisma.subscriber.create({ data: { email } })
  } catch (err) {
    if (err.code !== 'P2002') throw err // ignore "already subscribed"
  }

  res.status(201).json({ ok: true })
})

export default router
