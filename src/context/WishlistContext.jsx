import { createContext, useContext, useEffect, useState } from 'react'

const WishlistContext = createContext(null)
const STORAGE_KEY = 'panelday_wishlist'

function readStoredWishlist() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function WishlistProvider({ children }) {
  const [productIds, setProductIds] = useState(readStoredWishlist)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(productIds))
  }, [productIds])

  function isWishlisted(productId) {
    return productIds.includes(productId)
  }

  function toggleWishlist(productId) {
    setProductIds((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    )
  }

  const value = { productIds, isWishlisted, toggleWishlist, count: productIds.length }

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
}

export function useWishlist() {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error('useWishlist must be used within a WishlistProvider')
  return ctx
}
