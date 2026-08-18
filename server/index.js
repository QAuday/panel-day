import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import productsRouter from './routes/products.js'
import subscribersRouter from './routes/subscribers.js'
import ordersRouter from './routes/orders.js'
import paymentsRouter from './routes/payments.js'
import couponsRouter from './routes/coupons.js'
import storeCreditRouter from './routes/storeCredit.js'

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/products', productsRouter)
app.use('/api/subscribers', subscribersRouter)
app.use('/api/orders', ordersRouter)
app.use('/api/payments', paymentsRouter)
app.use('/api/coupons', couponsRouter)
app.use('/api/store-credit', storeCreditRouter)

app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).json({ error: 'Internal server error' })
})

const PORT = process.env.PORT || 4000
app.listen(PORT, () => {
  console.log(`Panel Day API listening on http://localhost:${PORT}`)
})
