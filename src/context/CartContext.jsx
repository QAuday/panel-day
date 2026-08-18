import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const CartContext = createContext(null)
const STORAGE_KEY = 'panelday_cart'

function readStoredCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    // Drop pre-size cart entries from before sizes existed.
    return parsed.filter((item) => item.size && item.key)
  } catch {
    return []
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(readStoredCart)
  const [drawerOpen, setDrawerOpen] = useState(false)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  function addItem(product, size) {
    const key = `${product.id}::${size}`
    setItems((prev) => {
      const existing = prev.find((item) => item.key === key)
      if (existing) {
        return prev.map((item) => (item.key === key ? { ...item, qty: item.qty + 1 } : item))
      }
      return [
        ...prev,
        {
          key,
          productId: product.id,
          name: product.name,
          price: product.price,
          size,
          qty: 1,
        },
      ]
    })
  }

  function removeItem(key) {
    setItems((prev) => prev.filter((item) => item.key !== key))
  }

  function updateQty(key, qty) {
    if (qty < 1) return removeItem(key)
    setItems((prev) => prev.map((item) => (item.key === key ? { ...item, qty } : item)))
  }

  function clear() {
    setItems([])
  }

  const count = useMemo(() => items.reduce((sum, item) => sum + item.qty, 0), [items])
  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.qty, 0),
    [items]
  )

  const value = {
    items,
    addItem,
    removeItem,
    updateQty,
    clear,
    count,
    subtotal,
    drawerOpen,
    openDrawer: () => setDrawerOpen(true),
    closeDrawer: () => setDrawerOpen(false),
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within a CartProvider')
  return ctx
}
