import { useEffect, useState } from 'react'
import { useActiveFestival } from '../hooks/useActiveFestival'
import './FestivalBanner.css'

function formatCountdown(ms) {
  if (ms <= 0) return 'Ending now'
  const totalSeconds = Math.floor(ms / 1000)
  const days = Math.floor(totalSeconds / 86400)
  const hours = Math.floor((totalSeconds % 86400) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  if (days > 0) return `${days}d ${hours}h ${minutes}m left`
  if (hours > 0) return `${hours}h ${minutes}m ${seconds}s left`
  return `${minutes}m ${seconds}s left`
}

function FestivalBanner() {
  const { festival } = useActiveFestival()
  const [dismissed, setDismissed] = useState(false)
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    if (!festival) return
    const interval = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(interval)
  }, [festival])

  useEffect(() => {
    if (festival && sessionStorage.getItem(`festival-dismissed-${festival.code}`)) {
      setDismissed(true)
    }
  }, [festival])

  if (!festival || dismissed) return null

  const discountText = festival.flatOff ? `₹${festival.flatOff} off` : `${festival.percentOff}% off`
  const countdown = formatCountdown(new Date(festival.endsAt).getTime() - now)
  const message = `🎉 ${festival.label} — ${discountText} with code ${festival.code} — ${countdown} 🎉`

  function handleDismiss() {
    sessionStorage.setItem(`festival-dismissed-${festival.code}`, '1')
    setDismissed(true)
  }

  return (
    <div className="festival-banner" role="status">
      <div className="festival-banner__track">
        <div className="festival-banner__marquee">
          {[0, 1].map((i) => (
            <span className="festival-banner__message" key={i} aria-hidden={i === 1}>
              {message}
            </span>
          ))}
        </div>
      </div>
      <button
        type="button"
        className="festival-banner__dismiss"
        onClick={handleDismiss}
        aria-label="Dismiss offer banner"
      >
        ×
      </button>
    </div>
  )
}

export default FestivalBanner
