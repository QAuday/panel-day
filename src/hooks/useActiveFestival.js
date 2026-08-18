import { useEffect, useState } from 'react'

export function useActiveFestival() {
  const [festival, setFestival] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/coupons/active')
      .then((res) => (res.ok ? res.json() : null))
      .then(setFestival)
      .catch(() => setFestival(null))
      .finally(() => setLoading(false))
  }, [])

  return { festival, loading }
}
