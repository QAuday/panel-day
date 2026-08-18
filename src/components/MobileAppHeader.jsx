import { useNavigate, useLocation } from 'react-router-dom'
import Logo from './Logo'
import FestivalBanner from './FestivalBanner'
import { getRouteMeta } from '../config/appShell'
import './MobileAppHeader.css'

function BackIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 5 8 12l7 7" />
    </svg>
  )
}

function MobileAppHeader() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const meta = getRouteMeta(pathname)

  return (
    <div className="mobile-app-header">
      {meta.mode === 'brand' ? (
        <>
          <FestivalBanner />
          <div className="mobile-app-header__bar">
            <Logo size={26} />
          </div>
        </>
      ) : (
        <div className="mobile-app-header__bar mobile-app-header__bar--back">
          <button
            type="button"
            className="mobile-app-header__back"
            onClick={() => navigate(meta.backTo ?? -1)}
            aria-label="Back"
          >
            <BackIcon />
          </button>
          {meta.title ? (
            <span className="mobile-app-header__title">{meta.title}</span>
          ) : (
            <Logo size={22} withWordmark={false} />
          )}
        </div>
      )}
    </div>
  )
}

export default MobileAppHeader
