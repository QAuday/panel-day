import { useId } from 'react'
import './Logo.css'

function LogoMark({ size = 32 }) {
  const clipId = useId()

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      className="logo-mark"
      aria-hidden="true"
    >
      <defs>
        <clipPath id={clipId}>
          <rect x="4" y="4" width="56" height="56" rx="14" />
        </clipPath>
      </defs>
      <rect x="4" y="4" width="56" height="56" rx="14" fill="#000000" />
      <g clipPath={`url(#${clipId})`}>
        <circle cx="32" cy="33" r="14" fill="#dc2626" />
        <rect x="0" y="41" width="64" height="23" fill="#000000" />
      </g>
    </svg>
  )
}

function Logo({ size = 32, withWordmark = true, className = '' }) {
  return (
    <span className={`logo ${className}`}>
      <LogoMark size={size} />
      {withWordmark && <span className="logo__word">Panel Day</span>}
    </span>
  )
}

export default Logo
export { LogoMark }
