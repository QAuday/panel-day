import { prisma } from './prisma.js'

// Applies as much of the customer's existing store credit balance as the
// order total allows. Balances are only ever set by you via Prisma Studio —
// this never accepts a customer-supplied amount, only a request to use it.
export async function resolveStoreCredit({ email, useCredit, remainingTotal }) {
  if (!useCredit || remainingTotal <= 0) return { creditUsed: 0 }

  const account = await prisma.storeCredit.findUnique({
    where: { email: email.trim().toLowerCase() },
  })
  if (!account || account.balance <= 0) return { creditUsed: 0 }

  const creditUsed = Math.min(account.balance, remainingTotal)
  return { creditUsed }
}

export async function deductStoreCredit(tx, email, amount) {
  if (amount <= 0) return
  await tx.storeCredit.update({
    where: { email: email.trim().toLowerCase() },
    data: { balance: { decrement: amount } },
  })
}
