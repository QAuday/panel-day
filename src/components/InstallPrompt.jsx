import { useEffect, useState } from 'react'
import './InstallPrompt.css'

const DISMISSED_KEY = 'panelday_install_dismissed'

function InstallPrompt() {
  const [deferredEvent, setDeferredEvent] = useState(null)

  useEffect(() => {
    if (localStorage.getItem(DISMISSED_KEY)) return

    function handleBeforeInstall(e) {
      e.preventDefault()
      setDeferredEvent(e)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstall)
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall)
  }, [])

  function dismiss() {
    localStorage.setItem(DISMISSED_KEY, '1')
    setDeferredEvent(null)
  }

  async function install() {
    if (!deferredEvent) return
    deferredEvent.prompt()
    await deferredEvent.userChoice
    dismiss()
  }

  if (!deferredEvent) return null

  return (
    <div className="install-prompt" role="dialog" aria-label="Install Panel Day">
      <div className="install-prompt__text">
        <span className="eyebrow">Get the app</span>
        <p>Install Panel Day for faster access and a full-screen shopping view.</p>
      </div>
      <div className="install-prompt__actions">
        <button type="button" className="install-prompt__dismiss" onClick={dismiss}>
          Not now
        </button>
        <button type="button" className="btn btn-primary install-prompt__install" onClick={install}>
          Install
        </button>
      </div>
    </div>
  )
}

export default InstallPrompt
